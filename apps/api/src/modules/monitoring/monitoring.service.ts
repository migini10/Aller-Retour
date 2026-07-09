import { Injectable, Logger } from '@nestjs/common';
import { prisma } from '@aller-retour/database';

export interface AlertItem {
  type: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  reference: string;
  occurredAt: Date;
}

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);

  // Masquage PII
  private maskEmail(email?: string | null): string {
    if (!email || !email.includes('@')) return '***';
    const [name, domain] = email.split('@');
    if (name.length <= 1) return `*@${domain}`;
    return `${name[0]}***@${domain}`;
  }

  // Formatage de l'uptime
  private formatUptime(seconds: number): string {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(' ');
  }

  async getHealth() {
    let dbStatus = 'OFFLINE';
    try {
      // Requête ultra-légère sans $queryRawUnsafe
      const result = await prisma.$queryRaw`SELECT 1`;
      if (result) {
        dbStatus = 'ONLINE';
      }
    } catch (error) {
      this.logger.error('DB Health check failed', error);
    }

    const uptimeSeconds = process.uptime();
    const memory = process.memoryUsage();

    return {
      apiStatus: 'ONLINE',
      dbStatus,
      uptimeSeconds,
      uptimeFormatted: this.formatUptime(uptimeSeconds),
      memoryUsedMb: Math.round(memory.heapUsed / 1024 / 1024 * 100) / 100,
      memoryTotalMb: Math.round(memory.heapTotal / 1024 / 1024 * 100) / 100,
      version: '1.0.0', // Devrait être lu depuis le package.json ou process.env
      environment: process.env.NODE_ENV || 'development',
      checkedAt: new Date().toISOString()
    };
  }

  async getAlerts() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 1. Transactions échouées
    const failedPayments = await prisma.paymentTransaction.findMany({
      where: {
        status: 'FAILED',
        createdAt: { gte: sevenDaysAgo }
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // 2. Notifications échouées
    const failedNotifications = await prisma.notification.findMany({
      where: {
        status: 'FAILED',
        createdAt: { gte: sevenDaysAgo }
      },
      include: {
        recipient: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // 3. Gains chauffeurs en attente (depuis plus de 24h idéalement, mais on prend tous les PENDING ici et on trie par les plus vieux)
    const pendingEarningsCount = await prisma.driverEarning.count({
      where: { status: 'PENDING' }
    });

    const oldestPendingEarnings = await prisma.driverEarning.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'asc' }, // Les plus vieux en premier
      take: 5,
    });

    const failedPaymentsCount = await prisma.paymentTransaction.count({
      where: {
        status: 'FAILED',
        createdAt: { gte: sevenDaysAgo }
      }
    });

    const failedNotificationsCount = await prisma.notification.count({
      where: {
        status: 'FAILED',
        createdAt: { gte: sevenDaysAgo }
      }
    });

    const items: AlertItem[] = [];

    failedPayments.forEach(p => {
      items.push({
        type: 'PAYMENT_FAILED',
        severity: 'HIGH',
        message: `Paiement ${p.method} échoué (${p.amount} FCFA)`,
        reference: p.id,
        occurredAt: p.createdAt
      });
    });

    failedNotifications.forEach(n => {
      // Masquer l'email du destinataire s'il existe
      const recipientMasked = n.recipient?.email ? this.maskEmail(n.recipient.email) : 'Inconnu';
      items.push({
        type: 'NOTIFICATION_FAILED',
        severity: 'MEDIUM',
        message: `Échec notification (${n.type}) à ${recipientMasked}. Erreur: ${n.errorMessage || 'N/A'}`,
        reference: n.id,
        occurredAt: n.createdAt
      });
    });

    oldestPendingEarnings.forEach(e => {
      items.push({
        type: 'EARNING_PENDING',
        severity: 'LOW',
        message: `Gain de ${e.driverCut} FCFA en attente de paiement depuis longtemps`,
        reference: e.id,
        occurredAt: e.createdAt
      });
    });

    // Trier les items par date (les plus récents en premier)
    items.sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime());

    return {
      summary: {
        failedPayments7d: failedPaymentsCount,
        failedNotifications7d: failedNotificationsCount,
        pendingDriverEarnings: pendingEarningsCount,
      },
      items: items.slice(0, 20) // Limiter à 20
    };
  }
}

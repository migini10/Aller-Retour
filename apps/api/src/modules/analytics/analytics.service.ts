import { Injectable } from '@nestjs/common';
import { prisma, Prisma } from '@aller-retour/database';
import { DashboardAnalyticsDto, TimelineEventDto, AlertDto, TrendDto } from './dto/dashboard-analytics.dto';

@Injectable()
export class AnalyticsService {
  async getDashboardAnalytics(): Promise<DashboardAnalyticsDto> {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const endOfToday = new Date(today);
    endOfToday.setUTCHours(23, 59, 59, 999);

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);

    // 1. KPIs Globaux
    const [
      totalUsers,
      newUsersToday,
      activeDrivers,
      totalTrips,
      tripsToday,
      bookingsToday,
      cancelledBookings,
      paymentSummary,
      earningSummary,
      ratingSummary,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: today, lte: endOfToday } } }),
      prisma.driverProfile.count({ where: { kycStatus: 'VERIFIED' } }),
      prisma.trip.count(),
      prisma.trip.count({ where: { departureTime: { gte: today, lte: endOfToday } } }),
      prisma.booking.count({ where: { createdAt: { gte: today, lte: endOfToday } } }),
      prisma.booking.count({ where: { status: 'CANCELLED' } }),
      prisma.paymentTransaction.groupBy({
        by: ['status'],
        _count: { id: true },
        _sum: { amount: true },
      }),
      prisma.driverEarning.groupBy({
        by: ['status'],
        _sum: { driverCut: true, platformCommission: true },
      }),
      prisma.driverProfile.aggregate({ _avg: { rating: true } })
    ]);

    let successfulPayments = 0;
    let failedPayments = 0;
    let pendingPayments = 0;
    let totalRevenue = 0;

    for (const p of paymentSummary) {
      if (p.status === 'SUCCESS') {
        successfulPayments = p._count.id;
        totalRevenue = p._sum.amount || 0;
      } else if (p.status === 'FAILED') {
        failedPayments = p._count.id;
      } else if (p.status === 'PENDING') {
        pendingPayments = p._count.id;
      }
    }

    let pendingDriverEarnings = 0;
    let totalPlatformFees = 0;

    for (const e of earningSummary) {
      if (e.status === 'PENDING') {
        pendingDriverEarnings += e._sum.driverCut || 0;
      }
      totalPlatformFees += e._sum.platformCommission || 0;
    }

    // 2. Trends (30 Days)
    const bookingsTrendRaw = await prisma.$queryRaw<any[]>`
      SELECT DATE_TRUNC('day', "createdAt") as date, count(id)::int as count
      FROM bookings
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE_TRUNC('day', "createdAt")
    `;

    const revenueTrendRaw = await prisma.$queryRaw<any[]>`
      SELECT DATE_TRUNC('day', "createdAt") as date, SUM(amount) as total
      FROM payment_transactions
      WHERE "createdAt" >= ${thirtyDaysAgo} AND status = 'SUCCESS'
      GROUP BY DATE_TRUNC('day', "createdAt")
    `;

    const feesTrendRaw = await prisma.$queryRaw<any[]>`
      SELECT DATE_TRUNC('day', "createdAt") as date, SUM("platformCommission") as total
      FROM driver_earnings
      WHERE "createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE_TRUNC('day', "createdAt")
    `;

    // Map trends to a continuous 30-day array
    const trendsMap = new Map<string, TrendDto>();
    for (let i = 0; i <= 30; i++) {
      const d = new Date(thirtyDaysAgo);
      d.setUTCDate(d.getUTCDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      trendsMap.set(dateStr, { date: dateStr, bookings: 0, revenue: 0, platformFees: 0 });
    }

    for (const row of bookingsTrendRaw) {
      const dateStr = new Date(row.date).toISOString().split('T')[0];
      if (trendsMap.has(dateStr)) trendsMap.get(dateStr)!.bookings = row.count;
    }

    for (const row of revenueTrendRaw) {
      const dateStr = new Date(row.date).toISOString().split('T')[0];
      if (trendsMap.has(dateStr)) trendsMap.get(dateStr)!.revenue = row.total || 0;
    }

    for (const row of feesTrendRaw) {
      const dateStr = new Date(row.date).toISOString().split('T')[0];
      if (trendsMap.has(dateStr)) trendsMap.get(dateStr)!.platformFees = row.total || 0;
    }

    const trends = Array.from(trendsMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    // 3. Top 5 Drivers
    const topEarnings = await prisma.driverEarning.groupBy({
      by: ['driverId'],
      _sum: { driverCut: true },
      orderBy: { _sum: { driverCut: 'desc' } },
      take: 5,
    });

    const topDrivers = [];
    if (topEarnings.length > 0) {
      const driverIds = topEarnings.map((e) => e.driverId);
      const users = await prisma.user.findMany({
        where: { id: { in: driverIds } },
        include: { driverProfile: true },
      });
      const userMap = new Map(users.map((u) => [u.id, u]));

      for (const earning of topEarnings) {
        const user = userMap.get(earning.driverId);
        if (user) {
          topDrivers.push({
            driverId: user.id,
            name: user.fullName,
            totalEarnings: earning._sum.driverCut || 0,
            completedTrips: user.driverProfile?.totalTrips || 0,
            rating: user.driverProfile?.rating || 0,
          });
        }
      }
    }

    // 4. Activity by City
    const cityActivityRaw = await prisma.$queryRaw<any[]>`
      SELECT 
        s.city as city,
        COUNT(b.id)::int as bookings,
        SUM(b."amountPaid") as revenue
      FROM bookings b
      JOIN trips t ON b."tripId" = t.id
      JOIN routes r ON t."routeId" = r.id
      JOIN stations s ON r."originStationId" = s.id
      WHERE b.status != 'CANCELLED'
      GROUP BY s.city
      ORDER BY bookings DESC
      LIMIT 10
    `;

    const cityTripsRaw = await prisma.$queryRaw<any[]>`
      SELECT 
        s.city as city,
        COUNT(t.id)::int as trips
      FROM trips t
      JOIN routes r ON t."routeId" = r.id
      JOIN stations s ON r."originStationId" = s.id
      GROUP BY s.city
    `;
    const tripMap = new Map(cityTripsRaw.map(t => [t.city, t.trips]));

    const cityActivity = cityActivityRaw.map(row => ({
      city: row.city,
      bookings: row.bookings || 0,
      revenue: row.revenue || 0,
      trips: tripMap.get(row.city) || 0,
    }));

    // 5. Timeline (On-the-fly)
    const timeline: TimelineEventDto[] = [];
    const recentUsers = await prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5 });
    for (const u of recentUsers) {
      timeline.push({ id: `user_${u.id}`, type: 'DriverRegistered', title: 'Nouvel Utilisateur', description: `${u.fullName} s'est inscrit.`, createdAt: u.createdAt });
    }

    const recentBookings = await prisma.booking.findMany({ include: { trip: { include: { route: { include: { originStation: true, destinationStation: true } } } }, user: true }, orderBy: { createdAt: 'desc' }, take: 5 });
    for (const b of recentBookings) {
      const origin = b.trip.route.originStation.city;
      const dest = b.trip.route.destinationStation.city;
      timeline.push({ id: `booking_${b.id}`, type: 'BookingCreated', title: 'Nouvelle réservation', description: `${b.user.fullName} a réservé ${origin} - ${dest}`, createdAt: b.createdAt });
    }

    const recentPayments = await prisma.paymentTransaction.findMany({ include: { booking: { include: { trip: true } } }, orderBy: { createdAt: 'desc' }, take: 5 });
    for (const p of recentPayments) {
      if (p.status === 'SUCCESS') {
        timeline.push({ id: `pay_${p.id}`, type: 'PaymentSuccess', title: 'Paiement réussi', description: `${p.method} : ${p.amount} FCFA reçu`, createdAt: p.createdAt });
      }
    }

    const recentTrips = await prisma.trip.findMany({ include: { driver: { include: { user: true } }, route: { include: { originStation: true, destinationStation: true } } }, orderBy: { createdAt: 'desc' }, take: 5 });
    for (const t of recentTrips) {
      const origin = t.route.originStation.city;
      const dest = t.route.destinationStation.city;
      timeline.push({ id: `trip_${t.id}`, type: 'TripPublished', title: 'Trajet publié', description: `${t.driver?.user?.fullName || 'Chauffeur'} a publié ${origin} - ${dest}`, createdAt: t.createdAt });
    }

    timeline.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const topTimeline = timeline.slice(0, 20);

    // 6. Alerts
    const alerts: AlertDto[] = [];
    const recentFailedPayments = await prisma.paymentTransaction.count({
      where: { status: 'FAILED', createdAt: { gte: new Date(Date.now() - 12 * 60 * 60 * 1000) } } // last 12 hours
    });
    if (recentFailedPayments > 0) {
      alerts.push({ id: 'alert_failed_payments', type: 'error', title: 'Paiements échoués', message: `${recentFailedPayments} transactions ont échoué lors des dernières 12 heures.` });
    }

    const oldPendingEarnings = await prisma.driverEarning.count({
      where: { status: 'PENDING', createdAt: { lte: new Date(Date.now() - 48 * 60 * 60 * 1000) } } // older than 48 hours
    });
    if (oldPendingEarnings > 0) {
      alerts.push({ id: 'alert_pending_earnings', type: 'warning', title: 'Gains en attente', message: `${oldPendingEarnings} revenus chauffeurs sont en attente depuis plus de 48 heures.` });
    }

    const pendingKyc = await prisma.driverProfile.count({
      where: { kycStatus: 'PENDING' }
    });
    if (pendingKyc > 0) {
      alerts.push({ id: 'alert_pending_kyc', type: 'info', title: 'KYC en attente', message: `${pendingKyc} profils chauffeurs attendent une validation KYC.` });
    }

    return {
      kpis: {
        totalUsers,
        newUsersToday,
        activeDrivers,
        totalTrips,
        tripsToday,
        bookingsToday,
        cancelledBookings,
        successfulPayments,
        failedPayments,
        pendingPayments,
        totalRevenue,
        totalPlatformFees,
        pendingDriverEarnings,
        averageRating: ratingSummary._avg.rating || 0,
      },
      trends,
      topDrivers,
      cityActivity,
      timeline: topTimeline,
      alerts,
    };
  }
}

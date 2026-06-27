import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { prisma, TransactionType } from '@aller-retour/database';
import { TaxEngine } from './tax.engine';
import { CommissionEngine } from './commission.engine';

@Injectable()
export class PaymentSettlementEngine {
  constructor(
    private readonly taxEngine: TaxEngine,
    private readonly commissionEngine: CommissionEngine,
  ) {}

  async settleTripTicket(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        trip: { include: { company: true, route: { include: { originStation: true } } } },
        user: true,
      },
    });

    if (!booking) throw new NotFoundException("Billet introuvable.");
    if (booking.status !== 'BOARDED') {
      throw new BadRequestException("Le billet doit être scanné en gare (Statut BOARDED) avant déclenchement du règlement financier.");
    }

    const grossAmount = booking.amountPaid;
    const isMarketplace = booking.trip.isMarketplace;
    const countryCode = booking.trip.route.originStation.country;

    // 1. Calcul des composantes via les moteurs financiers
    const taxBreakdown = this.taxEngine.calculateTaxes(grossAmount, countryCode);
    const commBreakdown = this.commissionEngine.calculateCommission(grossAmount, isMarketplace);

    const netCarrierRevenue = grossAmount - taxBreakdown.totalTax - commBreakdown.platformFee - commBreakdown.paymentGatewayFee;

    if (netCarrierRevenue < 0) {
      throw new BadRequestException("Erreur critique de décompte: Revenu net négatif.");
    }

    // 2. Recherche ou création des Wallets cibles
    const escrowWallet = await this.getOrCreateWallet('ESCROW_WALLET');
    const platformWallet = await this.getOrCreateWallet('PLATFORM_TREASURY');
    const gouvWallet = await this.getOrCreateWallet('GOVERNMENT_TAX_WALLET');
    const gatewayWallet = await this.getOrCreateWallet('PAYMENT_GATEWAY_WALLET');

    let carrierWallet;
    if (isMarketplace) {
      carrierWallet = await prisma.wallet.findFirst({ where: { userId: booking.trip.driverId, type: 'DRIVER_WALLET' } });
      if (!carrierWallet) carrierWallet = await prisma.wallet.create({ data: { type: 'DRIVER_WALLET', userId: booking.trip.driverId, currency: 'XOF' } });
    } else {
      carrierWallet = await prisma.wallet.findFirst({ where: { companyId: booking.trip.companyId, type: 'COMPANY_WALLET' } });
      if (!carrierWallet) carrierWallet = await prisma.wallet.create({ data: { type: 'COMPANY_WALLET', companyId: booking.trip.companyId, currency: 'XOF' } });
    }

    // 3. Exécution de la transaction de répartition atomique
    await prisma.$transaction(async (tx: any) => {
      // Débit du compte Escrow
      await tx.wallet.update({ where: { id: escrowWallet.id }, data: { balance: { decrement: grossAmount } } });

      // Crédit du compte Taxes d'État
      await tx.wallet.update({ where: { id: gouvWallet.id }, data: { balance: { increment: taxBreakdown.totalTax } } });
      await tx.transaction.create({
        data: { type: TransactionType.TAX_DEDUCTION, amount: taxBreakdown.totalTax, description: `Taxes État (${countryCode}) - Billet #${booking.id}`, sourceWalletId: escrowWallet.id, targetWalletId: gouvWallet.id, status: 'SUCCESS' }
      });

      // Crédit des Frais de Passerelle Mobile Money
      if (commBreakdown.paymentGatewayFee > 0) {
        await tx.wallet.update({ where: { id: gatewayWallet.id }, data: { balance: { increment: commBreakdown.paymentGatewayFee } } });
        await tx.transaction.create({
          data: { type: TransactionType.COMMISSION_FEE, amount: commBreakdown.paymentGatewayFee, description: `Frais Mobile Money - Billet #${booking.id}`, sourceWalletId: escrowWallet.id, targetWalletId: gatewayWallet.id, status: 'SUCCESS' }
        });
      }

      // Crédit de la Commission Plateforme Aller-Retour
      await tx.wallet.update({ where: { id: platformWallet.id }, data: { balance: { increment: commBreakdown.platformFee } } });
      await tx.transaction.create({
        data: { type: TransactionType.COMMISSION_FEE, amount: commBreakdown.platformFee, description: `Commission SaaS Aller-Retour (${commBreakdown.rateApplied * 100}%) - Billet #${booking.id}`, sourceWalletId: escrowWallet.id, targetWalletId: platformWallet.id, status: 'SUCCESS' }
      });

      // Crédit du Revenu Net Transporteur / Chauffeur
      await tx.wallet.update({ where: { id: carrierWallet.id }, data: { balance: { increment: netCarrierRevenue } } });
      await tx.transaction.create({
        data: { type: TransactionType.ESCROW_RELEASE, amount: netCarrierRevenue, description: `Revenu Net Transporteur - Billet #${booking.id}`, sourceWalletId: escrowWallet.id, targetWalletId: carrierWallet.id, status: 'SUCCESS' }
      });

      // Mise à jour finale du statut du billet
      await tx.booking.update({ where: { id: booking.id }, data: { status: 'CONFIRMED' } });
    });

    return {
      success: true,
      breakdown: {
        grossAmount,
        taxes: taxBreakdown.totalTax,
        gatewayFee: commBreakdown.paymentGatewayFee,
        platformCommission: commBreakdown.platformFee,
        netCarrierRevenue,
      },
      carrierWalletBalance: carrierWallet.balance + netCarrierRevenue,
      message: "Règlement financier et répartition atomique effectués avec succès.",
    };
  }

  async triggerInstantPayout(walletId: string, amount: number, destinationPhone: string) {
    const wallet = await prisma.wallet.findUnique({ where: { id: walletId } });
    if (!wallet || wallet.balance < amount) {
      throw new BadRequestException("Solde insuffisant pour le retrait instantané.");
    }

    // 1. Enregistrement de la demande de virement sortant
    const tx = await prisma.transaction.create({
      data: {
        type: TransactionType.WITHDRAWAL,
        amount,
        status: 'PENDING',
        description: `Virement sortant instantané Wave vers le ${destinationPhone}`,
        sourceWalletId: wallet.id,
      },
    });

    // 2. Simulation de l'appel API Payout Wave / OM (Exécution en 3 secondes)
    await prisma.wallet.update({ where: { id: wallet.id }, data: { balance: { decrement: amount } } });
    await prisma.transaction.update({ where: { id: tx.id }, data: { status: 'SUCCESS', reference: `wav_payout_${Date.now()}` } });

    return {
      success: true,
      message: `Virement instantané de ${amount} FCFA envoyé au numéro ${destinationPhone}.`,
      transactionId: tx.id,
    };
  }

  private async getOrCreateWallet(type: any) {
    let w = await prisma.wallet.findFirst({ where: { type } });
    if (!w) w = await prisma.wallet.create({ data: { type, balance: 0, currency: 'XOF' } });
    return w;
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { v4 as uuidv4 } from 'uuid';

import { PricingService } from '../pricing/pricing.service';
import { prisma } from '@aller-retour/database';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(private readonly pricingService: PricingService) {}

  /**
   * Simule un appel à l'API Wave Business pour déclencher un Push USSD
   */
  async initiateWavePayment(phone: string, amount: number, reference: string) {
    this.logger.log(`Initiating WAVE payment for ${phone} - Amount: ${amount} XOF`);
    const mockTransactionId = `wav_tx_${uuidv4().replace(/-/g, '').substring(0, 16)}`;
    const mockPaymentUrl = `https://pay.wave.com/checkout/${mockTransactionId}`;
    
    const booking = await prisma.booking.findUnique({ where: { id: reference } });
    if (booking) {
      await prisma.paymentTransaction.create({
        data: {
          bookingId: reference,
          userId: booking.userId,
          amount,
          method: 'WAVE',
          status: 'PENDING',
          providerRef: mockTransactionId,
        }
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      transactionId: mockTransactionId,
      status: 'pending_validation',
      message: 'Push USSD envoyé au client sur son compte Wave.',
      provider: 'WAVE',
      paymentUrl: mockPaymentUrl,
      bookingId: reference
    };
  }

  /**
   * Simule un appel à l'API Orange Money Web Payment
   */
  async initiateOrangeMoneyPayment(phone: string, amount: number, reference: string) {
    this.logger.log(`Initiating ORANGE MONEY payment for ${phone} - Amount: ${amount} XOF`);
    const mockTransactionId = `om_tx_${uuidv4().replace(/-/g, '').substring(0, 16)}`;
    const mockPayToken = `mp_token_${uuidv4().substring(0, 8)}`;
    const mockPaymentUrl = `https://api.orange.com/webpayment/pay/${mockPayToken}`;
    
    const booking = await prisma.booking.findUnique({ where: { id: reference } });
    if (booking) {
      await prisma.paymentTransaction.create({
        data: {
          bookingId: reference,
          userId: booking.userId,
          amount,
          method: 'ORANGE_MONEY',
          status: 'PENDING',
          providerRef: mockTransactionId,
        }
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      transactionId: mockTransactionId,
      payToken: mockPayToken,
      status: 'pending_validation',
      message: 'Push USSD envoyé au client via Orange Money.',
      provider: 'ORANGE_MONEY',
      paymentUrl: mockPaymentUrl,
      bookingId: reference
    };
  }

  /**
   * Processus d'un webhook Wave (Réel ou Simulé)
   */
  async handleWaveWebhook(payload: any) {
    if (process.env.NODE_ENV === 'production') {
      this.logger.error(`SECURITY ALERT: Real Wave Webhook called in production without signature validation. Request rejected. Payload ID: ${payload.data?.id}`);
      return { success: false, message: 'Webhooks are disabled in production until signature validation is implemented' };
    }
    
    this.logger.warn(`TODO SECURITY: Wave Webhook processing without signature validation. Transaction ID: ${payload.data?.id}`);
    const reference = payload.data?.client_reference;
    const txId = payload.data?.id;

    if (!reference || !txId) {
      return { success: false, message: 'Invalid payload' };
    }

    // Gérer l'échec
    if (payload.type === 'checkout.session.failed') {
      const txResult = await prisma.paymentTransaction.updateMany({
        where: { method: 'WAVE', providerRef: txId, status: 'PENDING' },
        data: { status: 'FAILED', providerMessage: payload.data?.payment_status, rawPayload: payload }
      });
      if (txResult.count > 0) {
        await prisma.booking.update({
          where: { id: reference },
          data: { status: 'CANCELLED' }
        });
      }
      return { success: true, message: 'Payment marked as failed and booking cancelled' };
    }

    return this.confirmBookingPayment(reference, txId, 'WAVE', payload);
  }

  /**
   * Processus d'un webhook Orange Money (Réel ou Simulé)
   */
  async handleOrangeMoneyWebhook(payload: any) {
    if (process.env.NODE_ENV === 'production') {
      this.logger.error(`SECURITY ALERT: Real Orange Money Webhook called in production without signature validation. Request rejected. Notif ID: ${payload.notif_id}`);
      return { success: false, message: 'Webhooks are disabled in production until signature validation is implemented' };
    }

    this.logger.warn(`TODO SECURITY: Orange Money Webhook processing without signature validation. Notif ID: ${payload.notif_id}`);
    const reference = payload.tx_reference;
    const txId = payload.notif_id;

    if (!reference || !txId) {
      return { success: false, message: 'Invalid payload' };
    }

    if (payload.status === 'FAILED') {
      const txResult = await prisma.paymentTransaction.updateMany({
        where: { method: 'ORANGE_MONEY', providerRef: txId, status: 'PENDING' },
        data: { status: 'FAILED', providerMessage: payload.message, rawPayload: payload }
      });
      if (txResult.count > 0) {
        await prisma.booking.update({
          where: { id: reference },
          data: { status: 'CANCELLED' }
        });
      }
      return { success: true, message: 'Payment marked as failed and booking cancelled' };
    }

    return this.confirmBookingPayment(reference, txId, 'ORANGE_MONEY', payload);
  }

  /**
   * Idempotent payment confirmation that marks booking as PAID/CONFIRMED and logs driver earnings
   */
  private async confirmBookingPayment(bookingId: string, paymentRef: string, method: string, rawPayload?: any) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        trip: {
          include: { 
            driver: true,
            paymentRecipient: true,
            vehicle: {
              include: { owner: true }
            }
          }
        }
      }
    });

    if (!booking) {
      return { success: false, message: 'Booking not found' };
    }

    const pricing = await this.pricingService.calculatePricing(booking.basePrice);

    let updatedTxCount = 0;

    try {
      await prisma.$transaction(async (tx) => {
        // Atomic compare-and-swap: try to claim the PENDING transaction
        const result = await tx.paymentTransaction.updateMany({
          where: { method, providerRef: paymentRef, status: 'PENDING' },
          data: {
            status: 'SUCCESS',
            providerMessage: 'Paiement validé',
            rawPayload: rawPayload || null
          }
        });

        updatedTxCount = result.count;

        if (updatedTxCount === 0) {
          // Si 0 ligne modifiée, un autre webhook a déjà gagné la course ou la tx n'est pas PENDING
          return;
        }

        // Si nous avons gagné, on met à jour la réservation
        await tx.booking.update({
          where: { id: bookingId },
          data: {
            status: 'CONFIRMED',
            paymentRef: paymentRef,
          }
        });

        // Verify paymentRecipient or vehicle owner before assigning earning
        const recipientId = booking.trip.paymentRecipient?.userId || booking.trip.vehicle?.owner?.userId;
        if (!recipientId) {
          throw new Error(`CRITICAL ANOMALY: Payment Recipient not found for trip ${booking.tripId}. DriverEarnings cannot be silently assigned.`);
        }

        // Et on crée le gain chauffeur attribué au propriétaire
        await tx.driverEarning.create({
          data: {
            bookingId: bookingId,
            driverId: recipientId,
            basePrice: pricing.basePrice,
            driverCut: pricing.driverCut,
            platformCommission: pricing.platformCommission,
            status: 'PENDING',
          }
        });
      });
    } catch (e) {
      this.logger.error(`Erreur lors de la transaction webhook pour ${paymentRef}:`, e);
      return { success: false, message: 'Erreur interne lors du traitement' };
    }

    if (updatedTxCount === 0) {
      return { success: true, message: 'Payment already processed or not pending' };
    }

    return { success: true, message: 'Booking confirmed and driver earnings registered' };
  }

  /**
   * Cron exécuté chaque minute pour expirer les transactions PENDING de plus de 2 minutes
   * Cette méthode est conçue pour être résistante aux courses avec les webhooks (idempotence).
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async handlePendingTransactionsTimeout() {
    const PAYMENT_PENDING_TIMEOUT_MINUTES = 2;
    const cutoffDate = new Date(Date.now() - PAYMENT_PENDING_TIMEOUT_MINUTES * 60 * 1000);

    // Trouver les transactions candidates
    const expiredTxs = await prisma.paymentTransaction.findMany({
      where: { 
        status: 'PENDING', 
        createdAt: { lt: cutoffDate } 
      },
      select: { id: true, bookingId: true }
    });

    if (expiredTxs.length === 0) return;

    this.logger.log(`Found ${expiredTxs.length} pending transactions older than ${PAYMENT_PENDING_TIMEOUT_MINUTES} minutes. Expiring them...`);

    for (const tx of expiredTxs) {
      try {
        // Tentative d'annulation atomique
        const result = await prisma.paymentTransaction.updateMany({
          where: { 
            id: tx.id, 
            status: 'PENDING' // Sécurité: ne modifie que si c'est TOUJOURS en pending
          },
          data: { 
            status: 'CANCELLED',
            providerMessage: 'Timeout expiration automatique'
          }
        });

        // Si 0 ligne modifiée, le webhook a probablement confirmé le paiement juste avant
        if (result.count === 1 && tx.bookingId) {
          // Annulation sûre du Booking uniquement si lui-même est encore en PENDING_PAYMENT
          // On ne veut jamais annuler un booking déjà confirmé
          const bookingResult = await prisma.booking.updateMany({
            where: { 
              id: tx.bookingId, 
              status: 'PENDING_PAYMENT' 
            },
            data: { 
              status: 'CANCELLED' 
            }
          });
          
          if (bookingResult.count === 1) {
             this.logger.log(`Booking ${tx.bookingId} cancelled due to payment timeout. Seats are now released.`);
          }
        }
      } catch (err) {
        this.logger.error(`Failed to process timeout for transaction ${tx.id}`, err);
      }
    }
  }
}

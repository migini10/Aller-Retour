import { Injectable, Logger } from '@nestjs/common';
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
      bookingId: reference,
      webhook_simulation_url: `/api/payment/webhook/wave/simulate?tx_id=${mockTransactionId}&ref=${reference}`
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
      bookingId: reference,
      webhook_simulation_url: `/api/payment/webhook/om/simulate?tx_id=${mockTransactionId}&ref=${reference}`
    };
  }

  /**
   * Processus d'un webhook Wave (Réel ou Simulé)
   */
  async handleWaveWebhook(payload: any) {
    this.logger.log(`Received Wave Webhook: ${JSON.stringify(payload)}`);
    const reference = payload.data?.client_reference;
    const txId = payload.data?.id;

    if (!reference || !txId) {
      return { success: false, message: 'Invalid payload' };
    }

    // Gérer l'échec
    if (payload.type === 'checkout.session.failed') {
      await prisma.paymentTransaction.updateMany({
        where: { method: 'WAVE', providerRef: txId, status: 'PENDING' },
        data: { status: 'FAILED', providerMessage: payload.data?.payment_status, rawPayload: payload }
      });
      return { success: true, message: 'Payment marked as failed' };
    }

    return this.confirmBookingPayment(reference, txId, 'WAVE', payload);
  }

  /**
   * Processus d'un webhook Orange Money (Réel ou Simulé)
   */
  async handleOrangeMoneyWebhook(payload: any) {
    this.logger.log(`Received Orange Money Webhook: ${JSON.stringify(payload)}`);
    const reference = payload.tx_reference;
    const txId = payload.notif_id;

    if (!reference || !txId) {
      return { success: false, message: 'Invalid payload' };
    }

    if (payload.status === 'FAILED') {
      await prisma.paymentTransaction.updateMany({
        where: { method: 'ORANGE_MONEY', providerRef: txId, status: 'PENDING' },
        data: { status: 'FAILED', providerMessage: payload.message, rawPayload: payload }
      });
      return { success: true, message: 'Payment marked as failed' };
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

        // Et on crée le gain chauffeur
        await tx.driverEarning.create({
          data: {
            bookingId: bookingId,
            driverId: booking.trip.vehicle?.owner?.userId || booking.trip.driver.userId,
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
}

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

    return this.confirmBookingPayment(reference, txId);
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

    return this.confirmBookingPayment(reference, txId);
  }

  /**
   * Idempotent payment confirmation that marks booking as PAID/CONFIRMED and logs driver earnings
   */
  private async confirmBookingPayment(bookingId: string, paymentRef: string) {
    // Check if booking already paid (idempotency check)
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

    if (booking.status === 'CONFIRMED' || booking.status === 'BOARDED') {
      return { success: true, message: 'Booking already confirmed' };
    }

    const pricing = this.pricingService.calculatePricing(booking.basePrice);

    await prisma.$transaction(async (tx) => {
      // Update Booking status to CONFIRMED
      await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CONFIRMED',
          paymentRef: paymentRef,
        }
      });

      // Create Driver Earning row (pending payouts)
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

    return { success: true, message: 'Booking confirmed and driver earnings registered' };
  }
}

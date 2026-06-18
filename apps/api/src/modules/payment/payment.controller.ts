import { Controller, Post, Get, Body, Query, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * Endpoint de test pour simuler le déclenchement d'un paiement côté client
   * Normalement appelé par le service de Réservation ou Wallet
   */
  @Post('simulate-init')
  async simulatePaymentInit(@Body() body: { phone: string, amount: number, provider: 'WAVE' | 'ORANGE_MONEY', reference: string }) {
    if (body.provider === 'WAVE') {
      return this.paymentService.initiateWavePayment(body.phone, body.amount, body.reference);
    } else {
      return this.paymentService.initiateOrangeMoneyPayment(body.phone, body.amount, body.reference);
    }
  }

  /**
   * Webhook officiel de Wave (Sandbox & Prod)
   */
  @Post('webhook/wave')
  async waveWebhook(@Body() payload: any, @Res() res: Response) {
    await this.paymentService.handleWaveWebhook(payload);
    return res.status(HttpStatus.OK).send();
  }

  /**
   * Webhook officiel d'Orange Money (Sandbox & Prod)
   */
  @Post('webhook/om')
  async orangeMoneyWebhook(@Body() payload: any, @Res() res: Response) {
    await this.paymentService.handleOrangeMoneyWebhook(payload);
    return res.status(HttpStatus.OK).send();
  }

  /**
   * UTILITAIRE SANDBOX SEULEMENT: Permet de déclencher un faux webhook pour simuler
   * qu'un utilisateur a tapé son code secret sur son téléphone.
   */
  @Get('webhook/wave/simulate')
  async simulateWaveWebhookTrigger(@Query('tx_id') txId: string, @Query('ref') ref: string) {
    const mockPayload = {
      type: 'checkout.session.completed',
      data: {
        id: txId,
        client_reference: ref,
        payment_status: 'succeeded'
      }
    };
    await this.paymentService.handleWaveWebhook(mockPayload);
    return { success: true, message: 'Wave Webhook simulated successfully', mockPayload };
  }

  @Get('webhook/om/simulate')
  async simulateOmWebhookTrigger(@Query('tx_id') txId: string, @Query('ref') ref: string) {
    const mockPayload = {
      status: 'SUCCESS',
      notif_id: txId,
      tx_reference: ref
    };
    await this.paymentService.handleOrangeMoneyWebhook(mockPayload);
    return { success: true, message: 'Orange Money Webhook simulated successfully', mockPayload };
  }
}

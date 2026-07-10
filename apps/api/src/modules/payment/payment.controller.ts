import { Controller, Post, Get, Body, Query, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { PaymentService } from './payment.service';
import { AuthGuard } from '@nestjs/passport';
import { RbacGuard } from '../../core/rbac/rbac.guard';
import { Roles } from '../../core/rbac/roles.decorator';
import { UserRole } from '@aller-retour/database';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * Endpoint de test pour simuler le déclenchement d'un paiement côté client
   * Normalement appelé par le service de Réservation ou Wallet
   */
  @Post('simulate-init')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async simulatePaymentInit(@Body() body: { phone: string, amount: number, provider: 'WAVE' | 'ORANGE_MONEY', reference: string }) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Simulation endpoints are disabled in production');
    }
    if (body.provider === 'WAVE') {
      return this.paymentService.initiateWavePayment(body.phone, body.amount, body.reference);
    } else {
      return this.paymentService.initiateOrangeMoneyPayment(body.phone, body.amount, body.reference);
    }
  }

  /**
   * Webhook officiel de Wave (Sandbox & Prod)
   * TODO: Lors de l'intégration finale, ajouter une validation de la signature ou d'un secret provider
   */
  @Post('webhook/wave')
  async waveWebhook(@Body() payload: any, @Res() res: Response) {
    await this.paymentService.handleWaveWebhook(payload);
    return res.status(HttpStatus.OK).send();
  }

  /**
   * Webhook officiel d'Orange Money (Sandbox & Prod)
   * TODO: Lors de l'intégration finale, ajouter une validation de la signature ou d'un secret provider
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
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async simulateWaveWebhookTrigger(@Query('tx_id') txId: string, @Query('ref') ref: string) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Simulation endpoints are disabled in production');
    }
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
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async simulateOmWebhookTrigger(@Query('tx_id') txId: string, @Query('ref') ref: string) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Simulation endpoints are disabled in production');
    }
    const mockPayload = {
      status: 'SUCCESS',
      notif_id: txId,
      tx_reference: ref
    };
    await this.paymentService.handleOrangeMoneyWebhook(mockPayload);
    return { success: true, message: 'Orange Money Webhook simulated successfully', mockPayload };
  }
}

import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WalletsService } from './wallets.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Wallets & Escrow Finance')
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get('my-balance')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir le solde de mon Wallet Aller-Retour' })
  async getBalance(@Req() req: any) {
    return this.walletsService.getMyWalletBalance(req.user.id);
  }

  @Post('webhooks/wave')
  @ApiOperation({ summary: 'Webhook de notification instantanée de paiement Wave / OM' })
  async waveWebhook(@Body() body: { reference: string; amount: number; qrCodeToken: string }) {
    return this.walletsService.processWavePaymentWebhook(body.reference, body.amount, body.qrCodeToken);
  }
}

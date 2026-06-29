import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WalletsService } from './wallets.service';
import { AuthGuard } from '@nestjs/passport';
import { prisma } from '@aller-retour/database';

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

  @Get('driver-balance')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir le solde de mon Wallet Chauffeur' })
  async getDriverBalance(@Req() req: any) {
    // Force target to DRIVER_WALLET type specifically
    let wallet = await prisma.wallet.findFirst({
      where: { userId: req.user.id, type: 'DRIVER_WALLET' },
    });
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { userId: req.user.id, type: 'DRIVER_WALLET', balance: 0.0 }
      });
    }
    return wallet;
  }

  @Get('my-transactions')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Obtenir l'historique des transactions de mon Wallet Aller-Retour" })
  async getMyTransactions(@Req() req: any) {
    return this.walletsService.getMyWalletTransactions(req.user.id);
  }

  @Get('driver-transactions')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: "Obtenir l'historique des transactions de mon Wallet Chauffeur" })
  async getDriverTransactions(@Req() req: any) {
    let wallet = await prisma.wallet.findFirst({
      where: { userId: req.user.id, type: 'DRIVER_WALLET' },
    });
    if (!wallet) return [];
    
    return prisma.transaction.findMany({
      where: { 
        OR: [
          { sourceWalletId: wallet.id },
          { targetWalletId: wallet.id }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  }

  @Post('webhooks/wave')
  @ApiOperation({ summary: 'Webhook de notification instantanée de paiement Wave / OM' })
  async waveWebhook(@Body() body: { reference: string; amount: number; qrCodeToken: string }) {
    return this.walletsService.processWavePaymentWebhook(body.reference, body.amount, body.qrCodeToken);
  }
}

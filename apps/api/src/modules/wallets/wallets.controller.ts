import { Controller, Get, Post, Body, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WalletsService } from './wallets.service';
import { AuthGuard } from '@nestjs/passport';
import { prisma, TransactionType } from '@aller-retour/database';

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

  @Post('driver-withdrawal')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initier un retrait de fonds chauffeur vers Wave ou Orange Money' })
  async requestDriverWithdrawal(
    @Req() req: any,
    @Body() body: { operator: 'wave' | 'orange'; amount: number; phone: string; fullName: string }
  ) {
    const userId = req.user.id;
    const { operator, amount, phone, fullName } = body;

    if (!amount || amount <= 0) {
      throw new BadRequestException('Le montant du retrait doit être supérieur à 0.');
    }

    // 1. Get driver wallet
    const driverWallet = await prisma.wallet.findFirst({
      where: { userId, type: 'DRIVER_WALLET' },
    });

    if (!driverWallet || driverWallet.balance < amount) {
      throw new BadRequestException('Solde du portefeuille chauffeur insuffisant.');
    }

    // 2. Simulate/Connect directly with mobile money payout API (Wave / OM API endpoint)
    // In production, you would call: await operatorGateway.payout({ phone, amount, name });
    const reference = `${operator.toUpperCase()}_PAYOUT_${Date.now()}`;

    // 3. Deduct from driver wallet balance
    const updatedWallet = await prisma.wallet.update({
      where: { id: driverWallet.id },
      data: { balance: { decrement: amount } },
    });

    // 4. Create payout transaction log
    const transaction = await prisma.transaction.create({
      data: {
        type: TransactionType.WITHDRAWAL,
        status: 'SUCCESS',
        amount,
        reference,
        description: `Retrait de fonds vers compte mobile money ${operator.toUpperCase()} (${phone}) - Bénéficiaire : ${fullName}`,
        sourceWalletId: driverWallet.id,
      },
    });

    return {
      success: true,
      message: 'Le retrait a été exécuté avec succès et transféré vers votre mobile money.',
      reference,
      newBalance: updatedWallet.balance,
      transaction,
    };
  }

  @Post('webhooks/wave')
  @ApiOperation({ summary: 'Webhook de notification instantanée de paiement Wave / OM' })
  async waveWebhook(@Body() body: { reference: string; amount: number; qrCodeToken: string }) {
    return this.walletsService.processWavePaymentWebhook(body.reference, body.amount, body.qrCodeToken);
  }
}

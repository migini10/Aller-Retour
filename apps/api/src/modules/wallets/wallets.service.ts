import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { prisma, TransactionType } from '@aller-retour/database';

@Injectable()
export class WalletsService {

  async getMyWalletBalance(userId: string) {
    const wallet = await prisma.wallet.findFirst({
      where: { userId, type: 'PASSENGER_WALLET' },
    });
    if (!wallet) throw new NotFoundException("Wallet introuvable.");
    return wallet;
  }

  async getMyWalletTransactions(userId: string) {
    const wallet = await prisma.wallet.findFirst({
      where: { userId, type: 'PASSENGER_WALLET' },
    });
    if (!wallet) throw new NotFoundException("Wallet introuvable.");

    const transactions = await prisma.transaction.findMany({
      where: { 
        OR: [
          { sourceWalletId: wallet.id },
          { targetWalletId: wallet.id }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    return transactions;
  }


  async processWavePaymentWebhook(paymentRef: string, amount: number, qrCodeToken: string) {
    const booking = await prisma.booking.findUnique({
      where: { qrCodeToken },
      include: { trip: true },
    });

    if (!booking || booking.status === 'CONFIRMED') {
      return { status: 'IGNORED', message: "Billet déjà confirmé ou introuvable." };
    }

    // 1. Validation du billet
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'CONFIRMED', paymentRef },
    });

    // 2. Recherche ou création du compte séquestre (ESCROW)
    let escrowWallet = await prisma.wallet.findFirst({ where: { type: 'ESCROW_WALLET' } });
    if (!escrowWallet) {
      escrowWallet = await prisma.wallet.create({ data: { type: 'ESCROW_WALLET', balance: 0 } });
    }

    // 3. Mise des fonds en Escrow
    await prisma.wallet.update({
      where: { id: escrowWallet.id },
      data: { balance: { increment: amount } },
    });

    // 4. Enregistrement de la transaction
    await prisma.transaction.create({
      data: {
        type: TransactionType.ESCROW_HOLD,
        status: 'SUCCESS',
        amount,
        reference: paymentRef,
        description: `Mise en séquestre du billet #${booking.id} pour le trajet #${booking.tripId}`,
        targetWalletId: escrowWallet.id,
      },
    });

    return { success: true, message: "Paiement Wave validé et mis en séquestre." };
  }
}

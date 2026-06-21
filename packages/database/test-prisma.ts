import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findFirst();
    const trip = await prisma.trip.findFirst();
    const passengerWallet = await prisma.wallet.findFirst({
        where: { userId: user!.id, type: 'PASSENGER_WALLET' }
    });
    console.log("Wallet:", passengerWallet);
    const totalPrice = 1000;
    
    await prisma.$transaction(async (tx) => {
        await tx.wallet.update({
          where: { id: passengerWallet!.id },
          data: { balance: { decrement: totalPrice } }
        });

        await tx.transaction.create({
          data: {
            type: 'TICKET_PURCHASE',
            status: 'SUCCESS',
            amount: totalPrice,
            description: `Test`,
            sourceWalletId: passengerWallet!.id,
          }
        });
    });
    console.log("Transaction SUCCESS");
}

main().finally(() => prisma.$disconnect());

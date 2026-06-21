const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const user = await prisma.user.findFirst();
    const trip = await prisma.trip.findFirst();
    
    if (!user || !trip) {
      console.log("No user or trip");
      return;
    }

    const passengerWallet = await prisma.wallet.findFirst({
        where: { userId: user.id, type: 'PASSENGER_WALLET' }
    });

    console.log("Wallet:", passengerWallet);

    const totalPrice = trip.pricePerSeat * 1;
    
    await prisma.$transaction(async (tx) => {
        await tx.wallet.update({
          where: { id: passengerWallet.id },
          data: { balance: { decrement: totalPrice } }
        });

        await tx.transaction.create({
          data: {
            type: 'TICKET_PURCHASE',
            status: 'SUCCESS',
            amount: totalPrice,
            description: `Paiement réservation trajet #${trip.id.substring(0, 8)} (1 places)`,
            sourceWalletId: passengerWallet.id,
          }
        });
    });

    console.log("Transaction SUCCESS");
  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();

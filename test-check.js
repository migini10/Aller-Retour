const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findFirst();
    const bookings = await prisma.booking.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 3
    });
    console.log("Recent bookings:", bookings);
    const wallet = await prisma.wallet.findFirst({
        where: { userId: user.id }
    });
    console.log("Wallet:", wallet);
    const transactions = await prisma.transaction.findMany({
        where: { sourceWalletId: wallet.id },
        orderBy: { createdAt: 'desc' },
        take: 3
    });
    console.log("Transactions:", transactions);
}
main().finally(() => prisma.$disconnect());

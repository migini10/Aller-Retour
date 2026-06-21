import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findFirst({
        where: { role: 'PASSENGER' }
    });
    if (!user) return console.log("No passenger user");
    
    const bookings = await prisma.booking.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 3
    });
    console.log("Recent bookings:", bookings.map(b => ({ id: b.id, paymentMethod: b.paymentMethod, status: b.status, amountPaid: b.amountPaid })));
    
    const wallet = await prisma.wallet.findFirst({
        where: { userId: user.id, type: 'PASSENGER_WALLET' }
    });
    console.log("Wallet:", wallet);
}
main().finally(() => prisma.$disconnect());

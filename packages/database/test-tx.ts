import { prisma } from './src/index';

async function main() {
  const user = await prisma.user.findFirst({ where: { phone: { contains: '776783412' } } });
  if (!user) return console.log("User not found");
  
  const wallet = await prisma.wallet.findFirst({
    where: { userId: user.id, type: 'PASSENGER_WALLET' },
  });
  if (!wallet) return console.log("Wallet not found");

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
  console.log(`Found ${transactions.length} transactions for wallet ${wallet.id}`);
}
main().catch(console.error).finally(() => prisma.$disconnect());

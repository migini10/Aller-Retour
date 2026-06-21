import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const wallets = await prisma.wallet.findMany({ where: { balance: 45000 } });
  console.log('Wallets with 45000:', wallets);
  for (const w of wallets) {
    const user = await prisma.user.findUnique({ where: { id: w.userId } });
    console.log('User:', user?.phone, user?.firstName);
    const txs = await prisma.transaction.findMany({ where: { OR: [{sourceWalletId: w.id}, {targetWalletId: w.id}] }});
    console.log('Transactions:', txs.length);
  }
}
main().finally(() => prisma.$disconnect());

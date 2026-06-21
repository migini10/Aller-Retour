import { prisma } from './src/index';

async function main() {
  const users = await prisma.user.findMany({ where: { phone: { contains: '776783412' } }, include: { wallets: true, bookings: { orderBy: { createdAt: 'desc' }, take: 2 } } });
  for (const user of users) {
    console.log(`User: ${user.fullName} (${user.phone})`);
    for (const w of user.wallets) {
      console.log(`  -> Wallet ID: ${w.id} | Balance: ${w.balance}`);
      const txs = await prisma.transaction.findMany({ where: { sourceWalletId: w.id }, orderBy: { createdAt: 'desc' }, take: 3 });
      console.log(`  -> Txs: `, txs);
    }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());

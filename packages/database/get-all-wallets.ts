import { prisma, WalletType } from './src/index';

async function main() {
  const users = await prisma.user.findMany({
    include: { wallets: true }
  });
  for (const user of users) {
    console.log(`User: ${user.fullName} (${user.phone}) - Email: ${user.email}`);
    for (const w of user.wallets) {
      console.log(`  -> Wallet ID: ${w.id} | Type: ${w.type} | Balance: ${w.balance}`);
    }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());

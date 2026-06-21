import { prisma, WalletType } from './src/index';

async function main() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    let wallet = await prisma.wallet.findFirst({ where: { userId: user.id, type: 'PASSENGER_WALLET' as WalletType } });
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: user.id,
          balance: 500000,
          type: 'PASSENGER_WALLET' as WalletType
        }
      });
      console.log(`Created wallet for ${user.fullName} with 500k`);
    } else {
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: { balance: wallet.balance + 500000 }
      });
      console.log(`Added 500k to wallet of ${user.fullName}`);
    }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());

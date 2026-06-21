import { prisma, WalletType } from './src/index';

async function main() {
  const users = await prisma.user.findMany({ where: { phone: { contains: '776783412' } } });
  for (const user of users) {
    const wallet = await prisma.wallet.findFirst({ where: { userId: user.id, type: 'PASSENGER_WALLET' as WalletType } });
    console.log(`Le solde de ${user.fullName} (${user.phone}) est de ${wallet?.balance} FCFA`);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findFirst({ where: { phone: { contains: '776783412' } } });
  if (!user) {
    console.log("User not found for 776783412");
    return;
  }
  const wallet = await prisma.wallet.findFirst({ where: { userId: user.id, type: 'PASSENGER_WALLET' } });
  if (!wallet) {
    console.log("Wallet not found for user", user.fullName);
    return;
  }
  console.log(`Le solde de ${user.fullName} (${user.phone}) est de ${wallet.balance} FCFA`);
}
main().catch(console.error).finally(() => prisma.$disconnect());

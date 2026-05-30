const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const trips = await prisma.trip.findMany({ include: { route: { include: { originStation: true, destinationStation: true } } } });
  console.log(JSON.stringify(trips, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());

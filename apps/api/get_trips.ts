import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const trips = await prisma.trip.findMany({ include: { route: true } });
  console.log(JSON.stringify(trips, null, 2));
}
main().finally(() => prisma.$disconnect());

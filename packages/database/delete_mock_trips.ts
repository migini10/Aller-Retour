import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const result = await prisma.trip.deleteMany({});
  console.log('Deleted trips:', result.count);
}
main().finally(() => prisma.$disconnect());

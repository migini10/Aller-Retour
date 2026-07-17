import { PrismaClient } from '@aller-retour/database';
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.vehicle.count();
  console.log("Vehicle count:", count);
}
main().catch(console.error).finally(() => prisma.$disconnect());

import { PrismaClient } from '@aller-retour/database';
const prisma = new PrismaClient();
async function main() {
  const v = await prisma.vehicle.findUnique({ where: { plateNumber: 'AA225AB' } });
  console.log(v);
}
main().catch(console.error).finally(() => prisma.$disconnect());

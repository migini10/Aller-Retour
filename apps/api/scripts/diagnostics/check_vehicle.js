const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const v = await prisma.vehicle.findUnique({
    where: { plateNumber: 'AA225AB' }
  });
  console.log("DB Vehicle Data:");
  console.log(JSON.stringify(v, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());

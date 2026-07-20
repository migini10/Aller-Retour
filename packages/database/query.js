const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const v = await prisma.vehicle.findFirst({ where: { plateNumber: 'AA380VN' }});
  if (!v) { console.log('not found'); return; }
  console.log('Vehicle:', v.id);
  const docs = await prisma.vehicleDocument.findMany({ where: { vehicleId: v.id }});
  console.log('Docs:', JSON.stringify(docs, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());

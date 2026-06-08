const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const trips = await prisma.trip.findMany({
    include: {
      route: {
        include: {
          originStation: true,
          destinationStation: true,
        }
      }
    }
  });
  console.log("=== TRIPS IN DB ===");
  console.log(JSON.stringify(trips, null, 2));
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});

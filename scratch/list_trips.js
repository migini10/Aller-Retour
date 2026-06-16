const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const trips = await prisma.trip.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      route: {
        include: {
          originStation: true,
          destinationStation: true
        }
      }
    }
  });

  console.log("Latest Trips in Database:");
  trips.forEach(t => {
    console.log({
      id: t.id,
      createdAt: t.createdAt,
      trajet: `${t.route.originStation.city} -> ${t.route.destinationStation.city}`,
      departureTime: t.departureTime,
      pricePerSeat: t.pricePerSeat,
      seatsOffered: t.seatsOffered,
      status: t.status
    });
  });

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

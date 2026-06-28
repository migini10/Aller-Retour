import { prisma } from './packages/database/src/index';

async function main() {
  const trips = await prisma.trip.findMany({
    orderBy: { departureTime: 'asc' },
    include: {
      route: {
        include: {
          originStation: true,
          destinationStation: true
        }
      }
    }
  });
  console.log("Trips count:", trips.length);
  trips.forEach(t => {
    console.log({
      id: t.id,
      departureTime: t.departureTime,
      route: `${t.route.originStation.city} (${t.route.originStation.name}) -> ${t.route.destinationStation.city} (${t.route.destinationStation.name})`,
      status: t.status,
      isLocked: t.isLocked,
      seatsOffered: t.seatsOffered,
      seatsRemaining: t.seatsRemaining
    });
  });
}
main().finally(() => prisma.$disconnect());

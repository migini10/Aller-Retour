const { prisma } = require('@aller-retour/database');

async function main() {
  try {
    const trip = await prisma.trip.findFirst({
      where: {
        id: { startsWith: '9d5e9f38' }
      },
      include: { route: true }
    });
    if (!trip) {
      console.log("Source trip not found");
      return;
    }
    console.log("Source trip:", trip.id, "routeId:", trip.routeId);

    const targets = await prisma.trip.findMany({
      where: {
        routeId: trip.routeId,
        id: { not: trip.id },
        status: { in: ['SCHEDULED', 'BOARDING'] }
      },
      include: {
        route: {
          include: {
            originStation: true,
            destinationStation: true
          }
        }
      }
    });

    console.log("Targets count:", targets.length);
    targets.forEach(t => {
      console.log(`Trip ID: ${t.id}, Route: ${t.route.originStation.city} -> ${t.route.destinationStation.city}, departure: ${t.departureTime.toISOString()}, status: ${t.status}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
main();

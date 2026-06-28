const { prisma } = require('@aller-retour/database');

async function main() {
  try {
    const trips = await prisma.trip.findMany({
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
      console.log(`Trip ID: ${t.id}, Route: ${t.route.originStation.city} -> ${t.route.destinationStation.city}, departure: ${t.departureTime.toISOString()}, status: ${t.status}, isLocked: ${t.isLocked}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
main();

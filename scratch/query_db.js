const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const companies = await prisma.company.findMany();
  console.log("Companies:", companies.map(c => ({ id: c.id, name: c.name })));

  const drivers = await prisma.driverProfile.findMany({
    include: { user: true }
  });
  console.log("Drivers:", drivers.map(d => ({ id: d.id, userId: d.userId, phone: d.user?.phone, licenseNumber: d.licenseNumber })));

  const vehicles = await prisma.vehicle.findMany();
  console.log("Vehicles:", vehicles.map(v => ({ id: v.id, plateNumber: v.plateNumber, capacity: v.capacity })));

  const stations = await prisma.station.findMany();
  console.log("Stations (first 5):", stations.slice(0, 5).map(s => ({ id: s.id, city: s.city, name: s.name })));

  const routes = await prisma.route.findMany();
  console.log("Routes (first 5):", routes.slice(0, 5).map(r => ({ id: r.id, name: r.name })));

  const tripsCount = await prisma.trip.count();
  console.log("Trips Count:", tripsCount);

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const body = {
    originCity: 'Dakar',
    destinationCity: 'Touba',
    pricePerSeat: 10000,
    departureTime: new Date('2026-06-15T04:30:00'),
    placesLibres: 4,
    vehicleCapacity: 5,
    passagers: 0,
    isAirConditioned: true,
    takesTollRoad: true
  };

  const vehicleCapacity = body.vehicleCapacity ? parseInt(body.vehicleCapacity.toString(), 10) : 5;
  const pricePerSeat = body.pricePerSeat ? parseFloat(body.pricePerSeat.toString()) : 5000;
  const seatsOffered = body.placesLibres ? parseInt(body.placesLibres.toString(), 10) : 4;
  const initialPassengers = body.passagers ? parseInt(body.passagers.toString(), 10) : 0;

  console.log("1. Finding or creating company...");
  let company = await prisma.company.findFirst({ where: { name: 'Allo Dakar Partenaire' } });
  if (!company) {
    company = await prisma.company.create({
      data: { name: 'Allo Dakar Partenaire' }
    });
  }
  console.log("Company:", company.id);

  console.log("2. Finding or creating driverProfile...");
  let driverProfile = await prisma.driverProfile.findFirst();
  if (!driverProfile) {
    const defaultUser = await prisma.user.findFirst() || await prisma.user.create({
      data: { phone: '+221770000000', fullName: 'Chauffeur Demo', role: 'DRIVER', phoneVerified: true }
    });
    driverProfile = await prisma.driverProfile.create({
      data: { userId: defaultUser.id, licenseNumber: 'SN-123456', licenseExpiry: new Date('2030-01-01') }
    });
  }
  console.log("DriverProfile:", driverProfile.id);

  console.log("3. Finding or creating vehicle...");
  let vehicle = await prisma.vehicle.findFirst({ where: { companyId: company.id, capacity: vehicleCapacity } });
  if (!vehicle) {
    vehicle = await prisma.vehicle.create({
      data: { 
        companyId: company.id, 
        plateNumber: `DK-${Math.floor(Math.random()*10000)}-AB`, 
        type: 'TAXI_7_PLACES', 
        capacity: vehicleCapacity,
        insuranceExpiry: new Date('2030-01-01'),
        inspectionExpiry: new Date('2030-01-01')
      }
    });
  }
  console.log("Vehicle:", vehicle.id);

  console.log("4. Finding or creating origin/destination stations...");
  let origin = await prisma.station.findFirst({ where: { city: body.originCity } });
  if (!origin) origin = await prisma.station.create({ data: { name: `Gare ${body.originCity}`, city: body.originCity, country: 'SN', latitude: 14.6, longitude: -17.4 } });

  let destination = await prisma.station.findFirst({ where: { city: body.destinationCity } });
  if (!destination) destination = await prisma.station.create({ data: { name: `Gare ${body.destinationCity}`, city: body.destinationCity, country: 'SN', latitude: 14.7, longitude: -17.3 } });
  console.log("Origin:", origin.id, "Destination:", destination.id);

  console.log("5. Finding or creating route...");
  let route = await prisma.route.findFirst({
    where: { originStationId: origin.id, destinationStationId: destination.id, companyId: company.id }
  });
  if (!route) {
    route = await prisma.route.create({
      data: {
        companyId: company.id,
        name: `${body.originCity} - ${body.destinationCity}`,
        originStationId: origin.id,
        destinationStationId: destination.id,
        distanceKm: 200,
        estimatedDurationMins: 180,
        defaultPrice: pricePerSeat
      }
    });
  }
  console.log("Route:", route.id);

  console.log("6. Creating trip...");
  const trip = await prisma.trip.create({
    data: {
      companyId: company.id,
      routeId: route.id,
      vehicleId: vehicle.id,
      driverId: driverProfile.id,
      departureTime: body.departureTime ? new Date(body.departureTime) : new Date(),
      pricePerSeat: pricePerSeat,
      isMarketplace: true,
      seatsOffered: seatsOffered,
      initialPassengers: initialPassengers,
      status: 'SCHEDULED'
    }
  });

  console.log("Trip created successfully:", trip.id);
  process.exit(0);
}

main().catch(err => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});

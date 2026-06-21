import { prisma, TripStatus } from './src/index';

async function main() {
  const company = await prisma.company.findFirst({ where: { name: 'Allogoo' } }) || 
                  await prisma.company.create({ data: { name: 'Allogoo' } });
                  
  const driverProfile = await prisma.driverProfile.findFirst() || await prisma.driverProfile.create({
    data: {
      userId: (await prisma.user.findFirst())!.id,
      licenseNumber: 'SN-123456',
      licenseExpiry: new Date('2030-01-01')
    }
  });

  const stationDakar = await prisma.station.findFirst({ where: { city: 'Dakar' } }) || await prisma.station.create({ data: { name: 'Gare Dakar', city: 'Dakar', country: 'SN', latitude: 14.6, longitude: -17.4 } });
  const stationTouba = await prisma.station.findFirst({ where: { city: 'Touba' } }) || await prisma.station.create({ data: { name: 'Gare Touba', city: 'Touba', country: 'SN', latitude: 14.8, longitude: -15.8 } });

  const routeDKRTB = await prisma.route.findFirst({ where: { originStationId: stationDakar.id, destinationStationId: stationTouba.id } }) || 
                     await prisma.route.create({ data: { companyId: company.id, name: 'Dakar - Touba', originStationId: stationDakar.id, destinationStationId: stationTouba.id, distanceKm: 200, estimatedDurationMins: 180, defaultPrice: 5000 } });
  
  const vehicle = await prisma.vehicle.findFirst({ where: { companyId: company.id } }) || 
                  await prisma.vehicle.create({ data: { companyId: company.id, plateNumber: 'DK-1234-AB', type: 'TAXI_7_PLACES', capacity: 7, insuranceExpiry: new Date('2030-01-01'), inspectionExpiry: new Date('2030-01-01') } });

  const baseDate = new Date();
  baseDate.setMinutes(baseDate.getMinutes() + 120); // First trip in 2 hours

  for (let i = 0; i < 5; i++) {
    const depTime = new Date(baseDate);
    depTime.setHours(depTime.getHours() + (i * 2)); // Every 2 hours
    
    await prisma.trip.create({
      data: {
        companyId: company.id,
        routeId: routeDKRTB.id,
        vehicleId: vehicle.id,
        driverId: driverProfile.id,
        departureTime: depTime,
        pricePerSeat: 5000,
        isMarketplace: true,
        seatsOffered: 4,
        initialPassengers: 0,
        status: TripStatus.SCHEDULED
      }
    });
    console.log(`Created trip for ${depTime.toISOString()}`);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());

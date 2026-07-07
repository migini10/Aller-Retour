import { prisma } from '@aller-retour/database';

async function main() {
  console.log('🌱 Début du peuplement de la base de données (Seed)...');

  // 1. Check if user already exists
  const existingDriver = await prisma.user.findFirst({ where: { phone: '+221778889900' } });
  if (existingDriver) {
    console.log('Les données de base existent déjà. Skipping...');
    return;
  }

  // 2. Création d'un utilisateur chauffeur
  const driverUser = await prisma.user.create({
    data: {
      phone: '+221778889900',
      fullName: 'Chauffeur Seed',
      role: 'DRIVER',
      phoneVerified: true,
      driverProfile: {
        create: {
          licenseNumber: 'SN-SEED-001',
          licenseExpiry: new Date('2030-01-01'),
          type: 'OWNER',
        }
      }
    },
    include: { driverProfile: true }
  });

  const driverProfile = await prisma.driverProfile.findUnique({ where: { userId: driverUser.id } });
  const driverProfileId = driverProfile!.id;

  // 3. Création d'un véhicule
  const vehicle = await prisma.vehicle.create({
    data: {
      plateNumber: 'DK-7777-ZZ',
      type: 'TAXI_7_PLACES',
      capacity: 7,
      brand: 'Peugeot',
      model: '504',
      insuranceExpiry: new Date('2030-01-01'),
      inspectionExpiry: new Date('2030-01-01'),
    }
  });

  // 4. Création des Gares (Stations)
  const dakarStation = await prisma.station.create({
    data: { name: 'Gare Routière Baux Maraîchers', city: 'Dakar', country: 'SN', latitude: 14.7167, longitude: -17.4677 }
  });

  const toubaStation = await prisma.station.create({
    data: { name: 'Gare Routière Darou Marnane', city: 'Touba', country: 'SN', latitude: 14.8667, longitude: -15.8833 }
  });

  const thiesStation = await prisma.station.create({
    data: { name: 'Gare Routière de Thiès', city: 'Thiès', country: 'SN', latitude: 14.7833, longitude: -16.9333 }
  });

  // 5. Création des Lignes (Routes)
  const dakarToubaRoute = await prisma.route.create({
    data: {
      name: 'Dakar - Touba',
      originStationId: dakarStation.id,
      destinationStationId: toubaStation.id,
      distanceKm: 190,
      estimatedDurationMins: 180,
      defaultPrice: 5000,
    }
  });

  const thiesDakarRoute = await prisma.route.create({
    data: {
      name: 'Thiès - Dakar',
      originStationId: thiesStation.id,
      destinationStationId: dakarStation.id,
      distanceKm: 70,
      estimatedDurationMins: 60,
      defaultPrice: 2000,
    }
  });

  // 6. Création des Trajets (Trips) pour aujourd'hui et les prochains jours
  const now = new Date();
  
  // Trajet 1 : Départ dans 2 heures
  const departure1 = new Date(now);
  departure1.setHours(departure1.getHours() + 2);
  
  await prisma.trip.create({
    data: {
      routeId: dakarToubaRoute.id,
      vehicleId: vehicle.id,
      driverId: driverProfileId,
      departureTime: departure1,
      pricePerSeat: 5000,
      seatsOffered: 7,
      initialPassengers: 0,
      status: 'SCHEDULED'
    }
  });

  // Trajet 2 : Départ dans 4 heures
  const departure2 = new Date(now);
  departure2.setHours(departure2.getHours() + 4);

  await prisma.trip.create({
    data: {
      routeId: dakarToubaRoute.id,
      vehicleId: vehicle.id,
      driverId: driverProfileId,
      departureTime: departure2,
      pricePerSeat: 5000,
      seatsOffered: 7,
      initialPassengers: 2, // 2 places déjà prises
      status: 'SCHEDULED'
    }
  });

  // Trajet 3 : Départ demain (Thiès -> Dakar)
  const departure3 = new Date(now);
  departure3.setDate(departure3.getDate() + 1);
  departure3.setHours(8, 0, 0, 0);

  await prisma.trip.create({
    data: {
      routeId: thiesDakarRoute.id,
      vehicleId: vehicle.id,
      driverId: driverProfileId,
      departureTime: departure3,
      pricePerSeat: 2000,
      seatsOffered: 4,
      initialPassengers: 0,
      status: 'SCHEDULED'
    }
  });

  console.log('✅ Seed terminé avec succès ! 3 trajets ont été créés.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

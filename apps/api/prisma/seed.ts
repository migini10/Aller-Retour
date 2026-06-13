import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du peuplement de la base de données (Seed)...');

  // 1. Nettoyage partiel optionnel ou idempotence
  const existingCompany = await prisma.company.findFirst({ where: { name: 'Allogoo Express' } });
  
  if (existingCompany) {
    console.log('Les données de base existent déjà. Skipping...');
    return;
  }

  // 1. Création de la compagnie de transport
  const company = await prisma.company.create({
    data: {
      name: 'Allogoo Express',
      plan: 'STANDARD',
    },
  });

  // 2. Création d'un utilisateur chauffeur
  const driverUser = await prisma.user.create({
    data: {
      phone: '+221778889900',
      fullName: 'Chauffeur Seed',
      role: 'DRIVER',
      phoneVerified: true,
      companyId: company.id,
      driverProfile: {
        create: {
          licenseNumber: 'SN-SEED-001',
          licenseExpiry: new Date('2030-01-01'),
          type: 'AFFILIATED',
        }
      }
    },
    include: { driverProfile: true }
  });

  // 3. Création d'un véhicule
  const vehicle = await prisma.vehicle.create({
    data: {
      companyId: company.id,
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
      companyId: company.id,
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
      companyId: company.id,
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
      companyId: company.id,
      routeId: dakarToubaRoute.id,
      vehicleId: vehicle.id,
      driverId: driverUser.driverProfile!.id,
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
      companyId: company.id,
      routeId: dakarToubaRoute.id,
      vehicleId: vehicle.id,
      driverId: driverUser.driverProfile!.id,
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
      companyId: company.id,
      routeId: thiesDakarRoute.id,
      vehicleId: vehicle.id,
      driverId: driverUser.driverProfile!.id,
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

import { NextResponse } from 'next/server';
import { prisma } from '@aller-retour/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      orderBy: { departureTime: 'asc' },
      include: {
        route: {
          include: {
            originStation: true,
            destinationStation: true,
          }
        },
        vehicle: true,
        bookings: true,
      }
    });

    const formattedMissions = trips.map((trip) => {
      const isUrgent = new Date(trip.departureTime).getTime() - new Date().getTime() < 1000 * 60 * 60 * 24; // Less than 24h
      
      const departStr = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', hour: '2-digit', minute: '2-digit' }).format(trip.departureTime);
      
      const bookedSeats = trip.bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'BOARDED').length;
      const totalPassengers = trip.initialPassengers + bookedSeats;
      const placesLibresRestantes = Math.max(0, trip.seatsOffered - totalPassengers);
      
      return {
        id: `M-${trip.id.substring(0, 4).toUpperCase()}`,
        tripId: trip.id, // For patching
        trajet: `${trip.route.originStation.city} → ${trip.route.destinationStation.city}`,
        depart: departStr,
        departureTime: trip.departureTime.toISOString(),
        distance: `${trip.route.distanceKm} km`,
        passagers: totalPassengers,
        placesLibres: placesLibresRestantes,
        placesPrises: totalPassengers,
        seatsOffered: trip.seatsOffered,
        initialPassengers: trip.initialPassengers,
        vehicleCapacity: trip.vehicle?.capacity || 5,
        remuneration: `${trip.pricePerSeat} FCFA / place`,
        pricePerSeat: trip.pricePerSeat,
        transporteur: `Voiture ${trip.vehicle?.capacity || 5} places`,
        urgent: isUrgent,
        status: trip.status === 'SCHEDULED' ? 'programmé' : trip.status === 'BOARDING' ? 'à venir' : trip.status === 'IN_TRANSIT' ? 'en cours' : 'terminé',
        minScore: 60,
        isAirConditioned: true,
        takesTollRoad: true
      };
    });

    return NextResponse.json(formattedMissions);
  } catch (error) {
    console.error('GET Missions Error:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des missions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const vehicleCapacity = body.vehicleCapacity ? parseInt(body.vehicleCapacity.toString(), 10) : 5;
    const pricePerSeat = body.pricePerSeat ? parseFloat(body.pricePerSeat.toString()) : 5000;
    const seatsOffered = body.placesLibres ? parseInt(body.placesLibres.toString(), 10) : 4;
    const initialPassengers = body.passagers ? parseInt(body.passagers.toString(), 10) : 0;

    let company = await prisma.company.findFirst({ where: { name: 'Allo Dakar Partenaire' } });
    if (!company) {
      company = await prisma.company.create({
        data: { name: 'Allo Dakar Partenaire' }
      });
    }

    let driverProfile = await prisma.driverProfile.findFirst();
    if (!driverProfile) {
      const defaultUser = await prisma.user.findFirst() || await prisma.user.create({
        data: { phone: '+221770000000', fullName: 'Chauffeur Demo', role: 'DRIVER', phoneVerified: true }
      });
      driverProfile = await prisma.driverProfile.create({
        data: { userId: defaultUser.id, licenseNumber: 'SN-123456', licenseExpiry: new Date('2030-01-01') }
      });
    }

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

    let origin = await prisma.station.findFirst({ where: { city: body.originCity } });
    if (!origin) origin = await prisma.station.create({ data: { name: `Gare ${body.originCity}`, city: body.originCity, country: 'SN', latitude: 14.6, longitude: -17.4 } });

    let destination = await prisma.station.findFirst({ where: { city: body.destinationCity } });
    if (!destination) destination = await prisma.station.create({ data: { name: `Gare ${body.destinationCity}`, city: body.destinationCity, country: 'SN', latitude: 14.7, longitude: -17.3 } });

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

    return NextResponse.json({ success: true, trip });
  } catch (error) {
    console.error('POST Missions Error:', error);
    return NextResponse.json({ error: 'Erreur lors de la création de la mission' }, { status: 500 });
  }
}

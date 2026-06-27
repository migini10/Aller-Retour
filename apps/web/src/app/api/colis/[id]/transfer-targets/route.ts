import { NextResponse } from 'next/server';
import { prisma, TripStatus } from '@aller-retour/database';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // trackingCode

    const parcel = await prisma.parcel.findUnique({
      where: { trackingCode: id },
      include: {
        trip: {
          include: {
            route: {
              include: {
                destinationStation: true
              }
            }
          }
        }
      }
    });

    if (!parcel || !parcel.trip) {
      return NextResponse.json([]);
    }

    const destinationCity = parcel.trip.route.destinationStation.city;
    const currentTripId = parcel.tripId;

    // Date filtering: same calendar day
    const departureDate = new Date(parcel.trip.departureTime);
    const startOfDay = new Date(departureDate.toISOString().split('T')[0] + 'T00:00:00.000Z');
    const endOfDay = new Date(departureDate.toISOString().split('T')[0] + 'T23:59:59.999Z');

    const alternativeTrips = await prisma.trip.findMany({
      where: {
        route: {
          destinationStation: {
            city: destinationCity
          }
        },
        id: { not: currentTripId },
        status: { in: [TripStatus.SCHEDULED, TripStatus.BOARDING] },
        departureTime: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      include: {
        route: {
          include: {
            originStation: true,
            destinationStation: true
          }
        },
        driver: {
          include: {
            user: { select: { fullName: true } }
          }
        },
        vehicle: true
      }
    });

    const formatted = alternativeTrips.map((alt) => ({
      id: alt.id,
      chauffeur: alt.driver?.user?.fullName || 'Chauffeur Inconnu',
      vehicule: `${alt.vehicle?.type || 'Véhicule'} (${alt.vehicle?.plateNumber || ''})`,
      heure: new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(alt.departureTime),
      placesLibres: alt.seatsOffered, // Colis doesn't consume seats, but we show the info
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('GET Parcel Transfer Targets Error:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des trajets' }, { status: 500 });
  }
}

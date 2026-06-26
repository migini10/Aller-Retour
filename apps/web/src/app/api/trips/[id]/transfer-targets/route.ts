import { NextResponse } from 'next/server';
import { prisma, TripStatus } from '@aller-retour/database';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    let tripId = id;
    if (id.startsWith('M-')) {
      const trip = await prisma.trip.findFirst({
        where: {
          id: {
            startsWith: id.substring(2).toLowerCase()
          }
        }
      });
      if (trip) {
        tripId = trip.id;
      }
    } else if (id.startsWith('TRIP-')) {
      const trip = await prisma.trip.findFirst({
        orderBy: { departureTime: 'asc' }
      });
      if (trip) tripId = trip.id;
    }

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { route: true, vehicle: true }
    });

    if (!trip) {
      return NextResponse.json([]);
    }

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const alternativeTrips = await prisma.trip.findMany({
      where: {
        routeId: trip.routeId,
        id: { not: tripId },
        status: TripStatus.SCHEDULED,
        departureTime: { gte: new Date() }
      },
      include: {
        company: { select: { name: true, logoUrl: true } },
        vehicle: { select: { plateNumber: true, type: true, capacity: true } },
        driver: { select: { user: { select: { fullName: true, phone: true } } } },
        bookings: {
          where: {
            OR: [
              { status: { in: ['CONFIRMED', 'BOARDED'] } },
              { status: 'PENDING_PAYMENT', createdAt: { gt: fiveMinutesAgo } }
            ]
          }
        }
      }
    });

    const formatted = alternativeTrips.map((alt: any) => {
      const bookedSeats = alt.bookings.length;
      const totalPassengers = alt.initialPassengers + bookedSeats;
      return {
        id: alt.id,
        chauffeur: alt.driver?.user?.fullName || 'Chauffeur Inconnu',
        vehicule: `${alt.vehicle.type} (${alt.vehicle.plateNumber})`,
        heure: new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(alt.departureTime),
        placesLibres: Math.max(0, alt.seatsOffered - totalPassengers),
        isLocked: alt.isLocked,
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('GET Transfer Targets Error:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des trajets cibles' }, { status: 500 });
  }
}

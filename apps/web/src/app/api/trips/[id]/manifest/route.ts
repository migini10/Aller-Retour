import { NextResponse } from 'next/server';
import { prisma } from '@aller-retour/database';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    // We want to handle both TRIP-402 (mock style) and real database IDs.
    // If it's a real trip, we query the DB.
    let tripId = id;
    if (id.startsWith('M-')) {
      // Find the trip whose ID prefix matches
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
      // Mock compatibility or lookup
      const trip = await prisma.trip.findFirst({
        orderBy: { departureTime: 'asc' }
      });
      if (trip) tripId = trip.id;
    }

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        route: {
          include: {
            originStation: true,
            destinationStation: true,
          }
        },
        vehicle: true,
      }
    });

    if (!trip) {
      return NextResponse.json({ error: 'Trajet non trouvé' }, { status: 404 });
    }

    const bookings = await prisma.booking.findMany({
      where: { tripId, status: { in: ['CONFIRMED', 'BOARDED'] } },
      include: { user: { select: { fullName: true, phone: true } } },
      orderBy: { seatNumber: 'asc' },
    });

    const tickets = bookings.map((b) => ({
      id: b.id,
      nom: b.user?.fullName || 'Passager',
      tel: b.user?.phone || '',
      siege: b.seatNumber.toString(),
      statut: b.status === 'BOARDED' ? 'embarqué' : 'en attente',
      bagage: 'Standard',
    }));

    return NextResponse.json({
      tripId: trip.id,
      displayId: `M-${trip.id.substring(0, 4).toUpperCase()}`,
      trajet: `${trip.route.originStation.city} ➔ ${trip.route.destinationStation.city}`,
      vehicleCapacity: trip.vehicle?.capacity || 5,
      tickets,
    });
  } catch (error) {
    console.error('GET Manifest Error:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération du manifeste' }, { status: 500 });
  }
}

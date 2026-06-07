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
            origin: true,
            destination: true,
          }
        },
        vehicle: true,
      }
    });

    const formattedMissions = trips.map((trip) => {
      const isUrgent = new Date(trip.departureTime).getTime() - new Date().getTime() < 1000 * 60 * 60 * 24; // Less than 24h
      
      return {
        id: `M-${trip.id.substring(0, 4).toUpperCase()}`,
        tripId: trip.id, // For patching
        trajet: `${trip.route.origin.city} → ${trip.route.destination.city}`,
        depart: new Intl.DateTimeFormat('fr-FR', { weekday: 'long', hour: '2-digit', minute: '2-digit' }).format(trip.departureTime),
        distance: `${trip.route.distanceKm} km`,
        passagers: 0, // Placeholder
        remuneration: `${trip.pricePerSeat} FCFA / place`,
        transporteur: 'Aller-Retour',
        urgent: isUrgent,
        status: trip.status === 'SCHEDULED' ? 'disponible' : 'accepte', // Very simple mapping
        minScore: 60
      };
    });

    return NextResponse.json(formattedMissions);
  } catch (error) {
    console.error('GET Missions Error:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des missions' }, { status: 500 });
  }
}

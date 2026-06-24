import { NextResponse } from 'next/server';
import { prisma } from '@aller-retour/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { qrCodeToken, action = 'info' } = body;

    if (!qrCodeToken) {
      return NextResponse.json({ status: 'invalid', message: 'Token manquant' }, { status: 400 });
    }

    // Recherche de la réservation
    const booking = await prisma.booking.findUnique({
      where: { qrCodeToken },
      include: {
        trip: {
          include: {
            route: {
              include: {
                originStation: true,
                destinationStation: true,
              }
            }
          }
        },
        user: true,
      }
    });

    if (!booking) {
      return NextResponse.json({ status: 'invalid', message: 'Billet introuvable' });
    }

    if (booking.status === 'CANCELLED') {
      return NextResponse.json({ status: 'invalid', message: 'Billet annulé' });
    }

    if (booking.status === 'BOARDED') {
      return NextResponse.json({ 
        status: 'already_used', 
        message: 'Ce billet a déjà été scanné.',
        boardedAt: booking.boardedAt,
        passengerName: booking.user.fullName,
        seatNumber: booking.seatNumber,
        route: `${booking.trip.route.originStation.city} ➔ ${booking.trip.route.destinationStation.city}`
      });
    }

    if (booking.status === 'CONFIRMED' || booking.status === 'PENDING_PAYMENT') {
      if (action === 'info') {
        // Juste retourner les infos sans modifier
        return NextResponse.json({ 
          status: 'valid', 
          message: 'Billet valide pour embarquement.',
          passengerName: booking.user.fullName,
          seatNumber: booking.seatNumber,
          route: `${booking.trip.route.originStation.city} ➔ ${booking.trip.route.destinationStation.city}`,
          amountPaid: booking.amountPaid,
          departureTime: booking.trip.departureTime,
          qrCodeToken: booking.qrCodeToken,
          passengersCount: 1 // Toujours 1 selon la structure actuelle
        });
      } else if (action === 'board') {
        // Valider le billet
        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            status: 'BOARDED',
            boardedAt: new Date(),
          }
        });

        return NextResponse.json({ 
          status: 'success', 
          message: 'Embarquement validé avec succès.',
          passengerName: booking.user.fullName,
          seatNumber: booking.seatNumber,
          route: `${booking.trip.route.originStation.city} ➔ ${booking.trip.route.destinationStation.city}`
        });
      }
    }


    return NextResponse.json({ status: 'invalid', message: 'Statut du billet inconnu' });

  } catch (error) {
    console.error('Erreur lors du scan du billet:', error);
    return NextResponse.json({ status: 'error', message: 'Erreur serveur' }, { status: 500 });
  }
}

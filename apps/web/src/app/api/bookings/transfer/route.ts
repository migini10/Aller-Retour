import { NextResponse } from 'next/server';
import { prisma } from '@aller-retour/database';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingIds, targetTripId } = body;

    if (!bookingIds || !Array.isArray(bookingIds) || bookingIds.length === 0 || !targetTripId) {
      return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 });
    }

    // Run this inside a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Get targets and check existences
      const targetTrip = await tx.trip.findUnique({
        where: { id: targetTripId },
        include: { vehicle: true },
      });

      if (!targetTrip) {
        throw new Error('Trajet cible non trouvé');
      }

      const bookingsToTransfer = await tx.booking.findMany({
        where: { id: { in: bookingIds } },
        include: { trip: true },
      });

      if (bookingsToTransfer.length !== bookingIds.length) {
        throw new Error('Certaines réservations à transférer n\'existent pas');
      }

      // 2. Count existing bookings on the target trip
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const targetBookings = await tx.booking.findMany({
        where: {
          tripId: targetTripId,
          OR: [
            { status: { in: ['CONFIRMED', 'BOARDED'] } },
            { status: 'PENDING_PAYMENT', createdAt: { gt: fiveMinutesAgo } }
          ]
        },
        select: { seatNumber: true },
      });

      const takenSeats = new Set(targetBookings.map((b: any) => b.seatNumber));
      const totalPassengers = targetTrip.initialPassengers + targetBookings.length;
      const availableSeatsCount = targetTrip.seatsOffered - totalPassengers;

      // 3. Update target trip departure time if target has no clients (bookings + initial passengers)
      const sourceTrip = bookingsToTransfer[0]?.trip;
      if (sourceTrip && targetBookings.length === 0 && targetTrip.initialPassengers === 0) {
        await tx.trip.update({
          where: { id: targetTripId },
          data: { departureTime: sourceTrip.departureTime }
        });
      }

      if (availableSeatsCount < bookingsToTransfer.length) {
        throw new Error(`Nombre de places insuffisant sur le trajet cible. Places disponibles : ${Math.max(0, availableSeatsCount)}`);
      }

      // 4. Update bookings
      const updatedBookings = [];
      const vehicleCapacity = targetTrip.vehicle?.capacity || 5;

      for (const booking of bookingsToTransfer) {
        let assignedSeat = 1;
        while (takenSeats.has(assignedSeat) && assignedSeat <= vehicleCapacity) {
          assignedSeat++;
        }
        takenSeats.add(assignedSeat);

        const updated = await tx.booking.update({
          where: { id: booking.id },
          data: {
            tripId: targetTripId,
            seatNumber: assignedSeat,
          },
        });
        updatedBookings.push(updated);
      }

      // 5. Clean up source trip if it has no remaining bookings and no initial passengers
      const sourceTripId = bookingsToTransfer[0]?.tripId;
      if (sourceTripId) {
        const remainingBookingsCount = await tx.booking.count({
          where: {
            tripId: sourceTripId,
            status: { in: ['CONFIRMED', 'BOARDED'] }
          }
        });

        const sourceTripObj = await tx.trip.findUnique({
          where: { id: sourceTripId }
        });

        if (remainingBookingsCount === 0 && (!sourceTripObj || sourceTripObj.initialPassengers === 0)) {
          // Delete related entities to prevent foreign key errors
          await tx.parcel.deleteMany({ where: { tripId: sourceTripId } });
          await tx.seatLock.deleteMany({ where: { tripId: sourceTripId } });
          await tx.trip.delete({ where: { id: sourceTripId } });
        }
      }

      return {
        success: true,
        message: `${bookingsToTransfer.length} client(s) transféré(s) avec succès.`,
        transferredCount: bookingsToTransfer.length,
        bookings: updatedBookings,
      };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('POST Transfer Bookings Error:', error);
    return NextResponse.json({ error: error.message || 'Erreur lors du transfert' }, { status: 500 });
  }
}

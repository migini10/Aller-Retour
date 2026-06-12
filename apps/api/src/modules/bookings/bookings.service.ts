import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { prisma, PaymentMethod } from '@aller-retour/database';
import * as crypto from 'crypto';

@Injectable()
export class BookingsService {

  async createBooking(userId: string, tripId: string, seatNumber: number, paymentMethod: PaymentMethod) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { vehicle: true },
    });

    if (!trip) throw new NotFoundException("Trajet introuvable.");

    if (seatNumber < 1 || seatNumber > trip.vehicle.capacity) {
      throw new BadRequestException("Numéro de siège invalide pour ce véhicule.");
    }

    // Vérification de la disponibilité du siège
    const existing = await prisma.booking.findUnique({
      where: { tripId_seatNumber: { tripId, seatNumber } },
    });
    if (existing && existing.status !== 'CANCELLED') {
      throw new BadRequestException(`Le siège #${seatNumber} est déjà réservé.`);
    }

    // Génération du QR Token chiffré
    const qrCodeToken = crypto.createHash('sha256').update(`${tripId}-${seatNumber}-${userId}-${Date.now()}`).digest('hex');

    const booking = await prisma.booking.create({
      data: {
        tripId,
        userId,
        seatNumber,
        qrCodeToken,
        status: 'PENDING_PAYMENT',
        amountPaid: trip.pricePerSeat,
        paymentMethod,
      },
    });

    return {
      success: true,
      booking,
      message: "Réservation créée. En attente de la validation du paiement Wave/OM.",
    };
  }

  async verifyQrAtBoarding(qrCodeToken: string) {
    const booking = await prisma.booking.findUnique({
      where: { qrCodeToken },
      include: { user: true, trip: { include: { route: true } } },
    });

    if (!booking) throw new NotFoundException("Billet QR invalide ou inexistant.");
    if (booking.status === 'BOARDED') throw new BadRequestException("Attention: Ce billet a déjà été scanné à l'embarquement !");
    if (booking.status !== 'CONFIRMED') throw new BadRequestException(`Billet non valide (Statut actuel: ${booking.status}).`);

    // Validation de l'embarquement
    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'BOARDED', boardedAt: new Date() },
    });

    return { success: true, message: "Embarquement validé avec succès !", booking: updated };
  }

  async getUserBookings(userId: string) {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        trip: {
          include: {
            route: {
              include: {
                originStation: true,
                destinationStation: true,
              }
            },
            company: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return bookings;
  }
}

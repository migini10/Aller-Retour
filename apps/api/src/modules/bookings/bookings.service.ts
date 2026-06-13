import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { prisma, PaymentMethod } from '@aller-retour/database';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'allogoosn@gmail.com',
    pass: process.env.EMAIL_PASS || 'votre-mot-de-passe-d-application'
  }
});

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
        status: 'CONFIRMED', // Simplifié pour le MVP
        amountPaid: trip.pricePerSeat,
        paymentMethod,
      },
      include: {
        user: true,
        trip: {
          include: {
            route: {
              include: { originStation: true, destinationStation: true }
            }
          }
        }
      }
    });

    // Envoi de l'e-mail avec Nodemailer
    try {
      await transporter.sendMail({
        from: '"Aller-Retour" <allogoosn@gmail.com>',
        to: 'allogoosn@gmail.com', // Toujours vers cette adresse selon la consigne MVP
        subject: `[Aller-Retour] Billet Confirmé - ${booking.trip.route.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #f97316; padding: 20px; text-align: center; color: white;">
              <h2>Confirmation de Réservation</h2>
              <p>Votre trajet a été réservé avec succès !</p>
            </div>
            <div style="padding: 20px;">
              <p><strong>Voyageur:</strong> ${booking.user.fullName}</p>
              <p><strong>Trajet:</strong> ${booking.trip.route.name}</p>
              <p><strong>Date de départ:</strong> ${new Date(booking.trip.departureTime).toLocaleString('fr-FR')}</p>
              <p><strong>Numéro de siège:</strong> #${booking.seatNumber}</p>
              <p><strong>Montant payé:</strong> ${booking.amountPaid} FCFA</p>
              <div style="margin-top: 20px; padding: 15px; background-color: #f8fafc; border-radius: 8px; text-align: center;">
                <p style="font-size: 12px; color: #64748b;">Code QR (Token unique) pour l'embarquement :</p>
                <p style="font-family: monospace; font-size: 14px; word-break: break-all; color: #0f172a;">${booking.qrCodeToken}</p>
              </div>
            </div>
          </div>
        `
      });
      console.log(`✅ E-mail de confirmation envoyé à allogoosn@gmail.com pour le billet ${booking.id}`);
    } catch (err) {
      console.error(`❌ Erreur lors de l'envoi de l'e-mail Nodemailer:`, err);
    }

    return {
      success: true,
      booking,
      message: "Réservation confirmée avec succès. Un e-mail a été envoyé.",
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

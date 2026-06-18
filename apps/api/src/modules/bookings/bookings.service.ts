import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { prisma, PaymentMethod } from '@aller-retour/database';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';

import { PaymentService } from '../payment/payment.service';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'allogoosn@gmail.com',
    pass: process.env.EMAIL_PASS || 'votre-mot-de-passe-d-application'
  }
});

@Injectable()
export class BookingsService {
  constructor(private readonly paymentService: PaymentService) {}

  async createBooking(userId: string, tripId: string, seatNumber: number, paymentMethod: PaymentMethod) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("Utilisateur introuvable.");

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

    const status = (paymentMethod === 'WAVE' || paymentMethod === 'ORANGE_MONEY') ? 'PENDING_PAYMENT' : 'CONFIRMED';

    const booking = await prisma.booking.create({
      data: {
        tripId,
        userId,
        seatNumber,
        qrCodeToken,
        status,
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

    // Handle Payment Initiation
    let paymentSession = null;
    if (paymentMethod === 'WAVE') {
      paymentSession = await this.paymentService.initiateWavePayment(user.phone, trip.pricePerSeat, booking.id);
    } else if (paymentMethod === 'ORANGE_MONEY') {
      paymentSession = await this.paymentService.initiateOrangeMoneyPayment(user.phone, trip.pricePerSeat, booking.id);
    }

    if (status === 'CONFIRMED') {
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
    } // End if CONFIRMED

    return {
      success: true,
      booking,
      paymentSession, // Renvoie la session de paiement au frontend/mobile
      message: status === 'CONFIRMED' 
        ? "Réservation confirmée avec succès. Un e-mail a été envoyé."
        : "Réservation en attente de paiement. Veuillez valider sur votre mobile.",
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

  async cancelBooking(bookingId: string, userId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException("Réservation introuvable.");
    if (booking.userId !== userId) throw new BadRequestException("Action non autorisée.");
    if (booking.status === 'CANCELLED') throw new BadRequestException("Réservation déjà annulée.");
    if (booking.status === 'BOARDED') throw new BadRequestException("Impossible d'annuler un trajet déjà démarré.");

    // Annuler la réservation
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
    });

    // Remboursement sur le WALLET Allo Dakar
    if (booking.status === 'CONFIRMED' && booking.amountPaid > 0) {
      let passengerWallet = await prisma.wallet.findFirst({
        where: { userId: userId, type: 'PASSENGER_WALLET' },
      });

      if (!passengerWallet) {
        passengerWallet = await prisma.wallet.create({
          data: {
            userId: userId,
            type: 'PASSENGER_WALLET',
            balance: 0,
          }
        });
      }

      await prisma.wallet.update({
        where: { id: passengerWallet.id },
        data: { balance: { increment: booking.amountPaid } }
      });

      // Enregistrer la transaction de remboursement
      await prisma.transaction.create({
        data: {
          type: 'REFUNDED' as any, // On triche avec les Enum pour le MVP
          status: 'SUCCESS',
          amount: booking.amountPaid,
          description: `Remboursement annulation réservation #${bookingId}`,
          targetWalletId: passengerWallet.id,
        }
      });
    }

    return { success: true, message: "Réservation annulée. Si vous aviez payé, le montant a été reversé sur votre Wallet Allo Dakar." };
  }
}

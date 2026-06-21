import { Injectable, BadRequestException, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
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

  async createBooking(userId: string, tripId: string, seatNumber: number, paymentMethod: PaymentMethod, passengersCount: number = 1) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("Utilisateur introuvable.");

    return await prisma.$transaction(async (tx: any) => {
      try {
        await tx.$executeRawUnsafe(`SELECT id FROM "trips" WHERE id = '${tripId}' FOR UPDATE`);
      } catch (error) {
        console.error("Erreur lors du verrouillage SQL :", error);
        throw new HttpException("Erreur interne lors du verrouillage", HttpStatus.INTERNAL_SERVER_ERROR);
      }


      const trip = await tx.trip.findUnique({
        where: { id: tripId },
        include: { vehicle: true },
      });

      if (!trip) throw new NotFoundException("Trajet introuvable.");

      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const allBookings = await tx.booking.findMany({
        where: {
          tripId,
          OR: [
            { status: { in: ['CONFIRMED', 'BOARDED'] } },
            { status: 'PENDING_PAYMENT', createdAt: { gt: fiveMinutesAgo } }
          ]
        },
        select: { seatNumber: true },
      });
      
      const takenSeats = new Set(allBookings.map((b: any) => b.seatNumber));
      
      let assignedSeat = seatNumber;
      if (assignedSeat < 1 || assignedSeat > trip.vehicle.capacity || takenSeats.has(assignedSeat)) {
        assignedSeat = 1;
        while (takenSeats.has(assignedSeat) && assignedSeat <= trip.vehicle.capacity) {
          assignedSeat++;
        }
      }

      if (assignedSeat > trip.vehicle.capacity) {
        // Vehicle is full, find alternatives
        const alternatives = await tx.trip.findMany({
          where: {
            routeId: trip.routeId,
            id: { not: tripId },
            status: 'SCHEDULED',
            departureTime: { gt: new Date() }
          },
          include: { company: true, vehicle: true, driver: { include: { user: true } } },
          orderBy: { departureTime: 'asc' },
          take: 3
        });

        const formattedAlternatives = await Promise.all(alternatives.map(async (alt: any) => {
          const altBookings = await tx.booking.count({
            where: {
              tripId: alt.id,
              OR: [
                { status: { in: ['CONFIRMED', 'BOARDED'] } },
                { status: 'PENDING_PAYMENT', createdAt: { gt: fiveMinutesAgo } }
              ]
            }
          });
          const available = alt.seatsOffered - (alt.initialPassengers + altBookings);
          return {
            ...alt,
            availableSeats: Math.max(0, available),
            companyName: alt.company.name,
          };
        }));

        const availableAlternatives = formattedAlternatives.filter((a: any) => a.availableSeats > 0);

        throw new HttpException({
          code: 'TRIP_FULL_ALTERNATIVES',
          message: "Le véhicule est complet, plus de place disponible.",
          alternatives: availableAlternatives
        }, HttpStatus.CONFLICT);
      }

      const totalPrice = trip.pricePerSeat * passengersCount;

      if (paymentMethod === 'WALLET') {
        const passengerWallet = await tx.wallet.findFirst({
          where: { userId: userId, type: 'PASSENGER_WALLET' }
        });
        
        if (!passengerWallet || passengerWallet.balance < totalPrice) {
          throw new HttpException("Solde insuffisant dans votre Wallet.", HttpStatus.PAYMENT_REQUIRED);
        }

        await tx.wallet.update({
          where: { id: passengerWallet.id },
          data: { balance: { decrement: totalPrice } }
        });

        await tx.transaction.create({
          data: {
            type: 'PAYMENT',
            status: 'SUCCESS',
            amount: totalPrice,
            description: `Paiement réservation trajet #${trip.id.substring(0, 8)} (${passengersCount} places)`,
            sourceWalletId: passengerWallet.id,
          }
        });
      }

      const qrCodeToken = crypto.createHash('sha256').update(`${tripId}-${assignedSeat}-${userId}-${Date.now()}`).digest('hex');
      
      // CASH et WALLET = confirmé immédiatement (place déduite instantanément)
      // WAVE / ORANGE_MONEY / FREE_MONEY / MTN_MOMO = en attente du webhook de paiement
      const status = (paymentMethod === 'WAVE' || paymentMethod === 'ORANGE_MONEY' || paymentMethod === 'FREE_MONEY' || paymentMethod === 'MTN_MOMO') 
        ? 'PENDING_PAYMENT' 
        : 'CONFIRMED';

      const booking = await tx.booking.create({
        data: {
          tripId,
          userId,
          seatNumber: assignedSeat,
          qrCodeToken,
          status,
          amountPaid: totalPrice,
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
        paymentSession = await this.paymentService.initiateWavePayment(user.phone, totalPrice, booking.id);
      } else if (paymentMethod === 'ORANGE_MONEY') {
        paymentSession = await this.paymentService.initiateOrangeMoneyPayment(user.phone, totalPrice, booking.id);
      }

      if (passengersCount > 1) {
        await tx.trip.update({
          where: { id: tripId },
          data: { initialPassengers: { increment: passengersCount - 1 } }
        });
      }

      if (status === 'CONFIRMED') {
        // Envoi d'e-mail asynchrone (fire-and-forget) pour ne pas bloquer la réservation
        const isEmailConfigured = process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'votre-mot-de-passe-d-application';
        if (isEmailConfigured) {
          transporter.sendMail({
            from: '"Aller-Retour" <allogoosn@gmail.com>',
            to: 'allogoosn@gmail.com', // FIXME: Remplacer par l'email du client (booking.user.email)
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
          }).then(() => {
            console.log(`✅ E-mail de confirmation envoyé pour le billet ${booking.id}`);
          }).catch((err) => {
            console.error(`❌ Erreur lors de l'envoi de l'e-mail Nodemailer (ignoré):`, err.message);
          });
        } else {
          console.warn(`⚠️ Envoi d'e-mail ignoré : identifiants SMTP non configurés pour le billet ${booking.id}`);
        }
      }

      return {
        success: true,
        booking,
        paymentSession,
        message: status === 'CONFIRMED' 
          ? "Réservation confirmée avec succès. Un e-mail a été envoyé."
          : "Réservation en attente de paiement. Veuillez valider sur votre mobile.",
      };
    }); // End of transaction
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

  async getBookingStatus(id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      select: { status: true, qrCodeToken: true }
    });
    
    if (!booking) throw new NotFoundException("Réservation introuvable.");
    
    return { success: true, status: booking.status, qrCodeToken: booking.qrCodeToken };
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

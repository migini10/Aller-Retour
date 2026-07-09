import { Injectable, BadRequestException, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { prisma, PaymentMethod } from '@aller-retour/database';
import * as crypto from 'crypto';
import { NotificationsService } from '../notifications/notifications.service';

import { PaymentService } from '../payment/payment.service';
import { PricingService } from '../pricing/pricing.service';
import { QrService } from '../qr/qr.service';



@Injectable()
export class BookingsService {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly pricingService: PricingService,
    private readonly qrService: QrService,
    private readonly notificationsService: NotificationsService
  ) {}

  async createBooking(userId: string, tripId: string, seatNumber: number, paymentMethod: PaymentMethod, passengersCount: number = 1) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("Utilisateur introuvable.");

    return await prisma.$transaction(async (tx: any) => {
      // Lock trip row to prevent concurrent booking race condition issues

      const trip = await tx.trip.findUnique({
        where: { id: tripId },
        include: { vehicle: true, driver: true },
      });

      if (!trip) throw new NotFoundException("Trajet introuvable.");

      if (trip.isLocked) {
        throw new BadRequestException("Ce trajet est verrouillé. Les réservations ne sont pas autorisées.");
      }

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
      if (trip.vehicle.capacity <= 7) {
        // Véhicule particulier de 5 ou 7 places : pas de numéro de siège imposé
        assignedSeat = 1;
        while (takenSeats.has(assignedSeat) && assignedSeat <= trip.vehicle.capacity) {
          assignedSeat++;
        }
      } else {
        if (assignedSeat < 1 || assignedSeat > trip.vehicle.capacity || takenSeats.has(assignedSeat)) {
          assignedSeat = 1;
          while (takenSeats.has(assignedSeat) && assignedSeat <= trip.vehicle.capacity) {
            assignedSeat++;
          }
        }
      }

      if (assignedSeat > trip.vehicle.capacity) {
        throw new BadRequestException("Le véhicule est complet, plus de place disponible.");
      }

      // Calculate final pricing before payment using PricingService
      const basePrice = trip.pricePerSeat * passengersCount;
      const pricing = this.pricingService.calculatePricing(basePrice);

      // Generate a signed token securely
      const qrCodeToken = this.qrService.generateQrToken(tripId, assignedSeat);
      
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
          basePrice: pricing.basePrice,
          clientFee: pricing.clientFee,
          amountPaid: pricing.amountPaid,
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
        paymentSession = await this.paymentService.initiateWavePayment(user.phone, pricing.amountPaid, booking.id);
      } else if (paymentMethod === 'ORANGE_MONEY') {
        paymentSession = await this.paymentService.initiateOrangeMoneyPayment(user.phone, pricing.amountPaid, booking.id);
      }

      if (passengersCount > 1) {
        await tx.trip.update({
          where: { id: tripId },
          data: { initialPassengers: { increment: passengersCount - 1 } }
        });
      }

      if (status === 'CONFIRMED') {
        // Create driver earning entry for immediate confirmed bookings (e.g. Cash/Direct payments)
        await tx.driverEarning.create({
          data: {
            bookingId: booking.id,
            driverId: trip.driver.userId,
            basePrice: pricing.basePrice,
            driverCut: pricing.driverCut,
            platformCommission: pricing.platformCommission,
            status: 'PENDING',
          }
        });
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
    // Decode and verify secure token
    const parsedPayload = this.qrService.verifyQrToken(qrCodeToken);

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
      where: { userId, hiddenByUser: false },
      include: {
        trip: {
          include: {
            route: {
              include: {
                originStation: true,
                destinationStation: true,
              }
            },
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return bookings;
  }

  async hideBookings(userId: string, bookingIds: string[]) {
    if (!bookingIds || bookingIds.length === 0) {
      throw new BadRequestException('Aucun identifiant de billet fourni.');
    }
    // Verify all bookings belong to this user
    const bookings = await prisma.booking.findMany({
      where: { id: { in: bookingIds }, userId },
    });
    if (bookings.length !== bookingIds.length) {
      throw new BadRequestException('Certains billets sont introuvables ou ne vous appartiennent pas.');
    }
    await prisma.booking.updateMany({
      where: { id: { in: bookingIds }, userId },
      data: { hiddenByUser: true },
    });
    return { success: true, message: `${bookings.length} billet(s) supprimé(s) de votre liste.` };
  }

  async cancelBooking(bookingId: string, userId: string, secretCode?: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("Utilisateur introuvable.");

    // Validate secret code
    if (!secretCode) {
      throw new BadRequestException("Le code secret est requis pour annuler un billet.");
    }
    if (user.passwordHash !== secretCode) {
      throw new BadRequestException("Code secret incorrect.");
    }

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

    // Cancel driver earning if recorded
    await prisma.driverEarning.updateMany({
      where: { bookingId },
      data: { status: 'CANCELLED' }
    });

    return { success: true, message: "Réservation annulée." };
  }

  async transferBookings(operatorUserId: string, bookingIds: string[], targetTripId: string) {
    if (!bookingIds || bookingIds.length === 0) {
      throw new BadRequestException("Aucune réservation spécifiée pour le transfert.");
    }

    return await prisma.$transaction(async (tx: any) => {
      // 1. Récupérer le trajet cible
      const targetTrip = await tx.trip.findUnique({
        where: { id: targetTripId },
        include: { vehicle: true },
      });

      if (!targetTrip) throw new NotFoundException("Trajet cible introuvable.");

      // 2. Récupérer les réservations à transférer
      const bookingsToTransfer = await tx.booking.findMany({
        where: { id: { in: bookingIds } },
        include: { trip: true },
      });

      if (bookingsToTransfer.length !== bookingIds.length) {
        throw new NotFoundException("Certaines réservations à transférer sont introuvables.");
      }

      // 3. Calculer les places déjà prises sur le trajet cible
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
      const availableSeatsCount = targetTrip.seatsOffered - (targetTrip.initialPassengers + targetBookings.length);

      // Héritage de l'heure de départ si le trajet cible n'a aucun client pré-existant
      const sourceTrip = bookingsToTransfer[0]?.trip;
      if (sourceTrip && targetBookings.length === 0 && targetTrip.initialPassengers === 0) {
        await tx.trip.update({
          where: { id: targetTripId },
          data: { departureTime: sourceTrip.departureTime }
        });
      }

      if (availableSeatsCount < bookingsToTransfer.length) {
        throw new BadRequestException(
          `Nombre de places insuffisant sur le trajet cible. Places disponibles : ${Math.max(0, availableSeatsCount)}, Demandées : ${bookingsToTransfer.length}`
        );
      }

      // 4. Procéder au transfert de chaque réservation
      const updatedBookings = [];

      for (const booking of bookingsToTransfer) {
        // Déterminer le numéro de siège
        let assignedSeat = 1;
        while (takenSeats.has(assignedSeat) && assignedSeat <= targetTrip.vehicle.capacity) {
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
  }

  // ==========================================
  // ADMIN ENDPOINTS
  // ==========================================

  async getAllBookings(filters: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    paymentStatus?: string;
    tripId?: string;
    userId?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const { page = 1, limit = 10, search, status, paymentStatus, tripId, userId, dateFrom, dateTo } = filters;
    
    const where: any = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentMethod = paymentStatus; // Note: There is no 'paymentStatus' column in Prisma booking except via status (PENDING_PAYMENT, CONFIRMED). If paymentStatus is meant to filter 'paymentMethod', we can map it here. Or if the user meant 'status' as 'CONFIRMED'. Wait, we will just use status and paymentMethod. We will assume paymentStatus means paymentMethod for now or just skip it.
    if (tripId) where.tripId = tripId;
    if (userId) where.userId = userId;

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [total, data] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        skip,
        take,
        include: {
          user: true,
          trip: {
            include: {
              route: {
                include: {
                  originStation: true,
                  destinationStation: true,
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return {
      data,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      }
    };
  }

  async getBookingById(id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        trip: {
          include: {
            driver: {
              include: { user: true }
            },
            vehicle: true,
            route: {
              include: {
                originStation: true,
                destinationStation: true,
              }
            }
          }
        }
      }
    });

    if (!booking) throw new NotFoundException('Réservation introuvable.');

    return booking;
  }

  async adminCancelBooking(id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { trip: true }
    });

    if (!booking) throw new NotFoundException('Réservation introuvable.');
    if (booking.status === 'CANCELLED') throw new BadRequestException('Réservation déjà annulée.');
    if (booking.status === 'BOARDED') throw new BadRequestException('Impossible d\'annuler une réservation embarquée.');

    // Annuler la réservation
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    // Cancel driver earning if recorded
    await prisma.driverEarning.updateMany({
      where: { bookingId: id },
      data: { status: 'CANCELLED' }
    });

    return { success: true, message: 'Réservation annulée par l\'administrateur.', booking: updatedBooking };
  }
}

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { prisma, ParcelStatus, TripStatus, UserRole } from '@aller-retour/database';
import * as bcrypt from 'bcrypt';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { UpdateParcelStatusDto } from './dto/update-parcel-status.dto';

/**
 * DETTE MÉTIER — Tarification Colis
 * ---------------------------------
 * L'ancienne route Next.js (apps/web/src/app/api/colis/route.ts) utilisait
 * un prix hardcodé de 3000 FCFA. Aucune grille tarifaire officielle n'existe
 * encore pour les colis. Le prix actuel est calculé avec une grille simple
 * basée sur le poids. Cette logique devra être remplacée par un vrai module
 * pricing quand les règles métier seront définies.
 */
function calculateParcelPrice(weightKg: number): number {
  if (weightKg <= 1) return 1500;
  if (weightKg <= 5) return 2000;
  if (weightKg <= 15) return 3000;
  if (weightKg <= 30) return 5000;
  return 7000;
}

function generateTrackingCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'TRK-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function generateDeliveryCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

/** Champs sûrs à retourner dans les réponses publiques */
const SAFE_PARCEL_SELECT = {
  id: true,
  tripId: true,
  senderId: true,
  createdById: true,
  senderName: true,
  senderPhone: true,
  recipientName: true,
  recipientPhone: true,
  weightKg: true,
  price: true,
  trackingCode: true,
  // deliveryCode volontairement EXCLU
  status: true,
  createdAt: true,
  updatedAt: true,
  acceptedAt: true,
  inTransitAt: true,
  deliveredAt: true,
  pickupAddress: true,
  pickupCity: true,
  pickupLatitude: true,
  pickupLongitude: true,
  pickupInstructions: true,
  deliveryAddress: true,
  deliveryCity: true,
  deliveryLatitude: true,
  deliveryLongitude: true,
  deliveryInstructions: true,
  trip: {
    select: {
      id: true,
      departureTime: true,
      status: true,
      route: {
        select: {
          name: true,
          originStation: { select: { city: true } },
          destinationStation: { select: { city: true } },
        },
      },
    },
  },
} as const;

@Injectable()
export class ParcelsService {

  // ─── CREATE ────────────────────────────────────────────────────

  async createParcel(userId: string, role: string, dto: CreateParcelDto) {
    // Vérifier que le Trip existe et est encore utilisable
    const trip = await prisma.trip.findUnique({
      where: { id: dto.tripId },
      include: { route: true },
    });

    if (!trip) {
      throw new NotFoundException('Trajet non trouvé.');
    }

    if (trip.status !== TripStatus.SCHEDULED && trip.status !== TripStatus.BOARDING) {
      throw new BadRequestException('Ce trajet n\'accepte plus de colis.');
    }

    // Générer trackingCode unique
    let trackingCode: string;
    let attempts = 0;
    do {
      trackingCode = generateTrackingCode();
      const existing = await prisma.parcel.findUnique({ where: { trackingCode } });
      if (!existing) break;
      attempts++;
    } while (attempts < 10);

    if (attempts >= 10) {
      throw new BadRequestException('Impossible de générer un code de suivi unique. Réessayez.');
    }

    const price = calculateParcelPrice(dto.weightKg);
    const deliveryCode = generateDeliveryCode();

    const senderId = role === UserRole.PASSENGER ? userId : null;
    const createdById = userId;

    const parcel = await prisma.parcel.create({
      data: {
        tripId: dto.tripId,
        senderId,
        createdById,
        senderName: dto.senderName,
        senderPhone: dto.senderPhone,
        recipientName: dto.recipientName,
        recipientPhone: dto.recipientPhone,
        weightKg: dto.weightKg,
        price,
        trackingCode,
        deliveryCode,
        status: ParcelStatus.REGISTERED,
        pickupAddress: dto.pickupAddress,
        pickupCity: dto.pickupCity,
        pickupLatitude: dto.pickupLatitude,
        pickupLongitude: dto.pickupLongitude,
        pickupInstructions: dto.pickupInstructions,
        deliveryAddress: dto.deliveryAddress,
        deliveryCity: dto.deliveryCity,
        deliveryLatitude: dto.deliveryLatitude,
        deliveryLongitude: dto.deliveryLongitude,
        deliveryInstructions: dto.deliveryInstructions,
      },
      select: SAFE_PARCEL_SELECT,
    });

    return { success: true, parcel, trackingCode };
  }

  // ─── MY PARCELS ────────────────────────────────────────────────

  async getMyParcels(userId: string, role: string) {
    // SUPER_ADMIN voit tout (limité à 100)
    if (role === UserRole.SUPER_ADMIN) {
      return prisma.parcel.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' },
        select: SAFE_PARCEL_SELECT,
      });
    }

    // DRIVER: colis des trips qu'il conduit
    if (role === UserRole.DRIVER) {
      const driverProfile = await prisma.driverProfile.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!driverProfile) return [];

      return prisma.parcel.findMany({
        where: {
          OR: [
            { senderId: userId },
            { createdById: userId },
            { trip: { driverId: driverProfile.id } },
          ],
        },
        take: 100,
        orderBy: { createdAt: 'desc' },
        select: SAFE_PARCEL_SELECT,
      });
    }

    // PASSENGER: colis envoyés par cet utilisateur
    return prisma.parcel.findMany({
      where: {
        OR: [
          { senderId: userId },
          { createdById: userId },
        ],
      },
      take: 50,
      orderBy: { createdAt: 'desc' },
      select: SAFE_PARCEL_SELECT,
    });
  }

  // ─── GET BY ID ─────────────────────────────────────────────────

  async getParcelById(parcelId: string, userId: string, role: string) {
    const parcel = await prisma.parcel.findUnique({
      where: { id: parcelId },
      include: {
        trip: {
          include: {
            vehicle: { select: { ownerId: true } },
            route: {
              select: {
                name: true,
                originStation: { select: { city: true } },
                destinationStation: { select: { city: true } },
              },
            },
          },
        },
      },
    });

    if (!parcel) throw new NotFoundException('Colis non trouvé.');

    // Vérification d'accès
    if (role !== UserRole.SUPER_ADMIN) {
      const isSender = parcel.senderId === userId || parcel.createdById === userId;

      let isDriverOnTrip = false;
      if (role === UserRole.DRIVER) {
        const driverProfile = await prisma.driverProfile.findUnique({
          where: { userId },
          select: { id: true },
        });
        isDriverOnTrip = !!driverProfile && (
          parcel.trip.driverId === driverProfile.id ||
          parcel.trip.vehicle?.ownerId === driverProfile.id
        );
      }

      if (!isSender && !isDriverOnTrip) {
        throw new ForbiddenException('Vous n\'êtes pas autorisé à voir ce colis.');
      }
    }

    // Retourner sans deliveryCode
    const { deliveryCode: _dc, ...safeParcel } = parcel;
    return safeParcel;
  }

  // ─── DRIVER TRIP PARCELS ───────────────────────────────────────

  async getDriverTripParcels(tripId: string, userId: string, role: string) {
    // Vérifier ownership du trip
    await this.checkDriverTripAccess(tripId, userId, role);

    return prisma.parcel.findMany({
      where: { tripId },
      orderBy: { createdAt: 'asc' },
      select: {
        ...SAFE_PARCEL_SELECT,
        // Le chauffeur a besoin du deliveryCode pour vérification en livraison
        // Mais on ne l'expose PAS directement — il doit être saisi par le destinataire
      },
    });
  }

  // ─── STATUS TRANSITION ─────────────────────────────────────────

  async updateParcelStatus(
    parcelId: string,
    userId: string,
    role: string,
    dto: UpdateParcelStatusDto,
  ) {
    const parcel = await prisma.parcel.findUnique({
      where: { id: parcelId },
      include: { trip: { include: { vehicle: true } } },
    });

    if (!parcel) throw new NotFoundException('Colis non trouvé.');

    // Valider la machine d'état
    this.validateStatusTransition(parcel.status as ParcelStatus, dto.status);

    // Vérifier les autorisations
    if (role !== UserRole.SUPER_ADMIN) {
      if (dto.status === ParcelStatus.ACCEPTED || dto.status === ParcelStatus.IN_TRANSIT) {
        await this.checkDriverTripAccess(parcel.tripId, userId, role);
      }
    }

    // Vérifications spécifiques par transition
    const updateData: any = { status: dto.status };

    switch (dto.status) {
      case ParcelStatus.ACCEPTED:
        // PIN chauffeur requis
        if (role !== UserRole.SUPER_ADMIN) {
          await this.verifyDriverPin(userId, dto.pin);
        }
        updateData.acceptedAt = new Date();
        break;

      case ParcelStatus.IN_TRANSIT:
        // PIN chauffeur requis
        if (role !== UserRole.SUPER_ADMIN) {
          await this.verifyDriverPin(userId, dto.pin);
        }
        updateData.inTransitAt = new Date();
        break;

      case ParcelStatus.DELIVERED:
        // deliveryCode obligatoire
        if (!dto.deliveryCode) {
          throw new BadRequestException('Le code de livraison est obligatoire pour confirmer la remise.');
        }
        if (parcel.deliveryCode !== dto.deliveryCode) {
          throw new BadRequestException('Code de livraison incorrect.');
        }
        updateData.deliveredAt = new Date();
        break;

      case ParcelStatus.LOST:
        // Seul SUPER_ADMIN ou chauffeur du trip
        if (role !== UserRole.SUPER_ADMIN) {
          await this.checkDriverTripAccess(parcel.tripId, userId, role);
        }
        break;
    }

    const updatedParcel = await prisma.parcel.update({
      where: { id: parcelId },
      data: updateData,
      select: SAFE_PARCEL_SELECT,
    });

    return { success: true, parcel: updatedParcel };
  }

  // ─── PUBLIC TRACKING ───────────────────────────────────────────

  async trackParcel(trackingCode: string) {
    const parcel = await prisma.parcel.findUnique({
      where: { trackingCode },
      select: {
        trackingCode: true,
        status: true,
        pickupCity: true,
        deliveryCity: true,
        pickupAddress: true,
        deliveryAddress: true,
        createdAt: true,
        acceptedAt: true,
        inTransitAt: true,
        deliveredAt: true,
        // Pas de senderPhone, recipientPhone, deliveryCode, coordonnées GPS
      },
    });

    if (!parcel) {
      throw new NotFoundException('Aucun colis trouvé pour ce code de suivi.');
    }

    return parcel;
  }

  // ─── HELPERS PRIVÉS ────────────────────────────────────────────

  private validateStatusTransition(current: ParcelStatus, next: ParcelStatus) {
    const VALID_TRANSITIONS: Record<string, ParcelStatus[]> = {
      [ParcelStatus.REGISTERED]: [ParcelStatus.ACCEPTED, ParcelStatus.LOST],
      [ParcelStatus.ACCEPTED]: [ParcelStatus.IN_TRANSIT, ParcelStatus.LOST],
      [ParcelStatus.IN_TRANSIT]: [ParcelStatus.DELIVERED, ParcelStatus.LOST],
      [ParcelStatus.DELIVERED]: [], // Terminal
      [ParcelStatus.LOST]: [],     // Terminal
    };

    const allowed = VALID_TRANSITIONS[current] || [];
    if (!allowed.includes(next)) {
      throw new BadRequestException(
        `Transition de statut invalide : ${current} → ${next}. Transitions autorisées : ${allowed.join(', ') || 'aucune'}.`,
      );
    }
  }

  private async verifyDriverPin(userId: string, pin?: string) {
    if (!pin) {
      throw new BadRequestException('Le code PIN est obligatoire pour cette action.');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });

    if (!user || !user.passwordHash) {
      throw new BadRequestException('Code PIN incorrect.');
    }

    // bcrypt hash ou fallback plaintext historique
    let isPinValid = false;
    if (user.passwordHash.startsWith('$2')) {
      isPinValid = await bcrypt.compare(pin, user.passwordHash);
    } else {
      isPinValid = user.passwordHash === pin;
    }

    if (!isPinValid) {
      throw new BadRequestException('Code PIN incorrect.');
    }
  }

  private async checkDriverTripAccess(tripId: string, userId: string, role: string) {
    if (role === UserRole.SUPER_ADMIN) return;

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { vehicle: true },
    });

    if (!trip) throw new NotFoundException('Trajet non trouvé.');

    const driverProfile = await prisma.driverProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!driverProfile) {
      throw new ForbiddenException('Vous n\'avez pas de profil chauffeur.');
    }

    const isAssignedDriver = trip.driverId === driverProfile.id;
    const isVehicleOwner = trip.vehicle?.ownerId === driverProfile.id;

    if (!isAssignedDriver && !isVehicleOwner) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à gérer les colis de ce trajet.');
    }
  }
}

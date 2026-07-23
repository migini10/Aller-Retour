import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { prisma, TripStatus, DriverType, UserRole, DriverOperationalStatus } from '@aller-retour/database';
import * as bcrypt from 'bcrypt';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { SearchTripsDto } from './dto/search-trips.dto';

@Injectable()
export class TripsService {

  private mapToDatabaseCity(inputCity?: string): string | undefined {
    if (!inputCity) return undefined;
    
    const cleanInput = inputCity.split(',')[0].trim().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
      
    const databaseCities = [
      'Dakar', 'Touba', 'Thiès', 'Mbour', 'Saint-Louis', 
      'Kaolack', 'Ziguinchor', 'Tambacounda', 'Diourbel', 'Louga'
    ];
    
    for (const dbCity of databaseCities) {
      const cleanDb = dbCity.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");
        
      if (cleanInput.includes(cleanDb) || cleanDb.includes(cleanInput)) {
        return dbCity;
      }
    }
    
    return inputCity.split(',')[0].trim();
  }

  private async getStation(cityName: string) {
    let station = await prisma.station.findFirst({ where: { city: cityName } });
    if (!station) {
      station = await prisma.station.create({ 
        data: { name: `Gare ${cityName}`, city: cityName, country: 'SN', latitude: 14.6, longitude: -17.4 } 
      });
    }
    return station.id;
  }

  private async getRoute(originCity: string, destinationCity: string, originId: string, destId: string) {
    let route = await prisma.route.findFirst({ where: { originStationId: originId, destinationStationId: destId } });
    if (!route) {
      route = await prisma.route.create({
        data: { name: `${originCity} - ${destinationCity}`, originStationId: originId, destinationStationId: destId, distanceKm: 200, estimatedDurationMins: 180, defaultPrice: 5000 }
      });
    }
    return route.id;
  }

  async searchTrips(dto: SearchTripsDto) {
    const { originCity, destinationCity, date, limit } = dto;
    const whereClause: any = {
      status: TripStatus.SCHEDULED,
      isLocked: false,
    };

    if (originCity && destinationCity) {
      const cleanOrigin = this.mapToDatabaseCity(originCity);
      const cleanDest = this.mapToDatabaseCity(destinationCity);
      
      const routes = await prisma.route.findMany({
        where: {
          originStation: { city: cleanOrigin },
          destinationStation: { city: cleanDest },
        },
        select: { id: true }
      });
      
      if (routes.length > 0) {
        whereClause.routeId = { in: routes.map(r => r.id) };
      } else {
        return []; 
      }
    }

    const now = new Date();

    if (date) {
      const startOfDay = new Date(date);
      if (!isNaN(startOfDay.getTime())) {
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);
        endOfDay.setUTCHours(23, 59, 59, 999);
        
        const effectiveStart = startOfDay.getTime() < now.getTime() ? now : startOfDay;
        whereClause.departureTime = { gte: effectiveStart, lte: endOfDay };
      }
    } else {
      whereClause.departureTime = { gte: now };
    }

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const trips = await prisma.trip.findMany({
      where: whereClause,
      take: limit ? Number(limit) : 50,
      include: {
        route: {
          include: {
            originStation: true,
            destinationStation: true,
          },
        },
        vehicle: { select: { plateNumber: true, type: true, capacity: true, approvalStatus: true, certificationStatus: true } },
        driver: { select: { user: { select: { phone: true, fullName: true } } } },
        bookings: { 
          select: { id: true },
          where: { 
            OR: [
              { status: { in: ['CONFIRMED', 'BOARDED'] } },
              { status: 'PENDING_PAYMENT', createdAt: { gt: fiveMinutesAgo } }
            ]
          }
        },
      },
      orderBy: [
        { vehicle: { certificationStatus: 'asc' } },
        { departureTime: 'asc' }
      ],
    });

    return trips.map((trip) => {
      const bookedSeats = trip.bookings.length;
      const totalPassengers = trip.initialPassengers + bookedSeats;
      return {
        ...trip,
        availableSeats: Math.max(0, trip.seatsOffered - totalPassengers),
        passagers: totalPassengers,
        placesPrises: totalPassengers,
        seatsOffered: trip.seatsOffered,
        initialPassengers: trip.initialPassengers,
        driverName: trip.driver?.user?.fullName || null,
        driverPhone: trip.driver?.user?.phone || null,
        isCertified: trip.vehicle?.certificationStatus === 'CERTIFIED',
      };
    });
  }

  async findAllAdmin(query: any) {
    const { page = 1, limit = 50, search, status, date } = query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const where: any = {};
    if (status) where.status = status;
    if (date) {
      const startOfDay = new Date(date);
      if (!isNaN(startOfDay.getTime())) {
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(startOfDay);
        endOfDay.setUTCHours(23, 59, 59, 999);
        where.departureTime = { gte: startOfDay, lte: endOfDay };
      }
    }
    
    if (search) {
      where.OR = [
        { route: { originStation: { city: { contains: search, mode: 'insensitive' } } } },
        { route: { destinationStation: { city: { contains: search, mode: 'insensitive' } } } },
        { driver: { user: { fullName: { contains: search, mode: 'insensitive' } } } },
        { vehicle: { plateNumber: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const [total, trips] = await Promise.all([
      prisma.trip.count({ where }),
      prisma.trip.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          route: { include: { originStation: true, destinationStation: true } },
          vehicle: { select: { plateNumber: true, type: true, capacity: true } },
          driver: { select: { user: { select: { phone: true, fullName: true } } } },
          bookings: { select: { id: true } }
        },
        orderBy: { departureTime: 'desc' }
      })
    ]);

    const formattedTrips = trips.map((trip) => {
      const bookedSeats = trip.bookings.length;
      const totalPassengers = trip.initialPassengers + bookedSeats;
      return {
        ...trip,
        availableSeats: Math.max(0, trip.seatsOffered - totalPassengers),
        passagers: totalPassengers,
        placesPrises: totalPassengers,
        seatsOffered: trip.seatsOffered,
        initialPassengers: trip.initialPassengers,
        driverName: trip.driver?.user?.fullName || null,
        driverPhone: trip.driver?.user?.phone || null,
      };
    });

    return {
      data: formattedTrips,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  async getAdminTripDetails(tripId: string) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        route: { include: { originStation: true, destinationStation: true } },
        vehicle: { select: { plateNumber: true, type: true, capacity: true } },
        driver: { select: { user: { select: { phone: true, fullName: true } } } },
        createdBy: { select: { user: { select: { phone: true, fullName: true } } } },
        paymentRecipient: { select: { user: { select: { phone: true, fullName: true } } } },
        bookings: { 
          where: { status: { in: ['CONFIRMED', 'BOARDED'] } },
          include: { user: { select: { fullName: true, phone: true } } },
          orderBy: { seatNumber: 'asc' } 
        }
      }
    });

    if (!trip) {
      throw new NotFoundException('Trajet introuvable');
    }

    const totalRevenue = trip.bookings.reduce((sum, b) => sum + (b.amountPaid || 0), 0);
    const bookedSeats = trip.bookings.length;
    const totalPassengers = trip.initialPassengers + bookedSeats;

    return {
      tripId: trip.id,
      departureCity: trip.route?.originStation?.city || '',
      arrivalCity: trip.route?.destinationStation?.city || '',
      departureTime: trip.departureTime,
      totalSeats: trip.seatsOffered,
      availableSeats: Math.max(0, trip.seatsOffered - totalPassengers),
      totalRevenue,
      status: trip.status,
      driverName: trip.driver?.user?.fullName || null,
      driverPhone: trip.driver?.user?.phone || null,
      createdByName: trip.createdBy?.user?.fullName || null,
      createdByPhone: trip.createdBy?.user?.phone || null,
      paymentRecipientName: trip.paymentRecipient?.user?.fullName || null,
      paymentRecipientPhone: trip.paymentRecipient?.user?.phone || null,
      vehiclePlateNumber: trip.vehicle?.plateNumber || null,
      passengers: trip.bookings.map(b => ({
        bookingId: b.id,
        seatNumber: b.seatNumber,
        passengerName: b.user?.fullName,
        passengerPhone: b.user?.phone,
        status: b.status,
      }))
    };
  }

  async findDriverTrips(userId: string, query: any) {
    const driverProfile = await prisma.driverProfile.findUnique({
      where: { userId }
    });

    if (!driverProfile) {
      throw new ForbiddenException("Vous n'avez pas de profil chauffeur.");
    }

    const trips = await prisma.trip.findMany({
      where: { driverId: driverProfile.id },
      include: {
        route: { include: { originStation: true, destinationStation: true } },
        vehicle: { select: { plateNumber: true, type: true, capacity: true } },
        bookings: { select: { id: true, status: true, amountPaid: true } }
      },
      orderBy: { departureTime: 'desc' }
    });

    return trips.map((trip) => {
      const bookedSeats = trip.bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'BOARDED').length;
      const totalPassengers = trip.initialPassengers + bookedSeats;
      return {
        ...trip,
        availableSeats: Math.max(0, trip.seatsOffered - totalPassengers),
        passagers: totalPassengers,
        placesPrises: totalPassengers,
        seatsOffered: trip.seatsOffered,
        initialPassengers: trip.initialPassengers,
        originCity: trip.route?.originStation?.city || '',
        destinationCity: trip.route?.destinationStation?.city || '',
        vehiclePlateNumber: trip.vehicle?.plateNumber || null,
      };
    });
  }

  async getManifest(tripId: string, userId: string, role: string) {
    await this.checkTripOwnership(tripId, userId, role);

    const bookings = await prisma.booking.findMany({
      where: { tripId, status: { in: ['CONFIRMED', 'BOARDED'] } },
      include: { user: { select: { fullName: true, phone: true } } },
      orderBy: { seatNumber: 'asc' },
    });

    return {
      tripId,
      totalPassengers: bookings.length,
      tickets: bookings.map(b => ({
        id: b.id,
        seatNumber: b.seatNumber,
        passengerName: b.user.fullName,
        passengerPhone: b.user.phone,
        qrCodeToken: b.qrCodeToken,
        status: b.status,
      })),
    };
  }

  async createAlloDakarTrip(userId: string, dto: CreateTripDto) {
    if (dto.originCity.trim().toLowerCase() === dto.destinationCity.trim().toLowerCase()) {
      throw new BadRequestException("La ville de départ et la ville d'arrivée ne peuvent pas être identiques.");
    }

    const driverProfile = await prisma.driverProfile.findUnique({
      where: { userId },
      include: { vehicles: true }
    });

    if (!driverProfile) {
      throw new ForbiddenException("Vous n'avez pas de profil chauffeur.");
    }

    const vehicleId = dto.vehicleId;
    if (!vehicleId) {
      throw new BadRequestException("L'identifiant du véhicule est obligatoire.");
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    });

    if (!vehicle || vehicle.approvalStatus !== 'APPROVED') {
      if (vehicle?.approvalStatus === 'PENDING_REVIEW') {
        throw new BadRequestException("Votre véhicule est en attente de validation.");
      }
      if (vehicle?.approvalStatus === 'REJECTED') {
        throw new BadRequestException("Votre véhicule a été rejeté.");
      }
      throw new BadRequestException("Ce véhicule n'est pas approuvé pour effectuer des trajets.");
    }

    if (vehicle.deletedAt !== null) {
      throw new BadRequestException("Ce véhicule a été supprimé.");
    }

    if (vehicle.photosRenewalStatus === 'EXPIRED') {
      throw new BadRequestException("Les photos de votre véhicule ont expiré. Veuillez les renouveler pour créer un trajet.");
    }

    const paymentRecipientId = driverProfile.type === DriverType.OWNER ? driverProfile.id : driverProfile.managerId;

    if (!paymentRecipientId) {
      throw new ForbiddenException("Erreur de profil: aucun manager assigné.");
    }

    if (vehicle.ownerId !== paymentRecipientId) {
      throw new ForbiddenException("Ce véhicule n'appartient pas à votre flotte.");
    }

    if ((dto.placesLibres || 4) > vehicle.capacity - 1) {
      throw new BadRequestException("Le nombre de places passagers dépasse la capacité autorisée du véhicule.");
    }

    let finalDriverId = driverProfile.id;

    if (driverProfile.type === DriverType.OWNER && dto.assignedDriverId) {
      const assignedDriver = await prisma.driverProfile.findUnique({
        where: { id: dto.assignedDriverId }
      });

      if (!assignedDriver || assignedDriver.managerId !== driverProfile.id) {
        throw new ForbiddenException("Le chauffeur assigné n'est pas sous votre gestion.");
      }
      finalDriverId = assignedDriver.id;
    } else if (driverProfile.type === DriverType.ASSIGNED && dto.assignedDriverId && dto.assignedDriverId !== driverProfile.id) {
      throw new ForbiddenException("Vous ne pouvez pas assigner un autre chauffeur.");
    }

    const [originId, destinationId] = await Promise.all([
      this.getStation(dto.originCity),
      this.getStation(dto.destinationCity)
    ]);

    const routeId = await this.getRoute(dto.originCity, dto.destinationCity, originId, destinationId);

    const trip = await prisma.trip.create({
      data: {
        routeId,
        vehicleId: vehicleId,
        driverId: finalDriverId,
        createdByDriverId: driverProfile.id,
        paymentRecipientId: paymentRecipientId,
        departureTime: dto.departureTime ? new Date(dto.departureTime) : new Date(),
        pricePerSeat: dto.pricePerSeat || 5000,
        isMarketplace: true,
        seatsOffered: dto.placesLibres || 4,
        initialPassengers: dto.passagers || 0,
        status: TripStatus.SCHEDULED
      }
    });

    return { success: true, trip };
  }

  private async checkTripOwnership(tripId: string, userId: string, role: string) {
    if (role === UserRole.SUPER_ADMIN) return true;

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { vehicle: true }
    });

    if (!trip) throw new NotFoundException('Trajet non trouvé');

    const driverProfile = await prisma.driverProfile.findUnique({
      where: { userId }
    });

    const isOwner = trip.vehicle.ownerId === driverProfile?.id;
    const isAssigned = trip.driverId === driverProfile?.id;

    if (!driverProfile || (!isOwner && !isAssigned)) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à modifier ce trajet.");
    }

    return true;
  }

  async updateTrip(tripId: string, userId: string, role: string, dto: UpdateTripDto) {
    if (dto.originCity && dto.destinationCity && dto.originCity.trim().toLowerCase() === dto.destinationCity.trim().toLowerCase()) {
      throw new BadRequestException("La ville de départ et la ville d'arrivée ne peuvent pas être identiques.");
    }

    await this.checkTripOwnership(tripId, userId, role);

    const data: any = {};
    
    if (dto.originCity && dto.destinationCity) {
      const [originId, destinationId] = await Promise.all([
        this.getStation(dto.originCity),
        this.getStation(dto.destinationCity)
      ]);
      data.routeId = await this.getRoute(dto.originCity, dto.destinationCity, originId, destinationId);
    }

    if (dto.vehicleId) {
      const driverProfile = await prisma.driverProfile.findUnique({ where: { userId } });
      const vehicle = await prisma.vehicle.findUnique({ where: { id: dto.vehicleId } });
      if (!vehicle || vehicle.ownerId !== driverProfile?.id) {
        throw new ForbiddenException("Ce véhicule ne vous appartient pas.");
      }
      data.vehicleId = dto.vehicleId;
    }

    if (dto.departureTime) data.departureTime = new Date(dto.departureTime);
    if (dto.pricePerSeat) data.pricePerSeat = dto.pricePerSeat;
    if (dto.placesLibres) data.seatsOffered = dto.placesLibres;
    if (dto.passagers !== undefined) data.initialPassengers = dto.passagers;

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data
    });

    return { success: true, trip: updatedTrip };
  }

  async deleteTrip(tripId: string, userId: string, role: string) {
    await this.checkTripOwnership(tripId, userId, role);

    try {
      await prisma.booking.deleteMany({ where: { tripId } });
      await prisma.parcel.deleteMany({ where: { tripId } });
      await prisma.seatLock.deleteMany({ where: { tripId } });
      
      await prisma.trip.delete({
        where: { id: tripId }
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error?.message || 'Erreur lors de la suppression de la mission' };
    }
  }

  async getPopularPrices(origin?: string, destination?: string) {
    if (!origin || !destination) {
      return { prices: [] };
    }

    const o = this.mapToDatabaseCity(origin) || origin;
    const d = this.mapToDatabaseCity(destination) || destination;

    try {
      const popularTrips = await prisma.trip.groupBy({
        by: ['pricePerSeat'],
        where: {
          OR: [
            {
              route: {
                originStation: { city: { equals: o, mode: 'insensitive' } },
                destinationStation: { city: { equals: d, mode: 'insensitive' } },
              }
            },
            {
              route: {
                originStation: { city: { equals: d, mode: 'insensitive' } },
                destinationStation: { city: { equals: o, mode: 'insensitive' } },
              }
            }
          ]
        },
        _count: { pricePerSeat: true },
        orderBy: { _count: { pricePerSeat: 'desc' } },
        take: 2,
      });

      return { prices: popularTrips.map(p => p.pricePerSeat) };
    } catch (error) {
      console.error('Error fetching popular prices:', error);
      return { prices: [] };
    }
  }

  async toggleLock(tripId: string, userId: string, role: string, code?: string) {
    await this.checkTripOwnership(tripId, userId, role);

    const existingTrip = await prisma.trip.findUnique({
      where: { id: tripId }
    });

    if (!existingTrip) {
      throw new NotFoundException('Trajet non trouvé');
    }

    if (!existingTrip.isLocked) {
      if (role !== UserRole.SUPER_ADMIN) {
        if (!code) {
          throw new BadRequestException('Un code PIN de sécurité est requis pour verrouiller le trajet.');
        }
        
        // Fetch the caller user to check their PIN
        const callerUser = await prisma.user.findUnique({
          where: { id: userId },
          select: { passwordHash: true }
        });

        if (!callerUser || !callerUser.passwordHash) {
          throw new BadRequestException('Le code PIN saisi est incorrect.');
        }

        // Compare using bcrypt or plain text fallback (for legacy)
        let isPinValid = false;
        if (callerUser.passwordHash.startsWith('$2')) {
          isPinValid = await bcrypt.compare(code, callerUser.passwordHash);
        } else {
          isPinValid = callerUser.passwordHash === code;
        }

        if (!isPinValid) {
          throw new BadRequestException('Le code PIN saisi est incorrect.');
        }
      }
    }

    const updated = await prisma.trip.update({
      where: { id: tripId },
      data: { isLocked: !existingTrip.isLocked }
    });

    return { success: true, isLocked: updated.isLocked };
  }

  async getTransferTargets(tripId: string, userId: string, role: string) {
    await this.checkTripOwnership(tripId, userId, role);

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { route: true, vehicle: true }
    });

    if (!trip) {
      return [];
    }

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const departureDate = new Date(trip.departureTime);
    const startOfDay = new Date(departureDate.toISOString().split('T')[0] + 'T00:00:00.000Z');
    const endOfDay = new Date(departureDate.toISOString().split('T')[0] + 'T23:59:59.999Z');

    const alternativeTrips = await prisma.trip.findMany({
      where: {
        routeId: trip.routeId,
        id: { not: tripId },
        status: { in: [TripStatus.SCHEDULED, TripStatus.BOARDING] },
        departureTime: { gte: startOfDay, lte: endOfDay }
      },
      take: 50,
      orderBy: { departureTime: 'asc' },
      include: {
        vehicle: { select: { plateNumber: true, type: true, capacity: true } },
        driver: { select: { user: { select: { fullName: true, phone: true } } } },
        bookings: {
          where: {
            OR: [
              { status: { in: ['CONFIRMED', 'BOARDED'] } },
              { status: 'PENDING_PAYMENT', createdAt: { gt: fiveMinutesAgo } }
            ]
          }
        }
      }
    });

    return alternativeTrips.map((alt: any) => {
      const bookedSeats = alt.bookings.length;
      const totalPassengers = alt.initialPassengers + bookedSeats;
      return {
        id: alt.id,
        departureTime: alt.departureTime,
        status: alt.status,
        pricePerSeat: alt.pricePerSeat,
        seatsOffered: alt.seatsOffered,
        initialPassengers: alt.initialPassengers,
        availableSeats: Math.max(0, alt.seatsOffered - totalPassengers),
        driverName: alt.driver?.user?.fullName || 'Chauffeur Inconnu',
        driverPhone: alt.driver?.user?.phone || '',
        plateNumber: alt.vehicle.plateNumber,
        isLocked: alt.isLocked,
      };
    });
  }
  async updateTripStatus(tripId: string, userId: string, role: string, newStatus: TripStatus, pin?: string, forceOverride?: boolean) {
    await this.checkTripOwnership(tripId, userId, role);

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        driver: { include: { user: true } },
        bookings: { where: { status: { in: ['CONFIRMED', 'BOARDED'] } } },
      },
    });

    if (!trip) {
      throw new NotFoundException("Trajet introuvable.");
    }

    // Validation du PIN si fourni
    if (pin && trip.driver?.user?.passwordHash) {
      let isPinValid = false;
      if (trip.driver.user.passwordHash.startsWith('$2')) {
        isPinValid = await bcrypt.compare(pin, trip.driver.user.passwordHash);
      } else {
        isPinValid = trip.driver.user.passwordHash === pin;
      }
      if (!isPinValid) {
        throw new BadRequestException('Code PIN incorrect');
      }
    }

    // Règles de PIN requis
    const needsPin = (newStatus === TripStatus.CANCELLED) || 
                     (newStatus === TripStatus.COMPLETED && trip.status !== TripStatus.IN_TRANSIT);
    
    if (needsPin && !pin) {
      throw new BadRequestException("PIN_REQUIRED");
    }

    // Garde-fou IN_TRANSIT
    if (newStatus === TripStatus.IN_TRANSIT && !forceOverride) {
      const hasConfirmed = trip.bookings.some(b => b.status === 'CONFIRMED');
      const hasBoarded = trip.bookings.some(b => b.status === 'BOARDED');
      if (hasConfirmed && !hasBoarded) {
        throw new BadRequestException("NO_PASSENGERS_SCANNED");
      }
    }

    let newDriverStatus: DriverOperationalStatus | undefined = undefined;

    if (newStatus === TripStatus.BOARDING) {
      newDriverStatus = DriverOperationalStatus.EN_RAMASSAGE;
    } else if (newStatus === TripStatus.IN_TRANSIT) {
      newDriverStatus = DriverOperationalStatus.EN_ROUTE;
    } else if (newStatus === TripStatus.COMPLETED) {
      newDriverStatus = DriverOperationalStatus.DISPONIBLE;
    } else if (newStatus === TripStatus.CANCELLED) {
      // Sauf EN_PAUSE / INDISPONIBLE manuel
      if (trip.driver?.operationalStatus !== DriverOperationalStatus.EN_PAUSE && 
          trip.driver?.operationalStatus !== DriverOperationalStatus.INDISPONIBLE) {
        newDriverStatus = DriverOperationalStatus.DISPONIBLE;
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.trip.update({
        where: { id: tripId },
        data: { status: newStatus }
      });

      if (newDriverStatus && trip.driver) {
        await tx.driverProfile.update({
          where: { id: trip.driver.id },
          data: { operationalStatus: newDriverStatus }
        });
      }
    });

    return { success: true, newTripStatus: newStatus, newDriverStatus };
  }
}

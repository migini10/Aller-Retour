import { Controller, Get, Query, Param, Post, Body, Patch, Delete, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { prisma, TripStatus } from '@aller-retour/database';

function mapToDatabaseCity(inputCity?: string): string | undefined {
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

@ApiTags('Trips & Mobility')
@Controller('trips')
export class TripsController {
  
  // Simple in-memory cache to speed up trip creations
  private static CACHE = {
    companyId: null as string | null,
    driverProfileId: null as string | null,
    stations: new Map<string, string>(), // cityName -> id
    routes: new Map<string, string>(), // originCity-destCity -> id
    vehicles: new Map<string, string>(), // capacity -> id
  };

  private async getAlloDakarCompany() {
    if (TripsController.CACHE.companyId) return TripsController.CACHE.companyId;
    let company = await prisma.company.findFirst({ where: { name: 'Allogoo' } });
    if (!company) company = await prisma.company.create({ data: { name: 'Allogoo' } });
    TripsController.CACHE.companyId = company.id;
    return company.id;
  }

  private async getAlloDakarDriver() {
    if (TripsController.CACHE.driverProfileId) return TripsController.CACHE.driverProfileId;
    let driverProfile = await prisma.driverProfile.findFirst();
    if (!driverProfile) {
      const defaultUser = await prisma.user.findFirst() || await prisma.user.create({
        data: { phone: '+221770000000', fullName: 'Chauffeur Demo', role: 'DRIVER', phoneVerified: true }
      });
      driverProfile = await prisma.driverProfile.create({
        data: { userId: defaultUser.id, licenseNumber: 'SN-123456', licenseExpiry: new Date('2030-01-01') }
      });
    }
    TripsController.CACHE.driverProfileId = driverProfile.id;
    return driverProfile.id;
  }

  private async getStation(cityName: string) {
    if (TripsController.CACHE.stations.has(cityName)) return TripsController.CACHE.stations.get(cityName)!;
    let station = await prisma.station.findFirst({ where: { city: cityName } });
    if (!station) station = await prisma.station.create({ data: { name: `Gare ${cityName}`, city: cityName, country: 'SN', latitude: 14.6, longitude: -17.4 } });
    TripsController.CACHE.stations.set(cityName, station.id);
    return station.id;
  }

  private async getVehicle(companyId: string, capacity: number) {
    const key = `${capacity}`;
    if (TripsController.CACHE.vehicles.has(key)) return TripsController.CACHE.vehicles.get(key)!;
    let vehicle = await prisma.vehicle.findFirst({ where: { companyId, capacity } });
    if (!vehicle) {
      vehicle = await prisma.vehicle.create({
        data: { companyId, plateNumber: `DK-${Math.floor(Math.random()*10000)}-AB`, type: 'TAXI_7_PLACES', capacity, insuranceExpiry: new Date('2030-01-01'), inspectionExpiry: new Date('2030-01-01') }
      });
    }
    TripsController.CACHE.vehicles.set(key, vehicle.id);
    return vehicle.id;
  }

  private async getRoute(companyId: string, originCity: string, destinationCity: string, originId: string, destId: string) {
    const key = `${originCity}-${destinationCity}`;
    if (TripsController.CACHE.routes.has(key)) return TripsController.CACHE.routes.get(key)!;
    let route = await prisma.route.findFirst({ where: { originStationId: originId, destinationStationId: destId, companyId } });
    if (!route) {
      route = await prisma.route.create({
        data: { companyId, name: `${originCity} - ${destinationCity}`, originStationId: originId, destinationStationId: destId, distanceKm: 200, estimatedDurationMins: 180, defaultPrice: 5000 }
      });
    }
    TripsController.CACHE.routes.set(key, route.id);
    return route.id;
  }

  @Get('search')
  @ApiOperation({ summary: 'Rechercher des trajets inter-urbains (SaaS & Marketplace)' })
  async searchTrips(
    @Query('originCity') originCity?: string,
    @Query('destinationCity') destinationCity?: string,
    @Query('date') date?: string,
  ) {
    const whereClause: any = {
      status: TripStatus.SCHEDULED,
      isLocked: false,
    };

    if (originCity && destinationCity) {
      const cleanOrigin = mapToDatabaseCity(originCity);
      const cleanDest = mapToDatabaseCity(destinationCity);
      
      const routes = await prisma.route.findMany({
        where: {
          originStation: { city: cleanOrigin },
          destinationStation: { city: cleanDest },
        },
        select: { id: true }
      });
      
      if (routes.length > 0) {
        whereClause.routeId = { in: routes.map((r: any) => r.id) };
      } else {
        return []; // Pas de route trouvée = pas de trajet
      }
    }

    if (date) {
      const startOfDay = new Date(date);
      if (!isNaN(startOfDay.getTime())) {
        // Start at 00:00 UTC on the selected date
        startOfDay.setUTCHours(0, 0, 0, 0);
        // End at 11:59:59 UTC the next day (36-hour window) to cover all timezone offsets
        // A trip at 00:34 UTC on the next calendar day is still "tonight" in West Africa (UTC+0)
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);
        endOfDay.setUTCHours(11, 59, 59, 999);
        whereClause.departureTime = { gte: startOfDay, lte: endOfDay };
      }
    }

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const trips = await prisma.trip.findMany({
      where: whereClause,
      include: {
        company: { select: { name: true, logoUrl: true } },
        route: {
          include: {
            originStation: true,
            destinationStation: true,
          },
        },
        vehicle: { select: { plateNumber: true, type: true, capacity: true } },
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
      orderBy: { departureTime: 'asc' },
    });

    // Calcul des places disponibles
    const formattedTrips = trips.map((trip: any) => {
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

    return formattedTrips;
  }

  @Get(':id/manifest')
  @ApiOperation({ summary: 'Télécharger le manifeste des passagers (Offline Cache pour Chauffeur)' })
  async getManifest(@Param('id') tripId: string) {
    const bookings = await prisma.booking.findMany({
      where: { tripId, status: { in: ['CONFIRMED', 'BOARDED'] } },
      include: { user: { select: { fullName: true, phone: true } } },
      orderBy: { seatNumber: 'asc' },
    });

    return {
      tripId,
      totalPassengers: bookings.length,
      tickets: bookings.map((b: any) => ({
        id: b.id,
        seatNumber: b.seatNumber,
        passengerName: b.user.fullName,
        passengerPhone: b.user.phone,
        qrCodeToken: b.qrCodeToken,
        status: b.status,
      })),
    };
  }

  @Post('create-allo-dakar')
  @ApiOperation({ summary: 'Créer un trajet Allo Dakar par un chauffeur' })
  async createAlloDakarTrip(@Body() body: any) {
    if (body.originCity && body.destinationCity) {
      if (body.originCity.trim().toLowerCase() === body.destinationCity.trim().toLowerCase()) {
        throw new BadRequestException("La ville de départ et la ville d'arrivée ne peuvent pas être identiques.");
      }
    }
    const [companyId, driverId] = await Promise.all([this.getAlloDakarCompany(), this.getAlloDakarDriver()]);
    
    const capacity = body.vehicleCapacity || 5;
    const seatsOffered = body.placesLibres ? parseInt(body.placesLibres.toString(), 10) : 4;
    const initialPassengers = body.passagers ? parseInt(body.passagers.toString(), 10) : 0;

    const [vehicleId, originId, destinationId] = await Promise.all([
      this.getVehicle(companyId, capacity),
      this.getStation(body.originCity),
      this.getStation(body.destinationCity)
    ]);

    const routeId = await this.getRoute(companyId, body.originCity, body.destinationCity, originId, destinationId);

    const trip = await prisma.trip.create({
      data: {
        companyId,
        routeId,
        vehicleId,
        driverId,
        departureTime: body.departureTime ? new Date(body.departureTime) : new Date(),
        pricePerSeat: body.pricePerSeat || 5000,
        isMarketplace: true,
        seatsOffered,
        initialPassengers,
        status: TripStatus.SCHEDULED
      }
    });

    return { success: true, trip };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un trajet' })
  async updateTrip(@Param('id') id: string, @Body() body: any) {
    if (body.originCity && body.destinationCity) {
      if (body.originCity.trim().toLowerCase() === body.destinationCity.trim().toLowerCase()) {
        throw new BadRequestException("La ville de départ et la ville d'arrivée ne peuvent pas être identiques.");
      }
    }
    const existingTrip = await prisma.trip.findUnique({
      where: { id },
      select: { companyId: true }
    });

    if (!existingTrip) {
      return { success: false, error: 'Trajet non trouvé' };
    }

    const companyId = existingTrip.companyId;

    const capacity = body.vehicleCapacity || 5;
    const seatsOffered = body.placesLibres ? parseInt(body.placesLibres.toString(), 10) : 4;
    const initialPassengers = body.passagers ? parseInt(body.passagers.toString(), 10) : 0;

    const [vehicleId, originId, destinationId] = await Promise.all([
      this.getVehicle(companyId, capacity),
      this.getStation(body.originCity),
      this.getStation(body.destinationCity)
    ]);

    const routeId = await this.getRoute(companyId, body.originCity, body.destinationCity, originId, destinationId);

    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: {
        routeId,
        vehicleId,
        departureTime: body.departureTime ? new Date(body.departureTime) : undefined,
        pricePerSeat: body.pricePerSeat || 5000,
        seatsOffered,
        initialPassengers,
      }
    });

    return { success: true, trip: updatedTrip };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un trajet' })
  async deleteTrip(@Param('id') id: string) {
    try {
      // Supprime les réservations, les colis et les verrous de sièges associés pour éviter les erreurs de clés étrangères
      await prisma.booking.deleteMany({ where: { tripId: id } });
      await prisma.parcel.deleteMany({ where: { tripId: id } });
      await prisma.seatLock.deleteMany({ where: { tripId: id } });
      
      await prisma.trip.delete({
        where: { id }
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error?.message || 'Erreur lors de la suppression de la mission' };
    }
  }
  @Get('popular-prices')
  @ApiOperation({ summary: 'Obtenir les prix les plus populaires pour un trajet donné' })
  async getPopularPrices(
    @Query('origin') origin?: string,
    @Query('destination') destination?: string,
  ) {
    if (!origin || !destination) {
      return { prices: [] };
    }

    const o = mapToDatabaseCity(origin) || origin;
    const d = mapToDatabaseCity(destination) || destination;

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
        _count: {
          pricePerSeat: true,
        },
        orderBy: {
          _count: {
            pricePerSeat: 'desc',
          },
        },
        take: 2,
      });

      const prices = popularTrips.map(p => p.pricePerSeat);
      return { prices };
    } catch (error) {
      console.error('Error fetching popular prices:', error);
      return { prices: [] };
    }
  }

  @Patch(':id/toggle-lock')
  @ApiOperation({ summary: 'Verrouiller ou déverrouiller un trajet' })
  async toggleLock(@Param('id') id: string, @Body() body: any) {
    const existingTrip = await prisma.trip.findUnique({
      where: { id },
      select: { 
        isLocked: true,
        driver: {
          select: {
            user: {
              select: { passwordHash: true }
            }
          }
        }
      }
    });

    if (!existingTrip) {
      return { success: false, error: 'Trajet non trouvé' };
    }

    // Validation du code PIN uniquement pour le verrouillage (lorsque le trajet est actuellement déverrouillé)
    if (!existingTrip.isLocked) {
      const code = body?.code;
      if (!code) {
        return { success: false, error: 'Un code PIN de sécurité est requis pour verrouiller le trajet.' };
      }
      const userPin = existingTrip.driver?.user?.passwordHash || '123456';
      if (code !== userPin) {
        return { success: false, error: 'Le code PIN saisi est incorrect.' };
      }
    }

    const updated = await prisma.trip.update({
      where: { id },
      data: { isLocked: !existingTrip.isLocked }
    });

    return { success: true, isLocked: updated.isLocked };
  }

  @Get(':id/transfer-targets')
  @ApiOperation({ summary: 'Trouver des trajets alternatifs éligibles pour un transfert de passagers' })
  async getTransferTargets(@Param('id') id: string) {
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: { route: true, vehicle: true }
    });

    if (!trip) {
      return [];
    }

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const alternativeTrips = await prisma.trip.findMany({
      where: {
        routeId: trip.routeId,
        id: { not: id },
        status: { in: [TripStatus.SCHEDULED, TripStatus.BOARDING] }
      },
      include: {
        company: { select: { name: true, logoUrl: true } },
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
}

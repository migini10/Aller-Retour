import { Controller, Get, Query, Param, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { prisma, TripStatus } from '@aller-retour/database';

@ApiTags('Trips & Mobility')
@Controller('trips')
export class TripsController {
  
  @Get('search')
  @ApiOperation({ summary: 'Rechercher des trajets inter-urbains (SaaS & Marketplace)' })
  async searchTrips(
    @Query('originCity') originCity?: string,
    @Query('destinationCity') destinationCity?: string,
    @Query('date') date?: string,
  ) {
    const whereClause: any = {
      status: TripStatus.SCHEDULED,
    };

    if (originCity && destinationCity) {
      const cleanOrigin = originCity.split(',')[0].trim();
      const cleanDest = destinationCity.split(',')[0].trim();
      
      whereClause.route = {
        originStation: { city: { contains: cleanOrigin, mode: 'insensitive' } },
        destinationStation: { city: { contains: cleanDest, mode: 'insensitive' } },
      };
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);
      whereClause.departureTime = { gte: startOfDay, lte: endOfDay };
    }

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
        bookings: { select: { seatNumber: true, status: true } },
      },
      orderBy: { departureTime: 'asc' },
    });

    // Calcul des places disponibles
    return trips.map(trip => {
      const bookedSeats = trip.bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'BOARDED').length;
      return {
        ...trip,
        availableSeats: trip.vehicle.capacity - bookedSeats,
        driverName: trip.driver?.user?.fullName || null,
        driverPhone: trip.driver?.user?.phone || null,
      };
    });
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

  @Post('create-allo-dakar')
  @ApiOperation({ summary: 'Créer un trajet Allo Dakar par un chauffeur' })
  async createAlloDakarTrip(@Body() body: any) {
    // On simule/trouve une entreprise par défaut pour Allo Dakar
    let company = await prisma.company.findFirst({ where: { name: 'Allo Dakar Partenaire' } });
    if (!company) {
      company = await prisma.company.create({
        data: { name: 'Allo Dakar Partenaire' }
      });
    }

    // On simule/trouve le profil chauffeur
    let driverProfile = await prisma.driverProfile.findFirst();
    if (!driverProfile) {
      const defaultUser = await prisma.user.findFirst() || await prisma.user.create({
        data: { phone: '+221770000000', fullName: 'Chauffeur Demo', role: 'DRIVER', phoneVerified: true }
      });
      driverProfile = await prisma.driverProfile.create({
        data: { userId: defaultUser.id, licenseNumber: 'SN-123456', licenseExpiry: new Date('2030-01-01') }
      });
    }

    // Véhicule par défaut pour ce trajet
    const capacity = body.vehicleCapacity || 5;
    let vehicle = await prisma.vehicle.findFirst({ where: { companyId: company.id, capacity: capacity } });
    if (!vehicle) {
      vehicle = await prisma.vehicle.create({
        data: { 
          companyId: company.id, 
          plateNumber: `DK-${Math.floor(Math.random()*10000)}-AB`, 
          type: 'TAXI_7_PLACES', 
          capacity: capacity,
          insuranceExpiry: new Date('2030-01-01'),
          inspectionExpiry: new Date('2030-01-01')
        }
      });
    }

    // Trouver ou créer les gares
    let origin = await prisma.station.findFirst({ where: { city: body.originCity } });
    if (!origin) origin = await prisma.station.create({ data: { name: `Gare ${body.originCity}`, city: body.originCity, country: 'SN', latitude: 14.6, longitude: -17.4 } });

    let destination = await prisma.station.findFirst({ where: { city: body.destinationCity } });
    if (!destination) destination = await prisma.station.create({ data: { name: `Gare ${body.destinationCity}`, city: body.destinationCity, country: 'SN', latitude: 14.7, longitude: -17.3 } });

    // Trouver ou créer la route
    let route = await prisma.route.findFirst({
      where: { originStationId: origin.id, destinationStationId: destination.id, companyId: company.id }
    });
    if (!route) {
      route = await prisma.route.create({
        data: {
          companyId: company.id,
          name: `${body.originCity} - ${body.destinationCity}`,
          originStationId: origin.id,
          destinationStationId: destination.id,
          distanceKm: 200,
          estimatedDurationMins: 180,
          defaultPrice: body.pricePerSeat || 5000
        }
      });
    }

    const trip = await prisma.trip.create({
      data: {
        companyId: company.id,
        routeId: route.id,
        vehicleId: vehicle.id,
        driverId: driverProfile.id,
        departureTime: body.departureTime ? new Date(body.departureTime) : new Date(),
        pricePerSeat: body.pricePerSeat || 5000,
        isMarketplace: true,
        status: TripStatus.SCHEDULED
      }
    });

    return { success: true, trip };
  }
}

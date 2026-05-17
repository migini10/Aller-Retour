import { Controller, Get, Query, Param } from '@nestjs/common';
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
      whereClause.route = {
        originStation: { city: originCity },
        destinationStation: { city: destinationCity },
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
}

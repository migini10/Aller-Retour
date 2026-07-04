import { NextResponse } from 'next/server';
import { prisma } from '@aller-retour/database';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();

    const vehicleCapacity = body.vehicleCapacity ? parseInt(body.vehicleCapacity.toString(), 10) : 5;
    const pricePerSeat = body.pricePerSeat ? parseFloat(body.pricePerSeat.toString()) : 5000;
    const seatsOffered = vehicleCapacity - 1;
    const initialPassengers = body.passagers ? parseInt(body.passagers.toString(), 10) : 0;

    const existingTrip = await prisma.trip.findUnique({
      where: { id },
    });

    if (!existingTrip) {
      return NextResponse.json({ error: 'Trajet non trouvé' }, { status: 404 });
    }

    let vehicle = await prisma.vehicle.findFirst({ where: { capacity: vehicleCapacity } });
    if (!vehicle) {
      vehicle = await prisma.vehicle.create({
        data: { 
          plateNumber: `DK-${Math.floor(Math.random()*10000)}-AB`, 
          type: 'TAXI_7_PLACES', 
          capacity: vehicleCapacity,
          insuranceExpiry: new Date('2030-01-01'),
          inspectionExpiry: new Date('2030-01-01')
        }
      });
    }

    let origin = await prisma.station.findFirst({ where: { city: body.originCity } });
    if (!origin) origin = await prisma.station.create({ data: { name: `Gare ${body.originCity}`, city: body.originCity, country: 'SN', latitude: 14.6, longitude: -17.4 } });

    let destination = await prisma.station.findFirst({ where: { city: body.destinationCity } });
    if (!destination) destination = await prisma.station.create({ data: { name: `Gare ${body.destinationCity}`, city: body.destinationCity, country: 'SN', latitude: 14.7, longitude: -17.3 } });

    let route = await prisma.route.findFirst({
      where: { originStationId: origin.id, destinationStationId: destination.id }
    });
    if (!route) {
      route = await prisma.route.create({
        data: {
          name: `${body.originCity} - ${body.destinationCity}`,
          originStationId: origin.id,
          destinationStationId: destination.id,
          distanceKm: 200,
          estimatedDurationMins: 180,
          defaultPrice: pricePerSeat
        }
      });
    }

    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: {
        routeId: route.id,
        vehicleId: vehicle.id,
        departureTime: body.departureTime ? new Date(body.departureTime) : undefined,
        pricePerSeat: pricePerSeat,
        seatsOffered: seatsOffered,
        initialPassengers: initialPassengers,
      }
    });

    return NextResponse.json({ success: true, trip: updatedTrip });
  } catch (error) {
    console.error('PATCH Missions Error:', error);
    return NextResponse.json({ error: 'Erreur lors de la modification de la mission' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const existingTrip = await prisma.trip.findUnique({
      where: { id }
    });

    if (!existingTrip) {
      return NextResponse.json({ error: 'Trajet non trouvé' }, { status: 404 });
    }

    // Delete associated bookings, parcels, and seat locks first to prevent foreign key constraint violations
    await prisma.booking.deleteMany({ where: { tripId: id } });
    await prisma.parcel.deleteMany({ where: { tripId: id } });
    await prisma.seatLock.deleteMany({ where: { tripId: id } });

    await prisma.trip.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE Missions Error:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la suppression de la mission',
      details: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}


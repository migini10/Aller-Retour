import { NextResponse } from 'next/server';
import { prisma, ParcelStatus } from '@aller-retour/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    const parcels = await prisma.parcel.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        trip: {
          include: {
            route: true
          }
        }
      }
    });

    // Transformer les données pour le frontend actuel
    const formattedParcels = parcels.map((p) => {
      let statutFrontend = 'En attente de prise en charge';
      if (p.status === 'ACCEPTED') statutFrontend = 'Accepté';
      if (p.status === 'IN_TRANSIT') statutFrontend = 'En transit';
      if (p.status === 'DELIVERED') statutFrontend = 'Livré';

      return {
        id: p.trackingCode,
        destinataire: p.recipientName,
        tel: p.recipientPhone,
        statut: statutFrontend,
        date: p.createdAt.toISOString().split('T')[0],
        trajet: p.trip?.route?.name || 'Dakar → Touba',
        taille: `${p.weightKg} kg`,
        prix: `${p.price} FCFA`,
        senderName: p.senderName,
      };
    });

    return NextResponse.json(formattedParcels);
  } catch (error) {
    console.error('GET Parcels Error:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des colis' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Trouver un trip par défaut (on va en créer un s'il n'existe pas)
    let trip = await prisma.trip.findFirst();
    
    if (!trip) {
      // Creation de la compagnie
      const company = await prisma.company.create({
        data: { name: "Allo Dakar" }
      });

      // Creation des stations
      const origin = await prisma.station.create({
        data: { name: "Gare Dakar", city: "Dakar", latitude: 14.7, longitude: -17.4 }
      });
      const dest = await prisma.station.create({
        data: { name: "Gare Touba", city: "Touba", latitude: 14.8, longitude: -15.8 }
      });

      // Creation de la route
      const route = await prisma.route.create({
        data: {
          name: "Dakar - Touba",
          distanceKm: 200,
          estimatedDurationMins: 180,
          defaultPrice: 5000,
          originStationId: origin.id,
          destinationStationId: dest.id,
          companyId: company.id
        }
      });

      // Creation du user & chauffeur
      const user = await prisma.user.create({
        data: { phone: "+221770000000", fullName: "Chauffeur Test", role: "DRIVER" }
      });
      const driver = await prisma.driverProfile.create({
        data: { userId: user.id, licenseNumber: "LIC-123", licenseExpiry: new Date() }
      });

      // Creation vehicule
      const vehicle = await prisma.vehicle.create({
        data: { plateNumber: "DK-1234-A", type: "MINIBUS_15", capacity: 15, insuranceExpiry: new Date(), inspectionExpiry: new Date(), companyId: company.id }
      });

      // Creation Trip
      trip = await prisma.trip.create({
        data: {
          companyId: company.id,
          routeId: route.id,
          vehicleId: vehicle.id,
          driverId: driver.id,
          departureTime: new Date(),
          pricePerSeat: 5000
        }
      });
    }

    const parcel = await prisma.parcel.create({
      data: {
        tripId: trip.id,
        senderName: "Client Demo",
        senderPhone: "+221771111111",
        recipientName: data.destinataire,
        recipientPhone: data.tel,
        weightKg: data.taille === 'Moyen (5-15kg)' ? 10 : (data.taille === 'Petit (0-5kg)' ? 3 : 20),
        price: 3000,
        trackingCode: `TRK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        status: ParcelStatus.REGISTERED,
      }
    });

    return NextResponse.json({ success: true, parcel });
  } catch (error) {
    console.error('POST Parcel Error:', error);
    return NextResponse.json({ error: 'Failed to create parcel' }, { status: 500 });
  }
}

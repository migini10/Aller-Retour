import { NextResponse } from 'next/server';
import { prisma } from '@aller-retour/database';
import { sendParcelTransferEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // trackingCode
    const body = await request.json();
    const { targetTripId } = body;

    if (!targetTripId) {
      return NextResponse.json({ error: 'ID du trajet cible manquant' }, { status: 400 });
    }

    const parcel = await prisma.parcel.findUnique({
      where: { trackingCode: id },
      include: { trip: true }
    });

    if (!parcel) {
      return NextResponse.json({ error: 'Colis non trouvé' }, { status: 404 });
    }

    const updatedParcel = await prisma.parcel.update({
      where: { trackingCode: id },
      data: { tripId: targetTripId },
      include: {
        trip: {
          include: {
            route: {
              include: {
                originStation: true,
                destinationStation: true
              }
            },
            driver: {
              include: {
                user: { select: { fullName: true } }
              }
            }
          }
        }
      }
    });

    // Notify the client (via email)
    const newTrip = updatedParcel.trip;
    if (newTrip) {
      const originCity = newTrip.route.originStation.city;
      const destinationCity = newTrip.route.destinationStation.city;
      const departureTimeStr = new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(newTrip.departureTime));
      const chauffeurName = newTrip.driver?.user?.fullName || 'Chauffeur';

      const tripInfo = `${originCity} → ${destinationCity} (Départ: ${departureTimeStr}, Chauffeur: ${chauffeurName})`;
      
      // Send transfer email notification
      const emailTo = parcel.senderPhone + '@gmail.com'; // Mock email based on phone or fallback
      await sendParcelTransferEmail(
        emailTo,
        parcel.senderName || 'Client',
        id,
        tripInfo
      );
    }

    return NextResponse.json({ success: true, updated: updatedParcel });
  } catch (error: any) {
    console.error('POST Transfer Parcel Error:', error);
    return NextResponse.json({ error: error.message || 'Erreur lors du transfert de colis' }, { status: 500 });
  }
}

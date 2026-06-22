import { NextResponse } from 'next/server';
import { prisma, ParcelStatus } from '@aller-retour/database';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  console.log('PATCH ROUTE HIT', params);
  try {
    const { id } = params; // This is the trackingCode because we use it as ID in frontend
    const data = await request.json();

    let dbStatus: ParcelStatus = ParcelStatus.REGISTERED;
    if (data.statut === 'Accepté') dbStatus = ParcelStatus.ACCEPTED;
    if (data.statut === 'En transit') dbStatus = ParcelStatus.IN_TRANSIT;
    if (data.statut === 'Livré') dbStatus = ParcelStatus.DELIVERED;

    if (dbStatus === ParcelStatus.DELIVERED) {
      const parcel = await prisma.parcel.findUnique({ where: { trackingCode: id } });
      if (!parcel) {
        return NextResponse.json({ error: 'Colis introuvable' }, { status: 404 });
      }
      if (parcel.deliveryCode && data.pin !== parcel.deliveryCode) {
        return NextResponse.json({ error: 'Code de livraison incorrect' }, { status: 400 });
      }
    }

    const updateData: any = { status: dbStatus };
    if (dbStatus === ParcelStatus.ACCEPTED) updateData.acceptedAt = new Date();
    if (dbStatus === ParcelStatus.IN_TRANSIT) updateData.inTransitAt = new Date();
    if (dbStatus === ParcelStatus.DELIVERED) updateData.deliveredAt = new Date();

    const updated = await prisma.parcel.update({
      where: { trackingCode: id },
      data: updateData
    });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error('PATCH Parcel Error:', error);
    return NextResponse.json({ error: 'Failed to update parcel' }, { status: 500 });
  }
}

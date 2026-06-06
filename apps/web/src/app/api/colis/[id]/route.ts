import { NextResponse } from 'next/server';
import { prisma, ParcelStatus } from '@aller-retour/database';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  console.log('PATCH ROUTE HIT', params);
  try {
    const { id } = params; // This is the trackingCode because we use it as ID in frontend
    const data = await request.json();

    let dbStatus = ParcelStatus.REGISTERED;
    if (data.statut === 'Accepté') dbStatus = ParcelStatus.ACCEPTED;
    if (data.statut === 'En transit') dbStatus = ParcelStatus.IN_TRANSIT;
    if (data.statut === 'Livré') dbStatus = ParcelStatus.DELIVERED;

    const updated = await prisma.parcel.update({
      where: { trackingCode: id },
      data: { status: dbStatus }
    });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error('PATCH Parcel Error:', error);
    return NextResponse.json({ error: 'Failed to update parcel' }, { status: 500 });
  }
}

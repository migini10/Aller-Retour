import { NextResponse } from 'next/server';
import { prisma } from '@aller-retour/database';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();

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
      return NextResponse.json({ error: 'Trajet non trouvé' }, { status: 404 });
    }

    // Validation du code PIN uniquement pour le verrouillage (lorsque le trajet est actuellement déverrouillé)
    if (!existingTrip.isLocked) {
      const code = body?.code;
      if (!code) {
        return NextResponse.json({ error: 'Un code PIN de sécurité est requis pour verrouiller le trajet.' }, { status: 400 });
      }
      const userPin = existingTrip.driver?.user?.passwordHash || '123456';
      if (code !== userPin) {
        return NextResponse.json({ error: 'Le code PIN saisi est incorrect.' }, { status: 400 });
      }
    }

    const updated = await prisma.trip.update({
      where: { id },
      data: { isLocked: !existingTrip.isLocked }
    });

    return NextResponse.json({ success: true, isLocked: updated.isLocked });
  } catch (error: any) {
    console.error('PATCH Toggle-Lock Error:', error);
    return NextResponse.json({ 
      error: 'Erreur lors du verrouillage/déverrouillage du trajet',
      details: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}

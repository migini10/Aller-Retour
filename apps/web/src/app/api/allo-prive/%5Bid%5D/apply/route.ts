import { NextResponse } from 'next/server';
import { prisma } from '@aller-retour/database';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const requestId = params.id;
    const { driverId, driverName, driverPhone, driverScore } = data;

    // Check if driver has already applied
    const existing = await prisma.alloPriveApplication.findFirst({
      where: { requestId, driverId },
    });

    if (existing) {
      return NextResponse.json({ success: false, error: 'Vous avez déjà postulé à cette offre.' }, { status: 400 });
    }

    // Retrieve verified status from database DriverProfile
    const driverUser = await prisma.user.findUnique({
      where: { id: driverId },
      include: { driverProfile: true },
    });

    const isVerified = driverUser?.driverProfile?.isVerified || false;
    const rating = driverUser?.driverProfile?.rating || 5.0;

    const application = await prisma.alloPriveApplication.create({
      data: {
        requestId,
        driverId,
        driverName: driverName || driverUser?.fullName || 'Chauffeur',
        driverPhone: driverPhone || driverUser?.phone || '+221770000000',
        driverRating: rating,
        driverVerified: isVerified,
        driverScore: driverScore || 100,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    console.error('Error applying to private request:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

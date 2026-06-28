import { NextResponse } from 'next/server';
import { prisma } from '@aller-retour/database';

export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const { driverId, isVerified } = data;

    // Update isVerified in DriverProfile
    const updated = await prisma.driverProfile.update({
      where: { userId: driverId },
      data: { isVerified: !!isVerified },
    });

    return NextResponse.json({ success: true, isVerified: updated.isVerified });
  } catch (error: any) {
    console.error('Error toggling driver verification:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

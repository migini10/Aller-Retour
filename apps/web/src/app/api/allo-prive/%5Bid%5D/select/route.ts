import { NextResponse } from 'next/server';
import { prisma } from '@aller-retour/database';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const requestId = params.id;
    const { applicationId } = data;

    // Start transaction to accept one application and reject others
    await prisma.$transaction(async (tx) => {
      // 1. Accept chosen application
      await tx.alloPriveApplication.update({
        where: { id: applicationId },
        data: { status: 'ACCEPTED' },
      });

      // 2. Reject other applications for the same request
      await tx.alloPriveApplication.updateMany({
        where: {
          requestId,
          id: { not: applicationId },
        },
        data: { status: 'REJECTED' },
      });

      // 3. Update the main request status
      await tx.alloPriveRequest.update({
        where: { id: requestId },
        data: { status: 'ACCEPTED' },
      });
    });

    return NextResponse.json({ success: true, message: 'Chauffeur sélectionné avec succès.' });
  } catch (error: any) {
    console.error('Error selecting driver:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

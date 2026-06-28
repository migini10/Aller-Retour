import { NextResponse } from 'next/server';
import { prisma } from '@aller-retour/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

// GET: List all PENDING private requests
export async function GET() {
  try {
    const requests = await prisma.alloPriveRequest.findMany({
      where: { status: 'PENDING' },
      include: {
        applications: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, requests });
  } catch (error: any) {
    console.error('Error fetching private requests:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create a private request by a client
export async function POST(req: Request) {
  try {
    const data = await req.json();

    const request = await prisma.alloPriveRequest.create({
      data: {
        clientId: data.clientId || 'anonymous-client',
        clientName: data.clientName || 'Client Privé',
        clientPhone: data.clientPhone || '+221770000000',
        origin: data.origin,
        destination: data.destination,
        departureDate: data.departureDate,
        price: data.price || 20000,
        type: data.type || 'allo-prive',
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, request });
  } catch (error: any) {
    console.error('Error creating private request:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

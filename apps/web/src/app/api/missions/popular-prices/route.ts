import { NextResponse } from 'next/server';
import { prisma } from '@aller-retour/database';

export const dynamic = 'force-dynamic';

function mapToDatabaseCity(inputCity?: string): string | undefined {
  if (!inputCity) return undefined;
  
  const cleanInput = inputCity.split(',')[0].trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
    
  const databaseCities = [
    'Dakar', 'Touba', 'Thiès', 'Mbour', 'Saint-Louis', 
    'Kaolack', 'Ziguinchor', 'Tambacounda', 'Diourbel', 'Louga'
  ];
  
  for (const dbCity of databaseCities) {
    const cleanDb = dbCity.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");
      
    if (cleanInput.includes(cleanDb) || cleanDb.includes(cleanInput)) {
      return dbCity;
    }
  }
  
  return inputCity.split(',')[0].trim();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');

    if (!origin || !destination) {
      return NextResponse.json({ prices: [] });
    }

    const o = mapToDatabaseCity(origin) || origin;
    const d = mapToDatabaseCity(destination) || destination;

    const popularTrips = await prisma.trip.groupBy({
      by: ['pricePerSeat'],
      where: {
        OR: [
          {
            route: {
              originStation: { city: { equals: o, mode: 'insensitive' } },
              destinationStation: { city: { equals: d, mode: 'insensitive' } },
            }
          },
          {
            route: {
              originStation: { city: { equals: d, mode: 'insensitive' } },
              destinationStation: { city: { equals: o, mode: 'insensitive' } },
            }
          }
        ]
      },
      _count: {
        pricePerSeat: true,
      },
      orderBy: {
        _count: {
          pricePerSeat: 'desc',
        },
      },
      take: 2,
    });

    const prices = popularTrips.map(p => p.pricePerSeat);
    return NextResponse.json({ prices });
  } catch (error) {
    console.error('Error fetching popular prices:', error);
    return NextResponse.json({ prices: [] });
  }
}

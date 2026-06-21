import { prisma } from './src/index';

async function main() {
  await prisma.booking.deleteMany({});
  await prisma.parcel.deleteMany({});
  await prisma.seatLock.deleteMany({});
  await prisma.trip.deleteMany({});
  console.log('Deleted all trips and related bookings/parcels/locks');
}
main().catch(console.error).finally(() => prisma.$disconnect());

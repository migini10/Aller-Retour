const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // to generate valid tokens
const prisma = new PrismaClient();

async function main() {
  console.log('Setup DB...');
  const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
  
  const generateToken = (user) => jwt.sign({ id: user.id, email: user.email, role: user.role, phone: user.phone }, JWT_SECRET, { expiresIn: '1h' });

  // cleanup
  await prisma.driverEarning.deleteMany({});
  await prisma.paymentTransaction.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.trip.deleteMany({});
  await prisma.vehicle.deleteMany({});
  await prisma.route.deleteMany({});
  await prisma.station.deleteMany({});
  await prisma.driverProfile.deleteMany({});
  await prisma.user.deleteMany({});

  const passenger = await prisma.user.create({ data: { phone: '+221770000010', fullName: 'Passenger', role: 'PASSENGER' } });
  const admin = await prisma.user.create({ data: { phone: '+221770000011', fullName: 'Admin', role: 'SUPER_ADMIN' } });
  
  const hashedPin = await bcrypt.hash('123456', 10);
  const authDriver = await prisma.user.create({ data: { phone: '+221770000012', fullName: 'Auth Driver', role: 'DRIVER', passwordHash: hashedPin } });
  const authProfile = await prisma.driverProfile.create({ data: { userId: authDriver.id, type: 'OWNER' } });

  const unauthDriver = await prisma.user.create({ data: { phone: '+221770000013', fullName: 'Unauth Driver', role: 'DRIVER' } });
  const unauthProfile = await prisma.driverProfile.create({ data: { userId: unauthDriver.id, type: 'OWNER' } });

  const stationA = await prisma.station.create({ data: { name: 'A', city: 'DakarA', country: 'SN', latitude: 0, longitude: 0 }});
  const stationB = await prisma.station.create({ data: { name: 'B', city: 'ThiesB', country: 'SN', latitude: 0, longitude: 0 }});
  const route = await prisma.route.create({ data: { name: 'Route1', originStationId: stationA.id, destinationStationId: stationB.id, distanceKm: 10, estimatedDurationMins: 10, defaultPrice: 1000 }});
  const vehicle = await prisma.vehicle.create({ data: { plateNumber: 'DK-1234-A', type: 'MINIBUS', capacity: 4, ownerId: authProfile.id }});

  const trip = await prisma.trip.create({
    data: {
      routeId: route.id, vehicleId: vehicle.id, driverId: authProfile.id,
      departureTime: new Date(), pricePerSeat: 1000, seatsOffered: 4, initialPassengers: 0, status: 'SCHEDULED'
    }
  });

  const passToken = generateToken(passenger);
  const adminToken = generateToken(admin);
  const authDriverToken = generateToken(authDriver);
  const unauthDriverToken = generateToken(unauthDriver);

  const api = axios.create({ baseURL: 'http://localhost:3333/v1', validateStatus: () => true });
  let fails = 0, passes = 0;

  const checkStatus = async (req, expectedStatus, name) => {
    const res = await req;
    if (res.status === expectedStatus) {
      console.log(`✅ PASSED: ${name}`); passes++;
    } else {
      console.error(`❌ FAILED: ${name} (Expected ${expectedStatus}, got ${res.status}) - ${JSON.stringify(res.data)}`); fails++;
    }
    return res;
  };

  console.log('\n--- /manifest ---');
  await checkStatus(api.get(`/trips/${trip.id}/manifest`, { headers: { Authorization: `Bearer ${passToken}` } }), 403, 'Passenger access');
  await checkStatus(api.get(`/trips/${trip.id}/manifest`, { headers: { Authorization: `Bearer ${unauthDriverToken}` } }), 403, 'Unauth Driver access');
  await checkStatus(api.get(`/trips/${trip.id}/manifest`, { headers: { Authorization: `Bearer ${authDriverToken}` } }), 200, 'Auth Driver access');
  await checkStatus(api.get(`/trips/${trip.id}/manifest`, { headers: { Authorization: `Bearer ${adminToken}` } }), 200, 'Super Admin access');

  console.log('\n--- /transfer-targets ---');
  await checkStatus(api.get(`/trips/${trip.id}/transfer-targets`, { headers: { Authorization: `Bearer ${passToken}` } }), 403, 'Passenger access');
  await checkStatus(api.get(`/trips/${trip.id}/transfer-targets`, { headers: { Authorization: `Bearer ${unauthDriverToken}` } }), 403, 'Unauth Driver access');
  await checkStatus(api.get(`/trips/${trip.id}/transfer-targets`, { headers: { Authorization: `Bearer ${authDriverToken}` } }), 200, 'Auth Driver access');

  console.log('\n--- toggle-lock ---');
  await checkStatus(api.patch(`/trips/${trip.id}/toggle-lock`, {}, { headers: { Authorization: `Bearer ${authDriverToken}` } }), 400, 'Lock without PIN');
  await checkStatus(api.patch(`/trips/${trip.id}/toggle-lock`, { code: '000000' }, { headers: { Authorization: `Bearer ${authDriverToken}` } }), 400, 'Lock with wrong PIN');
  await checkStatus(api.patch(`/trips/${trip.id}/toggle-lock`, { code: '123456' }, { headers: { Authorization: `Bearer ${authDriverToken}` } }), 200, 'Lock with correct PIN');
  
  await checkStatus(api.patch(`/trips/${trip.id}/toggle-lock`, {}, { headers: { Authorization: `Bearer ${passToken}` } }), 403, 'Unlock with passenger');
  await checkStatus(api.patch(`/trips/${trip.id}/toggle-lock`, {}, { headers: { Authorization: `Bearer ${authDriverToken}` } }), 200, 'Unlock with auth driver (no PIN required)');

  console.log('\n--- Webhooks ---');
  const booking = await prisma.booking.create({
    data: { tripId: trip.id, userId: passenger.id, seatNumber: 1, status: 'PENDING_PAYMENT', basePrice: 1000 }
  });

  const txWave = await prisma.paymentTransaction.create({
    data: { bookingId: booking.id, userId: passenger.id, amount: 1000, method: 'WAVE', status: 'PENDING', providerRef: 'WAVE123' }
  });

  const wavePayload = { type: 'checkout.session.completed', data: { id: 'WAVE123', client_reference: booking.id } };

  const [w1, w2] = await Promise.all([
    api.post('/payment/webhook/wave', wavePayload),
    api.post('/payment/webhook/wave', wavePayload)
  ]);
  
  const deWave = await prisma.driverEarning.findMany({ where: { bookingId: booking.id } });
  if (deWave.length === 1) { console.log('✅ PASSED: One Earning for Wave'); passes++; }
  else { console.error(`❌ FAILED: ${deWave.length} Earnings for Wave`); fails++; }

  const bookingOM = await prisma.booking.create({
    data: { tripId: trip.id, userId: passenger.id, seatNumber: 2, status: 'PENDING_PAYMENT', basePrice: 1000 }
  });

  const txOM = await prisma.paymentTransaction.create({
    data: { bookingId: bookingOM.id, userId: passenger.id, amount: 1000, method: 'ORANGE_MONEY', status: 'PENDING', providerRef: 'OM123' }
  });

  const omPayload = { status: 'SUCCESS', notif_id: 'OM123', tx_reference: bookingOM.id };

  const [o1, o2] = await Promise.all([
    api.post('/payment/webhook/om', omPayload),
    api.post('/payment/webhook/om', omPayload)
  ]);

  const deOM = await prisma.driverEarning.findMany({ where: { bookingId: bookingOM.id } });
  if (deOM.length === 1) { console.log('✅ PASSED: One Earning for OM'); passes++; }
  else { console.error(`❌ FAILED: ${deOM.length} Earnings for OM`); fails++; }

  console.log(`\nTests finished: ${passes} passed, ${fails} failed.`);
  if (fails > 0) process.exit(1);
}

main().catch(console.error).finally(() => prisma.$disconnect());

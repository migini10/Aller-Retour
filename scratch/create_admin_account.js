const { PrismaClient, UserRole } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const targetPhones = ['776783412', '+221776783412'];
  let adminUser = null;

  for (const phone of targetPhones) {
    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) {
      console.log(`Found existing user with phone ${phone}, updating to SUPER_ADMIN...`);
      adminUser = await prisma.user.update({
        where: { id: existing.id },
        data: {
          role: 'SUPER_ADMIN',
          passwordHash: '123456', // Default temporary PIN code
          fullName: 'Abdou Bakhe',
          isActive: true,
          failedAttempts: 0,
          blockedUntil: null
        }
      });
      break;
    }
  }

  if (!adminUser) {
    console.log(`No existing user found. Creating new user with phone 776783412...`);
    adminUser = await prisma.user.create({
      data: {
        phone: '776783412',
        fullName: 'Abdou Bakhe',
        role: 'SUPER_ADMIN',
        passwordHash: '123456',
        isActive: true,
        phoneVerified: true
      }
    });

    // Create a default passenger wallet for them
    await prisma.wallet.create({
      data: {
        type: 'PASSENGER_WALLET',
        currency: 'XOF',
        userId: adminUser.id,
        balance: 100000 // give them some initial play money
      }
    });
    console.log('Wallet created successfully.');
  }

  console.log('Admin account setup successfully:', {
    id: adminUser.id,
    phone: adminUser.phone,
    fullName: adminUser.fullName,
    role: adminUser.role,
    tempPIN: '123456'
  });

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

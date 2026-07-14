const { prisma } = require('@aller-retour/database');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../../.env' });

async function main() {
  const user = await prisma.user.findFirst({
    where: { fullName: { contains: 'auth-03' } },
    select: { id: true, phone: true, isTestAccount: true, verifiedAt: true, fullName: true }
  });
  console.log('auth-03:', JSON.stringify(user, null, 2));

  const admin = await prisma.user.findFirst({
    where: { role: 'SUPER_ADMIN' },
    select: { id: true, phone: true, role: true }
  });
  console.log('Admin:', JSON.stringify(admin, null, 2));

  if (!admin) {
    console.log("No super admin found");
    return;
  }

  const token = jwt.sign(
    { sub: admin.id, phone: admin.phone, role: admin.role },
    process.env.JWT_SECRET || 'test_secret',
    { expiresIn: '1h' }
  );

  console.log('JWT:', token);

  // If user is test account, call API locally or just simulate
  if (user && user.isTestAccount) {
    console.log(`Run this curl to test on Render:
curl -X PATCH https://aller-retour.onrender.com/v1/users/${user.id}/verify-test-account -H "Authorization: Bearer ${token}"
    `);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

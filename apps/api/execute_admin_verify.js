const { prisma } = require('@aller-retour/database');

async function main() {
  const targetUserId = '96d97881-15c1-4a00-8a90-f45a21e7655d';
  const adminId = '5e232aa1-a908-407c-a11d-223246aa6fb9';

  const user = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!user || !user.isTestAccount) {
    console.log("Precondition failed");
    return;
  }

  const now = new Date();
  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: {
      verifiedAt: now,
      verifiedById: adminId,
      verificationMethod: 'ADMIN_TEST',
    },
  });

  console.log(`[AUDIT] adminId: ${adminId}, targetUserId: ${targetUserId}, action: VERIFY_TEST_ACCOUNT, timestamp: ${now.toISOString()}, oldVerifiedAt: null, newVerifiedAt: ${now.toISOString()}`);
  console.log("Updated User:", updatedUser.verifiedAt, updatedUser.verificationMethod, updatedUser.verifiedById);
}

main().catch(console.error).finally(() => prisma.$disconnect());

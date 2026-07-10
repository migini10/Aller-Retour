import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const phoneOrEmail = process.argv[2];
  
  if (!phoneOrEmail) {
    console.error('Usage: npx ts-node scripts/make-superadmin.ts <phone_number_or_email>');
    process.exit(1);
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { phone: phoneOrEmail },
        { email: phoneOrEmail }
      ]
    }
  });

  if (!user) {
    console.error(`Utilisateur non trouvé avec: ${phoneOrEmail}`);
    process.exit(1);
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { role: 'SUPER_ADMIN' }
  });

  console.log(`\nSuccès ! L'utilisateur ${updatedUser.fullName || updatedUser.phone} a été promu SUPER_ADMIN.`);
  console.log(`Veuillez vous déconnecter et vous reconnecter pour rafraîchir le token JWT.\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

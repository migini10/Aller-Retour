import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting phone migration...');
  const users = await prisma.user.findMany();
  let updatedCount = 0;

  for (const user of users) {
    let newPhone = user.phone.replace(/\s+/g, ''); // Remove spaces
    
    // Check if it already starts with +221
    if (!newPhone.startsWith('+221') && !newPhone.startsWith('221') && !newPhone.startsWith('00221')) {
      newPhone = `+221${newPhone}`;
    } else if (newPhone.startsWith('221')) {
      newPhone = `+${newPhone}`;
    } else if (newPhone.startsWith('00221')) {
      newPhone = newPhone.replace('00221', '+221');
    }

    if (newPhone !== user.phone) {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { phone: newPhone }
        });
        updatedCount++;
        console.log(`Updated user ${user.id}: ${user.phone} -> ${newPhone}`);
      } catch (e) {
        console.error(`Failed to update user ${user.id} (${user.phone}):`, e);
      }
    }
  }

  console.log(`Migration complete. Updated ${updatedCount} users.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

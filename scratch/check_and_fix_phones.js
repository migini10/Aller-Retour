const { prisma } = require('../packages/database/dist/index.js');

async function main() {
  const users = await prisma.user.findMany();
  console.log("Checking users...");
  for (const user of users) {
    let phone = user.phone;
    if (!phone) continue;
    let clean = phone.replace(/\s+/g, '');
    let updated = clean;
    if (!clean.startsWith('+221') && !clean.startsWith('221') && !clean.startsWith('00221')) {
      updated = `+221${clean}`;
    } else if (clean.startsWith('221')) {
      updated = `+${clean}`;
    } else if (clean.startsWith('00221')) {
      updated = clean.replace('00221', '+221');
    }
    
    if (updated !== phone) {
      console.log(`Fixing phone for ${user.fullName || 'User'}: ${phone} -> ${updated}`);
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { phone: updated }
        });
      } catch (e) {
        console.error(`Error updating phone for user ${user.id}:`, e.message);
      }
    }
  }
  console.log("Phone check complete.");
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

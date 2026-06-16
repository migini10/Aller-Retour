const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    take: 10
  });
  console.log("Existing Users:");
  console.log(users.map(u => ({ id: u.id, phone: u.phone, fullName: u.fullName, role: u.role })));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

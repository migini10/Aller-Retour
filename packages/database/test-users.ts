import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });

async function main() {
  const user = await prisma.user.findFirst({
    where: { fullName: { contains: "Abdou", mode: "insensitive" } }
  });
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'SUPER_ADMIN' }
    });
    console.log("SUCCESS: Promoted", user.fullName, "to SUPER_ADMIN");
  } else {
    console.log("User not found!");
  }
}
main().finally(() => prisma.$disconnect());

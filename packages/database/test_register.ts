import { prisma } from './src/index';

async function run() {
  const phone = '+22177' + Math.floor(Math.random() * 10000000).toString();
  try {
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          phone,
          fullName: 'Test Driver',
          role: 'DRIVER',
          passwordHash: 'dummy',
        },
      });

      console.log('User created:', newUser.id);

      const driverProfile = await tx.driverProfile.create({
        data: {
          userId: newUser.id,
          type: 'OWNER',
        }
      });

      console.log('DriverProfile created:', driverProfile.id);
      return newUser;
    });
    console.log('Success!', user.id);
  } catch (error) {
    console.error('TRANSACTION ERROR:', error);
  } finally {
    await prisma.$disconnect();
  }
}
run();

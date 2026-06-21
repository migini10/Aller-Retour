import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({ where: { phone: '+221776783412' } });
  if (!user) return console.log('User not found');
  
  const token = jwt.sign({ sub: user.id, phone: user.phone }, 'test-secret', { expiresIn: '1h' }); // wait, I don't know the JWT_SECRET.
  
  // Let's just directly call the service!
  const walletsService = require('./src/modules/wallets/wallets.service');
  // I can't easily mock the service here without NestJS context.
  
  // Let's just do exactly what the service does:
  const wallet = await prisma.wallet.findFirst({
    where: { userId: user.id, type: 'PASSENGER_WALLET' },
  });
  console.log('Wallet:', wallet);
  
  if (wallet) {
    const transactions = await prisma.transaction.findMany({
      where: { 
        OR: [
          { sourceWalletId: wallet.id },
          { targetWalletId: wallet.id }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    console.log('Transactions:', JSON.stringify(transactions, null, 2));
  }
}
main().finally(() => prisma.$disconnect());

import { Global, Module } from '@nestjs/common';
import { prisma } from '@aller-retour/database';

@Global()
@Module({
  providers: [
    {
      provide: 'PRISMA_CLIENT',
      useValue: prisma,
    },
  ],
  exports: ['PRISMA_CLIENT'],
})
export class DatabaseModule {}

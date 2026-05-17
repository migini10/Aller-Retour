import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from './core/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { TripsModule } from './modules/trips/trips.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { WalletsModule } from './modules/wallets/wallets.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { FinanceModule } from './modules/finance/finance.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    TripsModule,
    BookingsModule,
    WalletsModule,
    CompaniesModule,
    FinanceModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

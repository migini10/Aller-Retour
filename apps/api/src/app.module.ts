import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from './core/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { TripsModule } from './modules/trips/trips.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PaymentModule } from './modules/payment/payment.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { QrModule } from './modules/qr/qr.module';
import { UsersModule } from './modules/users/users.module';
import { DriversModule } from './modules/drivers/drivers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    TripsModule,
    BookingsModule,
    PaymentModule,
    PricingModule,
    QrModule,
    UsersModule,
    DriversModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

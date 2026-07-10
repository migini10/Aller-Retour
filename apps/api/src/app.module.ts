import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { MaintenanceGuard } from './core/maintenance/maintenance.guard';
import { DatabaseModule } from './core/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { TripsModule } from './modules/trips/trips.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PaymentModule } from './modules/payment/payment.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { QrModule } from './modules/qr/qr.module';
import { UsersModule } from './modules/users/users.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { DriverEarningsModule } from './modules/driver-earnings/driver-earnings.module';
import { PaymentTransactionsModule } from './modules/payment-transactions/payment-transactions.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SettingsModule } from './modules/settings/settings.module';
import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { ParcelsModule } from './modules/parcels/parcels.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        // Les variables SMTP sont optionnelles si non activées.
        EMAIL_USER: Joi.string().optional(),
        EMAIL_PASS: Joi.string().optional(),
      }),
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
    DriverEarningsModule,
    PaymentTransactionsModule,
    AnalyticsModule,
    ReviewsModule,
    NotificationsModule,
    SettingsModule,
    MonitoringModule,
    ParcelsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: MaintenanceGuard,
    },
  ],
})
export class AppModule {}

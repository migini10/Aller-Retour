import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { VehiclesCronService } from './vehicles-cron.service';

@Module({
  imports: [AuthModule],
  controllers: [DriversController],
  providers: [DriversService, VehiclesCronService],
  exports: [DriversService],
})
export class DriversModule {}

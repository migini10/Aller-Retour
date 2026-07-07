import { Module } from '@nestjs/common';
import { DriverEarningsController } from './driver-earnings.controller';
import { DriverEarningsService } from './driver-earnings.service';

@Module({
  controllers: [DriverEarningsController],
  providers: [DriverEarningsService],
  exports: [DriverEarningsService]
})
export class DriverEarningsModule {}

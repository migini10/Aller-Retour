import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RbacGuard } from '../../core/rbac/rbac.guard';
import { Roles } from '../../core/rbac/roles.decorator';
import { UserRole } from '@aller-retour/database';

import { DriversService } from './drivers.service';
import { ListDriversDto } from './dto/list-drivers.dto';
import { UpdateKycDto } from './dto/update-kyc.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Controller('drivers')
@UseGuards(AuthGuard('jwt'), RbacGuard)
@Roles(UserRole.SUPER_ADMIN)
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get()
  async findAll(@Query() filters: ListDriversDto) {
    return this.driversService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.driversService.findOne(id);
  }

  @Patch(':id/kyc')
  async updateKyc(@Param('id') id: string, @Body() dto: UpdateKycDto) {
    return this.driversService.updateKyc(id, dto);
  }

  @Get(':id/vehicles')
  async getVehicles(@Param('id') id: string) {
    return this.driversService.getVehicles(id);
  }

  @Patch(':id/vehicles/:vehicleId')
  async updateVehicle(
    @Param('id') id: string,
    @Param('vehicleId') vehicleId: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    return this.driversService.updateVehicle(id, vehicleId, dto);
  }

  @Get(':id/earnings')
  async getEarnings(@Param('id') id: string) {
    return this.driversService.getEarnings(id);
  }

  @Get(':id/reviews')
  async getReviews(@Param('id') id: string) {
    return this.driversService.getReviews(id);
  }
}

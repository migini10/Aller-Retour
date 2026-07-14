import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { VerifiedGuard } from '../../core/auth/verified.guard';
import { RbacGuard } from '../../core/rbac/rbac.guard';
import { Roles } from '../../core/rbac/roles.decorator';
import { UserRole } from '@aller-retour/database';

import { DriverEarningsService } from './driver-earnings.service';
import { ListEarningsDto } from './dto/list-earnings.dto';
import { MarkPaidDto } from './dto/mark-paid.dto';

@ApiTags('Driver Earnings')
@Controller('driver-earnings')
@UseGuards(AuthGuard('jwt'), VerifiedGuard, RbacGuard)
@Roles(UserRole.SUPER_ADMIN)
@ApiBearerAuth()
export class DriverEarningsController {
  constructor(private readonly driverEarningsService: DriverEarningsService) {}

  @Get()
  @ApiOperation({ summary: 'Liste paginée des gains chauffeurs' })
  async findAll(@Query() dto: ListEarningsDto) {
    return this.driverEarningsService.findAll(dto);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Résumé financier (total pending, total paid, etc.)' })
  async getSummary() {
    return this.driverEarningsService.getSummary();
  }

  @Get(':driverId')
  @ApiOperation({ summary: "Historique des gains d'un propriétaire spécifique" })
  async findByDriverId(@Param('driverId') driverId: string) {
    return this.driverEarningsService.findByDriverId(driverId);
  }

  @Patch(':id/mark-paid')
  @ApiOperation({ summary: 'Marquer un gain comme payé' })
  async markAsPaid(@Param('id') id: string, @Body() dto: MarkPaidDto) {
    return this.driverEarningsService.markAsPaid(id, dto);
  }
}

import { Controller, Get, Query, Param, Post, Body, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { TripsService } from './trips.service';
import { SearchTripsDto } from './dto/search-trips.dto';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { RbacGuard } from '../../core/rbac/rbac.guard';
import { Roles } from '../../core/rbac/roles.decorator';
import { UserRole } from '@aller-retour/database';

@ApiTags('Trips & Mobility')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get('search')
  @ApiOperation({ summary: 'Rechercher des trajets inter-urbains (SaaS & Marketplace)' })
  async searchTrips(@Query() dto: SearchTripsDto) {
    return this.tripsService.searchTrips(dto);
  }

  @Get('popular-prices')
  @ApiOperation({ summary: 'Obtenir les prix les plus populaires pour un trajet donné' })
  async getPopularPrices(
    @Query('origin') origin?: string,
    @Query('destination') destination?: string,
  ) {
    return this.tripsService.getPopularPrices(origin, destination);
  }

  @Get(':id/manifest')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.DRIVER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Télécharger le manifeste des passagers (Offline Cache pour Chauffeur)' })
  async getManifest(@Param('id') tripId: string, @Req() req: any) {
    return this.tripsService.getManifest(tripId, req.user.id, req.user.role);
  }

  @Post('create-allo-dakar')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.DRIVER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un trajet Allo Dakar par un chauffeur' })
  async createAlloDakarTrip(@Req() req: any, @Body() dto: CreateTripDto) {
    return this.tripsService.createAlloDakarTrip(req.user.id, dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.DRIVER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un trajet' })
  async updateTrip(@Param('id') id: string, @Req() req: any, @Body() dto: UpdateTripDto) {
    return this.tripsService.updateTrip(id, req.user.id, req.user.role, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.DRIVER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un trajet' })
  async deleteTrip(@Param('id') id: string, @Req() req: any) {
    return this.tripsService.deleteTrip(id, req.user.id, req.user.role);
  }

  @Patch(':id/toggle-lock')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.DRIVER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verrouiller ou déverrouiller un trajet' })
  async toggleLock(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    return this.tripsService.toggleLock(id, req.user.id, req.user.role, body?.code);
  }

  @Get(':id/transfer-targets')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.DRIVER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Trouver des trajets alternatifs éligibles pour un transfert de passagers' })
  async getTransferTargets(@Param('id') id: string, @Req() req: any) {
    return this.tripsService.getTransferTargets(id, req.user.id, req.user.role);
  }
}

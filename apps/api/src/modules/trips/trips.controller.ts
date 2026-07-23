import { Controller, Get, Query, Param, Post, Body, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { VerifiedGuard } from '../../core/auth/verified.guard';

import { TripsService } from './trips.service';
import { SearchTripsDto } from './dto/search-trips.dto';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { UpdateTripStatusDto } from './dto/update-trip-status.dto';
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

  @Get('driver/me')
  @UseGuards(AuthGuard('jwt'), VerifiedGuard, RbacGuard)
  @Roles(UserRole.DRIVER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lister les trajets du chauffeur connecté' })
  async findMyTrips(@Req() req: any, @Query() query: any) {
    return this.tripsService.findDriverTrips(req.user.id, query);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), VerifiedGuard, RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lister tous les trajets (Admin)' })
  async findAllAdmin(@Query() query: any) {
    return this.tripsService.findAllAdmin(query);
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
  @UseGuards(AuthGuard('jwt'), VerifiedGuard, RbacGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.DRIVER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Télécharger le manifeste des passagers (Offline Cache pour Chauffeur)' })
  async getManifest(@Param('id') tripId: string, @Req() req: any) {
    return this.tripsService.getManifest(tripId, req.user.id, req.user.role);
  }

  @Get(':id/admin')
  @UseGuards(AuthGuard('jwt'), VerifiedGuard, RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Détails du trajet pour Admin (avec stats et infos métier)' })
  async getAdminTripDetails(@Param('id') tripId: string) {
    return this.tripsService.getAdminTripDetails(tripId);
  }

  @Post('create-allo-dakar')
  @UseGuards(AuthGuard('jwt'), VerifiedGuard, RbacGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.DRIVER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un trajet Allo Dakar par un chauffeur' })
  async createAlloDakarTrip(@Req() req: any, @Body() dto: CreateTripDto) {
    return this.tripsService.createAlloDakarTrip(req.user.id, dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), VerifiedGuard, RbacGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.DRIVER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un trajet' })
  async updateTrip(@Param('id') id: string, @Req() req: any, @Body() dto: UpdateTripDto) {
    return this.tripsService.updateTrip(id, req.user.id, req.user.role, dto);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), VerifiedGuard, RbacGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.DRIVER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier le statut d\'un trajet (cycle de vie)' })
  async updateTripStatus(@Param('id') id: string, @Req() req: any, @Body() dto: UpdateTripStatusDto) {
    return this.tripsService.updateTripStatus(id, req.user.id, req.user.role, dto.status, dto.pin, dto.forceOverride);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), VerifiedGuard, RbacGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.DRIVER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un trajet' })
  async deleteTrip(@Param('id') id: string, @Req() req: any) {
    return this.tripsService.deleteTrip(id, req.user.id, req.user.role);
  }

  @Patch(':id/toggle-lock')
  @UseGuards(AuthGuard('jwt'), VerifiedGuard, RbacGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.DRIVER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verrouiller ou déverrouiller un trajet' })
  async toggleLock(@Param('id') id: string, @Req() req: any, @Body() body: any) {
    return this.tripsService.toggleLock(id, req.user.id, req.user.role, body?.code);
  }

  @Get(':id/transfer-targets')
  @UseGuards(AuthGuard('jwt'), VerifiedGuard, RbacGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.DRIVER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Trouver des trajets alternatifs éligibles pour un transfert de passagers' })
  async getTransferTargets(@Param('id') id: string, @Req() req: any) {
    return this.tripsService.getTransferTargets(id, req.user.id, req.user.role);
  }
}

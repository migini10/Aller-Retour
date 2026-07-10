import {
  Controller, Get, Post, Patch, Param, Body, Query,
  UseGuards, Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ParcelsService } from './parcels.service';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { UpdateParcelStatusDto } from './dto/update-parcel-status.dto';
import { RbacGuard } from '../../core/rbac/rbac.guard';
import { Roles } from '../../core/rbac/roles.decorator';
import { UserRole } from '@aller-retour/database';

@ApiTags('Parcels / Colis')
@Controller('parcels')
export class ParcelsController {
  constructor(private readonly parcelsService: ParcelsService) {}

  // ─── Routes statiques AVANT les routes paramétrées ─────────────

  @Get('my-parcels')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.PASSENGER, UserRole.DRIVER, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer mes colis (expéditeur, chauffeur ou admin)' })
  async getMyParcels(@Req() req: any) {
    return this.parcelsService.getMyParcels(req.user.id, req.user.role);
  }

  @Get('track/:trackingCode')
  @ApiOperation({ summary: 'Suivi public d\'un colis par code de tracking (pas de JWT)' })
  async trackParcel(@Param('trackingCode') trackingCode: string) {
    return this.parcelsService.trackParcel(trackingCode);
  }

  @Get('driver/trip/:tripId')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.DRIVER, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Colis d\'un trajet (vue chauffeur)' })
  async getDriverTripParcels(@Param('tripId') tripId: string, @Req() req: any) {
    return this.parcelsService.getDriverTripParcels(tripId, req.user.id, req.user.role);
  }

  // ─── Routes paramétrées ────────────────────────────────────────

  @Post()
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.PASSENGER, UserRole.DRIVER, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un colis' })
  async createParcel(@Req() req: any, @Body() dto: CreateParcelDto) {
    return this.parcelsService.createParcel(req.user.id, req.user.role, dto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.PASSENGER, UserRole.DRIVER, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Détail d\'un colis' })
  async getParcelById(@Param('id') id: string, @Req() req: any) {
    return this.parcelsService.getParcelById(id, req.user.id, req.user.role);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.DRIVER, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Changer le statut d\'un colis (machine d\'état stricte)' })
  async updateParcelStatus(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateParcelStatusDto,
  ) {
    return this.parcelsService.updateParcelStatus(id, req.user.id, req.user.role, dto);
  }
}

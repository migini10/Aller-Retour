import { Controller, Post, Body, Req, UseGuards, Param, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { AuthGuard } from '@nestjs/passport';
import { RbacGuard } from '../../core/rbac/rbac.guard';
import { Roles } from '../../core/rbac/roles.decorator';
import { Permissions } from '../../core/rbac/permissions.decorator';
import { UserRole, PaymentMethod } from '@aller-retour/database';
import { IsString, IsNotEmpty, IsInt, IsEnum, IsOptional, IsArray, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetBookingsFilterDto {
  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  paymentStatus?: string;

  @IsOptional()
  @IsString()
  tripId?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  dateTo?: string;
}

export class GetMyTicketsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}


export class CancelBookingDto {
  @IsString()
  @IsNotEmpty()
  secretCode!: string;
}

export class TransferBookingsDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  bookingIds!: string[];

  @IsString()
  @IsNotEmpty()
  targetTripId!: string;
}

export class HideBookingsDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  bookingIds!: string[];
}

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  tripId!: string;

  @IsInt()
  seatNumber!: number;

  @IsInt()
  @IsOptional()
  passengersCount?: number;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;
}

@ApiTags('Bookings & QR Tickets')
@Controller('bookings')
@ApiBearerAuth()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Permissions('bookings:read')
  @ApiOperation({ summary: 'Lister et filtrer toutes les réservations (Admin)' })
  async getAllBookings(@Query() filters: GetBookingsFilterDto) {
    return this.bookingsService.getAllBookings(filters);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.PASSENGER)
  @Permissions('bookings:create')
  @ApiOperation({ summary: 'Réserver un siège sur un trajet' })
  async create(@Req() req: any, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(req.user.id, dto.tripId, dto.seatNumber, dto.paymentMethod, dto.passengersCount || 1);
  }

  @Post('verify-qr/:token')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.DRIVER, UserRole.SUPER_ADMIN)
  @Permissions('bookings:scan')
  @ApiOperation({ summary: 'Scanner et valider un billet QR Code en gare' })
  async verifyQr(@Param('token') token: string) {
    return this.bookingsService.verifyQrAtBoarding(token);
  }

  @Get(':id/status')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Vérifier le statut de paiement d\'une réservation (Polling)' })
  async getStatus(@Param('id') id: string, @Req() req: any) {
    return this.bookingsService.getBookingStatus(id, req.user);
  }

  @Get('my-tickets')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.PASSENGER)
  @Permissions('bookings:read')
  @ApiOperation({ summary: 'Récupérer les billets (QR Codes) de l\'utilisateur connecté' })
  async getMyTickets(@Req() req: any, @Query() query: GetMyTicketsDto) {
    return this.bookingsService.getUserBookings(req.user.id, query.limit || 50);
  }

  @Post('hide')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.PASSENGER)
  @Permissions('bookings:update')
  @ApiOperation({ summary: 'Masquer (supprimer) définitivement un ou plusieurs billets de la vue utilisateur' })
  async hideTickets(@Req() req: any, @Body() dto: HideBookingsDto) {
    return this.bookingsService.hideBookings(req.user.id, dto.bookingIds);
  }

  @Post(':id/cancel')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.PASSENGER)
  @Permissions('bookings:update')
  @ApiOperation({ summary: 'Annuler une réservation et obtenir un remboursement dans le Wallet' })
  async cancelBooking(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: CancelBookingDto,
  ) {
    return this.bookingsService.cancelBooking(id, req.user.id, dto.secretCode);
  }

  @Post('transfer')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.DRIVER, UserRole.SUPER_ADMIN)
  @Permissions('bookings:update')
  @ApiOperation({ summary: 'Transférer des passagers vers un autre trajet' })
  async transfer(@Req() req: any, @Body() dto: TransferBookingsDto) {
    return this.bookingsService.transferBookings(req.user.id, dto.bookingIds, dto.targetTripId);
  }

  @Post(':id/admin-cancel')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Permissions('bookings:update')
  @ApiOperation({ summary: 'Annuler une réservation de force sans code (Admin)' })
  async adminCancel(@Param('id') id: string) {
    return this.bookingsService.adminCancelBooking(id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Permissions('bookings:read')
  @ApiOperation({ summary: 'Voir le détail complet d\'une réservation (Admin)' })
  async getById(@Param('id') id: string) {
    return this.bookingsService.getBookingById(id);
  }
}

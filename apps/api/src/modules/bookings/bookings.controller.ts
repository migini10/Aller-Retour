import { Controller, Post, Body, Req, UseGuards, Param, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { AuthGuard } from '@nestjs/passport';
import { RbacGuard } from '../../core/rbac/rbac.guard';
import { Roles } from '../../core/rbac/roles.decorator';
import { Permissions } from '../../core/rbac/permissions.decorator';
import { UserRole, PaymentMethod } from '@aller-retour/database';
import { IsString, IsNotEmpty, IsInt, IsEnum, IsOptional, IsArray } from 'class-validator';
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
  @ApiOperation({ summary: 'Vérifier le statut de paiement d\'une réservation (Polling)' })
  async getStatus(@Param('id') id: string) {
    // Cette route peut être appelée publiquement ou nécessiter le token, mais comme c'est pour du polling web/mobile rapide:
    return this.bookingsService.getBookingStatus(id);
  }

  @Get('my-tickets')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.PASSENGER)
  @Permissions('bookings:read')
  @ApiOperation({ summary: 'Récupérer les billets (QR Codes) de l\'utilisateur connecté' })
  async getMyTickets(@Req() req: any) {
    return this.bookingsService.getUserBookings(req.user.id);
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
}

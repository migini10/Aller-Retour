import { Controller, Post, Body, Req, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { AuthGuard } from '@nestjs/passport';
import { RbacGuard } from '../../core/rbac/rbac.guard';
import { Roles } from '../../core/rbac/roles.decorator';
import { Permissions } from '../../core/rbac/permissions.decorator';
import { UserRole, PaymentMethod } from '@aller-retour/database';
import { IsString, IsNotEmpty, IsInt, IsEnum } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  tripId!: string;

  @IsInt()
  seatNumber!: number;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;
}

@ApiTags('Bookings & QR Tickets')
@Controller('bookings')
@UseGuards(AuthGuard('jwt'), RbacGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles(UserRole.PASSENGER, UserRole.DISPATCHER, UserRole.TENANT_ADMIN)
  @Permissions('bookings:create')
  @ApiOperation({ summary: 'Réserver un siège sur un trajet' })
  async create(@Req() req: any, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(req.user.id, dto.tripId, dto.seatNumber, dto.paymentMethod);
  }

  @Post('verify-qr/:token')
  @Roles(UserRole.DISPATCHER, UserRole.DRIVER, UserRole.TENANT_ADMIN, UserRole.SUPER_ADMIN)
  @Permissions('bookings:scan')
  @ApiOperation({ summary: 'Scanner et valider un billet QR Code en gare' })
  async verifyQr(@Param('token') token: string) {
    return this.bookingsService.verifyQrAtBoarding(token);
  }
}

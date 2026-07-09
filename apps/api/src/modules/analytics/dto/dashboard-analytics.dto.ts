import { ApiProperty } from '@nestjs/swagger';

export class KpiDto {
  @ApiProperty()
  totalUsers!: number;

  @ApiProperty()
  newUsersToday!: number;

  @ApiProperty()
  activeDrivers!: number;

  @ApiProperty()
  totalTrips!: number;

  @ApiProperty()
  tripsToday!: number;

  @ApiProperty()
  bookingsToday!: number;

  @ApiProperty()
  cancelledBookings!: number;

  @ApiProperty()
  successfulPayments!: number;

  @ApiProperty()
  failedPayments!: number;

  @ApiProperty()
  pendingPayments!: number;

  @ApiProperty()
  totalRevenue!: number;

  @ApiProperty()
  totalPlatformFees!: number;

  @ApiProperty()
  pendingDriverEarnings!: number;

  @ApiProperty()
  averageRating!: number;
}

export class TrendDto {
  @ApiProperty()
  date!: string;

  @ApiProperty()
  bookings!: number;

  @ApiProperty()
  revenue!: number;

  @ApiProperty()
  platformFees!: number;
}

export class TopDriverDto {
  @ApiProperty()
  driverId!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  totalEarnings!: number;

  @ApiProperty()
  completedTrips!: number;

  @ApiProperty()
  rating!: number;
}

export class CityActivityDto {
  @ApiProperty()
  city!: string;

  @ApiProperty()
  bookings!: number;

  @ApiProperty()
  trips!: number;

  @ApiProperty()
  revenue!: number;
}

export class TimelineEventDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  type!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  createdAt!: Date;
}

export class AlertDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  type!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  message!: string;
}

export class DashboardAnalyticsDto {
  @ApiProperty()
  kpis!: KpiDto;

  @ApiProperty({ type: [TrendDto] })
  trends!: TrendDto[];

  @ApiProperty({ type: [TopDriverDto] })
  topDrivers!: TopDriverDto[];

  @ApiProperty({ type: [CityActivityDto] })
  cityActivity!: CityActivityDto[];

  @ApiProperty({ type: [TimelineEventDto] })
  timeline!: TimelineEventDto[];

  @ApiProperty({ type: [AlertDto] })
  alerts!: AlertDto[];
}

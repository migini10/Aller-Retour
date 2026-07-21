import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { TripStatus } from '@aller-retour/database';

export class UpdateTripStatusDto {
  @IsEnum(TripStatus, { message: 'status must be a valid TripStatus' })
  status!: TripStatus;

  @IsOptional()
  @IsString()
  pin?: string;

  @IsOptional()
  @IsBoolean()
  forceOverride?: boolean;
}

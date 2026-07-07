import { IsString, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTripDto {
  @IsOptional()
  @IsString()
  originCity?: string;

  @IsOptional()
  @IsString()
  destinationCity?: string;

  @IsOptional()
  @IsDateString()
  departureTime?: string;

  @IsOptional()
  @IsString()
  vehicleId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  pricePerSeat?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  placesLibres?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  passagers?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  vehicleCapacity?: number;
}

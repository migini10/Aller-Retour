import { IsNotEmpty, IsString, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTripDto {
  @IsNotEmpty()
  @IsString()
  originCity!: string;

  @IsNotEmpty()
  @IsString()
  destinationCity!: string;

  @IsOptional()
  @IsDateString()
  departureTime?: string;

  @IsNotEmpty()
  @IsString()
  vehicleId!: string;

  @IsOptional()
  @IsString()
  assignedDriverId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  pricePerSeat?: number = 5000;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  placesLibres?: number = 4;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  passagers?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  vehicleCapacity?: number = 5;
}

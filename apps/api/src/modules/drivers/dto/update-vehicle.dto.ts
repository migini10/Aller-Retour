import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { VehicleStatus } from '@prisma/client';

export class UpdateVehicleDto {
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @IsOptional()
  @IsString()
  insuranceExpiry?: string;

  @IsOptional()
  @IsString()
  inspectionExpiry?: string;

  @IsOptional()
  @IsString()
  plateNumber?: string;

  @IsOptional()
  @IsString()
  type?: any;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  year?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  capacity?: number;
}

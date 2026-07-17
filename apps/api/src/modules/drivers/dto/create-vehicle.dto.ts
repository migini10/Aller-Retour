import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { VehicleType, VehicleStatus } from '@prisma/client';

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  plateNumber!: string;

  @IsNotEmpty()
  @IsEnum(VehicleType)
  type!: VehicleType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  capacity?: number;

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
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @IsOptional()
  @IsString()
  inspectionExpiry?: string;
}

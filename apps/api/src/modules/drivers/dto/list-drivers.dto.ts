import { IsOptional, IsString, IsInt, Min, IsBooleanString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { KYCStatus } from '@prisma/client';

export class ListDriversDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(KYCStatus)
  kycStatus?: KYCStatus;

  @IsOptional()
  @IsBooleanString()
  hasVehicle?: string;

  @IsOptional()
  @IsBooleanString()
  isActive?: string;
}

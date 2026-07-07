import { IsOptional, IsString, IsEnum, IsInt, Min, IsBooleanString } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '@prisma/client';

export class ListUsersDto {
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
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  status?: 'ACTIVE' | 'SUSPENDED' | 'BANNED';

  @IsOptional()
  @IsBooleanString()
  verified?: string;
}

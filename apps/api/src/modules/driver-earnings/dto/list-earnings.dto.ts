import { IsOptional, IsString } from 'class-validator';

export class ListEarningsDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  driverId?: string;

  @IsOptional()
  @IsString()
  date?: string;
}

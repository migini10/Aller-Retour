import { IsString, IsOptional, IsDateString } from 'class-validator';

export class SearchTripsDto {
  @IsOptional()
  @IsString()
  originCity?: string;

  @IsOptional()
  @IsString()
  destinationCity?: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}

import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { DriverOperationalStatus } from '@aller-retour/database';

export class UpdateDriverStatusDto {
  @IsNotEmpty()
  @IsEnum(DriverOperationalStatus)
  status!: DriverOperationalStatus;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]{4}$/, { message: 'Le PIN doit contenir exactement 4 chiffres' })
  pin!: string;
}

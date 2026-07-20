import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class ConfigurePinDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{4}$/, { message: 'Le PIN doit contenir exactement 4 chiffres' })
  pin!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{4}$/, { message: 'La confirmation du code PIN doit comporter exactement 4 chiffres' })
  confirmPin!: string;
}

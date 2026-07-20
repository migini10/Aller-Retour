import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteVehicleDto {
  @ApiProperty({ example: '1234', description: 'Le code PIN du chauffeur pour confirmer la suppression' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{4}$/, { message: 'Le PIN doit contenir exactement 4 chiffres' })
  pin!: string;
}

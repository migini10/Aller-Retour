import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteVehicleDto {
  @ApiProperty({ example: '123456', description: 'Le code PIN du chauffeur pour confirmer la suppression' })
  @IsString()
  @IsNotEmpty()
  pin!: string;
}

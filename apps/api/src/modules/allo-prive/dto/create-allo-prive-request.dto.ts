import { IsString, IsNotEmpty, IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlloPriveRequestDto {
  @ApiProperty({ description: 'Origine de la course' })
  @IsString()
  @IsNotEmpty()
  origin!: string;

  @ApiProperty({ description: 'Destination de la course' })
  @IsString()
  @IsNotEmpty()
  destination!: string;

  @ApiProperty({ description: 'Date de départ prévue (YYYY-MM-DD)' })
  @IsString()
  @IsNotEmpty()
  departureDate!: string;

  @ApiProperty({ description: 'Prix proposé (FCFA)' })
  @IsInt()
  @Min(1000)
  price!: number;

  @ApiProperty({ description: 'Type de véhicule souhaité', default: 'allo-prive' })
  @IsString()
  @IsOptional()
  type?: string;
}

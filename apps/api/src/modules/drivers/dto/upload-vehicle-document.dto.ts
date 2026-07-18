import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleDocumentType } from '@aller-retour/database';

export class UploadVehicleDocumentDto {
  @ApiProperty({ enum: VehicleDocumentType, description: 'Le type de document (REGISTRATION_CARD, INSURANCE, TECHNICAL_INSPECTION)' })
  @IsEnum(VehicleDocumentType)
  type!: VehicleDocumentType;

  @ApiProperty({ required: false, description: 'Date d\'expiration au format ISO (ex: 2027-12-31T23:59:59Z)' })
  @IsOptional()
  @IsString()
  expiresAt?: string;
}

import {
  IsNotEmpty, IsString, IsOptional, IsNumber, IsPhoneNumber,
  Min, Max, MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateParcelDto {
  @IsNotEmpty({ message: 'Le tripId est obligatoire.' })
  @IsString()
  tripId!: string;

  @IsNotEmpty({ message: 'Le nom de l\'expéditeur est obligatoire.' })
  @IsString()
  @MaxLength(100)
  senderName!: string;

  @IsNotEmpty({ message: 'Le téléphone de l\'expéditeur est obligatoire.' })
  @IsString()
  @MaxLength(20)
  senderPhone!: string;

  @IsNotEmpty({ message: 'Le nom du destinataire est obligatoire.' })
  @IsString()
  @MaxLength(100)
  recipientName!: string;

  @IsNotEmpty({ message: 'Le téléphone du destinataire est obligatoire.' })
  @IsString()
  @MaxLength(20)
  recipientPhone!: string;

  @IsNotEmpty({ message: 'Le poids est obligatoire.' })
  @Type(() => Number)
  @IsNumber()
  @Min(0.1, { message: 'Le poids doit être supérieur à 0.' })
  @Max(500, { message: 'Le poids ne peut pas dépasser 500 kg.' })
  weightKg!: number;

  // Pickup location
  @IsOptional()
  @IsString()
  @MaxLength(255)
  pickupAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  pickupCity?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-90, { message: 'Latitude invalide.' })
  @Max(90, { message: 'Latitude invalide.' })
  pickupLatitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-180, { message: 'Longitude invalide.' })
  @Max(180, { message: 'Longitude invalide.' })
  pickupLongitude?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  pickupInstructions?: string;

  // Delivery location
  @IsOptional()
  @IsString()
  @MaxLength(255)
  deliveryAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  deliveryCity?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-90, { message: 'Latitude invalide.' })
  @Max(90, { message: 'Latitude invalide.' })
  deliveryLatitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-180, { message: 'Longitude invalide.' })
  @Max(180, { message: 'Longitude invalide.' })
  deliveryLongitude?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  deliveryInstructions?: string;
}

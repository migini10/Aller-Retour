import { IsNotEmpty, IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { ParcelStatus } from '@aller-retour/database';

export class UpdateParcelStatusDto {
  @IsNotEmpty({ message: 'Le nouveau statut est obligatoire.' })
  @IsEnum(ParcelStatus, { message: 'Statut invalide.' })
  status!: ParcelStatus;

  /** PIN chauffeur — requis pour ACCEPTED et IN_TRANSIT */
  @IsOptional()
  @IsString()
  @MaxLength(10)
  pin?: string;

  /** Code de livraison — requis pour DELIVERED */
  @IsOptional()
  @IsString()
  @MaxLength(10)
  deliveryCode?: string;
}

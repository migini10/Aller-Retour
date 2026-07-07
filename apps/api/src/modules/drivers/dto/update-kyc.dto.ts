import { IsEnum, IsNotEmpty } from 'class-validator';
import { KYCStatus } from '@prisma/client';

export class UpdateKycDto {
  @IsNotEmpty()
  @IsEnum(KYCStatus, {
    message: 'Action must be one of: PENDING, VERIFIED, REJECTED',
  })
  status!: KYCStatus;
}

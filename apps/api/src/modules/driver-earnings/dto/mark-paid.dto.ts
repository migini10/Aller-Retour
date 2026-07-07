import { IsNotEmpty, IsString } from 'class-validator';

export class MarkPaidDto {
  @IsNotEmpty()
  @IsString()
  payoutRef!: string;
}

import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAssignedDriverOwnerDto {
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  temporaryPassword!: string;
}

export class CreateAssignedDriverAdminDto extends CreateAssignedDriverOwnerDto {
  @IsString()
  @IsNotEmpty()
  managerId!: string;
}

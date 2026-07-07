import { IsEnum, IsNotEmpty } from 'class-validator';

export enum UserStatusAction {
  ACTIVATE = 'ACTIVATE',
  SUSPEND = 'SUSPEND',
  BLOCK = 'BLOCK',
}

export class UpdateUserStatusDto {
  @IsNotEmpty()
  @IsEnum(UserStatusAction, {
    message: 'Action must be one of: ACTIVATE, SUSPEND, BLOCK',
  })
  action!: UserStatusAction;
}

import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@aller-retour/database';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

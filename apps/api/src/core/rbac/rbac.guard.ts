import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { UserRole } from '@aller-retour/database';
import { AuthenticatedRequest } from '../tenant/tenant.guard';

// Définition de la carte des permissions par rôle
const RolePermissions: Record<UserRole, string[]> = {
  SUPER_ADMIN: ['*'], // Accès total sans restriction
  DRIVER: [
    'trips:manifest_download', 'bookings:scan', 'trips:marketplace_publish'
  ],
  PASSENGER: [
    'bookings:create', 'bookings:read_self', 'bookings:read', 'bookings:update'
  ]
};

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles && !requiredPermissions) {
      return true; // Endpoint public ou protégé par d'autres guards
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException("Utilisateur non authentifié.");
    }

    const userRole = user.role as UserRole;

    // 1. Vérification des Rôles
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = requiredRoles.includes(userRole) || userRole === 'SUPER_ADMIN';
      if (!hasRole) {
        console.log(`[DEBUG RBAC] Forbidden role. UserRole=${userRole}, RequiredRoles=${requiredRoles.join(', ')}`);
        throw new ForbiddenException(`DEBUG_REASON: Accès refusé. Rôle requis: ${requiredRoles.join(', ')}.`);
      }
    }

    // 2. Vérification des Permissions Unitaires
    if (requiredPermissions && requiredPermissions.length > 0) {
      if (userRole === 'SUPER_ADMIN') return true;

      const userPerms = RolePermissions[userRole] || [];
      const hasPermission = requiredPermissions.every(perm => userPerms.includes(perm));

      if (!hasPermission) {
        console.log(`[DEBUG RBAC] Forbidden permission. UserRole=${userRole}, RequiredPermissions=${requiredPermissions.join(', ')}`);
        throw new ForbiddenException(`DEBUG_REASON: Accès refusé. Permission requise: ${requiredPermissions.join(', ')}.`);
      }
    }

    return true;
  }
}

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '@aller-retour/database';

@Injectable()
export class VerifiedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    // Les Super Admins sont toujours autorisés
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    // Le compte doit être vérifié (verifiedAt non null)
    if (!user.verifiedAt) {
      throw new ForbiddenException({
        statusCode: 403,
        error: 'Forbidden',
        message: 'ACCOUNT_NOT_VERIFIED',
        details: "Votre compte n'est pas encore vérifié. Vérifiez votre e-mail ou WhatsApp pour continuer."
      });
    }

    return true;
  }
}

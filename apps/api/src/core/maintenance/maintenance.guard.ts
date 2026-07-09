import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { SettingsService } from '../../modules/settings/settings.service';
import { UserRole } from '@aller-retour/database';

@Injectable()
export class MaintenanceGuard implements CanActivate {
  constructor(private readonly settingsService: SettingsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Always allow GET requests (read-only)
    if (request.method === 'GET') {
      return true;
    }

    const settings = await this.settingsService.getSettings();

    // If maintenance mode is off, allow
    if (!settings.maintenanceMode) {
      return true;
    }

    // --- Exceptions to maintenance mode block ---

    const path = request.path;

    // 1. Webhooks (always allow)
    if (path.includes('/webhook')) {
      return true;
    }

    // 2. Auth routes (always allow login/register/etc.)
    if (path.includes('/auth')) {
      return true;
    }

    // 3. Super Admin operations (always allow)
    const user = request.user;
    if (user && user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    // If none of the above exceptions met, block the mutation request
    throw new HttpException(
      {
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'La plateforme est actuellement en maintenance. Les créations et modifications sont temporairement désactivées.',
        error: 'Service Unavailable'
      },
      HttpStatus.SERVICE_UNAVAILABLE
    );
  }
}

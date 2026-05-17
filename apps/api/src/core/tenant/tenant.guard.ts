import { Request } from 'express';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    companyId?: string;
    role: string;
    phone: string;
  };
  tenantId?: string;
}

@Injectable()
export class TenantContextGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    
    // Détection du tenant via Header 'x-tenant-id' ou via le User (companyId)
    const headerTenantId = request.headers['x-tenant-id'] as string;
    const userCompanyId = request.user?.companyId;

    // Si l'utilisateur est un TENANT_ADMIN ou DISPATCHER, on s'assure qu'il accède bien à son GIE
    if (userCompanyId) {
      if (headerTenantId && headerTenantId !== userCompanyId && request.user?.role !== 'SUPER_ADMIN') {
        throw new UnauthorizedException("Accès non autorisé à ce transporteur (Tenant non correspondant).");
      }
      request.tenantId = userCompanyId;
    } else if (headerTenantId) {
      request.tenantId = headerTenantId;
    }

    return true;
  }
}

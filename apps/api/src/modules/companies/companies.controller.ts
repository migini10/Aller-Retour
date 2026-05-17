import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RbacGuard } from '../../core/rbac/rbac.guard';
import { TenantContextGuard } from '../../core/tenant/tenant.guard';
import { Roles } from '../../core/rbac/roles.decorator';
import { Permissions } from '../../core/rbac/permissions.decorator';
import { prisma, UserRole, TenantPlan } from '@aller-retour/database';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  taxId!: string; // NINEA

  @IsEnum(TenantPlan)
  @IsOptional()
  plan?: TenantPlan;
}

@ApiTags('Companies & GIE (Tenants)')
@Controller('companies')
@UseGuards(AuthGuard('jwt'), RbacGuard, TenantContextGuard)
@ApiBearerAuth()
export class CompaniesController {
  
  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  @Permissions('companies:read')
  @ApiOperation({ summary: 'Obtenir la liste des GIE ou les détails de ma compagnie' })
  async getCompanies(@Req() req: any) {
    if (req.user.role === 'SUPER_ADMIN') {
      return prisma.company.findMany({ include: { _count: { select: { vehicles: true, trips: true } } } });
    }
    // Si Tenant Admin, renvoie uniquement son GIE
    return prisma.company.findUnique({
      where: { id: req.user.companyId },
      include: { vehicles: true, routes: true },
    });
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @Permissions('companies:create')
  @ApiOperation({ summary: 'Onboarder un nouveau transporteur (Réservé aux Super Admins)' })
  async createCompany(@Body() dto: CreateCompanyDto) {
    return prisma.company.create({
      data: {
        name: dto.name,
        taxId: dto.taxId,
        plan: dto.plan || TenantPlan.STANDARD,
      },
    });
  }
}

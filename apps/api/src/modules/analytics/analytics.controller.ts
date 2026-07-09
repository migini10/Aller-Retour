import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { DashboardAnalyticsDto } from './dto/dashboard-analytics.dto';
import { AuthGuard } from '@nestjs/passport';
import { RbacGuard } from '../../core/rbac/rbac.guard';
import { Roles } from '../../core/rbac/roles.decorator';
import { UserRole } from '@aller-retour/database';

@ApiTags('Analytics')
@Controller('v1/analytics')
@UseGuards(AuthGuard('jwt'), RbacGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get dashboard analytics for Super Admin' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard analytics retrieved successfully.',
    type: DashboardAnalyticsDto,
  })
  async getDashboardAnalytics(): Promise<DashboardAnalyticsDto> {
    return this.analyticsService.getDashboardAnalytics();
  }
}

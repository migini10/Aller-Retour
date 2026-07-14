import { Controller, Post, Get, Body, Param, Patch, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VerifiedGuard } from '../../core/auth/verified.guard';
import { AlloPriveService } from './allo-prive.service';
import { CreateAlloPriveRequestDto } from './dto/create-allo-prive-request.dto';
import { RbacGuard } from '../../core/rbac/rbac.guard';
import { UserRole } from '@aller-retour/database';
import { Roles } from '../../core/rbac/roles.decorator';

@Controller('v1/allo-prive')
@UseGuards(AuthGuard('jwt'), VerifiedGuard, RbacGuard)
export class AlloPriveController {
  constructor(private readonly alloPriveService: AlloPriveService) {}

  @Post('requests')
  @Roles(UserRole.PASSENGER)
  createRequest(@Req() req: any, @Body() dto: CreateAlloPriveRequestDto) {
    return this.alloPriveService.createRequest(req.user.id, dto);
  }

  @Get('requests/my-requests')
  @Roles(UserRole.PASSENGER)
  getMyRequests(@Req() req: any) {
    return this.alloPriveService.getMyRequests(req.user.id);
  }

  @Get('requests/available')
  @Roles(UserRole.DRIVER, UserRole.SUPER_ADMIN)
  getAvailableRequests(@Req() req: any) {
    return this.alloPriveService.getAvailableRequests(req.user.id, req.user.role);
  }

  @Get('requests/:id')
  @Roles(UserRole.PASSENGER, UserRole.DRIVER, UserRole.SUPER_ADMIN)
  getRequestById(@Req() req: any, @Param('id') id: string) {
    return this.alloPriveService.getRequestById(id, req.user.id, req.user.role);
  }

  @Get('requests/:id/applications')
  @Roles(UserRole.PASSENGER, UserRole.SUPER_ADMIN)
  getApplications(@Req() req: any, @Param('id') id: string) {
    return this.alloPriveService.getRequestApplications(id, req.user.id, req.user.role);
  }

  @Post('requests/:id/apply')
  @Roles(UserRole.DRIVER)
  applyToRequest(@Req() req: any, @Param('id') id: string) {
    return this.alloPriveService.applyToRequest(id, req.user.id, req.user.role);
  }

  @Patch('applications/:id/accept')
  @Roles(UserRole.PASSENGER, UserRole.SUPER_ADMIN)
  acceptApplication(@Req() req: any, @Param('id') id: string) {
    return this.alloPriveService.acceptApplication(id, req.user.id, req.user.role);
  }

  @Post('requests/:id/cancel')
  @Roles(UserRole.PASSENGER, UserRole.SUPER_ADMIN)
  cancelRequest(@Req() req: any, @Param('id') id: string) {
    return this.alloPriveService.cancelRequest(id, req.user.id, req.user.role);
  }

  @Post('requests/:id/complete')
  @Roles(UserRole.PASSENGER, UserRole.SUPER_ADMIN)
  completeRequest(@Req() req: any, @Param('id') id: string) {
    return this.alloPriveService.completeRequest(id, req.user.id, req.user.role);
  }
}

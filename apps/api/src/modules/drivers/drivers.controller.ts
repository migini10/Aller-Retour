import { Controller, Get, Patch, Post, Param, Body, Query, UseGuards, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { RbacGuard } from '../../core/rbac/rbac.guard';
import { Roles } from '../../core/rbac/roles.decorator';
import { UserRole } from '@aller-retour/database';

import { DriversService } from './drivers.service';
import { ListDriversDto } from './dto/list-drivers.dto';
import { UpdateKycDto } from './dto/update-kyc.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get('me/vehicles')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.DRIVER)
  async getMyVehicles(@Request() req: any) {
    return this.driversService.getMyVehicles(req.user.id);
  }

  @Post('me/vehicles')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.DRIVER)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'frontPhoto', maxCount: 1 },
    { name: 'rearPhoto', maxCount: 1 },
    { name: 'sidePhoto', maxCount: 1 },
  ]))
  async createMyVehicle(
    @Request() req: any, 
    @Body() dto: CreateVehicleDto,
    @UploadedFiles() files: { frontPhoto?: Express.Multer.File[], rearPhoto?: Express.Multer.File[], sidePhoto?: Express.Multer.File[] },
  ) {
    console.log('=== BACKEND POST /v1/drivers/me/vehicles ===');
    console.log('User ID:', req.user.id);
    console.log('Body (DTO):', dto);
    console.log('Files received:', {
      frontPhoto: files?.frontPhoto?.length ? true : false,
      rearPhoto: files?.rearPhoto?.length ? true : false,
      sidePhoto: files?.sidePhoto?.length ? true : false,
    });
    console.log('=============================================');
    return this.driversService.createVehicleForDriver(req.user.id, dto, files);
  }

  @Patch('me/vehicles/:vehicleId')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.DRIVER)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'frontPhoto', maxCount: 1 },
    { name: 'rearPhoto', maxCount: 1 },
    { name: 'sidePhoto', maxCount: 1 },
  ]))
  async updateMyVehicle(
    @Request() req: any,
    @Param('vehicleId') vehicleId: string,
    @Body() dto: UpdateVehicleDto,
    @UploadedFiles() files?: { frontPhoto?: Express.Multer.File[], rearPhoto?: Express.Multer.File[], sidePhoto?: Express.Multer.File[] },
  ) {
    return this.driversService.updateVehicleForDriver(req.user.id, vehicleId, dto, files);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async findAll(@Query() filters: ListDriversDto) {
    return this.driversService.findAll(filters);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async findOne(@Param('id') id: string) {
    return this.driversService.findOne(id);
  }

  @Patch(':id/kyc')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async updateKyc(@Param('id') id: string, @Body() dto: UpdateKycDto) {
    return this.driversService.updateKyc(id, dto);
  }

  @Get('admin/vehicles')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async getAllAdminVehicles() {
    return this.driversService.getAllVehiclesAdmin();
  }

  @Post('admin/storage/vehicle-photo-smoke-test')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async runStorageSmokeTest() {
    return this.driversService.smokeTestStorageAdmin();
  }

  @Get(':id/vehicles')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async getVehicles(@Param('id') id: string) {
    return this.driversService.getVehicles(id);
  }

  @Post(':id/vehicles')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async createVehicle(
    @Param('id') id: string,
    @Body() dto: CreateVehicleDto,
  ) {
    return this.driversService.createVehicleForAdmin(id, dto);
  }

  @Patch('admin/vehicles/:vehicleId/approve')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async approveVehicle(
    @Request() req: any,
    @Param('vehicleId') vehicleId: string,
  ) {
    return this.driversService.approveVehicleAdmin(req.user.id, vehicleId);
  }

  @Patch('admin/vehicles/:vehicleId/reject')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async rejectVehicle(
    @Request() req: any,
    @Param('vehicleId') vehicleId: string,
    @Body() dto: { reason?: string },
  ) {
    return this.driversService.rejectVehicleAdmin(req.user.id, vehicleId, dto.reason);
  }

  @Patch('admin/vehicles/:vehicleId/certify')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async certifyVehicle(
    @Request() req: any,
    @Param('vehicleId') vehicleId: string,
  ) {
    return this.driversService.certifyVehicleAdmin(req.user.id, vehicleId);
  }

  @Patch('admin/vehicles/:vehicleId/revoke-certification')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async revokeCertification(
    @Request() req: any,
    @Param('vehicleId') vehicleId: string,
  ) {
    return this.driversService.revokeCertificationAdmin(req.user.id, vehicleId);
  }

  @Patch(':id/vehicles/:vehicleId')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async updateVehicle(
    @Param('id') id: string,
    @Param('vehicleId') vehicleId: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    return this.driversService.updateVehicle(id, vehicleId, dto);
  }

  @Get(':id/earnings')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async getEarnings(@Param('id') id: string) {
    return this.driversService.getEarnings(id);
  }

  @Get(':id/reviews')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async getReviews(@Param('id') id: string) {
    return this.driversService.getReviews(id);
  }
}

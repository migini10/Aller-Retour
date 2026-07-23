import { Controller, Get, Patch, Post, Delete, Param, Body, Query, UseGuards, Request, UseInterceptors, UploadedFiles, UploadedFile, BadRequestException } from '@nestjs/common';
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
import { DeleteVehicleDto } from './dto/delete-vehicle.dto';
import { UploadVehicleDocumentDto } from './dto/upload-vehicle-document.dto';
import { UpdateDriverStatusDto } from './dto/update-driver-status.dto';
import { ConfigurePinDto } from './dto/configure-pin.dto';
import { CreateAssignedDriverAdminDto, CreateAssignedDriverOwnerDto } from './dto/create-assigned-driver.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get('me/vehicles')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.DRIVER)
  async getMyVehicles(@Request() req: any) {
    return this.driversService.getMyVehicles(req.user.id);
  }

  @Post('me/assigned')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.DRIVER)
  async createAssignedDriverForOwner(
    @Request() req: any,
    @Body() dto: CreateAssignedDriverOwnerDto
  ) {
    return this.driversService.createAssignedDriverForOwner(req.user.id, dto);
  }

  @Post('admin/assigned')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async createAssignedDriverForAdmin(@Body() dto: CreateAssignedDriverAdminDto) {
    return this.driversService.createAssignedDriverForAdmin(dto);
  }

  @Get('me/assigned-drivers')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.DRIVER)
  async getMyAssignedDrivers(@Request() req: any) {
    return this.driversService.getMyAssignedDrivers(req.user.id);
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

  @Patch('me/status')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.DRIVER)
  async updateMyStatus(
    @Request() req: any,
    @Body() dto: UpdateDriverStatusDto,
  ) {
    return this.driversService.updateDriverStatus(req.user.id, dto.status, dto.pin);
  }

  @Post('me/pin')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.DRIVER)
  async configurePin(
    @Request() req: any,
    @Body() dto: ConfigurePinDto,
  ) {
    return this.driversService.configurePin(req.user.id, dto);
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

  @Delete('me/vehicles/:vehicleId')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.DRIVER)
  async deleteVehicle(
    @Request() req: any,
    @Param('vehicleId') vehicleId: string,
    @Body() dto: DeleteVehicleDto,
  ) {
    return this.driversService.deleteVehicle(req.user.id, vehicleId, dto.pin);
  }

  @Post('me/vehicles/:vehicleId/documents')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.DRIVER)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'frontFile', maxCount: 1 }, { name: 'backFile', maxCount: 1 }]))
  async uploadVehicleDocument(
    @Request() req: any,
    @Param('vehicleId') vehicleId: string,
    @Body() dto: UploadVehicleDocumentDto,
    @UploadedFiles() files: { frontFile?: Express.Multer.File[], backFile?: Express.Multer.File[] },
  ) {
    if (!files || !files.frontFile || files.frontFile.length === 0) {
      throw new BadRequestException('Veuillez fournir au moins le fichier recto (frontFile) du document.');
    }
    const frontFile = files.frontFile[0];
    const backFile = files.backFile && files.backFile.length > 0 ? files.backFile[0] : undefined;
    
    return this.driversService.uploadVehicleDocument(req.user.id, vehicleId, dto, frontFile, backFile);
  }

  @Get('me/vehicles/:vehicleId/documents')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.DRIVER)
  async getVehicleDocuments(
    @Request() req: any,
    @Param('vehicleId') vehicleId: string,
  ) {
    return this.driversService.getVehicleDocuments(req.user.id, vehicleId);
  }

  @Get('admin/vehicles/:vehicleId/documents')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async getVehicleDocumentsAdmin(
    @Param('vehicleId') vehicleId: string,
  ) {
    // Reusing the same method but bypassing the driver owner check by passing null for driverUserId
    return this.driversService.getVehicleDocuments(null, vehicleId);
  }

  @Patch('admin/vehicle-documents/:documentId/approve')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async approveVehicleDocument(
    @Request() req: any,
    @Param('documentId') documentId: string,
  ) {
    return this.driversService.approveVehicleDocument(req.user.id, documentId);
  }

  @Patch('admin/vehicle-documents/:documentId/reject')
  @UseGuards(AuthGuard('jwt'), RbacGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async rejectVehicleDocument(
    @Request() req: any,
    @Param('documentId') documentId: string,
    @Body() body: { reason: string },
  ) {
    if (!body.reason) {
      throw new BadRequestException('La raison du rejet est requise.');
    }
    return this.driversService.rejectVehicleDocument(req.user.id, documentId, body.reason);
  }
}

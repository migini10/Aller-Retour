import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma, KYCStatus, DocumentStatus } from '@aller-retour/database';
import { ListDriversDto } from './dto/list-drivers.dto';
import { UpdateKycDto } from './dto/update-kyc.dto';
import { SupabaseService } from '../../core/supabase/supabase.service';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UploadVehicleDocumentDto } from './dto/upload-vehicle-document.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Express } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcrypt';
import { DriverOperationalStatus } from '@aller-retour/database';

@Injectable()
export class DriversService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly authService: AuthService
  ) {}

  private cleanPlate(plate: string): string {
    return plate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  }
  async findAll(filters: ListDriversDto) {
    const { page = 1, limit = 10, search, kycStatus, hasVehicle, isActive } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.user = {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    if (kycStatus) {
      where.kycStatus = kycStatus;
    }

    if (hasVehicle === 'true') {
      where.vehicles = { some: {} };
    } else if (hasVehicle === 'false') {
      where.vehicles = { none: {} };
    }

    if (isActive !== undefined) {
      if (!where.user) where.user = {};
      where.user.isActive = isActive === 'true';
    }

    const [total, drivers] = await Promise.all([
      prisma.driverProfile.count({ where }),
      prisma.driverProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              fullName: true,
              phone: true,
              email: true,
              avatarUrl: true,
              isActive: true,
            },
          },
          _count: {
            select: { vehicles: true, trips: true },
          },
        },
      }),
    ]);

    return {
      data: drivers.map((d: any) => ({
        id: d.id,
        userId: d.userId,
        type: d.type,
        fullName: d.user?.fullName,
        phone: d.user?.phone,
        email: d.user?.email,
        avatarUrl: d.user?.avatarUrl,
        isActive: d.user?.isActive,
        kycStatus: d.kycStatus,
        rating: d.rating,
        totalTrips: d.totalTrips,
        vehiclesCount: d._count?.vehicles || 0,
        createdAt: d.createdAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const driver = await prisma.driverProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            fullName: true,
            phone: true,
            email: true,
            avatarUrl: true,
            isActive: true,
            createdAt: true,
          },
        },
        manager: {
          include: {
            user: { select: { fullName: true, phone: true } },
          },
        },
        employees: {
          include: {
            user: { select: { fullName: true, phone: true } },
          },
        },
        vehicles: true,
      },
    });

    if (!driver) {
      throw new NotFoundException('Chauffeur introuvable');
    }

    return driver;
  }

  async updateKyc(id: string, dto: UpdateKycDto) {
    const driver = await prisma.driverProfile.update({
      where: { id },
      data: {
        kycStatus: dto.status,
        isVerified: dto.status === KYCStatus.VERIFIED,
      },
    });
    return driver;
  }

  async getVehicles(id: string) {
    const vehicles = await prisma.vehicle.findMany({
      where: { ownerId: id },
    });
    return Promise.all(vehicles.map(async (v) => {
      return {
        ...v,
        frontPhotoUrl: v.frontPhotoKey ? await this.supabase.getSignedUrl('vehicles', v.frontPhotoKey) : null,
        rearPhotoUrl: v.rearPhotoKey ? await this.supabase.getSignedUrl('vehicles', v.rearPhotoKey) : null,
        sidePhotoUrl: v.sidePhotoKey ? await this.supabase.getSignedUrl('vehicles', v.sidePhotoKey) : null,
      };
    }));
  }

  async createVehicleForAdmin(driverId: string, dto: CreateVehicleDto) {
    const driver = await prisma.driverProfile.findUnique({ where: { id: driverId } });
    if (!driver) throw new NotFoundException('Chauffeur introuvable');

    const existingVehicle = await prisma.vehicle.findUnique({ where: { plateNumber: dto.plateNumber } });
    if (existingVehicle) throw new BadRequestException('Un véhicule avec cette plaque existe déjà');

    let enforcedCapacity = dto.capacity || 5;
    if (dto.type === 'TAXI_5_PLACES') enforcedCapacity = 5;
    if (dto.type === 'TAXI_7_PLACES') enforcedCapacity = 7;

    return prisma.vehicle.create({
      data: {
        ...dto,
        capacity: enforcedCapacity,
        ownerId: driverId,
        approvalStatus: dto.status || 'APPROVED', // Admin created vehicles are approved by default
        insuranceExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        inspectionExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      },
    });
  }

  async createVehicleForDriver(
    userId: string, 
    dto: CreateVehicleDto, 
    files?: { frontPhoto?: Express.Multer.File[], rearPhoto?: Express.Multer.File[], sidePhoto?: Express.Multer.File[] }
  ) {
    const driver = await prisma.driverProfile.findUnique({ where: { userId } });
    if (!driver) throw new NotFoundException('Profil chauffeur introuvable');
    if (driver.type !== 'OWNER') throw new BadRequestException('Seul un chauffeur propriétaire peut ajouter un véhicule');

    const existingVehicle = await prisma.vehicle.findUnique({ where: { plateNumber: dto.plateNumber } });
    if (existingVehicle) throw new BadRequestException('Un véhicule avec cette plaque existe déjà');

    if (dto.type !== 'TAXI_5_PLACES' && dto.type !== 'TAXI_7_PLACES') {
      throw new BadRequestException('Seuls les taxis (5 ou 7 places) sont acceptés pour le moment');
    }

    if (!files?.frontPhoto?.[0] || !files?.rearPhoto?.[0] || !files?.sidePhoto?.[0]) {
      throw new BadRequestException('Les 3 photos (avant, arrière, latérale) sont obligatoires.');
    }

    // validate sizes/types
    const validateFile = (f: Express.Multer.File) => {
      if (f.size > 5 * 1024 * 1024) throw new BadRequestException(`Fichier trop volumineux (max 5MB)`);
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.mimetype)) throw new BadRequestException(`Format invalide. Seuls JPG/PNG/WEBP acceptés.`);
    };
    validateFile(files.frontPhoto[0]);
    validateFile(files.rearPhoto[0]);
    validateFile(files.sidePhoto[0]);

    let enforcedCapacity = dto.capacity || 5;
    if (dto.type === 'TAXI_5_PLACES') enforcedCapacity = 5;
    if (dto.type === 'TAXI_7_PLACES') enforcedCapacity = 7;

    // Generate ID beforehand to use in paths and ensure atomic insert
    const vehicleId = crypto.randomUUID();

    let frontPath = '';
    let rearPath = '';
    let sidePath = '';

    let uploadedPaths: string[] = [];
    try {
      const ext1 = files.frontPhoto[0].mimetype.split('/')[1];
      const ext2 = files.rearPhoto[0].mimetype.split('/')[1];
      const ext3 = files.sidePhoto[0].mimetype.split('/')[1];
      
      const plate = this.cleanPlate(dto.plateNumber);
      frontPath = `${plate}_${vehicleId}/photos/front.${ext1}`;
      rearPath = `${plate}_${vehicleId}/photos/rear.${ext2}`;
      sidePath = `${plate}_${vehicleId}/photos/side.${ext3}`;

      console.log('--- SUPABASE UPLOAD ATTEMPT ---');
      console.log(`Front Path: ${frontPath}`);
      console.log(`Rear Path: ${rearPath}`);
      console.log(`Side Path: ${sidePath}`);

      if (!files.frontPhoto[0].buffer || files.frontPhoto[0].size === 0) throw new Error("Front photo buffer is empty");
      if (!files.rearPhoto[0].buffer || files.rearPhoto[0].size === 0) throw new Error("Rear photo buffer is empty");
      if (!files.sidePhoto[0].buffer || files.sidePhoto[0].size === 0) throw new Error("Side photo buffer is empty");

      await this.supabase.uploadFile('vehicles', frontPath, files.frontPhoto[0]);
      uploadedPaths.push(frontPath);
      await this.supabase.uploadFile('vehicles', rearPath, files.rearPhoto[0]);
      uploadedPaths.push(rearPath);
      await this.supabase.uploadFile('vehicles', sidePath, files.sidePhoto[0]);
      uploadedPaths.push(sidePath);

      console.log('--- SUPABASE UPLOAD SUCCESS ---');
    } catch (e) {
      console.error('--- SUPABASE ERROR EXCEPTION ---');
      console.error(e);
      // Rollback
      for (const path of uploadedPaths) {
        await this.supabase.deleteFile('vehicles', path).catch(err => console.error('Rollback error:', err));
      }
      throw new BadRequestException(`Erreur lors de l'upload des photos: ${(e as Error).message || e}`);
    }

    console.log('--- PRISMA DB INSERT ATTEMPT ---');
    try {
      const newVehicle = await prisma.vehicle.create({
        data: {
          ...dto,
          id: vehicleId,
          capacity: enforcedCapacity,
          ownerId: driver.id,
          approvalStatus: 'PENDING_REVIEW', // Driver submitted vehicles are pending review
          insuranceExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          inspectionExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          frontPhotoKey: frontPath,
          rearPhotoKey: rearPath,
          sidePhotoKey: sidePath,
        },
      });
      console.log('--- PRISMA DB INSERT SUCCESS ---');
      return newVehicle;
    } catch (dbError) {
      for (const path of uploadedPaths) {
        await this.supabase.deleteFile('vehicles', path).catch(console.error);
      }
      throw new BadRequestException(`Erreur base de données lors de la création du véhicule: ${(dbError as Error).message}`);
    }
  }

  async getMyVehicles(userId: string) {
    const driver = await prisma.driverProfile.findUnique({ where: { userId } });
    if (!driver) throw new NotFoundException('Profil chauffeur introuvable');

    const vehicles = await prisma.vehicle.findMany({
      where: { ownerId: driver.id },
    });

    return Promise.all(vehicles.map(async (v) => {
      let frontPhotoUrl = null;
      let rearPhotoUrl = null;
      let sidePhotoUrl = null;

      try {
        if (v.frontPhotoKey) frontPhotoUrl = await this.supabase.getSignedUrl('vehicles', v.frontPhotoKey);
        if (v.rearPhotoKey) rearPhotoUrl = await this.supabase.getSignedUrl('vehicles', v.rearPhotoKey);
        if (v.sidePhotoKey) sidePhotoUrl = await this.supabase.getSignedUrl('vehicles', v.sidePhotoKey);
      } catch (e) {
        console.error('--- DRIVER GET VEHICLES SIGNED URL ERROR ---');
        console.error(`Vehicle ID: ${v.id}`);
        console.error(e);
      }

      return {
        ...v,
        frontPhotoUrl,
        rearPhotoUrl,
        sidePhotoUrl,
      };
    }));
  }

  async getAllVehiclesAdmin() {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        owner: {
          include: {
            user: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return Promise.all(vehicles.map(async (v) => {
      let frontPhotoUrl = null;
      let rearPhotoUrl = null;
      let sidePhotoUrl = null;

      try {
        if (v.frontPhotoKey) frontPhotoUrl = await this.supabase.getSignedUrl('vehicles', v.frontPhotoKey);
        if (v.rearPhotoKey) rearPhotoUrl = await this.supabase.getSignedUrl('vehicles', v.rearPhotoKey);
        if (v.sidePhotoKey) sidePhotoUrl = await this.supabase.getSignedUrl('vehicles', v.sidePhotoKey);
      } catch (e) {
        console.error('--- ADMIN GET VEHICLES SIGNED URL ERROR ---');
        console.error(`Vehicle ID: ${v.id}`);
        console.error(e);
      }

      return {
        ...v,
        frontPhotoUrl,
        rearPhotoUrl,
        sidePhotoUrl,
      };
    }));
  }

  async updateVehicleForDriver(
    userId: string, 
    vehicleId: string, 
    dto: UpdateVehicleDto,
    files?: { frontPhoto?: Express.Multer.File[], rearPhoto?: Express.Multer.File[], sidePhoto?: Express.Multer.File[] }
  ) {
    const driver = await prisma.driverProfile.findUnique({ where: { userId } });
    if (!driver || driver.type !== 'OWNER') {
      throw new BadRequestException('Seul un chauffeur propriétaire peut modifier ses véhicules');
    }

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle || vehicle.ownerId !== driver.id) {
      throw new NotFoundException('Véhicule introuvable ou non autorisé');
    }

    // validate sizes/types if files provided
    const validateFile = (f: Express.Multer.File) => {
      if (f.size > 5 * 1024 * 1024) throw new BadRequestException(`Fichier trop volumineux (max 5MB)`);
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.mimetype)) throw new BadRequestException(`Format invalide. Seuls JPG/PNG/WEBP acceptés.`);
    };
    if (files?.frontPhoto?.[0]) validateFile(files.frontPhoto[0]);
    if (files?.rearPhoto?.[0]) validateFile(files.rearPhoto[0]);
    if (files?.sidePhoto?.[0]) validateFile(files.sidePhoto[0]);

    // Business Logic: If certified, cannot modify critical fields
    const isCriticalChange = !!(dto.plateNumber || dto.type || files?.frontPhoto?.[0] || files?.rearPhoto?.[0] || files?.sidePhoto?.[0]);
    
    if (vehicle.certificationStatus === 'CERTIFIED' && isCriticalChange) {
      throw new BadRequestException('Impossible de modifier un véhicule certifié. Contactez le support.');
    }

    let nextApprovalStatus = vehicle.approvalStatus;
    if (vehicle.approvalStatus === 'APPROVED' && vehicle.certificationStatus !== 'CERTIFIED' && isCriticalChange) {
      nextApprovalStatus = 'PENDING_REVIEW';
    } else if (vehicle.approvalStatus === 'REJECTED') {
      nextApprovalStatus = 'PENDING_REVIEW';
    }

    let enforcedCapacity = vehicle.capacity;
    if (dto.type === 'TAXI_5_PLACES') enforcedCapacity = 5;
    if (dto.type === 'TAXI_7_PLACES') enforcedCapacity = 7;

    let frontPath = vehicle.frontPhotoKey;
    let rearPath = vehicle.rearPhotoKey;
    let sidePath = vehicle.sidePhotoKey;

    let uploadedPaths: string[] = [];
    try {
      const plate = this.cleanPlate(vehicle.plateNumber);

      if (files?.frontPhoto?.[0]) {
        if (!files.frontPhoto[0].buffer || files.frontPhoto[0].size === 0) throw new Error("Front photo buffer is empty");
        const ext = files.frontPhoto[0].mimetype.split('/')[1];
        frontPath = `${plate}_${vehicle.id}/photos/front.${ext}`;
        await this.supabase.uploadFile('vehicles', frontPath, files.frontPhoto[0]);
        uploadedPaths.push(frontPath);
      }
      if (files?.rearPhoto?.[0]) {
        if (!files.rearPhoto[0].buffer || files.rearPhoto[0].size === 0) throw new Error("Rear photo buffer is empty");
        const ext = files.rearPhoto[0].mimetype.split('/')[1];
        rearPath = `${plate}_${vehicle.id}/photos/rear.${ext}`;
        await this.supabase.uploadFile('vehicles', rearPath, files.rearPhoto[0]);
        uploadedPaths.push(rearPath);
      }
      if (files?.sidePhoto?.[0]) {
        if (!files.sidePhoto[0].buffer || files.sidePhoto[0].size === 0) throw new Error("Side photo buffer is empty");
        const ext = files.sidePhoto[0].mimetype.split('/')[1];
        sidePath = `${plate}_${vehicle.id}/photos/side.${ext}`;
        await this.supabase.uploadFile('vehicles', sidePath, files.sidePhoto[0]);
        uploadedPaths.push(sidePath);
      }
    } catch (e) {
      console.error('--- SUPABASE ERROR EXCEPTION IN UPDATE ---');
      console.error(e);
      for (const path of uploadedPaths) {
        await this.supabase.deleteFile('vehicles', path).catch(err => console.error('Rollback error:', err));
      }
      throw new BadRequestException(`Erreur lors de l'upload des nouvelles photos: ${(e as Error).message || e}`);
    }

    if (!frontPath || !rearPath || !sidePath) {
      throw new BadRequestException("Toutes les photos doivent être présentes en base de données.");
    }

    return prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        ...dto,
        capacity: enforcedCapacity,
        approvalStatus: nextApprovalStatus,
        frontPhotoKey: frontPath,
        rearPhotoKey: rearPath,
        sidePhotoKey: sidePath,
      },
    }).catch(async (dbError) => {
      for (const path of uploadedPaths) {
        await this.supabase.deleteFile('vehicles', path).catch(console.error);
      }
      throw new BadRequestException(`Erreur DB lors de la modification: ${(dbError as Error).message}`);
    });
  }

  async smokeTestStorageAdmin() {
    if (process.env.ENABLE_STORAGE_DIAGNOSTICS !== 'true') {
      throw new BadRequestException("Storage diagnostics are disabled.");
    }
    
    const client = this.supabase.getClient();
    const bucketName = 'vehicles';
    const timestamp = Date.now();
    const frontPath = `diagnostics/${timestamp}/front.jpg`;
    
    const audit: any = {
      envSupabaseUrlExists: !!process.env.SUPABASE_URL,
      envSupabaseKeyExists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      maskedSupabaseUrl: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.replace(/https?:\/\//, '').split('.')[0] + '...supabase.co' : 'null',
      bucketUsed: bucketName,
      listBucketsAttempted: true,
      listBucketsError: null,
      bucketExists: false,
      bucketPrivate: null,
      uploadAttempted: false,
      uploadError: null,
      uploadPath: frontPath,
      signedUrlAttempted: false,
      signedUrlError: null,
      signedUrls: [],
    };

    // 1. List Buckets
    try {
      const { data: buckets, error: bucketsError } = await client.storage.listBuckets();
      if (bucketsError) {
        audit.listBucketsError = bucketsError;
      } else {
        const vehicleBucket = buckets?.find(b => b.name === bucketName);
        if (vehicleBucket) {
          audit.bucketExists = true;
          audit.bucketPrivate = !vehicleBucket.public;
        }
      }
    } catch (e) {
      audit.listBucketsError = String(e);
    }

    // 2. Upload
    audit.uploadAttempted = true;
    const pixelBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    const buffer = Buffer.from(pixelBase64, 'base64');
    
    try {
      const { data: uploadData, error: uploadError } = await client.storage
        .from(bucketName)
        .upload(frontPath, buffer, { contentType: 'image/jpeg', upsert: true });
        
      if (uploadError) {
        audit.uploadError = uploadError;
      } else {
        audit.uploadSuccess = true;
      }
    } catch (e) {
      audit.uploadError = String(e);
    }

    // 3. Signed URL
    if (audit.uploadSuccess) {
      audit.signedUrlAttempted = true;
      try {
        const { data: signedData, error: signedError } = await client.storage
          .from(bucketName)
          .createSignedUrl(frontPath, 3600);
          
        if (signedError) {
          audit.signedUrlError = signedError;
        } else if (signedData?.signedUrl) {
          audit.signedUrls.push(signedData.signedUrl);
        }
      } catch (e) {
        audit.signedUrlError = String(e);
      }
    }

    // Final result checks
    audit.frontUploaded = audit.uploadSuccess || false;
    audit.rearUploaded = audit.frontUploaded;
    audit.sideUploaded = audit.frontUploaded;
    audit.signedUrlsGenerated = audit.signedUrls.length > 0;

    return audit;
  }

  async approveVehicleAdmin(adminId: string, vehicleId: string) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) throw new NotFoundException("Véhicule introuvable");

    const inOneYear = new Date();
    inOneYear.setFullYear(inOneYear.getFullYear() + 1);

    return prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        approvalStatus: 'APPROVED',
        approvedAt: new Date(),
        approvedById: adminId,
        photosRenewalStatus: 'VALID',
        photosApprovedAt: new Date(),
        photosExpireAt: inOneYear,
      },
    });
  }

  async rejectVehicleAdmin(adminId: string, vehicleId: string, reason?: string) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) throw new NotFoundException("Véhicule introuvable");

    return prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        approvalStatus: 'REJECTED',
        rejectedAt: new Date(),
        rejectionReason: reason,
      },
    });
  }

  async certifyVehicleAdmin(adminId: string, vehicleId: string) {
    const vehicle = await prisma.vehicle.findUnique({ 
      where: { id: vehicleId },
      include: { documents: true }
    });
    if (!vehicle) throw new NotFoundException("Véhicule introuvable");

    if (vehicle.approvalStatus !== 'APPROVED') {
      throw new BadRequestException("Un véhicule doit être approuvé avant d'être certifié");
    }

    if (vehicle.photosRenewalStatus !== 'VALID') {
      throw new BadRequestException("Les photos du véhicule doivent être valides (non expirées et approuvées) pour la certification.");
    }

    const hasApprovedCarteGrise = vehicle.documents.some(d => d.type === 'REGISTRATION_CARD' && d.status === 'APPROVED');
    const hasApprovedAssurance = vehicle.documents.some(d => d.type === 'INSURANCE' && d.status === 'APPROVED');
    const hasApprovedVisite = vehicle.documents.some(d => d.type === 'TECHNICAL_INSPECTION' && d.status === 'APPROVED');

    if (!hasApprovedCarteGrise || !hasApprovedAssurance || !hasApprovedVisite) {
      throw new BadRequestException("Les 3 documents obligatoires (Carte grise, Assurance, Visite technique) doivent être approuvés pour certifier le véhicule.");
    }

    return prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        certificationStatus: 'CERTIFIED',
        certifiedAt: new Date(),
        certifiedById: adminId,
      },
    });
  }

  async revokeCertificationAdmin(adminId: string, vehicleId: string) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) throw new NotFoundException("Véhicule introuvable");

    return prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        certificationStatus: 'REVOKED',
      },
    });
  }

  async updateVehicle(id: string, vehicleId: string, dto: UpdateVehicleDto) {
    // Ensure the vehicle belongs to the driver
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: vehicleId, ownerId: id },
    });

    if (!vehicle) {
      throw new NotFoundException("Véhicule introuvable ou n'appartient pas à ce chauffeur");
    }

    const data: any = {};
    if (dto.status) data.approvalStatus = dto.status;
    if (dto.insuranceExpiry) data.insuranceExpiry = new Date(dto.insuranceExpiry);
    if (dto.inspectionExpiry) data.inspectionExpiry = new Date(dto.inspectionExpiry);

    return prisma.vehicle.update({
      where: { id: vehicleId },
      data,
    });
  }

  async getEarnings(id: string) {
    const driver = await prisma.driverProfile.findUnique({ where: { id } });
    if (!driver) throw new NotFoundException('Chauffeur introuvable');

    return prisma.driverEarning.findMany({
      where: { driverId: driver.userId },
      include: {
        booking: {
          include: {
            trip: {
              include: { route: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async getReviews(id: string) {
    const driver = await prisma.driverProfile.findUnique({ where: { id } });
    if (!driver) throw new NotFoundException('Chauffeur introuvable');

    return prisma.review.findMany({
      where: { receiverId: driver.userId },
      include: {
        author: {
          select: { fullName: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async deleteVehicle(driverUserId: string, vehicleId: string, pin: string) {
    await this.authService.verifyUserPin(driverUserId, pin);

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { owner: true },
    });

    if (!vehicle || vehicle.owner?.userId !== driverUserId) {
      throw new NotFoundException('Véhicule introuvable ou vous n\'en êtes pas le propriétaire.');
    }

    const tripsCount = await prisma.trip.count({ where: { vehicleId } });

    if (tripsCount === 0) {
      await prisma.vehicle.delete({ where: { id: vehicleId } });
      const photos = [vehicle.frontPhotoKey, vehicle.rearPhotoKey, vehicle.sidePhotoKey].filter(Boolean);
      if (photos.length > 0) {
        await this.supabase.deleteFiles('vehicles', photos as string[]);
      }
      return { success: true, message: 'Véhicule définitivement supprimé car il n\'a pas d\'historique.' };
    }

    const in30Days = new Date();
    in30Days.setDate(in30Days.getDate() + 30);

    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        deletedAt: new Date(),
        deletionScheduledAt: in30Days,
      },
    });

    return { success: true, message: 'Le véhicule sera supprimé dans 30 jours.' };
  }

  async uploadVehicleDocument(
    driverUserId: string,
    vehicleId: string,
    dto: UploadVehicleDocumentDto,
    frontFile: Express.Multer.File,
    backFile?: Express.Multer.File,
  ) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { owner: true },
    });

    if (!vehicle || vehicle.owner?.userId !== driverUserId) {
      throw new NotFoundException('Véhicule introuvable.');
    }

    if (dto.type === 'REGISTRATION_CARD' && dto.isNewRegistrationCard === 'true' && !backFile) {
      throw new BadRequestException('Veuillez fournir le fichier verso pour la carte grise.');
    }

    const plate = this.cleanPlate(vehicle.plateNumber);
    const typeStr = dto.type.toLowerCase().replace(/_/g, '-');
    const isRegistration = dto.type === 'REGISTRATION_CARD';
    const frontName = isRegistration ? 'front' : 'file';

    const frontExt = frontFile.originalname.split('.').pop();
    const frontFileName = `${plate}_${vehicleId}/documents/${typeStr}/${frontName}.${frontExt}`;

    let fileUrl: string;
    try {
      fileUrl = await this.supabase.uploadFile('vehicles', frontFileName, frontFile);
      if (!fileUrl) throw new Error('URL vide retournée');
    } catch (e) {
      throw new BadRequestException(`Échec du téléchargement du document recto: ${(e as Error).message || e}`);
    }

    let backFileName = null;
    let backUrl = null;
    if (backFile) {
      const backExt = backFile.originalname.split('.').pop();
      backFileName = `${plate}_${vehicleId}/documents/${typeStr}/back.${backExt}`;
      try {
        backUrl = await this.supabase.uploadFile('vehicles', backFileName, backFile);
        if (!backUrl) throw new Error('URL verso vide retournée');
      } catch (e) {
        // Rollback front file if back file fails
        await this.supabase.deleteFile('vehicles', frontFileName).catch(err => console.error('Rollback error:', err));
        throw new BadRequestException(`Échec du téléchargement du document verso: ${(e as Error).message || e}`);
      }
    }

    try {
      const existingDoc = await prisma.vehicleDocument.findFirst({
        where: { vehicleId, type: dto.type },
      });

      if (existingDoc) {
        await prisma.vehicleDocument.update({
          where: { id: existingDoc.id },
          data: {
            fileKey: frontFileName,
            backFileKey: backFileName,
            status: 'PENDING_REVIEW',
            expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
            rejectionReason: null,
            reviewedAt: null,
            reviewedById: null,
          },
        });

        const getBucket = (key: string) => key.includes('/documents/') ? 'vehicles' : 'vehicle-documents';
        const filesToDelete = [];
        if (existingDoc.fileKey && existingDoc.fileKey !== frontFileName) {
          filesToDelete.push({ bucket: getBucket(existingDoc.fileKey), key: existingDoc.fileKey });
        }
        if (existingDoc.backFileKey && existingDoc.backFileKey !== backFileName) {
          filesToDelete.push({ bucket: getBucket(existingDoc.backFileKey), key: existingDoc.backFileKey });
        }

        for (const { bucket, key } of filesToDelete) {
          this.supabase.deleteFile(bucket, key).catch(e => console.error(`Echec suppression ancien fichier ${key} (${bucket}):`, e));
        }
      } else {
        await prisma.vehicleDocument.create({
          data: {
            vehicleId,
            type: dto.type,
            fileKey: frontFileName,
            backFileKey: backFileName,
            status: 'PENDING_REVIEW',
            expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
          },
        });
      }
    } catch (dbError) {
      // Rollback files
      await this.supabase.deleteFile('vehicles', frontFileName).catch(console.error);
      if (backFileName) {
        await this.supabase.deleteFile('vehicles', backFileName).catch(console.error);
      }
      throw new BadRequestException(`Erreur base de données lors de l'enregistrement du document: ${(dbError as Error).message}`);
    }

    return { success: true, message: 'Document uploadé avec succès, en attente de validation.' };
  }

  async getVehicleDocuments(driverUserId: string | null, vehicleId: string) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { owner: true, documents: true },
    });

    if (!vehicle || (driverUserId && vehicle.owner?.userId !== driverUserId)) {
      throw new NotFoundException('Véhicule introuvable.');
    }

    const documentsWithUrls = await Promise.all(vehicle.documents.map(async (doc) => {
      let fileUrl = null;
      let backUrl = null;
      try {
        if (doc.fileKey) {
          const frontBucket = doc.fileKey.includes('/documents/') ? 'vehicles' : 'vehicle-documents';
          console.log(`[VehicleDocuments] Generating signed URL | docId: ${doc.id} | bucket: ${frontBucket} | key: ${doc.fileKey}`);
          fileUrl = await this.supabase.getSignedUrl(frontBucket, doc.fileKey);
        } else {
          console.warn(`[VehicleDocuments] Missing fileKey for docId: ${doc.id}`);
        }

        if (doc.backFileKey) {
          const backBucket = doc.backFileKey.includes('/documents/') ? 'vehicles' : 'vehicle-documents';
          console.log(`[VehicleDocuments] Generating signed URL for backFile | docId: ${doc.id} | bucket: ${backBucket} | key: ${doc.backFileKey}`);
          backUrl = await this.supabase.getSignedUrl(backBucket, doc.backFileKey);
        }
      } catch (e) {
        console.error(`Erreur URL signée pour le document ${doc.fileKey}`, e);
      }
      return {
        ...doc,
        fileUrl,
        backUrl,
      };
    }));

    return { documents: documentsWithUrls };
  }

  async approveVehicleDocument(adminId: string, documentId: string) {
    const doc = await prisma.vehicleDocument.findUnique({ where: { id: documentId } });
    if (!doc) throw new NotFoundException('Document introuvable.');

    await prisma.vehicleDocument.update({
      where: { id: documentId },
      data: {
        status: 'APPROVED',
        reviewedAt: new Date(),
        reviewedById: adminId,
        rejectionReason: null,
      },
    });

    return { success: true, message: 'Document approuvé avec succès.' };
  }

  async rejectVehicleDocument(adminId: string, documentId: string, reason: string) {
    const document = await prisma.vehicleDocument.findUnique({ where: { id: documentId } });
    if (!document) throw new NotFoundException('Document introuvable');
    if (document.status !== DocumentStatus.PENDING_REVIEW) throw new BadRequestException(`Document déjà ${document.status}`);

    const updated = await prisma.vehicleDocument.update({
      where: { id: documentId },
      data: {
        status: DocumentStatus.REJECTED,
        rejectionReason: reason,
        reviewedAt: new Date(),
        reviewedById: adminId,
      },
    });

    return { success: true, document: updated };
  }

  async configurePin(userId: string, dto: { pin: string; confirmPin: string }) {
    if (dto.pin !== dto.confirmPin) {
      throw new BadRequestException('Les codes PIN ne correspondent pas.');
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { driverProfile: true },
    });
    if (!user || !user.driverProfile) {
      throw new BadRequestException('Profil chauffeur introuvable.');
    }

    try {
      const pinHash = await bcrypt.hash(dto.pin, 10);
      await prisma.driverProfile.update({
        where: { id: user.driverProfile.id },
        data: { pinHash },
      });

      return { success: true, message: 'Code PIN configuré avec succès.' };
    } catch (error: any) {
      console.error('Erreur DB lors de configurePin:', error);
      throw new BadRequestException('Impossible d\'enregistrer le code PIN. Veuillez réessayer plus tard.');
    }
  }

  async updateDriverStatus(userId: string, status: DriverOperationalStatus, pin: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { driverProfile: true },
    });

    if (!user || !user.driverProfile) {
      throw new NotFoundException('Profil chauffeur introuvable.');
    }

    if (!user.driverProfile.pinHash) {
      throw new BadRequestException('Code PIN non configuré');
    }

    let isPinValid = false;
    try {
      isPinValid = await bcrypt.compare(pin, user.driverProfile.pinHash);
    } catch (e) {
      isPinValid = false;
    }
    
    if (!isPinValid) {
      throw new UnauthorizedException('Code PIN incorrect');
    }

    let updatedProfile;
    try {
      updatedProfile = await prisma.driverProfile.update({
        where: { id: user.driverProfile.id },
        data: { operationalStatus: status },
      });
    } catch (error) {
      console.error('Erreur DB lors de updateDriverStatus:', error);
      throw new BadRequestException('Impossible de mettre à jour le statut. Veuillez réessayer plus tard.');
    }

    return {
      success: true,
      operationalStatus: updatedProfile.operationalStatus,
      message: 'Statut mis à jour avec succès.',
    };
  }
}

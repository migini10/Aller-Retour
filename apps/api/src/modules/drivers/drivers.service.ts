import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma, KYCStatus } from '@aller-retour/database';
import { ListDriversDto } from './dto/list-drivers.dto';
import { UpdateKycDto } from './dto/update-kyc.dto';
import { SupabaseService } from '../../core/supabase/supabase.service';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class DriversService {
  constructor(private readonly supabase: SupabaseService) {}
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

    const newVehicle = await prisma.vehicle.create({
      data: {
        ...dto,
        capacity: enforcedCapacity,
        ownerId: driver.id,
        approvalStatus: 'PENDING_REVIEW', // Driver submitted vehicles are pending review
        insuranceExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        inspectionExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      },
    });

    try {
      const ext1 = files.frontPhoto[0].mimetype.split('/')[1];
      const ext2 = files.rearPhoto[0].mimetype.split('/')[1];
      const ext3 = files.sidePhoto[0].mimetype.split('/')[1];
      
      const frontPath = `vehicles/${newVehicle.id}/front.${ext1}`;
      const rearPath = `vehicles/${newVehicle.id}/rear.${ext2}`;
      const sidePath = `vehicles/${newVehicle.id}/side.${ext3}`;

      await this.supabase.uploadFile('vehicles', frontPath, files.frontPhoto[0]);
      await this.supabase.uploadFile('vehicles', rearPath, files.rearPhoto[0]);
      await this.supabase.uploadFile('vehicles', sidePath, files.sidePhoto[0]);

      return await prisma.vehicle.update({
        where: { id: newVehicle.id },
        data: {
          frontPhotoKey: frontPath,
          rearPhotoKey: rearPath,
          sidePhotoKey: sidePath,
        }
      });
    } catch (e) {
      await prisma.vehicle.delete({ where: { id: newVehicle.id } });
      throw new BadRequestException('Erreur lors de l\'upload des photos. Véhicule non enregistré.');
    }
  }

  async getMyVehicles(userId: string) {
    const driver = await prisma.driverProfile.findUnique({ where: { userId } });
    if (!driver) throw new NotFoundException('Profil chauffeur introuvable');

    const vehicles = await prisma.vehicle.findMany({
      where: { ownerId: driver.id },
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
      return {
        ...v,
        frontPhotoUrl: v.frontPhotoKey ? await this.supabase.getSignedUrl('vehicles', v.frontPhotoKey) : null,
        rearPhotoUrl: v.rearPhotoKey ? await this.supabase.getSignedUrl('vehicles', v.rearPhotoKey) : null,
        sidePhotoUrl: v.sidePhotoKey ? await this.supabase.getSignedUrl('vehicles', v.sidePhotoKey) : null,
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

    try {
      if (files?.frontPhoto?.[0]) {
        const ext = files.frontPhoto[0].mimetype.split('/')[1];
        frontPath = `vehicles/${vehicle.id}/front.${ext}`;
        await this.supabase.uploadFile('vehicles', frontPath, files.frontPhoto[0]);
      }
      if (files?.rearPhoto?.[0]) {
        const ext = files.rearPhoto[0].mimetype.split('/')[1];
        rearPath = `vehicles/${vehicle.id}/rear.${ext}`;
        await this.supabase.uploadFile('vehicles', rearPath, files.rearPhoto[0]);
      }
      if (files?.sidePhoto?.[0]) {
        const ext = files.sidePhoto[0].mimetype.split('/')[1];
        sidePath = `vehicles/${vehicle.id}/side.${ext}`;
        await this.supabase.uploadFile('vehicles', sidePath, files.sidePhoto[0]);
      }
    } catch (e) {
      throw new BadRequestException('Erreur lors de l\'upload des nouvelles photos.');
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
    });
  }

  async approveVehicleAdmin(adminId: string, vehicleId: string) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) throw new NotFoundException("Véhicule introuvable");

    return prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        approvalStatus: 'APPROVED',
        approvedAt: new Date(),
        approvedById: adminId,
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
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) throw new NotFoundException("Véhicule introuvable");

    if (vehicle.approvalStatus !== 'APPROVED') {
      throw new BadRequestException("Un véhicule doit être approuvé avant d'être certifié");
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
}

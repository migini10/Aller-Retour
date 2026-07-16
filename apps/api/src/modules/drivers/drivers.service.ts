import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma, KYCStatus } from '@aller-retour/database';
import { ListDriversDto } from './dto/list-drivers.dto';
import { UpdateKycDto } from './dto/update-kyc.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class DriversService {
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
    return vehicles;
  }

  async createVehicleForAdmin(driverId: string, dto: CreateVehicleDto) {
    const driver = await prisma.driverProfile.findUnique({ where: { id: driverId } });
    if (!driver) throw new NotFoundException('Chauffeur introuvable');

    const existingVehicle = await prisma.vehicle.findUnique({ where: { plateNumber: dto.plateNumber } });
    if (existingVehicle) throw new BadRequestException('Un véhicule avec cette plaque existe déjà');

    let enforcedCapacity = dto.capacity;
    if (dto.type === 'TAXI_5_PLACES') enforcedCapacity = 5;
    if (dto.type === 'TAXI_7_PLACES') enforcedCapacity = 7;

    return prisma.vehicle.create({
      data: {
        ...dto,
        capacity: enforcedCapacity,
        ownerId: driverId,
        status: dto.status || 'APPROVED', // Admin created vehicles are approved by default
        insuranceExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        inspectionExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      },
    });
  }

  async createVehicleForDriver(userId: string, dto: CreateVehicleDto) {
    const driver = await prisma.driverProfile.findUnique({ where: { userId } });
    if (!driver) throw new NotFoundException('Profil chauffeur introuvable');
    if (driver.type !== 'OWNER') throw new BadRequestException('Seul un chauffeur propriétaire peut ajouter un véhicule');

    const existingVehicle = await prisma.vehicle.findUnique({ where: { plateNumber: dto.plateNumber } });
    if (existingVehicle) throw new BadRequestException('Un véhicule avec cette plaque existe déjà');

    if (dto.type !== 'TAXI_5_PLACES' && dto.type !== 'TAXI_7_PLACES') {
      throw new BadRequestException('Seuls les taxis (5 ou 7 places) sont acceptés pour le moment');
    }

    let enforcedCapacity = dto.capacity;
    if (dto.type === 'TAXI_5_PLACES') enforcedCapacity = 5;
    if (dto.type === 'TAXI_7_PLACES') enforcedCapacity = 7;

    return prisma.vehicle.create({
      data: {
        ...dto,
        capacity: enforcedCapacity,
        ownerId: driver.id,
        status: 'PENDING_REVIEW', // Driver submitted vehicles are pending review
        insuranceExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        inspectionExpiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      },
    });
  }

  async getMyVehicles(userId: string) {
    const driver = await prisma.driverProfile.findUnique({ where: { userId } });
    if (!driver) throw new NotFoundException('Profil chauffeur introuvable');

    return prisma.vehicle.findMany({
      where: { ownerId: driver.id },
    });
  }

  async approveVehicle(driverId: string, vehicleId: string) {
    return this.updateVehicleStatus(driverId, vehicleId, 'APPROVED');
  }

  async rejectVehicle(driverId: string, vehicleId: string, reason?: string) {
    // Note: reason could be added to the schema if needed, but for now we just change status
    return this.updateVehicleStatus(driverId, vehicleId, 'REJECTED');
  }

  private async updateVehicleStatus(driverId: string, vehicleId: string, status: any) {
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: vehicleId, ownerId: driverId },
    });
    if (!vehicle) throw new NotFoundException("Véhicule introuvable ou n'appartient pas à ce chauffeur");

    return prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status },
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
    if (dto.status) data.status = dto.status;
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

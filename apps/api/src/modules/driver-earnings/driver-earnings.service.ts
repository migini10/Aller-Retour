import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@aller-retour/database';
import { ListEarningsDto } from './dto/list-earnings.dto';
import { MarkPaidDto } from './dto/mark-paid.dto';

@Injectable()
export class DriverEarningsService {
  async findAll(dto: ListEarningsDto) {
    const where: any = {};

    if (dto.status) {
      where.status = dto.status;
    }

    if (dto.driverId) {
      where.driverId = dto.driverId;
    }

    if (dto.date) {
      const startOfDay = new Date(dto.date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);
      
      where.createdAt = {
        gte: startOfDay,
        lt: endOfDay,
      };
    }

    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const skip = (page - 1) * limit;

    const [total, earnings] = await Promise.all([
      prisma.driverEarning.count({ where }),
      prisma.driverEarning.findMany({
        where,
        include: {
          driver: {
            select: { id: true, fullName: true, phone: true }
          },
          booking: {
            select: { id: true, seatNumber: true, trip: { include: { route: true } } }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: earnings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSummary() {
    const earnings = await prisma.driverEarning.findMany({
      select: {
        status: true,
        driverCut: true,
        platformCommission: true,
      }
    });

    let totalPending = 0;
    let totalPaid = 0;
    let totalPlatformFees = 0;
    let totalDriverNet = 0;

    for (const earning of earnings) {
      totalPlatformFees += earning.platformCommission;
      totalDriverNet += earning.driverCut;
      
      if (earning.status === 'PENDING') {
        totalPending += earning.driverCut;
      } else if (earning.status === 'PAID') {
        totalPaid += earning.driverCut;
      }
    }

    return {
      totalPending,
      totalPaid,
      totalPlatformFees,
      totalDriverNet
    };
  }

  async findByDriverId(driverId: string) {
    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { id: driverId } });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return prisma.driverEarning.findMany({
      where: { driverId },
      include: {
        booking: {
          select: { id: true, trip: { include: { route: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async markAsPaid(id: string, dto: MarkPaidDto) {
    const earning = await prisma.driverEarning.findUnique({
      where: { id }
    });

    if (!earning) {
      throw new NotFoundException('Revenu introuvable');
    }

    const updated = await prisma.driverEarning.update({
      where: { id },
      data: {
        status: 'PAID',
        payoutRef: dto.payoutRef,
        paidAt: new Date()
      }
    });

    return updated;
  }
}

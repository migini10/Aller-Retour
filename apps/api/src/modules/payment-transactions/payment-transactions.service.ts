import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@aller-retour/database';
import { ListPaymentTransactionsDto } from './dto/list-payment-transactions.dto';

@Injectable()
export class PaymentTransactionsService {
  async findAll(dto: ListPaymentTransactionsDto) {
    const where: any = {};

    if (dto.status) where.status = dto.status;
    if (dto.method) where.method = dto.method;
    if (dto.userId) where.userId = dto.userId;
    if (dto.bookingId) where.bookingId = dto.bookingId;

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

    const [total, transactions] = await Promise.all([
      prisma.paymentTransaction.count({ where }),
      prisma.paymentTransaction.findMany({
        where,
        include: {
          user: {
            select: { id: true, fullName: true, phone: true }
          },
          booking: {
            select: { id: true, seatNumber: true, tripId: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      })
    ]);

    return {
      data: transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  async getSummary() {
    const transactions = await prisma.paymentTransaction.findMany({
      select: {
        status: true,
        amount: true,
      }
    });

    let totalSuccessCount = 0;
    let totalFailedCount = 0;
    let totalPendingCount = 0;
    let totalAmountCollected = 0;
    let totalAmountFailed = 0;

    for (const tx of transactions) {
      if (tx.status === 'SUCCESS') {
        totalSuccessCount++;
        totalAmountCollected += tx.amount;
      } else if (tx.status === 'FAILED') {
        totalFailedCount++;
        totalAmountFailed += tx.amount;
      } else if (tx.status === 'PENDING') {
        totalPendingCount++;
      }
    }

    return {
      totalSuccess: totalSuccessCount,
      totalFailed: totalFailedCount,
      totalPending: totalPendingCount,
      totalCollectedAmount: totalAmountCollected,
      totalFailedAmount: totalAmountFailed
    };
  }

  async findOne(id: string) {
    const transaction = await prisma.paymentTransaction.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, phone: true } },
        booking: true,
      }
    });

    if (!transaction) {
      throw new NotFoundException('Transaction introuvable');
    }

    return transaction;
  }
}

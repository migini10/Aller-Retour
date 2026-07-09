import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { GetNotificationsDto } from './dto/get-notifications.dto';
import { prisma, NotificationStatus, NotificationType, Prisma } from '@aller-retour/database';

export interface SendNotificationParams {
  to: string;
  subject: string;
  html: string;
  safeContent: string;
  recipientId?: string;
  bookingId?: string;
  tripId?: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendNotification(params: SendNotificationParams): Promise<void> {
    // 1. Create notification in PENDING state
    const notification = await prisma.notification.create({
      data: {
        type: NotificationType.EMAIL,
        status: NotificationStatus.PENDING,
        title: params.subject,
        content: params.safeContent, // Store only the safe content
        recipientId: params.recipientId,
        bookingId: params.bookingId,
        tripId: params.tripId,
      }
    });

    try {
      // 2. Attempt to send
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: params.to,
        subject: params.subject,
        html: params.html
      });

      // 3. Success
      await prisma.notification.update({
        where: { id: notification.id },
        data: {
          status: NotificationStatus.SENT,
          sentAt: new Date()
        }
      });
      this.logger.log(`Email sent successfully to ${params.to}`);
    } catch (error: any) {
      // 4. Failure
      this.logger.error(`Failed to send email to ${params.to}: ${error.message}`);
      await prisma.notification.update({
        where: { id: notification.id },
        data: {
          status: NotificationStatus.FAILED,
          errorMessage: error.message || 'Erreur inconnue lors de l\'envoi'
        }
      });
    }
  }

  async getNotifications(filters: GetNotificationsDto) {
    const { page = 1, limit = 10, search, type, status, recipientId, bookingId, tripId, dateFrom, dateTo } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { recipient: { fullName: { contains: search, mode: 'insensitive' } } },
        { recipient: { email: { contains: search, mode: 'insensitive' } } }
      ];
    }

    if (type) where.type = type;
    if (status) where.status = status;
    if (recipientId) where.recipientId = recipientId;
    if (bookingId) where.bookingId = bookingId;
    if (tripId) where.tripId = tripId;

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const [items, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        include: {
          recipient: {
            select: { id: true, fullName: true, email: true, phone: true }
          },
          booking: {
            select: { id: true, status: true }
          },
          trip: {
            select: { id: true, departureTime: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where })
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma, Prisma } from '@aller-retour/database';
import { GetReviewsDto } from './dto/get-reviews.dto';
import { UpdateReviewStatusDto } from './dto/update-review-status.dto';

@Injectable()
export class ReviewsService {
  async findAll(query: GetReviewsDto) {
    const { page = 1, limit = 20, search, rating, status, authorId, receiverId, bookingId, dateFrom, dateTo } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ReviewWhereInput = {};

    if (search) {
      where.OR = [
        { comment: { contains: search, mode: 'insensitive' } },
        { author: { fullName: { contains: search, mode: 'insensitive' } } },
        { receiver: { fullName: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (rating) where.rating = rating;
    if (status) where.status = status;
    if (authorId) where.authorId = authorId;
    if (receiverId) where.receiverId = receiverId;
    if (bookingId) where.bookingId = bookingId;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const [total, data] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, fullName: true, avatarUrl: true, email: true, phone: true } },
          receiver: { select: { id: true, fullName: true, avatarUrl: true, email: true, phone: true } },
        },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, fullName: true, avatarUrl: true, email: true, phone: true } },
        receiver: { select: { id: true, fullName: true, avatarUrl: true, email: true, phone: true } },
        booking: {
          include: {
            trip: {
              include: {
                driver: {
                  include: {
                    user: { select: { id: true, fullName: true, avatarUrl: true, phone: true } },
                  },
                },
                vehicle: true,
              },
            },
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Avis introuvable');
    }

    return review;
  }

  async updateStatus(id: string, dto: UpdateReviewStatusDto) {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw new NotFoundException('Avis introuvable');
    }

    return prisma.review.update({
      where: { id },
      data: { status: dto.status },
      include: {
        author: { select: { id: true, fullName: true, avatarUrl: true } },
        receiver: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });
  }
}

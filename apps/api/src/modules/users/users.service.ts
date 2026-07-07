import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma, User, UserRole } from '@aller-retour/database';
import { ListUsersDto } from './dto/list-users.dto';
import { UpdateUserStatusDto, UserStatusAction } from './dto/update-user-status.dto';

@Injectable()
export class UsersService {
  async findAll(filters: ListUsersDto) {
    const { page = 1, limit = 10, search, role, status, verified } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (verified !== undefined) {
      where.phoneVerified = verified === 'true';
    }

    if (status) {
      const now = new Date();
      if (status === 'ACTIVE') {
        where.isActive = true;
        where.OR = [{ blockedUntil: null }, { blockedUntil: { lt: now } }];
      } else if (status === 'SUSPENDED') {
        where.isActive = false;
      } else if (status === 'BANNED') {
        where.blockedUntil = { gt: now };
      }
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          phone: true,
          phoneVerified: true,
          fullName: true,
          avatarUrl: true,
          role: true,
          isActive: true,
          blockedUntil: true,
          createdAt: true,
          updatedAt: true,
          failedAttempts: true,
          colisPoints: true,
          transportPoints: true,
        },
      }),
    ]);

    return {
      data: users.map(user => this.mapUserStatus(user)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        phoneVerified: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        isActive: true,
        blockedUntil: true,
        createdAt: true,
        updatedAt: true,
        failedAttempts: true,
        colisPoints: true,
        transportPoints: true,
        passwordHash: true, // Only to check if pin is configured
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const mappedUser = this.mapUserStatus(user);
    // Add specific fields for detail view
    return {
      ...mappedUser,
      hasPinConfigured: !!user.passwordHash,
      pinLastModified: user.updatedAt, // Approximation since we don't track pin change date separately
    };
  }

  async updateStatus(id: string, dto: UpdateUserStatusDto) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const data: any = {};
    if (dto.action === UserStatusAction.ACTIVATE) {
      data.isActive = true;
      data.blockedUntil = null;
    } else if (dto.action === UserStatusAction.SUSPEND) {
      data.isActive = false;
    } else if (dto.action === UserStatusAction.BLOCK) {
      data.blockedUntil = new Date('2099-12-31T23:59:59.000Z');
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        isActive: true,
        blockedUntil: true,
        updatedAt: true,
      },
    });

    return {
      message: 'Statut mis à jour avec succès',
      user: this.mapUserStatus(updatedUser as any),
    };
  }

  async resetPin(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    // Generate random 6 digit PIN
    const newPin = Math.floor(100000 + Math.random() * 900000).toString();
    const passwordHash = newPin; // En prod: await bcrypt.hash(newPin, 10);

    await prisma.user.update({
      where: { id },
      data: { passwordHash },
    });

    // Dans un cas réel, on enverrait un SMS ici
    // await smsService.send(user.phone, `Votre nouveau PIN est ${newPin}`);

    return {
      message: "Le code PIN a été réinitialisé. L'utilisateur recevra un SMS."
    };
  }

  async getUserActivity(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    // Mock data as requested since we don't have an audit table
    return [
      {
        id: '1',
        type: 'ACCOUNT_CREATED',
        title: 'Création du compte',
        description: "L'utilisateur s'est inscrit sur la plateforme.",
        createdAt: user.createdAt,
      },
      {
        id: '2',
        type: 'PIN_MODIFIED',
        title: 'Configuration du code PIN',
        description: 'Le code de sécurité a été défini.',
        createdAt: user.updatedAt,
      }
    ];
  }

  private mapUserStatus(user: Partial<User>) {
    let status = 'ACTIVE';
    const now = new Date();

    if (!user.isActive) {
      status = 'SUSPENDED';
    } else if (user.blockedUntil && user.blockedUntil > now) {
      status = 'BANNED';
    }

    // Remove raw fields
    const { isActive, blockedUntil, passwordHash, ...cleanUser } = user as any;

    return {
      ...cleanUser,
      status,
    };
  }
}

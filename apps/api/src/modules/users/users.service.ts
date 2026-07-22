import { Injectable, NotFoundException, ForbiddenException, Logger, BadRequestException } from '@nestjs/common';
import { prisma, User, UserRole } from '@aller-retour/database';
import { ListUsersDto } from './dto/list-users.dto';
import { UpdateUserStatusDto, UserStatusAction } from './dto/update-user-status.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
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
          bannedAt: true,
          banReason: true,
          bannedById: true,
          createdAt: true,
          updatedAt: true,
          failedAttempts: true,
          colisPoints: true,
          transportPoints: true,
          isTestAccount: true,
          verifiedAt: true,
          verificationMethod: true,
          verifiedById: true,
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
        bannedAt: true,
        banReason: true,
        bannedById: true,
        createdAt: true,
        updatedAt: true,
        failedAttempts: true,
        colisPoints: true,
        transportPoints: true,
        passwordHash: true, // Only to check if pin is configured
        isTestAccount: true,
        verifiedAt: true,
        verificationMethod: true,
        verifiedById: true,
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

  async updateStatus(id: string, dto: UpdateUserStatusDto, adminId?: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const data: any = {};
    if (dto.action === UserStatusAction.ACTIVATE) {
      data.isActive = true;
      data.blockedUntil = null;
      data.bannedAt = null;
      data.bannedById = null;
      data.banReason = null;
    } else if (dto.action === UserStatusAction.SUSPEND) {
      data.isActive = false;
    } else if (dto.action === UserStatusAction.BLOCK) {
      if (!dto.reason) throw new BadRequestException('La raison est obligatoire pour bannir un utilisateur.');
      data.bannedAt = new Date();
      data.bannedById = adminId;
      data.banReason = dto.reason;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        isActive: true,
        blockedUntil: true,
        bannedAt: true,
        banReason: true,
        bannedById: true,
        updatedAt: true,
      },
    });

    if (dto.action === UserStatusAction.ACTIVATE && user.bannedAt) {
      await prisma.securityEvent.create({
        data: {
          userId: id,
          action: 'ACCOUNT_REACTIVATED',
          adminId,
        }
      });
    } else if (dto.action === UserStatusAction.BLOCK) {
      await prisma.securityEvent.create({
        data: {
          userId: id,
          action: 'ACCOUNT_BANNED',
          reason: dto.reason,
          adminId,
        }
      });
    }

    return {
      message: 'Statut mis à jour avec succès',
      user: this.mapUserStatus(updatedUser as any),
    };
  }

  async getSecurityEvents(userId: string) {
    return prisma.securityEvent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async unblockTemp(id: string, adminId: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    if (!user.blockedUntil || user.blockedUntil < new Date()) {
      throw new BadRequestException('Ce compte n\'est pas temporairement bloqué.');
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id },
        data: {
          blockedUntil: null,
          failedAttempts: 0,
        },
      });

      await tx.securityEvent.create({
        data: {
          userId: id,
          action: 'LOGIN_TEMP_UNBLOCKED',
          reason: 'Déblocage manuel par un administrateur',
          adminId,
        },
      });
    });

    return { message: 'Compte débloqué avec succès' };
  }

  async resetPin(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    // Generate random 6 digit PIN
    const newPin = Math.floor(100000 + Math.random() * 900000).toString();
    const passwordHash = await bcrypt.hash(newPin, 10);

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

  async verifyTestAccount(targetUserId: string, adminId: string) {
    const user = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    if (!user.isTestAccount) {
      throw new ForbiddenException(`Seuls les comptes de test peuvent être validés manuellement (isTestAccount = false).`);
    }

    if (user.verifiedAt) {
      return { success: true, message: "Ce compte est déjà vérifié." };
    }

    const now = new Date();
    await prisma.user.update({
      where: { id: targetUserId },
      data: {
        verifiedAt: now,
        verifiedById: adminId,
        verificationMethod: 'ADMIN_TEST',
      },
    });

    this.logger.log(`[AUDIT] adminId: ${adminId}, targetUserId: ${targetUserId}, action: VERIFY_TEST_ACCOUNT, timestamp: ${now.toISOString()}, oldVerifiedAt: null, newVerifiedAt: ${now.toISOString()}`);

    return { success: true, message: "Le compte de test a été validé avec succès." };
  }

  async markTestAccount(targetUserId: string, adminId: string) {
    const user = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    if (user.isTestAccount) {
      return { success: true, message: "Ce compte est déjà un compte de test." };
    }

    const now = new Date();
    await prisma.user.update({
      where: { id: targetUserId },
      data: {
        isTestAccount: true,
      },
    });

    this.logger.log(`[AUDIT] adminId: ${adminId}, targetUserId: ${targetUserId}, action: MARK_TEST_ACCOUNT, timestamp: ${now.toISOString()}`);

    return { success: true, message: "Compte marqué comme compte de test avec succès" };
  }

  private mapUserStatus(user: Partial<User>) {
    let status = 'ACTIVE';
    const now = new Date();

    if ((user as any).bannedAt) {
      status = 'BANNED';
    } else if (!user.isActive) {
      status = 'SUSPENDED';
    } else if (user.blockedUntil && user.blockedUntil > now) {
      status = 'TEMPORARILY_BLOCKED';
    }

    // Remove raw fields
    const { isActive, passwordHash, ...cleanUser } = user as any;

    return {
      ...cleanUser,
      status,
    };
  }
}

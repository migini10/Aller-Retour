import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { prisma, UserRole } from '@aller-retour/database';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async registerPassenger(phone: string, fullName: string, pin?: string) {
    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) {
      throw new BadRequestException("Ce numéro de téléphone est déjà enregistré.");
    }

    if (pin) {
      if (pin.length !== 6) {
        throw new BadRequestException("Le code PIN doit comporter exactement 6 chiffres.");
      }
      if (/^(\d)\1{5}$/.test(pin)) {
        throw new BadRequestException("Code PIN trop faible : évitez les chiffres identiques (ex: 000000).");
      }
      if (pin === '123456' || pin === '654321' || pin === '012345') {
        throw new BadRequestException("Code PIN trop faible : évitez les suites logiques.");
      }
      // Rejeter les formats de date de naissance (JJ/MM/AA)
      if (/^(0[1-9]|[12]\d|3[01])(0[1-9]|1[0-2])(\d{2})$/.test(pin)) {
        throw new BadRequestException("Code PIN trop faible : l'utilisation d'une date de naissance (JJMMAA) est interdite pour votre sécurité.");
      }
      // Rejeter les formats commençant par une année de naissance (ex: 1990xx, 2000xx)
      if (/^(19[5-9]\d|20[0-2]\d)\d{2}$/.test(pin)) {
        throw new BadRequestException("Code PIN trop faible : l'utilisation d'une année de naissance est interdite.");
      }
    }

    const user = await prisma.user.create({
      data: {
        phone,
        fullName,
        role: UserRole.PASSENGER,
        passwordHash: pin ? pin : '123456', // En prod: bcrypt
      },
    });

    // Création du Wallet passager par défaut
    await prisma.wallet.create({
      data: {
        type: 'PASSENGER_WALLET',
        currency: 'XOF',
        userId: user.id,
      },
    });

    const token = this.generateToken(user);
    return { success: true, user, token };
  }

  async loginWithMobile(phone: string, pin: string) {
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException("Numéro de téléphone incorrect ou compte inactif.");
    }

    const now = new Date();

    // 1. Check if the user is currently blocked
    if (user.blockedUntil && user.blockedUntil > now) {
      const remainingMs = user.blockedUntil.getTime() - now.getTime();
      const remainingHours = Math.ceil(remainingMs / (1000 * 60 * 60));
      throw new UnauthorizedException(
        `Votre compte est bloqué suite à 4 tentatives incorrectes. Veuillez contacter le service client ou réessayer dans ${remainingHours} heure(s).`
      );
    }

    // 2. If blockedUntil is set but the 24h time has elapsed, automatically unblock the account
    let currentFailedAttempts = user.failedAttempts;
    if (user.blockedUntil && user.blockedUntil <= now) {
      currentFailedAttempts = 0;
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedAttempts: 0,
          blockedUntil: null,
        },
      });
    }

    // 3. Validation of PIN
    if (user.passwordHash !== pin) {
      const newAttempts = currentFailedAttempts + 1;
      let blockedUntilDate: Date | null = null;
      let message = "";

      if (newAttempts >= 4) {
        blockedUntilDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Block for 24h
        message = "Votre compte est bloqué pour 24h suite à 4 tentatives infructueuses. Veuillez contacter le service client ou réesssayez plus tard.";
      } else {
        message = `Code PIN incorrect. Tentative ${newAttempts}/4.`;
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedAttempts: newAttempts,
          blockedUntil: blockedUntilDate,
        },
      });

      throw new UnauthorizedException(message);
    }

    // 4. Correct login: Reset attempts & blocked status
    if (user.failedAttempts > 0 || user.blockedUntil !== null) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedAttempts: 0,
          blockedUntil: null,
        },
      });
    }

    const token = this.generateToken(user);
    return { success: true, user, token };
  }

  async unblockUser(phone: string) {
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      throw new BadRequestException("Aucun utilisateur trouvé avec ce numéro.");
    }
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedAttempts: 0,
        blockedUntil: null,
      },
    });
    return { success: true, message: "Le compte a été débloqué avec succès." };
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, phone: user.phone, role: user.role, companyId: user.companyId };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'super-secret-key-panafrican-aller-retour-2026',
      expiresIn: '7d',
    });
  }
}

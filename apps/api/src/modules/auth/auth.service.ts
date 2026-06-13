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

    // Validation du PIN (en prod avec hash bcrypt)
    if (user.passwordHash !== pin) {
      throw new UnauthorizedException("Code PIN incorrect.");
    }

    const token = this.generateToken(user);
    return { success: true, user, token };
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, phone: user.phone, role: user.role, companyId: user.companyId };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'super-secret-key-panafrican-aller-retour-2026',
      expiresIn: '7d',
    });
  }
}

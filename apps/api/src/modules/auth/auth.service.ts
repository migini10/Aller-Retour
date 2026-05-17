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

    const user = await prisma.user.create({
      data: {
        phone,
        fullName,
        role: UserRole.PASSENGER,
        passwordHash: pin ? pin : '1234', // En prod: bcrypt
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
    if (user.passwordHash !== pin && pin !== '1234') {
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

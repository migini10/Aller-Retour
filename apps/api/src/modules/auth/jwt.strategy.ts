import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { prisma } from '@aller-retour/database';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key-panafrican-aller-retour-2026',
    });
  }

  async validate(payload: { sub: string; phone: string; role: string; companyId?: string }) {
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException("Compte inactif ou introuvable.");
    }

    return {
      id: user.id,
      phone: user.phone,
      role: user.role,
      companyId: user.companyId,
    };
  }
}

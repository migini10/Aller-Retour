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
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { sub: string; phone: string; role: string }) {
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException("Compte inactif ou introuvable.");
    }

    if ((user as any).bannedAt) {
      const banReason = (user as any).banReason || 'Raison non renseignée';
      throw new UnauthorizedException(`Votre compte a été suspendu. Raison : ${banReason}`);
    }

    const now = new Date();
    if (user.blockedUntil && user.blockedUntil > now) {
      throw new UnauthorizedException(
        `Compte temporairement bloqué jusqu’au ${user.blockedUntil.toLocaleString('fr-FR', { timeZone: 'UTC' })}`
      );
    }

    return {
      id: user.id,
      phone: user.phone,
      role: user.role,
      verifiedAt: user.verifiedAt,
    };
  }
}

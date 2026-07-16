import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { prisma, UserRole } from '@aller-retour/database';
import { NotificationsService } from '../notifications/notifications.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly notificationsService: NotificationsService
  ) {}

  private forgotPasswordOtps = new Map<string, { otp: string; expiresAt: Date }>();

  validatePinStrength(pin: string) {
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

  private formatPhone(phone: string): string {
    let clean = phone.replace(/\s+/g, '');
    if (!clean.startsWith('+221') && !clean.startsWith('221') && !clean.startsWith('00221')) {
      return `+221${clean}`;
    } else if (clean.startsWith('221')) {
      return `+${clean}`;
    } else if (clean.startsWith('00221')) {
      return clean.replace('00221', '+221');
    }
    return clean;
  }

  async registerUser(phoneRaw: string, fullName: string, accountType: 'PASSENGER' | 'DRIVER', pin?: string) {
    const phone = this.formatPhone(phoneRaw);
    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) {
      throw new BadRequestException("Ce numéro de téléphone est déjà enregistré.");
    }

    if (pin) {
      this.validatePinStrength(pin);
    }

    const passwordHash = pin ? await bcrypt.hash(pin, 10) : await bcrypt.hash('123456', 10);
    const role = accountType === 'DRIVER' ? UserRole.DRIVER : UserRole.PASSENGER;

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          phone,
          fullName,
          role,
          passwordHash,
        },
      });

      if (role === UserRole.DRIVER) {
        await tx.driverProfile.create({
          data: {
            userId: newUser.id,
            type: 'OWNER',
          }
        });
      }

      return newUser;
    });

    const token = this.generateToken(user);
    const { passwordHash: _, ...safeUser } = user as any;
    return { success: true, user: safeUser, token };
  }

  async loginWithMobile(phoneRaw: string, pin: string) {
    const phone = this.formatPhone(phoneRaw);
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

    // 3. Validation of PIN (with transparent migration)
    let isPinValid = false;
    let needsMigration = false;

    if (user.passwordHash && user.passwordHash.startsWith('$2')) {
      isPinValid = await bcrypt.compare(pin, user.passwordHash);
    } else {
      // Legacy plaintext PIN
      isPinValid = user.passwordHash === pin;
      if (isPinValid) {
        needsMigration = true;
      }
    }

    if (!isPinValid) {
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

    // 4. Correct login: Reset attempts & blocked status, and migrate PIN if needed
    if (user.failedAttempts > 0 || user.blockedUntil !== null || needsMigration) {
      const dataToUpdate: any = {
        failedAttempts: 0,
        blockedUntil: null,
      };
      
      if (needsMigration) {
        dataToUpdate.passwordHash = await bcrypt.hash(pin, 10);
      }

      await prisma.user.update({
        where: { id: user.id },
        data: dataToUpdate,
      });
    }

    const token = this.generateToken(user);
    const { passwordHash: _, ...safeUser } = user as any;
    return { success: true, user: safeUser, token };
  }

  async sendForgotPasswordOtp(phoneRaw: string) {
    const phone = this.formatPhone(phoneRaw);
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      throw new BadRequestException("Aucun compte n'est enregistré avec ce numéro de téléphone.");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.forgotPasswordOtps.set(phone, {
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });

    const isProduction = process.env.NODE_ENV === 'production';
    const hasSmsProvider = !!process.env.SMS_PROVIDER_API_KEY;

    if (isProduction && !hasSmsProvider) {
      // Bloquer le flow en production si aucun vrai provider SMS n'est configuré
      throw new BadRequestException("L'envoi de SMS n'est pas encore disponible en production.");
    }

    // Mode dev/staging ou si un provider SMS est disponible
    if (!isProduction && !hasSmsProvider) {
      console.log(`[DEV MODE - Forgot Password] OTP ${otp} pour ${phone}`);
      // On peut toujours utiliser l'email comme fallback en dev pour tester
      try {
        await this.notificationsService.sendNotification({
          to: user.email || 'allogoosn@gmail.com',
          subject: 'Allogoo - Code de vérification',
          html: `<p>Code OTP: <strong>${otp}</strong></p>`,
          safeContent: 'OTP envoyé (mode dev)',
          recipientId: user.id
        });
      } catch (e) {
        console.error('Erreur envoi email fallback en dev', e);
      }
      return { success: true, message: "Mode test : Le code a été généré (voir logs)." };
    }

    // TODO: Implémenter le vrai provider SMS ici quand il sera disponible
    throw new BadRequestException("L'envoi de SMS n'est pas encore disponible.");
  }

  async resetPasswordWithOtp(phoneRaw: string, code: string, newPin: string) {
    const phone = this.formatPhone(phoneRaw);
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      throw new BadRequestException("Utilisateur non trouvé.");
    }

    const record = this.forgotPasswordOtps.get(phone);
    if (!record || record.expiresAt < new Date() || record.otp !== code) {
      throw new BadRequestException("Code de vérification incorrect ou expiré.");
    }

    this.validatePinStrength(newPin);

    const hashedPin = await bcrypt.hash(newPin, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPin,
        failedAttempts: 0,
        blockedUntil: null,
      },
    });

    this.forgotPasswordOtps.delete(phone);
    return { success: true, message: "Votre code PIN a été mis à jour avec succès." };
  }

  async unblockUser(phoneRaw: string) {
    const phone = this.formatPhone(phoneRaw);
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

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        role: true,
        isActive: true,
        verifiedAt: true,
        colisPoints: true,
        transportPoints: true,
        createdAt: true,
        driverProfile: {
          select: { type: true }
        }
      }
    });
    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable');
    }
    return { success: true, user };
  }

  async verifyUserPin(userId: string, pin: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException("Utilisateur introuvable.");
    
    let isPinValid = false;
    let needsMigration = false;

    if (user.passwordHash && user.passwordHash.startsWith('$2')) {
      isPinValid = await bcrypt.compare(pin, user.passwordHash);
    } else {
      isPinValid = user.passwordHash === pin;
      if (isPinValid) {
        needsMigration = true;
      }
    }

    if (!isPinValid) {
      throw new BadRequestException("Code secret de connexion incorrect.");
    }

    if (needsMigration) {
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: await bcrypt.hash(pin, 10) }
      });
    }

    return { success: true, message: "Code PIN valide." };
  }

  async requestVerification(userId: string, channel: 'EMAIL' | 'WHATSAPP') {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException("Utilisateur non trouvé.");
    if (user.verifiedAt) throw new BadRequestException("Compte déjà vérifié.");

    const isProduction = process.env.NODE_ENV === 'production';
    if (channel === 'WHATSAPP' && isProduction) {
      throw new BadRequestException("WhatsApp n'est pas encore disponible en production.");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const linkToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = await bcrypt.hash(linkToken, 10);
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await prisma.verificationToken.createMany({
      data: [
        { userId, type: 'OTP', channel, tokenHash: otpHash, expiresAt },
        { userId, type: 'LINK', channel, tokenHash, expiresAt }
      ]
    });

    // Envoyer
    if (channel === 'EMAIL' || (!isProduction && channel === 'WHATSAPP')) {
      try {
        await this.notificationsService.sendNotification({
          to: user.email || 'allogoosn@gmail.com',
          subject: 'Allogoo - Vérification de votre compte',
          html: `<p>Votre code OTP est <strong>${otp}</strong>.</p><p>Ou cliquez sur ce lien : <a href="https://aller-retour.onrender.com/v1/auth/verify-link/${linkToken}">Vérifier mon compte</a></p>`,
          safeContent: 'Un email contenant le code OTP et le lien a été envoyé.',
          recipientId: user.id
        });
      } catch (e) {
        console.error('Erreur envoi email de vérification', e);
        throw new BadRequestException("Le service d'envoi d'e-mails est temporairement indisponible. Veuillez réessayer plus tard.");
      }
    }

    return { success: true, message: `Vérification envoyée via ${channel}.` };
  }

  async verifyOtp(userId: string, otp: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException("Utilisateur non trouvé.");
    if (user.verifiedAt) return { success: true, message: "Compte déjà vérifié." };

    const tokens = await prisma.verificationToken.findMany({
      where: { userId, type: 'OTP', usedAt: null, expiresAt: { gt: new Date() } }
    });

    let isValid = false;
    let matchedTokenId: string | undefined = undefined;
    let channel = '';
    for (const t of tokens) {
      if (t.attempts >= 5) continue;
      if (await bcrypt.compare(otp, t.tokenHash)) {
        isValid = true;
        matchedTokenId = t.id;
        channel = t.channel;
        break;
      } else {
        await prisma.verificationToken.update({ where: { id: t.id }, data: { attempts: { increment: 1 } } });
      }
    }

    if (!isValid) throw new BadRequestException("Code OTP invalide ou expiré.");

    const now = new Date();
    await prisma.$transaction([
      prisma.verificationToken.update({ where: { id: matchedTokenId }, data: { usedAt: now } }),
      prisma.user.update({
        where: { id: userId },
        data: {
          verifiedAt: now,
          verificationMethod: channel,
          ...(channel === 'EMAIL' ? { emailVerifiedAt: now } : { phoneVerifiedAt: now })
        }
      })
    ]);

    return { success: true, message: "Compte vérifié avec succès via OTP." };
  }

  async verifyLink(token: string) {
    const tokens = await prisma.verificationToken.findMany({
      where: { type: 'LINK', usedAt: null, expiresAt: { gt: new Date() } }
    });

    let matchedToken = null;
    for (const t of tokens) {
      if (await bcrypt.compare(token, t.tokenHash)) {
        matchedToken = t;
        break;
      }
    }

    if (!matchedToken) throw new BadRequestException("Lien invalide ou expiré.");

    const now = new Date();
    await prisma.$transaction([
      prisma.verificationToken.update({ where: { id: matchedToken.id }, data: { usedAt: now } }),
      prisma.user.update({
        where: { id: matchedToken.userId },
        data: {
          verifiedAt: now,
          verificationMethod: matchedToken.channel,
          ...(matchedToken.channel === 'EMAIL' ? { emailVerifiedAt: now } : { phoneVerifiedAt: now })
        }
      })
    ]);

    return { success: true, message: "Compte vérifié avec succès via le lien sécurisé." };
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, phone: user.phone, role: user.role, companyId: user.companyId };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });
  }
}

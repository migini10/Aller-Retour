import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { prisma, UserRole, DriverType } from '@aller-retour/database';
import { CreateAlloPriveRequestDto } from './dto/create-allo-prive-request.dto';
import { AlloPriveRequestStatus, AlloPriveApplicationStatus } from './allo-prive.constants';

@Injectable()
export class AlloPriveService {
  
  // ─── UTILS ──────────────────────────────────────────────────
  private async getDriverProfile(userId: string) {
    const profile = await prisma.driverProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      throw new ForbiddenException('Profil chauffeur introuvable.');
    }
    return profile;
  }

  // ─── PASSENGER ACTIONS ──────────────────────────────────────

  async createRequest(userId: string, dto: CreateAlloPriveRequestDto) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');

    return prisma.alloPriveRequest.create({
      data: {
        clientId: userId,
        clientName: user.fullName,
        clientPhone: user.phone,
        origin: dto.origin,
        destination: dto.destination,
        departureDate: dto.departureDate,
        price: dto.price,
        type: dto.type || 'allo-prive',
        status: AlloPriveRequestStatus.PENDING,
      },
    });
  }

  async getMyRequests(userId: string) {
    return prisma.alloPriveRequest.findMany({
      where: { clientId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { applications: true } },
      },
    });
  }

  // ─── DRIVER ACTIONS ─────────────────────────────────────────

  async getAvailableRequests(userId: string, role: string) {
    if (role !== UserRole.DRIVER && role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Seuls les chauffeurs peuvent voir la marketplace.');
    }
    
    // Check if driver is OWNER
    if (role === UserRole.DRIVER) {
      const profile = await this.getDriverProfile(userId);
      if (profile.type !== DriverType.OWNER) {
        throw new ForbiddenException('Seuls les chauffeurs propriétaires (OWNER) peuvent accéder aux appels privés.');
      }
    }

    const requests = await prisma.alloPriveRequest.findMany({
      where: { status: AlloPriveRequestStatus.PENDING },
      orderBy: { createdAt: 'desc' },
    });

    // Masquer le numéro de téléphone et le nom complet (si désiré)
    return requests.map(req => {
      const { clientPhone, ...safeRequest } = req;
      return safeRequest;
    });
  }

  async applyToRequest(requestId: string, userId: string, role: string) {
    if (role !== UserRole.DRIVER) {
      throw new ForbiddenException('Seul un chauffeur peut candidater.');
    }

    const profile = await this.getDriverProfile(userId);
    if (profile.type !== DriverType.OWNER) {
      throw new ForbiddenException('Seuls les chauffeurs propriétaires (OWNER) peuvent candidater aux appels privés.');
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');

    const request = await prisma.alloPriveRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new NotFoundException('Demande introuvable.');
    if (request.status !== AlloPriveRequestStatus.PENDING) {
      throw new ConflictException('Cette demande n\'est plus disponible.');
    }

    const existing = await prisma.alloPriveApplication.findUnique({
      where: {
        requestId_driverId: {
          requestId,
          driverId: userId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Vous avez déjà candidaté à cette demande.');
    }

    return prisma.alloPriveApplication.create({
      data: {
        requestId,
        driverId: userId,
        driverName: user.fullName,
        driverPhone: user.phone,
        driverRating: profile.rating,
        driverVerified: profile.isVerified,
        driverScore: 100, // Score arbitraire ou calculé plus tard
        status: AlloPriveApplicationStatus.PENDING,
      },
    });
  }

  // ─── SHARED / ADMIN ACTIONS ─────────────────────────────────

  async getRequestById(requestId: string, userId: string, role: string) {
    const request = await prisma.alloPriveRequest.findUnique({
      where: { id: requestId },
      include: {
        applications: true,
      },
    });

    if (!request) throw new NotFoundException('Demande introuvable.');

    if (role === UserRole.SUPER_ADMIN) return request;

    // Si c'est le client propriétaire
    if (request.clientId === userId) return request;

    // Si c'est un chauffeur, il ne peut voir que s'il a candidaté
    const hasApplied = request.applications.some(app => app.driverId === userId);
    if (!hasApplied) {
      throw new ForbiddenException('Accès refusé. Vous n\'avez pas candidaté à cette demande.');
    }

    // Si le chauffeur n'est pas ACCEPTED, on masque le téléphone
    const myApp = request.applications.find(app => app.driverId === userId);
    if (myApp?.status !== AlloPriveApplicationStatus.ACCEPTED) {
      const { clientPhone, applications, ...safeReq } = request as any;
      return safeReq;
    }

    // Le chauffeur accepté peut tout voir sauf les autres applications
    const { applications, ...safeReq } = request as any;
    return safeReq;
  }

  async getRequestApplications(requestId: string, userId: string, role: string) {
    const request = await prisma.alloPriveRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) throw new NotFoundException('Demande introuvable.');

    if (role !== UserRole.SUPER_ADMIN && request.clientId !== userId) {
      throw new ForbiddenException('Seul le propriétaire de la demande peut voir les candidatures.');
    }

    return prisma.alloPriveApplication.findMany({
      where: { requestId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── MUTATIONS TRANSACTIONNELLES ────────────────────────────

  async acceptApplication(applicationId: string, userId: string, role: string) {
    const application = await prisma.alloPriveApplication.findUnique({
      where: { id: applicationId },
      include: { request: true },
    });

    if (!application) throw new NotFoundException('Candidature introuvable.');
    const request = application.request;

    if (role !== UserRole.SUPER_ADMIN && request.clientId !== userId) {
      throw new ForbiddenException('Seul le client ayant créé la demande peut accepter une candidature.');
    }

    if (application.status !== AlloPriveApplicationStatus.PENDING) {
      throw new ConflictException('Cette candidature n\'est plus en attente.');
    }

    return prisma.$transaction(async (tx) => {
      // 1. Transition atomique de la request : PENDING -> ACCEPTED
      const updatedReq = await tx.alloPriveRequest.updateMany({
        where: { id: request.id, status: AlloPriveRequestStatus.PENDING },
        data: { status: AlloPriveRequestStatus.ACCEPTED },
      });

      if (updatedReq.count === 0) {
        throw new ConflictException('La demande a déjà été acceptée ou annulée.');
      }

      // 2. Accepter la candidature choisie
      const acceptedApp = await tx.alloPriveApplication.update({
        where: { id: applicationId },
        data: { status: AlloPriveApplicationStatus.ACCEPTED },
      });

      // 3. Rejeter les autres
      await tx.alloPriveApplication.updateMany({
        where: {
          requestId: request.id,
          id: { not: applicationId },
        },
        data: { status: AlloPriveApplicationStatus.REJECTED },
      });

      return acceptedApp;
    });
  }

  async cancelRequest(requestId: string, userId: string, role: string) {
    const request = await prisma.alloPriveRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new NotFoundException('Demande introuvable.');

    if (role !== UserRole.SUPER_ADMIN && request.clientId !== userId) {
      throw new ForbiddenException('Action non autorisée.');
    }

    if (request.status !== AlloPriveRequestStatus.PENDING) {
      throw new ConflictException('Seule une demande PENDING peut être annulée.');
    }

    return prisma.$transaction(async (tx) => {
      const cancelledReq = await tx.alloPriveRequest.update({
        where: { id: requestId },
        data: { status: AlloPriveRequestStatus.CANCELLED },
      });

      await tx.alloPriveApplication.updateMany({
        where: { requestId },
        data: { status: AlloPriveApplicationStatus.REJECTED },
      });

      return cancelledReq;
    });
  }

  async completeRequest(requestId: string, userId: string, role: string) {
    const request = await prisma.alloPriveRequest.findUnique({
      where: { id: requestId },
      include: { applications: true },
    });
    if (!request) throw new NotFoundException('Demande introuvable.');

    const acceptedApp = request.applications.find(app => app.status === AlloPriveApplicationStatus.ACCEPTED);
    const isAcceptedDriver = acceptedApp && acceptedApp.driverId === userId;

    if (
      role !== UserRole.SUPER_ADMIN &&
      request.clientId !== userId &&
      !isAcceptedDriver
    ) {
      throw new ForbiddenException('Seul le client, le chauffeur accepté ou un admin peut marquer la demande comme terminée.');
    }

    if (request.status !== AlloPriveRequestStatus.ACCEPTED) {
      throw new BadRequestException('La demande doit être ACCEPTED avant d\'être COMPLETED.');
    }

    return prisma.alloPriveRequest.update({
      where: { id: requestId },
      data: { status: AlloPriveRequestStatus.COMPLETED },
    });
  }
}

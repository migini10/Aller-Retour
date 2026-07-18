import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { prisma } from '@aller-retour/database';
import { SupabaseService } from '../../core/supabase/supabase.service';

@Injectable()
export class VehiclesCronService {
  private readonly logger = new Logger(VehiclesCronService.name);

  constructor(private readonly supabase: SupabaseService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyMaintenance() {
    this.logger.log('Démarrage de la maintenance quotidienne des véhicules (Suppression & Expiration photos)...');
    
    await this.processVehicleDeletions();
    await this.processPhotoExpirations();
    
    this.logger.log('Maintenance quotidienne terminée.');
  }

  private async processVehicleDeletions() {
    const now = new Date();
    
    const vehiclesToDelete = await prisma.vehicle.findMany({
      where: {
        deletionScheduledAt: {
          lte: now,
        },
        isArchived: false,
      },
      include: {
        trips: true,
      },
    });

    for (const vehicle of vehiclesToDelete) {
      if (vehicle.trips.length === 0) {
        // Hard Delete
        try {
          await prisma.vehicle.delete({ where: { id: vehicle.id } });
          const photos = [vehicle.frontPhotoKey, vehicle.rearPhotoKey, vehicle.sidePhotoKey].filter(Boolean);
          if (photos.length > 0) {
            await this.supabase.deleteFiles('vehicles', photos as string[]);
          }
          this.logger.log(`Véhicule ${vehicle.id} supprimé définitivement (sans historique)`);
        } catch (error) {
          this.logger.error(`Erreur suppression hard du véhicule ${vehicle.id}`, error);
        }
      } else {
        // Soft Delete (Archivage + purge des médias)
        try {
          // Delete medias from storage
          const photos = [vehicle.frontPhotoKey, vehicle.rearPhotoKey, vehicle.sidePhotoKey].filter(Boolean);
          if (photos.length > 0) {
            await this.supabase.deleteFiles('vehicles', photos as string[]);
          }

          // Delete documents from storage
          const documents = await prisma.vehicleDocument.findMany({ where: { vehicleId: vehicle.id } });
          const getBucket = (key: string) => key.includes('/documents/') ? 'vehicles' : 'vehicle-documents';
          
          const filesToDelete: { bucket: string, key: string }[] = [];
          for (const doc of documents) {
            if (doc.fileKey) filesToDelete.push({ bucket: getBucket(doc.fileKey), key: doc.fileKey });
            if (doc.backFileKey) filesToDelete.push({ bucket: getBucket(doc.backFileKey), key: doc.backFileKey });
          }

          for (const { bucket, key } of filesToDelete) {
            await this.supabase.deleteFile(bucket, key).catch(e => this.logger.error(`Erreur suppression document ${key}`, e));
          }

          // Update DB
          await prisma.vehicleDocument.deleteMany({ where: { vehicleId: vehicle.id } });
          await prisma.vehicle.update({
            where: { id: vehicle.id },
            data: {
              isArchived: true,
              frontPhotoKey: null,
              rearPhotoKey: null,
              sidePhotoKey: null,
            },
          });
          this.logger.log(`Véhicule ${vehicle.id} archivé et médias purgés (historique préservé)`);
        } catch (error) {
          this.logger.error(`Erreur archivage du véhicule ${vehicle.id}`, error);
        }
      }
    }
  }

  private async processPhotoExpirations() {
    const now = new Date();
    const in7Days = new Date();
    in7Days.setDate(in7Days.getDate() + 7);

    // Mettre à jour vers EXPIRING_SOON
    try {
      const expiringSoon = await prisma.vehicle.updateMany({
        where: {
          photosExpireAt: {
            lte: in7Days,
            gt: now,
          },
          photosRenewalStatus: 'VALID',
        },
        data: {
          photosRenewalStatus: 'EXPIRING_SOON',
        },
      });
      if (expiringSoon.count > 0) {
        this.logger.log(`${expiringSoon.count} véhicules mis en statut EXPIRING_SOON.`);
      }
    } catch (e) {
      this.logger.error('Erreur mise à jour EXPIRING_SOON', e);
    }

    // Mettre à jour vers EXPIRED
    try {
      const expired = await prisma.vehicle.updateMany({
        where: {
          photosExpireAt: {
            lte: now,
          },
          photosRenewalStatus: {
            not: 'EXPIRED',
          },
        },
        data: {
          photosRenewalStatus: 'EXPIRED',
        },
      });
      if (expired.count > 0) {
        this.logger.log(`${expired.count} véhicules mis en statut EXPIRED.`);
      }
    } catch (e) {
      this.logger.error('Erreur mise à jour EXPIRED', e);
    }
  }
}

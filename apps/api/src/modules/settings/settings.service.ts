import { Injectable, Logger } from '@nestjs/common';
import { prisma, SystemSetting } from '@aller-retour/database';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);
  
  // Cache en mémoire
  private cachedSettings: SystemSetting | null = null;
  private cacheExpiresAt: number = 0;
  private readonly CACHE_TTL_MS = 60000; // 60 secondes

  async getSettings(): Promise<SystemSetting> {
    const now = Date.now();
    
    // Retourne le cache s'il est valide
    if (this.cachedSettings && now < this.cacheExpiresAt) {
      return this.cachedSettings;
    }

    // Sinon on interroge la BD (upsert garanti avec des valeurs par défaut)
    const settings = await prisma.systemSetting.upsert({
      where: { id: 'default' },
      update: {},
      create: {}
    });

    // Mise en cache
    this.cachedSettings = settings;
    this.cacheExpiresAt = now + this.CACHE_TTL_MS;

    return settings;
  }

  async updateSettings(dto: UpdateSettingsDto): Promise<SystemSetting> {
    const settings = await prisma.systemSetting.upsert({
      where: { id: 'default' },
      update: dto,
      create: {
        ...dto,
      }
    });

    // Invalider immédiatement le cache
    this.cachedSettings = settings;
    this.cacheExpiresAt = Date.now() + this.CACHE_TTL_MS;
    
    this.logger.log('Paramètres systèmes mis à jour et cache invalidé.');
    return settings;
  }
}

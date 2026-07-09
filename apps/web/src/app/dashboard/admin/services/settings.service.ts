import { ApiClient } from './api.client';
import { SystemSettings, UpdateSettingsPayload } from '../types/settings.types';

export class SettingsService {
  static async getSettings(): Promise<SystemSettings> {
    return ApiClient.get<SystemSettings>('/v1/settings');
  }

  static async updateSettings(payload: UpdateSettingsPayload): Promise<SystemSettings> {
    return ApiClient.patch<SystemSettings>('/v1/settings', payload);
  }
}

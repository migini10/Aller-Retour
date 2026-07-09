import { ApiClient } from './api.client';
import { SystemHealth, MonitoringAlerts } from '../types/monitoring.types';

export class MonitoringService {
  static async getHealth(): Promise<SystemHealth> {
    return ApiClient.get<SystemHealth>('/v1/monitoring/health');
  }

  static async getAlerts(): Promise<MonitoringAlerts> {
    return ApiClient.get<MonitoringAlerts>('/v1/monitoring/alerts');
  }
}

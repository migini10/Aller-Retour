import { ApiClient } from '@/lib/api.client';
import { DriverEarning, DriverEarningSummary, GetEarningsFilters } from '../types/driver-earning.types';

export class DriverOperationsService {
  static async getEarnings(filters: GetEarningsFilters): Promise<{ data: DriverEarning[], meta: any }> {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.driverId) params.append('driverId', filters.driverId);
    if (filters.date) params.append('date', filters.date);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = `/v1/driver-earnings${queryString ? `?${queryString}` : ''}`;
    
    return ApiClient.get<{ data: DriverEarning[], meta: any }>(url);
  }

  static async getSummary(): Promise<DriverEarningSummary> {
    return ApiClient.get<DriverEarningSummary>('/v1/driver-earnings/summary');
  }

  static async getEarningsByDriverId(driverId: string): Promise<DriverEarning[]> {
    return ApiClient.get<DriverEarning[]>(`/v1/driver-earnings/${driverId}`);
  }

  static async markAsPaid(id: string, payoutRef: string): Promise<DriverEarning> {
    return ApiClient.patch<DriverEarning>(`/v1/driver-earnings/${id}/mark-paid`, { payoutRef });
  }
}

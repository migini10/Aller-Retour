import { ApiClient } from './api.client';
import { DriverEarning, DriverEarningSummary, GetEarningsFilters } from '../types/driver-earning.types';

export class DriverOperationsService {
  static async getEarnings(filters: GetEarningsFilters): Promise<DriverEarning[]> {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.driverId) params.append('driverId', filters.driverId);
    if (filters.date) params.append('date', filters.date);

    const queryString = params.toString();
    const url = `/driver-earnings${queryString ? `?${queryString}` : ''}`;
    
    return ApiClient.fetch<DriverEarning[]>(url);
  }

  static async getSummary(): Promise<DriverEarningSummary> {
    return ApiClient.fetch<DriverEarningSummary>('/driver-earnings/summary');
  }

  static async getEarningsByDriverId(driverId: string): Promise<DriverEarning[]> {
    return ApiClient.fetch<DriverEarning[]>(`/driver-earnings/${driverId}`);
  }

  static async markAsPaid(id: string, payoutRef: string): Promise<DriverEarning> {
    return ApiClient.fetch<DriverEarning>(`/driver-earnings/${id}/mark-paid`, {
      method: 'PATCH',
      body: JSON.stringify({ payoutRef })
    });
  }
}

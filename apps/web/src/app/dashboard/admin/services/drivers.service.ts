import { DriverProfile, Vehicle, DriverEarning, DriverReview } from '../types/driver.types';
import { ApiClient } from './api.client';

interface GetDriversFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  kycStatus?: string;
}

export class DriversService {
  static async getDrivers(filters: GetDriversFilters = {}): Promise<{ data: DriverProfile[], meta: any }> {
    const json = await ApiClient.get('/v1/drivers', filters);
    return {
      data: json.data || [],
      meta: json.meta || {},
    };
  }

  static async getDriverById(id: string): Promise<DriverProfile | null> {
    const json = await ApiClient.get(`/v1/drivers/${id}`);
    if (!json) return null;
    return json;
  }

  static async updateKycStatus(id: string, kycStatus: 'APPROVED' | 'REJECTED', reason?: string): Promise<boolean> {
    await ApiClient.patch(`/v1/drivers/${id}/kyc`, { kycStatus, reason });
    return true;
  }

  static async getDriverVehicles(id: string): Promise<Vehicle[]> {
    const json = await ApiClient.get(`/v1/drivers/${id}/vehicles`);
    return json.data || [];
  }

  static async updateVehicleStatus(driverId: string, vehicleId: string, status: 'ACTIVE' | 'SUSPENDED' | 'PENDING'): Promise<boolean> {
    await ApiClient.patch(`/v1/drivers/${driverId}/vehicles/${vehicleId}`, { status });
    return true;
  }

  static async getDriverEarnings(id: string): Promise<DriverEarning[]> {
    const json = await ApiClient.get(`/v1/drivers/${id}/earnings`);
    return json.data || [];
  }

  static async getDriverReviews(id: string): Promise<DriverReview[]> {
    const json = await ApiClient.get(`/v1/drivers/${id}/reviews`);
    return json.data || [];
  }
}

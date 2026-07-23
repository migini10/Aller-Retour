import { DriverProfile, Vehicle, DriverEarning, DriverReview } from '../types/driver.types';
import { ApiClient } from '@/lib/api.client';

interface GetDriversFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  kycStatus?: string;
  type?: string;
  managerId?: string;
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

  static async updateVehicleStatus(driverId: string, vehicleId: string, status: string): Promise<boolean> {
    await ApiClient.patch(`/v1/drivers/${driverId}/vehicles/${vehicleId}`, { status });
    return true;
  }

  static async createDriverVehicle(driverId: string, data: any): Promise<Vehicle> {
    const json = await ApiClient.post(`/v1/drivers/${driverId}/vehicles`, data);
    return json;
  }

  static async approveVehicle(vehicleId: string): Promise<boolean> {
    await ApiClient.patch(`/v1/drivers/admin/vehicles/${vehicleId}/approve`, {});
    return true;
  }

  static async rejectVehicle(vehicleId: string, reason?: string): Promise<boolean> {
    await ApiClient.patch(`/v1/drivers/admin/vehicles/${vehicleId}/reject`, { reason });
    return true;
  }

  static async certifyVehicle(vehicleId: string): Promise<boolean> {
    await ApiClient.patch(`/v1/drivers/admin/vehicles/${vehicleId}/certify`, {});
    return true;
  }

  static async revokeCertification(vehicleId: string): Promise<boolean> {
    await ApiClient.patch(`/v1/drivers/admin/vehicles/${vehicleId}/revoke-certification`, {});
    return true;
  }

  static async getVehicleDocuments(vehicleId: string): Promise<any[]> {
    const json = await ApiClient.get(`/v1/drivers/admin/vehicles/${vehicleId}/documents`);
    return json || [];
  }

  static async approveVehicleDocument(documentId: string): Promise<boolean> {
    await ApiClient.patch(`/v1/drivers/admin/vehicle-documents/${documentId}/approve`, {});
    return true;
  }

  static async rejectVehicleDocument(documentId: string, reason: string): Promise<boolean> {
    await ApiClient.patch(`/v1/drivers/admin/vehicle-documents/${documentId}/reject`, { reason });
    return true;
  }

  static async getAllVehicles(): Promise<Vehicle[]> {
    const json = await ApiClient.get(`/v1/drivers/admin/vehicles`);
    return json || [];
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

import { Trip, TripManifest, TransferTarget } from '../types/trip.types';
import { ApiClient } from './api.client';

interface GetTripsFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  date?: string;
}

export class TripsService {
  static async searchTrips(filters: GetTripsFilters = {}): Promise<{ data: Trip[], meta: any }> {
    const json = await ApiClient.get('/v1/trips/search', filters);
    return {
      data: json.data || [],
      meta: json.meta || {},
    };
  }

  static async getTripManifest(id: string): Promise<TripManifest | null> {
    const json = await ApiClient.get(`/v1/trips/${id}/manifest`);
    if (!json) return null;
    return json;
  }

  static async createAlloDakar(data: any): Promise<boolean> {
    await ApiClient.post('/v1/trips/create-allo-dakar', data);
    return true;
  }

  static async updateTrip(id: string, data: Partial<Trip>): Promise<boolean> {
    await ApiClient.patch(`/v1/trips/${id}`, data);
    return true;
  }

  static async deleteTrip(id: string): Promise<boolean> {
    await ApiClient.delete(`/v1/trips/${id}`);
    return true;
  }

  static async toggleLock(id: string): Promise<boolean> {
    await ApiClient.patch(`/v1/trips/${id}/toggle-lock`);
    return true;
  }

  static async getTransferTargets(id: string): Promise<TransferTarget[]> {
    const json = await ApiClient.get(`/v1/trips/${id}/transfer-targets`);
    return json.data || [];
  }
}

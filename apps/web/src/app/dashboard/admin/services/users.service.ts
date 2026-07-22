import { User, UserRole, UserStatus, UserActivityEvent } from '../types/user.types';
import { ApiClient } from '@/lib/api.client';

interface GetUsersFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

export class UsersService {
  // Helper method to map missing fields with default values
  private static mapUser(apiUser: any): User {
    const fullName = apiUser.fullName || 'Utilisateur';
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    return {
      ...apiUser,
      firstName,
      lastName,
      fullName,
      badges: apiUser.badges || [],
      hasPinConfigured: apiUser.hasPinConfigured || false,
      pinLastModified: apiUser.pinLastModified,
      stats: apiUser.stats || {
        totalTrips: 0,
        totalBookings: 0,
        totalCancellations: 0,
        averageRating: 0,
        totalSpent: 0,
        totalEarned: 0,
        totalCommissions: 0,
      },
    };
  }

  static async getUsers(filters: GetUsersFilters = {}): Promise<{ data: User[], meta: any }> {
    const json = await ApiClient.get('/v1/users', filters);
    return {
      data: (json.data || []).map((u: any) => this.mapUser(u)),
      meta: json.meta || {},
    };
  }

  static async getUserById(id: string): Promise<User | null> {
    const json = await ApiClient.get(`/v1/users/${id}`);
    if (!json) return null;
    return this.mapUser(json);
  }

  static async updateUserStatus(id: string, action: 'ACTIVATE' | 'SUSPEND' | 'BLOCK', reason?: string): Promise<boolean> {
    await ApiClient.patch(`/v1/users/${id}/status`, { action, reason });
    return true;
  }

  static async getSecurityEvents(id: string): Promise<any[]> {
    const res = await ApiClient.get(`/v1/users/${id}/security-events`);
    return res.data;
  }

  static async resetUserPin(id: string): Promise<boolean> {
    await ApiClient.post(`/v1/users/${id}/reset-pin`);
    return true;
  }

  static async getUserActivity(id: string): Promise<UserActivityEvent[]> {
    const json = await ApiClient.get(`/v1/users/${id}/activity`);
    return json || [];
  }

  static async verifyTestAccount(id: string): Promise<boolean> {
    await ApiClient.patch(`/v1/users/${id}/verify-test-account`);
    return true;
  }

  static async markTestAccount(id: string): Promise<boolean> {
    await ApiClient.patch(`/v1/users/${id}/mark-test-account`);
    return true;
  }
}

import { ApiClient } from '@/lib/api.client';
import { GetNotificationsFilters, NotificationsResponse } from '../types/notification.types';

export class NotificationsService {
  static async getNotifications(filters: GetNotificationsFilters): Promise<NotificationsResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.recipientId) params.append('recipientId', filters.recipientId);
    if (filters.bookingId) params.append('bookingId', filters.bookingId);
    if (filters.tripId) params.append('tripId', filters.tripId);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);

    return ApiClient.get<NotificationsResponse>(`/v1/notifications?${params.toString()}`);
  }
}

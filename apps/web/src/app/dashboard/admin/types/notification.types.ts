export type NotificationType = 'EMAIL' | 'SYSTEM';
export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED';

export interface NotificationRecipient {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
}

export interface NotificationBooking {
  id: string;
  status: string;
}

export interface NotificationTrip {
  id: string;
  departureTime: string;
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  status: NotificationStatus;
  title: string;
  content: string;
  errorMessage?: string;
  recipientId?: string;
  bookingId?: string;
  tripId?: string;
  sentAt?: string;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
  
  recipient?: NotificationRecipient;
  booking?: NotificationBooking;
  trip?: NotificationTrip;
}

export interface GetNotificationsFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: NotificationType;
  status?: NotificationStatus;
  recipientId?: string;
  bookingId?: string;
  tripId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface NotificationsResponse {
  items: AppNotification[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

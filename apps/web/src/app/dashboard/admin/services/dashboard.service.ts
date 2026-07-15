import { ApiClient } from '@/lib/api.client';
import { Booking } from '../types/booking.types';

export interface DashboardKpis {
  totalUsers: number;
  newUsersToday: number;
  activeDrivers: number;
  totalTrips: number;
  tripsToday: number;
  bookingsToday: number;
  cancelledBookings: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  totalRevenue: number;
  totalPlatformFees: number;
  pendingDriverEarnings: number;
  averageRating: number;
}

export interface DashboardTrend {
  date: string;
  bookings: number;
  revenue: number;
  platformFees: number;
}

export interface DashboardTopDriver {
  driverId: string;
  name: string;
  totalEarnings: number;
  completedTrips: number;
  rating: number;
}

export interface DashboardCityActivity {
  city: string;
  bookings: number;
  trips: number;
  revenue: number;
}

export interface DashboardTimelineEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface DashboardAlert {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
}

export interface DashboardAnalyticsDto {
  kpis: DashboardKpis;
  trends: DashboardTrend[];
  topDrivers: DashboardTopDriver[];
  cityActivity: DashboardCityActivity[];
  timeline: DashboardTimelineEvent[];
  alerts: DashboardAlert[];
}

export interface DashboardSummary {
  analytics: DashboardAnalyticsDto;
  recentBookings: Booking[];
}

export class DashboardService {
  static async getSummary(): Promise<DashboardSummary> {
    // Appels en parallèle via ApiClient
    const [analyticsRes, recentBookingsRes] = await Promise.all([
      ApiClient.get<DashboardAnalyticsDto>('/analytics/dashboard'),
      ApiClient.get<any>('/bookings?limit=5')
    ]);

    return {
      analytics: analyticsRes as DashboardAnalyticsDto,
      recentBookings: recentBookingsRes?.data || []
    };
  }
}

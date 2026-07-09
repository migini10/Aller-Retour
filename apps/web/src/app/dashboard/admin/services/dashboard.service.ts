import { ApiClient } from './api.client';
import { Booking } from '../types/booking.types';

export interface DashboardSummary {
  usersTotal: number;
  activeDriversTotal: number;
  todayBookingsTotal: number;
  totalCollectedAmount: number;
  totalPlatformFees: number;
  cancelledBookingsTotal: number;
  recentBookings: Booking[];
}

export class DashboardService {
  static async getSummary(): Promise<DashboardSummary> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfDay = today.toISOString();
    
    const end = new Date(today);
    end.setDate(end.getDate() + 1);
    const endOfDay = end.toISOString();

    // Appels en parallèle via ApiClient
    const [
      usersRes,
      driversRes,
      todayBookingsRes,
      paymentsSummary,
      earningsSummary,
      cancelledBookingsRes,
      recentBookingsRes
    ] = await Promise.all([
      ApiClient.fetch<any>('/users?limit=1'),
      ApiClient.fetch<any>('/drivers?isActive=true&limit=1'),
      ApiClient.fetch<any>(`/bookings?dateFrom=${startOfDay}&dateTo=${endOfDay}&limit=1`),
      ApiClient.fetch<any>('/payment-transactions/summary'),
      ApiClient.fetch<any>('/driver-earnings/summary'),
      ApiClient.fetch<any>('/bookings?status=CANCELLED&limit=1'),
      ApiClient.fetch<any>('/bookings?limit=5')
    ]);

    return {
      usersTotal: usersRes?.meta?.total || 0,
      activeDriversTotal: driversRes?.meta?.total || 0,
      todayBookingsTotal: todayBookingsRes?.meta?.total || 0,
      totalCollectedAmount: paymentsSummary?.totalCollectedAmount || 0,
      totalPlatformFees: earningsSummary?.totalPlatformFees || 0,
      cancelledBookingsTotal: cancelledBookingsRes?.meta?.total || 0,
      recentBookings: recentBookingsRes?.data || []
    };
  }
}

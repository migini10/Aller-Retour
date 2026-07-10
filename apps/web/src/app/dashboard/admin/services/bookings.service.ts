import { ApiClient } from '@/lib/api.client';
import { Booking, GetBookingsFilters, GetBookingsResponse, BookingStatusResponse } from '../types/booking.types';

export class BookingsService {
  static async getBookings(filters: GetBookingsFilters): Promise<GetBookingsResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
    if (filters.tripId) params.append('tripId', filters.tripId);
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);

    const queryString = params.toString();
    const url = `/bookings${queryString ? `?${queryString}` : ''}`;
    
    return ApiClient.fetch<GetBookingsResponse>(url);
  }

  static async getBookingById(id: string): Promise<Booking> {
    return ApiClient.fetch<Booking>(`/bookings/${id}`);
  }

  static async getBookingStatus(id: string): Promise<BookingStatusResponse> {
    return ApiClient.fetch<BookingStatusResponse>(`/bookings/${id}/status`);
  }

  static async adminCancelBooking(id: string): Promise<{ success: boolean; message: string; booking: Booking }> {
    return ApiClient.fetch<{ success: boolean; message: string; booking: Booking }>(`/bookings/${id}/admin-cancel`, {
      method: 'POST',
    });
  }

  static async transferBooking(bookingIds: string[], targetTripId: string): Promise<{ success: boolean; message: string; transferredCount: number }> {
    return ApiClient.fetch<{ success: boolean; message: string; transferredCount: number }>('/bookings/transfer', {
      method: 'POST',
      body: JSON.stringify({ bookingIds, targetTripId }),
    });
  }

  static async verifyQr(token: string): Promise<{ success: boolean; message: string; booking: Booking }> {
    return ApiClient.fetch<{ success: boolean; message: string; booking: Booking }>(`/bookings/verify-qr/${token}`, {
      method: 'POST',
    });
  }
}

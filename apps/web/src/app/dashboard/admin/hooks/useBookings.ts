import { useState, useEffect, useCallback } from 'react';
import { BookingsService } from '../services/bookings.service';
import { Booking, GetBookingsFilters, BookingStatus, PaymentMethod } from '../types/booking.types';

interface UseBookingsOptions {
  id?: string;
  initialFilters?: GetBookingsFilters;
}

export function useBookings(options: UseBookingsOptions = {}) {
  const [data, setData] = useState<Booking[]>([]);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  const [filters, setFilters] = useState<GetBookingsFilters>(options.initialFilters || {
    page: 1,
    limit: 10,
    search: '',
    status: '',
    paymentStatus: ''
  });

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      
      if (options.id) {
        const response = await BookingsService.getBookingById(options.id);
        setBooking(response);
      } else {
        const response = await BookingsService.getBookings(filters);
        setData(response.data);
        setMeta(response.meta);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [filters, options.id]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const changePage = (page: number) => setFilters(prev => ({ ...prev, page }));
  const updateFilters = (newFilters: Partial<GetBookingsFilters>) => setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));

  return {
    data,
    booking,
    meta,
    isLoading,
    isError,
    filters,
    changePage,
    updateFilters,
    refresh: fetchBookings,
    permissions: {
      canCancel: true,
      canTransfer: true,
      canVerifyQr: true
    }
  };
}

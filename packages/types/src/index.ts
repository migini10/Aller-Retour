import { User, Vehicle, Trip, Booking } from '@aller-retour/database';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TripSearchFilter {
  originCity: string;
  destinationCity: string;
  date: string;
  passengers?: number;
}

export interface CreateBookingDto {
  tripId: string;
  seatNumber: number;
  paymentMethod: 'WAVE' | 'ORANGE_MONEY' | 'FREE_MONEY' | 'MTN_MOMO' | 'WALLET' | 'CASH';
  phone: string;
}

export interface PayoutRequestDto {
  walletId: string;
  amount: number;
  destinationPhone: string;
}

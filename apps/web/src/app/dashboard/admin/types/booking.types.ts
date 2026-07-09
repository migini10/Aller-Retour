export type BookingStatus = 'PENDING_PAYMENT' | 'CONFIRMED' | 'BOARDED' | 'CANCELLED';
export type PaymentMethod = 'WAVE' | 'ORANGE_MONEY' | 'FREE_MONEY' | 'MTN_MOMO' | 'CASH';

export interface BookingPassenger {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
}

export interface BookingTrip {
  id: string;
  departureCity?: string;
  arrivalCity?: string;
  departureTime: string;
  pricePerSeat: number;
  route?: {
    id: string;
    originStation?: { name: string; city: string };
    destinationStation?: { name: string; city: string };
  };
  vehicle?: {
    id: string;
    brand: string;
    model: string;
    plateNumber: string;
    capacity: number;
  };
  driver?: {
    id: string;
    user?: BookingPassenger;
  };
}

export interface Booking {
  id: string;
  userId: string;
  tripId: string;
  seatNumber: number;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  basePrice: number;
  clientFee: number;
  amountPaid: number;
  qrCodeToken: string | null;
  boardedAt: string | null;
  hiddenByUser: boolean;
  createdAt: string;
  updatedAt: string;
  
  user?: BookingPassenger;
  trip?: BookingTrip;
}

export interface GetBookingsFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: BookingStatus | '';
  paymentStatus?: PaymentMethod | '';
  tripId?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface GetBookingsResponse {
  data: Booking[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BookingStatusResponse {
  success: boolean;
  status: BookingStatus;
  qrCodeToken: string | null;
}

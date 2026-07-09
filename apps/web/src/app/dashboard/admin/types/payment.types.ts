export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
export type PaymentMethod = 'WAVE' | 'ORANGE_MONEY';

export interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  providerRef?: string | null;
  rawPayload?: any;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  bookingId?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  booking?: {
    id: string;
    tripId: string;
    seatNumber: number;
  };
}

export interface GetPaymentsFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: PaymentStatus | '';
  method?: PaymentMethod | '';
  date?: string;
  userId?: string;
  bookingId?: string;
}

export interface GetPaymentsResponse {
  data: PaymentTransaction[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaymentSummary {
  totalAmount: number;
  successCount: number;
  failedCount: number;
  pendingCount: number;
}

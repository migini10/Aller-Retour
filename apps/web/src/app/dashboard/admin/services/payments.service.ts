import { ApiClient } from '@/lib/api.client';
import { GetPaymentsFilters, GetPaymentsResponse, PaymentTransaction, PaymentSummary } from '../types/payment.types';

export class PaymentsService {
  static async getTransactions(filters: GetPaymentsFilters): Promise<GetPaymentsResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.method) params.append('method', filters.method);
    if (filters.date) params.append('date', filters.date);
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.bookingId) params.append('bookingId', filters.bookingId);

    const queryString = params.toString();
    const url = `/payment-transactions${queryString ? `?${queryString}` : ''}`;
    
    return ApiClient.get<GetPaymentsResponse>(url);
  }

  static async getSummary(): Promise<PaymentSummary> {
    return ApiClient.get<PaymentSummary>('/payment-transactions/summary');
  }

  static async getTransactionById(id: string): Promise<PaymentTransaction> {
    return ApiClient.get<PaymentTransaction>(`/payment-transactions/${id}`);
  }
}

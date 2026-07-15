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
    const url = `/v1/payment-transactions${queryString ? `?${queryString}` : ''}`;
    
    const response = await ApiClient.get<any>(url);
    if (Array.isArray(response)) {
      return {
        data: response,
        meta: { total: response.length, page: filters.page || 1, limit: filters.limit || 10, totalPages: 1 }
      };
    }
    return response || { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 1 } };
  }

  static async getSummary(): Promise<PaymentSummary> {
    const res = await ApiClient.get<any>('/v1/payment-transactions/summary');
    return {
      totalAmount: res?.totalCollectedAmount || 0,
      successCount: res?.totalSuccess || 0,
      failedCount: res?.totalFailed || 0,
      pendingCount: res?.totalPending || 0,
    };
  }

  static async getTransactionById(id: string): Promise<PaymentTransaction> {
    return ApiClient.get<PaymentTransaction>(`/v1/payment-transactions/${id}`);
  }
}

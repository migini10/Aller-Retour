import { useState, useEffect, useCallback } from 'react';
import { PaymentsService } from '../services/payments.service';
import { GetPaymentsFilters, PaymentTransaction, PaymentSummary } from '../types/payment.types';

interface UsePaymentsOptions {
  id?: string;
  initialFilters?: GetPaymentsFilters;
}

export function usePayments(options: UsePaymentsOptions = {}) {
  const [data, setData] = useState<PaymentTransaction[]>([]);
  const [transaction, setTransaction] = useState<PaymentTransaction | null>(null);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  const [filters, setFilters] = useState<GetPaymentsFilters>(options.initialFilters || {
    page: 1,
    limit: 10,
    search: '',
    status: '',
    method: ''
  });

  const fetchPayments = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      
      if (options.id) {
        const response = await PaymentsService.getTransactionById(options.id);
        setTransaction(response);
      } else {
        const [transactionsResponse, summaryResponse] = await Promise.all([
          PaymentsService.getTransactions(filters),
          PaymentsService.getSummary()
        ]);
        
        setData(transactionsResponse.data);
        setMeta(transactionsResponse.meta);
        setSummary(summaryResponse);
      }
    } catch (err) {
      console.error('Failed to fetch payments:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [filters, options.id]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const changePage = (page: number) => setFilters(prev => ({ ...prev, page }));
  const updateFilters = (newFilters: Partial<GetPaymentsFilters>) => setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));

  return {
    data,
    transaction,
    summary,
    meta,
    isLoading,
    isError,
    filters,
    changePage,
    updateFilters,
    refresh: fetchPayments
  };
}

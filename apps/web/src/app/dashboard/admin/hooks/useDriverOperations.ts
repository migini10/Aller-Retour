import { useState, useEffect, useCallback } from 'react';
import { DriverOperationsService } from '../services/driver-operations.service';
import { DriverEarning, DriverEarningSummary, GetEarningsFilters } from '../types/driver-earning.types';

interface UseDriverOperationsOptions {
  initialFilters?: GetEarningsFilters;
}

export function useDriverOperations(options: UseDriverOperationsOptions = {}) {
  const [data, setData] = useState<DriverEarning[]>([]);
  const [summary, setSummary] = useState<DriverEarningSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  const [filters, setFilters] = useState<GetEarningsFilters>(options.initialFilters || {
    status: '',
  });

  const fetchOperations = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      
      const [earningsResponse, summaryResponse] = await Promise.all([
        DriverOperationsService.getEarnings(filters),
        DriverOperationsService.getSummary()
      ]);
      
      setData(earningsResponse);
      setSummary(summaryResponse);
    } catch (err) {
      console.error('Failed to fetch driver operations:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOperations();
  }, [fetchOperations]);

  const updateFilters = (newFilters: Partial<GetEarningsFilters>) => setFilters(prev => ({ ...prev, ...newFilters }));

  const markAsPaid = async (id: string, payoutRef: string) => {
    await DriverOperationsService.markAsPaid(id, payoutRef);
    await fetchOperations(); // Refresh the list
  };

  return {
    data,
    summary,
    isLoading,
    isError,
    filters,
    updateFilters,
    refresh: fetchOperations,
    markAsPaid
  };
}

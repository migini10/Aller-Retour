import { useState, useEffect } from 'react';
import { DashboardService, DashboardSummary } from '../services/dashboard.service';

export function useDashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const summary = await DashboardService.getSummary();
        setData(summary);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return {
    data,
    isLoading,
    isError
  };
}

import { useState, useCallback, useEffect } from 'react';
import { MonitoringService } from '../services/monitoring.service';
import { SystemHealth, MonitoringAlerts } from '../types/monitoring.types';

export function useMonitoring() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [alerts, setAlerts] = useState<MonitoringAlerts | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchMonitoringData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [healthData, alertsData] = await Promise.all([
        MonitoringService.getHealth(),
        MonitoringService.getAlerts()
      ]);
      setHealth(healthData);
      setAlerts(alertsData);
    } catch (err: any) {
      setError(err);
      console.error('Error fetching monitoring data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch immediately on mount
  useEffect(() => {
    fetchMonitoringData();
  }, [fetchMonitoringData]);

  return {
    health,
    alerts,
    isLoading,
    error,
    refresh: fetchMonitoringData
  };
}

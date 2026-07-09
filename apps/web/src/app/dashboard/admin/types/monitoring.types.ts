export interface SystemHealth {
  apiStatus: string;
  dbStatus: string;
  uptimeSeconds: number;
  uptimeFormatted: string;
  memoryUsedMb: number;
  memoryTotalMb: number;
  version: string;
  environment: string;
  checkedAt: string;
}

export interface AlertItem {
  type: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  reference: string;
  occurredAt: string;
}

export interface AlertsSummary {
  failedPayments7d: number;
  failedNotifications7d: number;
  pendingDriverEarnings: number;
}

export interface MonitoringAlerts {
  summary: AlertsSummary;
  items: AlertItem[];
}

export interface SystemSettings {
  platformName: string;
  supportEmail: string;
  supportPhone: string;
  defaultCurrency: string;
  clientCommissionRate: number;
  driverCommissionRate: number;
  maintenanceMode: boolean;
}

export interface UpdateSettingsPayload {
  platformName?: string;
  supportEmail?: string;
  supportPhone?: string;
  defaultCurrency?: string;
  clientCommissionRate?: number;
  driverCommissionRate?: number;
  maintenanceMode?: boolean;
}

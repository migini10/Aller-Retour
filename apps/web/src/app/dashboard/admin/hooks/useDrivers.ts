'use client';

import { useState, useEffect, useCallback } from 'react';
import { DriverProfile, DriverPermissions } from '../types/driver.types';
import { DriversService } from '../services/drivers.service';

interface UseDriversOptions {
  id?: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  kycStatus?: string;
  type?: string;
  managerId?: string;
}

export function useDrivers(options: UseDriversOptions = {}) {
  const { id, page = 1, limit = 10, search, status, kycStatus, type, managerId } = options;
  const [drivers, setDrivers] = useState<DriverProfile[]>([]);
  const [driver, setDriver] = useState<DriverProfile | null>(null);
  const [meta, setMeta] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      if (id) {
        const data = await DriversService.getDriverById(id);
        setDriver(data);
      } else {
        const response = await DriversService.getDrivers({ page, limit, search, status, kycStatus, type, managerId });
        setDrivers(response.data);
        setMeta(response.meta);
      }
    } catch (err) {
      console.error('Failed to fetch drivers:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [id, page, limit, search, status, kycStatus, type, managerId]);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      fetchData();
    }
    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  const refresh = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  // Frontend Permissions simulation
  const permissions: DriverPermissions = {
    canViewDriver: true,
    canEditKyc: true,
    canManageVehicles: true,
  };

  return {
    drivers,
    driver,
    meta,
    isLoading,
    isError,
    permissions,
    refresh,
  };
}

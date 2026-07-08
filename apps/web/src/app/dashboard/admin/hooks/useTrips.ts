'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trip, TripPermissions } from '../types/trip.types';
import { TripsService } from '../services/trips.service';

interface UseTripsOptions {
  id?: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  date?: string;
}

export function useTrips(options: UseTripsOptions = {}) {
  const { id, page = 1, limit = 10, search, status, date } = options;
  const [trips, setTrips] = useState<Trip[]>([]);
  // We can't fetch a single trip with GET /v1/trips/{id} directly according to API list, 
  // but GET /v1/trips/{id}/manifest acts as our detail view source.
  const [manifest, setManifest] = useState<any>(null);
  
  const [meta, setMeta] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      if (id) {
        const manifestData = await TripsService.getTripManifest(id);
        setManifest(manifestData);
      } else {
        const response = await TripsService.searchTrips({ page, limit, search, status, date });
        setTrips(response.data);
        setMeta(response.meta);
      }
    } catch (err) {
      console.error('Failed to fetch trips:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [id, page, limit, search, status, date]);

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

  const permissions: TripPermissions = {
    canViewTrip: true,
    canEditTrip: true,
    canDeleteTrip: true,
    canLockTrip: true,
    canManageBookings: true,
  };

  return {
    trips,
    manifest,
    meta,
    isLoading,
    isError,
    permissions,
    refresh,
  };
}

import { useState, useCallback, useEffect } from 'react';
import { NotificationsService } from '../services/notifications.service';
import { GetNotificationsFilters, AppNotification } from '../types/notification.types';

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchNotifications = useCallback(async (filters: GetNotificationsFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await NotificationsService.getNotifications(filters);
      setNotifications(response.items);
      setTotalPages(response.meta.totalPages);
      setTotalItems(response.meta.total);
    } catch (err: any) {
      setError(err);
      alert(err.message || 'Erreur lors du chargement des notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    notifications,
    isLoading,
    error,
    totalPages,
    totalItems,
    fetchNotifications
  };
}

'use client';

import { useState, useEffect } from 'react';

export type Permission = 
  | 'view_users' | 'manage_users'
  | 'view_drivers' | 'manage_drivers'
  | 'view_trips' | 'manage_trips'
  | 'view_bookings' | 'manage_bookings'
  | 'view_payments' | 'manage_payments'
  | 'view_reviews' | 'manage_reviews'
  | 'view_notifications' | 'manage_notifications'
  | 'view_analytics'
  | 'view_monitoring'
  | 'manage_settings';

/**
 * Hook stub pour la gestion des permissions frontend (sans logique métier connectée).
 * Ce hook simule un super-administrateur qui a toutes les permissions par défaut.
 * Prêt à être connecté à l'API/Backend dans un futur sprint.
 */
import { useAuth } from '@/components/AuthContext';

export function usePermissions() {
  const { user, isAuthenticated } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setPermissions([]);
      setIsLoading(false);
      return;
    }

    const userRole = String(user.role || '').toUpperCase().trim();

    if (userRole === 'SUPER_ADMIN' || userRole === 'SUPERADMIN' || userRole === 'ADMIN') {
      setPermissions([
        'view_users', 'manage_users',
        'view_drivers', 'manage_drivers',
        'view_trips', 'manage_trips',
        'view_bookings', 'manage_bookings',
        'view_payments', 'manage_payments',
        'view_reviews', 'manage_reviews',
        'view_notifications', 'manage_notifications',
        'view_analytics',
        'view_monitoring',
        'manage_settings'
      ]);
    } else {
      setPermissions([]);
    }
    
    setIsLoading(false);
  }, [user, isAuthenticated]);

  const hasPermission = (permission: Permission) => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (requiredPermissions: Permission[]) => {
    return requiredPermissions.some((p) => permissions.includes(p));
  };

  const hasAllPermissions = (requiredPermissions: Permission[]) => {
    return requiredPermissions.every((p) => permissions.includes(p));
  };

  return {
    permissions,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}

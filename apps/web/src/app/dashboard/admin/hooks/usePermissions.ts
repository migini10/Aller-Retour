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
export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch user permissions from backend or JWT token
    // Simulation: un Super Admin avec toutes les permissions accordées
    const mockSuperAdminPermissions: Permission[] = [
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
    ];
    
    setPermissions(mockSuperAdminPermissions);
    setIsLoading(false);
  }, []);

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

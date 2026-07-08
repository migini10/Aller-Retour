'use client';

import React from 'react';
import { AdminFilters } from '../../components/forms/AdminFilters';

interface UserFiltersProps {
  filters?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
}

export function UserFilters({ filters, onFilterChange }: UserFiltersProps) {
  return (
    <AdminFilters 
      activeFilters={filters}
      onFilterChange={onFilterChange}
      groups={[
        { id: 'role', label: 'Rôle', options: [{ label: 'Client', value: 'CLIENT' }, { label: 'Chauffeur', value: 'DRIVER' }] },
        { id: 'status', label: 'Statut', options: [{ label: 'Actif', value: 'ACTIVE' }, { label: 'En attente', value: 'PENDING' }, { label: 'Suspendu', value: 'SUSPENDED' }, { label: 'Banni', value: 'BANNED' }] }
      ]}
    />
  );
}
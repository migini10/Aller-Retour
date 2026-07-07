
'use client';

import React from 'react';
import { AdminFilters } from '../../components/forms/AdminFilters';

export function UserFilters() {
  return (
    <AdminFilters 
      groups={[
        { id: 'role', label: 'Rôle', options: [{ label: 'Client', value: 'CLIENT' }, { label: 'Chauffeur', value: 'DRIVER' }] },
        { id: 'status', label: 'Statut', options: [{ label: 'Actif', value: 'ACTIVE' }, { label: 'En attente', value: 'PENDING' }, { label: 'Suspendu', value: 'SUSPENDED' }] }
      ]}
    />
  );
}

'use client';

import React from 'react';
import { Users, UserPlus, CarFront, ShieldBan } from 'lucide-react';
import { DashboardStatCard } from '../../components/dashboard/DashboardStatCard';

export function UserStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <DashboardStatCard title="Total Utilisateurs" value="12,450" icon={Users} trend={{ value: 12.5, isPositive: true }} />
      <DashboardStatCard title="Nouveaux (Ce mois)" value="840" icon={UserPlus} trend={{ value: 5.2, isPositive: true }} />
      <DashboardStatCard title="Chauffeurs vérifiés" value="1,204" icon={CarFront} trend={{ value: 2.1, isPositive: true }} />
      <DashboardStatCard title="Comptes suspendus" value="45" icon={ShieldBan} trend={{ value: 1.5, isPositive: false }} />
    </div>
  );
}
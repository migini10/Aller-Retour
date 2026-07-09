'use client';

import React from 'react';
import { Users, UserPlus, CarFront } from 'lucide-react';
import { DashboardStatCard } from '../../components/dashboard/DashboardStatCard';
import { useDashboard } from '../../hooks/useDashboard';

export function UserStats() {
  const { data, isLoading } = useDashboard();
  const analytics = data?.analytics;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <DashboardStatCard 
        title="Total Utilisateurs" 
        value={isLoading ? '...' : (analytics?.kpis.totalUsers || 0)} 
        icon={Users} 
      />
      <DashboardStatCard 
        title="Nouveaux (Aujourd'hui)" 
        value={isLoading ? '...' : (analytics?.kpis.newUsersToday || 0)} 
        icon={UserPlus} 
      />
      <DashboardStatCard 
        title="Chauffeurs actifs" 
        value={isLoading ? '...' : (analytics?.kpis.activeDrivers || 0)} 
        icon={CarFront} 
      />
    </div>
  );
}
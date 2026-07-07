
'use client';

import React from 'react';
import { User, UserRole } from '../../types/user.types';
import { DashboardChartCard } from '../../components/dashboard/DashboardChartCard';

export function UserStatistics({ user }: { user: User }) {
  // Mock Data
  const data = Array.from({ length: 7 }).map((_, i) => ({
    name: `J-${6-i}`,
    gains: Math.floor(Math.random() * 20000),
    depenses: Math.floor(Math.random() * 10000),
  }));

  const isDriver = user.role === UserRole.DRIVER;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-[#141414] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Réservations</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{user.stats.totalBookings}</p>
        </div>
        <div className="p-5 bg-white dark:bg-[#141414] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Trajets publiés</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{user.stats.totalTrips}</p>
        </div>
        <div className="p-5 bg-white dark:bg-[#141414] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">Annulations</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{user.stats.totalCancellations}</p>
        </div>
        <div className="p-5 bg-white dark:bg-[#141414] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-1">{isDriver ? 'Gains générés' : 'Total Dépensé'}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {isDriver ? user.stats.totalEarned.toLocaleString() : user.stats.totalSpent.toLocaleString()} <span className="text-sm">FCFA</span>
          </p>
        </div>
      </div>

      <DashboardChartCard
        title={isDriver ? 'Évolution des gains' : 'Évolution des dépenses'}
        subtitle="Sur les 7 derniers jours"
        type="bar"
        data={data}
        xAxisKey="name"
        dataKeys={[{ key: isDriver ? 'gains' : 'depenses', name: isDriver ? 'Gains (FCFA)' : 'Dépenses (FCFA)', color: isDriver ? '#10b981' : '#3b82f6' }]}
        height={300}
      />
    </div>
  );
}
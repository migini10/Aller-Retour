
'use client';

import React from 'react';
import { User, UserRole } from '../../types/user.types';
import { DashboardChartCard } from '../../components/dashboard/DashboardChartCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { BarChart3 } from 'lucide-react';

export function UserStatistics({ user }: { user: User }) {
  // Les graphiques ont été masqués en attente d'une vraie API (cf. Audit)

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

      <div className="mt-8">
        <EmptyState
          icon={BarChart3}
          title={isDriver ? 'Évolution des gains' : 'Évolution des dépenses'}
          description="Les graphiques financiers seront bientôt disponibles avec de vraies données."
        />
      </div>
    </div>
  );
}
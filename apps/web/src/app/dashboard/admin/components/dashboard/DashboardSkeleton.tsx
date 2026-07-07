'use client';

import React from 'react';

export function DashboardSkeleton() {
  return (
    <div className="w-full animate-pulse space-y-6">
      {/* Top Row: Actions Rapides & Alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-200 dark:bg-slate-800/50 rounded-2xl h-24 border border-slate-200 dark:border-slate-800"></div>
        <div className="bg-slate-200 dark:bg-slate-800/50 rounded-2xl h-24 border border-slate-200 dark:border-slate-800"></div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-slate-200 dark:bg-slate-800/50 rounded-2xl h-32 border border-slate-200 dark:border-slate-800"></div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-200 dark:bg-slate-800/50 rounded-2xl h-80 border border-slate-200 dark:border-slate-800"></div>
        <div className="bg-slate-200 dark:bg-slate-800/50 rounded-2xl h-80 border border-slate-200 dark:border-slate-800"></div>
      </div>

      {/* Map & Leaderboard Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-200 dark:bg-slate-800/50 rounded-2xl h-96 border border-slate-200 dark:border-slate-800"></div>
        <div className="bg-slate-200 dark:bg-slate-800/50 rounded-2xl h-96 border border-slate-200 dark:border-slate-800"></div>
      </div>

      {/* Table & Timeline Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-200 dark:bg-slate-800/50 rounded-2xl h-[400px] border border-slate-200 dark:border-slate-800"></div>
        <div className="bg-slate-200 dark:bg-slate-800/50 rounded-2xl h-[400px] border border-slate-200 dark:border-slate-800"></div>
      </div>
    </div>
  );
}


'use client';

import React from 'react';
import { User, UserRole } from '../../types/user.types';
import { ShieldCheck, ShieldAlert, Star } from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';

export function UserSummaryCard({ user }: { user: User }) {
  return (
    <div className="bg-white dark:bg-[#141414] rounded-2xl p-6 border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-3xl font-bold text-slate-600 dark:text-slate-400 shrink-0 border-4 border-white dark:border-[#141414] shadow-md">
        {user.firstName[0]}{user.lastName[0]}
      </div>
      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
            {user.firstName} {user.lastName}
            {user.badges?.includes('VERIFIED') && <ShieldCheck className="w-5 h-5 text-blue-500" />}
            {user.badges?.includes('REPORTED') && <ShieldAlert className="w-5 h-5 text-rose-500" />}
          </h2>
          <div className="flex justify-center sm:justify-start gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${user.role === UserRole.DRIVER ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
              {user.role === UserRole.DRIVER ? 'Chauffeur' : 'Client'}
            </span>
            <StatusBadge label={user.status} variant={user.status === 'ACTIVE' ? 'success' : user.status === 'PENDING' ? 'warning' : 'error'} />
          </div>
        </div>
        <div className="text-slate-500 dark:text-slate-400 text-sm mb-4 space-y-1">
          <p>{user.email} • {user.phone}</p>
          <p>Inscrit le {new Date(user.createdAt).toLocaleDateString()} • Dernier login: {new Date(user.lastLoginAt).toLocaleString()}</p>
        </div>
        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
          {user.badges.filter(b => b !== 'VERIFIED' && b !== 'REPORTED').map(badge => (
            <span key={badge} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-semibold">
              {badge}
            </span>
          ))}
          {user.stats.averageRating > 0 && (
            <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-current" />
              {user.stats.averageRating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
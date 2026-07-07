
'use client';

import React from 'react';
import { EmptyState } from '../../components/ui/EmptyState';

export function UserTrips() {
  return (
    <div className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm p-8">
      <EmptyState title="Trajets" description="Ce tableau sera connecté à la base de données prochainement." />
    </div>
  );
}
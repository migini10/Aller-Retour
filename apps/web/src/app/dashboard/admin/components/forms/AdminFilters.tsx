'use client';

import React from 'react';
import { Filter } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
}

interface AdminFiltersProps {
  groups: FilterGroup[];
  activeFilters?: Record<string, string>;
  onFilterChange?: (groupId: string, value: string) => void;
}

export function AdminFilters({ groups, activeFilters, onFilterChange }: AdminFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm font-medium mr-2">
        <Filter className="w-4 h-4 mr-1.5" />
        Filtres
      </div>
      
      {groups.map((group) => (
        <select
          key={group.id}
          className="block w-full sm:w-auto pl-3 pr-10 py-1.5 text-sm border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-[#1A1A1A] text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-colors cursor-pointer appearance-none"
          value={activeFilters?.[group.id] || ''}
          onChange={(e) => onFilterChange?.(group.id, e.target.value)}
        >
          <option value="">{group.label}</option>
          {group.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
}

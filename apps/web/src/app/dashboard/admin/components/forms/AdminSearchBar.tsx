'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface AdminSearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
}

export function AdminSearchBar({ placeholder = 'Rechercher...', value, onChange }: AdminSearchBarProps) {
  return (
    <div className="relative w-full max-w-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-slate-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg leading-5 bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 sm:text-sm transition-colors"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}

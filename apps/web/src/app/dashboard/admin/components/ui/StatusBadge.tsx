import React from 'react';

export type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  className?: string;
}

export function StatusBadge({ label, variant = 'default', className = '' }: StatusBadgeProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
      case 'warning':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
      case 'error':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20';
      case 'info':
        return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getVariantClasses()} ${className}`}>
      {label}
    </span>
  );
}

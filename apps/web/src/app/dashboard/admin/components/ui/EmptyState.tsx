import React from 'react';
import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ 
  title = 'Aucune donnée', 
  description = 'Il n\'y a aucune donnée à afficher pour le moment.', 
  icon = <FileQuestion className="h-12 w-12" />, 
  action 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center min-h-[400px] bg-slate-50 dark:bg-slate-900/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
      <div className="text-slate-400 dark:text-slate-500 mb-4 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-full">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

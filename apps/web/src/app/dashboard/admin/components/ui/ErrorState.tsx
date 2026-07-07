import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  title = 'Une erreur est survenue', 
  message = 'Nous n\'avons pas pu charger ces données. Veuillez réessayer.',
  onRetry
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center min-h-[400px] bg-rose-50/50 dark:bg-rose-950/20 border border-dashed border-rose-200 dark:border-rose-900/50 rounded-2xl">
      <div className="text-rose-500 mb-4 bg-rose-100 dark:bg-rose-900/30 p-4 rounded-full">
        <AlertOctagon className="h-10 w-10" />
      </div>
      <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-200 mb-2">{title}</h3>
      <p className="text-sm text-rose-600/80 dark:text-rose-400/80 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Réessayer
        </button>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface AlertItem {
  id: string;
  type: AlertType;
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface DashboardAlertsProps {
  alerts: AlertItem[];
  onDismiss?: (id: string) => void;
  title?: string;
  delay?: number;
}

export function DashboardAlerts({ alerts, onDismiss, title = 'Alertes système', delay = 0 }: DashboardAlertsProps) {
  
  const getAlertConfig = (type: AlertType) => {
    switch (type) {
      case 'info':
        return { icon: Info, bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-500/20', text: 'text-blue-800 dark:text-blue-300', iconColor: 'text-blue-500' };
      case 'success':
        return { icon: CheckCircle2, bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20', text: 'text-emerald-800 dark:text-emerald-300', iconColor: 'text-emerald-500' };
      case 'warning':
        return { icon: AlertTriangle, bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20', text: 'text-amber-800 dark:text-amber-300', iconColor: 'text-amber-500' };
      case 'error':
        return { icon: AlertCircle, bg: 'bg-rose-50 dark:bg-rose-500/10', border: 'border-rose-200 dark:border-rose-500/20', text: 'text-rose-800 dark:text-rose-300', iconColor: 'text-rose-500' };
    }
  };

  if (alerts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col w-full overflow-hidden"
    >
      <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          {title}
          <span className="bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 text-xs font-bold px-2 py-0.5 rounded-full">
            {alerts.length}
          </span>
        </h3>
      </div>
      
      <div className="p-4 sm:p-6 space-y-4">
        <AnimatePresence>
          {alerts.map((alert) => {
            const config = getAlertConfig(alert.type);
            const Icon = config.icon;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 p-4 rounded-xl border ${config.bg} ${config.border} relative group`}
              >
                <div className="shrink-0 mt-0.5">
                  <Icon className={`w-5 h-5 ${config.iconColor}`} />
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm font-semibold ${config.text}`}>{alert.title}</h4>
                  {alert.message && (
                    <p className={`text-sm mt-1 opacity-90 ${config.text}`}>{alert.message}</p>
                  )}
                  {alert.action && (
                    <button 
                      onClick={alert.action.onClick}
                      className={`mt-3 text-sm font-bold underline decoration-2 underline-offset-2 ${config.text} hover:opacity-80 transition-opacity`}
                    >
                      {alert.action.label}
                    </button>
                  )}
                </div>
                {onDismiss && (
                  <button 
                    onClick={() => onDismiss(alert.id)}
                    className={`absolute top-4 right-4 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/5 dark:hover:bg-white/10 ${config.text}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

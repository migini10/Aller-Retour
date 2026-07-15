'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Route, TicketCheck, Wallet, BellRing, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface QuickAction {
  id: string;
  label: string;
  icon: any;
  onClick?: () => void;
  colorClass: string;
  bgClass: string;
  disabled?: boolean;
}

export function DashboardQuickActions({ delay = 0 }: { delay?: number }) {
  const router = useRouter();

  const actions: QuickAction[] = [
    { id: 'add_driver', label: 'Ajouter un chauffeur', icon: UserPlus, colorClass: 'text-orange-500', bgClass: 'bg-orange-50 dark:bg-orange-500/10', disabled: true },
    { id: 'create_trip', label: 'Créer un trajet', icon: Route, colorClass: 'text-emerald-500', bgClass: 'bg-emerald-50 dark:bg-emerald-500/10', disabled: true },
    { id: 'view_bookings', label: 'Voir réservations', icon: TicketCheck, onClick: () => router.push('/dashboard/admin/bookings'), colorClass: 'text-blue-500', bgClass: 'bg-blue-50 dark:bg-blue-500/10' },
    { id: 'view_payments', label: 'Voir paiements', icon: Wallet, onClick: () => router.push('/dashboard/admin/payments'), colorClass: 'text-purple-500', bgClass: 'bg-purple-50 dark:bg-purple-500/10' },
    { id: 'send_notification', label: 'Envoyer notification', icon: BellRing, onClick: () => router.push('/dashboard/admin/notifications'), colorClass: 'text-rose-500', bgClass: 'bg-rose-50 dark:bg-rose-500/10' },
    { id: 'export_bookings', label: 'Exporter données', icon: Download, colorClass: 'text-slate-500', bgClass: 'bg-slate-50 dark:bg-slate-500/10', disabled: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white dark:bg-[#141414] rounded-2xl p-6 border border-slate-200 dark:border-slate-800/80 shadow-sm w-full"
    >
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Actions Rapides</h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              whileHover={action.disabled ? {} : { scale: 1.03 }}
              whileTap={action.disabled ? {} : { scale: 0.97 }}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 dark:border-[#2A2A2A] bg-slate-50/50 dark:bg-[#1A1A1A]/50 transition-all group relative ${
                action.disabled 
                  ? 'opacity-60 cursor-not-allowed grayscale-[30%]' 
                  : 'hover:border-slate-300 dark:hover:border-[#333333] hover:bg-slate-50 dark:hover:bg-[#1A1A1A]'
              }`}
            >
              <div className={`p-3 rounded-xl mb-3 ${action.bgClass} ${!action.disabled && 'group-hover:scale-110'} transition-transform`}>
                <Icon className={`w-5 h-5 ${action.colorClass}`} />
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center leading-tight">
                {action.label}
              </span>
              {action.disabled && (
                <span className="absolute -bottom-2 text-[9px] font-bold bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded shadow-sm">
                  Bientôt
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

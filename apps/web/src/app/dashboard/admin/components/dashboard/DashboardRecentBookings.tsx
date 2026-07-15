'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AdminTable, ColumnDef } from '../tables/AdminTable';
import { StatusBadge } from '../ui/StatusBadge';
import { ChevronRight } from 'lucide-react';

interface RecentBooking {
  id: string;
  passenger: string;
  trip: string;
  paymentMethod: string;
  amount: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  date: string;
}

interface DashboardRecentBookingsProps {
  bookings: RecentBooking[];
  delay?: number;
  onViewDetails?: (id: string) => void;
  onViewAll?: () => void;
}

export function DashboardRecentBookings({ bookings, delay = 0, onViewDetails, onViewAll }: DashboardRecentBookingsProps) {
  
  const columns: ColumnDef<RecentBooking>[] = [
    {
      header: 'Passager',
      accessorKey: 'passenger',
      className: 'font-semibold text-slate-900 dark:text-slate-100',
    },
    {
      header: 'Trajet',
      accessorKey: 'trip',
    },
    {
      header: 'Paiement',
      accessorKey: 'paymentMethod',
    },
    {
      header: 'Montant',
      accessorKey: 'amount',
      className: 'font-bold',
    },
    {
      header: 'Statut',
      cell: (item) => {
        switch (item.status) {
          case 'confirmed':
            return <StatusBadge label="Confirmé" variant="success" />;
          case 'pending':
            return <StatusBadge label="En attente" variant="warning" />;
          case 'cancelled':
            return <StatusBadge label="Annulé" variant="error" />;
          default:
            return <StatusBadge label={item.status} />;
        }
      },
    },
    {
      header: 'Date',
      accessorKey: 'date',
    },
    {
      header: 'Action',
      cell: (item) => (
        <button 
          onClick={() => onViewDetails && onViewDetails(item.id)}
          className="text-orange-600 hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-400 text-sm font-semibold transition-colors"
        >
          Détails
        </button>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col w-full overflow-hidden"
    >
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center bg-white dark:bg-[#141414]">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Dernières réservations</h3>
        <button 
          onClick={onViewAll}
          className="text-sm font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-400 transition-colors flex items-center"
        >
          Voir tout
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      <div className="p-0 border-t-0 [&>div]:border-none [&>div]:shadow-none [&>div]:rounded-none">
        <AdminTable
          data={bookings}
          columns={columns}
          keyExtractor={(item) => item.id}
        />
      </div>
    </motion.div>
  );
}

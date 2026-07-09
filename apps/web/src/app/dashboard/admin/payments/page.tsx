'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminPageContainer } from '../components/shared/AdminPageContainer';
import { AdminPageHeader } from '../components/shared/AdminPageHeader';
import { AdminBreadcrumb } from '../components/layout/AdminBreadcrumb';
import { AdminSearchBar } from '../components/forms/AdminSearchBar';
import { AdminFilters } from '../components/forms/AdminFilters';
import { AdminTable } from '../components/tables/AdminTable';
import { AdminPagination } from '../components/tables/AdminPagination';
import { EmptyState } from '../components/ui/EmptyState';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Eye, User, Ticket, CreditCard, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

import { usePayments } from '../hooks/usePayments';
import { PaymentTransaction } from '../types/payment.types';

export default function PaymentsPage() {
  const router = useRouter();
  const { data, meta, summary, isLoading, isError, filters, updateFilters, changePage } = usePayments();

  const handleSearch = (value: string) => updateFilters({ search: value });
  
  const handleFilterChange = (filterId: string, value: string) => {
    if (filterId === 'status') updateFilters({ status: value as any });
    if (filterId === 'method') updateFilters({ method: value as any });
  };

  const columns = [
    { 
      header: 'Réf', 
      accessorKey: 'id',
      cell: (p: PaymentTransaction) => <span className="font-mono text-xs font-semibold text-slate-500">{p.id.split('-')[0].toUpperCase()}</span>
    },
    { 
      header: 'Montant', 
      accessorKey: 'amount',
      cell: (p: PaymentTransaction) => (
        <span className="font-bold text-slate-900 dark:text-white">{p.amount} {p.currency}</span>
      )
    },
    { 
      header: 'Méthode', 
      accessorKey: 'method',
      cell: (p: PaymentTransaction) => (
        <div className="flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium">{p.method}</span>
        </div>
      )
    },
    { 
      header: 'Utilisateur', 
      accessorKey: 'user',
      cell: (p: PaymentTransaction) => p.user ? (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-white">
              {p.user.firstName} {p.user.lastName}
            </div>
            <div className="text-xs text-slate-500">{p.user.phone}</div>
          </div>
        </div>
      ) : <span className="text-slate-400 text-sm">Non défini</span>
    },
    { 
      header: 'Billet', 
      accessorKey: 'booking',
      cell: (p: PaymentTransaction) => p.booking ? (
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-sm">
          <Ticket className="w-4 h-4" />
          {p.booking.id.split('-')[0].toUpperCase()}
        </div>
      ) : <span className="text-slate-400 text-sm">N/A</span>
    },
    { 
      header: 'Date', 
      accessorKey: 'createdAt',
      cell: (p: PaymentTransaction) => <span className="text-sm">{new Date(p.createdAt).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
    },
    { 
      header: 'Statut', 
      accessorKey: 'status',
      cell: (p: PaymentTransaction) => <StatusBadge label={p.status} />
    },
    { 
      header: 'Actions', 
      accessorKey: 'actions',
      cell: (p: PaymentTransaction) => (
        <button 
          onClick={() => router.push(`/dashboard/admin/payments/${p.id}`)}
          className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition"
          title="Voir les détails"
        >
          <Eye className="w-5 h-5" />
        </button>
      )
    }
  ];

  return (
    <AdminPageContainer>
      <AdminBreadcrumb />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <AdminPageHeader 
          title="Paiements" 
          description="Historique des transactions, paiements chauffeurs et remboursements."
        />
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 px-4 py-2 rounded-lg flex items-center gap-2 mt-4 sm:mt-0 text-sm font-medium">
          <AlertTriangle className="w-4 h-4" />
          Mode Simulation (Données internes)
        </div>
      </div>

      {!isLoading && !isError && summary && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-white dark:bg-[#141414] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-1">
            <span className="text-slate-500 text-sm">Total Traité</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{summary.totalAmount} FCFA</span>
          </div>
          <div className="bg-white dark:bg-[#141414] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-1">
            <span className="text-emerald-600 text-sm font-medium">Succès</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{summary.successCount}</span>
          </div>
          <div className="bg-white dark:bg-[#141414] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-1">
            <span className="text-amber-600 text-sm font-medium">En attente</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{summary.pendingCount}</span>
          </div>
          <div className="bg-white dark:bg-[#141414] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-1">
            <span className="text-rose-600 text-sm font-medium">Échecs/Annulés</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{summary.failedCount}</span>
          </div>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white dark:bg-[#141414] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6"
      >
        <div className="w-full lg:w-96">
          <AdminSearchBar 
            value={filters.search || ''} 
            onChange={handleSearch}
            placeholder="Rechercher (Nom, Réf, Téléphone...)"
          />
        </div>
        <div className="w-full lg:w-auto flex flex-wrap gap-2">
          <AdminFilters 
            groups={[
              { 
                id: 'status', 
                label: 'Statut', 
                options: [
                  { label: 'Tous', value: '' },
                  { label: 'Succès', value: 'SUCCESS' },
                  { label: 'En attente', value: 'PENDING' },
                  { label: 'Échec', value: 'FAILED' },
                  { label: 'Annulé', value: 'CANCELLED' }
                ],
                value: filters.status
              },
              { 
                id: 'method', 
                label: 'Méthode', 
                options: [
                  { label: 'Tous', value: '' },
                  { label: 'Wave', value: 'WAVE' },
                  { label: 'Orange Money', value: 'ORANGE_MONEY' }
                ],
                value: filters.method
              }
            ]}
            onChange={handleFilterChange}
          />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="w-full"
      >
        {isError ? (
          <div className="p-8 text-center bg-rose-50 dark:bg-rose-500/10 rounded-xl border border-rose-200 dark:border-rose-500/20 text-rose-600">
            Erreur lors du chargement des transactions.
          </div>
        ) : (
          <AdminTable
            data={data}
            columns={columns}
            keyExtractor={(p) => p.id}
            isLoading={isLoading}
            emptyState={
              <EmptyState 
                title="Aucune transaction" 
                description="Aucun paiement trouvé pour votre recherche ou les filtres actuels." 
              />
            }
          />
        )}
      </motion.div>

      {!isLoading && !isError && meta.totalPages > 1 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-6"
        >
          <AdminPagination 
            currentPage={meta.page} 
            totalPages={meta.totalPages} 
            onPageChange={changePage} 
          />
        </motion.div>
      )}

    </AdminPageContainer>
  );
}

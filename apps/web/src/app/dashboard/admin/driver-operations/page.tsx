'use client';

import React, { useState } from 'react';
import { AdminPageContainer } from '../components/shared/AdminPageContainer';
import { AdminPageHeader } from '../components/shared/AdminPageHeader';
import { AdminBreadcrumb } from '../components/layout/AdminBreadcrumb';
import { AdminFilters } from '../components/forms/AdminFilters';
import { AdminTable } from '../components/tables/AdminTable';
import { AdminPagination } from '../components/tables/AdminPagination';
import { EmptyState } from '../components/ui/EmptyState';
import { StatusBadge } from '../components/ui/StatusBadge';
import { User, CheckCircle, CreditCard, Ticket, Clock, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useDriverOperations } from '../hooks/useDriverOperations';
import { DriverEarning } from '../types/driver-earning.types';

function PayoutModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  earning 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: (payoutRef: string) => Promise<void>;
  earning: DriverEarning | null;
}) {
  const [payoutRef, setPayoutRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !earning) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutRef.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onConfirm(payoutRef);
      setPayoutRef('');
      onClose();
    } catch (err: any) {
      alert(err.message || "Erreur lors de la validation du paiement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-[#141414] rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-200 dark:border-slate-800"
        >
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Valider le paiement</h3>
          <p className="text-slate-500 text-sm mb-6">
            Vous êtes sur le point de marquer le gain du propriétaire 
            <span className="font-semibold text-slate-700 dark:text-slate-300"> {earning.driver?.fullName} </span>
            comme payé pour un montant de <span className="font-bold text-emerald-600">{earning.driverCut} FCFA</span>.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Référence de transfert (ex: ID Wave / OM)
              </label>
              <input 
                type="text" 
                value={payoutRef}
                onChange={(e) => setPayoutRef(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                placeholder="TRX-123456..."
              />
            </div>
            
            <div className="flex gap-3 justify-end mt-4">
              <button 
                type="button" 
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting || !payoutRef.trim()}
                className="px-4 py-2 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition disabled:opacity-50"
              >
                {isSubmitting ? 'Validation...' : 'Confirmer le paiement'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function DriverOperationsPage() {
  const { data, meta, summary, isLoading, isError, filters, updateFilters, markAsPaid } = useDriverOperations();
  const [selectedEarning, setSelectedEarning] = useState<DriverEarning | null>(null);

  const handleFilterChange = (filterId: string, value: string) => {
    if (filterId === 'status') updateFilters({ status: value as any, page: 1 });
  };

  const columns = [
    { 
      header: 'Propriétaire (Bénéficiaire)', 
      accessorKey: 'driver',
      cell: (e: DriverEarning) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
              {e.driver?.fullName || 'Inconnu'}
            </div>
            <div className="text-xs text-slate-500">{e.driver?.phone || 'N/A'}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Trajet & Billet', 
      accessorKey: 'booking',
      cell: (e: DriverEarning) => (
        <div className="flex flex-col gap-1">
          <div className="font-medium text-slate-900 dark:text-white text-sm">
            {e.booking?.trip?.route?.originStation?.city || 'Origine'} ➔ {e.booking?.trip?.route?.destinationStation?.city || 'Dest'}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="flex items-center gap-1"><Ticket className="w-3 h-3" /> Siège {e.booking?.seatNumber}</span>
            <span>|</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(e.createdAt).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
      )
    },
    { 
      header: 'Revenu Net', 
      accessorKey: 'driverCut',
      cell: (e: DriverEarning) => (
        <div className="flex flex-col">
          <span className="font-bold text-emerald-600">{e.driverCut} FCFA</span>
          <span className="text-xs text-slate-500">Com. plat: {e.platformCommission} FCFA</span>
        </div>
      )
    },
    { 
      header: 'Statut', 
      accessorKey: 'status',
      cell: (e: DriverEarning) => (
        <div className="flex flex-col items-start gap-1">
          <StatusBadge label={e.status} />
          {e.status === 'PAID' && e.payoutRef && (
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              {e.payoutRef}
            </span>
          )}
        </div>
      )
    },
    { 
      header: 'Actions', 
      accessorKey: 'actions',
      cell: (e: DriverEarning) => e.status === 'PENDING' ? (
        <button 
          onClick={() => setSelectedEarning(e)}
          className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 rounded-md transition border border-emerald-200 dark:border-emerald-500/20 whitespace-nowrap"
        >
          Marquer payé
        </button>
      ) : <span className="text-xs text-slate-400 px-3 py-1.5">—</span>
    }
  ];

  return (
    <AdminPageContainer>
      <AdminBreadcrumb />
      
      <AdminPageHeader 
        title="Opérations et Rémunérations" 
        description="Gestion des reversements de gains aux propriétaires de véhicules."
      />

      {!isLoading && !isError && summary && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-white dark:bg-[#141414] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <CreditCard className="w-16 h-16" />
            </div>
            <span className="text-slate-500 text-sm font-medium">Gains Nets Générés</span>
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{summary.totalDriverNet} FCFA</span>
          </div>
          <div className="bg-white dark:bg-[#141414] p-5 rounded-xl border border-emerald-200 dark:border-emerald-500/30 shadow-sm flex flex-col gap-1 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
              <CheckCircle className="w-16 h-16 text-emerald-500" />
            </div>
            <span className="text-emerald-600 text-sm font-medium">Total Payé (Aux Proprios)</span>
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{summary.totalPaid} FCFA</span>
          </div>
          <div className="bg-white dark:bg-[#141414] p-5 rounded-xl border border-amber-200 dark:border-amber-500/30 shadow-sm flex flex-col gap-1 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
              <Clock className="w-16 h-16 text-amber-500" />
            </div>
            <span className="text-amber-600 text-sm font-medium">En Attente de Paiement</span>
            <span className="text-3xl font-bold text-slate-900 dark:text-white">{summary.totalPending} FCFA</span>
          </div>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white dark:bg-[#141414] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6"
      >
        <div className="w-full sm:w-auto">
          <AdminFilters 
            groups={[
              { 
                id: 'status', 
                label: 'Statut du gain', 
                options: [
                  { label: 'Tous', value: '' },
                  { label: 'En attente', value: 'PENDING' },
                  { label: 'Payé', value: 'PAID' },
                  { label: 'Annulé', value: 'CANCELLED' }
                ],
                value: filters.status
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
            Erreur lors du chargement des opérations.
          </div>
        ) : (
          <AdminTable
            data={data}
            columns={columns}
            keyExtractor={(e) => e.id}
            isLoading={isLoading}
            emptyState={
              <EmptyState 
                title="Aucune opération" 
                description="Aucun gain trouvé pour ces critères." 
              />
            }
          />
        )}
      </motion.div>

      {!isError && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <AdminPagination 
            currentPage={filters.page || 1} 
            totalPages={meta?.totalPages || 1} 
            onPageChange={(page) => updateFilters({ page })} 
          />
        </motion.div>
      )}

      <PayoutModal 
        isOpen={!!selectedEarning}
        earning={selectedEarning}
        onClose={() => setSelectedEarning(null)}
        onConfirm={async (payoutRef) => {
          if (selectedEarning) {
            await markAsPaid(selectedEarning.id, payoutRef);
          }
        }}
      />

    </AdminPageContainer>
  );
}

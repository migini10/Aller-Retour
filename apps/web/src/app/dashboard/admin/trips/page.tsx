'use client';

import React, { useState } from 'react';
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
import { Plus, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTrips } from '../hooks/useTrips';

export default function Page() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const { trips, meta, isLoading, permissions } = useTrips({
    page: currentPage,
    search: searchQuery,
    status: filters.status,
    date: filters.date,
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  return (
    <AdminPageContainer>
      <AdminBreadcrumb />
      
      <AdminPageHeader 
        title="Trajets" 
        description="Supervision des trajets de covoiturage interurbain publiés et actifs."
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-semibold transition-colors">
            <Plus className="w-4 h-4" />
            Nouveau
          </button>
        }
      />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-[#141414] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-4"
      >
        <div className="w-full sm:w-auto flex-1">
          <AdminSearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <div className="w-full sm:w-auto">
          <AdminFilters 
            activeFilters={filters}
            onFilterChange={handleFilterChange}
            groups={[
              { id: 'status', label: 'Statut', options: [
                { label: 'Prévu', value: 'SCHEDULED' }, 
                { label: 'En cours', value: 'IN_PROGRESS' }, 
                { label: 'Terminé', value: 'COMPLETED' }, 
                { label: 'Annulé', value: 'CANCELLED' }
              ]},
              { id: 'date', label: 'Date', options: [{ label: 'Aujourd\'hui', value: 'today' }, { label: 'Cette semaine', value: 'week' }] }
            ]}
          />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="w-full bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden"
      >
        {isLoading ? (
          <div className="animate-pulse h-96 bg-slate-100 dark:bg-slate-800/50"></div>
        ) : (
          <AdminTable
            data={trips}
            columns={[
              { 
                header: 'Itinéraire', 
                accessorKey: 'route',
                cell: (t) => (
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {t.departureCity} ➔ {t.arrivalCity}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(t.departureTime).toLocaleString('fr-FR', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                )
              },
              { 
                header: 'Chauffeur', 
                accessorKey: 'driver',
                cell: (t) => (
                  <div className="text-sm">
                    {t.driver ? `${t.driver.firstName} ${t.driver.lastName}` : 'Aucun'}
                  </div>
                )
              },
              { 
                header: 'Places', 
                accessorKey: 'seats',
                cell: (t) => (
                  <div className="text-sm">
                    {t.totalSeats - t.availableSeats} / {t.totalSeats}
                  </div>
                )
              },
              { 
                header: 'Statut', 
                accessorKey: 'status',
                cell: (t) => {
                  let variant: any = 'default';
                  if (t.status === 'SCHEDULED') variant = 'warning';
                  if (t.status === 'IN_PROGRESS') variant = 'info';
                  if (t.status === 'COMPLETED') variant = 'success';
                  if (t.status === 'CANCELLED') variant = 'error';

                  return (
                    <div className="flex items-center gap-2">
                      <StatusBadge label={t.status} variant={variant} />
                      {t.isLocked && <Lock className="w-3.5 h-3.5 text-rose-500" />}
                    </div>
                  );
                }
              },
              {
                header: 'Prix',
                accessorKey: 'price',
                cell: (t) => `${t.price} FCFA`
              },
              { 
                header: 'Actions', 
                accessorKey: 'actions',
                cell: (t) => (
                  permissions.canViewTrip && (
                    <button 
                      onClick={() => router.push(`/dashboard/admin/trips/${t.id}`)}
                      className="text-orange-600 hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-400 text-sm font-semibold transition-colors"
                    >
                      Gérer
                    </button>
                  )
                )
              },
            ]}
            keyExtractor={(item) => item.id}
            emptyState={
              <EmptyState 
                title="Aucun trajet trouvé" 
                description="Aucun trajet ne correspond à votre recherche ou filtres." 
              />
            }
          />
        )}
      </motion.div>

      {!isLoading && meta?.totalPages > 1 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-4"
        >
          <AdminPagination 
            currentPage={currentPage} 
            totalPages={meta.totalPages} 
            onPageChange={setCurrentPage} 
          />
        </motion.div>
      )}

    </AdminPageContainer>
  );
}

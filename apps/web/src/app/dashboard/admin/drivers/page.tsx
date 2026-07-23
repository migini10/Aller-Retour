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
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDrivers } from '../hooks/useDrivers';
import { CreateAssignedDriverModal } from './components/CreateAssignedDriverModal';

export default function Page() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { drivers, meta, isLoading, permissions, refresh } = useDrivers({
    page: currentPage,
    search: searchQuery,
    status: filters.status,
    kycStatus: filters.kycStatus,
    type: filters.type,
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  return (
    <AdminPageContainer>
      <AdminBreadcrumb />
      
      <AdminPageHeader 
        title="Chauffeurs" 
        description="Gestion des chauffeurs, validation KYC et documents."
        action={
          <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-semibold transition-colors">
            <Plus className="w-4 h-4" />
            Nouveau Chauffeur Assigné
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
              { id: 'type', label: 'Type de Chauffeur', options: [{ label: 'Tous', value: '' }, { label: 'Propriétaire (OWNER)', value: 'OWNER' }, { label: 'Assigné (ASSIGNED)', value: 'ASSIGNED' }] },
              { id: 'status', label: 'Statut Compte', options: [{ label: 'Actif', value: 'ACTIVE' }, { label: 'Suspendu', value: 'SUSPENDED' }] },
              { id: 'kycStatus', label: 'Statut KYC', options: [{ label: 'En attente', value: 'PENDING' }, { label: 'Validé', value: 'APPROVED' }, { label: 'Rejeté', value: 'REJECTED' }] }
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
            data={drivers}
            columns={[
              { 
                header: 'Chauffeur', 
                accessorKey: 'firstName',
                cell: (d) => (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-400">
                      {d.firstName?.[0]}{d.lastName?.[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        {d.firstName} {d.lastName}
                      </div>
                      <div className="text-xs text-slate-500">{d.email}</div>
                    </div>
                  </div>
                )
              },
              { header: 'Téléphone', accessorKey: 'phone' },
              { 
                header: 'Statut Compte', 
                accessorKey: 'status',
                cell: (d) => {
                  if (d.status === 'ACTIVE') return <StatusBadge label="Actif" variant="success" />;
                  if (d.status === 'SUSPENDED') return <StatusBadge label="Suspendu" variant="error" />;
                  return <StatusBadge label={d.status} />;
                }
              },
              {
                header: 'Type',
                accessorKey: 'type',
                cell: (d) => {
                  if (d.type === 'OWNER') return <StatusBadge label="Propriétaire" variant="default" />;
                  if (d.type === 'ASSIGNED') return <StatusBadge label="Assigné" variant="info" />;
                  return <StatusBadge label={d.type || 'Inconnu'} />;
                }
              },
              {
                header: 'Manager',
                accessorKey: 'managerName',
                cell: (d) => (
                  <div className="text-sm text-slate-700 dark:text-slate-300">
                    {d.type === 'ASSIGNED' ? (d.managerName || 'Inconnu') : '-'}
                  </div>
                )
              },
              { 
                header: 'KYC', 
                accessorKey: 'kycStatus',
                cell: (d) => {
                  if (d.kycStatus === 'APPROVED') return <StatusBadge label="Validé" variant="success" />;
                  if (d.kycStatus === 'PENDING') return <StatusBadge label="En attente" variant="warning" />;
                  if (d.kycStatus === 'REJECTED') return <StatusBadge label="Rejeté" variant="error" />;
                  return <StatusBadge label={d.kycStatus} />;
                }
              },
              { header: 'Inscrit le', cell: (d) => new Date(d.createdAt).toLocaleDateString() },
              { 
                header: 'Actions', 
                accessorKey: 'actions',
                cell: (d) => (
                  permissions.canViewDriver && (
                    <button 
                      onClick={() => router.push(`/dashboard/admin/drivers/${d.id}`)}
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
                title="Aucun résultat" 
                description="Aucun chauffeur trouvé pour votre recherche ou les filtres actuels." 
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

      {isCreateModalOpen && (
        <CreateAssignedDriverModal
          owners={drivers} // Using currently loaded drivers as a simplified owner list (will filter internally)
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => refresh()}
        />
      )}

    </AdminPageContainer>
  );
}

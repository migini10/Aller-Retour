'use client';

import React, { useState } from 'react';
import { AdminPageContainer } from '../components/shared/AdminPageContainer';
import { AdminPageHeader } from '../components/shared/AdminPageHeader';
import { AdminBreadcrumb } from '../components/layout/AdminBreadcrumb';
import { AdminSearchBar } from '../components/forms/AdminSearchBar';
import { AdminFilters } from '../components/forms/AdminFilters';
import { AdminTable } from '../components/tables/AdminTable';
import { AdminPagination } from '../components/tables/AdminPagination';
import { EmptyState } from '../components/ui/EmptyState';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AdminPageContainer>
      <AdminBreadcrumb />
      
      <AdminPageHeader 
        title="Opérations Chauffeurs" 
        description="Missions, affectations manuelles et support opérationnel aux chauffeurs."
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
        className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-[#141414] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <div className="w-full sm:w-auto flex-1">
          <AdminSearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <div className="w-full sm:w-auto">
          <AdminFilters 
            groups={[
              { id: 'status', label: 'Statut', options: [{ label: 'Actif', value: 'active' }, { label: 'Inactif', value: 'inactive' }] },
              { id: 'date', label: 'Date', options: [{ label: 'Aujourd\'hui', value: 'today' }, { label: 'Cette semaine', value: 'week' }] }
            ]}
          />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="w-full"
      >
        <AdminTable
          data={[]} // Mock vide
          columns={[
            { header: 'ID', accessorKey: 'id' },
            { header: 'Nom', accessorKey: 'name' },
            { header: 'Statut', accessorKey: 'status' },
            { header: 'Date', accessorKey: 'date' },
            { header: 'Actions', accessorKey: 'actions' },
          ]}
          keyExtractor={(item) => (item as any).id}
          emptyState={
            <EmptyState 
              title="Aucun résultat" 
              description="Aucun élément trouvé pour votre recherche ou les filtres actuels." 
            />
          }
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <AdminPagination 
          currentPage={currentPage} 
          totalPages={10} 
          onPageChange={setCurrentPage} 
        />
      </motion.div>

    </AdminPageContainer>
  );
}

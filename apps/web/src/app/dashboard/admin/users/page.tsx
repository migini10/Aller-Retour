'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

import { AdminPageContainer } from '../components/shared/AdminPageContainer';
import { AdminPageHeader } from '../components/shared/AdminPageHeader';
import { AdminBreadcrumb } from '../components/layout/AdminBreadcrumb';
import { useUsers } from '../hooks/useUsers';

// Local Components
import { UserStats } from './components/UserStats';
import { UserSearch } from './components/UserSearch';
import { UserFilters } from './components/UserFilters';
import { UsersTable } from './components/UsersTable';
import { AdminPagination } from '../components/tables/AdminPagination';

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);

  const { users, meta, isLoading, permissions } = useUsers({
    search: searchQuery,
    role: filters.role,
    status: filters.status,
    page: currentPage,
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return (
    <AdminPageContainer>
      <AdminBreadcrumb />
      
      <AdminPageHeader 
        title="Gestion des Utilisateurs" 
        description="Annuaire complet des clients et chauffeurs inscrits sur la plateforme."
        action={
          <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors">
            Nouvel Utilisateur
          </button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-6"
      >
        {/* KPI Section */}
        <UserStats />

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-2">
          <div className="flex-1">
            <UserSearch value={searchQuery} onChange={setSearchQuery} />
          </div>
          <div className="shrink-0">
            <UserFilters filters={filters} onFilterChange={handleFilterChange} />
          </div>
        </div>

        {/* Table Section */}
        {permissions.canViewUser && (
          <>
            <UsersTable users={users} isLoading={isLoading} />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <AdminPagination 
                currentPage={currentPage} 
                totalPages={meta?.totalPages || 1} 
                onPageChange={setCurrentPage} 
              />
            </motion.div>
          </>
        )}

      </motion.div>
    </AdminPageContainer>
  );
}

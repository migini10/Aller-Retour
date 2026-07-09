'use client';

import React, { useState, useEffect } from 'react';
import { AdminPageContainer } from '../components/shared/AdminPageContainer';
import { AdminPageHeader } from '../components/shared/AdminPageHeader';
import { AdminBreadcrumb } from '../components/layout/AdminBreadcrumb';
import { AdminSearchBar } from '../components/forms/AdminSearchBar';
import { AdminFilters } from '../components/forms/AdminFilters';
import { AdminTable } from '../components/tables/AdminTable';
import { AdminPagination } from '../components/tables/AdminPagination';
import { EmptyState } from '../components/ui/EmptyState';
import { motion } from 'framer-motion';
import { useNotifications } from '../hooks/useNotifications';
import { AppNotification, NotificationStatus, NotificationType } from '../types/notification.types';

export default function NotificationsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<NotificationStatus | ''>('');
  const [selectedType, setSelectedType] = useState<NotificationType | ''>('');

  const { notifications, isLoading, totalPages, totalItems, fetchNotifications } = useNotifications();

  useEffect(() => {
    fetchNotifications({
      page: currentPage,
      limit: 10,
      search: searchQuery || undefined,
      status: selectedStatus || undefined,
      type: selectedType || undefined,
    });
  }, [currentPage, searchQuery, selectedStatus, selectedType, fetchNotifications]);

  const getStatusBadge = (status: NotificationStatus) => {
    switch (status) {
      case 'SENT':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Envoyé</span>;
      case 'PENDING':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">En attente</span>;
      case 'FAILED':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Échoué</span>;
    }
  };

  const columns = [
    { 
      header: 'Type', 
      accessorKey: 'type',
      cell: (item: AppNotification) => (
        <span className="text-sm font-medium text-slate-900 dark:text-white">
          {item.type}
        </span>
      )
    },
    { 
      header: 'Destinataire', 
      accessorKey: 'recipient',
      cell: (item: AppNotification) => (
        <div>
          <div className="text-sm font-medium text-slate-900 dark:text-white">
            {item.recipient?.fullName || 'N/A'}
          </div>
          <div className="text-xs text-slate-500">
            {item.recipient?.email || item.recipient?.phone || ''}
          </div>
        </div>
      )
    },
    { 
      header: 'Statut', 
      accessorKey: 'status',
      cell: (item: AppNotification) => getStatusBadge(item.status)
    },
    { 
      header: 'Contenu (Sécurisé)', 
      accessorKey: 'content',
      cell: (item: AppNotification) => (
        <div className="max-w-xs text-sm text-slate-600 dark:text-slate-400 truncate">
          <strong>{item.title}</strong>
          <br/>
          {item.content}
          {item.errorMessage && (
            <div className="text-xs text-red-500 mt-1">
              Erreur: {item.errorMessage}
            </div>
          )}
        </div>
      )
    },
    { 
      header: 'Date d\'envoi', 
      accessorKey: 'createdAt',
      cell: (item: AppNotification) => (
        <span className="text-sm text-slate-500">
          {new Date(item.sentAt || item.createdAt).toLocaleString('fr-FR', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })}
        </span>
      )
    }
  ];

  return (
    <AdminPageContainer>
      <AdminBreadcrumb />
      
      <AdminPageHeader 
        title="Notifications" 
        description="Historique des notifications (Email, SMS) envoyées par la plateforme."
      />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-[#141414] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <div className="w-full sm:w-auto flex-1">
          <AdminSearchBar 
            value={searchQuery} 
            onChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }} 
          />
        </div>
        <div className="w-full sm:w-auto flex gap-2">
          <select 
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value as NotificationType | '');
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          >
            <option value="">Tous les types</option>
            <option value="EMAIL">Email</option>
            <option value="SYSTEM">Système</option>
          </select>

          <select 
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value as NotificationStatus | '');
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          >
            <option value="">Tous les statuts</option>
            <option value="SENT">Envoyé</option>
            <option value="PENDING">En attente</option>
            <option value="FAILED">Échoué</option>
          </select>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="w-full"
      >
        <AdminTable
          data={notifications}
          columns={columns}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          emptyState={
            <EmptyState 
              title="Aucune notification" 
              description="Aucune notification ne correspond à votre recherche ou aux filtres actuels." 
            />
          }
        />
      </motion.div>

      {totalPages > 1 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <AdminPagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </motion.div>
      )}

    </AdminPageContainer>
  );
}

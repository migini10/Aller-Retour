'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminPageContainer } from '../components/shared/AdminPageContainer';
import { AdminPageHeader } from '../components/shared/AdminPageHeader';
import { AdminBreadcrumb } from '../components/layout/AdminBreadcrumb';
import { AdminSearchBar } from '../components/forms/AdminSearchBar';
import { AdminFilters } from '../components/forms/AdminFilters';
import { AdminTable } from '../components/tables/AdminTable';
import { AdminPagination } from '../components/tables/AdminPagination';
import { EmptyState } from '../components/ui/EmptyState';
import { motion } from 'framer-motion';
import { useReviews } from '../hooks/useReviews';
import { Star, Eye, EyeOff, MoreVertical, Search } from 'lucide-react';

export default function ReviewsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

  const { reviews, totalPages, isLoading, fetchReviews, updateReviewStatus } = useReviews();

  useEffect(() => {
    fetchReviews({
      page: currentPage,
      limit: 10,
      search: searchQuery || undefined,
      status: statusFilter || undefined,
      rating: ratingFilter ? parseInt(ratingFilter) : undefined,
    });
  }, [currentPage, searchQuery, statusFilter, ratingFilter, fetchReviews]);

  const toggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'VISIBLE' ? 'HIDDEN' : 'VISIBLE';
    updateReviewStatus(id, newStatus);
  };

  const columns = [
    { 
      header: 'Auteur', 
      accessorKey: 'author',
      cell: (item: any) => (
        <div className="flex items-center gap-3">
          {item.author.avatarUrl ? (
            <img src={item.author.avatarUrl} alt={item.author.fullName} className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-medium text-sm">
              {item.author.fullName.charAt(0)}
            </div>
          )}
          <div className="font-medium">{item.author.fullName}</div>
        </div>
      )
    },
    { 
      header: 'Destinataire', 
      accessorKey: 'receiver',
      cell: (item: any) => (
        <div className="flex items-center gap-3">
          {item.receiver.avatarUrl ? (
            <img src={item.receiver.avatarUrl} alt={item.receiver.fullName} className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-medium text-sm">
              {item.receiver.fullName.charAt(0)}
            </div>
          )}
          <div className="font-medium text-slate-600 dark:text-slate-400">{item.receiver.fullName}</div>
        </div>
      )
    },
    { 
      header: 'Note', 
      accessorKey: 'rating',
      cell: (item: any) => (
        <div className="flex items-center gap-1 text-orange-500">
          <span className="font-medium">{item.rating}</span>
          <Star className="w-4 h-4 fill-current" />
        </div>
      )
    },
    { 
      header: 'Commentaire', 
      accessorKey: 'comment',
      cell: (item: any) => (
        <div className="max-w-[300px] truncate text-slate-600 dark:text-slate-400">
          {item.comment || <span className="italic opacity-50">Aucun commentaire</span>}
        </div>
      )
    },
    { 
      header: 'Date', 
      accessorKey: 'createdAt',
      cell: (item: any) => (
        <span className="text-sm text-slate-500">
          {new Date(item.createdAt).toLocaleString('fr-FR', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })}
        </span>
      )
    },
    { 
      header: 'Statut', 
      accessorKey: 'status',
      cell: (item: any) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          item.status === 'VISIBLE' 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {item.status === 'VISIBLE' ? 'Visible' : 'Masqué'}
        </span>
      )
    },
    { 
      header: 'Actions', 
      accessorKey: 'actions',
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.push(`/dashboard/admin/reviews/${item.id}`)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="Détails"
          >
            <Search className="w-4 h-4" />
          </button>
          <button 
            onClick={() => toggleStatus(item.id, item.status)}
            className={`p-1.5 rounded-lg transition-colors ${
              item.status === 'VISIBLE' 
                ? 'text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' 
                : 'text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
            }`}
            title={item.status === 'VISIBLE' ? 'Masquer' : 'Publier'}
          >
            {item.status === 'VISIBLE' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      )
    },
  ];

  return (
    <AdminPageContainer>
      <AdminBreadcrumb />
      
      <AdminPageHeader 
        title="Avis" 
        description="Modération des avis croisés entre passagers et chauffeurs."
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
            onChange={setSearchQuery} 
            placeholder="Rechercher par nom, commentaire..."
          />
        </div>
        <div className="w-full sm:w-auto">
          <AdminFilters 
            groups={[
              { 
                id: 'status', 
                label: 'Statut', 
                value: statusFilter,
                onChange: setStatusFilter,
                options: [
                  { label: 'Tous', value: '' },
                  { label: 'Visibles', value: 'VISIBLE' }, 
                  { label: 'Masqués', value: 'HIDDEN' }
                ] 
              },
              { 
                id: 'rating', 
                label: 'Note', 
                value: ratingFilter,
                onChange: setRatingFilter,
                options: [
                  { label: 'Toutes les notes', value: '' },
                  { label: '5 Étoiles', value: '5' }, 
                  { label: '4 Étoiles', value: '4' },
                  { label: '3 Étoiles', value: '3' },
                  { label: '2 Étoiles', value: '2' },
                  { label: '1 Étoile', value: '1' }
                ] 
              }
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
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <AdminTable
            data={reviews}
            columns={columns}
            keyExtractor={(item) => (item as any).id}
            emptyState={
              <EmptyState 
                title="Aucun avis" 
                description="Aucun avis trouvé pour votre recherche ou les filtres actuels." 
              />
            }
          />
        )}
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

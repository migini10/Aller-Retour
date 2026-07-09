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
import { Plus, Eye, User, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

import { useBookings } from '../hooks/useBookings';
import { Booking } from '../types/booking.types';

export default function BookingsPage() {
  const router = useRouter();
  const { data, meta, isLoading, isError, filters, updateFilters, changePage } = useBookings();

  const handleSearch = (value: string) => updateFilters({ search: value });
  
  const handleFilterChange = (filterId: string, value: string) => {
    if (filterId === 'status') updateFilters({ status: value as any });
    if (filterId === 'paymentStatus') updateFilters({ paymentStatus: value as any });
  };

  const columns = [
    { 
      header: 'Réf', 
      accessorKey: 'id',
      cell: (b: Booking) => <span className="font-mono text-xs font-semibold text-slate-500">{b.id.split('-')[0].toUpperCase()}</span>
    },
    { 
      header: 'Passager', 
      accessorKey: 'user',
      cell: (b: Booking) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="font-medium text-slate-900 dark:text-white">
              {b.user?.firstName} {b.user?.lastName}
            </div>
            <div className="text-xs text-slate-500">{b.user?.phone}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Trajet', 
      accessorKey: 'trip',
      cell: (b: Booking) => (
        <div className="flex flex-col gap-1">
          <div className="font-medium text-slate-900 dark:text-white flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            {b.trip?.route?.originStation?.city || 'Origine'} ➔ {b.trip?.route?.destinationStation?.city || 'Dest'}
          </div>
          <div className="text-xs text-slate-500">
            {new Date(b.trip?.departureTime || '').toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      )
    },
    { header: 'Siège', accessorKey: 'seatNumber' },
    { 
      header: 'Paiement', 
      accessorKey: 'amountPaid',
      cell: (b: Booking) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 dark:text-white">{b.amountPaid} FCFA</span>
          <span className="text-xs text-slate-500">{b.paymentMethod}</span>
        </div>
      )
    },
    { 
      header: 'Statut', 
      accessorKey: 'status',
      cell: (b: Booking) => <StatusBadge label={b.status} />
    },
    { 
      header: 'Actions', 
      accessorKey: 'actions',
      cell: (b: Booking) => (
        <button 
          onClick={() => router.push(`/dashboard/admin/bookings/${b.id}`)}
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
      
      <AdminPageHeader 
        title="Réservations" 
        description="Suivi des réservations de billets, paiements et gestion des annulations."
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
        className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-white dark:bg-[#141414] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6"
      >
        <div className="w-full lg:w-96">
          <AdminSearchBar 
            value={filters.search || ''} 
            onChange={handleSearch}
            placeholder="Rechercher (Nom, Réf...)"
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
                  { label: 'Confirmé', value: 'CONFIRMED' },
                  { label: 'En attente', value: 'PENDING_PAYMENT' },
                  { label: 'Embarqué', value: 'BOARDED' },
                  { label: 'Annulé', value: 'CANCELLED' }
                ],
                value: filters.status
              },
              { 
                id: 'paymentStatus', 
                label: 'Méthode', 
                options: [
                  { label: 'Tous', value: '' },
                  { label: 'Wave', value: 'WAVE' },
                  { label: 'Orange Money', value: 'ORANGE_MONEY' },
                  { label: 'Cash', value: 'CASH' }
                ],
                value: filters.paymentStatus
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
            Erreur lors du chargement des réservations.
          </div>
        ) : (
          <AdminTable
            data={data}
            columns={columns}
            keyExtractor={(b) => b.id}
            isLoading={isLoading}
            emptyState={
              <EmptyState 
                title="Aucune réservation" 
                description="Aucun élément trouvé pour votre recherche ou les filtres actuels." 
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

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';

import { AdminPageContainer } from '../../components/shared/AdminPageContainer';
import { AdminBreadcrumb } from '../../components/layout/AdminBreadcrumb';
import { ErrorState } from '../../components/ui/ErrorState';
import { useUsers } from '../../hooks/useUsers';
import { UserRole } from '../../types/user.types';

// Components
import { UserSummaryCard } from '../components/UserSummaryCard';
import { UserProfile } from '../components/UserProfile';
import { UserStatistics } from '../components/UserStatistics';
import { UserTrips } from '../components/UserTrips';
import { UserBookings } from '../components/UserBookings';
import { UserReviews } from '../components/UserReviews';
import { UserDocuments } from '../components/UserDocuments';
import { UserActivity } from '../components/UserActivity';
import { UserActions } from '../components/UserActions';
import { UserAdminNotes } from '../components/UserAdminNotes';

type TabId = 'profile' | 'statistics' | 'activity' | 'trips' | 'bookings' | 'reviews' | 'documents' | 'notes';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading, isError, permissions, refresh } = useUsers({ id: params.id as string });
  
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  if (isLoading) {
    return (
      <AdminPageContainer>
        <AdminBreadcrumb customSegments={[{ name: 'Chargement...', href: '#' }]} />
        <div className="animate-pulse flex flex-col gap-6 mt-6">
          <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
      </AdminPageContainer>
    );
  }

  if (isError || !user) {
    return (
      <AdminPageContainer>
        <AdminBreadcrumb customSegments={[{ name: 'Erreur', href: '#' }]} />
        <div className="mt-6">
          <ErrorState 
            title="Utilisateur introuvable" 
            description="Le compte que vous recherchez n'existe pas ou a été supprimé." 
            action={{ label: "Retour à la liste", onClick: () => router.push('/dashboard/admin/users') }} 
          />
        </div>
      </AdminPageContainer>
    );
  }

  const isDriver = user.role === UserRole.DRIVER;

  const tabs: { id: TabId; label: string }[] = [
    { id: 'profile', label: 'Profil' },
    // Adapting tabs based on role
    ...(isDriver ? [
      { id: 'statistics' as TabId, label: 'Statistiques' },
      { id: 'trips' as TabId, label: 'Trajets' }
    ] : []),
    { id: 'bookings', label: 'Réservations' },
    { id: 'reviews', label: 'Avis' },
    { id: 'documents', label: 'Documents KYC' },
    { id: 'activity', label: 'Activité' },
    { id: 'notes', label: 'Notes Admin' },
  ];

  return (
    <AdminPageContainer>
      <AdminBreadcrumb customSegments={[{ name: `${user.firstName} ${user.lastName}`, href: `/dashboard/admin/users/${user.id}` }]} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-6 mt-6"
      >
        <UserSummaryCard user={user} />

        <div className="flex flex-col lg:flex-row gap-6 w-full">
          
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {/* Tabs Navigation */}
            <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-slate-800/80 rounded-xl p-1.5 flex overflow-x-auto hide-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-max px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                    activeTab === tab.id 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="relative min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'profile' && <UserProfile user={user} />}
                  {activeTab === 'statistics' && <UserStatistics user={user} />}
                  {activeTab === 'trips' && <UserTrips />}
                  {activeTab === 'bookings' && <UserBookings />}
                  {activeTab === 'reviews' && <UserReviews />}
                  {activeTab === 'documents' && <UserDocuments user={user} />}
                  {activeTab === 'activity' && <UserActivity userId={user.id} />}
                  {activeTab === 'notes' && <UserAdminNotes user={user} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="w-full lg:w-80 shrink-0">
            {permissions.canEditUser && <UserActions user={user} permissions={permissions} onRefresh={refresh} />}
          </div>

        </div>

      </motion.div>
    </AdminPageContainer>
  );
}

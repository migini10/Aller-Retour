'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { AdminPageContainer } from '../../components/shared/AdminPageContainer';
import { AdminBreadcrumb } from '../../components/layout/AdminBreadcrumb';
import { ErrorState } from '../../components/ui/ErrorState';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useDrivers } from '../../hooks/useDrivers';
import { DriversService } from '../../services/drivers.service';

import { DriverVehiclesView, DriverEarningsView, DriverReviewsView } from '../components/DriverViews';
import { useModal } from '../../../../../components/ModalContext';

type TabId = 'profile' | 'vehicles' | 'earnings' | 'reviews';

export default function DriverDetailPage() {
  const { showToast } = useModal();
  const params = useParams();
  const router = useRouter();
  const { driver, isLoading, isError, permissions, refresh } = useDrivers({ id: params.id as string });
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  if (isLoading) {
    return (
      <AdminPageContainer>
        <AdminBreadcrumb customSegments={[{ name: 'Chargement...', href: '#' }]} />
        <div className="animate-pulse flex flex-col gap-6 mt-6">
          <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
      </AdminPageContainer>
    );
  }

  if (isError || !driver) {
    return (
      <AdminPageContainer>
        <AdminBreadcrumb customSegments={[{ name: 'Erreur', href: '#' }]} />
        <div className="mt-6">
          <ErrorState 
            title="Chauffeur introuvable" 
            description="Ce compte n'existe pas ou a été supprimé." 
            action={{ label: "Retour à la liste", onClick: () => router.push('/dashboard/admin/drivers') }} 
          />
        </div>
      </AdminPageContainer>
    );
  }

  const handleKycAction = async (status: 'APPROVED' | 'REJECTED') => {
    try {
      await DriversService.updateKycStatus(driver.id, status);
      refresh();
      showToast('Statut KYC mis à jour', 'success');
    } catch (e) {
      showToast("Erreur lors de la mise à jour KYC", 'error');
    }
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: 'profile', label: 'Profil KYC' },
    { id: 'vehicles', label: 'Véhicules' },
    { id: 'earnings', label: 'Revenus' },
    { id: 'reviews', label: 'Avis' },
  ];

  return (
    <AdminPageContainer>
      <AdminBreadcrumb customSegments={[{ name: `${driver.firstName} ${driver.lastName}`, href: `/dashboard/admin/drivers/${driver.id}` }]} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-6 mt-6"
      >
        {/* Header Card */}
        <div className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-600 dark:text-slate-400">
              {driver.firstName?.[0]}{driver.lastName?.[0]}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {driver.firstName} {driver.lastName}
              </h1>
              <p className="text-slate-500">{driver.email} • {driver.phone}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <StatusBadge label={driver.status} variant={driver.status === 'ACTIVE' ? 'success' : 'warning'} />
            <StatusBadge label={`KYC: ${driver.kycStatus}`} variant={driver.kycStatus === 'APPROVED' ? 'success' : driver.kycStatus === 'REJECTED' ? 'error' : 'warning'} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-6">
            {/* Tabs Navigation */}
            <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 flex overflow-x-auto hide-scrollbar">
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
                  {activeTab === 'profile' && (
                    <div className="bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                      <h3 className="font-bold text-lg mb-4">Informations KYC</h3>
                      {driver.driverDetails ? (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div><span className="text-slate-500">Permis:</span> <span className="font-medium">{driver.driverDetails.licenseNumber}</span></div>
                          <div><span className="text-slate-500">Expiration:</span> <span className="font-medium">{driver.driverDetails.licenseExpiry}</span></div>
                          <div><span className="text-slate-500">Carte d'Identité:</span> <span className="font-medium">{driver.driverDetails.identityCardNumber}</span></div>
                        </div>
                      ) : (
                        <p className="text-slate-500">Aucun détail fourni.</p>
                      )}
                    </div>
                  )}
                  {activeTab === 'vehicles' && <DriverVehiclesView driverId={driver.id} />}
                  {activeTab === 'earnings' && <DriverEarningsView driverId={driver.id} />}
                  {activeTab === 'reviews' && <DriverReviewsView driverId={driver.id} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="w-full lg:w-80 shrink-0">
            {permissions.canEditKyc && driver.kycStatus === 'PENDING' && (
              <div className="bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-2">
                <h3 className="font-bold mb-2">Actions KYC</h3>
                <button onClick={() => handleKycAction('APPROVED')} className="w-full p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold">Valider le dossier</button>
                <button onClick={() => handleKycAction('REJECTED')} className="w-full p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold">Rejeter le dossier</button>
              </div>
            )}
          </div>
        </div>

      </motion.div>
    </AdminPageContainer>
  );
}

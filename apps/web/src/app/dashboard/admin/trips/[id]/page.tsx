'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { AdminPageContainer } from '../../components/shared/AdminPageContainer';
import { AdminBreadcrumb } from '../../components/layout/AdminBreadcrumb';
import { ErrorState } from '../../components/ui/ErrorState';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useTrips } from '../../hooks/useTrips';
import { TripsService } from '../../services/trips.service';

import { TripManifestView, TripBookingsView } from '../components/TripViews';
import { Lock, Unlock, Trash2, MapPin, Clock, CreditCard, UserPlus } from 'lucide-react';
import { useModal } from '../../../../../components/ModalContext';

type TabId = 'general' | 'manifest' | 'bookings';

export default function TripDetailPage() {
  const { showConfirmDialog, showToast } = useModal();
  const params = useParams();
  const router = useRouter();
  
  // Note: we're using the manifest endpoint to get trip data 
  // since there is no standalone getTripById endpoint mentioned in the API list.
  const { manifest, isLoading, isError, permissions, refresh } = useTrips({ id: params.id as string });
  const [activeTab, setActiveTab] = useState<TabId>('general');

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

  if (isError || !manifest) {
    return (
      <AdminPageContainer>
        <AdminBreadcrumb customSegments={[{ name: 'Erreur', href: '#' }]} />
        <div className="mt-6">
          <ErrorState 
            title="Trajet introuvable" 
            description="Ce trajet n'existe pas ou a été supprimé." 
            action={{ label: "Retour à la liste", onClick: () => router.push('/dashboard/admin/trips') }} 
          />
        </div>
      </AdminPageContainer>
    );
  }

  const handleToggleLock = async () => {
    try {
      if (await showConfirmDialog('Modifier verrouillage', 'Voulez-vous modifier le verrouillage de ce trajet ?')) {
        await TripsService.toggleLock(manifest.tripId);
        refresh();
        showToast('Verrouillage modifié avec succès', 'success');
      }
    } catch (e) {
      showToast("Erreur lors du verrouillage/déverrouillage.", 'error');
    }
  };

  const handleDelete = async () => {
    try {
      if (await showConfirmDialog('Supprimer le trajet', 'Êtes-vous sûr de vouloir supprimer ce trajet ? Cette action est irréversible.', 'danger')) {
        await TripsService.deleteTrip(manifest.tripId);
        showToast('Trajet supprimé avec succès', 'success');
        router.push('/dashboard/admin/trips');
      }
    } catch (e) {
      showToast("Erreur lors de la suppression.", 'error');
    }
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: 'general', label: 'Informations Générales' },
    { id: 'manifest', label: 'Manifeste' },
    { id: 'bookings', label: 'Réservations' },
  ];

  return (
    <AdminPageContainer>
      <AdminBreadcrumb customSegments={[{ name: `${manifest.departureCity} ➔ ${manifest.arrivalCity}`, href: `/dashboard/admin/trips/${manifest.tripId}` }]} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-6 mt-6"
      >
        {/* Header Card */}
        <div className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <MapPin className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {manifest.departureCity} ➔ {manifest.arrivalCity}
              </h1>
              <p className="text-slate-500 mt-1 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {new Date(manifest.departureTime).toLocaleString('fr-FR', {
                  weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <StatusBadge label="Trajet Valide" variant="success" />
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
                  {activeTab === 'general' && (
                    <div className="bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-6">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#1A1A1A]">
                          <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                            <CreditCard className="w-4 h-4 text-slate-500" />
                            Informations Financières
                          </h4>
                          <div className="flex flex-col gap-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Revenus générés</span>
                              <span className="font-bold text-emerald-600">{manifest.totalRevenue} FCFA</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#1A1A1A]">
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                              <UserPlus className="w-4 h-4 text-slate-500" />
                              Ressources
                            </h4>
                            <button className="text-xs px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition text-slate-700 dark:text-slate-300 font-semibold shadow-sm">
                              Affecter un chauffeur
                            </button>
                          </div>
                          <div className="flex flex-col gap-2 text-sm">
                            <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700/50">
                              <span className="text-slate-500">Chauffeur Actuel</span>
                              <span className="font-medium">À venir</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span className="text-slate-500">Véhicule Assigné</span>
                              <span className="font-medium">À venir</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                  {activeTab === 'manifest' && <TripManifestView manifest={manifest} />}
                  {activeTab === 'bookings' && <TripBookingsView manifest={manifest} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
            
            <div className="bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-3">
              <h3 className="font-bold mb-2">Actions Rapides</h3>
              
              {permissions.canLockTrip && (
                <button 
                  onClick={handleToggleLock}
                  className="w-full p-2 flex justify-center items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-sm font-semibold transition"
                >
                  <Lock className="w-4 h-4" />
                  Verrouiller le trajet
                </button>
              )}

              {permissions.canDeleteTrip && (
                <button 
                  onClick={handleDelete}
                  className="w-full p-2 flex justify-center items-center gap-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg text-sm font-semibold transition border border-rose-100 dark:border-rose-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer le trajet
                </button>
              )}
            </div>

          </div>
        </div>

      </motion.div>
    </AdminPageContainer>
  );
}

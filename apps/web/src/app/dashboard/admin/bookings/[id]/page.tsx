'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { AdminPageContainer } from '../../components/shared/AdminPageContainer';
import { AdminBreadcrumb } from '../../components/layout/AdminBreadcrumb';
import { ErrorState } from '../../components/ui/ErrorState';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useBookings } from '../../hooks/useBookings';
import { BookingsService } from '../../services/bookings.service';

import { 
  User, MapPin, Clock, CreditCard, Ticket, 
  Trash2, Send, QrCode, RefreshCw, AlertTriangle 
} from 'lucide-react';

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const { booking, isLoading, isError, refresh, permissions } = useBookings({ id: params.id as string });
  const [isCancelling, setIsCancelling] = useState(false);

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

  if (isError || !booking) {
    return (
      <AdminPageContainer>
        <AdminBreadcrumb customSegments={[{ name: 'Erreur', href: '#' }]} />
        <div className="mt-6">
          <ErrorState 
            title="Réservation introuvable" 
            description="Cette réservation n'existe pas ou a été supprimée." 
            action={{ label: "Retour à la liste", onClick: () => router.push('/dashboard/admin/bookings') }} 
          />
        </div>
      </AdminPageContainer>
    );
  }

  const handleAdminCancel = async () => {
    try {
      if (confirm('ATTENTION: Êtes-vous sûr de vouloir annuler de force cette réservation ? Cette action modifiera le statut et libérera la place sans demander le code secret du passager.')) {
        setIsCancelling(true);
        await BookingsService.adminCancelBooking(booking.id);
        await refresh();
        alert('Réservation annulée avec succès.');
      }
    } catch (e: any) {
      alert(e.message || "Erreur lors de l'annulation.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleRefreshStatus = async () => {
    try {
      await refresh();
      alert("Statut mis à jour.");
    } catch (e) {
      alert("Erreur lors de la mise à jour.");
    }
  };

  const ref = booking.id.split('-')[0].toUpperCase();

  return (
    <AdminPageContainer>
      <AdminBreadcrumb customSegments={[{ name: `Réservation #${ref}`, href: `/dashboard/admin/bookings/${booking.id}` }]} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-6 mt-6"
      >
        {/* Header Card */}
        <div className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Ticket className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Billet #{ref}
              </h1>
              <p className="text-slate-500 mt-1 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Créé le {new Date(booking.createdAt).toLocaleString('fr-FR')}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <StatusBadge label={booking.status} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Grid Infos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Passager */}
              <div className="bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-slate-400" />
                  Passager
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Nom Complet</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{booking.user?.firstName} {booking.user?.lastName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Téléphone</span>
                    <span className="font-medium text-slate-900 dark:text-white">{booking.user?.phone}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Email</span>
                    <span className="font-medium text-slate-900 dark:text-white">{booking.user?.email || 'Non renseigné'}</span>
                  </div>
                </div>
              </div>

              {/* Trajet */}
              <div className="bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  Trajet & Véhicule
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Itinéraire</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{booking.trip?.route?.originStation?.city || 'Origine'} ➔ {booking.trip?.route?.destinationStation?.city || 'Dest'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Départ</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {booking.trip ? new Date(booking.trip.departureTime).toLocaleString('fr-FR') : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Chauffeur</span>
                    <span className="font-medium text-slate-900 dark:text-white">{booking.trip?.driver?.user?.firstName || 'Non assigné'}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-500">Véhicule</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {booking.trip?.vehicle ? `${booking.trip.vehicle.brand} ${booking.trip.vehicle.model} (${booking.trip.vehicle.plateNumber})` : 'Non assigné'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Paiement */}
              <div className="bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-slate-400" />
                  Détails du Paiement
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Montant total</span>
                    <span className="font-bold text-emerald-600">{booking.amountPaid} FCFA</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Méthode</span>
                    <span className="font-medium text-slate-900 dark:text-white">{booking.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-500">Frais client inclus</span>
                    <span className="font-medium text-slate-900 dark:text-white">{booking.clientFee} FCFA</span>
                  </div>
                </div>
              </div>

              {/* Billet & Embarquement */}
              <div className="bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                  <QrCode className="w-5 h-5 text-slate-400" />
                  Billet & Embarquement
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Siège n°</span>
                    <span className="font-bold text-slate-900 dark:text-white">{booking.seatNumber}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">QR Token</span>
                    <span className="font-mono text-xs text-slate-900 dark:text-white max-w-[150px] truncate">
                      {booking.qrCodeToken || 'Indisponible'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-500">Heure d'embarquement</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {booking.boardedAt ? new Date(booking.boardedAt).toLocaleString('fr-FR') : 'Non embarqué'}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
            
            <div className="bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-3">
              <h3 className="font-bold mb-2">Actions Administrateur</h3>
              
              <button 
                onClick={handleRefreshStatus}
                className="w-full p-2 flex justify-center items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-sm font-semibold transition"
              >
                <RefreshCw className="w-4 h-4" />
                Rafraîchir les données
              </button>

              {permissions.canTransfer && booking.status !== 'CANCELLED' && booking.status !== 'BOARDED' && (
                <button 
                  className="w-full p-2 flex justify-center items-center gap-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-semibold transition border border-blue-100 dark:border-blue-500/20 opacity-50 cursor-not-allowed"
                  title="Interface de transfert à finaliser."
                >
                  <Send className="w-4 h-4" />
                  Transférer (À finaliser)
                </button>
              )}

              {permissions.canCancel && booking.status !== 'CANCELLED' && booking.status !== 'BOARDED' && (
                <button 
                  onClick={handleAdminCancel}
                  disabled={isCancelling}
                  className="w-full mt-4 p-2 flex justify-center items-center gap-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg text-sm font-semibold transition border border-rose-100 dark:border-rose-500/20"
                >
                  {isCancelling ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Annulation Forcée
                </button>
              )}

              {booking.status === 'CANCELLED' && (
                <div className="mt-4 p-3 rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <p className="text-xs text-orange-800 dark:text-orange-300">
                    Cette réservation est annulée. Elle ne peut plus être modifiée ni transférée.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

      </motion.div>
    </AdminPageContainer>
  );
}

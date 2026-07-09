'use client';

import React, { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { AdminPageContainer } from '../../components/shared/AdminPageContainer';
import { AdminPageHeader } from '../../components/shared/AdminPageHeader';
import { AdminBreadcrumb } from '../../components/layout/AdminBreadcrumb';
import { motion } from 'framer-motion';
import { useReviewDetails } from '../../hooks/useReviewDetails';
import { Star, Eye, EyeOff, User, Calendar, MapPin, Car } from 'lucide-react';

export default function ReviewDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const { review, isLoading, fetchReview, updateStatus } = useReviewDetails(id);

  useEffect(() => {
    fetchReview();
  }, [fetchReview]);

  if (isLoading) {
    return (
      <AdminPageContainer>
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      </AdminPageContainer>
    );
  }

  if (!review) {
    return (
      <AdminPageContainer>
        <AdminBreadcrumb items={[{ label: 'Avis', href: '/dashboard/admin/reviews' }, { label: 'Détails' }]} />
        <div className="p-12 text-center text-slate-500">Avis introuvable.</div>
      </AdminPageContainer>
    );
  }

  const toggleStatus = () => {
    updateStatus(review.status === 'VISIBLE' ? 'HIDDEN' : 'VISIBLE');
  };

  return (
    <AdminPageContainer>
      <AdminBreadcrumb items={[{ label: 'Avis', href: '/dashboard/admin/reviews' }, { label: 'Détails' }]} />
      
      <AdminPageHeader 
        title="Détail de l'Avis" 
        action={
          <button 
            onClick={toggleStatus}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              review.status === 'VISIBLE' 
                ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40' 
                : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40'
            }`}
          >
            {review.status === 'VISIBLE' ? (
              <><EyeOff className="w-4 h-4" /> Masquer l'avis</>
            ) : (
              <><Eye className="w-4 h-4" /> Publier l'avis</>
            )}
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Colonne Principale */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Contenu de l'Avis</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                review.status === 'VISIBLE' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {review.status === 'VISIBLE' ? 'Publique' : 'Masqué (Modéré)'}
              </span>
            </div>

            <div className="flex items-center gap-1 text-orange-500 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-6 h-6 ${i < review.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-700'}`} />
              ))}
              <span className="ml-2 font-bold text-lg text-slate-900 dark:text-white">{review.rating} / 5</span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-slate-700 dark:text-slate-300 italic">
              "{review.comment || 'Aucun commentaire textuel fourni.'}"
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="w-4 h-4" />
              Publié le {new Date(review.createdAt).toLocaleString('fr-FR', {
                day: '2-digit', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </div>
          </motion.div>

          {/* Informations sur le Trajet (Si lié) */}
          {review.booking?.trip && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Trajet Associé</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-slate-500">Date de départ</p>
                    <p className="font-medium text-slate-900 dark:text-white">
                    {new Date(review.booking.trip.departureTime).toLocaleString('fr-FR', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <Car className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-slate-500">Véhicule</p>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {review.booking.trip.vehicle?.brand || 'N/A'} {review.booking.trip.vehicle?.model || ''} - {review.booking.trip.vehicle?.plateNumber || ''}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Colonne Latérale (Utilisateurs) */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Auteur de l'avis</h2>
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push(`/dashboard/admin/users/${review.author.id}`)}>
              {review.author.avatarUrl ? (
                <img src={review.author.avatarUrl} alt={review.author.fullName} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg">
                  {review.author.fullName.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-medium text-slate-900 dark:text-white hover:text-orange-600 transition-colors">{review.author.fullName}</p>
                <p className="text-sm text-slate-500">{review.author.phone || review.author.email || 'Aucun contact'}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Destinataire</h2>
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push(`/dashboard/admin/users/${review.receiver.id}`)}>
              {review.receiver.avatarUrl ? (
                <img src={review.receiver.avatarUrl} alt={review.receiver.fullName} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center font-bold text-lg">
                  {review.receiver.fullName.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-medium text-slate-900 dark:text-white hover:text-orange-600 transition-colors">{review.receiver.fullName}</p>
                <p className="text-sm text-slate-500">{review.receiver.phone || review.receiver.email || 'Aucun contact'}</p>
              </div>
            </div>
            
            {review.booking?.trip?.driver?.user?.id === review.receiver.id && (
              <div className="mt-4 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                C'était le chauffeur du trajet
              </div>
            )}
          </motion.div>
        </div>
      </div>

    </AdminPageContainer>
  );
}

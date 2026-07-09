'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { AdminPageContainer } from '../../components/shared/AdminPageContainer';
import { AdminBreadcrumb } from '../../components/layout/AdminBreadcrumb';
import { ErrorState } from '../../components/ui/ErrorState';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { usePayments } from '../../hooks/usePayments';

import { 
  User, Clock, CreditCard, Ticket, AlertTriangle, FileJson, ChevronDown, ChevronUp 
} from 'lucide-react';

export default function PaymentDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const { transaction, isLoading, isError } = usePayments({ id: params.id as string });
  const [showPayload, setShowPayload] = useState(false);

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

  if (isError || !transaction) {
    return (
      <AdminPageContainer>
        <AdminBreadcrumb customSegments={[{ name: 'Erreur', href: '#' }]} />
        <div className="mt-6">
          <ErrorState 
            title="Transaction introuvable" 
            description="Ce paiement n'existe pas ou a été supprimé." 
            action={{ label: "Retour à la liste", onClick: () => router.push('/dashboard/admin/payments') }} 
          />
        </div>
      </AdminPageContainer>
    );
  }

  const ref = transaction.id.split('-')[0].toUpperCase();

  // Mask sensitive properties in rawPayload if they exist, assuming it's for SUPER_ADMIN
  const maskedPayload = transaction.rawPayload ? { ...transaction.rawPayload } : null;
  if (maskedPayload) {
    if (maskedPayload.secretCode) maskedPayload.secretCode = '***MASKED***';
    if (maskedPayload.passwordHash) maskedPayload.passwordHash = '***MASKED***';
    if (maskedPayload.pinHash) maskedPayload.pinHash = '***MASKED***';
    if (maskedPayload.phone && typeof maskedPayload.phone === 'string') {
        maskedPayload.phone = maskedPayload.phone.replace(/.(?=.{4})/g, '*');
    }
  }

  return (
    <AdminPageContainer>
      <AdminBreadcrumb customSegments={[{ name: `Transaction #${ref}`, href: `/dashboard/admin/payments/${transaction.id}` }]} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-6 mt-6"
      >
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-semibold">Provider Simulé</h4>
            <p className="text-sm opacity-90 mt-1">
              Les transactions affichées ne sont pas réelles. Il n'y a aucune intégration externe de Wave ou Orange Money connectée pour le moment.
            </p>
          </div>
        </div>

        {/* Header Card */}
        <div className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <CreditCard className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Transaction #{ref}
              </h1>
              <p className="text-slate-500 mt-1 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Créé le {new Date(transaction.createdAt).toLocaleString('fr-FR')}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{transaction.amount} {transaction.currency}</span>
            <StatusBadge label={transaction.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Détails Paiement */}
          <div className="bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-slate-400" />
              Détails Financiers
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Montant total</span>
                <span className="font-bold text-emerald-600">{transaction.amount} {transaction.currency}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Méthode de paiement</span>
                <span className="font-medium text-slate-900 dark:text-white">{transaction.method}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Réf. Provider (Simulé)</span>
                <span className="font-mono text-xs text-slate-900 dark:text-white">{transaction.providerRef || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Utilisateur et Billet */}
          <div className="bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-slate-400" />
              Utilisateur Associé
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Nom Complet</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {transaction.user ? `${transaction.user.firstName} ${transaction.user.lastName}` : 'Non assigné'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Téléphone</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {transaction.user?.phone || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-2 items-center">
                <span className="text-slate-500 flex items-center gap-1">
                  <Ticket className="w-4 h-4" /> Billet Associé
                </span>
                {transaction.bookingId ? (
                  <button 
                    onClick={() => router.push(`/dashboard/admin/bookings/${transaction.bookingId}`)}
                    className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Voir la réservation
                  </button>
                ) : (
                  <span className="text-slate-400">Aucun billet</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Raw Payload Section for Super Admin */}
        {maskedPayload && (
          <div className="bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <button 
              onClick={() => setShowPayload(!showPayload)}
              className="w-full flex items-center justify-between p-6 bg-slate-50 dark:bg-[#1a1a1a] hover:bg-slate-100 dark:hover:bg-[#222] transition"
            >
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileJson className="w-5 h-5 text-slate-400" />
                Données Brutes (Super Admin)
              </h3>
              {showPayload ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
            </button>
            
            {showPayload && (
              <div className="p-6 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500 mb-4">
                  Ces données représentent la réponse simulée du provider. Les données sensibles (hash, PIN) sont masquées.
                </p>
                <div className="bg-slate-900 p-4 rounded-xl overflow-x-auto">
                  <pre className="text-xs text-emerald-400 font-mono">
                    {JSON.stringify(maskedPayload, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

      </motion.div>
    </AdminPageContainer>
  );
}

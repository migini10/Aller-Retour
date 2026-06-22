'use client';

import React from 'react';
import { Package, ArrowLeft, ArrowRight, Tag, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function VoyagezLegerPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between p-4 max-w-lg mx-auto">
          <Link href="/dashboard/client" className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-lg font-bold">Offre Exclusive</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-400 p-8 text-white shadow-2xl shadow-emerald-500/20">
          <div className="absolute -bottom-8 -right-8 w-40 h-40 opacity-20">
            <Tag className="w-full h-full" />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-sm font-bold mb-4 uppercase tracking-wider">
              Promo de la Semaine
            </div>
            <h2 className="text-4xl font-black mb-2 tracking-tight">Voyagez Léger</h2>
            <p className="text-lg text-emerald-50 max-w-[250px] leading-snug">
              Profitez de <strong className="font-bold text-white">-10% de réduction</strong> sur tous vos envois de colis cette semaine.
            </p>
          </div>
        </div>

        {/* Pourquoi envoyer avec Allogoo */}
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-xl mb-4">Pourquoi envoyer avec Allogoo ?</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-500" />
              </div>
              <div>
                <h4 className="font-bold text-base">Livraison Rapide</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Vos colis sont confiés à des chauffeurs qui font le trajet le jour même.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
              </div>
              <div>
                <h4 className="font-bold text-base">Hautement Sécurisé</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tous nos chauffeurs sont vérifiés et votre colis est tracé de bout en bout.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                <Tag className="w-6 h-6 text-blue-600 dark:text-blue-500" />
              </div>
              <div>
                <h4 className="font-bold text-base">Prix Fixe Imbattable</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Fini les négociations à la gare routière, le prix est connu à l'avance.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Comment ça marche */}
        <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-xl mb-4">Comment en profiter ?</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Cliquez sur le bouton "Envoyer un colis" ci-dessous.</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Renseignez les détails du colis et la destination.</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>La réduction de 10% s'appliquera automatiquement au paiement.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent dark:from-[#0B1120] dark:via-[#0B1120] z-40">
        <div className="max-w-lg mx-auto">
          <Link href="/dashboard/client/colis/franchise" className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 px-6 rounded-2xl transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-2xl">
            <Package className="w-5 h-5" />
            Envoyer un colis maintenant
            <ArrowRight className="w-5 h-5 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

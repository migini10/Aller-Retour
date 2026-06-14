'use client';
import React from 'react';
import { Truck, ArrowLeft, Info, ShieldCheck, Scale, History } from 'lucide-react';
import Link from 'next/link';

export default function ColisFranchisePage() {
  return (
    <div className="flex-1 w-full pb-20 bg-slate-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/client/colis" className="w-10 h-10 rounded-full bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333] flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#222] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <Truck className="w-7 h-7 text-blue-500" /> Franchise Incluse
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Détails sur votre allocation de poids gratuite.</p>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-blue-900/20 mb-8">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <Scale className="absolute -bottom-6 -right-6 w-32 h-32 text-white/10 -rotate-12" />
          
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-blue-200 font-medium mb-1">Reste disponible</p>
              <h2 className="text-5xl font-black tracking-tight">15 <span className="text-2xl text-blue-300">kg</span></h2>
            </div>
            <div className="w-full sm:w-1/2 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex justify-between text-sm mb-2">
                <span>Utilisé: 5 kg</span>
                <span>Total: 20 kg</span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2 w-1/4"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-4">
              <Info className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Comment ça marche ?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              En tant que client Premium Allo Dakar, vous bénéficiez d'une franchise de 20 kg par mois pour l'envoi de vos petits colis interurbains sans frais supplémentaires.
            </p>
          </div>

          <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Renouvellement</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Votre franchise est réinitialisée automatiquement le 1er de chaque mois. Les kilos non utilisés ne sont pas reportés au mois suivant.
            </p>
          </div>
        </div>

        {/* History */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-slate-400" /> Historique d'utilisation
        </h3>
        <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 dark:border-[#222] flex justify-between items-center bg-slate-50/50 dark:bg-[#1A1A1A]">
            <span className="text-sm font-medium text-slate-500">Date</span>
            <span className="text-sm font-medium text-slate-500">Poids déduit</span>
          </div>
          <div className="p-4 flex justify-between items-center border-b border-slate-100 dark:border-[#222]">
            <span className="text-sm text-slate-900 dark:text-white font-medium">12 Mai 2026</span>
            <span className="text-sm font-bold text-red-500">- 5 kg</span>
          </div>
          <div className="p-8 text-center text-slate-500 text-sm">
            Fin de l'historique de ce mois.
          </div>
        </div>

      </div>
    </div>
  );
}

'use client';
import React from 'react';
import { Bus, Route, MapPin, Navigation, Wallet, ArrowUpRight, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function SectionAccueil() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-orange-50 dark:from-orange-600/20 via-white dark:via-[#101728] to-slate-50 dark:to-[#101728] border border-orange-200 dark:border-orange-500/20 rounded-3xl p-6 transition-colors">
        <p className="text-orange-600 dark:text-orange-400 font-semibold mb-1">Bonjour, Moussa</p>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">Prêt pour votre journée ?</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-lg transition-colors">Vous avez 1 trajet programmé aujourd'hui. Assurez-vous d'avoir validé tous vos documents.</p>
        
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-colors flex items-center gap-2">
            <Route className="w-4 h-4" /> Voir mon prochain trajet
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Prochain Trajet */}
        <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A]/80 rounded-2xl p-5 lg:col-span-2 transition-colors">
          <h3 className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-4 flex items-center gap-2 transition-colors"><MapPin className="w-4 h-4 text-orange-500 dark:text-orange-400" /> Prochain Trajet</h3>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Dakar → Touba</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">Départ à 14:30 • Bus 50 places</p>
              <div className="mt-3 inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-500/20">
                <Navigation className="w-3.5 h-3.5" /> 45 passagers prévus
              </div>
            </div>
            <div className="shrink-0">
              <button className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 dark:bg-[#1A1A1A] dark:hover:bg-[#222222] border border-slate-200 dark:border-[#333333] text-slate-900 dark:text-white font-bold py-2 px-4 rounded-xl text-sm transition-colors">
                Gérer le manifeste
              </button>
            </div>
          </div>
        </div>

        {/* Résumé du jour */}
        <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A]/80 rounded-2xl p-5 transition-colors">
          <h3 className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-4 flex items-center gap-2 transition-colors"><TrendingUp className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> Activité du Jour</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Revenus</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white transition-colors">45 000 FCFA</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Trajets</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white transition-colors">1 / 2</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Distance</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white transition-colors">120 km</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

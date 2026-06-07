'use client';
import React from 'react';
import { Bus, Route, MapPin, Navigation, Wallet, ArrowUpRight, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function SectionAccueil() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Hero Banner */}
      <div className="relative bg-gradient-to-br from-slate-900 to-black dark:from-[#0A0A0A] dark:to-black rounded-3xl p-6 sm:p-8 lg:p-10 text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-wider text-orange-400 border border-white/10 uppercase">
              Statut: En Ligne
            </span>
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-wider text-emerald-400 border border-white/10 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Véhicule Inspecté
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-4">
            Bonjour Moussa 👋
          </h2>
          <p className="text-slate-400 mt-2 text-base sm:text-lg max-w-xl leading-relaxed">
            Vous avez <strong className="text-white">1 trajet programmé</strong> aujourd'hui. Assurez-vous d'avoir validé tous vos documents avant de démarrer.
          </p>
          
          <div className="mt-8 flex flex-wrap gap-4">
            <button className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2 group">
              <Route className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" /> 
              Démarrer ma journée
            </button>
            <button className="bg-white/10 hover:bg-white/15 backdrop-blur-md text-white font-bold py-3 px-6 rounded-xl transition-all border border-white/10 flex items-center gap-2">
              <Wallet className="w-5 h-5" /> 
              Voir mes gains
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Prochain Trajet (Main Focus) */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-3xl p-6 sm:p-8 shadow-xl h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 pointer-events-none">
              <Bus className="w-48 h-48 -rotate-12 translate-x-8 -translate-y-8" />
            </div>
            
            <h3 className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-6 flex items-center gap-2 relative z-10">
              <MapPin className="w-4 h-4 text-orange-500" /> Prochain Départ
            </h3>
            
            <div className="flex-1 flex flex-col justify-center relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Dakar</span>
                    <ArrowUpRight className="w-6 h-6 text-orange-500" />
                    <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Touba</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Départ prévu à 14:30 • Arrivée estimée à 17:45</p>
                </div>
                
                <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-2xl p-4 text-center shrink-0 min-w-[120px]">
                  <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">Passagers</p>
                  <p className="text-3xl font-black text-orange-600 dark:text-orange-400">45<span className="text-lg text-orange-500/70">/50</span></p>
                </div>
              </div>
              
              <div className="w-full bg-slate-100 dark:bg-[#1A1A1A] rounded-full h-3 mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-amber-400 h-3 rounded-full relative" style={{ width: '90%' }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md"></div>
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium flex items-center justify-between">
                <span>Remplissage: 90%</span>
                <span className="text-emerald-500 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Prêt au départ</span>
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-[#2A2A2A] relative z-10 flex gap-4">
              <button className="flex-1 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold py-3 px-4 rounded-xl transition-colors">
                Gérer le manifeste
              </button>
              <button className="px-4 py-3 bg-slate-100 dark:bg-[#1A1A1A] hover:bg-slate-200 dark:hover:bg-[#222] text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors">
                <Navigation className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Résumé du jour */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-3xl p-6 sm:p-8 shadow-xl h-full flex flex-col">
            <h3 className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Mon Activité
            </h3>
            
            <div className="space-y-6 flex-1">
              <div className="p-5 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 rounded-2xl">
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold mb-1">Revenus du jour</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  45 000 <span className="text-lg text-slate-500 font-bold">CFA</span>
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-[#1A1A1A] border border-slate-100 dark:border-[#2A2A2A] rounded-2xl">
                  <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">Trajets</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">1<span className="text-sm text-slate-400">/2</span></p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-[#1A1A1A] border border-slate-100 dark:border-[#2A2A2A] rounded-2xl">
                  <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">Distance</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">120<span className="text-sm text-slate-400">km</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

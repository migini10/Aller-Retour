'use client';

import React from 'react';
import { ArrowLeft, Package, Plus, Search, CheckCircle2, Box, Truck, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ColisPage() {
  return (
    <div className="h-full min-w-0 overflow-y-auto overscroll-contain scrollbar-hide flex flex-col items-center bg-slate-50 dark:bg-black transition-colors duration-300">
      <div className="w-full max-w-[1200px] px-5 sm:px-8 lg:px-12 py-8 pb-24 space-y-8 animate-fade-in">
        
        {/* Header with Back Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200 dark:border-[#2A2A2A]">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/client" className="p-2.5 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <Package className="w-7 h-7 text-purple-500" /> Mes Colis
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Gérez et suivez l'expédition de vos colis à travers le pays.</p>
            </div>
          </div>
          <button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3.5 rounded-2xl transition-colors shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Nouveau Colis
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-purple-500/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Box className="w-5 h-5 text-purple-500" />
              </div>
              <span className="bg-slate-100 dark:bg-[#222222] text-slate-600 dark:text-slate-400 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Total</span>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">12</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Colis envoyés (Année)</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-amber-500/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Actif</span>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">1</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">En cours d'expédition</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-emerald-500/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">11</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Colis livrés</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-blue-500/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">15kg</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Franchise incluse restante</p>
            </div>
          </div>
        </div>

        {/* Tracking Section */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl shadow-purple-900/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl font-bold mb-2">Suivre un colis</h2>
            <p className="text-purple-200 text-sm mb-6">Entrez le numéro de suivi de votre colis pour connaître son statut en temps réel.</p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300 group-focus-within:text-white transition-colors" />
                <input 
                  type="text" 
                  placeholder="Ex: COL-894-D15" 
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 focus:border-white transition-all rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-purple-300 text-sm font-medium outline-none shadow-inner"
                />
              </div>
              <button className="bg-white text-purple-600 hover:bg-slate-50 font-bold px-8 py-4 rounded-xl transition-colors shadow-lg whitespace-nowrap">
                Rechercher
              </button>
            </div>
          </div>
        </div>

        {/* Active Parcels List */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Colis Récents</h2>
          
          <div className="space-y-4">
            {/* Active Parcel */}
            <div className="bg-white dark:bg-[#141414] border border-purple-500/30 hover:border-purple-500/60 rounded-3xl p-6 transition-all shadow-sm flex flex-col md:flex-row gap-6">
              <div className="flex-1 flex flex-col md:flex-row gap-6">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Truck className="w-8 h-8 text-amber-500" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Dakar <ArrowRight className="w-4 h-4 inline text-slate-400" /> Saint-Louis</h3>
                    <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">En transit</span>
                  </div>
                  <p className="text-sm font-mono text-slate-500 dark:text-slate-400 mb-4">Réf: COL-894-D15 • 12 kg</p>
                  
                  {/* Progress bar */}
                  <div className="relative pt-4 w-full max-w-md hidden sm:block">
                    <div className="absolute top-0 left-0 w-full flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                      <span>Dépôt</span>
                      <span className="text-amber-500">En route</span>
                      <span>Livré</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-[#222222] rounded-full h-2 mt-2 relative">
                      <div className="bg-amber-500 h-2 rounded-full absolute top-0 left-0" style={{ width: '50%' }}></div>
                      <div className="w-4 h-4 rounded-full bg-white border-4 border-amber-500 absolute top-1/2 -translate-y-1/2 shadow-md" style={{ left: '50%', transform: 'translate(-50%, -50%)' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:border-l md:border-slate-200 md:dark:border-[#2A2A2A] md:pl-6 flex flex-col justify-center shrink-0 gap-3">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  <p className="font-bold text-slate-900 dark:text-white text-base">Destinataire</p>
                  <p>Moussa Diop</p>
                  <p className="font-mono text-xs mt-0.5">+221 77 123 45 67</p>
                </div>
                <button className="w-full bg-slate-50 dark:bg-[#1A1A1A] hover:bg-slate-100 dark:bg-[#222222] border border-slate-200 dark:border-[#333333] text-slate-900 dark:text-white font-bold py-2.5 rounded-xl text-xs transition-colors">
                  Détails
                </button>
              </div>
            </div>

            {/* Delivered Parcel */}
            <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-3xl p-6 transition-all shadow-sm flex flex-col md:flex-row gap-6 opacity-75 grayscale-[20%] hover:grayscale-0">
              <div className="flex-1 flex flex-col md:flex-row gap-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Dakar <ArrowRight className="w-4 h-4 inline text-slate-400" /> Thiès</h3>
                    <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">Livré</span>
                  </div>
                  <p className="text-sm font-mono text-slate-500 dark:text-slate-400 mb-4">Réf: COL-112-A89 • 5 kg • Il y a 3 jours</p>
                </div>
              </div>
              <div className="md:border-l md:border-slate-200 md:dark:border-[#2A2A2A] md:pl-6 flex flex-col justify-center shrink-0 gap-3">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  <p className="font-bold text-slate-900 dark:text-white text-base">Destinataire</p>
                  <p>Aminata Fall</p>
                </div>
                <button className="w-full bg-slate-50 dark:bg-[#1A1A1A] hover:bg-slate-100 dark:bg-[#222222] border border-slate-200 dark:border-[#333333] text-slate-900 dark:text-white font-bold py-2.5 rounded-xl text-xs transition-colors">
                  Reçu
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

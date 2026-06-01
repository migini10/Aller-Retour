'use client';

import React, { useState } from 'react';
import { ArrowLeft, Search, X, List, LayoutGrid, CheckCircle2, Calendar, Clock, ArrowUpRight, Building2, Bus, Eye, Download, Share2, QrCode } from 'lucide-react';
import Link from 'next/link';
import QRCodeBrandEngine from '../../../../../components/QRCodeBrandEngine';

export default function QrCodePage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="h-full min-w-0 overflow-y-auto overscroll-contain scrollbar-hide flex flex-col items-center bg-slate-50 dark:bg-black transition-colors duration-300">
      <div className="w-full max-w-[1200px] px-5 sm:px-8 lg:px-12 py-8 pb-24 space-y-8 animate-fade-in">
        
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-200 dark:border-[#2A2A2A]">
          <Link href="/dashboard/client" className="p-2.5 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <QrCode className="w-7 h-7 text-orange-500" /> Mes QR codes
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Vos billets, réservations et historiques de voyage.</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
             <div className="flex items-center gap-3">
               <h2 className="text-lg font-bold text-slate-900 dark:text-white">Liste de mes QR codes</h2>
               <span className="bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold px-3 py-1.5 rounded-full border border-orange-500/30">1 Billet actif</span>
             </div>
             <div className="flex items-center gap-1 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl p-1 shadow-sm">
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-slate-100 dark:bg-[#222222] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'}`}>
                   <List className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-slate-100 dark:bg-[#222222] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'}`}>
                   <LayoutGrid className="w-4 h-4" />
                </button>
             </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Rechercher un QR code, téléphone ou trajet..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] hover:border-orange-500/50 focus:border-orange-500 transition-all rounded-2xl pl-12 pr-12 py-4 text-slate-900 dark:text-white text-sm outline-none shadow-sm focus:shadow-[0_0_15px_rgba(234,88,12,0.1)]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 dark:bg-[#222222] rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-700 transition-colors">
                 <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          
          {viewMode === 'list' ? (
             <div className="flex flex-col gap-4">
               {/* Ticket 1 */}
               <div className="bg-white dark:bg-[#141414] border border-orange-500/40 hover:border-orange-500/80 rounded-2xl p-5 flex flex-col md:flex-row justify-between md:items-center gap-5 transition-all shadow-sm hover:shadow-lg hover:shadow-orange-500/10">
                 <div className="flex items-center gap-5">
                    <div className="shrink-0 p-2 bg-white rounded-xl shadow-sm border border-slate-100 dark:border-none">
                       <QRCodeBrandEngine value="AR-74892374" size={56} />
                    </div>
                    <div>
                       <div className="flex items-center gap-3 mb-1.5">
                          <span className="text-slate-900 dark:text-white font-black text-base sm:text-lg">Dakar ➔ Touba</span>
                          <span className="text-[10px] bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-md font-mono border border-orange-500/20">AR-74892374</span>
                       </div>
                       <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                         <Calendar className="w-3.5 h-3.5" /> 18 Mai 2026 • <Clock className="w-3.5 h-3.5 ml-1" /> 08:00 • Siège #14 (VIP)
                       </p>
                       <p className="text-xs text-slate-500 mt-1 font-medium">Sénégal Express • Abdoulaye Ndiaye</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 md:shrink-0 mt-2 md:mt-0">
                     <button className="flex-1 md:flex-none p-2.5 md:px-4 bg-slate-50 dark:bg-[#1A1A1A] hover:bg-slate-100 dark:bg-[#222222] border border-slate-200 dark:border-[#333333] text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors flex justify-center items-center gap-2">
                        <Eye className="w-4 h-4" /> <span className="hidden sm:inline">Détails</span>
                     </button>
                     <button className="flex-1 md:flex-none p-2.5 md:px-4 bg-slate-50 dark:bg-[#1A1A1A] hover:bg-slate-100 dark:bg-[#222222] border border-slate-200 dark:border-[#333333] text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors flex justify-center items-center gap-2">
                        <Download className="w-4 h-4" /> <span className="hidden sm:inline">Télécharger</span>
                     </button>
                     <button className="flex-1 md:flex-none p-2.5 md:px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-orange-600/20 flex justify-center items-center gap-2">
                        <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Partager</span>
                     </button>
                 </div>
               </div>
               
               {/* Ticket 2 */}
               <div className="bg-white dark:bg-[#141414]/50 border border-slate-200 dark:border-[#2A2A2A]/50 rounded-2xl p-5 flex flex-col md:flex-row justify-between md:items-center gap-5 opacity-75 grayscale-[30%] hover:grayscale-0 transition-all">
                 <div className="flex items-center gap-5">
                    <div className="shrink-0 p-2 bg-white rounded-xl shadow-sm opacity-60">
                       <QRCodeBrandEngine value="AR-12984756" size={56} />
                    </div>
                    <div>
                       <div className="flex items-center gap-3 mb-1.5">
                          <span className="text-slate-700 dark:text-slate-300 font-bold text-base sm:text-lg">Touba ➔ Dakar</span>
                          <span className="text-[10px] bg-slate-100 dark:bg-[#222222] text-slate-500 px-2 py-0.5 rounded-md font-mono border border-slate-200 dark:border-[#333333]">AR-12984756</span>
                       </div>
                       <p className="text-sm text-slate-500">10 Mai 2026 • 14:30 • Siège #02 (VIP)</p>
                       <p className="text-xs text-slate-500 mt-1">Sénégal Express • Abdoulaye Ndiaye</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 md:shrink-0 mt-2 md:mt-0">
                     <button className="flex-1 md:flex-none w-full md:w-auto p-2.5 px-6 bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] text-slate-600 dark:text-slate-400 rounded-xl text-sm font-medium transition-colors flex justify-center items-center gap-2">
                        <Eye className="w-4 h-4" /> Historique
                     </button>
                 </div>
               </div>
             </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A]/80 rounded-3xl overflow-hidden relative shadow-xl">
               {/* Status Banner */}
               <div className="bg-orange-600 px-5 py-2.5 text-xs font-bold text-white flex justify-between items-center">
                 <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Statut: Confirmé (Escrow)</span>
                 <span className="font-mono tracking-wider">Réf: AR-74892374</span>
               </div>
               
               <div className="p-6">
                  {/* Top section: Route & QR */}
                  <div className="flex justify-between items-start mb-6">
                     <div>
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-2">
                           <Calendar className="w-4 h-4 text-orange-500" /> 18 Mai 2026
                           <span className="mx-1">•</span>
                           <Clock className="w-4 h-4 text-orange-500" /> 08:00
                        </div>
                        <div className="flex items-center gap-3">
                           <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Dakar</h3>
                           <ArrowUpRight className="w-6 h-6 text-orange-500" />
                           <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Touba</h3>
                        </div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-1.5">
                           <Building2 className="w-4 h-4 text-slate-400" /> Sénégal Express
                        </p>
                     </div>
                     <div className="shrink-0 p-2 bg-white rounded-2xl shadow-sm border border-slate-100 dark:border-none">
                        <QRCodeBrandEngine value="AR-74892374" size={80} />
                     </div>
                  </div>
                  
                  {/* Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4 py-6 border-y border-slate-100 dark:border-[#2A2A2A]/80 mb-6 bg-slate-50/50 dark:bg-transparent -mx-6 px-6">
                     <div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 font-bold">N° Billet</p>
                        <p className="text-sm font-black text-slate-900 dark:text-white">TKT-0014</p>
                     </div>
                     <div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 font-bold">Siège</p>
                        <p className="text-sm font-black text-orange-500">#14 (VIP)</p>
                     </div>
                     <div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 font-bold">Passager</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">Abdoulaye Ndiaye</p>
                     </div>
                     <div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 font-bold">Véhicule</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                           <Bus className="w-4 h-4 text-slate-400" /> Bus Climatisé
                        </p>
                     </div>
                     <div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 font-bold">Montant Payé</p>
                        <p className="text-sm font-black text-slate-900 dark:text-white">4 500 FCFA</p>
                     </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-3">
                     <button className="flex-1 bg-slate-50 dark:bg-[#1A1A1A] hover:bg-slate-100 dark:bg-[#222222] border border-slate-200 dark:border-[#333333] text-slate-900 dark:text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" /> Détails
                     </button>
                     <button className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" /> Télécharger
                     </button>
                  </div>
               </div>
            </div>
            
            {/* Ticket 2 (historique) */}
            <div className="bg-white dark:bg-[#141414]/50 border border-slate-200 dark:border-[#2A2A2A]/50 rounded-3xl overflow-hidden relative opacity-75 grayscale-[30%]">
               <div className="bg-slate-200 dark:bg-[#222222] px-5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 flex justify-between items-center">
                 <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Statut: Terminé</span>
                 <span className="font-mono tracking-wider">Réf: AR-12984756</span>
               </div>
               
               <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                     <div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                           <Calendar className="w-4 h-4 text-slate-400" /> 10 Mai 2026
                           <span className="mx-1">•</span>
                           <Clock className="w-4 h-4 text-slate-400" /> 14:30
                        </div>
                        <div className="flex items-center gap-3">
                           <h3 className="text-2xl sm:text-3xl font-bold text-slate-700 dark:text-slate-300">Touba</h3>
                           <ArrowUpRight className="w-6 h-6 text-slate-400" />
                           <h3 className="text-2xl sm:text-3xl font-bold text-slate-700 dark:text-slate-300">Dakar</h3>
                        </div>
                     </div>
                     <div className="shrink-0 p-2 bg-white/50 rounded-2xl opacity-60">
                        <QRCodeBrandEngine value="AR-12984756" size={80} />
                     </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-[#2A2A2A]/50">
                     <button className="w-full bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] text-slate-600 dark:text-slate-400 font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" /> Voir l'historique complet
                     </button>
                  </div>
               </div>
             </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

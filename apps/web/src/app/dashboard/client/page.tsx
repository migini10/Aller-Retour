'use client';

import React, { useState } from 'react';
import { 
  QrCode, Wallet, Award, Package, ArrowUpRight, ArrowDownLeft, Sparkles, CheckCircle2,
  Share2, Download, Eye, MessageCircle, Mail, Bluetooth, X, MapPin, Calendar, Clock, User, Bus, Building2, CreditCard,
  List, LayoutGrid, Search, FilterX
} from 'lucide-react';
import QRCodeBrandEngine from '../../../components/QRCodeBrandEngine';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<'trips' | 'wallet' | 'miles' | 'luggage'>('trips');
  const [showShareModal, setShowShareModal] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tous');
  const [filterDate, setFilterDate] = useState('Aujourd\'hui');
  const [filterType, setFilterType] = useState('Tous');

  const STATUS_OPTIONS = ['Tous', 'Actif', 'Utilisé', 'Annulé'];
  const DATE_OPTIONS = ['Aujourd\'hui', 'Cette semaine', 'Ce mois'];
  const TYPE_OPTIONS = ['Tous', 'Bus', 'Taxi', 'Covoiturage'];

  const tabs = [
    { id: 'trips', label: 'Billets QR', icon: QrCode },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'miles', label: 'Miles', icon: Award },
    { id: 'luggage', label: 'Bagages', icon: Package },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="pb-5 border-b border-slate-800">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Espace Voyageur</h1>
            <p className="text-slate-400 text-sm mt-1">Gérez vos billets QR, recharges Wave/OM et Miles de fidélité.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="bg-orange-500/10 border border-orange-500/30 px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-sm">
              <Wallet className="w-5 h-5 text-orange-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Solde Wallet (XOF)</p>
                <p className="text-base font-bold text-white">45 000 FCFA</p>
              </div>
            </div>
            <button className="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
              <Sparkles className="w-4 h-4" /> Recharger via Wave
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap shrink-0 transition-all ${
                activeTab === t.id
                  ? 'bg-orange-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'trips' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-2">
             <div className="flex items-center gap-3">
               <h2 className="text-lg font-bold text-white">Liste de mes billets</h2>
               <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-full border border-orange-500/30">1 Billet actif</span>
             </div>
             <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 w-fit">
                <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                   <List className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                   <LayoutGrid className="w-4 h-4" />
                </button>
             </div>
          </div>
          
          {/* Search & Filters */}
          <div className="sticky top-0 z-10 bg-[#0B0F19]/95 backdrop-blur-xl py-3 space-y-3 mb-5 -mx-2 px-2 border-b border-slate-800/80">
            {/* Search Bar */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Rechercher un billet, téléphone ou trajet..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#101728] border border-slate-800 hover:border-orange-500/50 focus:border-orange-500 transition-all rounded-2xl pl-12 pr-12 py-3.5 text-white text-sm outline-none shadow-sm focus:shadow-[0_0_15px_rgba(234,88,12,0.1)]"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                   <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 items-center">
               <div className="flex bg-[#101728] rounded-xl p-1 border border-slate-800/80 shadow-sm">
                  {STATUS_OPTIONS.map(s => (
                    <button 
                      key={s} 
                      onClick={() => setFilterStatus(s)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${filterStatus === s ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                    >
                      {s}
                    </button>
                  ))}
               </div>
               <div className="flex bg-[#101728] rounded-xl p-1 border border-slate-800/80 shadow-sm">
                  {DATE_OPTIONS.map(d => (
                    <button 
                      key={d} 
                      onClick={() => setFilterDate(d)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${filterDate === d ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                    >
                      {d}
                    </button>
                  ))}
               </div>
               <div className="hidden sm:flex bg-[#101728] rounded-xl p-1 border border-slate-800/80 shadow-sm">
                  {TYPE_OPTIONS.map(t => (
                    <button 
                      key={t} 
                      onClick={() => setFilterType(t)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${filterType === t ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                    >
                      {t}
                    </button>
                  ))}
               </div>

               {(filterStatus !== 'Tous' || filterDate !== 'Aujourd\'hui' || filterType !== 'Tous' || searchQuery !== '') && (
                 <button 
                   onClick={() => { setFilterStatus('Tous'); setFilterDate('Aujourd\'hui'); setFilterType('Tous'); setSearchQuery(''); }}
                   className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 bg-[#101728] hover:bg-rose-500/10 border border-slate-800/80 hover:border-rose-500/30 rounded-xl transition-all ml-auto shadow-sm"
                 >
                   <FilterX className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Réinitialiser</span>
                 </button>
               )}
            </div>
          </div>
          
          {viewMode === 'list' ? (
             <div className="flex flex-col gap-3">
               {/* Ticket 1 */}
               <div className="bg-[#101728] border border-orange-500/30 hover:border-orange-500/60 rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-colors">
                 <div className="flex items-center gap-4">
                    <div className="shrink-0">
                       <QRCodeBrandEngine value="AR-74892374" size={48} />
                    </div>
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-bold text-sm sm:text-base">Dakar ➔ Touba</span>
                          <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-md font-mono border border-orange-500/20">AR-74892374</span>
                       </div>
                       <p className="text-xs text-slate-400">18 Mai 2026 • 08:00 • Siège #14 (VIP)</p>
                       <p className="text-xs text-slate-500 mt-0.5">Sénégal Express • Abdoulaye Ndiaye</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 sm:shrink-0">
                     <button className="flex-1 sm:flex-none p-2 sm:px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors flex justify-center items-center gap-1.5">
                        <Eye className="w-4 h-4" /> <span className="hidden sm:inline">Détails</span>
                     </button>
                     <button className="flex-1 sm:flex-none p-2 sm:px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors flex justify-center items-center gap-1.5">
                        <Download className="w-4 h-4" /> <span className="hidden sm:inline">Billet</span>
                     </button>
                     <button onClick={() => setShowShareModal(true)} className="flex-1 sm:flex-none p-2 sm:px-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm flex justify-center items-center gap-1.5">
                        <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Partager</span>
                     </button>
                 </div>
               </div>
               
               {/* Ticket 2 */}
               <div className="bg-[#101728]/50 border border-slate-800/50 rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 opacity-75 grayscale-[30%]">
                 <div className="flex items-center gap-4">
                    <div className="shrink-0 opacity-50 grayscale">
                       <QRCodeBrandEngine value="AR-12984756" size={48} />
                    </div>
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <span className="text-slate-300 font-bold text-sm sm:text-base">Touba ➔ Dakar</span>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-mono border border-slate-700">AR-12984756</span>
                       </div>
                       <p className="text-xs text-slate-500">10 Mai 2026 • 14:30 • Siège #02 (VIP)</p>
                       <p className="text-xs text-slate-500 mt-0.5">Sénégal Express • Abdoulaye Ndiaye</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 sm:shrink-0">
                     <button className="flex-1 sm:flex-none w-full sm:w-auto p-2 px-4 bg-slate-900 border border-slate-800 text-slate-400 rounded-lg text-xs font-medium transition-colors flex justify-center items-center gap-1.5">
                        <Eye className="w-4 h-4" /> Historique
                     </button>
                 </div>
               </div>
             </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-[#101728] border border-slate-800/80 rounded-2xl overflow-hidden relative shadow-lg">
               {/* Status Banner */}
               <div className="bg-orange-600 px-4 py-2 text-xs font-semibold text-white flex justify-between items-center">
                 <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Statut: Confirmé (Escrow)</span>
                 <span className="font-mono">Réf: AR-74892374</span>
               </div>
               
               <div className="p-5">
                  {/* Top section: Route & QR */}
                  <div className="flex justify-between items-start mb-5">
                     <div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs mb-1.5">
                           <Calendar className="w-3.5 h-3.5 text-orange-400" /> 18 Mai 2026
                           <span className="mx-1">•</span>
                           <Clock className="w-3.5 h-3.5 text-orange-400" /> 08:00
                        </div>
                        <div className="flex items-center gap-3">
                           <h3 className="text-xl sm:text-2xl font-black text-white">Dakar</h3>
                           <ArrowUpRight className="w-5 h-5 text-orange-400" />
                           <h3 className="text-xl sm:text-2xl font-black text-white">Touba</h3>
                        </div>
                        <p className="text-sm text-slate-400 mt-2 flex items-center gap-1.5">
                           <Building2 className="w-4 h-4 text-slate-500" /> Sénégal Express
                        </p>
                     </div>
                     <div className="shrink-0 scale-75 sm:scale-100 origin-top-right">
                        <QRCodeBrandEngine value="AR-74892374" size={72} />
                     </div>
                  </div>
                  
                  {/* Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-3 py-5 border-y border-slate-800/80 mb-5">
                     <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">N° Billet</p>
                        <p className="text-sm font-semibold text-white">TKT-0014</p>
                     </div>
                     <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Siège</p>
                        <p className="text-sm font-bold text-orange-400">#14 (VIP)</p>
                     </div>
                     <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Passager</p>
                        <p className="text-sm font-semibold text-white truncate">Abdoulaye Ndiaye</p>
                     </div>
                     <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Véhicule</p>
                        <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                           <Bus className="w-3.5 h-3.5 text-slate-400" /> Bus Climatisé
                        </p>
                     </div>
                     <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Montant Payé</p>
                        <p className="text-sm font-semibold text-white">4 500 FCFA</p>
                     </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                     <button className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-medium py-2.5 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5">
                        <Eye className="w-4 h-4" /> Détails
                     </button>
                     <button className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-medium py-2.5 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5">
                        <Download className="w-4 h-4" /> Billet QR
                     </button>
                     <button onClick={() => setShowShareModal(true)} className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-medium py-2.5 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                        <Share2 className="w-4 h-4" /> Partager
                     </button>
                  </div>
               </div>
            </div>
            
            {/* Ticket 2 (historique) */}
            <div className="bg-[#101728]/50 border border-slate-800/50 rounded-2xl overflow-hidden relative opacity-75 grayscale-[30%]">
               <div className="bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 flex justify-between items-center">
                 <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Statut: Terminé</span>
                 <span className="font-mono">Réf: AR-12984756</span>
               </div>
               
               <div className="p-5">
                  <div className="flex justify-between items-start mb-5">
                     <div>
                        <div className="flex items-center gap-2 text-slate-500 text-xs mb-1.5">
                           <Calendar className="w-3.5 h-3.5 text-slate-500" /> 10 Mai 2026
                           <span className="mx-1">•</span>
                           <Clock className="w-3.5 h-3.5 text-slate-500" /> 14:30
                        </div>
                        <div className="flex items-center gap-3">
                           <h3 className="text-xl sm:text-2xl font-bold text-slate-300">Touba</h3>
                           <ArrowUpRight className="w-5 h-5 text-slate-500" />
                           <h3 className="text-xl sm:text-2xl font-bold text-slate-300">Dakar</h3>
                        </div>
                     </div>
                     <div className="shrink-0 scale-75 sm:scale-100 origin-top-right opacity-50 grayscale">
                        <QRCodeBrandEngine value="AR-12984756" size={72} />
                     </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                     <button className="flex-1 bg-slate-900 border border-slate-800 text-slate-400 font-medium py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" /> Historique
                     </button>
                  </div>
               </div>
             </div>
            </div>
          )}
        </div>
      )}

      {/* Wallet Tab Content */}
      {activeTab === 'wallet' && (
        <div className="bg-[#101728] border border-slate-800/80 p-5 sm:p-6 rounded-2xl max-w-2xl animate-fade-in">
          <h2 className="text-base font-bold text-white mb-5">Transactions & Séquestre Escrow</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Dépôt Wave Mobile Money</p>
                  <p className="text-xs text-slate-400">17 Mai 2026 • Réf: wav_74892374</p>
                </div>
              </div>
              <p className="font-bold text-orange-400 text-sm shrink-0 ml-2">+ 15 000 FCFA</p>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Réservation Dakar - Touba</p>
                  <p className="text-xs text-amber-400">Fonds bloqués en séquestre</p>
                </div>
              </div>
              <p className="font-bold text-amber-400 text-sm shrink-0 ml-2">- 4 500 FCFA</p>
            </div>
          </div>
        </div>
      )}

      {/* Miles Tab Content */}
      {activeTab === 'miles' && (
        <div className="bg-[#101728] border border-slate-800/80 p-5 sm:p-6 rounded-2xl max-w-sm animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Solde Miles Fidélité</p>
              <p className="text-2xl font-bold text-white">450 pts</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">Prochain palier : 550 pts pour un billet gratuit Dakar ➔ Thiès.</p>
        </div>
      )}

      {/* Luggage Tab Content */}
      {activeTab === 'luggage' && (
        <div className="bg-[#101728] border border-slate-800/80 p-5 sm:p-6 rounded-2xl max-w-sm animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Franchise Bagages</p>
              <p className="text-2xl font-bold text-white">15 kg inclus</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">Surplus : +5 kg = 1 000 FCFA (débit séquestre auto).</p>
        </div>
      )}

      {/* SHARE MODAL (BOTTOM SHEET ON MOBILE) */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0B0F19]/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#101728] border-t sm:border border-slate-800/80 rounded-t-3xl sm:rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-5 flex justify-between items-center border-b border-slate-800/80">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-orange-400" /> Partager le billet
                </h3>
                <button onClick={() => setShowShareModal(false)} className="p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
            </div>
            <div className="p-5 space-y-3">
                <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shrink-0 shadow-lg shadow-[#25D366]/20 group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                      <p className="font-bold text-white group-hover:text-[#25D366] transition-colors">WhatsApp</p>
                      <p className="text-xs text-slate-400">Envoyer via message direct</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                      <p className="font-bold text-white group-hover:text-blue-400 transition-colors">Email</p>
                      <p className="text-xs text-slate-400">Envoyer le QR code par courriel</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                      <Bluetooth className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                      <p className="font-bold text-white group-hover:text-orange-400 transition-colors">Bluetooth / AirDrop</p>
                      <p className="text-xs text-slate-400">Partager à proximité</p>
                  </div>
                </button>
            </div>
            {/* Safe area for mobile bottom */}
            <div className="h-6 sm:hidden"></div>
          </div>
        </div>
      )}
    </div>
  );
}

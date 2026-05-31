'use client';

import React, { useState } from 'react';
import { 
  TicketCheck, Printer, Camera, Search, UserCheck, 
  CheckCircle2, XCircle, QrCode, X, AlertCircle,
  MapPin, Phone, CreditCard, User, Clock, Calendar, ArrowUpRight, Building2, Bus, Eye, Download, Share2, MessageCircle, Mail, Bluetooth,
  List, LayoutGrid, FilterX
} from 'lucide-react';
import QRCodeBrandEngine from '../../../components/QRCodeBrandEngine';

type BilletState = 'idle' | 'generating' | 'success';
type ScanState = 'idle' | 'scanning' | 'valid' | 'invalid';

export default function DispatcherDashboard() {
  const [phone, setPhone] = useState('');
  const [nomClient, setNomClient] = useState('');
  const [ligne, setLigne] = useState('Dakar ➔ Touba (08:00 — 4 500 FCFA)');
  const [billetState, setBilletState] = useState<BilletState>('idle');
  const [showBilletModal, setShowBilletModal] = useState(false);

  const [scanState, setScanState] = useState<ScanState>('idle');
  const [scanCode, setScanCode] = useState('');
  const [showScanModal, setShowScanModal] = useState(false);
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

  // Génération simulée d'un billet
  const handleEmettreStep1 = () => {
    if (!nomClient.trim()) { alert('Veuillez saisir le nom complet du client.'); return; }
    if (!phone) { alert('Veuillez saisir le numéro de téléphone du client.'); return; }
    setBilletState('generating');
    setShowBilletModal(true);
    setTimeout(() => setBilletState('success'), 1800);
  };

  const resetBillet = () => {
    setBilletState('idle');
    setShowBilletModal(false);
    setPhone('');
    setNomClient('');
  };

  // Validation simulée d'un scan QR
  const handleScan = () => {
    if (!scanCode.trim()) { alert('Veuillez saisir ou coller un code QR.'); return; }
    setScanState('scanning');
    setTimeout(() => {
      // Simuler: code valide si commence par "AR-"
      setScanState(scanCode.trim().toUpperCase().startsWith('AR-') ? 'valid' : 'invalid');
    }, 1500);
  };

  const resetScan = () => {
    setScanState('idle');
    setScanCode('');
    setShowScanModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-[#2A2A2A]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Guichet & Contrôle de Gare</h1>
            <p className="text-orange-400/80 text-sm mt-1">Terminal de vente POS, impression thermique et scan QR d'embarquement.</p>
          </div>
          <button 
            onClick={() => setShowScanModal(true)}
            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            <Camera className="w-4 h-4" /> Scanner QR Billet
          </button>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#141414] border border-orange-500/20 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-orange-400">142</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Billets émis</p>
        </div>
        <div className="bg-[#141414] border border-[#2A2A2A]/80 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-white">48</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Scannés</p>
        </div>
        <div className="bg-[#141414] border border-[#2A2A2A]/80 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-amber-400">12</p>
          <p className="text-[10px] text-slate-400 mt-0.5">En attente</p>
        </div>
      </div>

      {/* POS Quick Sell & Contrôle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* POS Card */}
        <div className="lg:col-span-2 bg-[#141414] border border-[#2A2A2A]/80 p-5 sm:p-7 rounded-2xl">
          <div className="mb-5">
            <h2 className="text-base sm:text-lg font-bold text-white mb-2">Vente Express au Guichet (POS Android)</h2>
            <span className="inline-flex items-center gap-1.5 text-xs bg-orange-500/10 px-3 py-1.5 rounded-lg text-orange-400 font-medium border border-orange-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              Imprimante Sunmi V2 — Bluetooth connecté
            </span>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-xs text-orange-400 font-semibold mb-1.5 block flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Nom complet du client
              </label>
              <input
                type="text"
                placeholder="Ex: Mamadou Diallo"
                value={nomClient}
                onChange={e => setNomClient(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#333333] hover:border-orange-500/50 rounded-xl px-4 py-3 text-white text-sm font-medium focus:border-orange-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-orange-400 font-semibold mb-1.5 block flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Ligne de Départ
              </label>
              <select 
                value={ligne}
                onChange={e => setLigne(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#333333] hover:border-orange-500/50 rounded-xl px-4 py-3 text-white text-sm font-medium focus:border-orange-500 outline-none cursor-pointer transition-colors"
              >
                <option>Dakar ➔ Touba (08:00 — 4 500 FCFA)</option>
                <option>Dakar ➔ Saint-Louis (09:30 — 5 000 FCFA)</option>
                <option>Thiès ➔ Ziguinchor (11:00 — 9 000 FCFA)</option>
                <option>Touba ➔ Tambacounda (06:00 — 7 500 FCFA)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-orange-400 font-semibold mb-1.5 block flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Numéro Téléphone Client
              </label>
              <div className="relative">
                <input 
                  type="tel"
                  placeholder="Ex: 77 123 45 67" 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#333333] hover:border-orange-500/50 rounded-xl px-4 py-3 text-white text-sm font-medium focus:border-orange-500 outline-none pl-10 transition-colors"
                />
                <Search className="w-4 h-4 text-orange-400 absolute left-3.5 top-3.5" />
              </div>
            </div>
          </div>

          <button 
            onClick={handleEmettreStep1}
            className="w-full bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
          >
            <Printer className="w-4 h-4" /> Émettre Billet & Imprimer QR Thermique
          </button>
        </div>

        {/* Contrôle d'Embarquement */}
        <div className="bg-[#141414] border border-[#2A2A2A]/80 p-5 sm:p-7 rounded-2xl flex flex-col justify-center items-center text-center">
          <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/30 rounded-2xl flex items-center justify-center mb-4">
            <UserCheck className="w-7 h-7 text-orange-400" />
          </div>
          <h3 className="text-base font-bold text-white mb-2">Contrôle d'Embarquement</h3>
          <p className="text-xs text-slate-400 mb-5 leading-relaxed">Scannez le billet QR du voyageur pour valider l'embarquement.</p>
          <button
            onClick={() => setShowScanModal(true)}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Camera className="w-4 h-4" /> Scanner un billet
          </button>
          <div className="w-full bg-orange-500/10 border border-orange-500/30 p-3 rounded-xl text-orange-300 font-semibold text-xs flex items-center justify-center gap-2 mt-4">
            <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
            <span>Dernier scan : Siège #14 — Dakar ➔ Touba ✓</span>
          </div>
        </div>
      </div>

      {/* Liste des billets */}
      <div className="pt-4 border-t border-[#2A2A2A]">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-2">
          <div className="flex items-center gap-3">
             <h2 className="text-lg font-bold text-white flex items-center gap-2">
               <TicketCheck className="w-5 h-5 text-orange-400" /> Liste des billets émis
             </h2>
             <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-full border border-orange-500/30">142 Billets aujourd'hui</span>
          </div>
          <div className="flex items-center gap-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-1 w-fit">
             <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-[#222222] text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                <List className="w-4 h-4" />
             </button>
             <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[#222222] text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}>
                <LayoutGrid className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="sticky top-0 z-10 bg-[#0A0A0A]/95 backdrop-blur-xl py-3 space-y-3 mb-5 -mx-2 px-2 border-b border-[#2A2A2A]/80">
          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-orange-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Rechercher un billet, téléphone ou trajet..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141414] border border-[#2A2A2A] hover:border-orange-500/50 focus:border-orange-500 transition-all rounded-2xl pl-12 pr-12 py-3.5 text-white text-sm outline-none shadow-sm focus:shadow-[0_0_15px_rgba(234,88,12,0.1)]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-[#222222] rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                 <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 items-center">
             <div className="flex bg-[#141414] rounded-xl p-1 border border-[#2A2A2A]/80 shadow-sm">
                {STATUS_OPTIONS.map(s => (
                  <button 
                    key={s} 
                    onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${filterStatus === s ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-[#222222]/50'}`}
                  >
                    {s}
                  </button>
                ))}
             </div>
             <div className="flex bg-[#141414] rounded-xl p-1 border border-[#2A2A2A]/80 shadow-sm">
                {DATE_OPTIONS.map(d => (
                  <button 
                    key={d} 
                    onClick={() => setFilterDate(d)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${filterDate === d ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-[#222222]/50'}`}
                  >
                    {d}
                  </button>
                ))}
             </div>
             <div className="hidden sm:flex bg-[#141414] rounded-xl p-1 border border-[#2A2A2A]/80 shadow-sm">
                {TYPE_OPTIONS.map(t => (
                  <button 
                    key={t} 
                    onClick={() => setFilterType(t)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${filterType === t ? 'bg-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-[#222222]/50'}`}
                  >
                    {t}
                  </button>
                ))}
             </div>

             {(filterStatus !== 'Tous' || filterDate !== 'Aujourd\'hui' || filterType !== 'Tous' || searchQuery !== '') && (
               <button 
                 onClick={() => { setFilterStatus('Tous'); setFilterDate('Aujourd\'hui'); setFilterType('Tous'); setSearchQuery(''); }}
                 className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 bg-[#141414] hover:bg-rose-500/10 border border-[#2A2A2A]/80 hover:border-rose-500/30 rounded-xl transition-all ml-auto shadow-sm"
               >
                 <FilterX className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Réinitialiser</span>
               </button>
             )}
          </div>
        </div>

        {viewMode === 'list' ? (
             <div className="flex flex-col gap-3">
               {/* Ticket 1 */}
               <div className="bg-[#141414] border border-orange-500/30 hover:border-orange-500/60 rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-colors">
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
                       <p className="text-xs text-slate-500 mt-0.5">Sénégal Express • Fatou Diop</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 sm:shrink-0">
                     <button className="flex-1 sm:flex-none p-2 sm:px-3 bg-[#1A1A1A] hover:bg-[#222222] border border-[#333333] text-slate-300 rounded-lg text-xs font-medium transition-colors flex justify-center items-center gap-1.5">
                        <Eye className="w-4 h-4" /> <span className="hidden sm:inline">Détails</span>
                     </button>
                     <button className="flex-1 sm:flex-none p-2 sm:px-3 bg-[#1A1A1A] hover:bg-[#222222] border border-[#333333] text-slate-300 rounded-lg text-xs font-medium transition-colors flex justify-center items-center gap-1.5">
                        <Download className="w-4 h-4" /> <span className="hidden sm:inline">Billet</span>
                     </button>
                     <button onClick={() => setShowShareModal(true)} className="flex-1 sm:flex-none p-2 sm:px-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm flex justify-center items-center gap-1.5">
                        <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Partager</span>
                     </button>
                 </div>
               </div>
               
               {/* Ticket 2 */}
               <div className="bg-[#141414] border border-orange-500/30 hover:border-orange-500/60 rounded-xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-colors">
                 <div className="flex items-center gap-4">
                    <div className="shrink-0">
                       <QRCodeBrandEngine value="AR-89347123" size={48} />
                    </div>
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-bold text-sm sm:text-base">Dakar ➔ Saint-Louis</span>
                          <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-md font-mono border border-orange-500/20">AR-89347123</span>
                       </div>
                       <p className="text-xs text-slate-400">18 Mai 2026 • 09:30 • Siège #02 (VIP)</p>
                       <p className="text-xs text-slate-500 mt-0.5">Sénégal Express • Mamadou Ndiaye</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 sm:shrink-0">
                     <button className="flex-1 sm:flex-none p-2 sm:px-3 bg-[#1A1A1A] hover:bg-[#222222] border border-[#333333] text-slate-300 rounded-lg text-xs font-medium transition-colors flex justify-center items-center gap-1.5">
                        <Eye className="w-4 h-4" /> <span className="hidden sm:inline">Détails</span>
                     </button>
                     <button className="flex-1 sm:flex-none p-2 sm:px-3 bg-[#1A1A1A] hover:bg-[#222222] border border-[#333333] text-slate-300 rounded-lg text-xs font-medium transition-colors flex justify-center items-center gap-1.5">
                        <Download className="w-4 h-4" /> <span className="hidden sm:inline">Billet</span>
                     </button>
                     <button onClick={() => setShowShareModal(true)} className="flex-1 sm:flex-none p-2 sm:px-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm flex justify-center items-center gap-1.5">
                        <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Partager</span>
                     </button>
                 </div>
               </div>
             </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-[#141414] border border-[#2A2A2A]/80 rounded-2xl overflow-hidden relative shadow-lg">
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-3 py-5 border-y border-[#2A2A2A]/80 mb-5">
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
                      <p className="text-sm font-semibold text-white truncate">Fatou Diop</p>
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
                   <button className="flex-1 bg-[#1A1A1A] hover:bg-[#222222] border border-[#333333] text-white font-medium py-2.5 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5">
                      <Eye className="w-4 h-4" /> Détails
                   </button>
                   <button className="flex-1 bg-[#1A1A1A] hover:bg-[#222222] border border-[#333333] text-white font-medium py-2.5 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5">
                      <Download className="w-4 h-4" /> Billet QR
                   </button>
                   <button onClick={() => setShowShareModal(true)} className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-medium py-2.5 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                      <Share2 className="w-4 h-4" /> Partager
                   </button>
                </div>
             </div>
          </div>
          
          <div className="bg-[#141414] border border-[#2A2A2A]/80 rounded-2xl overflow-hidden relative shadow-lg">
             <div className="bg-orange-600 px-4 py-2 text-xs font-semibold text-white flex justify-between items-center">
               <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Statut: Confirmé (Escrow)</span>
               <span className="font-mono">Réf: AR-89347123</span>
             </div>
             
             <div className="p-5">
                <div className="flex justify-between items-start mb-5">
                   <div>
                      <div className="flex items-center gap-2 text-slate-400 text-xs mb-1.5">
                         <Calendar className="w-3.5 h-3.5 text-orange-400" /> 18 Mai 2026
                         <span className="mx-1">•</span>
                         <Clock className="w-3.5 h-3.5 text-orange-400" /> 09:30
                      </div>
                      <div className="flex items-center gap-3">
                         <h3 className="text-xl sm:text-2xl font-black text-white">Dakar</h3>
                         <ArrowUpRight className="w-5 h-5 text-orange-400" />
                         <h3 className="text-xl sm:text-2xl font-black text-white">Saint-Louis</h3>
                      </div>
                      <p className="text-sm text-slate-400 mt-2 flex items-center gap-1.5">
                         <Building2 className="w-4 h-4 text-slate-500" /> Sénégal Express
                      </p>
                   </div>
                   <div className="shrink-0 scale-75 sm:scale-100 origin-top-right">
                      <QRCodeBrandEngine value="AR-89347123" size={72} />
                   </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-3 py-5 border-y border-[#2A2A2A]/80 mb-5">
                   <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">N° Billet</p>
                      <p className="text-sm font-semibold text-white">TKT-0015</p>
                   </div>
                   <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Siège</p>
                      <p className="text-sm font-bold text-orange-400">#02 (VIP)</p>
                   </div>
                   <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Passager</p>
                      <p className="text-sm font-semibold text-white truncate">Mamadou Ndiaye</p>
                   </div>
                   <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Véhicule</p>
                      <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                         <Bus className="w-3.5 h-3.5 text-slate-400" /> Bus Climatisé
                      </p>
                   </div>
                   <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Montant Payé</p>
                      <p className="text-sm font-semibold text-white">5 000 FCFA</p>
                   </div>
                </div>
                
                <div className="flex gap-2">
                   <button className="flex-1 bg-[#1A1A1A] hover:bg-[#222222] border border-[#333333] text-white font-medium py-2.5 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5">
                      <Eye className="w-4 h-4" /> Détails
                   </button>
                   <button className="flex-1 bg-[#1A1A1A] hover:bg-[#222222] border border-[#333333] text-white font-medium py-2.5 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5">
                      <Download className="w-4 h-4" /> Billet QR
                   </button>
                   <button onClick={() => setShowShareModal(true)} className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-medium py-2.5 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                      <Share2 className="w-4 h-4" /> Partager
                   </button>
                </div>
             </div>
          </div>
          </div>
        )}
      </div>

      {/* ===== MODAL ÉMISSION BILLET ===== */}
      {showBilletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0A]/85 backdrop-blur-md">
          <div className="bg-[#141414] border border-orange-500/30 rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden">
            {/* Header modal */}
            <div className="flex items-center justify-between p-5 border-b border-[#2A2A2A]/80 bg-orange-600/10">
              <div className="flex items-center gap-2">
                <TicketCheck className="w-5 h-5 text-orange-400" />
                <span className="font-bold text-white text-sm">Émission de Billet QR</span>
              </div>
              <button onClick={resetBillet} className="p-1.5 rounded-lg bg-[#222222] text-slate-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              {billetState === 'generating' && (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mx-auto mb-4" />
                  <p className="text-white font-semibold text-sm">Génération du billet QR en cours...</p>
                  <p className="text-slate-400 text-xs mt-1">Connexion à l'imprimante Sunmi V2</p>
                </div>
              )}

              {billetState === 'success' && (
                <div>
                  {/* QR Code affiché */}
                  <div className="mx-auto w-fit mb-4">
                    <QRCodeBrandEngine value={`AR-${Math.random().toString(36).substr(2,8).toUpperCase()}`} size={140} />
                  </div>

                  <div className="space-y-2 mb-5 bg-[#0A0A0A] rounded-xl p-4 border border-[#2A2A2A]">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1"><User className="w-3 h-3 text-orange-400" /> Nom</span>
                      <span className="text-white font-semibold text-right max-w-[55%]">{nomClient}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3 text-orange-400" /> Ligne</span>
                      <span className="text-white font-semibold text-right max-w-[55%]">{ligne.split('(')[0].trim()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1"><Phone className="w-3 h-3 text-orange-400" /> Téléphone</span>
                      <span className="text-white font-semibold">{phone}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1"><CreditCard className="w-3 h-3 text-orange-400" /> Réf.</span>
                      <span className="text-orange-400 font-mono font-bold">AR-{Math.random().toString(36).substr(2,8).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3 text-orange-400" /> Émis le</span>
                      <span className="text-white font-semibold">{new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 mb-5">
                    <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                    <p className="text-xs text-orange-300 font-semibold">Billet imprimé sur Sunmi V2 avec succès !</p>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={handleEmettreStep1}
                      className="flex-1 bg-[#1A1A1A] border border-[#333333] text-slate-200 font-semibold py-2.5 rounded-xl text-xs hover:bg-[#222222] transition-colors"
                    >
                      Réimprimer
                    </button>
                    <button 
                      onClick={resetBillet}
                      className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                    >
                      Nouveau billet
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL SCAN QR ===== */}
      {showScanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0A]/85 backdrop-blur-md">
          <div className="bg-[#141414] border border-orange-500/30 rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[#2A2A2A]/80 bg-orange-600/10">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-orange-400" />
                <span className="font-bold text-white text-sm">Scanner un Billet QR</span>
              </div>
              <button onClick={resetScan} className="p-1.5 rounded-lg bg-[#222222] text-slate-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              {(scanState === 'idle') && (
                <div>
                  {/* Viewfinder simulé */}
                  <div className="relative bg-[#0A0A0A] rounded-2xl h-40 flex items-center justify-center mb-4 border border-[#2A2A2A] overflow-hidden">
                    <div className="absolute inset-4 border-2 border-dashed border-orange-500/50 rounded-xl" />
                    <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-orange-500 rounded-tl" />
                    <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-orange-500 rounded-tr" />
                    <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-orange-500 rounded-bl" />
                    <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-orange-500 rounded-br" />
                    <Camera className="w-10 h-10 text-orange-400/40" />
                  </div>

                  <p className="text-xs text-slate-400 text-center mb-4">Ou saisissez manuellement le code de référence du billet :</p>

                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Ex: AR-X7K2P9QA"
                      value={scanCode}
                      onChange={e => setScanCode(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleScan()}
                      className="w-full bg-[#0A0A0A] border border-[#333333] hover:border-orange-500/50 rounded-xl px-4 py-3 text-white text-sm font-mono focus:border-orange-500 outline-none transition-colors"
                    />
                  </div>

                  <button
                    onClick={handleScan}
                    className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <TicketCheck className="w-4 h-4" /> Valider le billet
                  </button>
                </div>
              )}

              {scanState === 'scanning' && (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mx-auto mb-4" />
                  <p className="text-white font-semibold text-sm">Vérification en cours...</p>
                  <p className="text-slate-400 text-xs mt-1">Consultation de la base de données des billets</p>
                </div>
              )}

              {scanState === 'valid' && (
                <div>
                  <div className="flex items-center justify-center w-16 h-16 bg-orange-500/20 border-2 border-orange-500 rounded-full mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3 className="text-center text-lg font-bold text-white mb-1">Billet VALIDE ✓</h3>
                  <p className="text-center text-xs text-orange-400 font-semibold mb-5">Embarquement autorisé</p>

                  <div className="space-y-2 bg-[#0A0A0A] rounded-xl p-4 border border-[#2A2A2A] mb-5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1"><User className="w-3 h-3 text-orange-400" /> Passager</span>
                      <span className="text-white font-semibold">Fatou Diop</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3 text-orange-400" /> Ligne</span>
                      <span className="text-white font-semibold">Dakar ➔ Touba</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1"><TicketCheck className="w-3 h-3 text-orange-400" /> Siège</span>
                      <span className="text-orange-400 font-bold">#14 (VIP)</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Réf.</span>
                      <span className="text-orange-400 font-mono font-bold">{scanCode.toUpperCase()}</span>
                    </div>
                  </div>

                  <button onClick={resetScan} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl text-sm transition-colors">
                    Scanner un autre billet
                  </button>
                </div>
              )}

              {scanState === 'invalid' && (
                <div>
                  <div className="flex items-center justify-center w-16 h-16 bg-rose-500/20 border-2 border-rose-500 rounded-full mx-auto mb-4">
                    <XCircle className="w-8 h-8 text-rose-400" />
                  </div>
                  <h3 className="text-center text-lg font-bold text-white mb-1">Billet INVALIDE ✗</h3>
                  <p className="text-center text-xs text-rose-400 font-semibold mb-5">Embarquement refusé</p>

                  <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 mb-5">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <p className="text-xs text-rose-300">Code <span className="font-mono font-bold">{scanCode.toUpperCase()}</span> introuvable dans la base. Billet expiré, falsifié ou déjà utilisé.</p>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => { setScanState('idle'); setScanCode(''); }} className="flex-1 bg-[#1A1A1A] border border-[#333333] text-slate-200 font-semibold py-2.5 rounded-xl text-xs hover:bg-[#222222] transition-colors">
                      Réessayer
                    </button>
                    <button onClick={resetScan} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors">
                      Fermer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SHARE MODAL (BOTTOM SHEET ON MOBILE) */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0A0A0A]/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#141414] border-t sm:border border-[#2A2A2A]/80 rounded-t-3xl sm:rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-5 flex justify-between items-center border-b border-[#2A2A2A]/80">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-orange-400" /> Partager le billet
                </h3>
                <button onClick={() => setShowShareModal(false)} className="p-1.5 rounded-full bg-[#1A1A1A] text-slate-400 hover:text-white transition-colors">
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

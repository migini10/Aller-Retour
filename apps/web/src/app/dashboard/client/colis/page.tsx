'use client';

import React from 'react';
import { ArrowLeft, Package, Plus, Search, CheckCircle2, Box, Truck, Clock, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import { useModal } from '@/components/ModalContext';

export default function ColisPage() {
  const { openColisWizard } = useModal();
  const [localColis, setLocalColis] = React.useState<any[]>([]);
  const [trackingColis, setTrackingColis] = React.useState<any | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    loadColis();
    const interval = setInterval(loadColis, 5000); // Polling for real-time sync demo
    window.addEventListener('colis_updated', loadColis);
    return () => {
      clearInterval(interval);
      window.removeEventListener('colis_updated', loadColis);
    };
  }, []);

  const loadColis = async () => {
    try {
      const res = await fetch(`/api/colis?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setLocalColis(data);
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="flex-1 w-full flex flex-col items-center bg-slate-50 dark:bg-black transition-colors duration-300">
      <div className="w-full max-w-[1200px] px-5 sm:px-8 lg:px-12 pt-24 pb-24 space-y-8 animate-fade-in">
        
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
          <button onClick={() => openColisWizard()} className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3.5 rounded-2xl transition-colors shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Envoyer un colis
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total */}
          <Link href="/dashboard/client/colis/total" className="group bg-gradient-to-br from-white to-slate-50 dark:from-[#1E293B] dark:to-[#0F172A] border-[1.5px] border-purple-500/30 hover:border-purple-500/60 rounded-3xl p-5 flex flex-col justify-between shadow-lg dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] transition-all duration-300 relative overflow-hidden h-full cursor-pointer">
            <Box className="absolute -bottom-6 -right-6 w-24 h-24 text-purple-500 opacity-[0.03] dark:opacity-[0.04] -rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Box className="w-5 h-5 text-purple-500" />
                </div>
                <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Total</span>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">12</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Colis envoyés (Année)</p>
              </div>
            </div>
          </Link>
          
          {/* Card 2: Actif */}
          <Link href="/dashboard/client/colis/actifs" className="group bg-gradient-to-br from-white to-slate-50 dark:from-[#1E293B] dark:to-[#0F172A] border-[1.5px] border-amber-500/30 hover:border-amber-500/60 rounded-3xl p-5 flex flex-col justify-between shadow-lg dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] transition-all duration-300 relative overflow-hidden h-full cursor-pointer">
            <Clock className="absolute -bottom-6 -right-6 w-24 h-24 text-amber-500 opacity-[0.03] dark:opacity-[0.04] -rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Actif</span>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">1</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">En cours d'expédition</p>
              </div>
            </div>
          </Link>
          
          {/* Card 3: Livrés */}
          <Link href="/dashboard/client/colis/livres" className="group bg-gradient-to-br from-white to-slate-50 dark:from-[#1E293B] dark:to-[#0F172A] border-[1.5px] border-emerald-500/30 hover:border-emerald-500/60 rounded-3xl p-5 flex flex-col justify-between shadow-lg dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] transition-all duration-300 relative overflow-hidden h-full cursor-pointer">
            <CheckCircle2 className="absolute -bottom-6 -right-6 w-24 h-24 text-emerald-500 opacity-[0.03] dark:opacity-[0.04] -rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">11</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Colis livrés</p>
              </div>
            </div>
          </Link>
          
          {/* Card 4: Franchise */}
          <Link href="/dashboard/client/colis/franchise" className="group bg-gradient-to-br from-white to-slate-50 dark:from-[#1E293B] dark:to-[#0F172A] border-[1.5px] border-blue-500/30 hover:border-blue-500/60 rounded-3xl p-5 flex flex-col justify-between shadow-lg dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] transition-all duration-300 relative overflow-hidden h-full cursor-pointer">
            <Truck className="absolute -bottom-6 -right-6 w-24 h-24 text-blue-500 opacity-[0.03] dark:opacity-[0.04] -rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Truck className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">15kg</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Franchise incluse restante</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Action Card: Send via Allo Dakar */}
        <div className="bg-gradient-to-r from-orange-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-orange-500/20 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 blur-3xl rounded-full"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
              <Truck className="w-6 h-6" /> Allo Dakar Express
            </h2>
            <p className="text-orange-50 max-w-lg text-sm sm:text-base">
              Besoin d'envoyer un colis en urgence ? Confiez-le à un chauffeur de notre réseau Allo Dakar pour une livraison interurbaine rapide et sécurisée.
            </p>
          </div>
          <button onClick={() => openColisWizard()} className="w-full sm:w-auto bg-white text-orange-600 hover:bg-slate-50 font-black px-8 py-4 rounded-2xl shadow-lg transition-transform hover:scale-105 flex items-center justify-center gap-2 shrink-0 z-10">
            <Plus className="w-5 h-5" /> Envoyer un colis
          </button>
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: COL-894-D15" 
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 focus:border-white transition-all rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-purple-300 text-sm font-medium outline-none shadow-inner"
                />
              </div>
              <button 
                onClick={() => {
                  if (!searchQuery.trim()) {
                    alert("Veuillez entrer un numéro de colis valide.");
                    return;
                  }
                  const found = localColis.find(c => String(c?.id || '').toUpperCase().includes(searchQuery.toUpperCase()));
                  if (found) {
                    setTrackingColis(found);
                  } else {
                    alert("Colis non trouvé");
                  }
                }}
                className="bg-white text-purple-600 hover:bg-slate-50 font-bold px-8 py-4 rounded-xl transition-colors shadow-lg whitespace-nowrap"
              >
                Rechercher
              </button>
            </div>
          </div>
        </div>

        {/* Active Parcels List */}
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Colis Récents</h2>
          
          <div className="space-y-4">
            {localColis.map((colis, idx) => {
                const isAccepted = colis.statut === 'Accepté';
                const isTransit = colis.statut === 'En transit';
                const isDelivered = colis.statut === 'Livré';
                
                let progressWidth = '10%';
                
                // Explicit tailwind classes map
                let borderColor = 'border-orange-500/30';
                let hoverBorderColor = 'hover:border-orange-500/60';
                let bgColor = 'bg-orange-500/10';
                let iconBorderColor = 'border-orange-500/20';
                let textColor = 'text-orange-500';
                let bgSolidColor = 'bg-orange-500';
                let borderSolidColor = 'border-orange-500';
                let hoverBgColor = 'hover:bg-orange-500/10';
                let hoverTextColor = 'hover:text-orange-500';
                
                if (isAccepted) { 
                  progressWidth = '30%'; 
                  borderColor = 'border-blue-500/30';
                  hoverBorderColor = 'hover:border-blue-500/60';
                  bgColor = 'bg-blue-500/10';
                  iconBorderColor = 'border-blue-500/20';
                  textColor = 'text-blue-500';
                  bgSolidColor = 'bg-blue-500';
                  borderSolidColor = 'border-blue-500';
                  hoverBgColor = 'hover:bg-blue-500/10';
                  hoverTextColor = 'hover:text-blue-500';
                }
                if (isTransit) { 
                  progressWidth = '65%'; 
                  borderColor = 'border-indigo-500/30';
                  hoverBorderColor = 'hover:border-indigo-500/60';
                  bgColor = 'bg-indigo-500/10';
                  iconBorderColor = 'border-indigo-500/20';
                  textColor = 'text-indigo-500';
                  bgSolidColor = 'bg-indigo-500';
                  borderSolidColor = 'border-indigo-500';
                  hoverBgColor = 'hover:bg-indigo-500/10';
                  hoverTextColor = 'hover:text-indigo-500';
                }
                if (isDelivered) { 
                  progressWidth = '100%'; 
                  borderColor = 'border-emerald-500/30';
                  hoverBorderColor = 'hover:border-emerald-500/60';
                  bgColor = 'bg-emerald-500/10';
                  iconBorderColor = 'border-emerald-500/20';
                  textColor = 'text-emerald-500';
                  bgSolidColor = 'bg-emerald-500';
                  borderSolidColor = 'border-emerald-500';
                  hoverBgColor = 'hover:bg-emerald-500/10';
                  hoverTextColor = 'hover:text-emerald-500';
                }

                return (
                  <div key={idx} className={`bg-white dark:bg-[#141414] border ${borderColor} ${hoverBorderColor} rounded-3xl p-6 transition-all shadow-sm flex flex-col md:flex-row gap-6`}>
                    <div className="flex-1 flex flex-col md:flex-row gap-6">
                      <div className={`w-16 h-16 rounded-2xl ${bgColor} border ${iconBorderColor} flex items-center justify-center shrink-0`}>
                        {isDelivered ? <CheckCircle2 className={`w-8 h-8 ${textColor}`} /> : <Truck className={`w-8 h-8 ${textColor}`} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{colis.trajet}</h3>
                          <span className={`text-[10px] uppercase font-bold ${textColor} ${bgColor} px-2.5 py-1 rounded-md border ${iconBorderColor}`}>
                            {colis.statut || 'En attente'}
                          </span>
                        </div>
                        <p className="text-sm font-mono text-slate-500 dark:text-slate-400 mb-4">Réf: {colis.id} • {colis.taille} • {colis.date}</p>
                        
                        {/* Progress bar */}
                        <div className="relative pt-4 w-full max-w-md hidden sm:block">
                          <div className="absolute top-0 left-0 w-full flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                            <span className={!isAccepted && !isTransit && !isDelivered ? textColor : ''}>Dépôt</span>
                            <span className={isAccepted || isTransit ? textColor : ''}>{isAccepted ? 'Accepté' : 'En route'}</span>
                            <span className={isDelivered ? textColor : ''}>Livré</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-[#222222] rounded-full h-2 mt-2 relative">
                            <div className={`${bgSolidColor} h-2 rounded-full absolute top-0 left-0 transition-all duration-1000`} style={{ width: progressWidth }}></div>
                            <div className={`w-4 h-4 rounded-full bg-white border-4 ${borderSolidColor} absolute top-1/2 -translate-y-1/2 shadow-md transition-all duration-1000`} style={{ left: progressWidth, transform: 'translate(-50%, -50%)' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-200 dark:border-[#2A2A2A] pt-4 md:pt-0 md:pl-6">
                      <div className="text-left md:text-right">
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Destinataire</p>
                        <p className="font-bold text-slate-900 dark:text-white">{colis.destinataire}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{colis.tel}</p>
                      </div>
                      <button 
                        onClick={() => setTrackingColis(colis)}
                        className={`px-4 py-2 bg-slate-100 dark:bg-[#222222] ${hoverBgColor} text-slate-700 dark:text-slate-300 ${hoverTextColor} rounded-xl text-sm font-bold transition-colors flex items-center gap-2`}
                      >
                        Suivre <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
            })}
          </div>
        </div>

      </div>

      {trackingColis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setTrackingColis(null)}></div>
          <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#2A2A2A] rounded-3xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-200 dark:border-[#2A2A2A] flex justify-between items-center">
              <div>
                <h3 className="font-black text-xl text-slate-900 dark:text-white">Suivi de Colis</h3>
                <p className="text-sm font-mono text-slate-500 mt-1">{trackingColis.id}</p>
              </div>
              <button onClick={() => setTrackingColis(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-[#222222] rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-8">
              <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-2xl p-4 flex gap-4 items-center">
                <div className="bg-purple-500 text-white p-3 rounded-xl shadow-lg shadow-purple-500/30">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider mb-1">Destinataire</p>
                  <p className="font-bold text-slate-900 dark:text-white">{trackingColis.destinataire}</p>
                  <p className="text-sm text-slate-500">{trackingColis.tel}</p>
                </div>
              </div>

              {/* Informations du Chauffeur (Visible uniquement pour le client) */}
              {(trackingColis.statut === 'Accepté' || trackingColis.statut === 'En transit' || trackingColis.statut === 'Livré') && (
                <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-2xl p-4 flex gap-4 items-center">
                  <div className="bg-orange-500 text-white p-3 rounded-xl shadow-lg shadow-orange-500/30">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider mb-1">Chauffeur en charge</p>
                    <p className="font-bold text-slate-900 dark:text-white">Ousmane Diop</p>
                    <p className="text-sm text-slate-500">+221 77 987 65 43</p>
                  </div>
                </div>
              )}

              <div className="relative pl-6 space-y-8">
                {/* Ligne verticale de la timeline */}
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-[#2A2A2A]"></div>

                <div className="relative">
                  <div className={`absolute -left-6 w-4 h-4 rounded-full border-4 ${trackingColis.statut === 'En attente de prise en charge' ? 'bg-orange-500 border-orange-200 dark:border-orange-900 shadow-[0_0_0_4px_rgba(249,115,22,0.2)]' : 'bg-orange-500 border-white dark:border-[#111111]'}`}></div>
                  <h4 className={`font-bold ${trackingColis.statut === 'En attente de prise en charge' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>En attente de prise en charge</h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> {trackingColis.date}</p>
                </div>

                <div className="relative">
                  <div className={`absolute -left-6 w-4 h-4 rounded-full border-4 ${trackingColis.statut === 'Accepté' ? 'bg-blue-500 border-blue-200 shadow-[0_0_0_4px_rgba(59,130,246,0.2)]' : 'bg-slate-200 dark:bg-[#2A2A2A] border-white dark:border-[#111111]'}`}></div>
                  <h4 className={`font-bold ${trackingColis.statut === 'Accepté' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Course acceptée par un chauffeur</h4>
                  <p className="text-xs text-slate-400 mt-1">À l'agence de départ</p>
                </div>

                <div className="relative">
                  <div className={`absolute -left-6 w-4 h-4 rounded-full border-4 ${trackingColis.statut === 'En transit' ? 'bg-indigo-500 border-indigo-200 shadow-[0_0_0_4px_rgba(99,102,241,0.2)]' : 'bg-slate-200 dark:bg-[#2A2A2A] border-white dark:border-[#111111]'}`}></div>
                  <h4 className={`font-bold ${trackingColis.statut === 'En transit' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>En transit vers la destination</h4>
                  <p className="text-xs text-slate-400 mt-1">{String(trackingColis.trajet || '').split('→')[1]?.trim() || 'Destination'}</p>
                </div>

                <div className="relative">
                  <div className={`absolute -left-6 w-4 h-4 rounded-full border-4 ${trackingColis.statut === 'Livré' ? 'bg-emerald-500 border-emerald-200 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]' : 'bg-slate-200 dark:bg-[#2A2A2A] border-white dark:border-[#111111]'}`}></div>
                  <h4 className={`font-bold ${trackingColis.statut === 'Livré' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Livré au destinataire</h4>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-[#1A1A1A] border-t border-slate-200 dark:border-[#2A2A2A]">
              <button onClick={() => setTrackingColis(null)} className="w-full py-3 bg-white dark:bg-[#222222] border border-slate-200 dark:border-[#333333] rounded-xl font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-[#2A2A2A] transition-colors">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

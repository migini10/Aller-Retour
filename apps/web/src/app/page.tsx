'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Home, Search, Package, User, ArrowRight, TrendingUp, MapPin, Calendar, Clock, Ticket, Car, Wifi } from 'lucide-react';
import { useModal } from '../components/ModalContext';

export default function HomePage() {
  const { openBookingWizard, openColisWizard } = useModal();
  const [activeTab, setActiveTab] = useState('Accueil');
  const [recentTrips, setRecentTrips] = useState<any[]>([]);

  useEffect(() => {
    // Récupérer les billets du passager (données réelles synchronisées)
    try {
      const tickets = JSON.parse(localStorage.getItem('my_tickets') || '[]');
      if (Array.isArray(tickets)) {
        setRecentTrips(tickets.slice(0, 3)); // Afficher les 3 derniers
      }
    } catch(e) {}
  }, []);

  return (
    <div className="flex flex-col h-[100dvh] bg-black font-sans w-full text-slate-100">
      
      {/* Contenu principal défilable */}
      <div className="flex-1 overflow-y-auto pb-24 w-full">
        
        {/* En-tête Sombre (Premium Noir & Orange) */}
        <div className="bg-[#0A0A0A] pt-12 pb-24 px-6 relative rounded-b-[40px] border-b border-[#2A2A2A]">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-10 mt-4">
            {/* Logo Original Allô Dakar (Boîte Blanche) */}
            <div className="bg-slate-100 rounded-[16px] py-1.5 px-3 flex items-center justify-center shadow-lg">
              <span className="text-[#00437A] font-black text-xs flex items-center tracking-tight">
                <Car className="w-3.5 h-3.5 mr-1 text-[#00437A] fill-[#00437A]" />
                Allô<span className="text-orange-500">Dakar</span>
              </span>
            </div>
            <button onClick={() => setActiveTab('Profil')} className="w-11 h-11 rounded-full border border-[#333333] bg-[#141414] flex items-center justify-center text-slate-300 hover:text-white transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>

          {/* Salutation */}
          <div>
            <h1 className="text-white text-3xl font-extrabold mb-1">Bonjour !</h1>
            <p className="text-slate-400 text-base font-medium">Où souhaitez-vous aller aujourd'hui ?</p>
          </div>
        </div>

        {/* Cartes et Actions (Superposées) */}
        <div className="px-5 -mt-16 space-y-4 relative z-10">
          
          {/* Barre de Recherche (Mieux organisée) */}
          <div className="bg-[#141414] rounded-[24px] p-5 shadow-2xl border border-[#2A2A2A]">
            <div 
              className="space-y-3 mb-4 cursor-text"
              onClick={() => openBookingWizard('allo-dakar')}
            >
              <div className="flex items-center gap-3 bg-[#0A0A0A] p-3 rounded-xl border border-[#333333] hover:border-orange-500/50 transition-colors">
                <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Départ</p>
                  <p className="text-sm font-semibold text-white">Dakar, SN</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#0A0A0A] p-3 rounded-xl border border-[#333333] hover:border-orange-500/50 transition-colors">
                <MapPin className="w-5 h-5 text-emerald-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Arrivée</p>
                  <p className="text-sm font-semibold text-slate-400">Choisir une destination...</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => openBookingWizard('allo-dakar')}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-orange-600/20"
            >
              Rechercher un trajet <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Cartes Secondaires: Colis & Conducteur */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Envoyer un colis */}
            <div 
              onClick={() => openColisWizard()}
              className="bg-[#141414] rounded-[24px] p-5 shadow-lg border border-[#2A2A2A] flex flex-col items-start gap-4 active:scale-95 transition-transform cursor-pointer hover:border-orange-500/30 group"
            >
              <div className="w-12 h-12 rounded-[16px] bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Envoyer</h3>
                <p className="text-sm text-slate-400">un colis</p>
              </div>
            </div>

            {/* Devenir conducteur */}
            <Link href="/dashboard/driver" className="bg-[#141414] rounded-[24px] p-5 shadow-lg border border-[#2A2A2A] flex flex-col items-start gap-4 active:scale-95 transition-transform cursor-pointer hover:border-emerald-500/30 group">
              <div className="w-12 h-12 rounded-[16px] bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Devenir</h3>
                <p className="text-sm text-slate-400">conducteur</p>
              </div>
            </Link>

          </div>

          {/* Données réelles synchronisées (Derniers trajets) */}
          <div className="py-6">
            <h2 className="font-bold text-white mb-4 px-2 text-lg">Vos derniers trajets</h2>
            
            {recentTrips.length > 0 ? (
              <div className="space-y-3">
                {recentTrips.map((trip, idx) => (
                  <div key={idx} className="bg-[#141414] rounded-[20px] p-4 shadow-lg border border-[#2A2A2A] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-[#333333]">
                        <Ticket className="w-4 h-4 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{trip.trajet || "Dakar - Touba"}</p>
                        <p className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" /> {trip.date} • {trip.statut}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#141414] rounded-[24px] p-8 shadow-lg border border-[#2A2A2A] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#0A0A0A] border border-[#333333] flex items-center justify-center text-slate-500 mb-4">
                  <Search className="w-7 h-7" />
                </div>
                <h2 className="font-bold text-white mb-1">Aucun trajet récent</h2>
                <p className="text-slate-400 text-sm">Vos prochains trajets apparaîtront ici.</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Bottom Navigation Bar (Dark Mode) */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-[#2A2A2A] flex justify-between items-center px-6 py-3 pb-8 z-50">
        <button onClick={() => setActiveTab('Accueil')} className={`flex flex-col items-center gap-1 ${activeTab === 'Accueil' ? 'text-orange-500' : 'text-slate-500 hover:text-slate-300'}`}>
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-bold">Accueil</span>
        </button>
        
        <button onClick={() => { setActiveTab('Recherche'); openBookingWizard('allo-dakar'); }} className={`flex flex-col items-center gap-1 ${activeTab === 'Recherche' ? 'text-orange-500' : 'text-slate-500 hover:text-slate-300'}`}>
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-bold">Recherche</span>
        </button>
        
        <button onClick={() => { setActiveTab('Colis'); openColisWizard(); }} className={`flex flex-col items-center gap-1 ${activeTab === 'Colis' ? 'text-orange-500' : 'text-slate-500 hover:text-slate-300'}`}>
          <Package className="w-6 h-6" />
          <span className="text-[10px] font-bold">Colis</span>
        </button>
        
        <button onClick={() => setActiveTab('Profil')} className={`flex flex-col items-center gap-1 ${activeTab === 'Profil' ? 'text-orange-500' : 'text-slate-500 hover:text-slate-300'}`}>
          <User className="w-6 h-6" />
          <span className="text-[10px] font-bold">Profil</span>
        </button>
      </div>

    </div>
  );
}

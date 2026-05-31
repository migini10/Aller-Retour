'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { Home, Search, Package, User, ArrowRight, TrendingUp } from 'lucide-react';
import { useModal } from '../../../components/ModalContext';

export default function TravellerDashboard() {
  const { openBookingWizard } = useModal();
  const [activeTab, setActiveTab] = useState('Accueil');

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 font-sans w-full">
      
      {/* Contenu principal défilable */}
      <div className="flex-1 overflow-y-auto pb-20 w-full">
        
        {/* En-tête bleu */}
        <div className="bg-[#003B73] pt-12 pb-24 px-6 relative rounded-b-[40px] shadow-sm">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-10 mt-4">
            <div className="bg-white rounded-xl py-1.5 px-4 flex items-center justify-center shadow-sm">
              <span className="text-[#003B73] font-black text-sm flex items-center tracking-tight">
                Allô<span className="text-orange-500">Dakar</span>
              </span>
            </div>
            <button className="w-11 h-11 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white backdrop-blur-md">
              <User className="w-5 h-5" />
            </button>
          </div>

          {/* Salutation */}
          <div>
            <h1 className="text-white text-3xl font-extrabold mb-1">Bonjour!</h1>
            <p className="text-blue-100 text-base font-medium">Où souhaitez-vous aller aujourd'hui?</p>
          </div>
        </div>

        {/* Cartes et Actions (Superposées sur le bleu) */}
        <div className="px-5 -mt-14 space-y-4 relative z-10">
          
          {/* Carte Principale: Rechercher un trajet */}
          <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100">
            <button 
              onClick={() => openBookingWizard('allo-dakar')}
              className="w-full bg-[#003B73] hover:bg-[#002D59] text-white py-4 rounded-xl font-medium text-base flex items-center justify-center gap-3 transition-colors shadow-lg shadow-blue-900/10 active:scale-95"
            >
              Rechercher un trajet <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Cartes Secondaires: Colis & Conducteur */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Envoyer un colis */}
            <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 flex flex-col items-start gap-4 active:scale-95 transition-transform cursor-pointer">
              <div className="w-12 h-12 rounded-[16px] bg-orange-50 flex items-center justify-center text-orange-500">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Envoyer</h3>
                <p className="text-sm text-slate-500">un colis</p>
              </div>
            </div>

            {/* Devenir conducteur */}
            <Link href="/dashboard/driver" className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 flex flex-col items-start gap-4 active:scale-95 transition-transform cursor-pointer">
              <div className="w-12 h-12 rounded-[16px] bg-[#E8EEF5] flex items-center justify-center text-[#003B73]">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Devenir</h3>
                <p className="text-sm text-slate-500">conducteur</p>
              </div>
            </Link>

          </div>

          <div className="py-8">
            <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h2 className="font-bold text-slate-800 mb-1">Aucun trajet récent</h2>
              <p className="text-slate-500 text-sm">Vos prochains trajets apparaîtront ici.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-between items-center px-6 py-3 pb-8 z-50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
        <button onClick={() => setActiveTab('Accueil')} className={`flex flex-col items-center gap-1 ${activeTab === 'Accueil' ? 'text-[#003B73]' : 'text-slate-400'}`}>
          <Home className="w-6 h-6" />
          <span className="text-[11px] font-medium">Accueil</span>
        </button>
        
        <button onClick={() => { setActiveTab('Recherche'); openBookingWizard('allo-dakar'); }} className={`flex flex-col items-center gap-1 ${activeTab === 'Recherche' ? 'text-[#003B73]' : 'text-slate-400'}`}>
          <Search className="w-6 h-6" />
          <span className="text-[11px] font-medium">Recherche</span>
        </button>
        
        <button onClick={() => setActiveTab('Colis')} className={`flex flex-col items-center gap-1 ${activeTab === 'Colis' ? 'text-[#003B73]' : 'text-slate-400'}`}>
          <Package className="w-6 h-6" />
          <span className="text-[11px] font-medium">Colis</span>
        </button>
        
        <button onClick={() => setActiveTab('Profil')} className={`flex flex-col items-center gap-1 ${activeTab === 'Profil' ? 'text-[#003B73]' : 'text-slate-400'}`}>
          <User className="w-6 h-6" />
          <span className="text-[11px] font-medium">Profil</span>
        </button>
      </div>

    </div>
  );
}

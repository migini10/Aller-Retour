'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bus, LayoutDashboard, Route, QrCode, Users, Wallet, Store, Bell, HelpCircle, Settings, MapPin, Activity, ChevronRight
} from 'lucide-react';

import SectionAccueil from './sections/Accueil';
import SectionMissions from './sections/Missions';
import SectionLocalisation from './sections/Localisation';
import SectionScanner from './sections/Scanner';
import SectionPassagers from './sections/Passagers';
import SectionRevenus from './sections/Revenus';
import SectionMarketplace from './sections/Marketplace';
import SectionVehicule from './sections/Vehicule';
import SectionNotifications from './sections/Notifications';
import SectionSupport from './sections/Support';
import SectionParametres from './sections/Parametres';

const navItems = [
  { id: 'accueil', label: 'Accueil', icon: LayoutDashboard },
  { id: 'missions', label: 'Missions & Trajets', icon: Route },
  { id: 'localisation', label: 'Localisation Client', icon: MapPin },
  { id: 'scanner', label: 'Scanner Billet', icon: QrCode },
  { id: 'passagers', label: 'Passagers', icon: Users },
  { id: 'revenus', label: 'Revenus', icon: Wallet },
  { id: 'marketplace', label: 'Marketplace', icon: Store },
  { id: 'vehicule', label: 'Véhicule', icon: Bus },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: '2' },
  { id: 'support', label: 'Support', icon: HelpCircle },
  { id: 'parametres', label: 'Paramètres', icon: Settings },
];

export default function DriverDashboard() {
  const [activeTab, setActiveTab] = useState('accueil');
  const [status, setStatus] = useState('Disponible');

  const renderContent = () => {
    switch(activeTab) {
      case 'accueil': return <SectionAccueil />;
      case 'missions': return <SectionMissions />;
      case 'localisation': return <SectionLocalisation />;
      case 'scanner': return <SectionScanner />;
      case 'passagers': return <SectionPassagers />;
      case 'revenus': return <SectionRevenus />;
      case 'marketplace': return <SectionMarketplace />;
      case 'vehicule': return <SectionVehicule />;
      case 'notifications': return <SectionNotifications />;
      case 'support': return <SectionSupport />;
      case 'parametres': return <SectionParametres />;
      default: return <SectionAccueil />;
    }
  };

  const renderNavMenu = () => (
    <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto overscroll-contain pb-2 lg:pb-0 gap-1.5 lg:gap-2 pr-8 lg:pr-0 scrollbar-hide lg:h-full lg:bg-[#101728] lg:border lg:border-slate-800/80 lg:p-4 lg:rounded-3xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-3 rounded-xl transition-all whitespace-nowrap text-xs lg:text-sm font-semibold shrink-0 relative
              ${isActive 
                ? 'bg-orange-600 lg:bg-orange-500/10 text-white lg:text-orange-400 border border-orange-500/20 lg:shadow-none shadow-sm shadow-orange-500/20' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent bg-slate-900/50 lg:bg-transparent'
              }`}
          >
            <Icon className={`w-3.5 h-3.5 lg:w-4 lg:h-4 ${isActive ? 'text-white lg:text-orange-400' : 'text-slate-500'}`} />
            {item.label}
            {item.badge && (
              <span className="lg:ml-auto absolute lg:relative -top-1 -right-1 lg:top-0 lg:right-0 bg-rose-500 lg:bg-orange-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full overflow-y-auto lg:overflow-hidden scrollbar-hide">
      
      {/* Mobile Navigation Menu (Affiché en haut juste sous le header de layout) */}
      <div className="lg:hidden shrink-0 sticky top-0 z-50 bg-[#050A15]/95 backdrop-blur-xl border-b border-slate-800/80 px-5 sm:px-8 py-3 w-full relative">
        {renderNavMenu()}
        {/* Indicateur de défilement horizontal */}
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#050A15] via-[#050A15]/80 to-transparent pointer-events-none flex items-center justify-end pr-2">
          <ChevronRight className="w-5 h-5 text-slate-400 animate-pulse drop-shadow-md" />
        </div>
      </div>

      {/* Top Bar : Status & Profile (Scrolle sur mobile, fixe sur desktop via le layout) */}
      <div className="flex-none z-40 bg-[#0B0F19] border-b border-slate-800/80 px-5 sm:px-8 lg:px-12 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-emerald-500 overflow-hidden relative">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Moussa" alt="Profil" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0B0F19]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Moussa Ndiaye</h1>
              <p className="text-xs text-slate-400 font-medium">Chauffeur • Taxi 7 Places</p>
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1">
            {['Disponible', 'En Trajet', 'Hors Ligne'].map(s => (
              <button key={s} onClick={() => setStatus(s)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${status === s ? (s === 'Disponible' ? 'bg-emerald-600 text-white' : s === 'En Trajet' ? 'bg-orange-600 text-white' : 'bg-slate-700 text-white') : 'text-slate-400 hover:text-slate-200'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Full Height Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-8 max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-12 py-4 lg:py-6 overflow-visible lg:overflow-hidden">
        {/* Navigation Sidebar (Desktop Only) */}
        <div className="hidden lg:block lg:w-64 shrink-0 lg:h-full">
          {renderNavMenu()}
        </div>

        {/* Contenu Principal (Scrolle indépendamment sur desktop, scrolle avec la page sur mobile) */}
        <div className="flex-1 min-w-0 lg:h-full overflow-visible lg:overflow-y-auto overscroll-contain pb-10 scrollbar-hide lg:pr-2">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

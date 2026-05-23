'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, LayoutDashboard, Route, Users, Bus, Calendar, MapPin, 
  Wallet, Store, BarChart3, Bell, HelpCircle, Settings
} from 'lucide-react';

import SectionAccueil from './sections/Accueil';
import SectionEntreprise from './sections/Entreprise';
import SectionChauffeurs from './sections/Chauffeurs';
import SectionFlotte from './sections/Flotte';
import SectionTrajets from './sections/Trajets';
import SectionReservations from './sections/Reservations';
import SectionSuiviFlotte from './sections/SuiviFlotte';
import SectionMarketplace from './sections/Marketplace';
import SectionFinances from './sections/Finances';
import SectionAnalytics from './sections/Analytics';
import SectionNotifications from './sections/Notifications';
import SectionSupport from './sections/Support';
import SectionParametres from './sections/Parametres';

const navItems = [
  { id: 'accueil', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'entreprise', label: 'GIE & Entreprise', icon: Building2 },
  { id: 'chauffeurs', label: 'Chauffeurs', icon: Users },
  { id: 'flotte', label: 'Flotte Véhicules', icon: Bus },
  { id: 'trajets', label: 'Trajets', icon: Route },
  { id: 'reservations', label: 'Réservations', icon: Calendar },
  { id: 'suiviflotte', label: 'GPS Flotte', icon: MapPin },
  { id: 'marketplace', label: 'Chauffeurs Libres', icon: Store },
  { id: 'finances', label: 'Finances', icon: Wallet },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: '3' },
  { id: 'support', label: 'Support', icon: HelpCircle },
  { id: 'parametres', label: 'Paramètres', icon: Settings },
];

export default function CarrierDashboard() {
  const [activeTab, setActiveTab] = useState('accueil');

  const renderContent = () => {
    switch(activeTab) {
      case 'accueil': return <SectionAccueil />;
      case 'entreprise': return <SectionEntreprise />;
      case 'chauffeurs': return <SectionChauffeurs />;
      case 'flotte': return <SectionFlotte />;
      case 'trajets': return <SectionTrajets />;
      case 'reservations': return <SectionReservations />;
      case 'suiviflotte': return <SectionSuiviFlotte />;
      case 'marketplace': return <SectionMarketplace />;
      case 'finances': return <SectionFinances />;
      case 'analytics': return <SectionAnalytics />;
      case 'notifications': return <SectionNotifications />;
      case 'support': return <SectionSupport />;
      case 'parametres': return <SectionParametres />;
      default: return <SectionAccueil />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-y-auto xl:overflow-hidden scrollbar-hide">
      
      {/* Top Bar : Profile & Global Actions */}
      <div className="flex-none z-40 bg-[#0B0F19] border-b border-slate-800/80 px-5 sm:px-8 lg:px-12 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-[1400px] mx-auto w-full">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-orange-600/20 border-2 border-orange-500 overflow-hidden flex items-center justify-center">
              <Building2 className="w-8 h-8 text-orange-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Sénégal Express GIE</h1>
              <p className="text-sm text-slate-400 font-medium">Groupement Transporteur • ID: GIE-4829</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-500/20">Système 100% Opérationnel</span>
          </div>
        </div>
      </div>

      {/* Full Height Content Area */}
      <div className="flex-1 flex flex-col xl:flex-row gap-4 xl:gap-8 max-w-[1400px] mx-auto w-full px-5 sm:px-8 xl:px-12 py-4 xl:py-6 overflow-visible xl:overflow-hidden">
        {/* Navigation Sidebar (Desktop) / Top scrollable (Mobile) */}
        <div className="xl:w-64 shrink-0 xl:h-full -mx-5 sm:-mx-8 xl:mx-0 px-5 sm:px-8 xl:px-0 sticky top-0 z-20 bg-slate-950/95 xl:bg-transparent backdrop-blur-xl xl:backdrop-blur-none border-b border-slate-800 xl:border-none py-2 xl:py-0 mb-2 xl:mb-0">
          <div className="flex xl:flex-col overflow-x-auto xl:overflow-y-auto overscroll-contain pb-2 xl:pb-0 gap-1.5 xl:gap-2 scrollbar-hide xl:h-full xl:bg-[#101728] xl:border xl:border-slate-800/80 xl:p-4 xl:rounded-3xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 xl:gap-3 px-3 xl:px-4 py-2 xl:py-3 rounded-xl transition-all whitespace-nowrap text-xs xl:text-sm font-semibold shrink-0 relative
                    ${isActive 
                      ? 'bg-orange-600 xl:bg-orange-500/10 text-white xl:text-orange-400 border border-orange-500/20 xl:shadow-none shadow-sm shadow-orange-500/20' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent bg-slate-900/50 xl:bg-transparent'
                    }`}
                >
                  <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 ${isActive ? 'text-white xl:text-orange-400' : 'text-slate-500'}`} />
                  {item.label}
                  {item.badge && (
                    <span className="xl:ml-auto absolute xl:relative -top-1 -right-1 xl:top-0 xl:right-0 bg-rose-500 xl:bg-orange-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenu Principal (Scrolle indépendamment) */}
        <div className="flex-1 min-w-0 xl:h-full overflow-visible xl:overflow-y-auto overscroll-contain pb-10 scrollbar-hide xl:pr-2">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

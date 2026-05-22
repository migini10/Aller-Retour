'use client';
import React, { useState } from 'react';
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
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      
      {/* Top Bar : Profile & ERP Controls */}
      <div className="sticky top-0 z-20 bg-[#0B0F19]/95 backdrop-blur-xl border-b border-slate-800/80 -mx-5 sm:-mx-8 lg:-mx-12 px-5 sm:px-8 lg:px-12 mb-8">
        <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-indigo-600/20 border-2 border-indigo-500 overflow-hidden flex items-center justify-center">
              <Building2 className="w-8 h-8 text-indigo-400" />
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

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Navigation Sidebar (Desktop) / Top scrollable (Mobile) */}
        <div className="xl:w-64 shrink-0">
          <div className="flex xl:flex-col overflow-x-auto xl:overflow-visible pb-2 xl:pb-0 gap-1.5 xl:gap-1 scrollbar-hide xl:sticky xl:top-32">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap text-sm font-semibold
                    ${isActive 
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenu Principal */}
        <div className="flex-1 min-w-0">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

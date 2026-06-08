'use client';
import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Bus, LayoutDashboard, Route, QrCode, Users, Wallet, Store, Bell, HelpCircle, Settings, MapPin, Activity, ChevronRight, Sun, Moon, Package
} from 'lucide-react';
import { useTheme } from 'next-themes';

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
import SectionColis from './sections/Colis';

const validTabs = [
  'accueil', 'missions', 'localisation', 'scanner', 'passagers', 
  'revenus', 'marketplace', 'colis', 'vehicule', 'notifications', 
  'support', 'parametres'
];

export default function DriverDashboard() {
  const [activeTab, setActiveTab] = useState('accueil');
  const [status, setStatus] = useState('Disponible');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && validTabs.includes(hash)) {
        setActiveTab(hash);
      }
    };
    
    // Initial check
    handleHashChange();
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    window.location.hash = id;
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'accueil': return <SectionAccueil />;
      case 'missions': return <SectionMissions />;
      case 'localisation': return <SectionLocalisation />;
      case 'scanner': return <SectionScanner />;
      case 'passagers': return <SectionPassagers />;
      case 'revenus': return <SectionRevenus />;
      case 'marketplace': return <SectionMarketplace />;
      case 'colis': return <SectionColis />;
      case 'vehicule': return <SectionVehicule />;
      case 'notifications': return <SectionNotifications />;
      case 'support': return <SectionSupport />;
      case 'parametres': return <SectionParametres />;
      default: return <SectionAccueil />;
    }
  };



  return (
    <div className="flex flex-col h-full w-full overflow-y-auto lg:overflow-hidden scrollbar-hide">
      


      {/* Top Bar : Status & Profile (Scrolle sur mobile, fixe sur desktop via le layout) */}
      {activeTab !== 'accueil' && (
        <div className="flex-none z-10 bg-white dark:bg-[#0A0A0A] border-b border-slate-200 dark:border-[#2A2A2A]/80 px-5 sm:px-8 lg:px-12 py-3 transition-colors">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto w-full">
            <button 
              onClick={() => handleTabChange('parametres')}
              className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
            >
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#222222] border-2 border-emerald-500 overflow-hidden relative shrink-0">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Moussa" alt="Profil" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0A0A0A] transition-colors" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white transition-colors">Moussa Ndiaye</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors">Chauffeur • Taxi 7 Places</p>
              </div>
            </button>

            <div className="flex items-center gap-3">            {/* Status Toggle */}
              <div className="flex items-center bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333333] rounded-xl p-1 transition-colors">
                {['Disponible', 'En Trajet', 'Hors Ligne'].map(s => (
                  <button key={s} onClick={() => setStatus(s)} className={`px-2 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all ${status === s ? (s === 'Disponible' ? 'bg-emerald-600 text-white' : s === 'En Trajet' ? 'bg-orange-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white') : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Height Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-8 max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-12 py-4 lg:py-6 overflow-visible lg:overflow-hidden">


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

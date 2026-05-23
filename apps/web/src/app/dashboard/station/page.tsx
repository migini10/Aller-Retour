'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, Ticket, Calendar, Scan, Users, Route, Package, 
  Navigation, Bell, HelpCircle, Settings, LogOut, CheckCircle2
} from 'lucide-react';

import SectionAccueil from './sections/Accueil';
import SectionVente from './sections/Vente';
import SectionReservations from './sections/Reservations';
import SectionScanner from './sections/Scanner';
import SectionEmbarquement from './sections/Embarquement';
import SectionDeparts from './sections/Departs';
import SectionBagages from './sections/Bagages';
import SectionSuivi from './sections/Suivi';
import SectionNotifications from './sections/Notifications';
import SectionSupport from './sections/Support';
import SectionParametres from './sections/Parametres';

const navItems = [
  { id: 'accueil', label: 'Gare Baux Maraîchers', icon: Building2 },
  { id: 'vente', label: 'Vente (Guichet)', icon: Ticket },
  { id: 'reservations', label: 'Réservations', icon: Calendar },
  { id: 'scanner', label: 'Contrôle & Scan', icon: Scan },
  { id: 'embarquement', label: 'Embarquement', icon: Users },
  { id: 'departs', label: 'Départs', icon: Route },
  { id: 'bagages', label: 'Bagages', icon: Package },
  { id: 'suivi', label: 'Suivi GPS', icon: Navigation },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: '2' },
  { id: 'support', label: 'Support Technique', icon: HelpCircle },
  { id: 'parametres', label: 'Paramètres Agent', icon: Settings },
];

export default function StationDashboard() {
  const [activeTab, setActiveTab] = useState('accueil');

  const renderContent = () => {
    switch(activeTab) {
      case 'accueil': return <SectionAccueil />;
      case 'vente': return <SectionVente />;
      case 'reservations': return <SectionReservations />;
      case 'scanner': return <SectionScanner />;
      case 'embarquement': return <SectionEmbarquement />;
      case 'departs': return <SectionDeparts />;
      case 'bagages': return <SectionBagages />;
      case 'suivi': return <SectionSuivi />;
      case 'notifications': return <SectionNotifications />;
      case 'support': return <SectionSupport />;
      case 'parametres': return <SectionParametres />;
      default: return <SectionAccueil />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      
      {/* Top Bar Fixe : Agent Status */}
      <div className="flex-none z-40 bg-[#0B0F19]/95 backdrop-blur-xl border-b border-slate-800/80 px-5 sm:px-8 lg:px-12 py-3">
        <div className="flex items-center justify-between gap-4 max-w-[1600px] mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20">
              AF
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-white leading-none">Amadou Fall</h1>
              <p className="text-[10px] text-orange-400 font-bold uppercase tracking-wider mt-1">Guichet Principal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-500/20 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> En Service
            </span>
            <Link href="/" className="bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 p-2 rounded-lg transition-colors inline-block">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-8 lg:px-12 py-6 pb-10">
        <div className="flex flex-col xl:flex-row gap-6 max-w-[1600px] mx-auto">
          {/* Navigation Sidebar (Desktop) / Top scrollable (Mobile) */}
        <div className="xl:w-64 shrink-0">
          <div className="flex xl:flex-col overflow-x-auto xl:overflow-y-auto overscroll-contain pb-2 xl:pb-2 gap-1.5 xl:gap-2 scrollbar-hide xl:sticky xl:top-0 xl:max-h-[calc(100vh-100px)] xl:bg-[#101728] xl:border xl:border-slate-800/80 xl:p-4 xl:rounded-3xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              // Special styling for primary action buttons (Vente, Scanner)
              const isPrimaryAction = item.id === 'vente' || item.id === 'scanner';

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap text-sm font-semibold
                    ${isActive 
                      ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' 
                      : isPrimaryAction 
                        ? 'bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/20 mb-1'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : isPrimaryAction ? 'text-orange-400' : 'text-slate-500'}`} />
                  {item.label}
                  {item.badge && (
                    <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-white text-orange-600' : 'bg-orange-600 text-white'}`}>
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
    </div>
  );
}

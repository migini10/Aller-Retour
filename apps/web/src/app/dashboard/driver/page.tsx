'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bus, LayoutDashboard, Route, QrCode, Users, Wallet, Store, Bell, HelpCircle, Settings, MapPin, Activity
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Top Bar : Status & Profile */}
      <div className="sticky top-0 z-30 bg-[#101728]/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl px-6 py-3 mb-8 shadow-xl mt-2 lg:-mt-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar (Desktop) / Top scrollable (Mobile) */}
        <div className="lg:w-64 shrink-0">
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto overscroll-contain pb-2 lg:pb-2 gap-1.5 lg:gap-2 scrollbar-hide lg:sticky lg:top-28 lg:max-h-[calc(100vh-140px)] lg:bg-[#101728] lg:border lg:border-slate-800/80 lg:p-4 lg:rounded-3xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap text-sm font-semibold
                    ${isActive 
                      ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-500'}`} />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto bg-orange-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
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

'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Globe, Users, Building2, ShieldCheck, Wallet, Map, 
  BarChart3, Activity, HelpCircle, Settings, LayoutDashboard, LogOut
} from 'lucide-react';

import SectionAccueil from './sections/Accueil';
import SectionTenants from './sections/Tenants';
import SectionUtilisateurs from './sections/Utilisateurs';
import SectionValidations from './sections/Validations';
import SectionFinances from './sections/Finances';
import SectionGeographie from './sections/Geographie';
import SectionSuiviGlobal from './sections/SuiviGlobal';
import SectionAnalytics from './sections/Analytics';
import SectionSupport from './sections/Support';
import SectionMonitoring from './sections/Monitoring';
import SectionParametres from './sections/Parametres';

const navItems = [
  { id: 'accueil', label: 'Overview', icon: LayoutDashboard },
  { id: 'tenants', label: 'Tenants (B2B)', icon: Building2 },
  { id: 'utilisateurs', label: 'Utilisateurs', icon: Users },
  { id: 'validations', label: 'Validations', icon: ShieldCheck, badge: '14' },
  { id: 'finances', label: 'SaaS Finances', icon: Wallet },
  { id: 'geographie', label: 'Expansion Pays', icon: Globe },
  { id: 'suiviglobal', label: 'Radar Global', icon: Map },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'monitoring', label: 'System Health', icon: Activity },
  { id: 'support', label: 'Support L3', icon: HelpCircle },
  { id: 'parametres', label: 'Paramètres', icon: Settings },
];

import { useModal } from '../../../components/ModalContext';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('accueil');
  const { openModal } = useModal();

  const renderContent = () => {
    switch(activeTab) {
      case 'accueil': return <SectionAccueil />;
      case 'tenants': return <SectionTenants />;
      case 'utilisateurs': return <SectionUtilisateurs />;
      case 'validations': return <SectionValidations />;
      case 'finances': return <SectionFinances />;
      case 'geographie': return <SectionGeographie />;
      case 'suiviglobal': return <SectionSuiviGlobal />;
      case 'analytics': return <SectionAnalytics />;
      case 'monitoring': return <SectionMonitoring />;
      case 'support': return <SectionSupport />;
      case 'parametres': return <SectionParametres />;
      default: return <SectionAccueil />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      
      {/* Top Bar Fixe : Super Admin Identity */}
      <div className="flex-none z-40 bg-[#0B0F19]/95 backdrop-blur-xl border-b border-slate-800/80 px-5 sm:px-8 lg:px-12 py-3">
        <div className="flex items-center justify-between gap-4 max-w-[1600px] mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-purple-600 p-[1px]">
              <div className="w-full h-full bg-[#0B0F19] rounded-[11px] flex items-center justify-center">
                <Globe className="w-5 h-5 text-orange-400" />
              </div>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-none">Abdou Bakhe</h1>
              <p className="text-[10px] text-orange-400 font-bold uppercase tracking-wider mt-1">SaaS Owner / Super Admin</p>
            </div>
          </div>

          <Link href="/" className="bg-slate-900 border border-slate-700 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 text-slate-300 p-2 rounded-lg transition-colors inline-block">
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Full Height Content Area */}
      <div className="flex-1 flex flex-col xl:flex-row gap-6 max-w-[1600px] mx-auto w-full px-5 sm:px-8 lg:px-12 py-6 overflow-hidden">
        {/* Navigation Sidebar (Desktop) / Top scrollable (Mobile) */}
        <div className="xl:w-64 shrink-0 xl:h-full">
          <div className="flex xl:flex-col overflow-x-auto xl:overflow-y-auto overscroll-contain pb-2 xl:pb-2 gap-1.5 xl:gap-2 scrollbar-hide xl:h-full xl:bg-[#101728] xl:border xl:border-slate-800/80 xl:p-4 xl:rounded-3xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap text-sm font-semibold shrink-0
                    ${isActive 
                      ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.2)] border border-orange-400/30' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {item.label}
                  {item.badge && (
                    <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-white text-orange-600' : 'bg-rose-500 text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenu Principal (Scrolle indépendamment) */}
        <div className="flex-1 min-w-0 h-full overflow-y-auto overscroll-contain pb-10 scrollbar-hide pr-2">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

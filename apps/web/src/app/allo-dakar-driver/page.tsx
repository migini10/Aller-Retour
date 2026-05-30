'use client';
import React, { useState } from 'react';
import { 
  Car, Map, Target, Clock, Wallet, Settings, Power, 
  MapPin, User, ArrowRight, Menu, Bell
} from 'lucide-react';
import Link from 'next/link';

const alloTabs = [
  { id: 'dashboard', label: 'Dashboard', icon: Car },
  { id: 'courses', label: 'Courses', icon: ArrowRight },
  { id: 'carte', label: 'Carte GPS', icon: Map },
  { id: 'zones', label: 'Zones', icon: Target },
  { id: 'historique', label: 'Historique', icon: Clock },
  { id: 'revenus', label: 'Revenus', icon: Wallet },
  { id: 'parametres', label: 'Paramètres', icon: Settings },
];

export default function AlloDakarApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'AUTO' | 'MANUEL'>('MANUEL');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200 font-sans flex flex-col md:flex-row">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#101728] border-r border-slate-800/80 p-4 shrink-0">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
            <Car className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white leading-tight">Allo Dakar</h1>
            <p className="text-[10px] text-orange-400 font-bold tracking-widest uppercase">Driver App</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {alloTabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-5 h-5" /> {tab.label}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <Link href="/dashboard/driver" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-400 hover:text-white transition-colors">
            <ArrowRight className="w-5 h-5 rotate-180" /> Quitter Allo Dakar
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-[100dvh] relative">
        
        {/* Topbar Mobile */}
        <header className="flex items-center justify-between p-4 bg-[#101728] border-b border-slate-800 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-black text-white">Aller<span className="text-orange-500">Retour</span></h1>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold transition-colors shadow-sm">
            Allo Dakar
          </button>
        </header>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[73px] left-0 right-0 bg-[#101728] border-b border-slate-800 z-40 p-4 shadow-2xl">
            <nav className="space-y-2">
              {alloTabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === tab.id 
                      ? 'bg-orange-600 text-white' 
                      : 'text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" /> {tab.label}
                  </button>
                )
              })}
              <div className="pt-4 mt-4 border-t border-slate-800">
                <Link href="/dashboard/driver" className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-400">
                  <ArrowRight className="w-5 h-5 rotate-180" /> Quitter Allo Dakar
                </Link>
              </div>
            </nav>
          </div>
        )}

        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          
          {/* Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101728] border border-slate-800 p-5 rounded-2xl mb-8 shadow-sm">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsActive(!isActive)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  isActive 
                  ? 'bg-emerald-500 text-white shadow-emerald-500/30' 
                  : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Power className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  {isActive ? 'Vous êtes En Ligne' : 'Vous êtes Hors Ligne'}
                </h2>
                <p className="text-sm text-slate-400">
                  {isActive ? "Réception des trajets inter-urbains activée" : "Activez pour recevoir des trajets inter-urbains"}
                </p>
              </div>
            </div>

            {isActive && (
              <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800 shrink-0">
                <button 
                  onClick={() => setMode('AUTO')}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${mode === 'AUTO' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Automatique
                </button>
                <button 
                  onClick={() => setMode('MANUEL')}
                  className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${mode === 'MANUEL' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Manuel
                </button>
              </div>
            )}
          </div>

          {/* Content Area */}
          {!isActive && activeTab !== 'parametres' ? (
             <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
               <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center border border-slate-800">
                 <Power className="w-10 h-10 text-slate-600" />
               </div>
               <div>
                 <p className="text-white font-bold text-2xl mb-2">Passez En Ligne</p>
                 <p className="text-slate-400 text-sm max-w-sm mx-auto">Appuyez sur le bouton Power en haut pour commencer à recevoir des demandes de trajets inter-urbains (Confort & Éco).</p>
               </div>
             </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'dashboard' && <AlloDashboard />}
              {activeTab === 'courses' && <AlloCourses />}
              {activeTab === 'carte' && <AlloCarte />}
              {activeTab === 'zones' && <AlloZones />}
              {activeTab === 'historique' && <p className="text-slate-400 p-4">Historique de vos trajets inter-urbains Allo Dakar.</p>}
              {activeTab === 'revenus' && <p className="text-slate-400 p-4">Vos revenus Allo Dakar.</p>}
              {activeTab === 'parametres' && <p className="text-slate-400 p-4">Paramètres de l'application.</p>}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

// -------------------------------------------------------------
// Sub-Components
// -------------------------------------------------------------

function AlloDashboard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-[#101728] border border-slate-800 rounded-2xl p-6 shadow-sm">
        <p className="text-sm text-slate-400 mb-2 font-semibold uppercase tracking-wider">Revenus du jour</p>
        <p className="text-4xl font-black text-white">12 500 <span className="text-lg text-slate-500">FCFA</span></p>
      </div>
      <div className="bg-[#101728] border border-slate-800 rounded-2xl p-6 shadow-sm">
        <p className="text-sm text-slate-400 mb-2 font-semibold uppercase tracking-wider">Trajets réalisés</p>
        <p className="text-4xl font-black text-white">4</p>
      </div>
      <div className="bg-[#101728] border border-slate-800 rounded-2xl p-6 shadow-sm">
        <p className="text-sm text-slate-400 mb-2 font-semibold uppercase tracking-wider">Taux d'acceptation</p>
        <p className="text-4xl font-black text-emerald-400">92%</p>
      </div>
    </div>
  );
}

function AlloCourses() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white text-xl">Nouvelle Tournée de Covoiturage</h3>
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
        </span>
      </div>
      
      <div className="bg-[#101728] border-2 border-orange-500/50 rounded-3xl p-6 shadow-2xl shadow-orange-500/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-700">
              <Car className="text-slate-400 w-8 h-8" />
            </div>
            <div>
              <p className="font-black text-white text-2xl">Dakar → Saint-Louis</p>
              <div className="flex items-center gap-2 text-sm font-bold">
                <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">Allo Dakar Confort</span>
                <span className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">3 Passagers (Domicile)</span>
              </div>
            </div>
          </div>
          <div className="sm:text-right bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
            <p className="text-xs text-emerald-400 uppercase font-bold tracking-widest mb-1">Gain Total</p>
            <p className="text-3xl font-black text-emerald-400">25 500 <span className="text-base">FCFA</span></p>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800 space-y-4">
          <p className="text-sm font-bold text-slate-400 mb-2 border-b border-slate-800 pb-2">Plan de Récupération (Départs)</p>
          
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
              <span className="text-emerald-500 font-bold text-xs">1</span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Mermoz, Dakar • 08:00</p>
              <div className="flex justify-between items-center">
                <p className="font-bold text-white text-lg">Fatou Diop</p>
                <span className="text-xs bg-slate-800 px-2 py-1 rounded-lg text-slate-300">1 Place</span>
              </div>
            </div>
          </div>
          <div className="ml-4 w-0.5 h-4 bg-slate-800"></div>
          
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
              <span className="text-emerald-500 font-bold text-xs">2</span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Point E, Dakar • 08:20</p>
              <div className="flex justify-between items-center">
                <p className="font-bold text-white text-lg">Modou Fall</p>
                <span className="text-xs bg-slate-800 px-2 py-1 rounded-lg text-slate-300">1 Place</span>
              </div>
            </div>
          </div>
          <div className="ml-4 w-0.5 h-4 bg-slate-800"></div>
          
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-1">
              <span className="text-emerald-500 font-bold text-xs">3</span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Parcelles Assainies U15 • 08:45</p>
              <div className="flex justify-between items-center">
                <p className="font-bold text-white text-lg">Awa Ndiaye</p>
                <span className="text-xs bg-slate-800 px-2 py-1 rounded-lg text-slate-300">1 Place</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20">
            ACCEPTER LA TOURNÉE
          </button>
          <button className="sm:w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-lg py-4 rounded-2xl transition-colors border border-slate-700">
            Refuser
          </button>
        </div>
      </div>
    </div>
  );
}

function AlloCarte() {
  return (
    <div className="space-y-4 h-[calc(100dvh-180px)] min-h-[500px]">
      <div 
        className="relative w-full h-full border border-slate-700/60 rounded-3xl overflow-hidden shadow-2xl"
        style={{ backgroundImage: "url('/dakar-map-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-[#0a1520]/40 mix-blend-multiply pointer-events-none" />
        
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
          {/* Zone de forte demande (Heatmap) */}
          <circle cx="450" cy="200" r="80" fill="#f97316" opacity="0.15" filter="blur(20px)" />
          
          {/* Position Chauffeur */}
          <g transform="translate(400, 250)">
            <circle cx="0" cy="0" r="8" fill="#10b981" />
            <circle cx="0" cy="0" r="16" fill="#10b981" opacity="0.2">
              <animate attributeName="r" values="16;32;16" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Points de récupération multiples */}
          <g transform="translate(300, 200)">
            <circle cx="0" cy="0" r="6" fill="#fff" />
            <text x="0" y="-12" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">Mermoz</text>
          </g>
          <g transform="translate(350, 150)">
            <circle cx="0" cy="0" r="6" fill="#fff" />
            <text x="0" y="-12" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">Point E</text>
          </g>
          <g transform="translate(480, 120)">
            <circle cx="0" cy="0" r="6" fill="#fff" />
            <text x="0" y="-12" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">Parcelles</text>
          </g>
          
          <path d="M300,200 L350,150 L480,120" stroke="#f97316" strokeWidth="4" fill="none" strokeDasharray="6 6">
             <animate attributeName="stroke-dashoffset" from="12" to="0" dur="1s" repeatCount="indefinite" />
          </path>
        </svg>

        <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-md border border-emerald-500/30 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-lg pointer-events-auto">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-bold text-white">En attente de trajet inter-urbain</span>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
          <Link 
            href="/navigation/driver"
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black text-lg py-4 rounded-2xl transition-all shadow-lg shadow-orange-500/20 flex justify-center items-center gap-2"
          >
            <Navigation className="w-5 h-5" /> DÉMARRER LA NAVIGATION
          </Link>
        </div>
      </div>
    </div>
  );
}

function AlloZones() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Axes Inter-Urbains Préférés</h2>
        <p className="text-slate-400">Cochez les villes et régions vers lesquelles vous souhaitez voyager en Confort/Éco. Si vous laissez tout vide, vous recevrez toutes les demandes nationales.</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {['Thiès', 'Saint-Louis', 'Touba', 'Mbour', 'Kaolack', 'Saly', 'Ziguinchor', 'Louga', 'Diourbel', 'Fatick', 'Kolda', 'Matam'].map((zone, i) => (
          <button key={zone} className={`p-4 rounded-2xl border-2 transition-all ${i < 3 ? 'bg-orange-600/10 border-orange-500 text-orange-400 shadow-sm shadow-orange-500/10' : 'bg-[#101728] border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'}`}>
            <span className="block text-center font-bold text-sm">{zone}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

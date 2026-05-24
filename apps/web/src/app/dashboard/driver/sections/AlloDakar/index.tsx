import React, { useState } from 'react';
import { 
  Car, Map, Target, Clock, Wallet, Settings, Power, 
  MapPin, User, Phone, MessageSquare, Navigation, ArrowRight 
} from 'lucide-react';

const alloTabs = [
  { id: 'dashboard', label: 'Dashboard', icon: Car },
  { id: 'courses', label: 'Courses', icon: ArrowRight },
  { id: 'carte', label: 'Carte GPS', icon: Map },
  { id: 'zones', label: 'Zones d\'Activité', icon: Target },
  { id: 'historique', label: 'Historique', icon: Clock },
  { id: 'revenus', label: 'Revenus', icon: Wallet },
  { id: 'parametres', label: 'Paramètres', icon: Settings },
];

export default function SectionAlloDakar() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'AUTO' | 'MANUEL'>('MANUEL');

  return (
    <div className="space-y-6">
      {/* Header Allo Dakar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101728] border border-orange-500/30 p-5 rounded-2xl shadow-lg shadow-orange-500/5">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Mode Allo Dakar
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                {isActive ? 'EN LIGNE' : 'HORS LIGNE'}
              </span>
            </h2>
            <p className="text-sm text-slate-400">Courses locales instantanées (Taxis & Express)</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isActive && (
            <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800">
              <button 
                onClick={() => setMode('AUTO')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${mode === 'AUTO' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                AUTO
              </button>
              <button 
                onClick={() => setMode('MANUEL')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${mode === 'MANUEL' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                MANUEL
              </button>
            </div>
          )}
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg ${isActive ? 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 shadow-red-500/10' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'}`}
          >
            <Power className="w-4 h-4" /> {isActive ? 'Désactiver' : 'Activer'}
          </button>
        </div>
      </div>

      {/* Internal Navigation Allo Dakar */}
      <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2">
        {alloTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors shrink-0 ${activeTab === tab.id ? 'bg-slate-800 text-white border border-slate-700' : 'bg-transparent text-slate-400 hover:text-slate-200 border border-transparent hover:bg-slate-800/50'}`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content Area */}
      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-5 min-h-[400px]">
        {!isActive && activeTab !== 'parametres' ? (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
              <Power className="w-8 h-8 text-slate-600" />
            </div>
            <div>
              <p className="text-white font-bold text-lg">Allo Dakar est désactivé</p>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">Activez le mode Allo Dakar pour recevoir des courses instantanées dans votre zone d'activité.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'dashboard' && <AlloDashboard />}
            {activeTab === 'courses' && <AlloCourses />}
            {activeTab === 'carte' && <AlloCarte />}
            {activeTab === 'zones' && <AlloZones />}
            {activeTab === 'historique' && <p className="text-slate-400">Historique de vos courses Allo Dakar.</p>}
            {activeTab === 'revenus' && <p className="text-slate-400">Vos revenus locaux (Allo Dakar).</p>}
            {activeTab === 'parametres' && <p className="text-slate-400">Paramètres et préférences de réception.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function AlloDashboard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <p className="text-sm text-slate-400 mb-1">Revenus du jour</p>
        <p className="text-2xl font-bold text-white">12 500 <span className="text-sm text-slate-500">FCFA</span></p>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <p className="text-sm text-slate-400 mb-1">Courses réalisées</p>
        <p className="text-2xl font-bold text-white">4</p>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <p className="text-sm text-slate-400 mb-1">Taux d'acceptation</p>
        <p className="text-2xl font-bold text-emerald-400">92%</p>
      </div>
    </div>
  );
}

function AlloCourses() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white">Demandes en attente (1)</h3>
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
        </span>
      </div>
      
      <div className="bg-slate-900 border border-orange-500/30 rounded-2xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
              <User className="text-slate-400" />
            </div>
            <div>
              <p className="font-bold text-white text-lg">Modou Fall</p>
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="text-amber-400 flex items-center">⭐ 4.8</span>
                <span className="text-slate-500">• Paiement Espèces</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-emerald-400">2 500 FCFA</p>
            <p className="text-xs text-slate-400">Estimation</p>
          </div>
        </div>

        <div className="space-y-3 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
          <div className="relative flex items-center gap-3 pl-8 md:pl-0">
            <div className="absolute left-0 md:left-1/2 w-6 h-6 rounded-full bg-slate-900 border-2 border-emerald-500 flex items-center justify-center -translate-x-3"></div>
            <div className="w-full md:w-1/2 md:pr-8 md:text-right">
              <p className="text-xs text-slate-500 uppercase font-bold">Récupération • 2 min (800m)</p>
              <p className="font-bold text-white">Rond-point Médina</p>
            </div>
          </div>
          <div className="relative flex items-center gap-3 pl-8 md:pl-0">
            <div className="absolute left-0 md:left-1/2 w-6 h-6 rounded-full bg-slate-900 border-2 border-orange-500 flex items-center justify-center -translate-x-3"></div>
            <div className="w-full md:w-1/2 md:ml-auto md:pl-8">
              <p className="text-xs text-slate-500 uppercase font-bold">Destination • 15 min (4.2km)</p>
              <p className="font-bold text-white">Point E, Piscine Olympique</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-colors">
            Accepter
          </button>
          <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors">
            Refuser
          </button>
        </div>
      </div>
    </div>
  );
}

function AlloCarte() {
  return (
    <div className="space-y-4">
      <div 
        className="relative h-[400px] border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl"
        style={{ backgroundImage: "url('/dakar-map-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-[#0a1520]/40 mix-blend-multiply pointer-events-none" />
        
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
          {/* Zone de forte demande (Heatmap) */}
          <circle cx="450" cy="200" r="80" fill="#f97316" opacity="0.15" filter="blur(20px)" />
          <circle cx="450" cy="200" r="40" fill="#f97316" opacity="0.2" filter="blur(10px)" />
          <text x="450" y="200" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold" opacity="0.8">Forte Demande</text>

          {/* Position Chauffeur */}
          <g transform="translate(400, 250)">
            <circle cx="0" cy="0" r="8" fill="#10b981" />
            <circle cx="0" cy="0" r="16" fill="#10b981" opacity="0.2">
              <animate attributeName="r" values="16;32;16" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>

        <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-white">Allo Dakar Actif</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlloZones() {
  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-sm">Définissez vos zones de préférence pour recevoir des courses pertinentes.</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {['Plateau', 'Yoff', 'Médina', 'Parcelles', 'Ouakam', 'Sacré-Cœur', 'Liberté', 'Point E'].map((zone, i) => (
          <button key={zone} className={`p-3 rounded-xl border text-sm font-bold transition-colors ${i < 3 ? 'bg-orange-600/20 border-orange-500/50 text-orange-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'}`}>
            {zone}
          </button>
        ))}
      </div>
    </div>
  );
}

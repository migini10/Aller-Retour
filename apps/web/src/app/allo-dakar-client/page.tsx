'use client';
import React, { useState } from 'react';
import { 
  MapPin, Calendar, Users, CarFront, ChevronRight, 
  Menu, Bell, ArrowRight, Star, Clock, Map, Navigation,
  ShieldCheck, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

const clientTabs = [
  { id: 'reserver', label: 'Réserver', icon: CarFront },
  { id: 'trajets', label: 'Mes Trajets', icon: Clock },
  { id: 'suivi', label: 'Suivi GPS', icon: Map },
];

export default function AlloDakarClientApp() {
  const [activeTab, setActiveTab] = useState('reserver');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-200 font-sans flex flex-col md:flex-row">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#101728] border-r border-slate-800/80 p-4 shrink-0">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
            <CarFront className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white leading-tight">Allo Dakar</h1>
            <p className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">Client App</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {clientTabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-5 h-5" /> {tab.label}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <Link href="/dashboard/traveller" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-400 hover:text-white transition-colors">
            <ArrowRight className="w-5 h-5 rotate-180" /> Quitter Allo Dakar
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-[100dvh] relative">
        
        <header className="flex items-center justify-between p-4 bg-[#101728] border-b border-slate-800 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-black text-white">Aller<span className="text-emerald-500">Retour</span></h1>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-colors shadow-sm">
            Allo Dakar
          </button>
        </header>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[73px] left-0 right-0 bg-[#101728] border-b border-slate-800 z-40 p-4 shadow-2xl">
            <nav className="space-y-2">
              {clientTabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      activeTab === tab.id 
                      ? 'bg-emerald-600 text-white' 
                      : 'text-slate-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" /> {tab.label}
                  </button>
                )
              })}
              <div className="pt-4 mt-4 border-t border-slate-800">
                <Link href="/dashboard/traveller" className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-400">
                  <ArrowRight className="w-5 h-5 rotate-180" /> Quitter Allo Dakar
                </Link>
              </div>
            </nav>
          </div>
        )}

        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            {activeTab === 'reserver' && <ClientReservation />}
            {activeTab === 'trajets' && <ClientTrajets />}
            {activeTab === 'suivi' && <ClientSuiviGPS />}
          </div>

        </div>
      </main>
    </div>
  );
}

// -------------------------------------------------------------
// Sub-Components
// -------------------------------------------------------------

function ClientReservation() {
  const [step, setStep] = useState(1);
  const [carClass, setCarClass] = useState<'ECO' | 'CONFORT' | null>(null);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white mb-2">Covoiturage Domicile</h2>
        <p className="text-slate-400">On vient vous chercher chez vous pour votre voyage inter-urbain.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Formulaire de Recherche */}
        <div className="bg-[#101728] border border-slate-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <MapPin className="text-emerald-500 w-5 h-5" />
            Votre Itinéraire
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Adresse de départ (Domicile)</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-500" />
                <input 
                  type="text" 
                  placeholder="Ex: Mermoz, Rue 3, Dakar" 
                  className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-2xl py-4 pl-10 pr-4 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Adresse d'arrivée (Destination)</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-orange-500" />
                <input 
                  type="text" 
                  placeholder="Ex: Saly Portudal, Résidence X" 
                  className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-2xl py-4 pl-10 pr-4 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="date" 
                    className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-2xl py-3.5 pl-10 pr-4 focus:outline-none focus:border-emerald-500 appearance-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Places</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select className="w-full bg-slate-900 border border-slate-700 text-white rounded-2xl py-3.5 pl-10 pr-4 focus:outline-none focus:border-emerald-500 appearance-none">
                    <option>1 Passager</option>
                    <option>2 Passagers</option>
                    <option>3 Passagers</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sélection Classe */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white mb-4">Choisissez votre confort</h3>
          
          {/* Option ECO */}
          <button 
            onClick={() => setCarClass('ECO')}
            className={`w-full text-left p-5 rounded-3xl border-2 transition-all ${
              carClass === 'ECO' 
              ? 'bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/10' 
              : 'bg-[#101728] border-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-black text-xl text-white">Allo Dakar Éco</h4>
              <span className="font-black text-xl text-emerald-400">8 500 F</span>
            </div>
            <p className="text-sm text-slate-400 mb-4">Voiture standard climatisée. Partagée avec max 3 autres passagers. Trajet économique et écologique.</p>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> 4 Places max</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Chauffeur Pro</span>
            </div>
          </button>

          {/* Option CONFORT */}
          <button 
            onClick={() => setCarClass('CONFORT')}
            className={`w-full text-left p-5 rounded-3xl border-2 transition-all ${
              carClass === 'CONFORT' 
              ? 'bg-orange-500/10 border-orange-500 shadow-lg shadow-orange-500/10' 
              : 'bg-[#101728] border-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <h4 className="font-black text-xl text-white">Allo Dakar Confort</h4>
                <span className="text-[10px] uppercase font-black bg-orange-500 text-white px-2 py-0.5 rounded-lg">Premium</span>
              </div>
              <span className="font-black text-xl text-orange-400">12 500 F</span>
            </div>
            <p className="text-sm text-slate-400 mb-4">SUV ou Berline de luxe. Espace étendu pour les jambes, Wi-Fi inclus. Partagée avec max 2 autres passagers.</p>
            <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> 3 Places max</span>
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400" /> Chauffeur Top Rated</span>
            </div>
          </button>

          <button 
            disabled={!carClass}
            className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${
              carClass 
              ? 'bg-white text-slate-900 hover:bg-slate-200 shadow-xl shadow-white/10' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            CONFIRMER LA RÉSERVATION
          </button>

        </div>
      </div>
    </div>
  );
}

function ClientTrajets() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-black text-white">Trajets à venir</h2>
      
      <div className="bg-[#101728] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl shadow-emerald-500/5">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="inline-block bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-lg border border-emerald-500/30 mb-2">
              Confirmé
            </span>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Mardi 26 Mai • 08:00</p>
          </div>
          <div className="text-right">
            <p className="font-black text-xl text-white">Allo Dakar Confort</p>
            <p className="text-sm text-slate-400">Paiement Mobile Money</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
          <div className="flex-1 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-1">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Récupération Domicile</p>
                <p className="font-bold text-white text-lg">Mermoz, Rue 3, Dakar</p>
              </div>
            </div>
            <div className="ml-4 w-0.5 h-6 bg-slate-800"></div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-1">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Dépôt Domicile</p>
                <p className="font-bold text-white text-lg">Gare de Sor, Saint-Louis</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto p-4 bg-slate-800/50 rounded-2xl border border-slate-700 flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-xl">👨🏾‍✈️</div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">Votre Chauffeur</p>
              <p className="font-bold text-white">Ousmane Sow</p>
              <p className="text-xs text-amber-400 font-bold">⭐ 4.9</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClientSuiviGPS() {
  return (
    <div className="space-y-4 h-[calc(100dvh-120px)] min-h-[500px]">
      <div className="flex items-center justify-between bg-[#101728] p-4 rounded-2xl border border-slate-800 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center">
            <CarFront className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">Votre chauffeur arrive !</h2>
            <p className="text-sm text-slate-400">Hyundai Tucson • AA-123-BB</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-black text-2xl text-emerald-400">3 min</p>
          <p className="text-xs font-bold text-slate-500 uppercase">Distance: 800m</p>
        </div>
      </div>

      <div 
        className="relative w-full h-[calc(100%-90px)] border border-slate-700/60 rounded-3xl overflow-hidden shadow-2xl"
        style={{ backgroundImage: "url('/dakar-map-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-[#0a1520]/40 mix-blend-multiply pointer-events-none" />
        
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
          {/* Point du Domicile (Client) */}
          <g transform="translate(600, 200)">
            <circle cx="0" cy="0" r="12" fill="#3b82f6" opacity="0.3">
              <animate attributeName="r" values="12;24;12" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="6" fill="#3b82f6" />
            <circle cx="0" cy="0" r="3" fill="#fff" />
            <text x="0" y="-15" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">Mon Domicile</text>
          </g>

          {/* Itinéraire du Chauffeur */}
          <path d="M200,250 L300,220 L450,230 L600,200" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="8 8">
            <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1s" repeatCount="indefinite" />
          </path>

          {/* Voiture en mouvement */}
          <g transform="translate(450, 230)">
            <circle cx="0" cy="0" r="16" fill="#10b981" />
            <path d="M-6,-4 L6,-4 L8,4 L-8,4 Z" fill="#fff" opacity="0.8" />
            <text x="0" y="-22" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">Ousmane</text>
          </g>

          {/* Autres passagers déjà dans la voiture */}
          <g transform="translate(200, 250)">
            <circle cx="0" cy="0" r="4" fill="#94a3b8" />
            <text x="0" y="-10" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">Passager 1 (Récupéré)</text>
          </g>
        </svg>
      </div>
    </div>
  );
}

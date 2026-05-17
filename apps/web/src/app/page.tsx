'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bus, 
  MapPin, 
  Calendar, 
  Users, 
  Shield, 
  ArrowRight, 
  Smartphone, 
  Wallet, 
  Menu, 
  X, 
  User, 
  Building2, 
  TicketCheck, 
  ShieldAlert,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  Clock,
  Lock,
  Zap,
  Award,
  Star,
  Check,
  ChevronRight,
  Package,
  Navigation
} from 'lucide-react';

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTab, setSearchTab] = useState<'bus' | 'package' | 'vtc'>('bus');
  const [departure, setDeparture] = useState('Dakar (Baux Maraîchers)');
  const [destination, setDestination] = useState('Touba');

  const navDashboards = [
    { name: 'Espace Voyageur', path: '/dashboard/client', icon: User, badge: 'Client', desc: 'Réserver un billet QR, Miles de fidélité & bagages' },
    { name: 'Espace Chauffeur', path: '/dashboard/driver', icon: Bus, badge: 'Driver', desc: 'Cockpit GPS, manifeste passagers offline & cashout' },
    { name: 'Transporteur / GIE', path: '/dashboard/carrier', icon: Building2, badge: 'GIE', desc: 'Supervision de la flotte, trésorerie & séquestre' },
    { name: 'Guichet de Gare', path: '/dashboard/dispatcher', icon: TicketCheck, badge: 'POS', desc: 'Vente express au comptoir & scan QR d\'embarquement' },
    { name: 'Super Admin', path: '/dashboard/superadmin', icon: ShieldAlert, badge: 'Global', desc: 'Souveraineté financière, audits d\'État & validation KYC' },
  ];

  const popularRoutes = [
    { from: 'Dakar', to: 'Touba', price: '4 500 FCFA', duration: '2h45', time: '08:00, 14:30' },
    { from: 'Dakar', to: 'Saint-Louis', price: '5 000 FCFA', duration: '3h30', time: '07:30, 15:00' },
    { from: 'Thiès', to: 'Ziguinchor', price: '9 000 FCFA', duration: '8h00', time: '21:00 (Bus Nuit)' },
    { from: 'Touba', to: 'Tambacounda', price: '7 500 FCFA', duration: '5h30', time: '06:00 Express' },
  ];

  return (
    <div className="relative overflow-hidden flex-grow min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Arrière-plan Premium avec effets de lumière radiaux */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Topbar / En-tête Premium */}
      <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-all duration-300 border border-emerald-400/30">
              <Bus className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Aller<span className="text-emerald-400 font-extrabold">-</span>Retour
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">
                Panafrican Mobility Cloud
              </span>
            </div>
          </Link>

          {/* Navigation fluide Premium */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-slate-300">
            <a href="#search" className="hover:text-emerald-400 transition-colors py-2 flex items-center gap-1.5 group">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span>Réservation</span>
            </a>
            <a href="#features" className="hover:text-emerald-400 transition-colors py-2 flex items-center gap-1.5 group">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span>Transporteurs GIE</span>
            </a>
            <a href="#marketplace" className="hover:text-emerald-400 transition-colors py-2 flex items-center gap-1.5 group">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span>Chauffeurs Libres</span>
            </a>
            <a href="#escrow" className="hover:text-emerald-400 transition-colors py-2 flex items-center gap-1.5 group">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span>Séquestre Wave / OM</span>
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <Link 
              href="/dashboard/client" 
              className="hidden sm:inline-flex px-5 py-2.5 rounded-xl border border-slate-700/80 hover:border-slate-500 text-sm font-bold text-white transition-all hover:bg-slate-800/60 shadow-sm"
            >
              Espace Voyageur
            </Link>
            <Link 
              href="/dashboard/dispatcher" 
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
            >
              <TicketCheck className="w-4 h-4" />
              <span>Accès Guichet</span>
            </Link>

            {/* Bouton Menu pour Sidebar */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 rounded-xl border border-slate-700 bg-slate-800/60 text-white hover:bg-slate-800 hover:text-emerald-400 transition-all focus:outline-none shadow-md"
              title="Ouvrir le menu de navigation"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu Sidebar / Drawer Coulissant (À Gauche) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 max-w-full flex pr-10 animate-slide-right">
            <div className="w-screen max-w-md bg-slate-900 border-r border-slate-800 shadow-2xl p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 border border-emerald-400/30">
                      <Bus className="w-6 h-6 text-slate-950 font-bold" />
                    </div>
                    <div>
                      <span className="text-xl font-black tracking-tight text-white block">Aller-Retour</span>
                      <span className="text-xs text-emerald-400 font-medium">Sélecteur de Tableaux de Bord</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700/50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Portails Connectés (Rôles Démo)
                </p>

                <div className="space-y-3">
                  {navDashboards.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-start p-4 rounded-2xl border border-slate-800/80 bg-slate-800/30 hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10 hover:border-emerald-500/50 transition-all duration-300 group shadow-sm"
                      >
                        <div className="w-12 h-12 rounded-xl bg-slate-800/90 group-hover:bg-emerald-500/20 border border-slate-700 group-hover:border-emerald-500/30 flex items-center justify-center mr-4 shrink-0 transition-colors shadow-inner">
                          <IconComponent className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                              <span>{item.name}</span>
                              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h4>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 bg-slate-800 border border-slate-700 text-emerald-400 rounded-md">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-slate-800 pt-6 mt-8">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Mode Démo Panafricain</span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-black rounded-lg">ONLINE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section Premium */}
      <section id="search" className="pt-20 pb-24 px-6 max-w-6xl mx-auto text-center scroll-mt-28 relative">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-400 text-xs font-bold mb-8 shadow-xl shadow-emerald-500/10 backdrop-blur-md animate-pulse">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>L'infrastructure digitale souveraine du transport inter-urbain en Afrique</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-8 text-white">
          Réservez. Embarquez par QR. <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Voyagez sans attente en gare.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-14 leading-relaxed font-normal">
          La première plateforme unifiée connectant passagers, grandes flottes de bus GIE et chauffeurs libres. Vos paiements Wave ou Orange Money sont sécurisés en compte séquestre jusqu'à l'arrivée.
        </p>

        {/* Cockpit de Recherche Interactif Premium */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-2xl max-w-5xl mx-auto text-left overflow-hidden border-t-emerald-500/30 border-t-2">
          {/* Tabs du Cockpit */}
          <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 pt-4 gap-2 overflow-x-auto">
            {[
              { id: 'bus', label: 'Billets de Bus (GIE)', icon: Bus },
              { id: 'vtc', label: 'Taxis (4 & 7 places) & Covoiturage', icon: Navigation },
              { id: 'package', label: 'Envoi Colis & Courrier Express', icon: Package },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSearchTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3.5 rounded-t-2xl font-bold text-sm transition-all border-b-2 ${
                    searchTab === tab.id
                      ? 'bg-slate-900 border-emerald-400 text-white shadow-lg text-emerald-400'
                      : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Gare de Départ</span>
                </label>
                <select 
                  value={departure} 
                  onChange={(e) => setDeparture(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-4 text-sm font-bold text-white focus:outline-none focus:border-emerald-500 shadow-inner transition-colors cursor-pointer"
                >
                  <option>Dakar (Baux Maraîchers)</option>
                  <option>Touba (Gare Centrale)</option>
                  <option>Thiès (Gare Routière)</option>
                  <option>Saint-Louis</option>
                  <option>Ziguinchor</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>Destination Cible</span>
                </label>
                <select 
                  value={destination} 
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-4 text-sm font-bold text-white focus:outline-none focus:border-emerald-500 shadow-inner transition-colors cursor-pointer"
                >
                  <option>Touba (Gare Centrale)</option>
                  <option>Saint-Louis</option>
                  <option>Thiès (Gare Routière)</option>
                  <option>Ziguinchor</option>
                  <option>Tambacounda</option>
                  <option>Kaolack</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span>Date de Voyage</span>
                </label>
                <input 
                  type="date" 
                  defaultValue="2026-05-18" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-4 text-sm font-bold text-white focus:outline-none focus:border-emerald-500 shadow-inner transition-colors color-scheme-dark cursor-pointer" 
                />
              </div>

              <div>
                <Link 
                  href="/dashboard/client" 
                  className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-2.5"
                >
                  <span>Rechercher les départs</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Popular Routes Quick Badges */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" /> Lignes directes populaires :
              </span>
              <div className="flex flex-wrap gap-3">
                {popularRoutes.map((route, idx) => (
                  <Link 
                    key={idx}
                    href="/dashboard/client"
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/80 hover:border-emerald-500/50 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-2 group"
                  >
                    <span>{route.from} ➔ {route.to}</span>
                    <span className="text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded-lg group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                      {route.price}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Bar Premium */}
      <section className="py-12 border-y border-slate-800/80 bg-slate-900/40 backdrop-blur-md relative z-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-4xl md:text-5xl font-black text-white bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              1.2M+
            </h3>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">Billets Émis en Gare</p>
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-black text-white bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
              28 GIE
            </h3>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">Flottes de Bus Connectées</p>
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-black text-white bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
              0%
            </h3>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">Frais de Séquestre Bancaire</p>
          </div>
          <div>
            <h3 className="text-4xl md:text-5xl font-black text-white bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              99.8%
            </h3>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">Départs Garantis à l'Heure</p>
          </div>
        </div>
      </section>

      {/* Section 1 : Séquestre & Transparence Financière (Escrow Hold) */}
      <section id="escrow" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold mb-6">
              <Lock className="w-4 h-4" /> Technologie de Paiement Séquestre
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6 leading-tight">
              Vos fonds protégés sur Wave & OM. <br />
              <span className="text-indigo-400">Paiement libéré à l'arrivée.</span>
            </h2>
            <p className="text-slate-300 text-base leading-relaxed mb-8">
              Dans le modèle traditionnel, l'argent circule en espèces sans garantie en cas d'annulation ou de retard. Aller-Retour sécurise intégralement le montant sur un compte virtuel (Escrow).
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold">1</div>
                <div>
                  <h4 className="font-bold text-white text-base">Verrouillage au scan de réservation</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Le montant exact (ex: 4 500 FCFA) est réservé sur votre compte Wave ou OM.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 font-bold">2</div>
                <div>
                  <h4 className="font-bold text-white text-base">Ventilation atomique instantanée</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Au scan du guichetier, les fonds sont instantanément scindés : Transporteur (92%), État (2%), SaaS (5%).</p>
                </div>
              </div>
            </div>

            <Link 
              href="/dashboard/superadmin" 
              className="inline-flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors group"
            >
              <span>Accéder au dashboard de supervision financière</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Carte de Démonstration Financière */}
          <div className="bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 p-8 md:p-10 rounded-3xl border border-indigo-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <Wallet className="w-8 h-8 text-indigo-400" />
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Compte Séquestre Actif</span>
                  <span className="text-xl font-black text-white">#ESCROW_SN_92834</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-xl bg-indigo-500 text-slate-950 font-black text-xs">SECURE HOLD</span>
            </div>

            <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800/80 mb-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Trajet : Dakar ➔ Touba</span>
                <span className="font-bold text-white">4 500 FCFA</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Frais Wave Mobile Money (1%)</span>
                <span className="font-bold text-rose-400">- 45 FCFA</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Taxes de Gare & Redevance État (2%)</span>
                <span className="font-bold text-blue-400">- 90 FCFA</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-800 font-bold">
                <span className="text-emerald-400">Versement Net Transporteur (92%)</span>
                <span className="text-xl text-emerald-400">4 140 FCFA</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <p className="text-xs text-emerald-300 font-bold leading-relaxed">
                Virement instantané exécuté sur le compte Wave du GIE Salam Transport en 2.8 secondes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 : GIE & Transporteurs (Features Grid) */}
      <section id="features" className="py-24 bg-slate-900/40 border-y border-slate-800/80 px-6 scroll-mt-28">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold mb-6">
              <Building2 className="w-4 h-4" /> Solutions pour Transporteurs & Gares Routières
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
              L'infrastructure cloud souveraine pour gérer votre flotte de bus.
            </h2>
            <p className="text-slate-300 text-base">
              Aller-Retour équipe les guichets de gare de terminaux Android POS et offre un suivi de trésorerie en temps réel pour éliminer les coulages d'espèces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 group shadow-xl relative overflow-hidden backdrop-blur-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <TicketCheck className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-emerald-400 transition-colors">Terminaux POS en Gare</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Impression de billets thermiques QR instantanée via terminaux Sunmi V2. Scan d'embarquement ultra-rapide par caméra au pied du bus.
              </p>
              <Link href="/dashboard/dispatcher" className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 hover:underline">
                <span>Tester le guichet de gare</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-10 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 group shadow-xl relative overflow-hidden backdrop-blur-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Smartphone className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">Mode Offline SQLite</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Le manifeste d'embarquement reste synchronisé et fonctionnel même lors de la traversée de zones blanches sans couverture réseau 4G.
              </p>
              <Link href="/dashboard/driver" className="text-xs font-bold text-blue-400 flex items-center gap-1.5 hover:underline">
                <span>Voir le cockpit chauffeur</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-10 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition-all duration-300 group shadow-xl relative overflow-hidden backdrop-blur-xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-400 transition-colors">Trésorerie & GPS Direct</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Suivi cartographique des bus en temps réel, calcul du taux de remplissage et versement direct des gains vers le compte GIE.
              </p>
              <Link href="/dashboard/carrier" className="text-xs font-bold text-purple-400 flex items-center gap-1.5 hover:underline">
                <span>Ouvrir l'espace GIE</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 : Chauffeurs Libres (Marketplace) */}
      <section id="marketplace" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-28">
        <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 rounded-3xl p-10 md:p-16 relative overflow-hidden shadow-2xl backdrop-blur-xl">
          <div className="absolute -top-10 -right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-3 py-1.5 rounded-full text-blue-400 text-xs font-bold mb-6">
              <Navigation className="w-4 h-4" /> Taxis 4 & 7 Places • Minibus • Particuliers (Covoiturage)
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Indépendants & Particuliers : Remplissez votre véhicule sans intermédiaires.
            </h2>
            <p className="text-slate-300 text-lg mb-10 leading-relaxed">
              Que vous soyez chauffeur de taxi inter-urbain (4 ou 7 places) ou particulier souhaitant partager les frais de route en toute sécurité (Covoiturage vérifié par KYC biométrique CEDEAO) : publiez vos départs, encaissez les réservations à l'avance et transférez vos gains instantanément sur Wave / OM en 3 secondes.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <Link 
                href="/dashboard/driver" 
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 font-extrabold text-slate-950 shadow-xl shadow-blue-500/25 hover:scale-105 transition-all flex items-center gap-3 text-base"
              >
                <Bus className="w-5 h-5 text-slate-950" />
                <span>Lancer le Cockpit de Navigation</span>
              </Link>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Zéro commission fixe • Inscription en 5 min</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Testimonial Section */}
      <section className="py-20 border-t border-slate-800/80 bg-slate-900/20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-1 mb-6 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>
          <blockquote className="text-2xl md:text-3xl font-bold text-white mb-8 leading-snug">
            "Depuis l'adoption d'Aller-Retour dans nos gares routières, le coulage financier a totalement disparu. Nos bus partent pleins et nos passagers n'ont plus peur d'acheter leur billet à l'avance."
          </blockquote>
          <div className="font-bold text-white text-base">El Hadji Modou Diop</div>
          <div className="text-xs text-emerald-400 font-semibold mt-1">Président du GIE Transporteurs Baux Maraîchers de Dakar</div>
        </div>
      </section>

      {/* Footer Premium */}
      <footer className="py-16 px-6 border-t border-slate-900 bg-slate-950 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 font-bold text-slate-950">
              AR
            </div>
            <div>
              <span className="font-black text-white text-lg block">Aller-Retour</span>
              <span className="text-xs text-slate-400">Plateforme Panafricaine de Mobilité SaaS</span>
            </div>
          </div>
          <p className="text-center md:text-right text-xs leading-relaxed">
            © 2026 Aller-Retour. Tous droits réservés. Architecture GitOps Cloud Séquestre propulsée par NestJS, Prisma & Next.js.
          </p>
        </div>
      </footer>
    </div>
  );
}

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
  ExternalLink
} from 'lucide-react';

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navDashboards = [
    { name: 'Espace Voyageur', path: '/dashboard/client', icon: User, desc: 'Réserver un billet & gérer ses bagages' },
    { name: 'Espace Chauffeur', path: '/dashboard/driver', icon: Bus, desc: 'Cockpit de navigation & revenus en direct' },
    { name: 'Transporteur (GIE)', path: '/dashboard/carrier', icon: Building2, desc: 'Gestion de flotte & répartition Wave/OM' },
    { name: 'Guichet de Gare', path: '/dashboard/dispatcher', icon: TicketCheck, desc: 'Scan QR offline & manifeste d\'embarquement' },
    { name: 'Super Admin', path: '/dashboard/superadmin', icon: ShieldAlert, desc: 'Supervision globale & taxes gouvernementales' },
  ];

  return (
    <div className="relative overflow-hidden flex-grow min-h-screen bg-slate-950 text-slate-100">
      {/* Glow Effects en Arrière-plan */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Topbar / Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Section Gauche : Logo + Menu Navigation */}
          <div className="flex items-center space-x-10">
            <Link href="/" className="flex items-center space-x-3 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                <Bus className="w-6 h-6 text-slate-950" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Aller<span className="text-emerald-400">-</span>Retour
              </span>
            </Link>

            {/* Navigation Topbar Ancrée à Gauche */}
            <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-slate-300">
              <Link href="/dashboard/client" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                <User className="w-4 h-4 text-emerald-400" />
                <span>Rechercher un Trajet</span>
              </Link>
              <Link href="/dashboard/carrier" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                <Building2 className="w-4 h-4 text-teal-400" />
                <span>Transporteurs / GIE</span>
              </Link>
              <Link href="/dashboard/driver" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                <Bus className="w-4 h-4 text-blue-400" />
                <span>Chauffeurs Libres</span>
              </Link>
              <Link href="/dashboard/superadmin" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
                <Wallet className="w-4 h-4 text-purple-400" />
                <span>Wallets & Séquestre</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <Link 
              href="/dashboard/client" 
              className="hidden sm:inline-flex px-5 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 text-sm font-semibold text-white transition-all hover:bg-slate-800/50"
            >
              Connexion
            </Link>
            <Link 
              href="/dashboard/dispatcher" 
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <TicketCheck className="w-4 h-4" />
              <span>Accès Guichet</span>
            </Link>

            {/* Bouton d'ouverture du menu Sidebar */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 rounded-xl border border-slate-700 bg-slate-800/50 text-white hover:bg-slate-800 hover:text-emerald-400 transition-all focus:outline-none"
              title="Menu de navigation des espaces"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu Sidebar / Drawer Coulissant en Surimpression (À Gauche) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 max-w-full flex pr-10">
            <div className="w-screen max-w-md bg-slate-900 border-r border-slate-800 shadow-2xl p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <Bus className="w-6 h-6 text-slate-950" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">
                      Espaces Aller-Retour
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Naviguez vers les Dashboards
                </p>

                <div className="space-y-4">
                  {navDashboards.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-start p-4 rounded-2xl border border-slate-800/80 bg-slate-800/30 hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10 hover:border-emerald-500/50 transition-all group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-slate-800 group-hover:bg-emerald-500/20 border border-slate-700 group-hover:border-emerald-500/30 flex items-center justify-center mr-4 shrink-0 transition-colors">
                          <IconComponent className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                            <span>{item.name}</span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h4>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-slate-800 pt-6 mt-8">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-semibold">
                  <span>Session de démo connectée</span>
                  <span className="px-2 py-1 bg-emerald-500 text-slate-950 font-bold rounded-lg">ONLINE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-20 pb-28 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-900 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-8 animate-pulse">
          <Shield className="w-4 h-4" />
          <span>Plateforme Officielle de Mobilité Panafricaine & Paiement Séquestre</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-8">
          Le Transport Inter-Urbain au Sénégal & en Afrique, <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
            Horaires Garantis & Billets 100% Digitaux.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-14 leading-relaxed">
          Fini les heures d'attente incertaines en gare routière. Réservez votre place exacte, payez en toute sécurité par Wave ou Orange Money, et suivez votre bus en direct.
        </p>

        {/* Search Widget (Glassmorphism) lié au Dashboard Client */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl max-w-4xl mx-auto text-left">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Départ</span>
              </label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-emerald-500 transition-colors">
                <option>Dakar (Baux Maraîchers)</option>
                <option>Touba</option>
                <option>Thiès</option>
                <option>Saint-Louis</option>
                <option>Ziguinchor</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Arrivée</span>
              </label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-emerald-500 transition-colors">
                <option>Touba</option>
                <option>Saint-Louis</option>
                <option>Thiès</option>
                <option>Ziguinchor</option>
                <option>Tambacounda</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                <span>Date de départ</span>
              </label>
              <input 
                type="date" 
                defaultValue="2026-05-18" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-emerald-500 transition-colors color-scheme-dark" 
              />
            </div>

            <div className="flex items-end">
              <Link 
                href="/dashboard/client" 
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2"
              >
                <span>Trouver un bus</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-slate-900/30 border-y border-slate-800/80 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight mb-4">
              L'écosystème complet pour voyageurs & transporteurs
            </h2>
            <p className="text-slate-400 text-sm">Une infrastructure robuste pensée pour le contexte africain.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Smartphone className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Réservation & Billets QR</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Tickets sécurisés chiffrés anticopie. Embarquement ultra-rapide par scan QR fonctionnant même en zone blanche sans connexion Internet.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wallet className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Paiement Wave / OM & Escrow</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Votre argent est conservé en compte séquestre et n'est libéré au transporteur qu'une fois votre arrivée à destination validée.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Marketplace Chauffeurs Libres</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Chauffeurs de taxis 7 places et bus indépendants certifiés (KYC). Publiez vos trajets et recevez vos fonds instantanément.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-900 text-slate-500 text-sm text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Bus className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-slate-300">Aller-Retour Panafrican SaaS</span>
          </div>
          <p>© 2026 Aller-Retour. Tous droits réservés. Propulsé par Turborepo, NestJS & Next.js.</p>
        </div>
      </footer>
    </div>
  );
}

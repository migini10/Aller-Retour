'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CarFront, 
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
  Lock,
  Zap,
  Star,
  Check,
  ChevronRight,
  Package,
  Navigation
} from 'lucide-react';

import VehicleShowcase from '../components/VehicleShowcase';
import { useModal } from '../components/ModalContext';
import Footer from '../components/Footer';

export default function HomePage() {
  const { openBookingWizard } = useModal();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTab, setSearchTab] = useState<'bus' | 'package' | 'vtc'>('bus');
  const [departure, setDeparture] = useState('Dakar (Baux Maraîchers)');
  const [destination, setDestination] = useState('Touba');

  const navDashboards = [
    { name: 'Allo Dakar', path: '/dashboard/traveller', icon: User, badge: 'Premium', desc: 'Réserver un taxi privé ou covoiturage VIP' },
    { name: 'Espace Voyageur', path: '/dashboard/client', icon: User, badge: 'Client', desc: 'Réserver un billet de bus QR, Miles de fidélité & bagages' },
    { name: 'Espace Chauffeur', path: '/dashboard/driver', icon: CarFront, badge: 'Driver', desc: 'Cockpit GPS, manifeste passagers offline & cashout' },
    { name: 'Transporteur / GIE', path: '/dashboard/carrier', icon: Building2, badge: 'GIE', desc: 'Supervision de la flotte, trésorerie & séquestre' },
    { name: 'Guichet de Gare', path: '/dashboard/dispatcher', icon: TicketCheck, badge: 'POS', desc: 'Vente express au comptoir & scan QR d\'embarquement' },
    { name: 'Super Admin', path: '/dashboard/superadmin', icon: ShieldAlert, badge: 'Global', desc: 'Souveraineté financière, audits d\'État & validation KYC' },
  ];

  const popularRoutes = [
    { from: 'Dakar', to: 'Touba', price: '4 500 FCFA' },
    { from: 'Dakar', to: 'Saint-Louis', price: '5 000 FCFA' },
    { from: 'Thiès', to: 'Ziguinchor', price: '9 000 FCFA' },
    { from: 'Touba', to: 'Tambacounda', price: '7 500 FCFA' },
  ];

  return (
    <div className="relative overflow-hidden flex-grow min-h-screen bg-[#0B0F19] text-slate-100 font-sans selection:bg-orange-600 selection:text-white">
      {/* Topbar / En-tête Premium Fixe avec couleur dominante Orange */}
      <header className="border-b border-slate-800/60 bg-[#0B0F19]/90 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center group-hover:bg-orange-600/30 transition-colors">
              <CarFront className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">
                Aller<span className="text-orange-500 font-extrabold">Retour</span>
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Mobilité & Escrow
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => openBookingWizard('allo-dakar')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold transition-colors shadow-sm"
            >
              <CarFront className="w-4 h-4" />
              <span>Allo Dakar</span>
            </button>

            {/* Bouton de menu latéral à droite */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400 hover:text-white hover:bg-orange-600 transition-colors ml-2"
              title="Menu de navigation"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu Sidebar / Drawer Coulissant par la DROITE et 100% responsive */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-md transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10 animate-fade-in">
            <div className="w-screen max-w-md bg-[#0F1524] border-l border-slate-800/80 p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto">
              <div>
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800/80">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center">
                      <CarFront className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <span className="text-lg font-bold tracking-tight text-white block">Aller-Retour</span>
                      <span className="text-xs text-orange-400 font-medium">Sélecteur de Portails</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-700/50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-6">
                  Portails Disponibles
                </p>

                <div className="space-y-3">
                  {navDashboards.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className="flex items-start p-4 rounded-2xl border border-slate-800/60 bg-slate-900/40 hover:bg-slate-900/80 hover:border-orange-500/50 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center mr-4 shrink-0 transition-colors border border-slate-700/50 group-hover:border-orange-500/40 group-hover:bg-orange-500/10">
                          <IconComponent className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-white group-hover:text-orange-400 transition-colors flex items-center gap-1.5">
                              <span>{item.name}</span>
                              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h4>
                            <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-800/80 border border-slate-700 text-slate-300 rounded-md">
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
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-300">
                  <span>Statut Plateforme</span>
                  <span className="px-2.5 py-1 bg-orange-500/20 border border-orange-500/40 text-orange-400 font-semibold rounded-lg">ONLINE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section Premium Minimaliste (pt-28 pour compenser le header fixed) */}
      <section id="search" className="pt-28 pb-16 px-6 max-w-5xl mx-auto text-center scroll-mt-28">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-orange-500/20 text-slate-300 text-xs font-medium mb-8 shadow-sm">
          <Shield className="w-3.5 h-3.5 text-orange-500" />
          <span>Plateforme Souveraine de Transport Inter-Urbain en Afrique de l'Ouest</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6 text-white max-w-4xl mx-auto">
          Réservez votre billet en gare. <br />
          <span className="text-orange-500 font-semibold">Voyagez l'esprit tranquille.</span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-14 leading-relaxed font-normal">
          L'infrastructure digitale unifiée connectant voyageurs, flottes GIE et chauffeurs libres. Vos paiements par Wave ou OM sont protégés sur compte séquestre jusqu'à destination.
        </p>

        {/* Vitrine Interactive de la Flotte & Options de Transport */}
        <div className="mb-16 text-left">
          <VehicleShowcase />
        </div>

        {/* Cockpit de Recherche Épuré */}
        <div className="bg-[#101728]/90 border border-slate-800/80 rounded-3xl shadow-xl max-w-4xl mx-auto text-left overflow-hidden">
          {/* Onglets du Cockpit */}
          <div className="flex border-b border-slate-800/80 bg-[#0B0F19]/60 px-6 pt-3 gap-2 overflow-x-auto">
            {[
              { id: 'vtc', label: 'Allo Dakar (Covoiturage inter-urbain)', icon: Navigation },
              { id: 'package', label: 'Colis & Courrier Express', icon: Package },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSearchTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-medium text-sm transition-colors border-b-2 ${
                    searchTab === tab.id
                      ? 'bg-[#101728] border-orange-500 text-white font-semibold'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Gare de Départ</span>
                </label>
                <select 
                  value={departure} 
                  onChange={(e) => setDeparture(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-white focus:outline-none focus:border-slate-600 transition-colors cursor-pointer"
                >
                  <option>Dakar (Baux Maraîchers)</option>
                  <option>Touba (Gare Centrale)</option>
                  <option>Thiès (Gare Routière)</option>
                  <option>Saint-Louis</option>
                  <option>Ziguinchor</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Destination</span>
                </label>
                <select 
                  value={destination} 
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-white focus:outline-none focus:border-slate-600 transition-colors cursor-pointer"
                >
                  <option>Touba (Gare Centrale)</option>
                  <option>Saint-Louis</option>
                  <option>Thiès (Gare Routière)</option>
                  <option>Ziguinchor</option>
                  <option>Tambacounda</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Date de Départ</span>
                </label>
                <input 
                  type="date" 
                  defaultValue="2026-05-18" 
                  className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-3.5 text-sm font-medium text-white focus:outline-none focus:border-slate-600 transition-colors cursor-pointer" 
                />
              </div>

              <div>
                <button 
                  onClick={() => openBookingWizard('allo-dakar')}
                  className="w-full py-3.5 px-6 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center space-x-2"
                >
                  <span>Rechercher</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Popular Routes Quick Badges */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-orange-500" /> Lignes directes populaires :
              </span>
              <div className="flex flex-wrap gap-2.5">
                {popularRoutes.map((route, idx) => (
                  <Link 
                    key={idx}
                    href="/dashboard/client"
                    className="px-3.5 py-1.5 rounded-xl bg-[#0B0F19] border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <span>{route.from} ➔ {route.to}</span>
                    <span className="text-orange-400 font-semibold bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800/80">
                      {route.price}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Bar Épurée */}
      <section className="py-10 border-y border-slate-800/60 bg-[#0F1524]/60 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">1.2M+</h3>
            <p className="text-xs font-medium text-slate-400 mt-1">Billets Émis en Gare</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">28 GIE</h3>
            <p className="text-xs font-medium text-slate-400 mt-1">Flottes Partenaires</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">0%</h3>
            <p className="text-xs font-medium text-slate-400 mt-1">Frais Compte Séquestre</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">99.8%</h3>
            <p className="text-xs font-medium text-slate-400 mt-1">Ponctualité Garantie</p>
          </div>
        </div>
      </section>

      {/* Section 1 : Séquestre & Transparence Financière (Escrow Hold) */}
      <section id="escrow" className="py-24 px-6 max-w-6xl mx-auto scroll-mt-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-orange-500/20 text-slate-300 text-xs font-medium mb-6">
              <Lock className="w-3.5 h-3.5 text-orange-500" /> Compte Séquestre
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6 leading-tight">
              Paiements protégés sur Wave & OM. <br />
              <span className="text-slate-400 font-normal">Fonds débloqués à l'embarquement.</span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed mb-8">
              Aller-Retour élimine le risque pour le voyageur et le transporteur en conservant les montants versés sur un compte de transit sécurisé (Escrow) jusqu'à la validation du billet en gare.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#0F1524]/80 border border-slate-800/80">
                <div className="w-8 h-8 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center shrink-0 font-bold text-xs">1</div>
                <div>
                  <h4 className="font-semibold text-white text-sm">Verrouillage au scan de réservation</h4>
                  <p className="text-xs text-slate-400 mt-1">Le montant exact (ex: 4 500 FCFA) est mis de côté sur votre compte mobile money.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#0F1524]/80 border border-slate-800/80">
                <div className="w-8 h-8 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center shrink-0 font-bold text-xs">2</div>
                <div>
                  <h4 className="font-semibold text-white text-sm">Répartition automatique au guichet</h4>
                  <p className="text-xs text-slate-400 mt-1">Dès le scan d'embarquement, les fonds sont instantanément scindés : Transporteur (92%), État (2%), SaaS (5%).</p>
                </div>
              </div>
            </div>

            <Link 
              href="/dashboard/superadmin" 
              className="inline-flex items-center gap-2 text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors group"
            >
              <span>Consulter l'audit financier en temps réel</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Carte de Démonstration Financière */}
          <div className="bg-[#101728] p-8 md:p-10 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                  <Wallet className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Contrat Séquestre N°92834</span>
                  <span className="text-lg font-bold text-white tracking-tight">Dakar ➔ Touba</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 font-semibold text-xs">ESCROW HOLD</span>
            </div>

            <div className="bg-[#0B0F19] rounded-2xl p-6 border border-slate-800/80 mb-6 space-y-3.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Prix du billet de transport</span>
                <span className="font-semibold text-white">4 500 FCFA</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Frais Wave Mobile Money (1%)</span>
                <span className="font-semibold text-slate-400">- 45 FCFA</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Redevance État & Gare (2%)</span>
                <span className="font-semibold text-slate-400">- 90 FCFA</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-800/80 font-bold">
                <span className="text-orange-400">Net versé au Transporteur (92%)</span>
                <span className="text-lg text-orange-400">4 140 FCFA</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0" />
              <p className="text-xs text-orange-300 leading-relaxed font-medium">
                Virement instantané de 4 140 FCFA exécuté sur le compte marchand du GIE en 2.8 secondes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2 : GIE & Transporteurs */}
      <section id="features" className="py-24 bg-[#0F1524]/40 border-y border-slate-800/60 px-6 scroll-mt-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium mb-4">
              <Building2 className="w-3.5 h-3.5 text-orange-500" /> Espace Transporteurs GIE
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              L'infrastructure moderne pour gérer votre gare routière.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Équipez vos guichetiers de terminaux Android POS et bénéficiez d'une traçabilité financière absolue sur l'ensemble de vos départs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-[#101728]/80 border border-slate-800/80 hover:border-slate-700 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 text-orange-500">
                <TicketCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">Terminaux POS en Gare</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6 font-normal">
                Impression instantanée de billets thermiques QR via terminaux portables. Contrôle rapide par caméra lors de l'embarquement.
              </p>
              <Link href="/dashboard/dispatcher" className="text-xs font-semibold text-orange-400 flex items-center gap-1 hover:underline">
                <span>Accéder au guichet de gare</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-8 rounded-3xl bg-[#101728]/80 border border-slate-800/80 hover:border-slate-700 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 text-orange-500">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">Mode Offline SQLite</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6 font-normal">
                Le manifeste d'embarquement reste synchronisé et 100% opérationnel même lors de la traversée de zones sans réseau 4G.
              </p>
              <Link href="/dashboard/driver" className="text-xs font-semibold text-orange-400 flex items-center gap-1 hover:underline">
                <span>Voir l'application chauffeur</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-8 rounded-3xl bg-[#101728]/80 border border-slate-800/80 hover:border-slate-700 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 text-orange-500">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-white">Trésorerie & GPS Direct</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6 font-normal">
                Suivi cartographique des véhicules en direct, gestion du taux de remplissage et reversement instantané vers le compte GIE.
              </p>
              <Link href="/dashboard/carrier" className="text-xs font-semibold text-orange-400 flex items-center gap-1 hover:underline">
                <span>Ouvrir l'espace GIE</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 : Chauffeurs Libres & Particuliers */}
      <section id="marketplace" className="py-24 px-6 max-w-6xl mx-auto scroll-mt-28">
        <div className="bg-[#101728] border border-slate-800/80 rounded-3xl p-10 md:p-14 text-left shadow-xl relative overflow-hidden">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium mb-6">
              <CarFront className="w-3.5 h-3.5 text-orange-500" /> Taxis 4 & 7 Places • Minibus • Covoiturage
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Indépendants & Particuliers : Remplissez votre véhicule en avance.
            </h2>
            <p className="text-slate-400 text-base mb-8 leading-relaxed font-normal">
              Que vous soyez chauffeur de taxi inter-urbain ou particulier souhaitant partager les frais de route (Covoiturage certifié KYC biométrique CEDEAO) : publiez vos départs, encaissez les réservations et transférez vos gains sur votre mobile en 3 secondes.
            </p>

            <div className="flex flex-wrap items-center gap-6">
              <Link 
                href="/dashboard/driver" 
                className="px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 font-semibold text-white shadow-sm transition-colors flex items-center gap-2.5 text-sm"
              >
                <CarFront className="w-4 h-4" />
                <span>Ouvrir mon cockpit de navigation</span>
              </Link>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Check className="w-4 h-4 text-orange-400" />
                <span>Zéro commission fixe • Inscription en 5 min</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

'use client';

import React, { useState, useRef } from 'react';
import {
  LayoutDashboard, CalendarCheck, Ticket, Navigation,
  Wallet, Gift, Package, Bell, MessageSquare, Settings,
  TrendingUp, MapPin, Clock, Star, CreditCard, ChevronRight
} from 'lucide-react';
import QRCodeBrandEngine from '../../../components/QRCodeBrandEngine';
import SectionBillets from './sections/Billets';
import SectionReservations from './sections/Reservations';
import SectionWallet from './sections/Wallet';
import SectionFidelite from './sections/Fidelite';
import SectionBagages from './sections/Bagages';
import SectionNotifications from './sections/Notifications';
import SectionSupport from './sections/Support';
import SectionParametres from './sections/Parametres';
import SectionSuiviGPS from './sections/SuiviGPS';

const tabs = [
  { id: 'accueil', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'reservations', label: 'Réservations', icon: CalendarCheck },
  { id: 'billets', label: 'Mes Billets', icon: Ticket },
  { id: 'suivi', label: 'Suivi GPS', icon: Navigation },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'fidelite', label: 'Fidélité', icon: Gift },
  { id: 'bagages', label: 'Bagages', icon: Package },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: 2 },
  { id: 'support', label: 'Support', icon: MessageSquare },
  { id: 'parametres', label: 'Paramètres', icon: Settings },
];

const stats = [
  { label: 'Réservations', value: '12', icon: CalendarCheck, color: 'text-orange-400 bg-orange-500/20' },
  { label: 'Billets actifs', value: '3', icon: Ticket, color: 'text-blue-400 bg-blue-500/20' },
  { label: 'Voyages effectués', value: '45', icon: TrendingUp, color: 'text-emerald-400 bg-emerald-500/20' },
  { label: 'Points fidélité', value: '1 240', icon: Star, color: 'text-purple-400 bg-purple-500/20' },
  { label: 'Portefeuille', value: '53 900 F', icon: CreditCard, color: 'text-amber-400 bg-amber-500/20' },
];

const prochainVoyage = {
  id: 'AR-74892374',
  from: 'Dakar',
  to: 'Touba',
  date: '2026-06-05',
  heure: '08:00',
  siege: '14A VIP',
  compagnie: 'Sénégal Express',
};

const notificationsRecentes = [
  { msg: 'Réservation RES-004 confirmée.', time: 'Il y a 2h', dot: 'bg-orange-400' },
  { msg: 'Dépôt Wave de 20 000 FCFA reçu.', time: 'Il y a 4h', dot: 'bg-emerald-400' },
  { msg: 'Retard de 15 min signalé sur AR-74892374.', time: 'Hier', dot: 'bg-amber-400' },
];

import { useModal } from '../../../components/ModalContext';

export default function TravellerDashboard() {
  const [activeTab, setActiveTab] = useState('accueil');
  const { openModal } = useModal();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-full min-w-0 overflow-y-auto overscroll-contain scrollbar-hide flex flex-col">
      {/* Navigation onglets — Full width background, inner content constrained */}
      <div className="sticky top-0 z-20 bg-[#0B0F19]/95 backdrop-blur-xl border-b border-slate-800/80 w-full px-5 sm:px-8 lg:px-12 shrink-0">
        <div className="max-w-[1600px] mx-auto py-3 relative">
          <div ref={scrollContainerRef} className="flex gap-1 overflow-x-auto scrollbar-none pr-8 sm:pr-0">
            {tabs.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all relative shrink-0 ${
                    activeTab === t.id
                      ? 'bg-orange-600 text-white shadow-sm shadow-orange-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                  {t.badge && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center">{t.badge}</span>
                  )}
                </button>
              );
            })}
          </div>
          {/* Indicateur de défilement horizontal (mobile) */}
          <div className="sm:hidden absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0B0F19]/95 via-[#0B0F19]/80 to-transparent pointer-events-none flex items-center justify-end pr-2">
            <button 
              onClick={scrollRight}
              className="pointer-events-auto p-2 text-slate-400 hover:text-white transition-colors"
              aria-label="Faire défiler"
            >
              <ChevronRight className="w-5 h-5 animate-pulse drop-shadow-md" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Constrained and padded */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 py-8 pb-24">

      {/* Contenu */}
      {activeTab === 'accueil' && (
        <div className="space-y-8">
          {/* Header profil */}
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-orange-600/10 via-orange-500/5 to-transparent border border-orange-500/20 rounded-3xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-600/30 to-orange-400/10 border border-orange-500/30 flex items-center justify-center text-2xl font-bold text-orange-400 shrink-0">AB</div>
              <div>
                <p className="text-xs text-orange-400 font-semibold uppercase tracking-wider">Client Allo Dakar</p>
                <h1 className="text-xl sm:text-2xl font-bold text-white mt-0.5 tracking-tight">Abdou Bakhe</h1>
                <p className="text-sm text-slate-400 mt-0.5">+221 77 000 00 00 • abdou@example.com</p>
              </div>
            </div>
            <button onClick={() => openModal('Niveau Gold', 'Voulez-vous utiliser 3000 points pour passer au niveau Gold ?', 'Confirmer')} className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-xl hover:border-orange-500/50 transition-colors cursor-pointer">
              <Star className="w-4 h-4 text-purple-400 fill-purple-400" />
              <span className="text-xs text-white font-bold">Niveau Silver → Gold</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {stats.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-[#101728] border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-2 hover:border-orange-500/30 transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-lg font-bold text-white">{s.value}</p>
                  <p className="text-xs text-slate-400">{s.label}</p>
                </div>
              );
            })}
          </div>

          {/* Prochain voyage + Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Prochain voyage */}
            <div className="bg-[#101728] border border-orange-500/20 rounded-2xl p-6 space-y-4">
              <p className="text-xs text-orange-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Prochain voyage</p>
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white">{prochainVoyage.from}</h3>
                    <div className="flex-1 border-t border-dashed border-orange-500/40 min-w-[30px]" />
                    <h3 className="text-xl font-bold text-white">{prochainVoyage.to}</h3>
                  </div>
                  <p className="text-sm text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {prochainVoyage.date} à {prochainVoyage.heure}</p>
                  <p className="text-xs text-slate-500">Siège {prochainVoyage.siege} • {prochainVoyage.compagnie}</p>
                  <p className="font-mono text-xs text-orange-400/70">{prochainVoyage.id}</p>
                </div>
                <div className="shrink-0">
                  <QRCodeBrandEngine value={prochainVoyage.id} size={100} />
                </div>
              </div>
              <button onClick={() => setActiveTab('suivi')} className="w-full flex items-center justify-center gap-2 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 text-orange-400 font-semibold text-sm py-2.5 rounded-xl transition-colors">
                <Navigation className="w-4 h-4" /> Suivre en temps réel
              </button>
            </div>

            {/* Notifications récentes */}
            <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><Bell className="w-3.5 h-3.5 text-orange-400" /> Notifications récentes</p>
                <button onClick={() => setActiveTab('notifications')} className="text-xs text-orange-400 hover:text-orange-300 transition-colors">Voir tout</button>
              </div>
              <div className="space-y-3">
                {notificationsRecentes.map((n, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-xl">
                    <span className={`w-2 h-2 rounded-full shrink-0 mt-1 ${n.dot}`} />
                    <div>
                      <p className="text-sm text-white">{n.msg}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Accès rapides */}
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Accès rapides</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Mes Billets', tab: 'billets', icon: Ticket, c: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                { label: 'Mon Wallet', tab: 'wallet', icon: Wallet, c: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
                { label: 'Fidélité', tab: 'fidelite', icon: Gift, c: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                { label: 'Support', tab: 'support', icon: MessageSquare, c: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
              ].map(a => {
                const Icon = a.icon;
                return (
                  <button key={a.tab} onClick={() => setActiveTab(a.tab)} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all hover:scale-105 ${a.c}`}>
                    <Icon className="w-6 h-6" />
                    <span className="text-xs font-bold">{a.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reservations' && <SectionReservations />}
      {activeTab === 'billets' && <SectionBillets />}
      {activeTab === 'suivi' && <SectionSuiviGPS />}
      {activeTab === 'wallet' && <SectionWallet />}
      {activeTab === 'fidelite' && <SectionFidelite />}
      {activeTab === 'bagages' && <SectionBagages />}
      {activeTab === 'notifications' && <SectionNotifications />}
      {activeTab === 'support' && <SectionSupport />}
      {activeTab === 'parametres' && <SectionParametres />}
      </div>
    </div>
  );
}

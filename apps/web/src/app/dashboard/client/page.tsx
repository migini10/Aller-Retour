'use client';

import React, { useState } from 'react';
import { QrCode, Wallet, Award, Package, ArrowUpRight, ArrowDownLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<'trips' | 'wallet' | 'miles' | 'luggage'>('trips');

  const tabs = [
    { id: 'trips', label: 'Billets QR', icon: QrCode },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'miles', label: 'Miles', icon: Award },
    { id: 'luggage', label: 'Bagages', icon: Package },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-slate-800">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Espace Voyageur</h1>
            <p className="text-slate-400 text-sm mt-1">Gérez vos billets QR, recharges Wave/OM et Miles de fidélité.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="bg-orange-500/10 border border-orange-500/30 px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-sm">
              <Wallet className="w-5 h-5 text-orange-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Solde Wallet (XOF)</p>
                <p className="text-base font-bold text-white">45 000 FCFA</p>
              </div>
            </div>
            <button className="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
              <Sparkles className="w-4 h-4" /> Recharger via Wave
            </button>
          </div>
        </div>
      </div>

      {/* Tabs — défilables horizontalement sur mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap shrink-0 transition-all ${
                activeTab === t.id
                  ? 'bg-orange-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'trips' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-[#101728] border border-slate-800/80 p-5 sm:p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-orange-600 text-white font-semibold text-xs px-3 py-1.5 rounded-bl-xl flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Confirmé (Escrow)
            </div>
            <div className="flex justify-between items-start mb-5 pt-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-orange-400 font-bold">Départ Demain • 08:00</p>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-1">Dakar ➔ Touba</h3>
                <p className="text-xs text-slate-400 mt-1">Sénégal Express • Bus climatisé #402</p>
              </div>
              <div className="p-3 bg-white rounded-xl shadow-sm shrink-0 ml-3">
                <QrCode className="w-14 h-14 sm:w-16 sm:h-16 text-slate-950" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
              <div>
                <p className="text-[10px] text-slate-400">Siège</p>
                <p className="text-sm font-bold text-white">#14 (VIP)</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Bagage</p>
                <p className="text-sm font-bold text-orange-400">15 kg inclus</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Paiement</p>
                <p className="text-sm font-bold text-slate-300">Séquestre</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'wallet' && (
        <div className="bg-[#101728] border border-slate-800/80 p-5 sm:p-6 rounded-2xl max-w-2xl">
          <h2 className="text-base font-bold text-white mb-5">Transactions & Séquestre Escrow</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Dépôt Wave Mobile Money</p>
                  <p className="text-xs text-slate-400">17 Mai 2026 • Réf: wav_74892374</p>
                </div>
              </div>
              <p className="font-bold text-orange-400 text-sm shrink-0 ml-2">+ 15 000 FCFA</p>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Réservation Dakar - Touba</p>
                  <p className="text-xs text-amber-400">Fonds bloqués en séquestre</p>
                </div>
              </div>
              <p className="font-bold text-amber-400 text-sm shrink-0 ml-2">- 4 500 FCFA</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'miles' && (
        <div className="bg-[#101728] border border-slate-800/80 p-5 sm:p-6 rounded-2xl max-w-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Solde Miles Fidélité</p>
              <p className="text-2xl font-bold text-white">450 pts</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">Prochain palier : 550 pts pour un billet gratuit Dakar ➔ Thiès.</p>
        </div>
      )}

      {activeTab === 'luggage' && (
        <div className="bg-[#101728] border border-slate-800/80 p-5 sm:p-6 rounded-2xl max-w-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Franchise Bagages</p>
              <p className="text-2xl font-bold text-white">15 kg inclus</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">Surplus : +5 kg = 1 000 FCFA (débit séquestre auto).</p>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { QrCode, Wallet, Award, Package, Compass, ArrowUpRight, ArrowDownLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<'trips' | 'wallet' | 'miles' | 'luggage'>('trips');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Espace Voyageur</h1>
          <p className="text-slate-400 mt-1">Gérez vos billets QR, vos recharges Wave/OM et vos Miles de fidélité.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-lg shadow-emerald-500/10">
            <Wallet className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="text-xs text-slate-400">Solde Wallet (XOF)</p>
              <p className="text-lg font-bold text-white">45 000 FCFA</p>
            </div>
          </div>
          <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold px-6 py-3 rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-slate-950" /> Recharger via Wave
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 p-1.5 bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl w-fit">
        {[
          { id: 'trips', label: 'Mes Billets QR', icon: QrCode },
          { id: 'wallet', label: 'Mon Wallet Escrow', icon: Wallet },
          { id: 'miles', label: 'Fidélité Miles (450 pts)', icon: Award },
          { id: 'luggage', label: 'Bagages & Colis (15kg)', icon: Package },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === t.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'trips' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl relative overflow-hidden backdrop-blur-xl group">
            <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-bold text-xs px-4 py-1.5 rounded-bl-2xl flex items-center gap-1 shadow-lg">
              <CheckCircle2 className="w-3.5 h-3.5" /> Billet Confirmé (Escrow Hold)
            </div>
            <div className="flex justify-between items-start mb-8 pt-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Départ Demain • 08:00</p>
                <h3 className="text-2xl font-bold text-white mt-1">Dakar ➔ Touba</h3>
                <p className="text-sm text-slate-400 mt-1">Sénégal Express • Bus climatisé #402</p>
              </div>
              <div className="p-4 bg-white rounded-2xl shadow-xl">
                <QrCode className="w-24 h-24 text-slate-950" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
              <div>
                <p className="text-xs text-slate-400">Siège assigné</p>
                <p className="text-lg font-bold text-white">#14 (VIP)</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Franchise Bagage</p>
                <p className="text-lg font-bold text-emerald-400">15 kg inclus</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Statut Paiement</p>
                <p className="text-lg font-bold text-teal-400">Séquestre Wave</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'wallet' && (
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl max-w-2xl">
          <h2 className="text-xl font-bold text-white mb-6">Transactions & Séquestre Escrow</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ArrowDownLeft className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white">Dépôt Wave Mobile Money</p>
                  <p className="text-xs text-slate-400">17 Mai 2026 • Réf: wav_74892374</p>
                </div>
              </div>
              <p className="font-bold text-emerald-400">+ 15 000 FCFA</p>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-white">Réservation Billet Dakar - Touba</p>
                  <p className="text-xs text-amber-400">Fonds bloqués en séquestre jusqu'à l'arrivée</p>
                </div>
              </div>
              <p className="font-bold text-amber-400">- 4 500 FCFA</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

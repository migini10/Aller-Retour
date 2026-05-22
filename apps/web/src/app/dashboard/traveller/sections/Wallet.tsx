'use client';
import React, { useState } from 'react';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Plus, Minus } from 'lucide-react';

const transactions = [
  { id: 'TXN-001', label: 'Paiement billet AR-74892374', date: '2026-05-20', montant: -4500, type: 'debit' },
  { id: 'TXN-002', label: 'Dépôt Wave', date: '2026-05-18', montant: 20000, type: 'credit' },
  { id: 'TXN-003', label: 'Remboursement RES-003', date: '2026-05-10', montant: 6000, type: 'credit' },
  { id: 'TXN-004', label: 'Paiement billet AR-62019384', date: '2026-04-14', montant: -6000, type: 'debit' },
  { id: 'TXN-005', label: 'Dépôt Orange Money', date: '2026-04-10', montant: 15000, type: 'credit' },
];

const moyens = [
  { nom: 'Wave', couleur: 'from-blue-600 to-blue-400', logo: '🌊' },
  { nom: 'Orange Money', couleur: 'from-orange-600 to-orange-400', logo: '🟠' },
  { nom: 'Carte Bancaire', couleur: 'from-slate-700 to-slate-500', logo: '💳' },
];

export default function SectionWallet() {
  const solde = 53900;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2"><CreditCard className="w-5 h-5 text-orange-400" /> Wallet & Paiements</h2>

      {/* Carte Solde */}
      <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 rounded-3xl p-6 text-white shadow-xl shadow-orange-500/20">
        <p className="text-sm font-medium opacity-80">Solde disponible</p>
        <p className="text-4xl font-bold mt-1">{solde.toLocaleString('fr-FR')} <span className="text-xl font-semibold">FCFA</span></p>
        <div className="flex gap-3 mt-6">
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            <Plus className="w-4 h-4" /> Déposer
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            <Minus className="w-4 h-4" /> Retirer
          </button>
        </div>
      </div>

      {/* Moyens de paiement */}
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Moyens de paiement</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {moyens.map(m => (
            <button key={m.nom} className={`flex items-center gap-3 bg-gradient-to-r ${m.couleur} rounded-xl p-4 text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-sm`}>
              <span className="text-xl">{m.logo}</span> {m.nom}
            </button>
          ))}
        </div>
      </div>

      {/* Historique */}
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">Historique des transactions</p>
        <div className="bg-[#101728] border border-slate-800/80 rounded-2xl overflow-hidden divide-y divide-slate-800/60">
          {transactions.map(t => (
            <div key={t.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${t.type === 'credit' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {t.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm text-white font-medium">{t.label}</p>
                  <p className="text-xs text-slate-500">{t.date}</p>
                </div>
              </div>
              <span className={`font-bold text-sm ${t.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {t.type === 'credit' ? '+' : ''}{t.montant.toLocaleString('fr-FR')} F
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

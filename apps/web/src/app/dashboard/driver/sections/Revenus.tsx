'use client';
import React from 'react';
import { Wallet, ArrowUpRight, TrendingUp, Calendar, CreditCard, ChevronRight } from 'lucide-react';

const stats = [
  { label: 'Revenus aujourd\'hui', val: '45 000 F', type: 'jour' },
  { label: 'Revenus semaine', val: '210 000 F', type: 'semaine' },
  { label: 'Revenus mois', val: '840 000 F', type: 'mois' },
];

const transactions = [
  { id: 'WD-001', label: 'Retrait vers Wave', date: 'Aujourd\'hui, 14:30', montant: -45000, statut: 'réussi' },
  { id: 'PAY-002', label: 'Paiement Trajet Dakar-Touba', date: 'Aujourd\'hui, 14:00', montant: 50000, statut: 'réussi' },
  { id: 'PAY-003', label: 'Commission plateforme (10%)', date: 'Aujourd\'hui, 14:00', montant: -5000, statut: 'réussi' },
];

export default function SectionRevenus() {
  const solde = 184500;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors"><Wallet className="w-5 h-5 text-orange-500 dark:text-orange-400" /> Revenus & Wallet</h2>

      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 rounded-3xl p-6 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden">
        <Wallet className="absolute -right-6 -bottom-6 w-48 h-48 text-white/10" />
        <div className="relative z-10">
          <p className="text-sm font-medium opacity-80 uppercase tracking-wider">Solde Disponible</p>
          <p className="text-4xl sm:text-5xl font-bold mt-2">{solde.toLocaleString('fr-FR')} <span className="text-2xl font-semibold">FCFA</span></p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button className="flex-1 bg-white text-orange-600 hover:bg-slate-50 font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
              <ArrowUpRight className="w-5 h-5" /> Retrait instantané
            </button>
            <button className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5" /> Méthodes de retrait
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(s => (
          <div key={s.type} className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A]/80 rounded-2xl p-5 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold transition-colors">{s.label}</p>
              <TrendingUp className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">{s.val}</p>
          </div>
        ))}
      </div>

      {/* History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold transition-colors">Historique récent</p>
          <button className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 font-semibold flex items-center gap-1 transition-colors">Voir tout <ChevronRight className="w-3.5 h-3.5" /></button>
        </div>
        <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A]/80 rounded-2xl overflow-hidden divide-y divide-slate-200 dark:divide-slate-800/60 transition-colors">
          {transactions.map(t => (
            <div key={t.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-[#222222]/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${t.montant > 0 ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-[#222222] text-slate-500 dark:text-slate-400'}`}>
                  {t.montant > 0 ? <TrendingUp className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-sm text-slate-900 dark:text-white font-semibold transition-colors">{t.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5 transition-colors"><Calendar className="w-3 h-3" /> {t.date}</p>
                </div>
              </div>
              <span className={`font-bold text-sm whitespace-nowrap transition-colors ${t.montant > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                {t.montant > 0 ? '+' : ''}{t.montant.toLocaleString('fr-FR')} F
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

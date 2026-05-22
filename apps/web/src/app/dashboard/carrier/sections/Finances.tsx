'use client';
import React from 'react';
import { Wallet, TrendingUp, Download, Calendar, DollarSign, PieChart } from 'lucide-react';

const transactions = [
  { id: '1', desc: 'Ventes Billets - TRIP-402', date: 'Aujourd\'hui, 14:30', mnt: 145000, type: 'in' },
  { id: '2', desc: 'Paiement Chauffeur (Moussa Ndiaye)', date: 'Hier, 18:00', mnt: -25000, type: 'out' },
  { id: '3', desc: 'Commission SaaS Aller-Retour', date: 'Hier, 18:00', mnt: -7250, type: 'out' },
  { id: '4', desc: 'Ventes Billets - TRIP-398', date: '04 Déc 2026', mnt: 85000, type: 'in' },
];

export default function SectionFinances() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Wallet className="w-5 h-5 text-indigo-400" /> Finances & Comptabilité</h2>
        <button className="bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl text-sm transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" /> Exporter CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-900 to-[#101728] border border-indigo-500/20 rounded-3xl p-6 md:col-span-2">
          <p className="text-sm font-semibold text-indigo-300 uppercase tracking-wider mb-2">Chiffre d'Affaires Mensuel</p>
          <div className="flex items-end gap-4">
            <h3 className="text-4xl sm:text-5xl font-bold text-white">4 850 000 <span className="text-2xl">FCFA</span></h3>
            <span className="mb-2 bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +15%</span>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-400 mb-1">Dépenses (Chauffeurs, Com.)</p>
              <p className="text-xl font-bold text-rose-400">- 850 000 F</p>
            </div>
            <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-400 mb-1">Bénéfice Net Estimé</p>
              <p className="text-xl font-bold text-emerald-400">4 000 000 F</p>
            </div>
          </div>
        </div>

        <div className="bg-[#101728] border border-slate-800 rounded-3xl p-6 flex flex-col justify-center items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-slate-900 border-[8px] border-indigo-500 flex items-center justify-center">
            <PieChart className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h4 className="font-bold text-white text-lg">Répartition</h4>
            <p className="text-sm text-slate-400 mt-1">Billetterie: 85%<br/>Fret/Bagages: 15%</p>
          </div>
        </div>
      </div>

      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-800/80">
          <h3 className="font-bold text-white text-sm">Transactions Récentes</h3>
        </div>
        <div className="divide-y divide-slate-800/60">
          {transactions.map(t => (
            <div key={t.id} className="p-5 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'in' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                  {t.type === 'in' ? <DollarSign className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{t.desc}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5"><Calendar className="w-3.5 h-3.5" /> {t.date}</p>
                </div>
              </div>
              <span className={`font-bold text-sm ${t.type === 'in' ? 'text-emerald-400' : 'text-white'}`}>
                {t.type === 'in' ? '+' : ''}{t.mnt.toLocaleString('fr-FR')} F
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

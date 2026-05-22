'use client';
import React, { useState, useEffect } from 'react';
import { Building2, Users, Ticket, ArrowUpRight, TrendingUp, Calendar, CreditCard, ChevronRight, BarChart3, ShieldCheck } from 'lucide-react';

const stats = [
  { label: 'Voyageurs aujourd\'hui', val: '845', trend: '+12%', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { label: 'Billets Vendus (Guichet)', val: '142', trend: '+5%', icon: Ticket, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { label: 'Billets Scannés', val: '720', trend: 'Fluide', icon: ShieldCheck, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  { label: 'Recette Guichet', val: '450 000 F', trend: '+8%', icon: CreditCard, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
];

export default function SectionAccueil() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* En-tête Gare */}
      <div className="bg-gradient-to-br from-indigo-900/60 via-[#101728] to-[#101728] border border-indigo-500/20 rounded-3xl p-6">
        <div className="flex flex-col md:flex-row items-center md:justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Building2 className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h2 className="text-2xl font-bold text-white">Gare Routière Baux Maraîchers</h2>
                <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border border-emerald-500/30">Opérationnel</span>
              </div>
              <p className="text-sm text-slate-400 mt-1">Guichet Principal • Agent: Amadou Fall</p>
            </div>
          </div>
          <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-2xl px-6 py-3 flex flex-col items-center justify-center min-w-[150px]">
            <span className="text-2xl font-mono font-bold text-white tracking-widest">{time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="text-xs text-slate-400 font-semibold">{time.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
        </div>
      </div>

      {/* Statistiques clés */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`border rounded-2xl p-5 ${s.bg} bg-[#101728]`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-slate-900/50 border border-slate-700/50`}>
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {s.trend}</span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{s.val}</p>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flux de voyageurs (Graphique) */}
        <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-5 lg:col-span-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-6"><BarChart3 className="w-4 h-4 text-indigo-400" /> Flux Voyageurs (Heure par heure)</h3>
          <div className="h-48 flex items-end justify-between gap-2 px-2">
            {[20, 35, 60, 90, 100, 85, 40, 20, 10].map((h, i) => (
              <div key={i} className="w-full flex flex-col items-center gap-2 group">
                <div className="w-full bg-slate-800 rounded-t-sm relative flex items-end justify-center h-40">
                  <div className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-sm transition-all duration-500" style={{ height: `${h}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">{i + 8}h</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prochains Départs */}
        <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2"><ArrowUpRight className="w-4 h-4 text-orange-400" /> Départs Imminents</h3>
            <button className="text-xs text-indigo-400 font-semibold">Voir tout</button>
          </div>
          <div className="space-y-4">
            {[
              { dest: 'Touba', time: '14:30', status: 'Embarquement', color: 'text-orange-400' },
              { dest: 'Saint-Louis', time: '15:00', status: 'À l\'heure', color: 'text-emerald-400' },
              { dest: 'Thiès', time: '15:15', status: 'À l\'heure', color: 'text-emerald-400' },
              { dest: 'Kaolack', time: '15:30', status: 'Retardé', color: 'text-rose-400' },
            ].map((d, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/60">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-800 text-slate-300 font-mono text-xs px-2 py-1 rounded">{d.time}</div>
                  <p className="text-sm font-bold text-white">{d.dest}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${d.color}`}>{d.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

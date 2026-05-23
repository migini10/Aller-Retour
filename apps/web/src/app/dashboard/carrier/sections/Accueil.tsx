'use client';
import React from 'react';
import { Building2, TrendingUp, Users, Bus, Calendar, Route, BarChart3, ArrowUpRight, DollarSign, Activity } from 'lucide-react';

const stats = [
  { label: 'Revenus aujourd\'hui', val: '1 245 000 F', trend: '+12%', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { label: 'Trajets Actifs', val: '24', trend: '+4', icon: Route, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { label: 'Taux Remplissage', val: '86%', trend: '+5%', icon: Users, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  { label: 'Véhicules en Ligne', val: '32 / 45', trend: 'Stable', icon: Bus, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
];

export default function SectionAccueil() {
  return (
    <div className="space-y-6">
      {/* En-tête Entreprise */}
      <div className="bg-gradient-to-br from-indigo-900/40 via-[#101728] to-[#101728] border border-indigo-500/20 rounded-3xl p-6">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Building2 className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-white">Sénégal Express GIE</h2>
                <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border border-emerald-500/30">Compte Actif</span>
              </div>
              <p className="text-sm text-slate-400 mt-1">Abonnement SaaS Premium • Renouvellement: 14/12/2026</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-colors flex items-center gap-2">
              <Route className="w-4 h-4" /> Créer un trajet
            </button>
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
        {/* Graphique d'évolution (Mockup SVG) */}
        <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2"><BarChart3 className="w-4 h-4 text-indigo-400" /> Évolution des Revenus (7 jours)</h3>
            <select className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-lg px-2 py-1 outline-none">
              <option>Cette semaine</option>
              <option>Ce mois</option>
            </select>
          </div>
          <div className="h-48 flex items-end justify-between gap-2 px-2">
            {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
              <div key={i} className="w-full flex flex-col items-center gap-2 group">
                <div className="w-full bg-slate-800 rounded-t-sm relative flex items-end justify-center h-40">
                  <div className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-sm transition-all duration-500 group-hover:opacity-80" style={{ height: `${h}%` }}></div>
                </div>
                <span className="text-xs text-slate-500 font-medium">J{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dernières réservations */}
        <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-5 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2"><Calendar className="w-4 h-4 text-orange-400 shrink-0" /> <span className="truncate">Réservations Récentes</span></h3>
            <button className="text-xs text-indigo-400 font-semibold shrink-0 ml-2">Voir tout</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shrink-0">
                    <span className="text-xs font-bold text-white">#0{item}</span>
                  </div>
                  <div className="min-w-0 flex flex-col">
                    <div className="relative group/tooltip">
                      <p className="text-sm font-bold text-white truncate cursor-default">Dakar ➔ Touba</p>
                      <div className="absolute -left-2 -top-2 bg-[#101728] border border-orange-500/50 text-white px-3 py-1.5 rounded-lg shadow-2xl opacity-0 group-hover/tooltip:opacity-100 group-hover/tooltip:scale-110 pointer-events-none transition-all duration-300 z-50 whitespace-nowrap origin-left font-bold">
                        Dakar ➔ Touba
                      </div>
                    </div>
                    
                    <div className="relative group/tooltip2">
                      <p className="text-xs text-slate-400 truncate cursor-default">Il y a {item * 5} min</p>
                      <div className="absolute -left-2 -top-2 bg-[#101728] border border-orange-500/50 text-slate-200 px-3 py-1.5 rounded-lg shadow-2xl opacity-0 group-hover/tooltip2:opacity-100 group-hover/tooltip2:scale-110 pointer-events-none transition-all duration-300 z-50 whitespace-nowrap origin-left text-xs">
                        Il y a {item * 5} min
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 whitespace-nowrap">
                  <p className="text-sm font-bold text-emerald-400">7 000 F</p>
                  <p className="text-xs text-slate-500">2 places</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

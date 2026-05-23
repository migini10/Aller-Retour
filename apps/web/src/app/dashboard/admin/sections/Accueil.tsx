'use client';
import React from 'react';
import { Globe, Users, Building2, Ticket, TrendingUp, DollarSign, Activity, Map, ArrowUpRight, BarChart3, Database } from 'lucide-react';

const stats = [
  { label: 'Utilisateurs Actifs', val: '124.5k', trend: '+15%', icon: Users, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  { label: 'Revenus Plateforme', val: '45.2M F', trend: '+22%', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { label: 'Tenants (B2B)', val: '342', trend: '+8', icon: Building2, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  { label: 'Billets (Mois)', val: '89.4k', trend: '+18%', icon: Ticket, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
];

import { useModal } from '../../../../components/ModalContext';

export default function SectionAccueil() {
  const { openModal } = useModal();
  return (
    <div className="space-y-6">
      {/* Hero SaaS Control */}
      <div className="bg-gradient-to-br from-[#0B0F19] via-[#101728] to-[#1e1b4b] border border-orange-500/20 rounded-3xl p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">SaaS Command Center</h2>
                <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border border-emerald-500/30 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> System Stable
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1">Supervision Globale : Sénégal & Expansion Afrique de l'Ouest</p>
            </div>
          </div>
          <div className="flex gap-3">
            <select className="bg-slate-900/80 border border-slate-700 text-sm text-white px-4 py-2 rounded-xl outline-none font-semibold">
              <option>Tous les pays</option>
              <option>Sénégal (Actif)</option>
              <option>Côte d'Ivoire (Beta)</option>
            </select>
            <button onClick={() => openModal('Générer un Rapport', 'Sélectionnez les paramètres du rapport PDF à télécharger.', 'Générer')} className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-lg shadow-orange-500/20">
              Générer Rapport
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`border rounded-2xl p-5 ${s.bg} bg-[#101728]/80 backdrop-blur-sm`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-900 border border-slate-800">
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded"><TrendingUp className="w-3 h-3" /> {s.trend}</span>
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-white mb-1">{s.val}</p>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Chart */}
        <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-white flex items-center gap-2"><BarChart3 className="w-4 h-4 text-orange-400" /> Croissance Utilisateurs & Volume Transactions (YTD)</h3>
            <div className="flex gap-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Utilisateurs</span>
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Volume</span>
            </div>
          </div>
          
          <div className="h-56 flex items-end justify-between gap-1 px-2">
            {[30, 45, 40, 60, 55, 70, 65, 85, 80, 95, 90, 100].map((h, i) => (
              <div key={i} className="w-full flex flex-col items-center gap-2 group relative">
                <div className="w-full flex justify-center items-end gap-1 h-48">
                  {/* Users Bar */}
                  <div className="w-1/2 bg-gradient-to-t from-orange-900 to-orange-500 rounded-t-sm opacity-80 group-hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}></div>
                  {/* Volume Bar */}
                  <div className="w-1/2 bg-gradient-to-t from-emerald-900 to-emerald-500 rounded-t-sm opacity-80 group-hover:opacity-100 transition-opacity" style={{ height: `${h * 0.8}%` }}></div>
                </div>
                <span className="text-[9px] text-slate-500 font-bold uppercase">{['Jan','Fev','Mar','Avr','Mai','Jun','Jul','Aou','Sep','Oct','Nov','Dec'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health / Top Tenants */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-[#101728] to-slate-900 border border-slate-800/80 rounded-2xl p-6">
            <h3 className="font-bold text-white flex items-center gap-2 mb-4"><Database className="w-4 h-4 text-emerald-400" /> Santé Infrastructure</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 font-semibold">Charge Serveur (API)</span>
                  <span className="text-emerald-400 font-bold">24%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full"><div className="w-1/4 h-full bg-emerald-500 rounded-full"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 font-semibold">Connexions WebSockets</span>
                  <span className="text-orange-400 font-bold">12,450 actives</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full"><div className="w-2/3 h-full bg-orange-500 rounded-full"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 font-semibold">Latence Moyenne</span>
                  <span className="text-emerald-400 font-bold">42ms</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full"><div className="w-[10%] h-full bg-emerald-500 rounded-full"></div></div>
              </div>
            </div>
          </div>

          <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white flex items-center gap-2"><Building2 className="w-4 h-4 text-orange-400" /> Top Tenants</h3>
              <button className="text-[10px] text-orange-400 font-bold uppercase tracking-wider hover:text-orange-300">Tout voir</button>
            </div>
            <div className="space-y-3">
              {['Sénégal Express', 'Allo Voyage', 'Transport Touba'].map((t, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 w-4">{i+1}.</span>
                    <span className="text-sm font-semibold text-white">{t}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">+{15 - i*4}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

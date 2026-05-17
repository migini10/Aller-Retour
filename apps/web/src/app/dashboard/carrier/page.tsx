'use client';

import React from 'react';
import { Building2, Bus, Users, TrendingUp, ShieldAlert, DollarSign, Calendar, BarChart3, CheckCircle2, Lock, Wallet } from 'lucide-react';

export default function CarrierDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Espace Transporteur <span className="text-xs uppercase bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 px-3 py-1 rounded-md font-mono">GIE Flotte</span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm leading-relaxed">Supervision de la flotte, trésorerie en compte séquestre et affectation des chauffeurs sur les lignes inter-urbaines.</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-5 py-3 rounded-2xl shadow-xl">
          <Building2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-bold text-white text-sm">GIE Salam Transport • NINEA: 00489234</span>
        </div>
      </div>

      {/* Grid Stats (Haute Fidélité et Nombres Premium avec Badges XOF) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-slate-700 transition-all border-l-4 border-l-emerald-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Trésorerie GIE</span>
            <DollarSign className="w-5 h-5 text-emerald-400 shrink-0" />
          </div>
          <div className="flex items-baseline gap-2 my-2 flex-wrap">
            <span className="text-3xl lg:text-4xl font-black tracking-tight text-white">4 850 000</span>
            <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">XOF</span>
          </div>
          <p className="text-xs text-emerald-400 mt-2 font-semibold flex items-center gap-1.5 pt-3 border-t border-slate-800/80">
            <TrendingUp className="w-3.5 h-3.5 shrink-0" /> +14.5% vs mois précédent
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-slate-700 transition-all border-l-4 border-l-amber-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Fonds en Séquestre</span>
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
          </div>
          <div className="flex items-baseline gap-2 my-2 flex-wrap">
            <span className="text-3xl lg:text-4xl font-black tracking-tight text-white">1 240 000</span>
            <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">XOF</span>
          </div>
          <p className="text-xs text-amber-400 mt-2 flex items-center gap-1.5 pt-3 border-t border-slate-800/80 font-medium">
            <Lock className="w-3.5 h-3.5 shrink-0" /> Déblocage auto à l'arrivée en gare
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-slate-700 transition-all border-l-4 border-l-blue-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Véhicules Actifs</span>
            <Bus className="w-5 h-5 text-blue-400 shrink-0" />
          </div>
          <div className="flex items-baseline gap-2 my-2 flex-wrap">
            <span className="text-3xl lg:text-4xl font-black tracking-tight text-white">24 / 28</span>
            <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300">Bus Actifs</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5 pt-3 border-t border-slate-800/80 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" /> 4 bus en révision technique
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-slate-700 transition-all border-l-4 border-l-purple-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/10 transition-colors" />
          <div className="flex justify-between items-center mb-3">
            <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Billets Vendus (Aujourd'hui)</span>
            <Users className="w-5 h-5 text-purple-400 shrink-0" />
          </div>
          <div className="flex items-baseline gap-2 my-2 flex-wrap">
            <span className="text-3xl lg:text-4xl font-black tracking-tight text-white">842</span>
            <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300">Billets</span>
          </div>
          <p className="text-xs text-emerald-400 mt-2 font-semibold flex items-center gap-1.5 pt-3 border-t border-slate-800/80">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" /> Taux de remplissage : 92%
          </p>
        </div>
      </div>

      {/* Fleet Monitoring */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800/80">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Suivi GPS de la Flotte en Direct</h3>
            <p className="text-xs text-slate-400 mt-1">Synchronisation des boîtiers GPS embarqués et transmission aux bornes en gare.</p>
          </div>
          <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105">
            <BarChart3 className="w-4 h-4 shrink-0" /> Exporter rapport comptable
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { id: 'BUS-401', route: 'Dakar ➔ Touba', driver: 'Modou Diagne', status: 'En route (Vitesse: 84 km/h)', fill: '48 / 50' },
            { id: 'BUS-402', route: 'Dakar ➔ Saint-Louis', driver: 'Ibrahima Fall', status: 'En gare de départ', fill: '50 / 50 (Complet)' },
            { id: 'BUS-403', route: 'Thiès ➔ Ziguinchor', driver: 'Ousmane Sonko', status: 'Proche arrivée (3 km)', fill: '42 / 45' },
          ].map((b) => (
            <div key={b.id} className="bg-slate-800/40 border border-slate-700/60 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-all shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {b.id}
                  </span>
                  <h4 className="text-lg font-bold text-white mt-3">{b.route}</h4>
                </div>
                <Bus className="w-8 h-8 text-slate-600 group-hover:text-emerald-400 transition-colors shrink-0" />
              </div>
              <p className="text-xs text-slate-400 mb-1.5">Chauffeur assigné : <strong className="text-white font-semibold">{b.driver}</strong></p>
              <p className="text-xs text-slate-400 mb-5">Remplissage : <strong className="text-emerald-400 font-bold">{b.fill}</strong></p>
              <div className="pt-4 border-t border-slate-700/50 flex justify-between items-center">
                <span className="text-xs font-semibold text-teal-300 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" /> {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { Building2, Bus, Users, TrendingUp, ShieldAlert, DollarSign, BarChart3 } from 'lucide-react';

export default function CarrierDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Espace Transporteur / GIE</h1>
            <p className="text-slate-400 text-sm mt-1">Supervision de la flotte, chiffre d'affaires en séquestre et affectation des lignes.</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl w-fit">
            <Building2 className="w-4 h-4 text-orange-400 shrink-0" />
            <span className="font-semibold text-white text-xs">GIE Salam Transport</span>
          </div>
        </div>
      </div>

      {/* Stats Grid — 2 col mobile, 4 col desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#101728] border border-slate-800/80 p-4 sm:p-5 rounded-2xl col-span-2 sm:col-span-1">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-slate-400 font-medium">Trésorerie</span>
            <DollarSign className="w-4 h-4 text-orange-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">4 850 000 <span className="text-sm font-bold text-orange-400">FCFA</span></h2>
          <p className="text-xs text-orange-400 mt-2 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14.5% ce mois
          </p>
        </div>

        <div className="bg-[#101728] border border-slate-800/80 p-4 sm:p-5 rounded-2xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-slate-400 font-medium">Séquestre</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">1 240 000 <span className="text-xs text-amber-400">FCFA</span></h2>
          <p className="text-xs text-amber-400 mt-2">Déblocage auto à l'arrivée</p>
        </div>

        <div className="bg-[#101728] border border-slate-800/80 p-4 sm:p-5 rounded-2xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-slate-400 font-medium">Flotte</span>
            <Bus className="w-4 h-4 text-blue-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">24 / 28</h2>
          <p className="text-xs text-slate-400 mt-2">4 en révision</p>
        </div>

        <div className="bg-[#101728] border border-slate-800/80 p-4 sm:p-5 rounded-2xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-slate-400 font-medium">Billets Vendus</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">842</h2>
          <p className="text-xs text-orange-400 mt-2 font-semibold">Remplissage : 92%</p>
        </div>
      </div>

      {/* Fleet Monitoring */}
      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h3 className="text-base font-bold text-white">Suivi GPS de la Flotte en Direct</h3>
          <button className="bg-orange-500/10 border border-orange-500/30 text-orange-400 font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-2 w-fit">
            <BarChart3 className="w-4 h-4" /> Exporter rapport
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { id: 'BUS-401', route: 'Dakar ➔ Touba', driver: 'Modou Diagne', status: 'En route (84 km/h)', fill: '48 / 50', color: 'orange' },
            { id: 'BUS-402', route: 'Dakar ➔ Saint-Louis', driver: 'Ibrahima Fall', status: 'En gare de départ', fill: '50 / 50 ✓', color: 'blue' },
            { id: 'BUS-403', route: 'Thiès ➔ Ziguinchor', driver: 'Ousmane Sonko', status: 'Proche arrivée (3 km)', fill: '42 / 45', color: 'teal' },
          ].map((b) => (
            <div key={b.id} className="bg-slate-900/50 border border-slate-700/60 p-4 rounded-xl hover:border-orange-500/40 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    {b.id}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-2">{b.route}</h4>
                </div>
                <Bus className="w-6 h-6 text-slate-500" />
              </div>
              <p className="text-xs text-slate-400 mb-0.5">Chauffeur : <strong className="text-slate-200">{b.driver}</strong></p>
              <p className="text-xs text-slate-400 mb-3">Remplissage : <strong className="text-orange-400">{b.fill}</strong></p>
              <div className="pt-3 border-t border-slate-700/50">
                <span className="text-xs font-semibold text-teal-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping shrink-0" />
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

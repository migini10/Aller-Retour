'use client';

import React from 'react';
import { Building2, Bus, Users, TrendingUp, ShieldAlert, DollarSign, Calendar, BarChart3, CheckCircle2 } from 'lucide-react';

export default function CarrierDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Espace Transporteur / GIE</h1>
          <p className="text-slate-400 mt-1">Supervision de la flotte, chiffre d'affaires en séquestre et affectation des lignes.</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-5 py-2.5 rounded-2xl">
          <Building2 className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-white text-sm">GIE Salam Transport (NINEA: 00489234)</span>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-400 font-medium text-xs uppercase tracking-wider block truncate">Trésorerie GIE (XOF)</span>
            <DollarSign className="w-5 h-5 text-emerald-400 shrink-0" />
          </div>
          <h2 className="text-xl xl:text-2xl font-black text-white tracking-tight truncate">4 850 000 XOF</h2>
          <p className="text-xs text-emerald-400 mt-2 font-semibold flex items-center gap-1 truncate">
            <TrendingUp className="w-3.5 h-3.5 shrink-0" /> +14.5% vs mois précédent
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-400 font-medium text-xs uppercase tracking-wider block truncate">Fonds en Séquestre</span>
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
          </div>
          <h2 className="text-xl xl:text-2xl font-bold text-white tracking-tight truncate">1 240 000 XOF</h2>
          <p className="text-xs text-amber-400 mt-2 truncate">Déblocage auto à l'arrivée en gare</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-400 font-medium text-xs uppercase tracking-wider block truncate">Véhicules Actifs</span>
            <Bus className="w-5 h-5 text-blue-400 shrink-0" />
          </div>
          <h2 className="text-xl xl:text-2xl font-bold text-white tracking-tight truncate">24 / 28 Bus</h2>
          <p className="text-xs text-slate-400 mt-2 truncate">4 en révision technique</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-400 font-medium text-xs uppercase tracking-wider block truncate">Billets Vendus (Aujourd'hui)</span>
            <Users className="w-5 h-5 text-purple-400 shrink-0" />
          </div>
          <h2 className="text-xl xl:text-2xl font-bold text-white tracking-tight truncate">842 Billets</h2>
          <p className="text-xs text-emerald-400 mt-2 font-semibold truncate">Taux de remplissage : 92%</p>
        </div>
      </div>

      {/* Fleet Monitoring */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Suivi GPS de la Flotte en Direct</h3>
          <button className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Exporter rapport comptable
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { id: 'BUS-401', route: 'Dakar ➔ Touba', driver: 'Modou Diagne', status: 'En route (Vitesse: 84 km/h)', fill: '48 / 50' },
            { id: 'BUS-402', route: 'Dakar ➔ Saint-Louis', driver: 'Ibrahima Fall', status: 'En gare de départ', fill: '50 / 50 (Complet)' },
            { id: 'BUS-403', route: 'Thiès ➔ Ziguinchor', driver: 'Ousmane Sonko', status: 'Proche arrivée (3 km)', fill: '42 / 45' },
          ].map((b) => (
            <div key={b.id} className="bg-slate-800/40 border border-slate-700/60 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {b.id}
                  </span>
                  <h4 className="text-lg font-bold text-white mt-2">{b.route}</h4>
                </div>
                <Bus className="w-8 h-8 text-slate-600 group-hover:text-emerald-400 transition-colors" />
              </div>
              <p className="text-xs text-slate-400 mb-1">Chauffeur assigné : <strong className="text-white">{b.driver}</strong></p>
              <p className="text-xs text-slate-400 mb-4">Remplissage : <strong className="text-emerald-400">{b.fill}</strong></p>
              <div className="pt-4 border-t border-slate-700/50 flex justify-between items-center">
                <span className="text-xs font-semibold text-teal-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" /> {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';
import React from 'react';
import { MapPin, Navigation, SignalHigh, CheckCircle2 } from 'lucide-react';

export default function SectionSuivi() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><MapPin className="w-5 h-5 text-indigo-400" /> Centre de Contrôle GPS (Gare)</h2>
        <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-500/20 flex items-center gap-1.5">
          <SignalHigh className="w-3.5 h-3.5" /> Synchronisé en direct
        </span>
      </div>

      <div className="bg-[#101728] border border-slate-800/80 rounded-3xl p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[600px]">
        {/* Simple Map Placeholder with radar effect */}
        <div className="absolute inset-0 bg-slate-950">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-indigo-500/20 rounded-full animate-ping opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-indigo-500/40 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-indigo-500/60 rounded-full bg-indigo-500/5"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,1)]"></div>
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-6 font-bold text-indigo-400 text-xs">Gare Baux Maraîchers</p>
        </div>

        {/* Vehicules entrants/sortants */}
        <div className="absolute top-1/3 left-1/4 bg-slate-900 border border-emerald-500/30 p-2 rounded-xl flex items-center gap-3 backdrop-blur-sm z-10 animate-pulse">
          <Navigation className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="font-bold text-white text-xs">Bus 50 (Retour)</p>
            <p className="text-[10px] text-slate-400">Arrivée estimée: 5 min</p>
          </div>
        </div>

        <div className="absolute top-2/3 right-1/4 bg-slate-900 border border-orange-500/30 p-2 rounded-xl flex items-center gap-3 backdrop-blur-sm z-10">
          <Navigation className="w-5 h-5 text-orange-400 rotate-180" />
          <div>
            <p className="font-bold text-white text-xs">TRIP-402 (Départ)</p>
            <p className="text-[10px] text-slate-400">À 2km (Sortie de ville)</p>
          </div>
        </div>

        {/* Overlay infos */}
        <div className="absolute bottom-6 left-6 right-6 lg:left-1/2 lg:right-auto lg:-translate-x-1/2 bg-slate-900/90 backdrop-blur-xl border border-slate-700 p-4 rounded-2xl w-full max-w-md shadow-2xl">
          <h3 className="font-bold text-white text-sm mb-3">Trafic & Logistique</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Véhicules en approche</p>
              <p className="text-xl font-bold text-emerald-400">2 <span className="text-xs text-slate-500 font-normal">dans les 30m</span></p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Véhicules partis (1h)</p>
              <p className="text-xl font-bold text-white">5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { Bus, WifiOff, Navigation, Download, Wallet, ArrowUpRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import QRCodeBrandEngine from '../../../components/QRCodeBrandEngine';

export default function DriverDashboard() {
  const [gpsActive, setGpsActive] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Espace Chauffeur — Cockpit</h1>
            <p className="text-slate-400 text-sm mt-1">GPS en direct, manifeste hors-ligne et cash-out instantané Wave.</p>
          </div>
          <button
            onClick={() => setGpsActive(!gpsActive)}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 text-sm transition-all ${
              gpsActive
                ? 'bg-orange-600 text-white shadow-sm'
                : 'bg-rose-500/20 border border-rose-500/40 text-rose-400'
            }`}
          >
            <Navigation className={`w-4 h-4 ${gpsActive ? 'animate-pulse' : ''}`} />
            {gpsActive ? 'GPS Actif (15s)' : 'GPS Inactif'}
          </button>
        </div>
      </div>

      {/* Stats Grid — 1 col mobile, 3 col desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Gains */}
        <div className="bg-[#101728] border border-slate-800/80 p-5 rounded-2xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Gains (Cash-out)</span>
            <Wallet className="w-5 h-5 text-orange-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">184 500 FCFA</h2>
          <button className="mt-4 w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
            <ArrowUpRight className="w-4 h-4" /> Retrait Wave (3s)
          </button>
        </div>

        {/* Manifeste */}
        <div className="bg-[#101728] border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Manifeste (Offline)</span>
              <Download className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">48 / 50</h2>
            <p className="text-xs text-orange-400 mt-2 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> SQLite chiffré synchronisé
            </p>
          </div>
          <button className="mt-4 w-full bg-slate-900 text-white font-medium py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-sm">
            <WifiOff className="w-4 h-4 text-amber-400" /> Re-synchroniser
          </button>
        </div>

        {/* Geofence */}
        <div className="bg-[#101728] border border-slate-800/80 p-5 rounded-2xl sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Prochain Geofence</span>
            <Bus className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Touba (Gare Centrale)</h2>
          <p className="text-xs text-slate-400 mt-2">Distance estimée : 14.2 km • Dans ~18 min</p>
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span className="text-xs text-amber-300 font-semibold">Alerte SMS automatique à 200m</span>
          </div>
        </div>
      </div>

      {/* Manifest Table — scrollable sur mobile */}
      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h3 className="text-base font-bold text-white">Feuille de Route — Manifeste #TRIP-402</h3>
          <span className="text-xs px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-medium w-fit">
            Bus • Dakar ➔ Touba
          </span>
        </div>
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-left min-w-[520px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase">
                <th className="pb-3 pl-3">Siège</th>
                <th className="pb-3">Passager</th>
                <th className="pb-3">Téléphone</th>
                <th className="pb-3">Statut</th>
                <th className="pb-3">Bagage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 pl-3 font-bold text-white"><QRCodeBrandEngine value="#01" size={48} /></td>
                <td className="py-3 font-semibold text-slate-200">Fatou Diop</td>
                <td className="py-3 text-slate-400 text-xs">+221 77 123 45 67</td>
                <td className="py-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30">
                    <CheckCircle2 className="w-3 h-3" /> BOARDED
                  </span>
                </td>
                <td className="py-3 text-slate-400 text-xs">12 kg</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-3 pl-3 font-bold text-white"><QRCodeBrandEngine value="#02" size={48} /></td>
                <td className="py-3 font-semibold text-slate-200">Mamadou Ndiaye</td>
                <td className="py-3 text-slate-400 text-xs">+221 78 987 65 43</td>
                <td className="py-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                    En attente
                  </span>
                </td>
                <td className="py-3 text-orange-400 text-xs font-bold">25 kg (+1 000)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

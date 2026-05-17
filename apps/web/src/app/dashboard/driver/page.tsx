'use client';

import React, { useState } from 'react';
import { Bus, WifiOff, Navigation, Download, Wallet, ArrowUpRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function DriverDashboard() {
  const [gpsActive, setGpsActive] = useState(true);
  const [manifestDownloaded, setManifestDownloaded] = useState(true);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Espace Chauffeur (Cockpit)</h1>
          <p className="text-slate-400 mt-1">Pilotage GPS en direct, manifeste hors-ligne et cash-out instantané Wave.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setGpsActive(!gpsActive)}
            className={`px-5 py-3 rounded-2xl font-bold flex items-center gap-2.5 shadow-xl transition-all ${
              gpsActive 
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20 animate-pulse' 
                : 'bg-rose-500/20 border border-rose-500/40 text-rose-400'
            }`}
          >
            <Navigation className={`w-5 h-5 ${gpsActive ? 'animate-spin' : ''}`} />
            {gpsActive ? 'Broadcast GPS Actif (15s)' : 'GPS Inactif'}
          </button>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-400 font-medium text-sm">Gains Disponibles (Cash-out)</span>
            <Wallet className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-4xl font-black text-white">184 500 FCFA</h2>
          <button className="mt-6 w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
            <ArrowUpRight className="w-5 h-5" /> Retrait instantané Wave (3s)
          </button>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-400 font-medium text-sm">Manifeste Passagers (Offline)</span>
              <Download className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">48 / 50 Passagers</h2>
            <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-4 h-4" /> Cache SQLite chiffré synchronisé
            </p>
          </div>
          <button className="mt-6 w-full bg-slate-800 text-white font-semibold py-3 rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-400" /> Re-synchroniser le manifeste
          </button>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-400 font-medium text-sm">Prochain Geofence Gare</span>
            <Bus className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Touba (Gare Centrale)</h2>
          <p className="text-xs text-slate-400 mt-2">Distance estimée : 14.2 km • Dans ~18 min</p>
          <div className="mt-6 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs text-amber-300 font-bold">Alerte SMS automatique à 200m</span>
          </div>
        </div>
      </div>

      {/* Manifest Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Feuille de Route & Manifeste #TRIP-402</h3>
          <span className="px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300">
            Bus Climatisé • Dakar ➔ Touba
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase">
                <th className="pb-4 pl-4">Siège</th>
                <th className="pb-4">Nom du Passager</th>
                <th className="pb-4">Téléphone</th>
                <th className="pb-4">Statut Embarquement</th>
                <th className="pb-4">Franchise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-4 pl-4 font-bold text-white">#01</td>
                <td className="py-4 font-semibold text-slate-200">Fatou Diop</td>
                <td className="py-4 text-slate-400">+221 77 123 45 67</td>
                <td className="py-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Billet Scanné (BOARDED)
                  </span>
                </td>
                <td className="py-4 text-slate-400">12 kg</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-4 pl-4 font-bold text-white">#02</td>
                <td className="py-4 font-semibold text-slate-200">Mamadou Ndiaye</td>
                <td className="py-4 text-slate-400">+221 78 987 65 43</td>
                <td className="py-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                    En attente de scan
                  </span>
                </td>
                <td className="py-4 text-emerald-400 font-bold">25 kg (+1000 XOF)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

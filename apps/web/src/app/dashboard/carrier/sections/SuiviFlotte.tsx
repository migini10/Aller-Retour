'use client';
import React from 'react';
import { MapPin, Navigation, SignalHigh, WifiOff } from 'lucide-react';

export default function SectionSuiviFlotte() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Navigation className="w-5 h-5 text-indigo-400" /> Suivi de Flotte Temps Réel</h2>
        <div className="flex gap-2">
          <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-500/20 flex items-center gap-1.5">
            <SignalHigh className="w-3.5 h-3.5" /> WebSocket Connecté
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Liste des véhicules actifs */}
        <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-4 lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Véhicules Actifs (3)</h3>
          
          {[
            { id: 'TRIP-402', driver: 'Moussa Ndiaye', route: 'Dakar → Touba', speed: '90 km/h', status: 'online', delay: null },
            { id: 'TRIP-405', driver: 'Abdoulaye Sow', route: 'Thiès → Saint-Louis', speed: '75 km/h', status: 'online', delay: '+10 min' },
            { id: 'TRIP-408', driver: 'Cheikh Fall', route: 'Dakar → Mbour', speed: '0 km/h', status: 'offline', delay: null },
          ].map((v, i) => (
            <div key={i} className="p-3 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-white">{v.driver}</span>
                {v.status === 'online' ? <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> : <WifiOff className="w-3 h-3 text-slate-500" />}
              </div>
              <p className="text-xs text-slate-400 mb-2">{v.route}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">{v.speed}</span>
                {v.delay && <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded">Retard {v.delay}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Grande carte premium */}
        <div className="bg-[#101728] border border-slate-800/80 rounded-2xl overflow-hidden lg:col-span-3 relative h-[600px]">
          {/* Mockup Map */}
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="gridLarge" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="#94a3b8" strokeWidth="0.5"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#gridLarge)" />
          </svg>

          {/* SVG Map Sénégal */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
            {/* Routes */}
            <path d="M100,500 Q200,400 300,300 Q400,200 500,100" stroke="#1e3a5f" strokeWidth="8" fill="none" />
            <path d="M300,300 Q450,350 600,400" stroke="#1e3a5f" strokeWidth="6" fill="none" />
            <path d="M100,500 Q300,600 500,550" stroke="#1e3a5f" strokeWidth="6" fill="none" />

            {/* Villes */}
            <circle cx="100" cy="500" r="8" fill="#475569" /><text x="100" y="525" fill="#94a3b8" fontSize="12" textAnchor="middle">Dakar</text>
            <circle cx="300" cy="300" r="6" fill="#475569" /><text x="300" y="285" fill="#94a3b8" fontSize="12" textAnchor="middle">Thiès</text>
            <circle cx="500" cy="100" r="6" fill="#475569" /><text x="500" y="85" fill="#94a3b8" fontSize="12" textAnchor="middle">Saint-Louis</text>
            <circle cx="600" cy="400" r="8" fill="#475569" /><text x="600" y="425" fill="#94a3b8" fontSize="12" textAnchor="middle">Touba</text>

            <defs><filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>

            {/* Vehicule 1 (En mvt vers Touba) */}
            <g transform="translate(450, 350)" filter="url(#glow)">
              <circle cx="0" cy="0" r="12" fill="#22c55e" opacity="0.2"><animate attributeName="r" values="12;24;12" dur="2s" repeatCount="indefinite"/></circle>
              <circle cx="0" cy="0" r="6" fill="#22c55e" />
              <rect x="-30" y="-30" width="60" height="20" rx="4" fill="#0f172a" opacity="0.9" />
              <text x="0" y="-16" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">Moussa (90)</text>
            </g>

            {/* Vehicule 2 (En mvt vers St-Louis) */}
            <g transform="translate(400, 200)" filter="url(#glow)">
              <circle cx="0" cy="0" r="12" fill="#3b82f6" opacity="0.2"><animate attributeName="r" values="12;24;12" dur="2s" repeatCount="indefinite"/></circle>
              <circle cx="0" cy="0" r="6" fill="#3b82f6" />
              <rect x="-35" y="-30" width="70" height="20" rx="4" fill="#0f172a" opacity="0.9" />
              <text x="0" y="-16" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">Abdoulaye (75)</text>
            </g>
          </svg>

          {/* overlay infos */}
          <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur border border-slate-700 p-3 rounded-xl max-w-xs">
            <h4 className="text-white font-bold text-sm mb-1">Résumé Flotte</h4>
            <div className="flex items-center gap-4 text-xs text-slate-300">
              <span><span className="w-2 h-2 inline-block rounded-full bg-emerald-500 mr-1"/> 2 en route</span>
              <span><span className="w-2 h-2 inline-block rounded-full bg-slate-500 mr-1"/> 1 hors ligne</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

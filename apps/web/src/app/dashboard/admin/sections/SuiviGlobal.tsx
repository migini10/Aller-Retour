'use client';
import React from 'react';
import { Map, Navigation, Activity, Server, AlertTriangle } from 'lucide-react';

export default function SectionSuiviGlobal() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><Map className="w-5 h-5 text-indigo-400" /> Surveillance GPS Multinationale</h2>
          <p className="text-sm text-slate-400 mt-1">Supervision temps réel de tous les véhicules sur la plateforme SaaS.</p>
        </div>
        <div className="flex gap-2">
          <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-500/20 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5" /> WebSocket: 450 msg/sec
          </span>
        </div>
      </div>

      <div className="bg-[#101728] border border-slate-800/80 rounded-3xl p-6 relative overflow-hidden flex flex-col items-center justify-center h-[700px]">
        
        {/* Mockup Map Afrique de l'Ouest */}
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="gridAdmin" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M 100 0 L 0 0 0 100" fill="none" stroke="#4f46e5" strokeWidth="0.2"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#gridAdmin)" />
        </svg>

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          {/* Côtes & Frontières simplifiées */}
          <path d="M200,300 Q150,400 180,500 L200,600 L400,600 L500,400 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
          
          <defs><filter id="glowAdmin"><feGaussianBlur stdDeviation="4" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>

          {/* Clusters de véhicules (Dakar, Thiès, etc) */}
          <g transform="translate(250, 450)" filter="url(#glowAdmin)">
            <circle cx="0" cy="0" r="40" fill="#6366f1" opacity="0.1"><animate attributeName="r" values="30;50;30" dur="3s" repeatCount="indefinite"/></circle>
            <circle cx="0" cy="0" r="10" fill="#6366f1" />
            <text x="0" y="-15" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">Dakar (342)</text>
          </g>

          <g transform="translate(350, 420)" filter="url(#glowAdmin)">
            <circle cx="0" cy="0" r="25" fill="#6366f1" opacity="0.1"><animate attributeName="r" values="20;35;20" dur="4s" repeatCount="indefinite"/></circle>
            <circle cx="0" cy="0" r="6" fill="#6366f1" />
            <text x="0" y="-12" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">Touba (156)</text>
          </g>

          {/* Lignes de trafic actives */}
          <path d="M250,450 Q300,400 350,420" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.5" strokeDasharray="5 5">
             <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite" />
          </path>
        </svg>

        {/* Overlay Control Panel */}
        <div className="absolute top-6 right-6 w-80 bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-2xl p-5 shadow-2xl z-10">
          <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-emerald-400" /> Télémétrie en direct</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs text-slate-400">Véhicules Connectés</span>
              <span className="font-bold text-white">1,245</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs text-slate-400">Trajets en cours</span>
              <span className="font-bold text-indigo-400">312</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Alertes GPS</span>
              <span className="font-bold text-rose-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> 2</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

'use client';
import React from 'react';
import { MapPin, Navigation, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

const etapes = [
  { nom: 'Dakar (Gare Routière Pompiers)', heure: '08:00', statut: 'passé' },
  { nom: 'Thiès', heure: '09:30', statut: 'passé' },
  { nom: 'Diourbel', heure: '11:00', statut: 'actuel' },
  { nom: 'Touba (Gare Centrale)', heure: '13:30', statut: 'à venir' },
];

export default function SectionSuiviGPS() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2"><Navigation className="w-5 h-5 text-orange-400" /> Suivi Voyage en Temps Réel</h2>

      {/* Info carte */}
      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-slate-400">Trajet</p>
            <p className="text-sm font-bold text-white mt-0.5">Dakar → Touba</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Position actuelle</p>
            <p className="text-sm font-bold text-orange-400 mt-0.5 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" /> Diourbel</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Arrivée estimée</p>
            <p className="text-sm font-bold text-white mt-0.5 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-orange-400" /> 13:45 (+15 min)</p>
          </div>
        </div>

        {/* Alerte retard */}
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-xs text-amber-300 font-semibold">Retard de 15 minutes signalé — embouteillage à Diourbel.</p>
        </div>
      </div>

      {/* Carte SVG Premium Animée */}
      <div className="relative h-72 bg-gradient-to-br from-[#0d1b2a] via-[#0f2233] to-[#0a1520] border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl">
        {/* Grille de fond style carte */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Carte principale SVG */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 288" preserveAspectRatio="xMidYMid meet">
          {/* Routes secondaires (fond) */}
          <path d="M50,80 Q150,100 200,140 Q250,180 280,200" stroke="#1e3a5f" strokeWidth="6" fill="none" strokeLinecap="round"/>
          <path d="M400,30 Q450,80 480,120 Q510,160 500,220" stroke="#1e3a5f" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M600,50 Q650,90 680,150 Q700,190 720,240" stroke="#1e3a5f" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M100,240 Q200,220 300,230 Q450,240 550,220 Q650,210 750,230" stroke="#1e3a5f" strokeWidth="4" fill="none" strokeLinecap="round"/>

          {/* Route principale Dakar → Touba */}
          <path id="mainRoute" d="M80,220 Q180,200 260,170 Q360,130 460,110 Q560,95 660,75 Q720,65 740,60" stroke="#1d4ed8" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.5"/>
          {/* Route active (orange) */}
          <path d="M80,220 Q180,200 260,170 Q360,130 460,110 Q560,95 660,75 Q720,65 740,60"
            stroke="url(#routeGrad)" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="12 4"/>

          <defs>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="55%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Ville : Dakar (départ) */}
          <circle cx="80" cy="220" r="10" fill="#22c55e" opacity="0.9" filter="url(#glow)"/>
          <circle cx="80" cy="220" r="16" fill="#22c55e" opacity="0.2"/>
          <text x="80" y="248" textAnchor="middle" fill="#86efac" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Dakar</text>

          {/* Ville : Thiès (passée) */}
          <circle cx="260" cy="170" r="7" fill="#22c55e" opacity="0.8"/>
          <circle cx="260" cy="170" r="13" fill="#22c55e" opacity="0.15"/>
          <text x="260" y="158" textAnchor="middle" fill="#86efac" fontSize="10" fontFamily="sans-serif">Thiès</text>

          {/* Ville : Diourbel (position actuelle) */}
          <circle cx="460" cy="110" r="9" fill="#f97316" opacity="1" filter="url(#glow)"/>
          <circle cx="460" cy="110" r="18" fill="#f97316" opacity="0.15">
            <animate attributeName="r" values="14;24;14" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite"/>
          </circle>
          <text x="460" y="98" textAnchor="middle" fill="#fdba74" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Diourbel ●</text>

          {/* Ville : Touba (destination) */}
          <circle cx="740" cy="60" r="10" fill="#64748b" opacity="0.7"/>
          <text x="740" y="48" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Touba</text>

          {/* Véhicule (bus animé) */}
          <g filter="url(#glow)">
            <rect x="445" y="97" width="30" height="16" rx="4" fill="#f97316">
              <animate attributeName="opacity" values="1;0.7;1" dur="1.5s" repeatCount="indefinite"/>
            </rect>
            <rect x="449" y="100" width="7" height="5" rx="1" fill="#fff" opacity="0.8"/>
            <rect x="459" y="100" width="7" height="5" rx="1" fill="#fff" opacity="0.8"/>
            <circle cx="451" cy="113" r="2.5" fill="#1e293b"/>
            <circle cx="468" cy="113" r="2.5" fill="#1e293b"/>
          </g>
        </svg>

        {/* Overlay infos en bas */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0B0F19]/95 to-transparent p-4 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Dakar (départ)</span>
            <span className="flex items-center gap-1.5 text-orange-400 font-semibold"><span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" /> Diourbel (actuel)</span>
            <span className="flex items-center gap-1.5 text-slate-500 font-semibold"><span className="w-2 h-2 rounded-full bg-slate-500" /> Touba (arrivée)</span>
          </div>
          <span className="text-xs text-orange-400 font-bold">EN DIRECT</span>
        </div>
      </div>

      {/* Étapes */}
      <div className="space-y-3">
        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Progression du trajet</p>
        <div className="relative">
          {etapes.map((e, i) => (
            <div key={i} className="flex items-start gap-4 mb-4 last:mb-0">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${e.statut === 'passé' ? 'bg-emerald-500/20 text-emerald-400' : e.statut === 'actuel' ? 'bg-orange-500/30 text-orange-400 ring-2 ring-orange-500/50' : 'bg-slate-800 text-slate-600'}`}>
                  {e.statut === 'passé' ? <CheckCircle2 className="w-4 h-4" /> : e.statut === 'actuel' ? <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" /> : <MapPin className="w-4 h-4" />}
                </div>
                {i < etapes.length - 1 && <div className={`w-0.5 h-8 mt-1 ${e.statut === 'passé' ? 'bg-emerald-500/40' : 'bg-slate-800'}`} />}
              </div>
              <div className="pt-1">
                <p className={`text-sm font-semibold ${e.statut === 'passé' ? 'text-slate-400' : e.statut === 'actuel' ? 'text-orange-400' : 'text-slate-500'}`}>{e.nom}</p>
                <p className="text-xs text-slate-600 mt-0.5">{e.heure}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

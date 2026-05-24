'use client';
import React from 'react';
import { MapPin, Navigation, Clock, CheckCircle2, AlertTriangle, Phone, MessageSquare, Star } from 'lucide-react';

export default function SectionSuiviGPS() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <Navigation className="w-5 h-5 text-orange-400" /> Suivi du Véhicule
      </h2>

      {/* Driver & ETA Card */}
      <div className="bg-gradient-to-br from-orange-600/10 via-[#101728] to-[#101728] border border-orange-500/20 rounded-3xl p-5 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white">Arrive dans <span className="text-orange-400">3 min</span></h3>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-400" /> Point de prise en charge à 1.2 km
            </p>
          </div>
          <div className="bg-orange-500/10 text-orange-400 px-3 py-1.5 rounded-xl text-xs font-bold border border-orange-500/20 animate-pulse">
            EN APPROCHE
          </div>
        </div>

        {/* Driver Details */}
        <div className="flex items-center gap-4 bg-[#0a0f18] rounded-2xl p-4 border border-slate-800/80">
          <div className="w-14 h-14 rounded-full bg-slate-800 overflow-hidden shrink-0 relative">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Moussa" alt="Chauffeur" className="w-full h-full object-cover" />
            <div className="absolute -bottom-1 -right-1 bg-white text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
              4.9 <Star className="w-2.5 h-2.5 fill-slate-900" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold truncate">Moussa Ndiaye</p>
            <p className="text-xs text-slate-400 truncate">Voiture Particulière 4 places • Allo Dakar</p>
            <div className="mt-1 bg-slate-800 px-2 py-0.5 rounded text-xs font-mono text-slate-300 w-fit">
              DK-7482-BB

            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition-colors">
              <MessageSquare className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center text-white transition-colors">
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Carte SVG Premium Animée (Pickup) */}
      <div className="relative h-80 bg-gradient-to-br from-[#0d1b2a] via-[#0f2233] to-[#0a1520] border border-slate-700/60 rounded-3xl overflow-hidden shadow-xl">
        {/* Grille de fond style carte urbaine */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Info panel sur la carte (Position détaillée) */}
        <div className="absolute top-4 left-4 right-4 sm:right-auto sm:w-80 bg-[#050A15]/95 backdrop-blur-md border border-slate-700/60 p-4 rounded-2xl shadow-2xl z-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] uppercase text-orange-400 font-bold tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" /> Position Actuelle
            </p>
            <span className="text-[10px] text-slate-400 font-mono">GPS: 14.6928° N, -17.4467° W</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-orange-500/20 p-1.5 rounded-lg border border-orange-500/30 shrink-0">
                <Navigation className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Avenue Cheikh Anta Diop</p>
                <p className="text-xs text-slate-400">Quartier Fann, Dakar</p>
              </div>
            </div>
            
            <div className="h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent" />
            
            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-emerald-500/20 p-1.5 rounded-lg border border-emerald-500/30 shrink-0">
                <MapPin className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Point de rendez-vous</p>
                <p className="text-xs text-slate-400">Rue 10 x Rue 11, Point E</p>
              </div>
            </div>
          </div>
        </div>

        {/* Carte urbaine SVG */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
          {/* Rues (fond) */}
          <path d="M-100,100 L900,200" stroke="#1e3a5f" strokeWidth="12" fill="none" />
          <path d="M-100,300 L900,100" stroke="#1e3a5f" strokeWidth="8" fill="none" />
          <path d="M300,-100 L400,500" stroke="#1e3a5f" strokeWidth="16" fill="none" />
          <path d="M600,-100 L500,500" stroke="#1e3a5f" strokeWidth="10" fill="none" />
          <path d="M100,-100 L150,500" stroke="#1e3a5f" strokeWidth="6" fill="none" />
          <path d="M700,-100 L750,500" stroke="#1e3a5f" strokeWidth="6" fill="none" />
          <path d="M-100,200 L900,400" stroke="#1e3a5f" strokeWidth="8" fill="none" />
          
          {/* Noms des quartiers */}
          <g fill="#475569" fontSize="18" fontWeight="bold" fontFamily="sans-serif" letterSpacing="2" opacity="0.4">
            <text x="150" y="80">MÉDINA</text>
            <text x="500" y="80">PLATEAU</text>
            <text x="120" y="350">FANN</text>
            <text x="450" y="320">POINT E</text>
            <text x="700" y="150">MERMOZ</text>
            <text x="850" y="350">ALMADIES</text>
          </g>
          
          {/* Itinéraire Chauffeur -> Client */}
          <path id="pickupRoute" d="M300,-50 L350,150 L450,180 L550,220 L650,250" stroke="#1d4ed8" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.4"/>
          <path d="M300,-50 L350,150 L450,180 L550,220 L650,250" stroke="url(#routeGrad)" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="10 6">
            <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1s" repeatCount="indefinite" />
          </path>

          <defs>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Position du client (Point de RDV) */}
          <g transform="translate(650, 250)">
            <circle cx="0" cy="0" r="14" fill="#22c55e" opacity="0.3">
              <animate attributeName="r" values="14;28;14" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="0" cy="0" r="6" fill="#22c55e" filter="url(#glow)"/>
            <circle cx="0" cy="0" r="3" fill="#fff" />
            <path d="M-8,-20 C-8,-25 8,-25 8,-20 L0,-5 Z" fill="#22c55e"/>
            <rect x="-35" y="-45" width="70" height="20" rx="10" fill="#0f172a" opacity="0.9" />
            <text x="0" y="-31" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Point E</text>
          </g>

          {/* Position du véhicule en mouvement le long du chemin */}
          <g filter="url(#glow)">
            <animateMotion dur="8s" repeatCount="indefinite" rotate="auto" path="M300,-50 L350,150 L450,180 L550,220 L650,250" />
            {/* Icône du bus/voiture vu de haut */}
            <rect x="-15" y="-8" width="30" height="16" rx="4" fill="#f97316" />
            <rect x="-10" y="-6" width="6" height="12" rx="1" fill="#fff" opacity="0.8" />
            <rect x="5" y="-6" width="6" height="12" rx="1" fill="#fff" opacity="0.8" />
          </g>
        </svg>

        {/* Overlay infos en bas */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0B0F19]/95 to-transparent pt-12 pb-4 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-semibold text-white">Données GPS chiffrées de bout en bout</span>
          </div>
          <div className="flex gap-2">
            <button className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full border border-slate-700 transition-colors shadow-lg">
              <Navigation className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

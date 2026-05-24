'use client';
import React, { useState } from 'react';
import { Navigation, MapPin, Phone, MessageSquare, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function SectionLocalisation() {
  const [eta] = useState('3 min');
  const [distance] = useState('1.2 km');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Navigation className="w-5 h-5 text-orange-400" /> Récupération Client</h2>
        <span className="bg-orange-500/10 text-orange-400 px-3 py-1.5 rounded-xl text-xs font-bold border border-orange-500/20 animate-pulse">EN APPROCHE</span>
      </div>

      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Destination</p>
            <h3 className="text-xl font-bold text-white">Point de rendez-vous</h3>
            <p className="text-sm text-slate-300 flex items-center gap-1 mt-1"><MapPin className="w-4 h-4 text-orange-400" /> Mermoz, Dakar</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-orange-400">{eta}</p>
            <p className="text-sm text-slate-400">{distance}</p>
          </div>
        </div>
      </div>

      {/* Carte SVG Interactive Mockup */}
      <div className="relative h-96 bg-gradient-to-br from-[#0d1b2a] via-[#0f2233] to-[#0a1520] border border-slate-700/60 rounded-3xl overflow-hidden shadow-xl">
        {/* Grille urbaine */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="#94a3b8" strokeWidth="0.5"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
          {/* Rues */}
          <path d="M-100,100 L900,200" stroke="#1e3a5f" strokeWidth="12" fill="none" />
          <path d="M-100,300 L900,100" stroke="#1e3a5f" strokeWidth="8" fill="none" />
          <path d="M300,-100 L400,500" stroke="#1e3a5f" strokeWidth="16" fill="none" />
          <path d="M600,-100 L500,500" stroke="#1e3a5f" strokeWidth="10" fill="none" />
          
          {/* Itinéraire Chauffeur -> Client */}
          <path id="pickupRoute" d="M300,-50 L350,150 L450,180 L550,220 L650,250" stroke="#1d4ed8" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.4"/>
          <path d="M300,-50 L350,150 L450,180 L550,220 L650,250" stroke="url(#routeGrad)" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="10 6">
            <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1s" repeatCount="indefinite" />
          </path>

          <defs>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#22c55e" /><stop offset="100%" stopColor="#f97316" /></linearGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="4" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>

          {/* Client Point */}
          <g transform="translate(650, 250)">
            <circle cx="0" cy="0" r="14" fill="#22c55e" opacity="0.3"><animate attributeName="r" values="14;28;14" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite"/></circle>
            <circle cx="0" cy="0" r="6" fill="#22c55e" filter="url(#glow)"/><circle cx="0" cy="0" r="3" fill="#fff" />
            <path d="M-8,-20 C-8,-25 8,-25 8,-20 L0,-5 Z" fill="#22c55e"/>
            <rect x="-35" y="-45" width="70" height="20" rx="10" fill="#0f172a" opacity="0.9" />
            <text x="0" y="-31" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Client (Fatou)</text>
          </g>

          {/* Véhicule en mouvement */}
          <g filter="url(#glow)">
            <animateMotion dur="8s" repeatCount="indefinite" rotate="auto" path="M300,-50 L350,150 L450,180 L550,220 L650,250" />
            <rect x="-15" y="-8" width="30" height="16" rx="4" fill="#f97316" />
            <rect x="-10" y="-6" width="6" height="12" rx="1" fill="#fff" opacity="0.8" /><rect x="5" y="-6" width="6" height="12" rx="1" fill="#fff" opacity="0.8" />
          </g>
        </svg>

        <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
           <div className="bg-slate-900/80 backdrop-blur border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-2">
             <ShieldCheck className="w-4 h-4 text-emerald-400" />
             <span className="text-xs font-semibold text-white">Trajet sécurisé</span>
           </div>
           <button className="bg-slate-900/80 backdrop-blur border border-slate-700 w-10 h-10 flex items-center justify-center rounded-xl pointer-events-auto hover:bg-slate-800 transition-colors">
             <AlertTriangle className="w-5 h-5 text-amber-400" />
           </button>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex gap-3 pointer-events-auto">
          <button 
            onClick={() => window.open('https://www.google.com/maps/dir/?api=1&destination=Mermoz,+Dakar', '_blank')}
            className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-2xl transition-colors shadow-lg shadow-orange-500/20 text-sm flex justify-center items-center gap-2"
          >
            <Navigation className="w-4 h-4" /> Démarrer Navigation
          </button>
        </div>
      </div>

      {/* Actions Client */}
      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-bold text-lg">F</div>
          <div>
            <p className="font-bold text-white">Fatou Diop</p>
            <p className="text-xs text-slate-400">Passager • Paiement Wave</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl flex items-center justify-center text-white transition-colors"><MessageSquare className="w-4 h-4" /></button>
          <button className="w-10 h-10 bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 transition-colors"><Phone className="w-4 h-4" /></button>
        </div>
      </div>

    </div>
  );
}

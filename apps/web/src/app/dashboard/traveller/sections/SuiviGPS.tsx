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
      <div 
        className="relative h-80 border border-slate-700/60 rounded-3xl overflow-hidden shadow-xl"
        style={{ backgroundImage: "url('/dakar-map-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Overlay sombre pour la lisibilité */}
        <div className="absolute inset-0 bg-[#0a1520]/50 mix-blend-multiply pointer-events-none" />

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

        {/* Intégration Google Maps - Itinéraire du Chauffeur vers le Client */}
        <iframe 
          src="https://maps.google.com/maps?saddr=Avenue+Cheikh+Anta+Diop,+Dakar,+Senegal&daddr=Point+E,+Dakar,+Senegal&output=embed" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={false} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 z-0 opacity-80"
        ></iframe>

        {/* Animation du Véhicule en temps réel (Superposée sur la carte) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Position du véhicule en mouvement */}
          <g filter="url(#glow)">
            <animateMotion dur="15s" repeatCount="indefinite" rotate="auto" path="M100,50 L250,120 L450,180 L550,220 L700,280" />
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

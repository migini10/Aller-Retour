'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Navigation, AlertTriangle, Battery, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DriverNavigationApp() {
  const router = useRouter();
  const [time, setTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[100dvh] w-full bg-[#0a1520] flex flex-col overflow-hidden relative">
      
      {/* Top Bar Navigation (Overlay) */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#0a1520] to-transparent pt-4 pb-8 px-4 flex items-start justify-between pointer-events-none">
        <button 
          onClick={() => router.back()}
          className="w-12 h-12 bg-slate-900/90 backdrop-blur-xl border border-slate-700 rounded-full flex items-center justify-center text-white shadow-xl shadow-black/50 pointer-events-auto hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 rounded-full px-4 py-2 flex items-center gap-3 shadow-xl pointer-events-auto">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-white font-bold text-sm tracking-widest">{time}</span>
          <div className="w-px h-4 bg-slate-700" />
          <Battery className="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      {/* Custom Integrated Native Map (Replaces iframe to guarantee NO external links) */}
      <div 
        className="flex-1 w-full relative overflow-hidden"
        style={{ backgroundImage: "url('/dakar-map-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-[#0a1520]/60 mix-blend-multiply pointer-events-none" />
        
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="routeGradNav" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <filter id="glowMap">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Route Line */}
          <path id="mainRoute" d="M200,700 L300,500 L500,450 L700,200 L850,100" stroke="#1e293b" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.6" />
          <path d="M200,700 L300,500 L500,450 L700,200 L850,100" stroke="url(#routeGradNav)" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray="16 12">
             <animate attributeName="stroke-dashoffset" from="28" to="0" dur="1s" repeatCount="indefinite" />
          </path>

          {/* Destination Point (Saint-Louis) */}
          <g transform="translate(850, 100)">
            <circle cx="0" cy="0" r="24" fill="#f97316" opacity="0.2">
              <animate attributeName="r" values="24;48;24" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="0" cy="0" r="10" fill="#f97316" filter="url(#glowMap)" />
            <circle cx="0" cy="0" r="4" fill="#fff" />
            <rect x="-60" y="-45" width="120" height="24" rx="8" fill="#101728" opacity="0.9" />
            <text x="0" y="-29" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">Saint-Louis (Arrivée)</text>
          </g>

          {/* Current Vehicle Position */}
          <g filter="url(#glowMap)">
            <animateMotion dur="15s" repeatCount="indefinite" rotate="auto" path="M200,700 L300,500 L500,450 L700,200 L850,100" />
            {/* Nav Arrow / Vehicle */}
            <path d="M-15,-10 L15,0 L-15,10 L-8,0 Z" fill="#22c55e" />
          </g>

          {/* Next Turn Instruction Bubble on Map */}
          <g transform="translate(450, 400)">
            <rect x="-80" y="-30" width="160" height="40" rx="20" fill="#050A15" opacity="0.8" />
            <path d="M-60,-10 L-50,-20 L-50,-10 Z" fill="#22c55e" />
            <text x="10" y="-5" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">Dans 500m</text>
          </g>
        </svg>

        {/* Floating Turn-by-Turn Instruction */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-[#101728]/95 backdrop-blur-xl border border-emerald-500/40 rounded-3xl p-4 shadow-2xl flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 shrink-0">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
          </div>
          <div>
            <p className="text-3xl font-black text-white">500 m</p>
            <p className="text-sm text-slate-300 font-bold">Prendre la sortie N2 vers Thiès</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Dashboard (Overlay) */}
      <div className="absolute bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
        <div className="bg-[#101728]/95 backdrop-blur-2xl border border-slate-700 shadow-2xl rounded-3xl p-5 w-full max-w-md mx-auto pointer-events-auto flex flex-col gap-4">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl font-black text-white">Saint-Louis</h2>
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mt-1">Via Autoroute à Péage</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-emerald-400">3 h 15</p>
              <p className="text-slate-400 text-sm font-bold">265 km • Arrivée 14:30</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold py-4 rounded-2xl transition-colors border border-red-500/20 text-sm flex justify-center items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Signaler Danger
            </button>
            <button 
              onClick={() => router.back()}
              className="w-1/3 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-2xl transition-colors border border-slate-700 text-sm flex justify-center items-center"
            >
              Quitter
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}

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

      {/* Google Maps Integration iframe */}
      <div className="flex-1 w-full bg-slate-800">
        <iframe 
          width="100%" 
          height="100%" 
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          // We use standard maps embed URL with source and destination parameters.
          // Note: Full turn-by-turn navigation in a web iframe isn't fully supported by Google Maps without user launching the native app, 
          // but this shows the embedded route map dynamically within our app.
          src="https://maps.google.com/maps?saddr=Mermoz,+Dakar,+Senegal&daddr=Saint-Louis,+Senegal&output=embed"
        />
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

'use client';
import React from 'react';
import { BarChart3, TrendingUp, Users, MapPin } from 'lucide-react';

export default function SectionAnalytics() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2"><BarChart3 className="w-5 h-5 text-orange-400" /> Analytics & Performances</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lignes Populaires */}
        <div className="bg-[#141414] border border-[#2A2A2A]/80 rounded-3xl p-6">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-400" /> Top Lignes (Mensuel)</h3>
          <div className="space-y-5">
            {[
              { route: 'Dakar → Touba', val: 85, rev: '1.2M F' },
              { route: 'Dakar → Saint-Louis', val: 60, rev: '850K F' },
              { route: 'Thiès → Dakar', val: 40, rev: '400K F' },
            ].map((r, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-slate-200">{r.route}</span>
                  <span className="font-bold text-emerald-400">{r.rev}</span>
                </div>
                <div className="w-full h-2 bg-[#222222] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full" style={{ width: `${r.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performances Taux de Remplissage */}
        <div className="bg-[#141414] border border-[#2A2A2A]/80 rounded-3xl p-6">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Users className="w-4 h-4 text-emerald-400" /> Taux de Remplissage</h3>
          <div className="flex items-center justify-center h-40 relative">
            {/* Simple CSS Circle logic simulation */}
            <svg viewBox="0 0 36 36" className="w-40 h-40 text-orange-500">
              <path className="text-slate-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-orange-500" strokeWidth="3" strokeDasharray="86, 100" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">86%</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Moyenne</span>
            </div>
          </div>
          <p className="text-center text-sm text-slate-400 mt-4">Votre flotte est optimisée. Vous perdez moins de 15% de places à vide.</p>
        </div>
      </div>
    </div>
  );
}

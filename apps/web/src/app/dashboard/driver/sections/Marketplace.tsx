'use client';
import React from 'react';
import { Store, MapPin, Search, Calendar, ChevronRight } from 'lucide-react';

const missionsDispo = [
  { id: 'M-104', trajet: 'Dakar → Saint-Louis', depart: 'Demain, 07:00', distance: '260 km', passagers: 4, remuneration: '18 000 FCFA', transporteur: 'Sénégal Express', urgent: true },
  { id: 'M-105', trajet: 'Thiès → Dakar', depart: 'Aujourd\'hui, 16:00', distance: '70 km', passagers: 3, remuneration: '7 500 FCFA', transporteur: 'Indépendant', urgent: false },
  { id: 'M-106', trajet: 'Dakar → Mbour', depart: 'Samedi, 09:00', distance: '85 km', passagers: 7, remuneration: '12 000 FCFA', transporteur: 'Allo Voyage', urgent: false },
];

export default function SectionMarketplace() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors"><Store className="w-5 h-5 text-orange-500 dark:text-orange-400" /> Marketplace Missions</h2>
        <div className="flex gap-2 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333333] rounded-xl px-3 py-2 items-center flex-1 max-w-sm transition-colors">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
          <input placeholder="Chercher trajet, ville..." className="bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white w-full placeholder:text-slate-400 dark:placeholder:text-slate-500" />
        </div>
      </div>

      <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4 flex items-start gap-4">
        <div className="bg-orange-500/20 p-2 rounded-xl text-orange-400 shrink-0">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-orange-600 dark:text-orange-400">Recherche Active</p>
          <p className="text-xs text-orange-900/70 dark:text-slate-300 mt-1 transition-colors">Vous recevrez des alertes pour les missions à moins de 15km de votre position actuelle (Dakar).</p>
        </div>
      </div>

      <div className="space-y-4">
        {missionsDispo.map(m => (
          <div key={m.id} className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A]/80 hover:border-orange-500/30 rounded-2xl p-5 transition-colors group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {m.urgent && <span className="bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">Urgent</span>}
                  <span className="text-xs text-slate-500 font-mono">Mission {m.id}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 transition-colors">• {m.transporteur}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors">{m.trajet}</h3>
                <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400 transition-colors">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {m.depart}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {m.distance}</span>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-none border-slate-200 dark:border-[#2A2A2A] transition-colors">
                <div className="text-left md:text-right">
                  <p className="text-xs text-slate-500 mb-0.5">Rémunération</p>
                  <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{m.remuneration}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-slate-100 dark:bg-[#222222] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white text-xs font-semibold rounded-xl transition-colors">Ignorer</button>
                  <button className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-1">Accepter <ChevronRight className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

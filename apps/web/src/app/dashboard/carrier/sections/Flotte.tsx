'use client';
import React from 'react';
import { Bus, Settings, ShieldCheck, AlertTriangle, Plus, PenTool } from 'lucide-react';

const flotte = [
  { id: 'DK-456-CD', type: 'Bus Longue Distance', places: 50, annee: 2021, etat: 'Opérationnel', assurance: 'Valide', ct: 'Valide' },
  { id: 'AA-123-BB', type: 'Minibus Climatisé', places: 15, annee: 2019, etat: 'En maintenance', assurance: 'Valide', ct: 'Expiré Bientôt' },
  { id: 'TH-789-EF', type: 'Taxi 7 Places', places: 7, annee: 2018, etat: 'Opérationnel', assurance: 'Valide', ct: 'Valide' },
  { id: 'SL-321-GH', type: 'Bus Express', places: 45, annee: 2023, etat: 'Opérationnel', assurance: 'Expiré', ct: 'Valide' },
];

export default function SectionFlotte() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Bus className="w-5 h-5 text-orange-400" /> Gestion de la Flotte</h2>
        <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-xl text-sm transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouveau Véhicule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {flotte.map(v => (
          <div key={v.id} className="bg-[#101728] border border-slate-800/80 hover:border-orange-500/30 rounded-2xl p-5 transition-colors flex flex-col justify-between h-full group">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${v.etat === 'Opérationnel' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  <Bus className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase border ${v.etat === 'Opérationnel' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>{v.etat}</span>
                  <span className="font-mono text-xs font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">{v.id}</span>
                </div>
              </div>
              <h3 className="font-bold text-white text-lg">{v.type}</h3>
              <p className="text-xs text-slate-400 mt-1">{v.places} Places • Année {v.annee}</p>
            </div>
            
            <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <ShieldCheck className={`w-4 h-4 ${v.assurance === 'Valide' ? 'text-emerald-400' : 'text-rose-400'}`} />
                  <span className="text-slate-400">Assurance</span>
                </div>
                <span className={`text-xs font-bold ${v.assurance === 'Valide' ? 'text-emerald-400' : 'text-rose-400'}`}>{v.assurance}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <Settings className={`w-4 h-4 ${v.ct === 'Valide' ? 'text-emerald-400' : v.ct === 'Expiré Bientôt' ? 'text-amber-400' : 'text-rose-400'}`} />
                  <span className="text-slate-400">Visite Technique</span>
                </div>
                <span className={`text-xs font-bold ${v.ct === 'Valide' ? 'text-emerald-400' : v.ct === 'Expiré Bientôt' ? 'text-amber-400' : 'text-rose-400'}`}>{v.ct}</span>
              </div>
            </div>

            <button className="mt-5 w-full bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-semibold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 focus:opacity-100">
              <PenTool className="w-3.5 h-3.5" /> Gérer véhicule
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

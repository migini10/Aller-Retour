'use client';
import React, { useState } from 'react';
import { Route, Clock, AlertTriangle, CheckCircle2, ChevronRight, Bus } from 'lucide-react';

const departs = [
  { id: 'TRIP-402', dest: 'Touba', time: '14:30', realTime: '14:30', bus: 'Bus 50 Places (AA-123-BB)', chauffeur: 'Moussa Ndiaye', places: 50, statut: 'Embarquement' },
  { id: 'TRIP-403', dest: 'Saint-Louis', time: '15:00', realTime: '15:00', bus: 'Minibus Climatisé (DK-456)', chauffeur: 'Amadou Sow', places: 15, statut: 'Prêt' },
  { id: 'TRIP-399', dest: 'Thiès', time: '13:45', realTime: '14:15', bus: 'Taxi 7 Places (TH-789)', chauffeur: 'Ousmane Diop', places: 7, statut: 'En cours', retard: '+30m' },
];

export default function SectionDeparts() {
  const [tab, setTab] = useState('Aujourd\'hui');

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2"><Route className="w-5 h-5 text-indigo-400" /> Gestion des Départs</h2>

      <div className="flex gap-2 flex-wrap mb-6">
        {['Aujourd\'hui', 'En cours', 'Retards', 'Historique'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${tab === t ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {departs.map(d => (
          <div key={d.id} className="bg-[#101728] border border-slate-800/80 rounded-2xl p-5 hover:border-indigo-500/30 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                {/* Heure */}
                <div className="text-center">
                  <p className={`text-2xl font-bold ${d.retard ? 'text-rose-400 line-through opacity-70' : 'text-white'}`}>{d.time}</p>
                  {d.retard && <p className="text-xl font-bold text-amber-400">{d.realTime}</p>}
                </div>
                
                {/* Ligne */}
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <div className="w-1 h-8 bg-slate-700" />
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                </div>

                {/* Infos */}
                <div>
                  <h3 className="text-xl font-bold text-white">Dakar → {d.dest}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-slate-400 font-mono font-bold bg-slate-800 px-2 py-1 rounded">{d.id}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1"><Bus className="w-3.5 h-3.5" /> {d.bus}</span>
                  </div>
                </div>
              </div>

              {/* Statut & Actions */}
              <div className="flex flex-col items-end gap-3 border-t md:border-none border-slate-800 pt-4 md:pt-0">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase border 
                  ${d.statut === 'Embarquement' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20 animate-pulse' : 
                    d.statut === 'Prêt' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                    'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                  {d.statut === 'Embarquement' && <Clock className="w-3.5 h-3.5" />}
                  {d.statut === 'Prêt' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {d.statut === 'En cours' && <Route className="w-3.5 h-3.5" />}
                  {d.statut}
                </span>

                <div className="flex gap-2">
                  <button className="bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-xl text-xs transition-colors">Retard/Alerte</button>
                  <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-xl text-xs transition-colors flex items-center gap-1">Gérer <ChevronRight className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

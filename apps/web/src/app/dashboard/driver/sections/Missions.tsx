'use client';
import React, { useState } from 'react';
import { Route, Clock, Play, CheckCircle2, AlertTriangle, MessageSquare, MapPin } from 'lucide-react';

const missions = [
  { id: 'TRIP-402', trajet: 'Dakar → Touba', date: 'Aujourd\'hui', heure: '14:30', vehicule: 'Bus 50 Places', statut: 'à venir', passagers: 45 },
  { id: 'TRIP-398', trajet: 'Thiès → Dakar', date: 'Aujourd\'hui', heure: '08:00', vehicule: 'Bus 50 Places', statut: 'terminé', passagers: 48 },
  { id: 'TRIP-405', trajet: 'Dakar → Saint-Louis', date: 'Demain', heure: '07:00', vehicule: 'Bus 50 Places', statut: 'programmé', passagers: 22 },
];

const tabs = ['Toutes', 'Aujourd\'hui', 'Programmées', 'Historique'];

const statutStyle: Record<string, string> = {
  'à venir': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'terminé': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'programmé': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'en cours': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

export default function SectionMissions() {
  const [tab, setTab] = useState('Toutes');

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2"><Route className="w-5 h-5 text-orange-400" /> Mes Missions & Trajets</h2>
      
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${tab === t ? 'bg-orange-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {missions.map(m => (
          <div key={m.id} className="bg-[#101728] border border-slate-800/80 hover:border-orange-500/30 rounded-2xl p-5 transition-colors space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-500">{m.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-lg border font-bold ${statutStyle[m.statut]}`}>{m.statut}</span>
                </div>
                <p className="font-bold text-white text-lg">{m.trajet}</p>
                <p className="text-sm text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {m.date} à {m.heure}</p>
                <p className="text-xs text-slate-500">{m.vehicule} • {m.passagers} passagers prévus</p>
              </div>
              
              <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                {m.statut === 'à venir' && (
                  <button 
                    onClick={() => window.location.hash = 'localisation'}
                    className="flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" /> Démarrer trajet
                  </button>
                )}
                {m.statut === 'en cours' && (
                  <button className="flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Terminer trajet
                  </button>
                )}
                <button className="flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 transition-colors">
                  <MapPin className="w-3.5 h-3.5" /> Voir détails
                </button>
                {(m.statut === 'à venir' || m.statut === 'en cours') && (
                  <button className="flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700 transition-colors">
                    <AlertTriangle className="w-3.5 h-3.5" /> Signaler incident
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

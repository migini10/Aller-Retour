'use client';
import React from 'react';
import { MapPin, Navigation, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

const etapes = [
  { nom: 'Dakar (Gare Routière Pompiers)', heure: '08:00', statut: 'passé' },
  { nom: 'Thiès', heure: '09:30', statut: 'passé' },
  { nom: 'Diourbel', heure: '11:00', statut: 'actuel' },
  { nom: 'Touba (Gare Centrale)', heure: '13:30', statut: 'à venir' },
];

export default function SectionSuiviGPS() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2"><Navigation className="w-5 h-5 text-orange-400" /> Suivi Voyage en Temps Réel</h2>

      {/* Info carte */}
      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-slate-400">Trajet</p>
            <p className="text-sm font-bold text-white mt-0.5">Dakar → Touba</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Position actuelle</p>
            <p className="text-sm font-bold text-orange-400 mt-0.5 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" /> Diourbel</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Arrivée estimée</p>
            <p className="text-sm font-bold text-white mt-0.5 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-orange-400" /> 13:45 (+15 min)</p>
          </div>
        </div>

        {/* Alerte retard */}
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-xs text-amber-300 font-semibold">Retard de 15 minutes signalé — embouteillage à Diourbel.</p>
        </div>
      </div>

      {/* Carte placeholder */}
      <div className="relative h-64 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-80" />
        {/* Faux tracé GPS */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 250" preserveAspectRatio="none">
          <path d="M40,200 Q100,180 140,150 Q200,100 240,90 Q300,80 360,60" stroke="#f97316" strokeWidth="2.5" strokeDasharray="6 3" fill="none" opacity="0.6" />
          <circle cx="240" cy="90" r="6" fill="#f97316" />
          <circle cx="240" cy="90" r="12" fill="#f97316" fillOpacity="0.25" />
        </svg>
        <div className="relative z-10 text-center">
          <MapPin className="w-8 h-8 text-orange-400 mx-auto mb-2" />
          <p className="text-xs text-slate-400">Carte interactive disponible après intégration</p>
          <p className="text-xs text-slate-500">react-leaflet · mapbox-gl</p>
        </div>
      </div>

      {/* Étapes */}
      <div className="space-y-3">
        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Progression du trajet</p>
        <div className="relative">
          {etapes.map((e, i) => (
            <div key={i} className="flex items-start gap-4 mb-4 last:mb-0">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${e.statut === 'passé' ? 'bg-emerald-500/20 text-emerald-400' : e.statut === 'actuel' ? 'bg-orange-500/30 text-orange-400 ring-2 ring-orange-500/50' : 'bg-slate-800 text-slate-600'}`}>
                  {e.statut === 'passé' ? <CheckCircle2 className="w-4 h-4" /> : e.statut === 'actuel' ? <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" /> : <MapPin className="w-4 h-4" />}
                </div>
                {i < etapes.length - 1 && <div className={`w-0.5 h-8 mt-1 ${e.statut === 'passé' ? 'bg-emerald-500/40' : 'bg-slate-800'}`} />}
              </div>
              <div className="pt-1">
                <p className={`text-sm font-semibold ${e.statut === 'passé' ? 'text-slate-400' : e.statut === 'actuel' ? 'text-orange-400' : 'text-slate-500'}`}>{e.nom}</p>
                <p className="text-xs text-slate-600 mt-0.5">{e.heure}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

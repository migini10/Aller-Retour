'use client';
import React, { useState } from 'react';
import { Route, MapPin, Calendar, Users, DollarSign, Clock, CheckCircle2, AlertTriangle, Plus, Bus } from 'lucide-react';

const trajets = [
  { id: 'TRIP-402', dep: 'Dakar', arr: 'Touba', horaire: '14:30', vehicule: 'Bus 50 Places', chauffeur: 'Moussa Ndiaye', prix: '7000', places: 50, resv: 45, statut: 'Embarquement' },
  { id: 'TRIP-403', dep: 'Saint-Louis', arr: 'Dakar', horaire: '16:00', vehicule: 'Minibus Climatisé', chauffeur: 'Abdoulaye Sow', prix: '8500', places: 15, resv: 15, statut: 'Programmé' },
  { id: 'TRIP-404', dep: 'Dakar', arr: 'Thiès', horaire: '18:00', vehicule: 'Taxi 7 Places', chauffeur: 'Ousmane Diop', prix: '3000', places: 7, resv: 2, statut: 'Programmé' },
];

export default function SectionTrajets() {
  const [tab, setTab] = useState('Actifs');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Route className="w-5 h-5 text-orange-400" /> Planification Trajets</h2>
        <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-xl text-sm transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouveau Trajet
        </button>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {['Actifs', 'Brouillons', 'Historique', 'Modèles'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${tab === t ? 'bg-orange-600 text-white' : 'bg-[#1A1A1A] text-slate-400 hover:text-white border border-[#2A2A2A]'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {trajets.map(t => (
          <div key={t.id} className="bg-[#141414] border border-[#2A2A2A]/80 hover:border-orange-500/30 rounded-2xl p-5 transition-colors space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold bg-[#222222] text-slate-300 px-2 py-0.5 rounded">{t.id}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase border ${t.statut === 'Embarquement' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}>{t.statut}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="w-0.5 h-6 bg-slate-700" />
                    <span className="w-3 h-3 rounded-full bg-orange-500" />
                  </div>
                  <div className="flex flex-col justify-between h-12">
                    <p className="font-bold text-white text-sm">{t.dep} <span className="text-slate-500 text-xs font-normal ml-2">Aujourd'hui, {t.horaire}</span></p>
                    <p className="font-bold text-white text-sm">{t.arr}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 pt-3 border-t border-[#2A2A2A]/80 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {t.resv}/{t.places} Réservés</span>
                  <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> {t.prix} FCFA/place</span>
                  <span className="flex items-center gap-1.5"><Bus className="w-3.5 h-3.5" /> {t.vehicule}</span>
                  <span className="flex items-center gap-1.5 text-orange-400 font-semibold"><CheckCircle2 className="w-3.5 h-3.5" /> {t.chauffeur}</span>
                </div>
              </div>

              <div className="shrink-0 flex flex-row md:flex-col gap-2">
                <button className="flex-1 bg-[#1A1A1A] border border-[#333333] hover:bg-[#222222] text-white font-semibold py-2 px-4 rounded-xl text-xs transition-colors">Modifier</button>
                <button className="flex-1 bg-[#1A1A1A] border border-[#333333] hover:bg-[#222222] text-white font-semibold py-2 px-4 rounded-xl text-xs transition-colors">Manifeste</button>
                <button className="flex-1 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 font-semibold py-2 px-4 rounded-xl text-xs transition-colors border border-rose-500/20">Annuler</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

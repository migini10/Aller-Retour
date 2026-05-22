'use client';
import React, { useState } from 'react';
import { Users, UserPlus, Star, MapPin, Bus, MoreVertical, Filter, CheckCircle2 } from 'lucide-react';

const chauffeurs = [
  { id: 'CH-101', nom: 'Moussa Ndiaye', statut: 'En ligne', type: 'Affilié', vehicule: 'Toyota Hiace (AA-123-BB)', rating: 4.9, courses: 342 },
  { id: 'CH-102', nom: 'Abdoulaye Sow', statut: 'En trajet', type: 'Affilié', vehicule: 'Bus 50 Places (DK-456-CD)', rating: 4.7, courses: 890 },
  { id: 'CH-105', nom: 'Cheikh Fall', statut: 'Hors ligne', type: 'Affilié', vehicule: 'Non assigné', rating: 4.8, courses: 120 },
  { id: 'CH-204', nom: 'Ousmane Diop', statut: 'Disponible', type: 'Indépendant', vehicule: 'Taxi 7 Places (TH-789-EF)', rating: 4.5, courses: 45 },
];

const statutColors: Record<string, string> = {
  'En ligne': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'En trajet': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Disponible': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Hors ligne': 'bg-slate-800 text-slate-400 border-slate-700',
};

export default function SectionChauffeurs() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Users className="w-5 h-5 text-indigo-400" /> Flotte de Chauffeurs</h2>
        <div className="flex gap-2">
          <button className="bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-xl text-sm transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filtrer
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl text-sm transition-colors flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Ajouter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#101728] border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400"><Users className="w-6 h-6" /></div>
          <div><p className="text-2xl font-bold text-white">45</p><p className="text-xs text-slate-400">Total Chauffeurs</p></div>
        </div>
        <div className="bg-[#101728] border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-400"><MapPin className="w-6 h-6" /></div>
          <div><p className="text-2xl font-bold text-white">12</p><p className="text-xs text-slate-400">En Trajet Actif</p></div>
        </div>
        <div className="bg-[#101728] border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400"><CheckCircle2 className="w-6 h-6" /></div>
          <div><p className="text-2xl font-bold text-white">18</p><p className="text-xs text-slate-400">Disponibles</p></div>
        </div>
      </div>

      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-4 pl-6 font-semibold">Chauffeur</th>
                <th className="py-4 font-semibold">Statut</th>
                <th className="py-4 font-semibold">Type</th>
                <th className="py-4 font-semibold">Véhicule Assigné</th>
                <th className="py-4 font-semibold">Performance</th>
                <th className="py-4 pr-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {chauffeurs.map(c => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden shrink-0 hidden sm:block">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.nom}`} alt={c.nom} />
                      </div>
                      <div>
                        <p className="font-bold text-white">{c.nom}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{c.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold border ${statutColors[c.statut]}`}>{c.statut}</span>
                  </td>
                  <td className="py-4">
                    <span className="text-xs text-slate-300 font-medium bg-slate-800 px-2 py-1 rounded">{c.type}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <Bus className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-300 text-xs font-medium">{c.vehicule}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-sm font-bold text-white"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {c.rating}</span>
                      <span className="text-[10px] text-slate-500">({c.courses} trajets)</span>
                    </div>
                  </td>
                  <td className="py-4 pr-6 text-right">
                    <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

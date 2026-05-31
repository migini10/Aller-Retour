'use client';
import React from 'react';
import { Store, MapPin, Star, UserPlus, Search } from 'lucide-react';

const chauffeursLibres = [
  { id: '1', nom: 'Omar Sy', vehicule: 'Minibus 15 Places', distance: '1.2 km', note: 4.9, tarif: 'Min. 15 000 F/Trajet', badge: 'Vérifié' },
  { id: '2', nom: 'Seydou Kane', vehicule: 'Bus 30 Places', distance: '3.5 km', note: 4.7, tarif: 'Min. 25 000 F/Trajet', badge: 'Vérifié' },
  { id: '3', nom: 'Ibrahima Fall', vehicule: 'Taxi 7 Places', distance: '800 m', note: 4.8, tarif: 'À négocier', badge: 'Nouveau' },
];

export default function SectionMarketplace() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Store className="w-5 h-5 text-orange-400" /> Marketplace Chauffeurs Indépendants</h2>
        <div className="flex gap-2 bg-[#1A1A1A] border border-[#333333] rounded-xl px-3 py-2 items-center flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input placeholder="Chercher par véhicule, ville..." className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-500" />
        </div>
      </div>

      <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4 flex items-start gap-4">
        <div className="bg-orange-500/20 p-2 rounded-xl text-orange-400 shrink-0">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-orange-400">Recherche de proximité activée</p>
          <p className="text-xs text-slate-300 mt-1">Les chauffeurs affichés ci-dessous sont actuellement disponibles et proches de vos gares (Dakar, Thiès).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chauffeursLibres.map(c => (
          <div key={c.id} className="bg-[#141414] border border-[#2A2A2A]/80 hover:border-orange-500/30 rounded-2xl p-5 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-14 h-14 rounded-full bg-[#222222] overflow-hidden shrink-0">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.nom}`} alt={c.nom} />
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${c.badge === 'Vérifié' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>{c.badge}</span>
            </div>
            <h3 className="font-bold text-white text-lg">{c.nom}</h3>
            <p className="text-sm text-slate-400 mt-0.5">{c.vehicule}</p>
            
            <div className="flex flex-wrap gap-2 mt-4 mb-5">
              <span className="bg-[#1A1A1A] border border-[#333333] px-2 py-1 rounded text-xs text-slate-300 flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.distance}</span>
              <span className="bg-[#1A1A1A] border border-[#333333] px-2 py-1 rounded text-xs text-slate-300 flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {c.note}</span>
            </div>

            <div className="pt-4 border-t border-[#2A2A2A]/80 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Tarif indicatif</p>
                <p className="font-bold text-white text-sm mt-0.5">{c.tarif}</p>
              </div>
              <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-orange-500/20">
                <UserPlus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

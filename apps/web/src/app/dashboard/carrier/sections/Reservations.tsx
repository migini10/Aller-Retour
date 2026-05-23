'use client';
import React, { useState } from 'react';
import { Calendar, Filter, MoreHorizontal, User, Tag } from 'lucide-react';

const reservations = [
  { id: 'RES-9982', passager: 'Fatou Diop', trajet: 'Dakar → Touba', date: 'Aujourd\'hui', prix: '7 000 F', statut: 'Payé', methode: 'Wave', voyageId: 'TRIP-402' },
  { id: 'RES-9983', passager: 'Mamadou Ndiaye', trajet: 'Thiès → Dakar', date: 'Aujourd\'hui', prix: '2 500 F', statut: 'Payé', methode: 'Orange Money', voyageId: 'TRIP-398' },
  { id: 'RES-9984', passager: 'Awa Fall', trajet: 'Dakar → Saint-Louis', date: 'Demain', prix: '6 000 F', statut: 'En attente', methode: 'Espèces', voyageId: 'TRIP-405' },
  { id: 'RES-9985', passager: 'Cheikh Sow', trajet: 'Dakar → Mbour', date: '12 Déc', prix: '3 500 F', statut: 'Annulé', methode: 'Wave', voyageId: 'TRIP-406' },
];

export default function SectionReservations() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Calendar className="w-5 h-5 text-orange-400" /> Réservations & Billets</h2>
        <div className="flex gap-2">
          <div className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select className="bg-transparent border-none outline-none text-xs text-white">
              <option>Toutes les dates</option>
              <option>Aujourd'hui</option>
              <option>Cette semaine</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-4 pl-6 font-semibold">ID Réservation</th>
                <th className="py-4 font-semibold">Passager</th>
                <th className="py-4 font-semibold">Trajet & Date</th>
                <th className="py-4 font-semibold">Montant & Paiement</th>
                <th className="py-4 font-semibold">Statut</th>
                <th className="py-4 pr-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {reservations.map(r => (
                <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 pl-6 font-mono text-xs text-slate-300 font-bold">{r.id}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500"><User className="w-4 h-4" /></div>
                      <span className="font-bold text-white">{r.passager}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="font-bold text-white">{r.trajet}</p>
                    <p className="text-xs text-slate-400">{r.date} • <span className="font-mono">{r.voyageId}</span></p>
                  </td>
                  <td className="py-4">
                    <p className="font-bold text-white">{r.prix}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{r.methode}</p>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${r.statut === 'Payé' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : r.statut === 'En attente' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                      {r.statut}
                    </span>
                  </td>
                  <td className="py-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg transition-colors border border-slate-700 font-semibold">Détails</button>
                      <button className="text-slate-400 hover:text-white p-1.5 rounded-lg transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                    </div>
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

'use client';
import React from 'react';
import { Calendar, Search, Filter, Printer, RefreshCw, XCircle } from 'lucide-react';

const res = [
  { id: 'AR-74892374', nom: 'Mamadou Ndiaye', trajet: 'Dakar → Touba', date: 'Aujourd\'hui, 14:30', statut: 'Payé', paiement: 'Wave' },
  { id: 'AR-84512987', nom: 'Fatou Diop', trajet: 'Dakar → Saint-Louis', date: 'Aujourd\'hui, 15:00', statut: 'En attente', paiement: 'Espèces' },
  { id: 'AR-62019384', nom: 'Awa Fall', trajet: 'Dakar → Thiès', date: 'Demain, 08:00', statut: 'Payé', paiement: 'Carte Bancaire' },
];

export default function SectionReservations() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Calendar className="w-5 h-5 text-orange-400" /> Gestion des Réservations</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="N° billet, nom, téléphone..." className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-orange-500" />
          </div>
          <button className="bg-[#1A1A1A] border border-[#333333] hover:bg-[#222222] p-2 rounded-xl text-slate-400 transition-colors"><Filter className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A]/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="bg-[#1A1A1A]/50 border-b border-[#2A2A2A] text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-4 pl-6 font-semibold">N° Billet</th>
                <th className="py-4 font-semibold">Passager</th>
                <th className="py-4 font-semibold">Trajet & Date</th>
                <th className="py-4 font-semibold">Statut</th>
                <th className="py-4 font-semibold">Paiement</th>
                <th className="py-4 pr-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {res.map(r => (
                <tr key={r.id} className="hover:bg-[#222222]/30 transition-colors">
                  <td className="py-4 pl-6 font-mono text-xs text-orange-400 font-bold">{r.id}</td>
                  <td className="py-4 font-bold text-white">{r.nom}</td>
                  <td className="py-4">
                    <p className="font-bold text-white">{r.trajet}</p>
                    <p className="text-xs text-slate-400">{r.date}</p>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase border ${r.statut === 'Payé' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                      {r.statut}
                    </span>
                  </td>
                  <td className="py-4 font-semibold text-slate-300 text-xs">{r.paiement}</td>
                  <td className="py-4 pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 bg-[#222222] hover:bg-slate-700 text-white rounded transition-colors" title="Imprimer"><Printer className="w-4 h-4" /></button>
                      <button className="p-1.5 bg-[#222222] hover:bg-slate-700 text-white rounded transition-colors" title="Modifier/Déplacer"><RefreshCw className="w-4 h-4" /></button>
                      <button className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded transition-colors" title="Annuler"><XCircle className="w-4 h-4" /></button>
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

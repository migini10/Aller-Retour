'use client';
import React from 'react';
import { Users, CheckCircle2, UserX, UserMinus, Search, Bus } from 'lucide-react';

const passagers = [
  { id: '14A', nom: 'Mamadou Ndiaye', billet: 'AR-7489', statut: 'Embarqué', cb: true },
  { id: '14B', nom: 'Awa Fall', billet: 'AR-6201', statut: 'En attente', cb: false },
  { id: '15A', nom: 'Omar Sy', billet: 'AR-9921', statut: 'Absent', cb: false },
  { id: '15B', nom: 'Fatou Diop', billet: 'AR-3382', statut: 'En attente', cb: false },
];

export default function SectionEmbarquement() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><Users className="w-5 h-5 text-orange-400" /> Contrôle d'Embarquement</h2>
          <p className="text-sm text-slate-400 mt-1 flex items-center gap-2"><Bus className="w-4 h-4" /> Dakar → Touba (14:30) • Bus 50 places</p>
        </div>
        <div className="flex items-center gap-4 bg-[#101728] border border-slate-800 p-3 rounded-2xl">
          <div className="text-center px-4 border-r border-slate-800">
            <p className="text-2xl font-bold text-emerald-400">42</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Embarqués</p>
          </div>
          <div className="text-center px-4 border-r border-slate-800">
            <p className="text-2xl font-bold text-amber-400">3</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">En attente</p>
          </div>
          <div className="text-center px-4">
            <p className="text-2xl font-bold text-rose-400">5</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Absents</p>
          </div>
        </div>
      </div>

      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider">Manifeste Passagers</h3>
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Chercher passager, siège..." className="w-full bg-slate-800 border border-slate-700 rounded-lg py-1.5 pl-9 pr-3 text-sm text-white outline-none focus:border-orange-500" />
          </div>
        </div>
        
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
              <th className="py-3 pl-6 font-semibold w-24">Siège</th>
              <th className="py-3 font-semibold">Passager & Billet</th>
              <th className="py-3 font-semibold">Statut</th>
              <th className="py-3 pr-6 font-semibold text-right">Action Rapide</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {passagers.map((p, i) => (
              <tr key={i} className={`hover:bg-slate-800/30 transition-colors ${p.statut === 'Absent' ? 'opacity-50 grayscale' : ''}`}>
                <td className="py-4 pl-6 font-bold text-white text-lg">{p.id}</td>
                <td className="py-4">
                  <p className="font-bold text-white">{p.nom}</p>
                  <p className="text-xs text-orange-400 font-mono mt-0.5">{p.billet}</p>
                </td>
                <td className="py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border 
                    ${p.statut === 'Embarqué' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      p.statut === 'En attente' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                      'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                    {p.statut}
                  </span>
                </td>
                <td className="py-4 pr-6 text-right">
                  {p.statut === 'En attente' && (
                    <div className="flex justify-end gap-2">
                      <button className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg transition-colors" title="Valider Présence"><CheckCircle2 className="w-4 h-4" /></button>
                      <button className="bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 border border-slate-700 p-2 rounded-lg transition-colors" title="Marquer Absent"><UserX className="w-4 h-4" /></button>
                    </div>
                  )}
                  {p.statut === 'Embarqué' && <span className="text-emerald-400 text-xs font-bold flex items-center justify-end gap-1"><CheckCircle2 className="w-4 h-4" /> Contrôlé</span>}
                  {p.statut === 'Absent' && <span className="text-rose-400 text-xs font-bold flex items-center justify-end gap-1"><UserMinus className="w-4 h-4" /> Non présenté</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-[0_0_20px_rgba(79,70,229,0.3)]">
          Clôturer l'embarquement & Autoriser le départ
        </button>
      </div>
    </div>
  );
}

'use client';
import React, { useState } from 'react';
import { HelpCircle, MessageSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function SectionSupport() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><HelpCircle className="w-5 h-5 text-indigo-400" /> Support Central (Niveau 3)</h2>
          <p className="text-sm text-slate-400 mt-1">Gestion des tickets d'escalade des transporteurs et gares.</p>
        </div>
      </div>

      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-4 pl-6 font-semibold">Ticket</th>
                <th className="py-4 font-semibold">Émetteur</th>
                <th className="py-4 font-semibold">Priorité</th>
                <th className="py-4 pr-6 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {[
                { id: 'TKT-042', subject: 'Problème de synchronisation API (Réservations)', from: 'Sénégal Express (IT)', prio: 'Critique' },
                { id: 'TKT-043', subject: 'Scanner QR défectueux', from: 'Gare Baux Maraîchers', prio: 'Haute' },
                { id: 'TKT-044', subject: 'Changement RIB pour reversement', from: 'Allo Transport', prio: 'Normale' },
              ].map(t => (
                <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 pl-6">
                    <p className="font-bold text-white">{t.subject}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{t.id}</p>
                  </td>
                  <td className="py-4 font-medium text-slate-300">{t.from}</td>
                  <td className="py-4">
                    <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase border 
                      ${t.prio === 'Critique' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                        t.prio === 'Haute' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                        'bg-slate-800 text-slate-400 border-slate-700'}`}>
                      {t.prio}
                    </span>
                  </td>
                  <td className="py-4 pr-6 text-right">
                    <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">Répondre</button>
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

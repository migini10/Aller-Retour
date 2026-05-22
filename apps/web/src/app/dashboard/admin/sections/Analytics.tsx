'use client';
import React from 'react';
import { BarChart3, Users, Route, Download, ArrowUpRight } from 'lucide-react';

export default function SectionAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><BarChart3 className="w-5 h-5 text-indigo-400" /> Analytics Plateforme (SaaS)</h2>
          <p className="text-sm text-slate-400 mt-1">Analyse des données d'usage pour la prise de décision.</p>
        </div>
        <button className="bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl text-sm transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" /> Rapport PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Retention Utilisateur */}
        <div className="bg-[#101728] border border-slate-800/80 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-white flex items-center gap-2"><Users className="w-4 h-4 text-emerald-400" /> Rétention Utilisateurs B2C</h3>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20 font-bold">+5% ce mois</span>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Utilisateurs Actifs Quotidiens (DAU)', val: '45,210', perc: 45 },
              { label: 'Utilisateurs Actifs Mensuels (MAU)', val: '124,500', perc: 100 },
              { label: 'Taux de ré-achat (30j)', val: '32%', perc: 32 },
            ].map((d, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-300">{d.label}</span>
                  <span className="font-bold text-white">{d.val}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${d.perc}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lignes les plus rentables */}
        <div className="bg-[#101728] border border-slate-800/80 rounded-3xl p-6">
          <h3 className="font-bold text-white flex items-center gap-2 mb-6"><Route className="w-4 h-4 text-orange-400" /> Top Axes de Transport (Volume GMV)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2">Trajet</th>
                  <th className="py-2">Passagers/Mois</th>
                  <th className="py-2">GMV Généré</th>
                </tr>
              </thead>
              <tbody className="text-sm text-white divide-y divide-slate-800/60">
                {[
                  { route: 'Dakar ↔ Touba', pax: '45k', rev: '315M F' },
                  { route: 'Dakar ↔ Saint-Louis', pax: '28k', rev: '238M F' },
                  { route: 'Dakar ↔ Thiès', pax: '52k', rev: '156M F' },
                ].map((r, i) => (
                  <tr key={i}>
                    <td className="py-3 font-bold">{r.route}</td>
                    <td className="py-3 text-slate-300">{r.pax}</td>
                    <td className="py-3 text-emerald-400 font-bold">{r.rev}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

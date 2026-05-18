'use client';

import React from 'react';
import { ShieldAlert, Building2, CheckCircle2, XCircle, TrendingUp, DollarSign, Server } from 'lucide-react';

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex flex-wrap items-center gap-2">
              Super Admin
              <span className="text-xs uppercase bg-rose-500/20 border border-rose-500/40 text-rose-400 px-2.5 py-1 rounded-lg font-mono">Scope Global</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Supervision des flux séquestres, audits fiscaux d'État et validation KYC des chauffeurs.</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl w-fit">
            <Server className="w-4 h-4 text-orange-400 animate-pulse shrink-0" />
            <span className="font-semibold text-white text-xs">Système Nominal • 0% Erreur</span>
          </div>
        </div>
      </div>

      {/* Financial Stats — 2 colonnes mobile, 4 desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#101728] border border-slate-800/80 border-l-4 border-l-amber-500 p-4 sm:p-5 rounded-2xl">
          <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">Séquestre Total</span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">14 250 000 <span className="text-sm font-bold text-amber-400">FCFA</span></h2>
          <p className="text-xs text-slate-400 mt-1">1 840 trajets en cours</p>
        </div>

        <div className="bg-[#101728] border border-slate-800/80 border-l-4 border-l-orange-500 p-4 sm:p-5 rounded-2xl">
          <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">Trésorerie (5-8%)</span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">2 480 000 <span className="text-sm font-bold text-orange-400">FCFA</span></h2>
          <p className="text-xs text-orange-400 mt-1 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Commissions nettes
          </p>
        </div>

        <div className="bg-[#101728] border border-slate-800/80 border-l-4 border-l-blue-500 p-4 sm:p-5 rounded-2xl">
          <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">Taxes d'État (2-5%)</span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">840 000 <span className="text-sm font-bold text-blue-400">FCFA</span></h2>
          <p className="text-xs text-slate-400 mt-1">Prêt → Trésor Public</p>
        </div>

        <div className="bg-[#101728] border border-slate-800/80 border-l-4 border-l-purple-500 p-4 sm:p-5 rounded-2xl">
          <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">Frais Wave/OM (1%)</span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">285 000 <span className="text-sm font-bold text-purple-400">FCFA</span></h2>
          <p className="text-xs text-slate-400 mt-1">Prélevé automatiquement</p>
        </div>
      </div>

      {/* KYC Table — scrollable sur mobile */}
      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h3 className="text-base font-bold text-white">Vérification KYC Biométrique des Chauffeurs</h3>
          <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/30 w-fit">
            2 dossiers en attente
          </span>
        </div>

        {/* Version carte sur mobile, table sur desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase">
                <th className="pb-3 pl-3">Chauffeur</th>
                <th className="pb-3">Véhicule</th>
                <th className="pb-3">Permis CEDEAO</th>
                <th className="pb-3">Assurance</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-4 pl-3 font-bold text-white">Abdoulaye Ndiaye</td>
                <td className="py-4 text-slate-300 text-xs">Peugeot Boxer #DK-1284-A</td>
                <td className="py-4 text-xs"><span className="text-orange-400 font-mono">SN-982347293</span> ✓</td>
                <td className="py-4 text-xs text-orange-400 font-medium">Valide (Axa Sénégal)</td>
                <td className="py-4 flex gap-2">
                  <button className="bg-orange-600 text-white px-3 py-1.5 rounded-xl font-semibold text-xs hover:bg-orange-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approuver
                  </button>
                  <button className="bg-rose-500/20 text-rose-400 px-3 py-1.5 rounded-xl font-semibold text-xs hover:bg-rose-500/30 flex items-center gap-1 border border-rose-500/30">
                    <XCircle className="w-3.5 h-3.5" /> Rejeter
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Version carte mobile */}
        <div className="sm:hidden space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-bold text-white text-sm">Abdoulaye Ndiaye</p>
                <p className="text-xs text-slate-400 mt-0.5">Peugeot Boxer #DK-1284-A</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">EN ATTENTE</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
              <div>
                <p className="text-slate-400">Permis CEDEAO</p>
                <p className="text-orange-400 font-mono font-bold">SN-982347293 ✓</p>
              </div>
              <div>
                <p className="text-slate-400">Assurance</p>
                <p className="text-orange-400 font-medium">Valide • Axa</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-orange-600 text-white py-2 rounded-xl font-semibold text-xs hover:bg-orange-500 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Approuver
              </button>
              <button className="flex-1 bg-rose-500/20 text-rose-400 py-2 rounded-xl font-semibold text-xs hover:bg-rose-500/30 flex items-center justify-center gap-1 border border-rose-500/30">
                <XCircle className="w-3.5 h-3.5" /> Rejeter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

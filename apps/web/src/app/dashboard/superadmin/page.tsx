'use client';

import React from 'react';
import { ShieldAlert, Building2, UserCheck, CheckCircle2, XCircle, TrendingUp, DollarSign, Database, Server, Lock } from 'lucide-react';

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Super Admin <span className="text-xs uppercase bg-rose-500/20 border border-rose-500/40 text-rose-400 px-3 py-1 rounded-md font-mono">Scope Global</span>
          </h1>
          <p className="text-slate-400 mt-1">Supervision souveraine des flux séquestres, audits fiscaux de l'État et validation des chauffeurs KYC.</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-5 py-2.5 rounded-2xl">
          <Server className="w-5 h-5 text-emerald-400 animate-pulse" />
          <span className="font-bold text-white text-sm">Système Nominal • 0% Erreur de Répartition</span>
        </div>
      </div>

      {/* Financial Settlement Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl border-l-4 border-l-amber-500">
          <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">Total en Séquestre (Escrow)</span>
          <h2 className="text-3xl font-black text-amber-400 mt-2">14 250 000 XOF</h2>
          <p className="text-xs text-slate-400 mt-1">Garantie sur 1 840 trajets en cours</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl border-l-4 border-l-emerald-500">
          <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">Trésorerie Aller-Retour (5-8%)</span>
          <h2 className="text-3xl font-black text-emerald-400 mt-2">2 480 000 XOF</h2>
          <p className="text-xs text-emerald-400 mt-1 font-semibold">Commissions nettes encaissées</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl border-l-4 border-l-blue-500">
          <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">Taxes d'État & Redevances (2-5%)</span>
          <h2 className="text-3xl font-black text-blue-400 mt-2">840 000 XOF</h2>
          <p className="text-xs text-slate-400 mt-1">Prêt pour virement Trésor Public</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl border-l-4 border-l-purple-500">
          <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">Frais Mobile Money (Wave/OM)</span>
          <h2 className="text-3xl font-black text-purple-400 mt-2">285 000 XOF</h2>
          <p className="text-xs text-slate-400 mt-1">1% prélevé automatiquement</p>
        </div>
      </div>

      {/* KYC Driver Approvals Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Vérification Biométrique KYC des Chauffeurs Libres (Marketplace)</h3>
          <span className="px-3 py-1 rounded-md bg-amber-500/20 text-amber-400 text-xs font-semibold">2 dossiers en attente</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase">
                <th className="pb-4 pl-4">Chauffeur</th>
                <th className="pb-4">Véhicule</th>
                <th className="pb-4">Permis CEDEAO</th>
                <th className="pb-4">Assurance & Visite Tech</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-4 pl-4 font-bold text-white">Abdoulaye Ndiaye</td>
                <td className="py-4 text-slate-300">Peugeot Boxer #DK-1284-A</td>
                <td className="py-4"><span className="text-emerald-400 font-mono">SN-982347293</span> (Biométrique OK)</td>
                <td className="py-4"><span className="text-emerald-400">Valide (Axa Sénégal)</span></td>
                <td className="py-4 flex gap-2">
                  <button className="bg-emerald-500 text-slate-950 px-4 py-1.5 rounded-xl font-bold text-xs hover:bg-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Approuver
                  </button>
                  <button className="bg-rose-500/20 text-rose-400 px-4 py-1.5 rounded-xl font-bold text-xs hover:bg-rose-500/30 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Rejeter
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

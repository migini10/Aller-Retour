'use client';

import React from 'react';
import { ShieldAlert, Building2, UserCheck, CheckCircle2, XCircle, TrendingUp, DollarSign, Database, Server, Lock, Wallet } from 'lucide-react';

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Super Admin <span className="text-xs uppercase bg-rose-500/20 border border-rose-500/40 text-rose-400 px-3 py-1 rounded-md font-mono">Scope Global</span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm leading-relaxed">Supervision souveraine des flux séquestres, audits fiscaux de l'État et validation des chauffeurs KYC.</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-5 py-3 rounded-2xl shadow-xl">
          <Server className="w-5 h-5 text-emerald-400 animate-pulse shrink-0" />
          <span className="font-bold text-white text-sm">Système Nominal • 0% Erreur de Répartition</span>
        </div>
      </div>

      {/* Financial Settlement Overview (Cartes Haute Fidélité et Nombres Premium) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl border-l-4 border-l-amber-500 shadow-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Total en Séquestre</span>
            <Wallet className="w-5 h-5 text-amber-400/80" />
          </div>
          <div className="flex items-baseline gap-2 my-2 flex-wrap">
            <span className="text-3xl lg:text-4xl font-black tracking-tight text-amber-400">14 250 000</span>
            <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">XOF</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5 pt-3 border-t border-slate-800/80 font-medium">
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Garantie sur 1 840 trajets en cours
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl border-l-4 border-l-emerald-500 shadow-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Trésorerie SaaS (5-8%)</span>
            <Building2 className="w-5 h-5 text-emerald-400/80" />
          </div>
          <div className="flex items-baseline gap-2 my-2 flex-wrap">
            <span className="text-3xl lg:text-4xl font-black tracking-tight text-emerald-400">2 480 000</span>
            <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">XOF</span>
          </div>
          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1.5 pt-3 border-t border-slate-800/80 font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Commissions nettes encaissées
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl border-l-4 border-l-blue-500 shadow-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Taxes d'État & Gares (2-5%)</span>
            <Database className="w-5 h-5 text-blue-400/80" />
          </div>
          <div className="flex items-baseline gap-2 my-2 flex-wrap">
            <span className="text-3xl lg:text-4xl font-black tracking-tight text-blue-400">840 000</span>
            <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300">XOF</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5 pt-3 border-t border-slate-800/80 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping shrink-0" /> Prêt pour virement Trésor Public
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl border-l-4 border-l-purple-500 shadow-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/10 transition-colors" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Frais Mobile Money</span>
            <DollarSign className="w-5 h-5 text-purple-400/80" />
          </div>
          <div className="flex items-baseline gap-2 my-2 flex-wrap">
            <span className="text-3xl lg:text-4xl font-black tracking-tight text-purple-400">285 000</span>
            <span className="text-xs font-black uppercase px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300">XOF</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5 pt-3 border-t border-slate-800/80 font-medium">
            <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" /> 1% prélevé (Wave / OM)
          </p>
        </div>
      </div>

      {/* KYC Driver Approvals Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800/80">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Vérification Biométrique KYC des Chauffeurs Libres (Marketplace)</h3>
            <p className="text-xs text-slate-400 mt-1">Validation automatique avec les bases CEDEAO et vérification d'assurance en gare.</p>
          </div>
          <span className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            2 dossiers en attente
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="pb-4 pl-4">Chauffeur</th>
                <th className="pb-4">Véhicule</th>
                <th className="pb-4">Permis CEDEAO</th>
                <th className="pb-4">Assurance & Visite Tech</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              <tr className="hover:bg-slate-800/30 transition-colors group">
                <td className="py-5 pl-4 font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold group-hover:scale-105 transition-transform">
                    AN
                  </div>
                  <div>
                    <span>Abdoulaye Ndiaye</span>
                    <span className="block text-xs font-normal text-slate-400">Tel: +221 77 542 19 80</span>
                  </div>
                </td>
                <td className="py-5 text-slate-300 font-medium">Peugeot Boxer <span className="px-2 py-0.5 rounded bg-slate-800 text-xs text-slate-400 ml-1">#DK-1284-A</span></td>
                <td className="py-5"><span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold text-xs">SN-982347293</span> <span className="text-xs text-emerald-400 ml-1 font-semibold">✓ Bio OK</span></td>
                <td className="py-5"><span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">Valide (Axa Sénégal)</span></td>
                <td className="py-5 flex items-center gap-2">
                  <button className="bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl font-bold text-xs hover:bg-emerald-400 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all">
                    <CheckCircle2 className="w-4 h-4" /> Approuver
                  </button>
                  <button className="bg-rose-500/20 border border-rose-500/30 text-rose-300 px-4 py-2 rounded-xl font-bold text-xs hover:bg-rose-500/30 flex items-center gap-1.5 transition-colors">
                    <XCircle className="w-4 h-4 text-rose-400" /> Rejeter
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

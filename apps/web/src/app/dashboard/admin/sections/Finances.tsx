'use client';
import React, { useState } from 'react';
import { Wallet, DollarSign, Download, ArrowUpRight, ArrowDownRight, RefreshCcw, Activity } from 'lucide-react';

export default function SectionFinances() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><Wallet className="w-5 h-5 text-orange-400" /> Wallet Global & Commissions SaaS</h2>
          <p className="text-sm text-slate-400 mt-1">Supervisez les flux de la plateforme et gérez le PaymentSettlementEngine.</p>
        </div>
        <button className="bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl text-sm transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" /> Export Comptable
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallet SaaS */}
        <div className="bg-gradient-to-br from-orange-900 to-orange-600 rounded-3xl p-6 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden lg:col-span-1">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          <p className="text-sm font-semibold text-orange-200 uppercase tracking-wider mb-2">Revenus Net Plateforme (SaaS + Com.)</p>
          <div className="flex items-end gap-2">
            <h3 className="text-4xl font-bold text-white">45.2M</h3>
            <span className="text-xl font-bold mb-1">FCFA</span>
          </div>
          <div className="mt-8 space-y-3 relative z-10">
            <div className="flex justify-between items-center text-sm">
              <span className="text-orange-200">Abonnements SaaS</span>
              <span className="font-bold">12.5M FCFA</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-orange-200">Commissions Trajets (5%)</span>
              <span className="font-bold">28.4M FCFA</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-orange-200">Frais B2C</span>
              <span className="font-bold">4.3M FCFA</span>
            </div>
          </div>
        </div>

        {/* Flux Financiers */}
        <div className="bg-[#101728] border border-slate-800 rounded-3xl p-6 lg:col-span-2">
          <h3 className="font-bold text-white flex items-center gap-2 mb-6"><Activity className="w-4 h-4 text-emerald-400" /> Flux d'Argent Global (30j)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Total Encaissé (GMV)</p>
              <p className="text-xl font-bold text-white">568.4M F</p>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center mb-3">
                <ArrowDownRight className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Reversé Transporteurs</p>
              <p className="text-xl font-bold text-white">480.1M F</p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mb-3">
                <RefreshCcw className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Taxes (TVA) Collectées</p>
              <p className="text-xl font-bold text-white">43.1M F</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white text-sm">Règlement Transporteurs (Settlements)</h3>
          <span className="text-xs text-slate-400">Paiements automatiques via API</span>
        </div>
        <div className="divide-y divide-slate-800/60">
          {[
            { id: 'SET-991', tnt: 'Sénégal Express', mnt: '4,500,000 F', date: 'Aujourd\'hui', status: 'Payé', methode: 'Virement Bancaire' },
            { id: 'SET-992', tnt: 'Allo Voyage', mnt: '1,200,000 F', date: 'Aujourd\'hui', status: 'En traitement', methode: 'Wave Business' },
            { id: 'SET-993', tnt: 'Moussa Ndiaye (Indep.)', mnt: '150,000 F', date: 'Hier', status: 'Payé', methode: 'Orange Money' },
          ].map(s => (
            <div key={s.id} className="p-5 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{s.tnt}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{s.id} • {s.methode}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-white mb-1">{s.mnt}</p>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${s.status === 'Payé' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>{s.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

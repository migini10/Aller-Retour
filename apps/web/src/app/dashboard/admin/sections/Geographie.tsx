'use client';
import React from 'react';
import { Globe, MapPin, Plus, CheckCircle2, AlertTriangle, Settings } from 'lucide-react';

const pays = [
  { nom: 'Sénégal', code: 'SN', devise: 'XOF', flag: '🇸🇳', statut: 'Actif', users: '120k' },
  { nom: 'Côte d\'Ivoire', code: 'CI', devise: 'XOF', flag: '🇨🇮', statut: 'Beta', users: '4.5k' },
  { nom: 'Mali', code: 'ML', devise: 'XOF', flag: '🇲🇱', statut: 'En préparation', users: '0' },
  { nom: 'Guinée', code: 'GN', devise: 'GNF', flag: '🇬🇳', statut: 'En préparation', users: '0' },
];

export default function SectionGeographie() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><Globe className="w-5 h-5 text-indigo-400" /> Expansion & Pays (Afrique)</h2>
          <p className="text-sm text-slate-400 mt-1">Gérez le déploiement de la plateforme, les devises et les taxes par pays.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl text-sm transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter un pays
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pays.map(p => (
          <div key={p.code} className="bg-[#101728] border border-slate-800/80 hover:border-indigo-500/30 rounded-3xl p-5 transition-colors relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-6">
              <span className="text-4xl">{p.flag}</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${p.statut === 'Actif' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : p.statut === 'Beta' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                {p.statut}
              </span>
            </div>
            
            <h3 className="font-bold text-white text-xl mb-1">{p.nom}</h3>
            <p className="text-xs text-slate-400 font-mono mb-4">Code: {p.code} • Devise: {p.devise}</p>
            
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase">Utilisateurs</p>
                <p className="font-bold text-white">{p.users}</p>
              </div>
              <button className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#101728] border border-slate-800/80 rounded-3xl p-6">
        <h3 className="font-bold text-white flex items-center gap-2 mb-6"><Settings className="w-4 h-4 text-indigo-400" /> Configuration Régionale (Sénégal)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1 block">Taxe de transport (TVA)</label>
              <input type="text" value="18%" readOnly className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1 block">Devise d'affichage</label>
              <input type="text" value="XOF (FCFA)" readOnly className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none" />
            </div>
          </div>

          <div className="md:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <p className="text-sm font-bold text-white mb-4">Fournisseurs de Paiement Actifs</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#00a0e3] flex items-center justify-center font-bold text-white text-xs">W</div>
                  <span className="font-bold text-white text-sm">Wave Mobile Money</span>
                </div>
                <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Connecté</span>
              </div>
              <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#ff7900] flex items-center justify-center font-bold text-white text-xs">OM</div>
                  <span className="font-bold text-white text-sm">Orange Money</span>
                </div>
                <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Connecté</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

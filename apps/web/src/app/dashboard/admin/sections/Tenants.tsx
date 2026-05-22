'use client';
import React from 'react';
import { Building2, Search, Filter, MoreVertical, Plus, CreditCard, ShieldCheck } from 'lucide-react';

const tenants = [
  { id: 'TNT-001', nom: 'Sénégal Express GIE', type: 'Entreprise', plan: 'Enterprise', mrr: '150,000 F', users: 120, statut: 'Actif', exp: '14/12/2026' },
  { id: 'TNT-002', nom: 'Allo Transport', type: 'GIE', plan: 'Pro', mrr: '50,000 F', users: 45, statut: 'Actif', exp: '02/10/2026' },
  { id: 'TNT-005', nom: 'Gare Routière Pikine', type: 'Gare Publique', plan: 'Institution', mrr: '0 F (Sub)', users: 200, statut: 'Actif', exp: 'N/A' },
  { id: 'TNT-012', nom: 'Voyages Express', type: 'Entreprise', plan: 'Starter', mrr: '15,000 F', users: 5, statut: 'Suspendu', exp: 'Expiré' },
];

export default function SectionTenants() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><Building2 className="w-5 h-5 text-indigo-400" /> Gestion Multi-Tenant (B2B)</h2>
          <p className="text-sm text-slate-400 mt-1">Gérez les compagnies de transport, GIE et gares partenaires.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl text-sm transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filtrer
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl text-sm transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20">
            <Plus className="w-4 h-4" /> Nouveau Tenant
          </button>
        </div>
      </div>

      {/* SaaS Plans Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Starter', count: 145, mrr: '2.1M F' },
          { label: 'Pro', count: 85, mrr: '4.2M F' },
          { label: 'Enterprise', count: 24, mrr: '3.6M F' },
          { label: 'Institution', count: 5, mrr: 'Contrats' },
        ].map(p => (
          <div key={p.label} className="bg-[#101728] border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{p.label}</span>
              <span className="text-xs bg-slate-900 px-2 py-0.5 rounded text-slate-400 border border-slate-700">{p.count} tenants</span>
            </div>
            <p className="text-lg font-bold text-white">{p.mrr} <span className="text-[10px] text-slate-500 font-normal">MRR</span></p>
          </div>
        ))}
      </div>

      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Rechercher un tenant par nom ou ID..." className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-indigo-500" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-4 pl-6 font-semibold">Tenant</th>
                <th className="py-4 font-semibold">Plan SaaS</th>
                <th className="py-4 font-semibold">Revenu (MRR)</th>
                <th className="py-4 font-semibold">Licences</th>
                <th className="py-4 font-semibold">Statut</th>
                <th className="py-4 pr-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {tenants.map(t => (
                <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-bold text-white">{t.nom}</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">{t.id} • {t.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-md text-xs font-bold border border-indigo-500/20">{t.plan}</span>
                  </td>
                  <td className="py-4 font-bold text-white">{t.mrr}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{t.users}</span>
                      <span className="text-xs text-slate-500">utilisateurs</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase border ${t.statut === 'Actif' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                      {t.statut}
                    </span>
                  </td>
                  <td className="py-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-[10px] uppercase font-bold bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded transition-colors border border-slate-700">Gérer</button>
                      <button className="p-1.5 hover:bg-slate-800 rounded transition-colors text-slate-400"><MoreVertical className="w-4 h-4" /></button>
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

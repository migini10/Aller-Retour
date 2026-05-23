'use client';
import React, { useState } from 'react';
import { Users, Search, Filter, ShieldAlert, Shield, MoreHorizontal, UserCheck, UserX } from 'lucide-react';

const users = [
  { id: 'USR-8821', nom: 'Mamadou Ndiaye', role: 'Chauffeur', tenant: 'Sénégal Express', lastActive: 'Il y a 5 min', statut: 'Vérifié' },
  { id: 'USR-4432', nom: 'Fatou Diop', role: 'Voyageur (Allo Dakar)', tenant: 'Indépendant', lastActive: 'Il y a 2h', statut: 'Vérifié' },
  { id: 'USR-9921', nom: 'Amadou Fall', role: 'Agent Guichet', tenant: 'Gare Baux Maraîchers', lastActive: 'En ligne', statut: 'Vérifié' },
  { id: 'USR-1120', nom: 'Cheikh Sow', role: 'Chauffeur Libre', tenant: 'Indépendant', lastActive: 'Hier', statut: 'Suspendu' },
];

export default function SectionUtilisateurs() {
  const [tab, setTab] = useState('Tous');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><Users className="w-5 h-5 text-orange-400" /> Gestion des Utilisateurs</h2>
          <p className="text-sm text-slate-400 mt-1">Vue globale sur les voyageurs, chauffeurs, et personnels.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Rechercher email, nom, tel..." className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-orange-500" />
          </div>
          <button className="bg-slate-900 border border-slate-700 hover:bg-slate-800 p-2 rounded-xl text-slate-400 transition-colors"><Filter className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['Tous', 'Voyageurs', 'Chauffeurs', 'Administrateurs', 'Bannis/Suspendus'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${tab === t ? (t === 'Bannis/Suspendus' ? 'bg-rose-600 text-white' : 'bg-orange-600 text-white') : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-4 pl-6 font-semibold">Utilisateur</th>
                <th className="py-4 font-semibold">Rôle & Tenant</th>
                <th className="py-4 font-semibold">Dernière Connexion</th>
                <th className="py-4 font-semibold">Statut (KYC)</th>
                <th className="py-4 pr-6 font-semibold text-right">Modération</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden shrink-0">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.nom}`} alt={u.nom} />
                      </div>
                      <div>
                        <p className="font-bold text-white">{u.nom}</p>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">{u.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="text-xs font-bold text-orange-400 mb-0.5">{u.role}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{u.tenant}</p>
                  </td>
                  <td className="py-4 text-xs font-medium text-slate-300">
                    {u.lastActive === 'En ligne' ? <span className="text-emerald-400 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> {u.lastActive}</span> : u.lastActive}
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase border ${u.statut === 'Vérifié' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                      {u.statut === 'Vérifié' ? <Shield className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />} {u.statut}
                    </span>
                  </td>
                  <td className="py-4 pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors" title="Profil complet"><UserCheck className="w-4 h-4" /></button>
                      <button className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded transition-colors" title="Suspendre/Bannir"><UserX className="w-4 h-4" /></button>
                      <button className="p-1.5 text-slate-500 hover:text-white rounded transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
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

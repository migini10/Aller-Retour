'use client';
import React from 'react';
import { Settings, Shield, Users, Globe, Building2 } from 'lucide-react';

export default function SectionParametres() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2"><Settings className="w-5 h-5 text-orange-400" /> Paramètres Entreprise</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipe et Rôles */}
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-white flex items-center gap-2"><Users className="w-4 h-4 text-orange-400" /> Équipe & Rôles</h3>
            <button className="text-xs bg-orange-600 hover:bg-orange-500 text-white px-3 py-1.5 rounded-lg transition-colors">Ajouter Membre</button>
          </div>
          <div className="space-y-4">
            {[
              { nom: 'Amadou Fall', role: 'Administrateur', email: 'amadou@senegalexpress.sn' },
              { nom: 'Aissatou Diagne', role: 'Gestionnaire Flotte', email: 'aissatou@senegalexpress.sn' },
              { nom: 'Moussa Ndiaye', role: 'Comptable', email: 'compta@senegalexpress.sn' }
            ].map((u, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl border border-[#2A2A2A]/60 bg-[#1A1A1A]/50">
                <div>
                  <p className="text-sm font-bold text-white">{u.nom}</p>
                  <p className="text-xs text-slate-400">{u.email}</p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-md font-bold ${u.role === 'Administrateur' ? 'bg-rose-500/10 text-rose-400' : 'bg-[#222222] text-slate-300'}`}>{u.role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Préférences Générales */}
        <div className="space-y-6">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-6">
            <h3 className="font-bold text-white flex items-center gap-2 mb-6"><Globe className="w-4 h-4 text-orange-400" /> Préférences</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 font-semibold mb-1 block">Devise par défaut</label>
                <select className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none">
                  <option>Franc CFA (XOF)</option>
                  <option>Euro (€)</option>
                  <option>Dollar ($)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 font-semibold mb-1 block">Langue de l'interface</label>
                <select className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none">
                  <option>Français</option>
                  <option>English</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-6">
            <h3 className="font-bold text-white flex items-center gap-2 mb-6"><Shield className="w-4 h-4 text-orange-400" /> Sécurité</h3>
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#222222]/50 transition-colors border border-[#2A2A2A] mb-2">
              <span className="text-sm font-semibold text-slate-300">Authentification à deux facteurs (2FA)</span>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">Activé</span>
            </button>
            <button className="w-full text-left p-3 rounded-xl hover:bg-[#222222]/50 transition-colors border border-[#2A2A2A]">
              <span className="text-sm font-semibold text-slate-300">Modifier le mot de passe maître</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

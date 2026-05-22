'use client';
import React, { useState } from 'react';
import { Settings, User, Lock, Globe, CreditCard, Trash2, Save, Eye, EyeOff } from 'lucide-react';

const sections = ['Profil', 'Sécurité', 'Préférences', 'Paiements', 'Compte'];

export default function SectionParametres() {
  const [tab, setTab] = useState('Profil');
  const [showPwd, setShowPwd] = useState(false);

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-white flex items-center gap-2"><Settings className="w-5 h-5 text-orange-400" /> Profil & Paramètres</h2>

      <div className="flex gap-2 flex-wrap">
        {sections.map(s => (
          <button key={s} onClick={() => setTab(s)} className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${tab === s ? 'bg-orange-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}>{s}</button>
        ))}
      </div>

      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-6">
        {tab === 'Profil' && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-2xl font-bold text-orange-400">AB</div>
              <div>
                <p className="text-white font-bold">Abdou Bakhe</p>
                <p className="text-xs text-slate-400">Client Allo Dakar</p>
                <button className="text-xs text-orange-400 hover:text-orange-300 mt-1 transition-colors">Changer photo</button>
              </div>
            </div>
            {[{ label: 'Nom complet', val: 'Abdou Bakhe' }, { label: 'Email', val: 'abdou@example.com' }, { label: 'Téléphone', val: '+221 77 000 00 00' }, { label: 'Date de naissance', val: '1990-01-01' }].map(f => (
              <div key={f.label}>
                <label className="text-xs text-slate-400 mb-1 block">{f.label}</label>
                <input defaultValue={f.val} className="w-full bg-slate-900 border border-slate-700 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors" />
              </div>
            ))}
            <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors mt-2">
              <Save className="w-4 h-4" /> Sauvegarder
            </button>
          </div>
        )}

        {tab === 'Sécurité' && (
          <div className="space-y-4">
            <p className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Lock className="w-4 h-4 text-orange-400" /> Modifier le mot de passe</p>
            {['Mot de passe actuel', 'Nouveau mot de passe', 'Confirmer nouveau'].map(l => (
              <div key={l}>
                <label className="text-xs text-slate-400 mb-1 block">{l}</label>
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} className="w-full bg-slate-900 border border-slate-700 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none pr-10 transition-colors" />
                  <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
            <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
              <Save className="w-4 h-4" /> Mettre à jour
            </button>
          </div>
        )}

        {tab === 'Préférences' && (
          <div className="space-y-4">
            <p className="text-sm font-bold text-white flex items-center gap-2"><Globe className="w-4 h-4 text-orange-400" /> Langue & Région</p>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Langue</label>
              <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none cursor-pointer">
                <option>Français</option>
                <option>Wolof</option>
                <option>English</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Pays</label>
              <select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none cursor-pointer">
                <option>Sénégal</option>
                <option>Mali</option>
                <option>Côte d'Ivoire</option>
              </select>
            </div>
            <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
              <Save className="w-4 h-4" /> Sauvegarder
            </button>
          </div>
        )}

        {tab === 'Paiements' && (
          <div className="space-y-4">
            <p className="text-sm font-bold text-white flex items-center gap-2"><CreditCard className="w-4 h-4 text-orange-400" /> Méthodes de paiement enregistrées</p>
            {[{ n: 'Wave', num: '+221 77 *** 45 67', actif: true }, { n: 'Orange Money', num: '+221 78 *** 22 11', actif: false }].map(m => (
              <div key={m.n} className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-white">{m.n}</p>
                  <p className="text-xs text-slate-400">{m.num}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-lg font-bold ${m.actif ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                  {m.actif ? 'Principal' : 'Secondaire'}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'Compte' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-400 mb-2">Zone de danger — ces actions sont irréversibles.</p>
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-3">
              <p className="text-sm font-bold text-rose-400">Supprimer mon compte</p>
              <p className="text-xs text-slate-400">Toutes vos données seront supprimées définitivement. Cette action ne peut pas être annulée.</p>
              <button className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Supprimer définitivement
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

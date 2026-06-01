'use client';
import React from 'react';
import { Settings, User, Lock, Globe, Shield } from 'lucide-react';

export default function SectionParametres() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors"><Settings className="w-5 h-5 text-orange-500 dark:text-orange-400" /> Paramètres Chauffeur</h2>

      <div className="space-y-4">
        {/* Profil */}
        <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-5 transition-colors">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4 transition-colors"><User className="w-4 h-4 text-orange-500 dark:text-orange-400" /> Informations Personnelles</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-[#222222] overflow-hidden transition-colors">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Moussa" alt="Chauffeur" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-lg transition-colors">Moussa Ndiaye</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono transition-colors">ID: CH-89423</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1 block transition-colors">Téléphone</label>
              <input type="text" value="+221 77 000 00 00" readOnly className="w-full bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-300 outline-none transition-colors" />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1 block transition-colors">Email</label>
              <input type="text" value="moussa@example.com" readOnly className="w-full bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-slate-300 outline-none transition-colors" />
            </div>
          </div>
        </div>

        {/* Sécurité */}
        <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-5 transition-colors">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4 transition-colors"><Shield className="w-4 h-4 text-orange-500 dark:text-orange-400" /> Sécurité</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#222222]/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-[#2A2A2A]">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-slate-500 dark:text-slate-400 transition-colors" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors">Modifier le mot de passe</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#222222]/50 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-[#2A2A2A]">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-slate-500 dark:text-slate-400 transition-colors" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors">Langue (Français)</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

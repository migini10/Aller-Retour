'use client';
import React from 'react';
import { Settings, Shield, Globe } from 'lucide-react';

export default function SectionParametres() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2"><Settings className="w-5 h-5 text-indigo-400" /> Paramètres Globaux Plateforme</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-[#101728] border border-slate-800 rounded-3xl p-6">
            <h3 className="font-bold text-white flex items-center gap-2 mb-6"><Shield className="w-4 h-4 text-orange-400" /> Sécurité & Accès</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <span className="text-sm font-semibold text-slate-300">Authentification 2FA obligatoire (Admins)</span>
                <div className="w-10 h-6 bg-indigo-600 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                </div>
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <span className="text-sm font-semibold text-slate-300">Mode Maintenance Strict</span>
                <div className="w-10 h-6 bg-slate-700 rounded-full relative">
                  <div className="w-4 h-4 bg-slate-400 rounded-full absolute left-1 top-1"></div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-[#101728] border border-slate-800 rounded-3xl p-6">
          <h3 className="font-bold text-white flex items-center gap-2 mb-6"><Globe className="w-4 h-4 text-indigo-400" /> Paramètres de Base</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1 block">Nom de la Plateforme SaaS</label>
              <input type="text" value="Aller-Retour OS" readOnly className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1 block">Email Contact Support (Public)</label>
              <input type="email" value="support@aller-retour.sn" readOnly className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white outline-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

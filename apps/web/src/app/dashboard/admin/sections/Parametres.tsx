'use client';
import React from 'react';
import { Settings, Shield, Globe } from 'lucide-react';

export default function SectionParametres() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2"><Settings className="w-5 h-5 text-orange-400" /> Paramètres Globaux Plateforme</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-6">
            <h3 className="font-bold text-white flex items-center gap-2 mb-6"><Shield className="w-4 h-4 text-orange-400" /> Sécurité & Accès</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#1A1A1A]/50 border border-[#2A2A2A]">
                <span className="text-sm font-semibold text-slate-300">Authentification 2FA obligatoire (Admins)</span>
                <div className="w-10 h-6 bg-orange-600 rounded-full relative">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                </div>
              </label>
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#1A1A1A]/50 border border-[#2A2A2A]">
                <span className="text-sm font-semibold text-slate-300">Mode Maintenance Strict</span>
                <div className="w-10 h-6 bg-slate-700 rounded-full relative">
                  <div className="w-4 h-4 bg-slate-400 rounded-full absolute left-1 top-1"></div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-6">
          <h3 className="font-bold text-white flex items-center gap-2 mb-6"><Globe className="w-4 h-4 text-orange-400" /> Paramètres de Base</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1 block">Nom de la Plateforme SaaS</label>
              <input type="text" value="Allogoo OS" readOnly className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-2 text-sm text-white outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1 block">Email Contact Support (Public)</label>
              <input type="email" value="support@allogoo.com" readOnly className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-2 text-sm text-white outline-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

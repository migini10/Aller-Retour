'use client';
import React from 'react';
import { Settings, User, Printer, Monitor, Shield } from 'lucide-react';

export default function SectionParametres() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2"><Settings className="w-5 h-5 text-indigo-400" /> Paramètres Agent & Guichet</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profil Agent */}
        <div className="bg-[#101728] border border-slate-800 rounded-3xl p-6">
          <h3 className="font-bold text-white flex items-center gap-2 mb-6"><User className="w-4 h-4 text-indigo-400" /> Profil Agent</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/40">
              <span className="text-2xl font-bold text-indigo-400">AF</span>
            </div>
            <div>
              <p className="font-bold text-white text-lg">Amadou Fall</p>
              <p className="text-xs text-slate-400 font-mono">Matricule: AGT-2049</p>
              <span className="inline-block mt-1 bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-bold">Chef de Guichet</span>
            </div>
          </div>
          <button className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">Déconnexion sécurisée</button>
        </div>

        {/* Configurations Matérielles */}
        <div className="space-y-6">
          <div className="bg-[#101728] border border-slate-800 rounded-3xl p-6">
            <h3 className="font-bold text-white flex items-center gap-2 mb-6"><Monitor className="w-4 h-4 text-indigo-400" /> Terminal & Périphériques</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <Printer className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-bold text-white">Imprimante Thermique EPSON</p>
                    <p className="text-xs text-emerald-400">Connectée (USB)</p>
                  </div>
                </div>
                <button className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded-lg">Test</button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-bold text-white">Scanner Optique 2D</p>
                    <p className="text-xs text-emerald-400">Connecté (Bluetooth)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#101728] border border-slate-800 rounded-3xl p-6">
            <h3 className="font-bold text-white flex items-center gap-2 mb-4"><Settings className="w-4 h-4 text-indigo-400" /> Préférences d'Interface</h3>
            <label className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-900 cursor-pointer border border-transparent hover:border-slate-800 transition-colors">
              <span className="text-sm font-semibold text-slate-300">Mode d'économie de batterie (Tablette)</span>
              <div className="w-10 h-6 bg-slate-700 rounded-full relative">
                <div className="w-4 h-4 bg-slate-400 rounded-full absolute left-1 top-1"></div>
              </div>
            </label>
            <label className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-900 cursor-pointer border border-transparent hover:border-slate-800 transition-colors">
              <span className="text-sm font-semibold text-slate-300">Impression automatique du billet</span>
              <div className="w-10 h-6 bg-indigo-600 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

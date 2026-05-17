'use client';

import React, { useState } from 'react';
import { TicketCheck, Printer, Camera, Search, UserCheck, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function DispatcherDashboard() {
  const [phoneSearch, setPhoneSearch] = useState('');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Guichet & Contrôle de Gare</h1>
          <p className="text-slate-400 mt-1">Terminal de vente au comptoir, impression thermique POS et scan QR d'embarquement.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold px-6 py-3 rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2">
            <Camera className="w-5 h-5 text-slate-950" /> Scanner QR Code Billet
          </button>
        </div>
      </div>

      {/* POS Quick Sell & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Vente Express au Guichet (POS Android)</h2>
            <span className="text-xs bg-slate-800 px-3 py-1 rounded-md text-emerald-400 font-mono">Imprimante Sunmi V2 : Connectée en Bluetooth</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-xs text-slate-400 font-semibold mb-2 block">Ligne de Départ</label>
              <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white font-medium focus:border-emerald-500 outline-none">
                <option>Dakar ➔ Touba (08:00 - 4 500 FCFA)</option>
                <option>Dakar ➔ Saint-Louis (09:30 - 5 000 FCFA)</option>
                <option>Thiès ➔ Ziguinchor (11:00 - 9 000 FCFA)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold mb-2 block">Numéro Téléphone Client</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ex: 77 123 45 67" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white font-medium focus:border-emerald-500 outline-none pl-10"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="flex-1 bg-emerald-500 text-slate-950 font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2">
              <Printer className="w-5 h-5 text-slate-950" /> Émettre Billet & Imprimer QR Thermique
            </button>
          </div>
        </div>

        {/* Verification Status Banner */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl flex flex-col justify-center items-center text-center">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/10">
            <UserCheck className="w-10 h-10 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Contrôle d'Embarquement</h3>
          <p className="text-sm text-slate-400 mb-6">Pointez la caméra vers le billet du voyageur ou entrez le jeton de sécurité.</p>
          <div className="w-full bg-emerald-500/20 border border-emerald-500/40 p-4 rounded-2xl text-emerald-300 font-bold text-sm flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Billet Validé : Siège #14 (Dakar ➔ Touba)
          </div>
        </div>
      </div>
    </div>
  );
}

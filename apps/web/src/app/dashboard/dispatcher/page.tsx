'use client';

import React, { useState } from 'react';
import { TicketCheck, Printer, Camera, Search, UserCheck, CheckCircle2 } from 'lucide-react';

export default function DispatcherDashboard() {
  const [phoneSearch, setPhoneSearch] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Guichet & Contrôle de Gare</h1>
            <p className="text-slate-400 text-sm mt-1">Terminal de vente POS, impression thermique et scan QR d'embarquement.</p>
          </div>
          <button className="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
            <Camera className="w-4 h-4" /> Scanner QR Billet
          </button>
        </div>
      </div>

      {/* POS Quick Sell & Contrôle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* POS Card */}
        <div className="lg:col-span-2 bg-[#101728] border border-slate-800/80 p-5 sm:p-7 rounded-2xl">
          <div className="mb-5">
            <h2 className="text-base sm:text-lg font-bold text-white mb-2">Vente Express au Guichet (POS Android)</h2>
            <span className="inline-flex items-center gap-1.5 text-xs bg-slate-800 px-3 py-1.5 rounded-lg text-orange-400 font-medium border border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              Imprimante Sunmi V2 — Bluetooth connecté
            </span>
          </div>

          {/* Formulaire en colonne unique sur mobile */}
          <div className="space-y-4 mb-5">
            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1.5 block">Ligne de Départ</label>
              <select className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm font-medium focus:border-orange-500 outline-none cursor-pointer">
                <option>Dakar ➔ Touba (08:00 — 4 500 FCFA)</option>
                <option>Dakar ➔ Saint-Louis (09:30 — 5 000 FCFA)</option>
                <option>Thiès ➔ Ziguinchor (11:00 — 9 000 FCFA)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1.5 block">Numéro Téléphone Client</label>
              <div className="relative">
                <input 
                  type="tel"
                  placeholder="Ex: 77 123 45 67" 
                  value={phoneSearch}
                  onChange={e => setPhoneSearch(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm font-medium focus:border-orange-500 outline-none pl-10"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>
          </div>

          <button className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
            <Printer className="w-4 h-4" /> Émettre Billet & Imprimer QR Thermique
          </button>
        </div>

        {/* Contrôle d'Embarquement */}
        <div className="bg-[#101728] border border-slate-800/80 p-5 sm:p-7 rounded-2xl flex flex-col justify-center items-center text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-500/10 border border-orange-500/30 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <UserCheck className="w-7 h-7 text-orange-400" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mb-2">Contrôle d'Embarquement</h3>
          <p className="text-xs text-slate-400 mb-5 leading-relaxed">Pointez la caméra vers le billet du voyageur ou entrez le jeton de sécurité.</p>
          <div className="w-full bg-orange-500/10 border border-orange-500/30 p-3 rounded-xl text-orange-300 font-semibold text-xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
            <span>Billet Validé : Siège #14 — Dakar ➔ Touba</span>
          </div>
        </div>
      </div>
    </div>
  );
}

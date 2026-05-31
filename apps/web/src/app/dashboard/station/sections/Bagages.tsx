'use client';
import React from 'react';
import { Package, ScanLine, Printer, Plus, Scale } from 'lucide-react';

export default function SectionBagages() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Package className="w-5 h-5 text-orange-400" /> Enregistrement Bagages</h2>
        <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouvel enregistrement
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#141414] border border-[#2A2A2A]/80 rounded-3xl p-6">
          <h3 className="font-bold text-white flex items-center gap-2 mb-6"><Scale className="w-4 h-4 text-orange-400" /> Calculateur Express</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 font-semibold mb-1 block">Numéro Billet (Passager)</label>
              <input type="text" placeholder="Ex: AR-123456" className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 font-semibold mb-1 block">Poids mesuré (kg)</label>
                <input type="number" placeholder="0" className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-semibold mb-1 block">Surtaxe Estimée</label>
                <div className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl px-4 py-3 text-sm font-bold text-emerald-400 flex items-center h-full">0 FCFA</div>
              </div>
            </div>
            <button className="w-full py-3 bg-[#222222] hover:bg-slate-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 mt-4">
              <Printer className="w-4 h-4" /> Imprimer Étiquette QR
            </button>
          </div>
        </div>

        <div className="bg-[#141414] border border-[#2A2A2A]/80 rounded-3xl p-6">
          <h3 className="font-bold text-white flex items-center gap-2 mb-6"><ScanLine className="w-4 h-4 text-orange-400" /> Scan Rapide (Soute)</h3>
          <div className="bg-[#1A1A1A] border-2 border-dashed border-[#333333] rounded-2xl h-48 flex flex-col items-center justify-center text-slate-500 mb-4 hover:border-orange-500 hover:bg-[#222222]/50 transition-colors cursor-pointer">
            <ScanLine className="w-10 h-10 mb-2" />
            <p className="text-sm font-semibold">Cliquez pour scanner une étiquette</p>
          </div>
          <p className="text-xs text-slate-400 text-center">Assurez-vous que chaque bagage entrant dans la soute est scanné pour garantir sa traçabilité jusqu'à l'arrivée.</p>
        </div>
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A]/80 rounded-2xl p-5">
        <h3 className="font-bold text-white text-sm mb-4">Derniers enregistrements (Dakar → Touba)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs text-slate-500 uppercase tracking-wider border-b border-[#2A2A2A]">
              <tr>
                <th className="py-2 pl-4">ID Bagage</th>
                <th className="py-2">Passager</th>
                <th className="py-2">Poids</th>
                <th className="py-2">Frais</th>
                <th className="py-2">Statut</th>
              </tr>
            </thead>
            <tbody className="text-sm text-white divide-y divide-slate-800/60">
              {[1,2,3].map(i => (
                <tr key={i}>
                  <td className="py-3 pl-4 font-mono text-orange-400">BAG-992{i}</td>
                  <td className="py-3">Mamadou Ndiaye <span className="text-xs text-slate-500 block">AR-74892374</span></td>
                  <td className="py-3">24 kg</td>
                  <td className="py-3 text-emerald-400">+1 000 F</td>
                  <td className="py-3"><span className="bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold border border-orange-500/20">En Soute</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

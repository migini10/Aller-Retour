'use client';
import React from 'react';
import { Bus, FileText, ShieldCheck, AlertTriangle, PenTool } from 'lucide-react';

export default function SectionVehicule() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2"><Bus className="w-5 h-5 text-orange-400" /> Mon Véhicule</h2>

      <div className="bg-gradient-to-br from-[#101728] to-slate-900 border border-slate-800/80 rounded-3xl p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-32 h-32 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center shrink-0">
            <Bus className="w-16 h-16 text-slate-500" />
          </div>
          <div className="text-center sm:text-left space-y-2">
            <h3 className="text-2xl font-bold text-white">Toyota Hiace Climatisé</h3>
            <div className="inline-block bg-slate-800 border border-slate-600 px-4 py-1.5 rounded text-lg font-mono font-bold text-white tracking-widest">
              AA-123-BB
            </div>
            <p className="text-sm text-slate-400">Capacité: 15 places • Catégorie: Minibus Inter-Urbain</p>
          </div>
        </div>
      </div>

      <h3 className="text-sm text-slate-400 font-bold uppercase tracking-wider mt-8 mb-4">Documents & Conformité</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Assurance */}
        <div className="bg-[#101728] border border-slate-800 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="bg-emerald-500/20 p-2 rounded-xl text-emerald-400"><ShieldCheck className="w-5 h-5" /></div>
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-1 rounded-md font-bold uppercase border border-emerald-500/20">Valide</span>
          </div>
          <p className="font-bold text-white">Assurance Transport</p>
          <p className="text-xs text-slate-500 mt-1">Expire le 14 Déc 2026</p>
        </div>

        {/* Visite Technique */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="bg-amber-500/20 p-2 rounded-xl text-amber-400"><AlertTriangle className="w-5 h-5" /></div>
            <span className="bg-amber-500/20 text-amber-400 text-[10px] px-2 py-1 rounded-md font-bold uppercase border border-amber-500/30">Expiré Bientôt</span>
          </div>
          <p className="font-bold text-white">Visite Technique</p>
          <p className="text-xs text-amber-400 mt-1 font-semibold">Expire dans 15 jours</p>
          <button className="mt-3 text-xs bg-amber-500 text-amber-950 font-bold px-3 py-1.5 rounded-lg w-full">Mettre à jour</button>
        </div>

        {/* Permis de conduire */}
        <div className="bg-[#101728] border border-slate-800 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="bg-blue-500/20 p-2 rounded-xl text-blue-400"><FileText className="w-5 h-5" /></div>
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-1 rounded-md font-bold uppercase border border-emerald-500/20">Valide</span>
          </div>
          <p className="font-bold text-white">Permis Transport Commun</p>
          <p className="text-xs text-slate-500 mt-1">Num: SN-938201</p>
        </div>

        {/* État du Véhicule */}
        <div className="bg-[#101728] border border-slate-800 rounded-2xl p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="bg-slate-800 p-2 rounded-xl text-slate-400"><PenTool className="w-5 h-5" /></div>
            <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-1 rounded-md font-bold uppercase border border-slate-700">À Renseigner</span>
          </div>
          <p className="font-bold text-white">Bilan d'état (Check-list)</p>
          <p className="text-xs text-slate-500 mt-1">Dernier bilan: Il y a 5 jours</p>
          <button className="mt-3 text-xs border border-slate-600 text-slate-300 font-bold px-3 py-1.5 rounded-lg w-full hover:bg-slate-800 transition-colors">Faire un bilan</button>
        </div>
      </div>
    </div>
  );
}

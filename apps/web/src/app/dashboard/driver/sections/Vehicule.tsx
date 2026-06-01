'use client';
import React from 'react';
import { Bus, FileText, ShieldCheck, AlertTriangle, PenTool } from 'lucide-react';

export default function SectionVehicule() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors"><Bus className="w-5 h-5 text-orange-500 dark:text-orange-400" /> Mon Véhicule</h2>

      <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#101728] dark:to-slate-900 border border-slate-200 dark:border-[#2A2A2A]/80 rounded-3xl p-6 transition-colors">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-32 h-32 bg-white dark:bg-[#222222] rounded-2xl border border-slate-200 dark:border-[#333333] flex items-center justify-center shrink-0 transition-colors">
            <Bus className="w-16 h-16 text-slate-400 dark:text-slate-500 transition-colors" />
          </div>
          <div className="text-center sm:text-left space-y-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Toyota Hiace Climatisé</h3>
            <div className="inline-block bg-white dark:bg-[#222222] border border-slate-300 dark:border-slate-600 px-4 py-1.5 rounded text-lg font-mono font-bold text-slate-800 dark:text-white tracking-widest transition-colors">
              AA-123-BB
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">Capacité: 15 places • Catégorie: Minibus Inter-Urbain</p>
          </div>
        </div>
      </div>

      <h3 className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-8 mb-4 transition-colors">Documents & Conformité</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Assurance */}
        <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-5 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div className="bg-emerald-50 dark:bg-emerald-500/20 p-2 rounded-xl text-emerald-500 dark:text-emerald-400 transition-colors"><ShieldCheck className="w-5 h-5" /></div>
            <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] px-2 py-1 rounded-md font-bold uppercase border border-emerald-200 dark:border-emerald-500/20 transition-colors">Valide</span>
          </div>
          <p className="font-bold text-slate-900 dark:text-white transition-colors">Assurance Transport</p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Expire le 14 Déc 2026</p>
        </div>

        {/* Visite Technique */}
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-2xl p-5 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div className="bg-amber-100 dark:bg-amber-500/20 p-2 rounded-xl text-amber-500 dark:text-amber-400 transition-colors"><AlertTriangle className="w-5 h-5" /></div>
            <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] px-2 py-1 rounded-md font-bold uppercase border border-amber-300 dark:border-amber-500/30 transition-colors">Expiré Bientôt</span>
          </div>
          <p className="font-bold text-slate-900 dark:text-white transition-colors">Visite Technique</p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-semibold transition-colors">Expire dans 15 jours</p>
          <button className="mt-3 text-xs bg-amber-500 text-amber-950 font-bold px-3 py-1.5 rounded-lg w-full transition-colors hover:bg-amber-400">Mettre à jour</button>
        </div>

        {/* Permis de conduire */}
        <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-5 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div className="bg-blue-50 dark:bg-blue-500/20 p-2 rounded-xl text-blue-500 dark:text-blue-400 transition-colors"><FileText className="w-5 h-5" /></div>
            <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] px-2 py-1 rounded-md font-bold uppercase border border-emerald-200 dark:border-emerald-500/20 transition-colors">Valide</span>
          </div>
          <p className="font-bold text-slate-900 dark:text-white transition-colors">Permis Transport Commun</p>
          <p className="text-xs text-slate-500 mt-1">Num: SN-938201</p>
        </div>

        {/* État du Véhicule */}
        <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-5 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div className="bg-slate-100 dark:bg-[#222222] p-2 rounded-xl text-slate-500 dark:text-slate-400 transition-colors"><PenTool className="w-5 h-5" /></div>
            <span className="bg-slate-100 dark:bg-[#222222] text-slate-500 dark:text-slate-400 text-[10px] px-2 py-1 rounded-md font-bold uppercase border border-slate-200 dark:border-[#333333] transition-colors">À Renseigner</span>
          </div>
          <p className="font-bold text-slate-900 dark:text-white transition-colors">Bilan d'état (Check-list)</p>
          <p className="text-xs text-slate-500 mt-1">Dernier bilan: Il y a 5 jours</p>
          <button className="mt-3 text-xs border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-bold px-3 py-1.5 rounded-lg w-full hover:bg-slate-50 dark:hover:bg-[#222222] transition-colors">Faire un bilan</button>
        </div>
      </div>
    </div>
  );
}

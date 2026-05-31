'use client';
import React from 'react';
import { HelpCircle, AlertTriangle, FileText, Wrench } from 'lucide-react';

export default function SectionSupport() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2"><HelpCircle className="w-5 h-5 text-orange-400" /> Support & Incidents (Terrain)</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-3xl p-6">
          <AlertTriangle className="w-8 h-8 text-rose-400 mb-4" />
          <h3 className="font-bold text-white text-lg mb-2">Signaler un Incident Urgent</h3>
          <p className="text-sm text-rose-200/80 mb-6">Panne de bus sur le quai, problème avec un passager agressif, ou coupure électrique impactant les contrôles.</p>
          <button className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-3 rounded-xl text-sm w-full transition-colors shadow-lg shadow-rose-500/20">Créer une alerte</button>
        </div>

        <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-6">
          <Wrench className="w-8 h-8 text-orange-400 mb-4" />
          <h3 className="font-bold text-white text-lg mb-2">Ticket Support Matériel</h3>
          <p className="text-sm text-slate-400 mb-6">Problème avec les imprimantes thermiques, scanners QR ou tablettes de contrôle.</p>
          <button className="bg-[#1A1A1A] border border-[#333333] hover:bg-[#222222] text-white font-bold px-4 py-3 rounded-xl text-sm w-full transition-colors">Ouvrir un ticket technique</button>
        </div>
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-6">
        <h3 className="font-bold text-white mb-6 flex items-center gap-2"><FileText className="w-4 h-4 text-orange-400" /> Procédures Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['Procédure: Remboursement d\'un billet physique', 'Que faire si le scanner de QR ne fonctionne plus ?', 'Gérer la liste d\'attente en cas de surréservation'].map((q, i) => (
            <div key={i} className="p-4 rounded-xl border border-[#2A2A2A]/60 bg-[#1A1A1A]/50 hover:bg-[#222222] hover:border-orange-500/30 transition-colors cursor-pointer">
              <p className="text-sm font-semibold text-slate-300">{q}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

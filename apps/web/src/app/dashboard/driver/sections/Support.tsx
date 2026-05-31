'use client';
import React from 'react';
import { HelpCircle, MessageCircle, FileText, Phone } from 'lucide-react';

export default function SectionSupport() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2"><HelpCircle className="w-5 h-5 text-orange-400" /> Support Chauffeur</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-2xl p-5 text-white">
          <MessageCircle className="w-8 h-8 mb-3" />
          <h3 className="font-bold text-lg">Chat Assistance</h3>
          <p className="text-sm opacity-90 mt-1 mb-4">Notre équipe est disponible 24/7 pour toute urgence ou question.</p>
          <button className="bg-white text-orange-600 font-bold px-4 py-2 rounded-xl text-sm w-full transition-colors hover:bg-slate-50">Démarrer une conversation</button>
        </div>

        <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5">
          <Phone className="w-8 h-8 mb-3 text-orange-400" />
          <h3 className="font-bold text-white text-lg">Appel d'Urgence</h3>
          <p className="text-sm text-slate-400 mt-1 mb-4">Ligne réservée exclusivement aux urgences routières.</p>
          <button className="bg-[#222222] hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-sm w-full transition-colors border border-[#333333]">Appeler le 800 00 00 00</button>
        </div>
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-orange-400" /> Questions Fréquentes</h3>
        <div className="space-y-3">
          {['Comment déclarer un incident pendant un trajet ?', 'Comment fonctionnent les retraits vers Wave ?', 'Que faire si un passager est absent ?'].map((q, i) => (
            <div key={i} className="p-4 rounded-xl border border-[#2A2A2A]/60 bg-[#1A1A1A]/50 hover:border-orange-500/30 transition-colors cursor-pointer">
              <p className="text-sm font-semibold text-slate-300">{q}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

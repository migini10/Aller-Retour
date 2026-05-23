'use client';
import React from 'react';
import { HelpCircle, MessageCircle, Phone, FileText } from 'lucide-react';

export default function SectionSupport() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2"><HelpCircle className="w-5 h-5 text-orange-400" /> Support Premium GIE</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-orange-900 to-orange-600 rounded-3xl p-6 text-white border border-orange-500/30">
          <MessageCircle className="w-8 h-8 mb-4 text-orange-300" />
          <h3 className="font-bold text-xl">Account Manager Dédié</h3>
          <p className="text-sm opacity-90 mt-2 mb-6">En tant que GIE, vous avez un gestionnaire de compte dédié. Discutez avec lui en direct pour vos besoins.</p>
          <button className="bg-white text-orange-900 font-bold px-4 py-2.5 rounded-xl text-sm w-full transition-colors hover:bg-slate-100">Démarrer le chat</button>
        </div>

        <div className="bg-[#101728] border border-slate-800 rounded-3xl p-6">
          <Phone className="w-8 h-8 mb-4 text-orange-400" />
          <h3 className="font-bold text-white text-xl">Assistance Téléphonique 24/7</h3>
          <p className="text-sm text-slate-400 mt-2 mb-6">Assistance technique et commerciale en continu pour la gestion de votre flotte.</p>
          <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-sm w-full transition-colors border border-slate-700">Appeler le Support</button>
        </div>
      </div>

      <div className="bg-[#101728] border border-slate-800 rounded-3xl p-6">
        <h3 className="font-bold text-white mb-6 flex items-center gap-2"><FileText className="w-4 h-4 text-orange-400" /> Centre d'Aide & FAQ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['Comment assigner un chauffeur indépendant ?', 'Exporter les rapports comptables', 'Gérer les permissions de mon équipe', 'Intégration API pour réservations'].map((q, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-800/60 bg-slate-900/50 hover:bg-slate-800 hover:border-orange-500/30 transition-colors cursor-pointer">
              <p className="text-sm font-semibold text-slate-300">{q}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

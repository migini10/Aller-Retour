'use client';
import React, { useState } from 'react';
import { MessageSquare, Plus, ChevronDown, ChevronUp, Send } from 'lucide-react';

const tickets = [
  { id: 'TKT-001', sujet: 'Remboursement billet AR-62019384', statut: 'résolu', date: '2026-05-10' },
  { id: 'TKT-002', sujet: 'Problème de paiement Wave', statut: 'en cours', date: '2026-05-20' },
];

const faq = [
  { q: 'Comment annuler une réservation ?', r: 'Rendez-vous dans "Mes Réservations", cliquez sur "Annuler". Le remboursement est effectué sous 48h sur votre wallet.' },
  { q: 'Comment récupérer mon billet perdu ?', r: 'Accédez à "Mes Billets" et téléchargez à nouveau votre billet en PDF. Votre QR code reste valide.' },
  { q: 'Quels sont les moyens de paiement acceptés ?', r: 'Wave, Orange Money et cartes bancaires Visa/Mastercard sont acceptés.' },
  { q: 'Comment contacter le support ?', r: 'Via le chat ci-dessous ou en créant un ticket. Délai de réponse : 2h en journée.' },
];

const statStyle: Record<string, string> = {
  résolu: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'en cours': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

export default function SectionSupport() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [msg, setMsg] = useState('');

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-bold text-white flex items-center gap-2"><MessageSquare className="w-5 h-5 text-orange-400" /> Support & Aide</h2>

      {/* Tickets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Mes tickets</p>
          <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white transition-colors font-semibold">
            <Plus className="w-3 h-3" /> Nouveau ticket
          </button>
        </div>
        {tickets.map(t => (
          <div key={t.id} className="bg-[#101728] border border-slate-800/80 rounded-xl p-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">{t.sujet}</p>
              <p className="text-xs text-slate-500 mt-0.5">{t.id} • {t.date}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-lg border font-bold shrink-0 ${statStyle[t.statut]}`}>{t.statut}</span>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="space-y-3">
        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Questions fréquentes</p>
        {faq.map((f, i) => (
          <div key={i} className="bg-[#101728] border border-slate-800/80 rounded-xl overflow-hidden">
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
              <p className="text-sm font-semibold text-white">{f.q}</p>
              {openFaq === i ? <ChevronUp className="w-4 h-4 text-orange-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
            </button>
            {openFaq === i && (
              <div className="px-4 pb-4">
                <p className="text-sm text-slate-400">{f.r}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chat */}
      <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-5 space-y-4">
        <p className="text-sm font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Chat en direct • Support disponible
        </p>
        <div className="bg-slate-900/60 rounded-xl p-3 min-h-[80px] flex items-end">
          <p className="text-xs text-slate-500 italic">Bonjour ! Comment puis-je vous aider aujourd'hui ?</p>
        </div>
        <div className="flex gap-2">
          <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Écrivez votre message..." className="flex-1 bg-slate-900 border border-slate-700 focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-600" />
          <button className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2.5 rounded-xl transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

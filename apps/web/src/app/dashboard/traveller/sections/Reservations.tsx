'use client';
import React, { useState } from 'react';
import { Calendar, Eye, Download, Share2, X, Edit3, CheckCircle2, Clock, XCircle } from 'lucide-react';

const reservations = [
  { id: 'RES-001', trajet: 'Dakar → Touba', date: '2026-06-05', prix: '4 500 FCFA', statut: 'en cours', modifiable: true },
  { id: 'RES-002', trajet: 'Dakar → Saint-Louis', date: '2026-05-20', prix: '3 200 FCFA', statut: 'passée', modifiable: false },
  { id: 'RES-003', trajet: 'Thiès → Ziguinchor', date: '2026-04-15', prix: '6 000 FCFA', statut: 'annulée', modifiable: false },
  { id: 'RES-004', trajet: 'Dakar → Kaolack', date: '2026-06-12', prix: '2 500 FCFA', statut: 'en cours', modifiable: true },
];

const tabs = ['Toutes', 'En cours', 'Passées', 'Annulées'];

const statutStyle: Record<string, string> = {
  'en cours': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'passée': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'annulée': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
};

export default function SectionReservations() {
  const [tab, setTab] = useState('Toutes');
  const filtered = tab === 'Toutes' ? reservations : reservations.filter(r =>
    tab === 'En cours' ? r.statut === 'en cours' : tab === 'Passées' ? r.statut === 'passée' : r.statut === 'annulée'
  );

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-white flex items-center gap-2"><Calendar className="w-5 h-5 text-orange-400" /> Mes Réservations</h2>
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${tab === t ? 'bg-orange-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(r => (
          <div key={r.id} className="bg-[#101728] border border-slate-800/80 hover:border-orange-500/30 rounded-2xl p-5 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-500">{r.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-lg border font-bold ${statutStyle[r.statut]}`}>{r.statut}</span>
                </div>
                <p className="font-bold text-white">{r.trajet}</p>
                <p className="text-sm text-slate-400">{r.date} • <span className="text-orange-400 font-semibold">{r.prix}</span></p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors">
                  <Eye className="w-3 h-3" /> Détails
                </button>
                {r.modifiable && (
                  <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors">
                    <Edit3 className="w-3 h-3" /> Modifier
                  </button>
                )}
                <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors">
                  <Download className="w-3 h-3" /> Billet
                </button>
                <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors">
                  <Share2 className="w-3 h-3" /> Partager
                </button>
                {r.modifiable && (
                  <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/20 transition-colors">
                    <X className="w-3 h-3" /> Annuler
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

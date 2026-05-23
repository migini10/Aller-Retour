'use client';
import React, { useState } from 'react';
import QRCodeBrandEngine from '../../../../components/QRCodeBrandEngine';
import { Download, Share2, Printer, Eye, QrCode, CheckCircle2, Clock, XCircle } from 'lucide-react';

const billets = [
  { id: 'AR-74892374', trajet: 'Dakar → Touba', date: '2026-06-05', heure: '08:00', siege: '14A VIP', compagnie: 'Sénégal Express', vehicule: 'Bus Climatisé 50 places', statut: 'actif' },
  { id: 'AR-84512987', trajet: 'Dakar → Saint-Louis', date: '2026-05-20', heure: '07:00', siege: '03B', compagnie: 'Dakar Dem Dikk', vehicule: 'Mercedes Sprinter', statut: 'utilisé' },
  { id: 'AR-62019384', trajet: 'Thiès → Ziguinchor', date: '2026-04-15', heure: '06:30', siege: '08C', compagnie: 'Mouride Express', vehicule: 'Bus 35 places', statut: 'annulé' },
];

const statutStyle: Record<string, string> = {
  actif: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  utilisé: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  annulé: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
};

const StatutIcon = ({ s }: { s: string }) =>
  s === 'actif' ? <Clock className="w-3 h-3" /> : s === 'utilisé' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />;

import { useModal } from '../../../../components/ModalContext';

export default function SectionBillets() {
  const [selected, setSelected] = useState<string | null>(null);
  const { openBookingWizard } = useModal();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><QrCode className="w-5 h-5 text-orange-400" /> Mes Billets</h2>
        <button 
          onClick={() => openBookingWizard('allo-dakar')}
          className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(234,88,12,0.3)] transition-all flex items-center gap-2"
        >
          <QrCode className="w-4 h-4 hidden sm:block" />
          Trouver une voiture
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {billets.map(b => (
          <div key={b.id} className="bg-[#101728] border border-slate-800/80 rounded-2xl p-5 space-y-4 hover:border-orange-500/30 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="font-mono text-xs text-slate-400">{b.id}</p>
                <p className="font-bold text-white text-base">{b.trajet}</p>
                <p className="text-sm text-slate-400">{b.date} • {b.heure} — Siège {b.siege}</p>
                <p className="text-xs text-slate-500">{b.compagnie} • {b.vehicule}</p>
              </div>
              <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold shrink-0 ${statutStyle[b.statut]}`}>
                <StatutIcon s={b.statut} /> {b.statut}
              </span>
            </div>
            {selected === b.id && (
              <div className="flex justify-center pt-2 border-t border-slate-800">
                <QRCodeBrandEngine value={b.id} size={160} />
              </div>
            )}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
              <button onClick={() => setSelected(selected === b.id ? null : b.id)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors">
                <Eye className="w-3 h-3" /> {selected === b.id ? 'Masquer' : 'Voir QR'}
              </button>
              <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors">
                <Download className="w-3 h-3" /> PDF
              </button>
              <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white transition-colors">
                <Share2 className="w-3 h-3" /> Partager
              </button>
              <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors">
                <Printer className="w-3 h-3" /> Imprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';
import React from 'react';
import { Package, QrCode, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import QRCodeBrandEngine from '../../../../components/QRCodeBrandEngine';

const bagages = [
  { id: 'BAG-001', description: 'Valise principale', poids: '18 kg', frais: 1000, statut: 'enregistré', qr: 'BAG-001-AR-74892374' },
  { id: 'BAG-002', description: 'Sac à dos', poids: '5 kg', frais: 0, statut: 'enregistré', qr: 'BAG-002-AR-74892374' },
];

export default function SectionBagages() {
  const [showQR, setShowQR] = React.useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Package className="w-5 h-5 text-orange-400" /> Gestion Bagages</h2>
        <button className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs px-4 py-2 rounded-xl transition-colors font-semibold">
          <Plus className="w-3.5 h-3.5" /> Déclarer un bagage
        </button>
      </div>

      {bagages.length === 0 ? (
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-10 text-center text-slate-500">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aucun bagage déclaré pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bagages.map(b => (
            <div key={b.id} className="bg-[#141414] border border-[#2A2A2A]/80 hover:border-orange-500/30 rounded-2xl p-5 space-y-4 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <Package className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{b.description}</p>
                    <p className="text-xs text-slate-400">{b.poids} • {b.frais > 0 ? <span className="text-orange-400 font-semibold">+{b.frais} FCFA</span> : <span className="text-emerald-400">Inclus</span>}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> {b.statut}
                  </span>
                  <button onClick={() => setShowQR(showQR === b.id ? null : b.id)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#1A1A1A] hover:bg-[#222222] text-white transition-colors">
                    <QrCode className="w-3.5 h-3.5" /> QR Bagage
                  </button>
                </div>
              </div>
              {showQR === b.id && (
                <div className="flex justify-center pt-3 border-t border-[#2A2A2A]">
                  <div className="text-center">
                    <QRCodeBrandEngine value={b.qr} size={150} />
                    <p className="text-xs text-slate-500 mt-2 font-mono">{b.qr}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

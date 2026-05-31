'use client';
import React, { useState } from 'react';
import { Users, CheckCircle2, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import QRCodeBrandEngine from '../../../../components/QRCodeBrandEngine';

const passagers = [
  { id: 'AR-74892374', nom: 'Fatou Diop', siege: '14A', statut: 'embarqué', tel: '+221 77 123 45 67', bagage: '12 kg' },
  { id: 'AR-84512987', nom: 'Mamadou Ndiaye', siege: '14B', statut: 'en attente', tel: '+221 78 987 65 43', bagage: '25 kg (+1000F)' },
  { id: 'AR-62019384', nom: 'Awa Fall', siege: '15A', statut: 'en attente', tel: '+221 70 456 78 90', bagage: 'Aucun' },
  { id: 'AR-11029384', nom: 'Ousmane Sow', siege: '15B', statut: 'absent', tel: '+221 76 543 21 09', bagage: '15 kg' },
];

const tabs = ['Tous (50)', 'Embarqués (48)', 'En attente (2)', 'Absents (0)'];

export default function SectionPassagers() {
  const [tab, setTab] = useState('Tous (50)');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Users className="w-5 h-5 text-orange-400" /> Manifeste Passagers</h2>
        <span className="bg-[#1A1A1A] border border-[#333333] px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300">TRIP-402 • Dakar ➔ Touba</span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${tab === t ? 'bg-orange-600 text-white' : 'bg-[#1A1A1A] text-slate-400 hover:text-white border border-[#2A2A2A]'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A]/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-[#1A1A1A]/50 border-b border-[#2A2A2A] text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-4 pl-6 font-semibold">Passager</th>
                <th className="py-4 font-semibold">Siège & Bagage</th>
                <th className="py-4 font-semibold">Statut</th>
                <th className="py-4 pr-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {passagers.map(p => (
                <tr key={p.id} className="hover:bg-[#222222]/30 transition-colors">
                  <td className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#222222] overflow-hidden shrink-0 hidden sm:block">
                        <QRCodeBrandEngine value={p.id} size={40} />
                      </div>
                      <div>
                        <p className="font-bold text-white">{p.nom}</p>
                        <p className="text-xs text-slate-500 font-mono">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="font-bold text-white">{p.siege}</p>
                    <p className="text-xs text-slate-400">{p.bagage}</p>
                  </td>
                  <td className="py-4">
                    {p.statut === 'embarqué' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30"><CheckCircle2 className="w-3 h-3" /> Embarqué</span>}
                    {p.statut === 'en attente' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30"><Clock className="w-3 h-3" /> En attente</span>}
                    {p.statut === 'absent' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30"><AlertCircle className="w-3 h-3" /> Absent</span>}
                  </td>
                  <td className="py-4 pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <button className="w-8 h-8 rounded-lg bg-[#222222] hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors" title="Message">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-[#222222] hover:bg-slate-700 flex items-center justify-center text-emerald-400 transition-colors" title="Appeler">
                        <Phone className="w-4 h-4" />
                      </button>
                      {p.statut === 'en attente' && (
                        <button className="h-8 px-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-colors">
                          Valider
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Clock(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}

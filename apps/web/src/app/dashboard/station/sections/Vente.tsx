'use client';
import React, { useState } from 'react';
import { Ticket, Search, User, CreditCard, CheckCircle2, Printer, Users } from 'lucide-react';
import { useModal } from '../../../../components/ModalContext';

export default function SectionVente() {
  const { showToast } = useModal();
  const [step, setStep] = useState(1);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 gap-4">
      {[
        { num: 1, label: 'Trajet' },
        { num: 2, label: 'Siège' },
        { num: 3, label: 'Passager' },
        { num: 4, label: 'Paiement' }
      ].map(s => (
        <React.Fragment key={s.num}>
          <div className={`flex items-center gap-2 ${step >= s.num ? 'text-orange-400' : 'text-slate-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${step >= s.num ? 'border-orange-400 bg-orange-500/10' : 'border-[#333333] bg-[#222222]'}`}>
              {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
            </div>
            <span className="text-xs font-bold hidden sm:block">{s.label}</span>
          </div>
          {s.num < 4 && <div className={`w-12 h-1 rounded-full ${step > s.num ? 'bg-orange-400' : 'bg-slate-700'}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2"><Ticket className="w-5 h-5 text-orange-400" /> Vente au Guichet (POS)</h2>

      <div className="bg-[#141414] border border-[#2A2A2A]/80 rounded-3xl p-6 lg:p-8">
        {renderStepIndicator()}

        {step === 1 && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Rechercher une destination ou un numéro de trajet..." className="w-full bg-[#1A1A1A] border-2 border-[#333333] focus:border-orange-500 rounded-2xl py-4 pl-12 pr-4 text-white outline-none transition-colors text-lg" />
            </div>
            
            <div className="space-y-3">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Prochains départs disponibles</p>
              {[
                { id: 'TRIP-402', dest: 'Touba', time: '14:30', places: 5, prix: 7000 },
                { id: 'TRIP-403', dest: 'Saint-Louis', time: '15:00', places: 12, prix: 8500 },
                { id: 'TRIP-404', dest: 'Thiès', time: '15:15', places: 2, prix: 3000 },
              ].map(t => (
                <div key={t.id} onClick={() => setStep(2)} className="bg-[#1A1A1A] border border-[#333333] hover:border-orange-500 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-500/20 text-orange-400 px-3 py-1.5 rounded-lg font-mono font-bold">{t.time}</div>
                    <div>
                      <h4 className="font-bold text-white text-lg">Dakar → {t.dest}</h4>
                      <p className="text-xs text-slate-400 font-mono mt-1">{t.id} • Bus Climatisé</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-400 text-lg">{t.prix} F</p>
                    <p className={`text-xs font-bold mt-1 ${t.places < 5 ? 'text-rose-400' : 'text-slate-400'}`}>{t.places} places</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-4xl mx-auto animate-in slide-in-from-right-8 duration-300">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 bg-[#1A1A1A] border border-[#333333] rounded-3xl p-6 flex flex-col items-center">
                <div className="w-full max-w-[200px] bg-[#222222] rounded-t-[3rem] h-20 mb-8 border-b-4 border-[#333333] flex items-end justify-center pb-2"><span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Avant du bus</span></div>
                <div className="grid grid-cols-4 gap-x-6 gap-y-4">
                  {Array.from({length: 20}).map((_, i) => {
                    const isOccupied = [1, 2, 5, 8, 12].includes(i);
                    const seatId = `${i+1}A`;
                    return (
                      <button key={i} disabled={isOccupied} onClick={() => setSelectedSeat(seatId)}
                        className={`w-12 h-12 rounded-t-xl rounded-b-md flex items-center justify-center font-bold text-sm transition-all
                          ${isOccupied ? 'bg-[#222222] text-slate-600 cursor-not-allowed' : 
                            selectedSeat === seatId ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] scale-110' : 
                            'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                        {seatId}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="w-full lg:w-80 space-y-6">
                <div className="bg-[#1A1A1A] border border-[#333333] rounded-2xl p-5">
                  <h3 className="font-bold text-white text-lg mb-1">Dakar → Touba</h3>
                  <p className="text-sm text-slate-400 mb-4">Aujourd'hui, 14:30</p>
                  <div className="flex justify-between items-center py-3 border-y border-[#2A2A2A] mb-4">
                    <span className="text-slate-400 text-sm">Siège sélectionné</span>
                    <span className="font-bold text-white text-lg">{selectedSeat || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-semibold">Total</span>
                    <span className="font-bold text-emerald-400 text-2xl">7 000 F</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 bg-[#222222] hover:bg-slate-700 text-white rounded-xl font-bold transition-colors">Retour</button>
                  <button disabled={!selectedSeat} onClick={() => setStep(3)} className="flex-[2] py-3 bg-orange-600 hover:bg-orange-500 disabled:bg-[#222222] disabled:text-slate-500 text-white rounded-xl font-bold transition-colors">Continuer</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-xl mx-auto space-y-6 animate-in slide-in-from-right-8 duration-300">
            <h3 className="text-xl font-bold text-white text-center">Informations Passager</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-400 block mb-2">Numéro de téléphone</label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="tel" placeholder="+221 77..." className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-orange-500 transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-400 block mb-2">Nom complet</label>
                <input type="text" placeholder="Ex: Moussa Diop" className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl py-3 px-4 text-white outline-none focus:border-orange-500 transition-colors" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-400 block mb-2">Pièce d'identité (Optionnel)</label>
                <input type="text" placeholder="CNI ou Passeport" className="w-full bg-[#1A1A1A] border border-[#333333] rounded-xl py-3 px-4 text-white outline-none focus:border-orange-500 transition-colors" />
              </div>
            </div>
            <div className="flex gap-2 pt-4 border-t border-[#2A2A2A]">
              <button onClick={() => setStep(2)} className="flex-1 py-3 bg-[#222222] hover:bg-slate-700 text-white rounded-xl font-bold transition-colors">Retour</button>
              <button onClick={() => setStep(4)} className="flex-[2] py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold transition-colors">Passer au Paiement</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="max-w-xl mx-auto space-y-6 text-center animate-in slide-in-from-right-8 duration-300">
            <h3 className="text-2xl font-bold text-white mb-2">Encaissement</h3>
            <p className="text-4xl font-bold text-emerald-400 mb-8">7 000 FCFA</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button className="bg-[#1A1A1A] border border-[#333333] hover:border-emerald-500 hover:bg-emerald-500/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all group">
                <CreditCard className="w-8 h-8 text-slate-400 group-hover:text-emerald-400" />
                <span className="font-bold text-white">Espèces</span>
              </button>
              <button className="bg-[#1A1A1A] border border-[#333333] hover:border-blue-500 hover:bg-blue-500/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all group">
                <div className="w-8 h-8 rounded-full bg-[#00a0e3] flex items-center justify-center font-bold text-white">W</div>
                <span className="font-bold text-white">Wave</span>
              </button>
            </div>

            <button onClick={() => { showToast("Billet généré avec succès !", 'success'); setStep(1); setSelectedSeat(null); }} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg transition-colors shadow-[0_0_20px_rgba(5,150,105,0.3)] flex items-center justify-center gap-2">
              <Printer className="w-5 h-5" /> Imprimer Billet & Terminer
            </button>
            <button onClick={() => setStep(3)} className="mt-4 text-sm font-semibold text-slate-400 hover:text-white transition-colors">Retour aux infos passager</button>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';
import React, { useState } from 'react';
import { QrCode, Camera, CheckCircle2, XCircle, User } from 'lucide-react';
import QRCodeBrandEngine from '../../../../components/QRCodeBrandEngine';

export default function SectionScanner() {
  const [scanResult, setScanResult] = useState<'idle' | 'valid' | 'invalid'>('idle');

  const handleScan = (type: 'valid' | 'invalid') => {
    setScanResult(type);
    setTimeout(() => setScanResult('idle'), 4000); // Reset after 4s
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2"><QrCode className="w-5 h-5 text-orange-400" /> Scanner de Billets</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera Viewfinder */}
        <div className="bg-[#101728] border border-slate-800/80 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-950 opacity-50" />
          
          <div className="relative z-10 w-64 h-64 border-2 border-orange-500/50 rounded-3xl flex items-center justify-center shadow-[0_0_0_9999px_rgba(15,23,42,0.8)] overflow-hidden">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-orange-500 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-orange-500 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-orange-500 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-orange-500 rounded-br-3xl" />
            
            {/* Ligne de scan animée */}
            <div className="w-full h-0.5 bg-orange-400 shadow-[0_0_10px_2px_#f97316] absolute animate-scan" />
            <Camera className="w-8 h-8 text-white/20" />
          </div>

          <p className="relative z-10 mt-6 text-sm font-semibold text-white">Placez le QR Code dans le cadre</p>

          {/* Boutons de test (pour la démo) */}
          <div className="relative z-10 mt-6 flex gap-3">
            <button onClick={() => handleScan('valid')} className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700">Test: Billet Valide</button>
            <button onClick={() => handleScan('invalid')} className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700">Test: Billet Invalide</button>
          </div>
        </div>

        {/* Résultat du Scan */}
        <div className="bg-[#101728] border border-slate-800/80 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4">
          {scanResult === 'idle' ? (
            <div className="opacity-50 space-y-3">
              <QrCode className="w-16 h-16 mx-auto text-slate-500" />
              <p className="text-sm font-medium">En attente de scan...</p>
            </div>
          ) : scanResult === 'valid' ? (
            <div className="space-y-5 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Billet Valide</h3>
                <p className="text-emerald-400 font-semibold mt-1">Embarquement autorisé</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-left w-full max-w-sm mx-auto space-y-3">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center"><User className="w-5 h-5 text-orange-400" /></div>
                  <div>
                    <p className="text-white font-bold">Mamadou Ndiaye</p>
                    <p className="text-xs text-slate-400">AR-74892374</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Siège</p>
                    <p className="text-lg font-bold text-white">14A</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Bagage</p>
                    <p className="text-sm font-bold text-white">1 (18 kg)</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-rose-500/20">
                <XCircle className="w-10 h-10 text-rose-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Billet Invalide</h3>
                <p className="text-rose-400 font-semibold mt-1">Déjà utilisé ou inconnu</p>
              </div>
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 w-full max-w-sm mx-auto">
                <p className="text-sm text-rose-300">Ce billet a déjà été scanné aujourd'hui à 08:14 pour ce trajet.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

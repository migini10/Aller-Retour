'use client';
import React, { useState } from 'react';
import { QrCode, Scan, CheckCircle2, XCircle, User, AlertTriangle } from 'lucide-react';

export default function SectionScanner() {
  const [scanState, setScanState] = useState<'idle' | 'valid' | 'invalid' | 'warning'>('idle');

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white flex items-center gap-2"><QrCode className="w-5 h-5 text-indigo-400" /> Scan & Contrôle de Billet</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Caméra & Scanner (Vue Opérateur) */}
        <div className="bg-[#101728] border border-slate-800/80 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-900" />
          
          <div className="relative z-10 w-72 h-72 rounded-3xl overflow-hidden border-2 border-indigo-500/50 shadow-[0_0_0_9999px_rgba(15,23,42,0.9)]">
            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
              <Scan className="w-16 h-16 text-slate-600 animate-pulse" />
            </div>
            {/* Ligne de scan dynamique */}
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_15px_3px_#6366f1] animate-scan" />
            
            {/* Corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-3xl" />
          </div>

          <p className="relative z-10 mt-8 font-bold text-white text-lg">Présentez le billet physique ou digital</p>
          <p className="relative z-10 mt-1 text-sm text-slate-400">Le scan se déclenche automatiquement.</p>

          <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-2">
            <button onClick={() => setScanState('valid')} className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-bold border border-emerald-500/30">Test Valide</button>
            <button onClick={() => setScanState('warning')} className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded text-xs font-bold border border-amber-500/30">Test Doublon</button>
            <button onClick={() => setScanState('invalid')} className="px-3 py-1 bg-rose-500/20 text-rose-400 rounded text-xs font-bold border border-rose-500/30">Test Invalide</button>
            <button onClick={() => setScanState('idle')} className="px-3 py-1 bg-slate-800 text-white rounded text-xs font-bold border border-slate-700">Reset</button>
          </div>
        </div>

        {/* Résultat d'analyse */}
        <div className="bg-[#101728] border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-center">
          {scanState === 'idle' && (
            <div className="text-center opacity-50 space-y-4">
              <QrCode className="w-20 h-20 mx-auto text-slate-500" />
              <p className="font-bold text-lg text-white">En attente de scan</p>
              <p className="text-sm text-slate-400">Les résultats s'afficheront ici de manière instantanée pour permettre un contrôle fluide.</p>
            </div>
          )}

          {scanState === 'valid' && (
            <div className="space-y-6 animate-in zoom-in duration-300">
              <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-500/30">
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white">Billet Valide</h3>
                <p className="text-emerald-400 font-bold mt-1 uppercase tracking-wider text-sm">Accès Autorisé</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center"><User className="w-6 h-6 text-slate-400" /></div>
                  <div>
                    <p className="font-bold text-white text-lg">Mamadou Ndiaye</p>
                    <p className="text-sm text-indigo-400 font-mono font-bold">AR-74892374</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-slate-500">Trajet</p><p className="font-bold text-white">Dakar → Touba</p></div>
                  <div><p className="text-xs text-slate-500">Départ</p><p className="font-bold text-white">14:30</p></div>
                  <div><p className="text-xs text-slate-500">Siège</p><p className="font-bold text-emerald-400 text-xl">14A</p></div>
                  <div><p className="text-xs text-slate-500">Paiement</p><p className="font-bold text-white">Payé (Wave)</p></div>
                </div>
              </div>
            </div>
          )}

          {scanState === 'warning' && (
            <div className="space-y-6 animate-in zoom-in duration-300">
              <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto border-4 border-amber-500/30">
                <AlertTriangle className="w-12 h-12 text-amber-400" />
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white">Billet Déjà Scanné</h3>
                <p className="text-amber-400 font-bold mt-1 uppercase tracking-wider text-sm">Suspicion de doublon</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 text-center">
                <p className="text-amber-200">Ce billet (AR-74892374) a déjà été validé à 14:12 par l'agent Ousmane au guichet principal.</p>
                <button className="mt-4 w-full bg-slate-900 border border-amber-500/50 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors">Forcer l'autorisation (Admin)</button>
              </div>
            </div>
          )}

          {scanState === 'invalid' && (
            <div className="space-y-6 animate-in zoom-in duration-300">
              <div className="w-24 h-24 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto border-4 border-rose-500/30">
                <XCircle className="w-12 h-12 text-rose-400" />
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white">Billet Inconnu</h3>
                <p className="text-rose-400 font-bold mt-1 uppercase tracking-wider text-sm">Accès Refusé</p>
              </div>
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 text-center">
                <p className="text-rose-200">QR Code invalide ou n'appartenant pas au réseau Aller-Retour. Veuillez rediriger le voyageur vers le guichet.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

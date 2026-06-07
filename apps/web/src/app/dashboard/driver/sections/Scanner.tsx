'use client';
import React, { useState, useEffect } from 'react';
import { QrCode, Camera, CheckCircle2, XCircle, User } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export default function SectionScanner() {
  const [scanResult, setScanResult] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [hasCameraError, setHasCameraError] = useState(false);

  useEffect(() => {
    let html5QrCode: Html5Qrcode;

    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode("reader");
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            // Simulated valid check
            handleScan('valid');
          },
          (errorMessage) => {
            // Ignore parsing errors (very frequent when no QR code is in frame)
          }
        );
      } catch (err) {
        console.error("Camera error:", err);
        setHasCameraError(true);
      }
    };

    // Small delay to ensure the DOM element exists before starting
    setTimeout(() => {
      startScanner();
    }, 500);

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().then(() => html5QrCode.clear()).catch(console.error);
      }
    };
  }, []);

  const handleScan = (type: 'valid' | 'invalid') => {
    setScanResult(type);
    setTimeout(() => setScanResult('idle'), 4000); // Reset after 4s
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors"><QrCode className="w-5 h-5 text-orange-500 dark:text-orange-400" /> Scanner de Billets</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera Viewfinder */}
        <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A]/80 rounded-3xl p-6 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden transition-colors">
          <div className="absolute inset-0 bg-black opacity-50" />
          
          <div className="relative z-10 w-64 h-64 border-2 border-orange-500/50 rounded-3xl flex items-center justify-center shadow-[0_0_0_9999px_rgba(15,23,42,0.8)] overflow-hidden">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-orange-500 rounded-tl-3xl z-20" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-orange-500 rounded-tr-3xl z-20" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-orange-500 rounded-bl-3xl z-20" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-orange-500 rounded-br-3xl z-20" />
            
            {/* Ligne de scan animée */}
            <div className="w-full h-0.5 bg-orange-400 shadow-[0_0_10px_2px_#f97316] absolute animate-scan z-20" />
            
            {/* Flux Caméra Réel */}
            <div className="absolute inset-0 z-10 bg-black/50 overflow-hidden">
              <div id="reader" className="w-full h-full [&_video]:object-cover [&_video]:w-full [&_video]:h-full" />
              {hasCameraError && <Camera className="w-8 h-8 text-white/20 absolute inset-0 m-auto z-10" />}
            </div>
          </div>

          <p className="relative z-10 mt-6 text-sm font-semibold text-white">Placez le QR Code dans le cadre</p>

          {/* Boutons de test (pour la démo) */}
          <div className="relative z-10 mt-6 flex gap-3">
            <button onClick={() => handleScan('valid')} className="text-xs bg-slate-100 dark:bg-[#222222] text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#333333] transition-colors">Test: Billet Valide</button>
            <button onClick={() => handleScan('invalid')} className="text-xs bg-slate-100 dark:bg-[#222222] text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#333333] transition-colors">Test: Billet Invalide</button>
          </div>
        </div>

        {/* Résultat du Scan */}
        <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A]/80 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4 transition-colors">
          {scanResult === 'idle' ? (
            <div className="opacity-50 space-y-3">
              <QrCode className="w-16 h-16 mx-auto text-slate-500" />
              <p className="text-sm font-medium text-slate-900 dark:text-white transition-colors">En attente de scan...</p>
            </div>
          ) : scanResult === 'valid' ? (
            <div className="space-y-5 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Billet Valide</h3>
                <p className="text-emerald-500 dark:text-emerald-400 font-semibold mt-1 transition-colors">Embarquement autorisé</p>
              </div>
              <div className="bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-5 text-left w-full max-w-sm mx-auto space-y-3 transition-colors">
                <div className="flex items-center gap-3 border-b border-slate-200 dark:border-[#2A2A2A] pb-3 transition-colors">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center transition-colors"><User className="w-5 h-5 text-orange-500 dark:text-orange-400" /></div>
                  <div>
                    <p className="text-slate-900 dark:text-white font-bold transition-colors">Mamadou Ndiaye</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">AR-74892374</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Siège</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white transition-colors">14A</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Bagage</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white transition-colors">1 (18 kg)</p>
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
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Billet Invalide</h3>
                <p className="text-rose-500 dark:text-rose-400 font-semibold mt-1 transition-colors">Déjà utilisé ou inconnu</p>
              </div>
              <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-2xl p-5 w-full max-w-sm mx-auto transition-colors">
                <p className="text-sm text-rose-600 dark:text-rose-300 transition-colors">Ce billet a déjà été scanné aujourd'hui à 08:14 pour ce trajet.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

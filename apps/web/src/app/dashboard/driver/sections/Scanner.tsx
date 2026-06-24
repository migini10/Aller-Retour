'use client';
import React, { useState, useEffect } from 'react';
import { QrCode, Camera, CheckCircle2, XCircle, User } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export default function SectionScanner() {
  const [scanResult, setScanResult] = useState<'idle' | 'valid' | 'invalid' | 'already_used' | 'success' | 'scanning'>('idle');
  const [scanCode, setScanCode] = useState('');
  const [scanData, setScanData] = useState<any>(null);
  const [hasCameraError, setHasCameraError] = useState(false);
  const scannerStarted = React.useRef(false);

  useEffect(() => {
    if (scannerStarted.current) return;
    scannerStarted.current = true;

    let html5QrCode: Html5Qrcode;

    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode("reader");
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
          },
          (decodedText) => {
            // Un vrai scan est détecté
            setScanCode(decodedText);
            handleScanApi(decodedText);
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

  const handleScanApi = async (code: string) => {
    if (!code.trim()) return;
    try {
      const res = await fetch('/api/tickets/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCodeToken: code.trim(), action: 'info' }),
      });
      const data = await res.json();
      setScanData(data);
      setScanResult(data.status as any);
      if (data.status !== 'valid') {
        setTimeout(() => {
          setScanResult('idle');
          setScanCode('');
        }, 5000); // Reset after 5s if not valid
      }
    } catch (error) {
      console.error(error);
      setScanResult('invalid');
      setTimeout(() => setScanResult('idle'), 4000);
    }
  };

  const handleBoarding = async () => {
    if (!scanCode.trim()) return;
    setScanResult('scanning');
    try {
      const res = await fetch('/api/tickets/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCodeToken: scanCode.trim(), action: 'board' }),
      });
      const data = await res.json();
      setScanData(data);
      setScanResult(data.status as any); // Should be 'success'
      setTimeout(() => {
        setScanResult('idle');
        setScanCode('');
      }, 3000);
    } catch (error) {
      setScanResult('invalid');
      setTimeout(() => setScanResult('idle'), 4000);
    }
  };

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
            <div className="absolute inset-0 z-10 bg-black overflow-hidden flex items-center justify-center">
              <div id="reader" style={{ width: '100%', minHeight: '100%' }} />
              {hasCameraError && <Camera className="w-8 h-8 text-white/20 absolute inset-0 m-auto z-10" />}
            </div>
          </div>

          <p className="relative z-10 mt-6 text-sm font-semibold text-white">Placez le QR Code dans le cadre</p>

          {/* Saisie Manuelle */}
          <div className="relative z-10 mt-6 w-full max-w-sm flex gap-2">
            <input 
              type="text" 
              placeholder="Numéro du billet (ex: AR-1234)"
              className="flex-1 bg-white/10 dark:bg-black/40 border border-slate-200/20 dark:border-white/10 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-slate-400"
              value={scanCode}
              onChange={(e) => setScanCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScanApi(scanCode)}
            />
            <button 
              onClick={() => handleScanApi(scanCode)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
            >
              Valider
            </button>
          </div>

          {/* Boutons de test (pour la démo) */}
          <div className="relative z-10 mt-6 flex gap-3">
            <button onClick={() => handleScanApi('AR-TEST-VALID')} className="text-xs bg-slate-100 dark:bg-[#222222] text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#333333] transition-colors">Test</button>
          </div>
        </div>

        {/* Résultat du Scan */}
        <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A]/80 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4 transition-colors">
          {scanResult === 'idle' ? (
            <div className="opacity-50 space-y-3">
              <QrCode className="w-16 h-16 mx-auto text-slate-500" />
              <p className="text-sm font-medium text-slate-900 dark:text-white transition-colors">En attente de scan...</p>
            </div>
          ) : scanResult === 'scanning' ? (
            <div className="opacity-50 space-y-3">
              <div className="w-16 h-16 mx-auto border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-slate-900 dark:text-white transition-colors">Vérification...</p>
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
                    <p className="text-slate-900 dark:text-white font-bold transition-colors">{scanData?.passengerName || 'Passager'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">{scanData?.route || 'Trajet'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Siège</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white transition-colors">{scanData?.seatNumber || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Bagage</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white transition-colors">Standard</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => {
                    setScanResult('idle');
                    setScanCode('');
                  }} 
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-[#1A1A1A] dark:hover:bg-[#222222] text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl text-sm transition-colors border border-slate-200 dark:border-[#333333]"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleBoarding}
                  className="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-lg shadow-emerald-500/20"
                >
                  Valider l'embarquement
                </button>
              </div>
            </div>
          ) : scanResult === 'success' ? (
            <div className="space-y-5 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Embarquement Réussi</h3>
                <p className="text-emerald-500 dark:text-emerald-400 font-semibold mt-1 transition-colors">{scanData?.message || 'Le passager est à bord.'}</p>
              </div>
            </div>
          ) : scanResult === 'already_used' ? (
            <div className="space-y-5 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-amber-500/20">
                <CheckCircle2 className="w-10 h-10 text-amber-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Billet Déjà Utilisé</h3>
                <p className="text-amber-500 dark:text-amber-400 font-semibold mt-1 transition-colors">L'embarquement a déjà été validé</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-5 w-full max-w-sm mx-auto transition-colors">
                <p className="text-sm text-amber-600 dark:text-amber-300 transition-colors">{scanData?.message || "Ce billet a déjà été scanné."}</p>
                <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mt-2">{scanData?.passengerName} - Siège {scanData?.seatNumber}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-rose-500/20">
                <XCircle className="w-10 h-10 text-rose-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Billet Invalide</h3>
                <p className="text-rose-500 dark:text-rose-400 font-semibold mt-1 transition-colors">Inconnu ou annulé</p>
              </div>
              <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-2xl p-5 w-full max-w-sm mx-auto transition-colors">
                <p className="text-sm text-rose-600 dark:text-rose-300 transition-colors">{scanData?.message || "Ce billet est introuvable."}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

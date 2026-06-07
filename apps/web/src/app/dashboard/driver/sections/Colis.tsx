'use client';
import React, { useState, useEffect } from 'react';
import { Package, MapPin, Clock, CheckCircle2, Truck, AlertTriangle } from 'lucide-react';

export default function SectionColis() {
  const [colis, setColis] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [debugError, setDebugError] = useState<string | null>(null);

  // Security PIN states
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState('');
  const [selectedColisForAction, setSelectedColisForAction] = useState<string | null>(null);
  const [nextStatutForAction, setNextStatutForAction] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    loadColis();
    const interval = setInterval(loadColis, 5000); // Polling for real-time sync demo
    window.addEventListener('colis_updated', loadColis);
    return () => {
      clearInterval(interval);
      window.removeEventListener('colis_updated', loadColis);
    };
  }, []);

  const loadColis = async () => {
    try {
      const res = await fetch(`/api/colis?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        try {
          const text = await res.text();
          const data = JSON.parse(text);
          if (Array.isArray(data)) {
            setColis(data);
            setDebugError(null);
          } else {
            setDebugError("Data is not an array: " + text.substring(0, 100));
          }
        } catch (parseErr: any) {
          setDebugError("JSON Parse Error: " + parseErr.message);
        }
      } else {
        setDebugError(`Fetch not OK: ${res.status} ${res.statusText}`);
      }
    } catch (e: any) {
      console.error(e);
      setDebugError(`Fetch Error: ${e.message}`);
    }
  };

  const updateStatut = async (id: string, nextStatut: string) => {
    try {
      const res = await fetch(`/api/colis/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: nextStatut }),
      });
      if (res.ok) {
        loadColis();
        window.dispatchEvent(new Event('colis_updated'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleActionClick = (id: string, nextStatut: string) => {
    setSelectedColisForAction(id);
    setNextStatutForAction(nextStatut);
    setPinCode('');
    setPinError('');
    setIsPinModalOpen(true);
  };

  const confirmAction = () => {
    if (pinCode === '1234') {
      if (selectedColisForAction && nextStatutForAction) {
        updateStatut(selectedColisForAction, nextStatutForAction);
      }
      setIsPinModalOpen(false);
    } else {
      setPinError('Code de sécurité incorrect.');
    }
  };

  const getActionBtn = (c: any) => {
    switch (c.statut) {
      case 'En attente de prise en charge':
        return (
          <button 
            onClick={() => handleActionClick(c.id, 'Accepté')}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" /> Accepter la course
          </button>
        );
      case 'Accepté':
        return (
          <button 
            onClick={() => handleActionClick(c.id, 'En transit')}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <Package className="w-4 h-4 shrink-0" /> Colis récupéré
          </button>
        );
      case 'En transit':
        return (
          <button 
            onClick={() => handleActionClick(c.id, 'Livré')}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <MapPin className="w-4 h-4 shrink-0" /> Livrer au destinataire
          </button>
        );
      case 'Livré':
        return (
          <div className="w-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> Terminé
          </div>
        );
      default:
        return null;
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-6 shadow-sm transition-colors">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-orange-500" />
            Gestion des Colis
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Acceptez, transportez et mettez à jour le statut des colis.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {debugError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 font-mono text-sm break-words">
            DEBUG ERROR: {debugError}
          </div>
        )}
        {colis.length === 0 && !debugError ? (
          <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-8 text-center transition-colors">
            <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Aucun colis disponible pour le moment.</p>
          </div>
        ) : (
          colis.map((c, idx) => {
            const isAccepted = c.statut === 'Accepté';
            const isTransit = c.statut === 'En transit';
            const isDelivered = c.statut === 'Livré';
            
            // Explicit tailwind classes map to prevent compiler stripping
            let progressColorStr = 'orange-500';
            let borderColor = 'border-orange-500/30';
            let hoverBorderColor = 'hover:border-orange-500/60';
            let bgColor = 'bg-orange-500/10';
            let iconBorderColor = 'border-orange-500/20';
            let textColor = 'text-orange-500';

            if (isAccepted) {
              progressColorStr = 'blue-500';
              borderColor = 'border-blue-500/30';
              hoverBorderColor = 'hover:border-blue-500/60';
              bgColor = 'bg-blue-500/10';
              iconBorderColor = 'border-blue-500/20';
              textColor = 'text-blue-500';
            }
            if (isTransit) {
              progressColorStr = 'indigo-500';
              borderColor = 'border-indigo-500/30';
              hoverBorderColor = 'hover:border-indigo-500/60';
              bgColor = 'bg-indigo-500/10';
              iconBorderColor = 'border-indigo-500/20';
              textColor = 'text-indigo-500';
            }
            if (isDelivered) {
              progressColorStr = 'emerald-500';
              borderColor = 'border-emerald-500/30';
              hoverBorderColor = 'hover:border-emerald-500/60';
              bgColor = 'bg-emerald-500/10';
              iconBorderColor = 'border-emerald-500/20';
              textColor = 'text-emerald-500';
            }

            return (
            <div key={idx} className={`bg-white dark:bg-[#141414] border ${borderColor} ${hoverBorderColor} rounded-3xl p-4 sm:p-5 shadow-sm transition-all flex flex-col lg:flex-row gap-5 lg:gap-6`}>
              
              {/* Infos principales */}
              <div className="flex-1 min-w-0 flex items-start gap-4 sm:gap-5">
                <div className={`hidden sm:flex w-12 h-12 rounded-xl ${bgColor} items-center justify-center shrink-0 border ${iconBorderColor}`}>
                  {isDelivered ? <CheckCircle2 className={`w-6 h-6 ${textColor}`} /> : <Package className={`w-6 h-6 ${textColor}`} />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`font-mono text-xs font-bold ${textColor} ${bgColor} px-2 py-1 rounded-md border ${iconBorderColor} whitespace-nowrap`}>
                      {c.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md border uppercase tracking-wider whitespace-nowrap ${textColor} ${bgColor} ${iconBorderColor}`}>
                      {c.statut}
                    </span>
                  </div>
                  
                  <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg mb-2 leading-snug break-words">
                    {c.trajet || 'Trajet Inconnu'}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <Clock className="w-4 h-4 shrink-0" />
                      {c.date}
                    </div>
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <Package className="w-4 h-4 shrink-0" />
                      {c.taille || 'Taille Inconnue'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Destinataire & Bouton */}
              <div className="flex flex-col sm:flex-row lg:flex-col justify-between items-stretch sm:items-center lg:items-stretch gap-4 shrink-0 lg:w-64">
                <div className="flex-1 bg-slate-50 dark:bg-[#1A1A1A] rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-[#222222]">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Destinataire</p>
                  <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{c.destinataire || 'Inconnu'}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5 truncate">{c.tel || 'Aucun numéro'}</p>
                </div>
                <div className="sm:w-48 lg:w-full shrink-0">
                  {getActionBtn(c)}
                </div>
              </div>

            </div>
          )})
        )}
      </div>

      {/* Modal Code de Sécurité */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#141414] rounded-2xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">
              {nextStatutForAction === 'Accepté' ? 'Contrat de Responsabilité' : 'Code de sécurité'}
            </h3>
            
            {nextStatutForAction === 'Accepté' && (
              <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl p-4 mb-4">
                <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-400 font-medium leading-relaxed text-center">
                  En saisissant votre code PIN, vous signez électroniquement ce contrat. 
                  <span className="font-bold"> Vous devenez l'unique responsable de ce colis du début à la fin de la course.</span> En cas de perte, de vol ou de dommage entraînant une demande de remboursement du client, vous en assumerez intégralement les frais.
                </p>
              </div>
            )}

            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 text-center">
              Veuillez entrer votre code d'accès chauffeur (ex: <span className="font-mono font-bold text-slate-900 dark:text-white">1234</span>) pour valider cette action.
            </p>
            
            <input 
              type="password" 
              maxLength={4}
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-4 text-center text-3xl font-mono tracking-[1em] text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all mb-2"
              placeholder="••••"
              autoFocus
            />
            
            <div className="h-6 mb-4">
              {pinError && <p className="text-rose-500 text-sm font-semibold text-center animate-in slide-in-from-top-1">{pinError}</p>}
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setIsPinModalOpen(false)}
                className="flex-1 py-3.5 font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {nextStatutForAction === 'Accepté' ? 'Refuser' : 'Annuler'}
              </button>
              <button 
                onClick={confirmAction}
                className={`flex-1 py-3.5 font-bold text-white rounded-xl transition-colors shadow-lg ${
                  nextStatutForAction === 'Accepté' 
                    ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20' 
                    : 'bg-orange-600 hover:bg-orange-500 shadow-orange-500/20'
                }`}
              >
                {nextStatutForAction === 'Accepté' ? 'Signer et Valider' : 'Valider'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

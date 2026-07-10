'use client';
import React, { useState, useEffect } from 'react';
import { Package, MapPin, Clock, CheckCircle2, Truck, AlertTriangle, ArrowLeftRight, Loader2, Check, Navigation, X } from 'lucide-react';
import { ApiClient } from '@/lib/api.client';
export default function SectionColis() {
  const [colis, setColis] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [debugError, setDebugError] = useState<string | null>(null);

  // Security PIN states
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState('');
  
  const [trackingColisDest, setTrackingColisDest] = useState<string | null>(null);

  const [selectedColisForAction, setSelectedColisForAction] = useState<string | null>(null);
  const [nextStatutForAction, setNextStatutForAction] = useState<string | null>(null);

  const [activeTripId, setActiveTripId] = useState<string>('');
  const [tripInput, setTripInput] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      if (activeTripId) loadColis(activeTripId);
    }, 5000);
    window.addEventListener('colis_updated', () => {
      if (activeTripId) loadColis(activeTripId);
    });
    return () => {
      clearInterval(interval);
      window.removeEventListener('colis_updated', () => {});
    };
  }, [activeTripId]);

  const handleSearchTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (tripInput.trim()) {
      setActiveTripId(tripInput.trim());
      loadColis(tripInput.trim());
    }
  };

  const loadColis = async (tripId: string) => {
    try {
      const data = await ApiClient.get(`/v1/parcels/driver/trip/${tripId}`);
      if (data) {
        const mapped = data.map((c: any) => ({
          ...c,
          id: c.trackingCode || c.id,
          statut: c.status === 'REGISTERED' ? 'En attente de prise en charge' : c.status === 'ACCEPTED' ? 'Accepté' : c.status === 'IN_TRANSIT' ? 'En transit' : c.status === 'DELIVERED' ? 'Livré' : c.status,
          trajet: `${c.pickupCity || '...'} → ${c.deliveryCity || '...'}`,
          date: new Date(c.createdAt).toLocaleDateString('fr-FR'),
          taille: c.size,
          destinataire: c.recipientName,
          tel: c.recipientPhone
        }));
        setColis(mapped);
        setDebugError(null);
      }
    } catch (e: any) {
      console.error(e);
      setDebugError(`Fetch Error: ${e.message}`);
    }
  };

  const updateStatut = async (id: string, nextStatut: string, pin: string) => {
    const statusMap: any = {
      'Accepté': 'ACCEPTED',
      'En transit': 'IN_TRANSIT',
      'Livré': 'DELIVERED',
    };
    try {
      await ApiClient.patch(`/v1/parcels/${id}/status`, { 
        status: statusMap[nextStatut] || nextStatut, 
        pin 
      });
      if (activeTripId) loadColis(activeTripId);
      window.dispatchEvent(new Event('colis_updated'));
      setIsPinModalOpen(false);
    } catch (e: any) {
      console.error(e);
      setPinError(e.message || 'Erreur lors de la mise à jour.');
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
    if (!selectedColisForAction || !nextStatutForAction) return;

    if (nextStatutForAction !== 'Livré') {
      if (pinCode !== '1234') {
        setPinError('Code de sécurité chauffeur incorrect.');
        return;
      }
    }
    
    updateStatut(selectedColisForAction, nextStatutForAction, pinCode);
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
        const dest = c.trajet ? c.trajet.split(/[-→]/).pop().trim() : 'Destination';
        return (
          <div className="flex flex-col gap-2 w-full">
            <button 
              onClick={() => setTrackingColisDest(dest)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <MapPin className="w-4 h-4 shrink-0" /> En route vers {dest}
            </button>
            <button 
              onClick={() => handleActionClick(c.id, 'Livré')}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" /> Livrer au destinataire
            </button>
          </div>
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-6 shadow-sm transition-colors gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3 transition-colors">
            <Package className="w-6 h-6 text-orange-500" />
            Gestion des Colis
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">Saisissez l'ID de votre Trajet pour gérer les colis associés.</p>
        </div>
        
        <form onSubmit={handleSearchTrip} className="w-full md:w-auto flex gap-2">
          <input 
            type="text" 
            placeholder="Ex: TRIP-1234" 
            value={tripInput}
            onChange={(e) => setTripInput(e.target.value)}
            className="flex-1 md:w-64 px-4 py-2 bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-sm focus:outline-none focus:border-orange-500 text-slate-900 dark:text-white"
          />
          <button type="submit" className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold text-sm transition-colors">
            Charger
          </button>
        </form>
      </div>

      {debugError && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-rose-600 text-sm">
          {debugError}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {!activeTripId ? (
        <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-3xl p-12 text-center shadow-sm">
          <Package className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Aucun Trajet Sélectionné</h3>
          <p className="text-slate-500 dark:text-slate-400">Veuillez entrer l'ID de votre trajet en haut pour voir les colis à transporter.</p>
        </div>
      ) : colis.filter((c: any) => c.statut !== 'Livré').length === 0 && !debugError ? (
          <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-8 text-center transition-colors">
            <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Aucun colis actif en cours de livraison.</p>
          </div>
        ) : (
          (() => {
            return colis.filter((c: any) => c.statut !== 'Livré');
          })().map((c: any, idx: number) => {
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
                      {c.date} {c.time ? `à ${c.time}` : ''}
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
                <div className="sm:w-48 lg:w-full shrink-0 flex flex-col gap-2">
                  {getActionBtn(c)}
                </div>
              </div>

            </div>
          );
        })
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
              {nextStatutForAction === 'Livré' 
                ? "Veuillez saisir le code de livraison à 4 chiffres fourni par le destinataire pour finaliser."
                : "Veuillez entrer votre code d'accès chauffeur (ex: 1234) pour valider cette action."}
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

      {trackingColisDest && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-[#141414] animate-in fade-in zoom-in-95 duration-200">
          <div className="flex-none p-4 sm:p-6 border-b border-slate-200 dark:border-[#2A2A2A] flex justify-between items-center bg-white/80 dark:bg-[#141414]/80 backdrop-blur z-20">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Livraison de colis en cours</h2>
              <p className="text-sm font-mono text-slate-500 mt-1">Colis Express</p>
            </div>
            <button onClick={() => setTrackingColisDest(null)} className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 font-bold rounded-xl transition-colors text-sm">
              Terminer la navigation
            </button>
          </div>
          
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-slate-100 dark:bg-[#1A1A1A]">
              <iframe 
                src={`https://maps.google.com/maps?saddr=Dakar,+Senegal&daddr=${encodeURIComponent(trackingColisDest + ', Senegal')}&output=embed`}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 z-0 opacity-100"
              ></iframe>
            </div>
            <div className="absolute top-0 left-0 right-0 h-24 z-10" onPointerDownCapture={(e) => e.stopPropagation()} />
            <div className="absolute bottom-0 left-0 right-0 h-16 z-10" onPointerDownCapture={(e) => e.stopPropagation()} />
            <div className="absolute inset-0 bg-[#0a1520]/10 pointer-events-none z-10" />
 
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-20">
              <div className="bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-md p-4 rounded-3xl border border-slate-200/50 dark:border-[#333333]/50 shadow-2xl animate-bounce-slow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-blue-500/20">
                    <Navigation className="text-blue-500 w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider mb-0.5">En route vers</p>
                    <h3 className="text-slate-900 dark:text-white font-bold text-base">{trackingColisDest}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      )}

    </div>
  );
}

'use client';
import React, { useState, useEffect } from 'react';
import { Users, CheckCircle2, Phone, MessageSquare, AlertCircle, ArrowLeftRight, Check, Loader2, Clock } from 'lucide-react';
import { ApiClient } from '@/lib/api.client';
import QRCodeBrandEngine from '../../../../components/QRCodeBrandEngine';
import { useModal } from '../../../../components/ModalContext';

// Mock de passagers initiaux pour le trajet TRIP-402
const initialPassagers = [
  { id: 'AR-74892374', nom: 'Fatou Diop', siege: '3', statut: 'embarqué', tel: '+221 77 123 45 67', bagage: '12 kg' },
  { id: 'AR-84512987', nom: 'Mamadou Ndiaye', siege: '1', statut: 'en attente', tel: '+221 78 987 65 43', bagage: '25 kg (+1000F)' },
  { id: 'AR-62019384', nom: 'Awa Fall', siege: '2', statut: 'en attente', tel: '+221 70 456 78 90', bagage: 'Aucun' },
  { id: 'AR-11029384', nom: 'Ousmane Sow', siege: '4', statut: 'absent', tel: '+221 76 543 21 09', bagage: '15 kg' },
];

// Trajets cibles éligibles pour le transfert
const mockTargetTrips = [
  { id: 'TRIP-501', chauffeur: 'Moustapha Dieng', vehicule: 'Toyota 7 Places (DK-4829-AZ)', heure: '15:00', placesLibres: 3, isLocked: false },
  { id: 'TRIP-502', chauffeur: 'Abdoulaye Sow', vehicule: 'Peugeot 505 particulier (DK-9218-BY)', heure: '15:15', placesLibres: 4, isLocked: true },
  { id: 'TRIP-503', chauffeur: 'Cheikh Gueye', vehicule: 'Bus 50 Places (DK-7711-CX)', heure: '16:00', placesLibres: 20, isLocked: false },
];

export default function SectionPassagers() {
  const { showToast } = useModal();
  const [passagers, setPassagers] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [targetTrips, setTargetTrips] = useState<any[]>([]);
  const [selectedTargetTripId, setSelectedTargetTripId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);
  
  // Capacité du véhicule : 7 places (particulier) -> pas de numéro de siège
  const [vehicleCapacity, setVehicleCapacity] = useState(7); 
  const isParticularVehicle = vehicleCapacity <= 7;

  const [tripInfo, setTripInfo] = useState<any>({ displayId: 'TRIP-402', trajet: 'Dakar ➔ Touba' });
  const [securityCode, setSecurityCode] = useState('');
  const [pinError, setPinError] = useState('');
  const [loading, setLoading] = useState(true);
  const [tripId, setTripId] = useState<string>('');

  useEffect(() => {
    const storedTripId = localStorage.getItem('transfer_source_trip_id') || 'TRIP-402';
    setTripId(storedTripId);

    const shouldAutoOpen = localStorage.getItem('auto_open_transfer_modal') === 'true';
    if (shouldAutoOpen) {
      setIsTransferModalOpen(true);
      localStorage.removeItem('auto_open_transfer_modal');
    }

    const loadData = async () => {
      try {
        setLoading(true);
        // 1. Fetch manifest
        try {
          const manifest = await ApiClient.get(`/v1/trips/${storedTripId}/manifest`);
          if (manifest) {
            setPassagers(manifest.tickets || []);
            setVehicleCapacity(manifest.vehicleCapacity || 7);
            setTripInfo({
              displayId: manifest.displayId || storedTripId,
              trajet: manifest.trajet || 'Dakar ➔ Touba'
            });
          }
        } catch (e) {
          // Fallback to mock
          setPassagers(initialPassagers);
          setVehicleCapacity(7);
        }

        // 2. Fetch target trips
        try {
          const targets = await ApiClient.get(`/v1/trips/${storedTripId}/transfer-targets`);
          if (targets) {
            setTargetTrips(targets || []);
          }
        } catch (e) {
          setTargetTrips(mockTargetTrips);
        }
      } catch (err) {
        console.error('Error fetching manifest or transfer targets:', err);
        setPassagers(initialPassagers);
        setTargetTrips(mockTargetTrips);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSelectOneInModal = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const executeTransfer = async () => {
    if (!selectedTargetTripId || selectedIds.length === 0) return;
    if (securityCode !== '123456') {
      setPinError('Code PIN incorrect (Démo : 123456).');
      return;
    }
    setIsSubmitting(true);
    
    try {
      const data = await ApiClient.post('/v1/bookings/transfer', {
        bookingIds: selectedIds,
        targetTripId: selectedTargetTripId
      });

      if (data && data.success) {
        setIsSubmitting(false);
        setTransferSuccess(true);
        
        // Mettre à jour la liste des passagers en enlevant ceux transférés
        setPassagers(prev => prev.filter(p => !selectedIds.includes(p.id)));
        
        // Mettre à jour les places du trajet cible
        setTargetTrips(prev => prev.map(t => 
          t.id === selectedTargetTripId 
            ? { ...t, placesLibres: Math.max(0, t.placesLibres - selectedIds.length) }
            : t
        ));
        
        setTimeout(() => {
          setIsTransferModalOpen(false);
          setTransferSuccess(false);
          setSelectedIds([]);
          setSelectedTargetTripId(null);
        }, 2000);
      } else {
        showToast(data?.error || 'Une erreur est survenue lors du transfert.', 'error');
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error('Transfer API error:', error);
      showToast(error.message || 'Erreur réseau lors du transfert.', 'error');
      setIsSubmitting(false);
    }
  };

  const handleOpenTransferModal = () => {
    setSelectedIds([]);
    setSelectedTargetTripId(null);
    setSecurityCode('');
    setPinError('');
    setIsTransferModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors">
            <Users className="w-5 h-5 text-orange-500 dark:text-orange-400" /> Manifeste Passagers
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isParticularVehicle ? '🚗 Véhicule Particulier (Placement Libre • Sans numéro de siège)' : '🚌 Autocar (Sièges numérotés)'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-slate-100 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333333] px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors">
            {tripInfo.displayId} • {tripInfo.trajet}
          </span>
          <button 
            disabled={loading || passagers.length === 0}
            onClick={handleOpenTransferModal}
            className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-orange-600/10 flex items-center gap-1.5"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Transférer des Clients
          </button>
          <button 
            onClick={() => setVehicleCapacity(prev => prev === 7 ? 50 : 7)} 
            className="text-xs bg-slate-100 dark:bg-[#1A1A1A] hover:bg-slate-200 dark:hover:bg-[#222] border border-slate-200 dark:border-[#33] text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl font-semibold transition-colors"
          >
            Changer véhicule ({vehicleCapacity === 7 ? 'Bus 50 pl.' : 'Particular 7 pl.'})
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A]/80 rounded-2xl overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#1A1A1A]/50 border-b border-slate-200 dark:border-[#2A2A2A] text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider transition-colors">
                <th className="py-4 pl-6 font-semibold">Passager</th>
                <th className="py-4 font-semibold">Siège & Bagage</th>
                <th className="py-4 font-semibold">Statut</th>
                <th className="py-4 pr-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-sm transition-colors">
              {passagers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500">
                    Aucun passager sur ce trajet.
                  </td>
                </tr>
              ) : (
                passagers.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-[#222222]/30 transition-colors">
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#222222] overflow-hidden shrink-0 hidden sm:block transition-colors">
                          <QRCodeBrandEngine value={p.id} size={40} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white transition-colors">{p.nom}</p>
                          <p className="text-xs text-slate-500 font-mono transition-colors">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="font-bold text-slate-900 dark:text-white transition-colors">
                        {isParticularVehicle ? 'Placement libre' : `Siège ${p.siege}`}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">{p.bagage}</p>
                    </td>
                    <td className="py-4">
                      {p.statut === 'embarqué' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30"><CheckCircle2 className="w-3 h-3" /> Embarqué</span>}
                      {p.statut === 'en attente' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30"><Clock className="w-3 h-3" /> En attente</span>}
                      {p.statut === 'absent' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30"><AlertCircle className="w-3 h-3" /> Absent</span>}
                    </td>
                    <td className="py-4 pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <button className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#222222] hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 transition-colors" title="Message">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <a href={`tel:${p.tel}`} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#222222] hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400 transition-colors" title="Appeler">
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transfer Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg max-h-[90vh] flex flex-col bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-3xl overflow-hidden shadow-2xl animate-scale-up">
            <div className="p-6 border-b border-slate-100 dark:border-[#2A2A2A] flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-orange-500" />
                Transférer des Clients
              </h3>
              <button onClick={() => setIsTransferModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold text-sm">
                Fermer
              </button>
            </div>

            {transferSuccess ? (
              <div className="p-12 text-center space-y-4 overflow-y-auto">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-950 dark:text-white">Transfert effectué !</h4>
                <p className="text-sm text-slate-500">Les passagers sélectionnés ont été déplacés sur le nouveau trajet.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Étape 1 : Choisir le chauffeur / trajet cible */}
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">1. Choisir le chauffeur et trajet cible :</p>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {targetTrips.map(trip => (
                      <button
                        key={trip.id}
                        onClick={() => {
                          setSelectedTargetTripId(trip.id);
                          setSelectedIds([]); // reset selected passengers when target trip changes
                        }}
                        className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex flex-col justify-between gap-1 ${selectedTargetTripId === trip.id ? 'border-orange-500 bg-orange-500/5 dark:bg-orange-500/10' : 'border-slate-200 dark:border-[#222] hover:border-slate-300'}`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <p className="font-bold text-slate-900 dark:text-white">Chauffeur: {trip.chauffeur}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${trip.isLocked ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                            {trip.isLocked ? '🔒 Verrouillé (Transfert OK)' : 'Ouvert'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{trip.vehicule} • Départ : {trip.heure}</p>
                        <p className="text-xs font-bold text-emerald-500 text-right mt-1">{trip.placesLibres} places libres</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Étape 2 : Sélectionner les clients (affiché seulement si trajet cible sélectionné) */}
                {selectedTargetTripId && (
                  <div className="space-y-3 animate-fade-in">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">2. Sélectionner les clients à transférer :</p>
                    <div className="border border-slate-200 dark:border-[#222] rounded-xl overflow-hidden max-h-40 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                      {passagers.map(p => {
                        const targetTrip = targetTrips.find(t => t.id === selectedTargetTripId);
                        const limitReached = selectedIds.length >= (targetTrip?.placesLibres || 0) && !selectedIds.includes(p.id);
                        
                        return (
                          <div key={p.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-[#1C1C1C]">
                            <input
                              type="checkbox"
                              disabled={limitReached}
                              checked={selectedIds.includes(p.id)}
                              onChange={() => handleSelectOneInModal(p.id)}
                              className="w-4 h-4 rounded border-slate-300 dark:border-[#333] text-orange-600 focus:ring-orange-500"
                            />
                            <div className="flex-1">
                              <p className="font-bold text-slate-900 dark:text-white text-xs">{p.nom}</p>
                              <p className="text-[10px] text-slate-500 font-mono">{p.id} • {isParticularVehicle ? 'Placement libre' : `Siège ${p.siege}`}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {selectedIds.length > 0 && (
                      <p className="text-xs text-orange-600 font-semibold text-right">
                        {selectedIds.length} client(s) sélectionné(s)
                      </p>
                    )}
                  </div>
                )}

                {/* Étape 3 : Code PIN de validation */}
                {selectedIds.length > 0 && (
                  <div className="space-y-1.5 animate-fade-in pt-2 border-t border-slate-100 dark:border-[#222]">
                    <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider block text-center">
                      Saisir votre Code PIN d'accès
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      value={securityCode}
                      onChange={e => {
                        setSecurityCode(e.target.value.replace(/\D/g, ''));
                        setPinError('');
                      }}
                      placeholder="Code PIN à 6 chiffres (ex: 123456)"
                      className="w-full bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-orange-500 outline-none text-center tracking-widest font-black transition-colors"
                    />
                    {pinError && (
                      <p className="text-xs text-rose-500 font-bold text-center">{pinError}</p>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setIsTransferModalOpen(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-[#222] dark:hover:bg-[#2A2A2A] text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl text-xs transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    disabled={!selectedTargetTripId || selectedIds.length === 0 || isSubmitting}
                    onClick={executeTransfer}
                    className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Transfert...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Transférer ({selectedIds.length})
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

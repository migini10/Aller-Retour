'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, History, CheckCircle2, Calendar, Clock, ArrowUpRight, QrCode, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import QRCodeBrandEngine from '../../../../../components/QRCodeBrandEngine';
import { useAuth } from '../../../../../components/AuthContext';

export default function QrCodeHistoryPage() {
  const { token, fetchWithAuth } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    showPinInput?: boolean;
    onConfirm: (pin?: string) => void;
  } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('deleted_tickets');
    if (saved) {
      try {
        setDeletedIds(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const showCustomConfirm = (title: string, message: string, onConfirm: (pin?: string) => void, showPinInput = false) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      showPinInput,
      onConfirm: (pin) => {
        onConfirm(pin);
        setConfirmModal(null);
      }
    });
  };

  const toggleSelectTicket = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const targetIds = tickets.map(t => t.id);
    const allSelected = targetIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !targetIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...targetIds])));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    
    showCustomConfirm(
      "Confirmer la suppression",
      `Êtes-vous sûr de vouloir supprimer définitivement ces ${selectedIds.length} billet(s) de votre historique ?\n\nCette action nécessite la saisie de votre code secret pour valider la suppression :`,
      async (pin) => {
        if (!pin) return;
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
          const verifyRes = await fetchWithAuth(`${apiUrl}/v1/auth/verify-pin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pin })
          });
          
          if (verifyRes.ok) {
            const newDeleted = [...deletedIds, ...selectedIds];
            setDeletedIds(newDeleted);
            localStorage.setItem('deleted_tickets', JSON.stringify(newDeleted));
            setSelectedIds([]);
            showCustomConfirm("Succès", "Les billets sélectionnés ont été supprimés définitivement de votre historique.", () => {});
          } else {
            const errData = await verifyRes.json();
            showCustomConfirm("Erreur", errData.message || "Code secret incorrect.", () => {});
          }
        } catch (e: any) {
          showCustomConfirm("Erreur de connexion", `Impossible de vérifier le code: ${e.message}`, () => {});
        }
      },
      true // show pin input
    );
  };

  useEffect(() => {
    const fetchTickets = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
        const res = await fetch(`${apiUrl}/v1/bookings/my-tickets`, {
          cache: 'no-store',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          // Filter only expired/past tickets
          const parseDepartureTime = (dateStr: any) => {
            if (!dateStr) return 0;
            try {
              let formatted = String(dateStr).trim();
              formatted = formatted.replace(' ', 'T');
              if (!formatted.endsWith('Z') && !formatted.includes('+') && !formatted.match(/-\d{2}:\d{2}$/)) {
                formatted += 'Z';
              }
              const parsed = new Date(formatted).getTime();
              return isNaN(parsed) ? 0 : parsed;
            } catch (e) {
              return 0;
            }
          };

          const isTicketPastOrUsed = (ticket: any) => {
            const bookingStatus = ticket.status;
            const tripStatus = ticket.trip?.status;
            const departureTime = parseDepartureTime(ticket.trip?.departureTime);
            const isPast = departureTime > 0 && departureTime < Date.now();

            if (bookingStatus === 'CANCELLED' || 
                bookingStatus === 'BOARDED' || 
                bookingStatus === 'EXPIRED' ||
                tripStatus === 'COMPLETED' || 
                tripStatus === 'ARRIVED' || 
                tripStatus === 'CANCELLED' || 
                isPast) {
              return true;
            }
            return false;
          };

          const getTicketStatusText = (ticket: any) => {
            const bookingStatus = ticket.status;
            const tripStatus = ticket.trip?.status;
            const departureTime = parseDepartureTime(ticket.trip?.departureTime);
            const isPast = departureTime > 0 && departureTime < Date.now();

            if (bookingStatus === 'CANCELLED' || tripStatus === 'CANCELLED') return 'Annulé';
            if (bookingStatus === 'BOARDED') return 'Utilisé';
            if (tripStatus === 'COMPLETED' || tripStatus === 'ARRIVED') return 'Terminé';
            if (isPast) return 'Expiré';
            
            if (bookingStatus === 'CONFIRMED' || bookingStatus === 'PENDING_PAYMENT') {
              return 'Valide';
            }
            return bookingStatus;
          };

          const pastTickets = data.filter((t: any) => isTicketPastOrUsed(t) && !deletedIds.includes(t.id))
            .map((t: any) => ({ ...t, displayStatus: getTicketStatusText(t) }));
          
          setTickets(pastTickets);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des billets", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [token]);

  return (
    <div className="flex flex-col items-center bg-slate-50 dark:bg-black transition-colors duration-300">
      <div className="w-full max-w-[1200px] px-5 sm:px-8 lg:px-12 py-8 pb-24 space-y-8 animate-fade-in">
        
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-200 dark:border-[#2A2A2A]">
          <Link href="/dashboard/client/qr-code" className="p-2.5 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <History className="w-7 h-7 text-slate-500" /> Billets Expirés
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Historique de vos anciens trajets.</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 text-slate-500 animate-spin" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-8 text-center">
              <History className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Aucun billet expiré</h3>
              <p className="text-slate-500 dark:text-slate-400">Vous n'avez pas de billets dans l'historique.</p>
            </div>
          ) : (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {tickets.map((t: any) => {
                 const tripDate = new Date(t.trip.departureTime);
                 const dateStr = tripDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
                 const timeStr = tripDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                 const origin = t.trip.route.originStation.city;
                 const dest = t.trip.route.destinationStation.city;

                 return (
                    <div key={t.id} className={`bg-slate-100/40 dark:bg-[#141414]/20 border ${selectedIds.includes(t.id) ? 'border-orange-500 bg-orange-500/5' : 'border-slate-200/60 dark:border-slate-800/60'} rounded-3xl overflow-hidden relative opacity-50 grayscale transition-all duration-300 hover:opacity-75 hover:grayscale-[50%]`}>
                      <div className="bg-slate-200 dark:bg-[#222222] px-5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 flex justify-between items-center">
                         <span className="flex items-center gap-1.5">
                            <input 
                              type="checkbox"
                              checked={selectedIds.includes(t.id)}
                              onChange={() => toggleSelectTicket(t.id)}
                              className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer mr-1.5"
                            />
                            <CheckCircle2 className="w-4 h-4" /> Statut: {t.displayStatus}
                         </span>
                         <span className="font-mono tracking-wider">Réf: VOY-{t.id.split('-')[0].toUpperCase()}</span>
                      </div>
                      
                      <div className="p-6">
                         <div className="flex justify-between items-start">
                            <div>
                               <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                                  <Calendar className="w-4 h-4 text-slate-400" /> {dateStr}
                                  <span className="mx-1">•</span>
                                  <Clock className="w-4 h-4 text-slate-400" /> {timeStr}
                               </div>
                               <div className="flex items-center gap-3">
                                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-700 dark:text-slate-300">{origin}</h3>
                                  <ArrowUpRight className="w-6 h-6 text-slate-400" />
                                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-700 dark:text-slate-300">{dest}</h3>
                               </div>
                            </div>
                            <div className="shrink-0 p-2 bg-white/50 rounded-2xl opacity-60">
                               <QRCodeBrandEngine value={t.qrCodeToken} size={64} />
                            </div>
                         </div>
                      </div>
                   </div>
                 );
               })}
             </div>
          )}
        </div>
      </div>

      {/* Floating Action Bar for Deletion */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-6 z-50 animate-bounce-short">
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {selectedIds.length} billet(s) sélectionné(s)
          </span>
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />
          <button 
            onClick={handleSelectAll}
            className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
          >
            {tickets.every(t => selectedIds.includes(t.id)) ? 'Désélectionner tout' : 'Tout sélectionner'}
          </button>
          <button 
            onClick={handleDeleteSelected}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-red-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" /> Supprimer
          </button>
        </div>
      {/* CUSTOM CONFIRM/ALERT/PROMPT MODAL */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmModal(null)} />
          <div className="relative w-full max-w-md bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#2A2A2A] rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{confirmModal.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 whitespace-pre-line">{confirmModal.message}</p>
            
            {confirmModal.showPinInput && (
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Code secret de connexion</label>
                <input 
                  type="password"
                  id="modal-pin-input"
                  placeholder="Saisissez votre code PIN..."
                  maxLength={6}
                  className="w-full bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] hover:border-orange-500 focus:border-orange-500 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm outline-none transition-all font-mono"
                />
              </div>
            )}
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setConfirmModal(null)}
                className="px-5 py-2.5 bg-slate-100 dark:bg-[#1A1A1A] hover:bg-slate-200 dark:hover:bg-[#222222] text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={() => {
                  let pin = "";
                  if (confirmModal.showPinInput) {
                    const inputEl = document.getElementById('modal-pin-input') as HTMLInputElement;
                    pin = inputEl?.value || "";
                    if (!pin.trim()) {
                      showCustomConfirm("Attention", "Veuillez saisir votre code secret.", () => {}, true);
                      return;
                    }
                  }
                  confirmModal.onConfirm(pin.trim());
                }}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-orange-600/10"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { getApiUrl } from '@/lib/config';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, X, List, LayoutGrid, CheckCircle2, Calendar, Clock, ArrowUpRight, Building2, Bus, Eye, Download, Share2, QrCode, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import QRCodeBrandEngine from '../../../../components/QRCodeBrandEngine';
import { useUser } from '../../../../hooks/useUser';
import { useAuth } from '../../../../components/AuthContext';


export default function QrCodePage() {
  const { userName, userPhone } = useUser();
  const { token, fetchWithAuth } = useAuth();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    showPinInput?: boolean;
    onConfirm: (pin?: string) => void;
  } | null>(null);

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

  const handleSelectAll = (activeOnly = true) => {
    const targets = activeOnly ? activeTickets : tickets;
    const targetIds = targets.map(t => t.id);
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
      `Êtes-vous sûr de vouloir supprimer définitivement ces ${selectedIds.length} billet(s) de la liste active ?\n\nCette action nécessite la saisie de votre code secret pour valider la suppression :`,
      async (pin) => {
        if (!pin) return;
        try {
          const apiUrl = getApiUrl();
          // First verify the PIN
          const verifyRes = await fetchWithAuth(`${apiUrl}/v1/auth/verify-pin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin })
          });
          
          if (!verifyRes.ok) {
            const errData = await verifyRes.json();
            showCustomConfirm("Erreur", errData.message || "Code secret incorrect.", () => {});
            return;
          }

          // PIN valid — call the hide API to persist the deletion server-side
          const hideRes = await fetchWithAuth(`${apiUrl}/v1/bookings/hide`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookingIds: selectedIds })
          });

          if (hideRes.ok) {
            setSelectedIds([]);
            await fetchTickets(); // Refresh list from server — will no longer show hidden tickets
            showCustomConfirm("Succès", "Les billets sélectionnés ont été supprimés avec succès.", () => {});
          } else {
            const errData = await hideRes.json();
            showCustomConfirm("Erreur", errData.message || "Erreur lors de la suppression.", () => {});
          }
        } catch (e: any) {
          showCustomConfirm("Erreur de connexion", `Impossible de vérifier le code: ${e.message}`, () => {});
        }
      },
      true // show pin input
    );
  };

  const fetchTickets = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/v1/bookings/my-tickets`, {
        cache: 'no-store',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des billets", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async (ticketId: string) => {
    showCustomConfirm(
      "Confirmer l'annulation",
      "Êtes-vous sûr de vouloir annuler ce billet ? Le montant sera reversé sur votre Wallet.\n\nSaisissez votre code secret de connexion pour valider :",
      async (secretCode) => {
        if (!secretCode) return;
        try {
          const apiUrl = getApiUrl();
          const res = await fetchWithAuth(`${apiUrl}/v1/bookings/${ticketId}/cancel`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ secretCode: secretCode.trim() })
          });
          if (res.ok) {
            showCustomConfirm("Succès", "Réservation annulée avec succès. Le montant a été remboursé sur votre Wallet.", () => {});
            fetchTickets();
          } else {
            const errData = await res.json();
            showCustomConfirm("Erreur", errData.message || "Erreur lors de l'annulation.", () => {});
          }
        } catch (e: any) {
          showCustomConfirm("Erreur de connexion", `Erreur: ${e.message}`, () => {});
        }
      },
      true // show pin input
    );
  };

  useEffect(() => {
    fetchTickets();
  }, [token]);

  const parseDepartureTime = (dateStr: any) => {
    if (!dateStr) return 0;
    try {
      let formatted = String(dateStr).trim();
      // Replace space between Date and Time with 'T' (e.g. 2026-06-28 22:30:00 -> 2026-06-28T22:30:00)
      formatted = formatted.replace(' ', 'T');
      // If it has no Z or timezone offset, append 'Z' to treat as UTC (standard for our API)
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
    
    // Check if the departure date has passed
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

  const activeTickets = tickets.filter(t => !isTicketPastOrUsed(t));
  const pastTickets = tickets.filter(t => isTicketPastOrUsed(t));

  

  return (
    <div className="flex flex-col items-center bg-slate-50 dark:bg-black transition-colors duration-300">
      <div className="w-full max-w-[1200px] px-5 sm:px-8 lg:px-12 py-8 pb-24 space-y-8 animate-fade-in">
        
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-200 dark:border-[#2A2A2A]">
          <Link href="/dashboard/client" className="p-2.5 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <QrCode className="w-7 h-7 text-orange-500" /> Mes QR codes
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Vos billets, réservations et historiques de voyage.</p>
          </div>
        </div>
        {/* Content */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
             <div className="flex flex-col sm:flex-row sm:items-center gap-3">
               <h2 className="text-lg font-bold text-slate-900 dark:text-white">Liste de mes QR codes</h2>
               <div className="flex items-center gap-2">
                 <span className="bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold px-3 py-1.5 rounded-full border border-orange-500/30">{activeTickets.length} Billet(s) actif(s)</span>
                 <Link href="/dashboard/client/qr-code/history" className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-[#222222] text-slate-700 dark:text-slate-300 rounded-full text-xs font-bold hover:bg-slate-200 dark:hover:bg-[#2A2A2A] transition-colors border border-slate-200 dark:border-[#333333]">
                    <Calendar className="w-3.5 h-3.5" /> Historique
                 </Link>
               </div>
             </div>
             <div className="flex items-center gap-1 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl p-1 shadow-sm">
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-slate-100 dark:bg-[#222222] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'}`}>
                   <List className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-slate-100 dark:bg-[#222222] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white'}`}>
                   <LayoutGrid className="w-4 h-4" />
                </button>
             </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Rechercher un QR code, téléphone ou trajet..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] hover:border-orange-500/50 focus:border-orange-500 transition-all rounded-2xl pl-12 pr-12 py-4 text-slate-900 dark:text-white text-sm outline-none shadow-sm focus:shadow-[0_0_15px_rgba(234,88,12,0.1)]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 dark:bg-[#222222] rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-700 transition-colors">
                 <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            </div>
          ) : activeTickets.length === 0 ? (
            <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-8 text-center">
              <QrCode className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Aucun billet actif</h3>
              <p className="text-slate-500 dark:text-slate-400">Vous n'avez pas de réservations en cours.</p>
            </div>
          ) : viewMode === 'list' ? (
             <div className="flex flex-col gap-4">
               {activeTickets.map((t: any) => {
                 const tripDate = new Date(t.trip.departureTime);
                 const dateStr = tripDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
                 const timeStr = tripDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                 const origin = t.trip.route.originStation.city;
                 const dest = t.trip.route.destinationStation.city;

                 return (
                    <div key={t.id} className={`bg-white dark:bg-[#141414] border ${selectedIds.includes(t.id) ? 'border-orange-500 bg-orange-500/5' : 'border-orange-500/40 hover:border-orange-500/80'} shadow-sm hover:shadow-lg hover:shadow-orange-500/10 rounded-2xl p-5 flex flex-col md:flex-row justify-between md:items-center gap-5 transition-all`}>
                      <div className="flex items-center gap-5">
                         <div className="flex items-center gap-3">
                            <input 
                              type="checkbox"
                              checked={selectedIds.includes(t.id)}
                              onChange={() => toggleSelectTicket(t.id)}
                              className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer"
                            />
                            <div className={`shrink-0 p-2 bg-white rounded-xl shadow-sm border border-slate-100 dark:border-none`}>
                               <QRCodeBrandEngine value={t.qrCodeToken} size={56} />
                            </div>
                         </div>
                         <div>
                            <div className="flex flex-wrap items-center gap-3 mb-1.5">
                               <span className={`font-bold text-base sm:text-lg text-slate-900 dark:text-white font-black`}>{origin} ➔ {dest}</span>
                               <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono border bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20`}>VOY-{t.id.split('-')[0].toUpperCase()}</span>
                               <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-slate-100 text-slate-600 dark:bg-[#222] dark:text-slate-300">
                                 {getTicketStatusText(t)}
                               </span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5" /> {dateStr} • <Clock className="w-3.5 h-3.5 ml-1" /> {timeStr} • Siège #{t.seatNumber}
                            </p>
                            <p className={`text-xs mt-1 text-slate-500 font-medium`}>{t.trip.company?.name || 'Allogoo'} • {userName}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-2 md:shrink-0 mt-2 md:mt-0">
                          <button onClick={() => setSelectedTicket(t)} className="flex-1 md:flex-none p-2.5 md:px-4 bg-slate-50 dark:bg-[#1A1A1A] hover:bg-slate-100 dark:bg-[#222222] border border-slate-200 dark:border-[#333333] text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors flex justify-center items-center gap-2">
                             <Eye className="w-4 h-4" /> <span className="hidden sm:inline">Détails</span>
                          </button>
                          <button onClick={() => handleCancelTicket(t.id)} className="flex-1 md:flex-none p-2.5 md:px-4 bg-rose-600/10 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-500/20 rounded-xl text-sm font-bold transition-all flex justify-center items-center gap-2 shadow-sm">
                             Annuler
                          </button>
                          <button className="flex-1 md:flex-none p-2.5 md:px-4 bg-slate-50 dark:bg-[#1A1A1A] hover:bg-slate-100 dark:bg-[#222222] border border-slate-200 dark:border-[#333333] text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors flex justify-center items-center gap-2">
                             <Download className="w-4 h-4" /> <span className="hidden sm:inline">Télécharger</span>
                          </button>
                          <button className="flex-1 md:flex-none p-2.5 md:px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-orange-600/20 flex justify-center items-center gap-2">
                             <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Partager</span>
                          </button>
                      </div>
                    </div>
                 );
               })}
             </div>
          ) : (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {activeTickets.map((t: any) => {
                 const tripDate = new Date(t.trip.departureTime);
                 const dateStr = tripDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
                 const timeStr = tripDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                 const origin = t.trip.route.originStation.city;
                 const dest = t.trip.route.destinationStation.city;
                 const companyName = t.trip.company?.name || 'Allogoo';

                 return (
                   <div key={t.id} className={`bg-white dark:bg-[#141414] border ${selectedIds.includes(t.id) ? 'border-orange-500' : 'border-slate-200 dark:border-[#2A2A2A]/80'} rounded-3xl overflow-hidden relative shadow-xl`}>
                      <div className="bg-orange-600 px-5 py-2.5 text-xs font-bold text-white flex justify-between items-center">
                        <span className="flex items-center gap-1.5">
                           <input 
                             type="checkbox"
                             checked={selectedIds.includes(t.id)}
                             onChange={() => toggleSelectTicket(t.id)}
                             className="w-3.5 h-3.5 rounded border-white/30 text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer mr-1.5"
                           />
                           <CheckCircle2 className="w-4 h-4" /> Statut: {t.status}
                        </span>
                        <span className="font-mono tracking-wider">Réf: VOY-{t.id.split('-')[0].toUpperCase()}</span>
                      </div>
                      
                      <div className="p-6">
                         <div className="flex justify-between items-start mb-6">
                            <div>
                               <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-2">
                                  <Calendar className="w-4 h-4 text-orange-500" /> {dateStr}
                                  <span className="mx-1">•</span>
                                  <Clock className="w-4 h-4 text-orange-500" /> {timeStr}
                               </div>
                               <div className="flex items-center gap-3">
                                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{origin}</h3>
                                  <ArrowUpRight className="w-6 h-6 text-orange-500" />
                                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{dest}</h3>
                               </div>
                               <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-1.5">
                                  <Building2 className="w-4 h-4 text-slate-400" /> {companyName}
                               </p>
                            </div>
                            <div className="shrink-0 p-2 bg-white rounded-2xl shadow-sm border border-slate-100 dark:border-none">
                               <QRCodeBrandEngine value={t.qrCodeToken} size={80} />
                            </div>
                         </div>
                         
                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4 py-6 border-y border-slate-100 dark:border-[#2A2A2A]/80 mb-6 bg-slate-50/50 dark:bg-transparent -mx-6 px-6">
                            <div>
                               <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 font-bold">N° Billet</p>
                               <p className="text-sm font-black text-slate-900 dark:text-white">VOY-{t.id.split('-')[0].toUpperCase()}</p>
                            </div>
                            <div>
                               <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 font-bold">Siège</p>
                               <p className="text-sm font-black text-orange-500">#{t.seatNumber}</p>
                            </div>
                            <div>
                               <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 font-bold">Passager</p>
                               <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{userName}</p>
                            </div>
                            <div>
                               <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 font-bold">Véhicule</p>
                               <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                  <Bus className="w-4 h-4 text-slate-400" /> {t.trip.vehicle?.type || 'Voiture'}
                               </p>
                            </div>
                            <div>
                               <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 font-bold">Montant Payé</p>
                               <p className="text-sm font-black text-slate-900 dark:text-white">{t.amountPaid} FCFA</p>
                            </div>
                         </div>
                         
                         <div className="flex gap-3">
                            <button onClick={() => setSelectedTicket(t)} className="flex-1 bg-slate-50 dark:bg-[#1A1A1A] hover:bg-slate-100 dark:bg-[#222222] border border-slate-200 dark:border-[#333333] text-slate-900 dark:text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                               <Eye className="w-4 h-4" /> Détails
                            </button>
                            <button onClick={() => handleCancelTicket(t.id)} className="flex-1 bg-rose-600/10 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-500/20 font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                               Annuler
                            </button>
                            <button className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2">
                               <Download className="w-4 h-4" /> Télécharger
                            </button>
                         </div>
                      </div>
                   </div>
                 );
               })}
            </div>
          )}
        </div>
      </div>

      {/* TICKET DETAILS MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTicket(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#2A2A2A] rounded-[2rem] p-6 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedTicket(null)} className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-[#1A1A1A] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center mt-4">
              <div className="p-4 bg-white rounded-3xl shadow-sm border border-slate-100 dark:border-none">
                <QRCodeBrandEngine value={selectedTicket.qrCodeToken} size={220} />
              </div>
              
              <h3 className="mt-6 text-2xl font-black text-slate-900 dark:text-white">Billet N° VOY-{selectedTicket.id.split('-')[0].toUpperCase()}</h3>
              <p className="text-orange-600 dark:text-orange-500 font-bold mt-1 text-lg">{selectedTicket.trip.route.originStation.city} ➔ {selectedTicket.trip.route.destinationStation.city}</p>
              
              <div className="w-full mt-8 space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-[#1A1A1A]">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">Passager</span>
                  <span className="text-slate-900 dark:text-white font-bold">{userName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-[#1A1A1A]">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">Date & Heure</span>
                  <span className="text-slate-900 dark:text-white font-bold">{new Date(selectedTicket.trip.departureTime).toLocaleDateString('fr-FR')} à {new Date(selectedTicket.trip.departureTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-[#1A1A1A]">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">Siège</span>
                  <span className="text-orange-500 font-black">#{selectedTicket.seatNumber}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-[#1A1A1A]">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">Montant payé</span>
                  <span className="text-slate-900 dark:text-white font-bold">{selectedTicket.amountPaid} FCFA</span>
                </div>
              </div>
              
              <button onClick={() => setSelectedTicket(null)} className="w-full mt-8 bg-slate-100 dark:bg-[#1A1A1A] hover:bg-slate-200 dark:hover:bg-[#222222] text-slate-900 dark:text-white font-bold py-3.5 rounded-xl transition-colors">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Bar for Deletion */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-6 z-50 animate-bounce-short">
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {selectedIds.length} billet(s) sélectionné(s)
          </span>
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />
          <button 
            onClick={() => handleSelectAll(true)}
            className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
          >
            {activeTickets.every(t => selectedIds.includes(t.id)) ? 'Désélectionner tout' : 'Tout sélectionner'}
          </button>
          <button 
            onClick={handleDeleteSelected}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-red-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" /> Supprimer
          </button>
        </div>
      )}
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

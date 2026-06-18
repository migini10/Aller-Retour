'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, X, List, LayoutGrid, CheckCircle2, Calendar, Clock, ArrowUpRight, Building2, Bus, Eye, Download, Share2, QrCode, Loader2 } from 'lucide-react';
import Link from 'next/link';
import QRCodeBrandEngine from '../../../../components/QRCodeBrandEngine';
import { useUser } from '../../../../hooks/useUser';

export default function QrCodePage() {
  const { userName, token } = useUser();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
        const res = await fetch(`${apiUrl}/v1/bookings/my-tickets`, {
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
    fetchTickets();
  }, [token]);

  const activeTickets = tickets.filter(t => (t.status === 'PENDING_PAYMENT' || t.status === 'CONFIRMED' || t.status === 'BOARDED') && (!t.trip?.departureTime || new Date(t.trip.departureTime).getTime() > Date.now()));
  const pastTickets = tickets.filter(t => (t.status !== 'PENDING_PAYMENT' && t.status !== 'CONFIRMED' && t.status !== 'BOARDED') || (t.trip?.departureTime && new Date(t.trip.departureTime).getTime() < Date.now()));

  

  return (
    <div className="h-full min-w-0 overflow-y-auto overscroll-contain scrollbar-hide flex flex-col items-center bg-slate-50 dark:bg-black transition-colors duration-300">
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
             <div className="flex items-center gap-3">
               <h2 className="text-lg font-bold text-slate-900 dark:text-white">Liste de mes QR codes</h2>
               <span className="bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold px-3 py-1.5 rounded-full border border-orange-500/30">{activeTickets.length} Billet(s) actif(s)</span>
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
          ) : tickets.length === 0 ? (
            <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-8 text-center">
              <QrCode className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Aucun billet trouvé</h3>
              <p className="text-slate-500 dark:text-slate-400">Vous n'avez pas encore effectué de réservation.</p>
            </div>
          ) : viewMode === 'list' ? (
             <div className="flex flex-col gap-4">
               {tickets.map((t: any) => {
                 const isPast = t.status !== 'PENDING_PAYMENT' && t.status !== 'CONFIRMED' && t.status !== 'BOARDED';
                 const tripDate = new Date(t.trip.departureTime);
                 const dateStr = tripDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
                 const timeStr = tripDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                 const origin = t.trip.route.originStation.city;
                 const dest = t.trip.route.destinationStation.city;

                 return (
                   <div key={t.id} className={`bg-white dark:bg-[#141414] border ${isPast ? 'border-slate-200 dark:border-[#2A2A2A]/50 opacity-75 grayscale-[30%] hover:grayscale-0' : 'border-orange-500/40 hover:border-orange-500/80 shadow-sm hover:shadow-lg hover:shadow-orange-500/10'} rounded-2xl p-5 flex flex-col md:flex-row justify-between md:items-center gap-5 transition-all`}>
                     <div className="flex items-center gap-5">
                        <div className={`shrink-0 p-2 bg-white rounded-xl shadow-sm ${isPast ? 'opacity-60 border border-slate-100 dark:border-none' : 'border border-slate-100 dark:border-none'}`}>
                           <QRCodeBrandEngine value={t.qrCodeToken} size={56} />
                        </div>
                        <div>
                           <div className="flex items-center gap-3 mb-1.5">
                              <span className={`font-bold text-base sm:text-lg ${isPast ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white font-black'}`}>{origin} ➔ {dest}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono border ${isPast ? 'bg-slate-100 dark:bg-[#222222] text-slate-500 border-slate-200 dark:border-[#333333]' : 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'}`}>VOY-{t.id.split('-')[0].toUpperCase()}</span>
                           </div>
                           <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                             <Calendar className="w-3.5 h-3.5" /> {dateStr} • <Clock className="w-3.5 h-3.5 ml-1" /> {timeStr} • Siège #{t.seatNumber}
                           </p>
                           <p className={`text-xs mt-1 ${isPast ? 'text-slate-500' : 'text-slate-500 font-medium'}`}>{t.trip.company?.name || 'Allogoo'} • {userName}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 md:shrink-0 mt-2 md:mt-0">
                         <button onClick={() => setSelectedTicket(t)} className="flex-1 md:flex-none p-2.5 md:px-4 bg-slate-50 dark:bg-[#1A1A1A] hover:bg-slate-100 dark:bg-[#222222] border border-slate-200 dark:border-[#333333] text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors flex justify-center items-center gap-2">
                            <Eye className="w-4 h-4" /> <span className="hidden sm:inline">{isPast ? 'Historique' : 'Détails'}</span>
                         </button>
                         {!isPast && (
                           <>
                             <button className="flex-1 md:flex-none p-2.5 md:px-4 bg-slate-50 dark:bg-[#1A1A1A] hover:bg-slate-100 dark:bg-[#222222] border border-slate-200 dark:border-[#333333] text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors flex justify-center items-center gap-2">
                                <Download className="w-4 h-4" /> <span className="hidden sm:inline">Télécharger</span>
                             </button>
                             <button className="flex-1 md:flex-none p-2.5 md:px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-orange-600/20 flex justify-center items-center gap-2">
                                <Share2 className="w-4 h-4" /> <span className="hidden sm:inline">Partager</span>
                             </button>
                           </>
                         )}
                     </div>
                   </div>
                 );
               })}
             </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {tickets.map((t: any) => {
                 const isPast = (t.status !== 'PENDING_PAYMENT' && t.status !== 'CONFIRMED' && t.status !== 'BOARDED') || (t.trip?.departureTime && new Date(t.trip.departureTime).getTime() < Date.now());
                 const tripDate = new Date(t.trip.departureTime);
                 const dateStr = tripDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
                 const timeStr = tripDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                 const origin = t.trip.route.originStation.city;
                 const dest = t.trip.route.destinationStation.city;
                 const companyName = t.trip.company?.name || 'Allogoo';

                 if (isPast) {
                   return (
                     <div key={t.id} className="bg-white dark:bg-[#141414]/50 border border-slate-200 dark:border-[#2A2A2A]/50 rounded-3xl overflow-hidden relative opacity-75 grayscale-[30%]">
                        <div className="bg-slate-200 dark:bg-[#222222] px-5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 flex justify-between items-center">
                           <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Statut: {t.status}</span>
                           <span className="font-mono tracking-wider">Réf: VOY-{t.id.split('-')[0].toUpperCase()}</span>
                        </div>
                        
                        <div className="p-6">
                           <div className="flex justify-between items-start mb-6">
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
                                 <QRCodeBrandEngine value={t.qrCodeToken} size={80} />
                              </div>
                           </div>
                           
                           <div className="flex gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-[#2A2A2A]/50">
                              <button onClick={() => setSelectedTicket(t)} className="w-full bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] text-slate-600 dark:text-slate-400 font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                                 <Eye className="w-4 h-4" /> Voir l'historique complet
                              </button>
                           </div>
                        </div>
                      </div>
                   );
                 }

                 return (
                   <div key={t.id} className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A]/80 rounded-3xl overflow-hidden relative shadow-xl">
                      <div className="bg-orange-600 px-5 py-2.5 text-xs font-bold text-white flex justify-between items-center">
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Statut: {t.status}</span>
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
          <div className="relative w-full max-w-sm bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#2A2A2A] rounded-[2rem] p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button onClick={() => setSelectedTicket(null)} className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-[#1A1A1A] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center mt-4">
              <div className="p-4 bg-white rounded-3xl shadow-sm border border-slate-100 dark:border-none">
                <QRCodeBrandEngine value={selectedTicket.qrCodeToken} size={150} />
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
    </div>
  );
}

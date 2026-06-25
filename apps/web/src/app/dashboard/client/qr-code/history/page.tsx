'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, History, CheckCircle2, Calendar, Clock, ArrowUpRight, QrCode, Loader2 } from 'lucide-react';
import Link from 'next/link';
import QRCodeBrandEngine from '../../../../../components/QRCodeBrandEngine';
import { useAuth } from '../../../../../components/AuthContext';

export default function QrCodeHistoryPage() {
  const { token } = useAuth();
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
          // Filter only expired/past tickets
          const getTicketStatusText = (ticket: any) => {
            const bookingStatus = ticket.status;
            const tripStatus = ticket.trip?.status;
            const isPast = new Date(ticket.trip?.departureTime).getTime() < Date.now();

            if (bookingStatus === 'CANCELLED') return 'Annulé';
            if (bookingStatus === 'BOARDED') {
              if (tripStatus === 'COMPLETED' || tripStatus === 'ARRIVED' || tripStatus === 'CANCELLED') return 'Terminé';
              return 'Embarqué';
            }
            if (bookingStatus === 'CONFIRMED' || bookingStatus === 'PENDING_PAYMENT') {
              if (tripStatus === 'COMPLETED' || tripStatus === 'ARRIVED' || tripStatus === 'CANCELLED') return 'Expiré';
              if (isPast && tripStatus !== 'SCHEDULED' && tripStatus !== 'BOARDING') return 'Expiré';
              return 'Valide';
            }
            return bookingStatus;
          };

          const pastTickets = data.filter((t: any) => {
            const s = getTicketStatusText(t);
            return s === 'Expiré' || s === 'Terminé' || s === 'Annulé';
          }).map((t: any) => ({ ...t, displayStatus: getTicketStatusText(t) }));
          
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
                   <div key={t.id} className="bg-white dark:bg-[#141414]/50 border border-slate-200 dark:border-[#2A2A2A]/50 rounded-3xl overflow-hidden relative opacity-75 hover:opacity-100 transition-opacity grayscale-[30%] hover:grayscale-0">
                      <div className="bg-slate-200 dark:bg-[#222222] px-5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 flex justify-between items-center">
                         <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Statut: {t.displayStatus}</span>
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
    </div>
  );
}

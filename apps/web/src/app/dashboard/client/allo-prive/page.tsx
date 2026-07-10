'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, CarFront, Calendar, Users, Plus, CheckCircle2, ChevronRight, Loader2, Award, ShieldCheck, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../../../components/AuthContext';
import { ApiClient } from '@/lib/api.client';
import { AlloPriveRequest } from '@/types/allo-prive';

export default function AlloPrivePage() {
  const { user } = useAuth();
  const [origin, setOrigin] = useState('Dakar');
  const [destination, setDestination] = useState('Touba');
  const [pickup, setPickup] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [date, setDate] = useState('');
  const [price, setPrice] = useState(20000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [priveRequests, setPriveRequests] = useState<AlloPriveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPriveRequests = async () => {
    try {
      const myRequests = await ApiClient.get<AlloPriveRequest[]>('/v1/allo-prive/requests/my-requests');
      if (Array.isArray(myRequests)) {
        setPriveRequests(myRequests);
      }
    } catch (e) {
      console.error('Error fetching private requests', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPriveRequests();
      const interval = setInterval(fetchPriveRequests, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !pickup || !neighborhood || !date) {
      setErrorMsg("Veuillez remplir tous les champs.");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await ApiClient.post('/v1/allo-prive/requests', {
        origin: `${origin} (${pickup})`,
        destination: `${destination} (${neighborhood})`,
        departureDate: date,
        price: Number(price),
        type: 'allo-prive',
      });
      setSuccessMsg("Votre demande Allo Privé a été publiée avec succès ! Les chauffeurs qualifiés peuvent désormais postuler.");
      setPickup('');
      setNeighborhood('');
      setDate('');
      fetchPriveRequests();
    } catch (err: any) {
      setErrorMsg(`Erreur: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectDriver = async (reqId: string, appId: string) => {
    try {
      await ApiClient.patch(`/v1/allo-prive/applications/${appId}/accept`);
      fetchPriveRequests();
    } catch (e) {
      console.error("Error selecting driver", e);
    }
  };

  return (
    <div className="flex flex-col items-center bg-slate-50 dark:bg-black min-h-screen transition-colors duration-300">
      <div className="w-full max-w-[1200px] px-5 sm:px-8 lg:px-12 py-8 pb-24 space-y-8 animate-fade-in">
        
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-200 dark:border-[#2A2A2A]">
          <Link href="/dashboard/client" className="p-2.5 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <CarFront className="w-7 h-7 text-amber-500" /> Espace Allo Privé
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Privatisez une voiture entière, lancez des appels d'offres et choisissez vos chauffeurs certifiés.</p>
          </div>
        </div>

        {/* Split screen layout: Left = Form, Right = Active Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Form Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-3xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" /> Nouvelle Demande
              </h2>

              {successMsg && (
                <div className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  {successMsg}
                </div>
              )}

              {errorMsg && (
                <div className="mb-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ville de départ</label>
                  <select 
                    value={origin} 
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#2A2A2A] rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-sm"
                  >
                    {['Dakar', 'Touba', 'Thiès', 'Mbour', 'Kaolack', 'Saint-Louis'].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Adresse de prise en charge (Départ)</label>
                  <input 
                    type="text" 
                    placeholder="Ex: HLM Grand Yoff, Station Total"
                    value={pickup} 
                    onChange={(e) => setPickup(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#2A2A2A] rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ville de destination</label>
                  <select 
                    value={destination} 
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#2A2A2A] rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-sm"
                  >
                    {['Dakar', 'Touba', 'Thiès', 'Mbour', 'Kaolack', 'Saint-Louis'].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quartier / Adresse de destination</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Darou Marnane, près de la grande mosquée"
                    value={neighborhood} 
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#2A2A2A] rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Date du voyage</label>
                  <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#2A2A2A] rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-sm cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tarif de privatisation proposé (FCFA)</label>
                  <input 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(Number(e.target.value))}
                    min={10000}
                    step={1000}
                    className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#2A2A2A] rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CarFront className="w-4 h-4" />}
                  {isSubmitting ? 'Publication en cours...' : 'Publier la demande'}
                </button>
              </form>
            </div>
          </div>

          {/* List Column */}
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" /> Suivi de mes demandes ({priveRequests.length})
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              </div>
            ) : priveRequests.length === 0 ? (
              <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-3xl p-12 text-center shadow-md">
                <CarFront className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="text-base font-bold text-slate-950 dark:text-white">Aucune demande active</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Vos demandes de privatisation de voiture apparaîtront ici.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {priveRequests.map((req) => (
                  <div key={req.id} className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-3xl p-6 shadow-xl relative overflow-hidden transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                          Allo Privé
                        </span>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mt-2">{req.origin} → {req.destination}</h3>
                        <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {req.departureDate}</span>
                          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Voiture Entière</span>
                          <span className="text-amber-500 font-bold">{req.price.toLocaleString('fr-FR')} FCFA</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${req.status === 'ACCEPTED' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                        {req.status === 'ACCEPTED' ? 'Accepté' : 'Recherche Chauffeur'}
                      </span>
                    </div>

                    {req.status === 'PENDING' && (
                      <div className="mt-6 border-t border-slate-100 dark:border-[#2A2A2A] pt-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Chauffeurs qualifiés intéressés ({req.applications.length})</h4>
                        {req.applications.length === 0 ? (
                          <p className="text-xs text-slate-500 dark:text-slate-400 italic">En attente de candidatures de chauffeurs...</p>
                        ) : (
                          <div className="space-y-3">
                            {req.applications.map((app: any) => (
                              <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 dark:bg-black/30 p-3.5 rounded-2xl border border-slate-200 dark:border-[#2A2A2A] gap-3 hover:border-amber-500/30 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center font-bold text-sm text-amber-600 dark:text-amber-400 shrink-0">
                                    {app.driverName.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-bold text-slate-900 dark:text-white">{app.driverName}</p>
                                      {app.driverVerified && (
                                        <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wide border border-emerald-500/20 flex items-center gap-0.5">
                                          <ShieldCheck className="w-2.5 h-2.5" /> Certifié
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Fiabilité: {app.driverScore}% • ★ {app.driverRating} • Tel: {app.driverPhone}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleSelectDriver(req.id, app.id)}
                                  className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-md shadow-amber-600/15"
                                >
                                  Choisir ce chauffeur
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

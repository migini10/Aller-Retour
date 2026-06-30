'use client';
import React, { useState } from 'react';
import { Store, MapPin, Search, Calendar, ChevronRight, Package, AlertTriangle, X, Info, Users } from 'lucide-react';

const initialMissions = [
  { id: 'M-104', trajet: 'Dakar → Saint-Louis', depart: 'Demain, 07:00', distance: '260 km', passagers: 4, remuneration: '18 000 FCFA', transporteur: 'Sénégal Express', urgent: true, status: 'disponible', minScore: 80 },
  { id: 'M-105', trajet: 'Thiès → Dakar', depart: 'Aujourd\'hui, 16:00', distance: '70 km', passagers: 3, remuneration: '7 500 FCFA', transporteur: 'Indépendant', urgent: false, status: 'disponible', minScore: 50 },
  { id: 'M-106', trajet: 'Dakar → Mbour', depart: 'Samedi, 09:00', distance: '85 km', passagers: 7, remuneration: '12 000 FCFA', transporteur: 'Allo Voyage', urgent: false, status: 'disponible', minScore: 60 },
];

const driverReliabilityScore = 65; // Simulation d'un chauffeur pénalisé

export default function SectionMarketplace() {
  const [missions, setMissions] = useState(initialMissions);
  const [colis, setColis] = useState<any[]>([]);
  const [alloPriveRequests, setAlloPriveRequests] = useState<any[]>([]);
  const [hasClient, setHasClient] = useState(true);

  // State for the Release Modal
  const [releaseModalOpen, setReleaseModalOpen] = useState(false);
  const [releaseItemId, setReleaseItemId] = useState<string | null>(null);
  const [releaseItemType, setReleaseItemType] = useState<'mission' | 'colis' | null>(null);
  const [releaseReason, setReleaseReason] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');

  React.useEffect(() => {
    const loadData = async () => {
      // Vérifier si le chauffeur a au moins 1 client
      const tripsStored = localStorage.getItem('demo_trips');
      let driverHasClient = true;
      if (tripsStored) {
        try {
          const trips = JSON.parse(tripsStored);
          driverHasClient = trips.some((t: any) => t.passagers >= 1);
        } catch(e) {}
      } else {
        driverHasClient = true; // Par défaut pour la démo
      }
      setHasClient(driverHasClient);

      // Charger les colis depuis l'API !
      try {
        const res = await fetch('/api/colis');
        if (res.ok) {
          const data = await res.json();
          // Filter out delivered or already accepted by others if needed, 
          // For now we show all but only "En attente..." are disponible
          const availableColis = data.map((c: any) => ({
            ...c,
            status: c.statut === 'En attente de prise en charge' ? 'disponible' : 'accepte'
          }));
          setColis(availableColis);
        }
      } catch (e) {
        console.error('Failed to fetch colis', e);
      }

      // Charger les demandes Allo Privé
      try {
        const res = await fetch('/api/allo-prive');
        if (res.ok) {
          const data = await res.json();
          setAlloPriveRequests(data.requests || []);
        }
      } catch (e) {}
    };
    
    loadData();
    const interval = setInterval(loadData, 5000); // Polling every 5s
    return () => clearInterval(interval);
  }, []);

  const handleAccept = async (id: string, type: 'mission' | 'colis') => {
    if (type === 'mission') {
      setMissions(missions.map(m => m.id === id ? { ...m, status: 'accepte' } : m));
    } else {
      try {
        await fetch(`/api/colis/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ statut: 'Accepté' })
        });
        setColis(colis.map(c => c.id === id ? { ...c, status: 'accepte' } : c));
      } catch (e) {}
    }
  };

  const handleApplyAlloPrive = async (requestId: string) => {
    try {
      const res = await fetch(`/api/allo-prive/${requestId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverId: 'demo-driver-id',
          driverName: 'Abdou Bakhe',
          driverPhone: '+221776783412',
          driverScore: driverReliabilityScore,
        }),
      });
      if (res.ok) {
        const resReq = await fetch('/api/allo-prive');
        if (resReq.ok) {
          const data = await resReq.json();
          setAlloPriveRequests(data.requests || []);
        }
      }
    } catch (e) {}
  };

  const handleOpenReleaseModal = (id: string, type: 'mission' | 'colis') => {
    setReleaseItemId(id);
    setReleaseItemType(type);
    setReleaseReason('');
    setCustomReason('');
    setReleaseModalOpen(true);
  };

  const confirmRelease = async () => {
    if (!releaseItemId || !releaseItemType) return;
    
    if (releaseItemType === 'mission') {
      setMissions(missions.map(m => m.id === releaseItemId ? { ...m, status: 'disponible' } : m));
    } else {
      try {
        await fetch(`/api/colis/${releaseItemId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ statut: 'En attente de prise en charge' })
        });
        setColis(colis.map(c => c.id === releaseItemId ? { ...c, status: 'disponible' } : c));
      } catch (e) {}
    }
    
    setReleaseModalOpen(false);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors"><Store className="w-5 h-5 text-orange-500 dark:text-orange-400" /> Marketplace Missions</h2>
        <div className="flex gap-2 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333333] rounded-xl px-3 py-2 items-center flex-1 max-w-sm transition-colors">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
          <input placeholder="Chercher trajet, ville..." className="bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white w-full placeholder:text-slate-400 dark:placeholder:text-slate-500" />
        </div>
      </div>

      <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4 flex items-start gap-4">
        <div className="bg-orange-500/20 p-2 rounded-xl text-orange-400 shrink-0">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-orange-600 dark:text-orange-400">Recherche Active</p>
          <p className="text-xs text-orange-900/70 dark:text-slate-300 mt-1 transition-colors">Vous recevrez des alertes pour les missions à moins de 15km de votre position actuelle (Dakar).</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Encart Score de Fiabilité */}
        <div className={`border rounded-2xl p-4 flex items-start gap-4 ${driverReliabilityScore < 70 ? 'bg-rose-500/10 border-rose-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
          <div className={`p-2 rounded-xl shrink-0 ${driverReliabilityScore < 70 ? 'bg-rose-500/20 text-rose-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className={`text-sm font-bold ${driverReliabilityScore < 70 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              Score de Fiabilité : {driverReliabilityScore}%
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {driverReliabilityScore < 70 
                ? "Votre score est faible (annulations ou refus). L'accès à certaines missions premium est restreint."
                : "Bon travail ! Vous avez accès à toutes les missions."}
            </p>
          </div>
        </div>

        {/* Appels d'offres Allo Privé (Voiture entière) */}
        {alloPriveRequests.filter(req => req.status === 'PENDING').map((req) => {
          const isOrdinary = req.type === 'ordinaire';
          const minScore = isOrdinary ? 0 : 80;
          const isLocked = minScore > driverReliabilityScore;
          const hasApplied = req.applications.some((app: any) => app.driverId === 'demo-driver-id');
          
          return (
            <div key={req.id} className={`relative bg-gradient-to-br from-orange-500/5 to-transparent dark:from-orange-500/10 dark:to-transparent border rounded-3xl p-6 transition-all ${isLocked ? 'border-rose-500/20' : isOrdinary ? 'border-slate-200 dark:border-[#2A2A2A]' : 'border-orange-500/30'}`}>
              <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 ${isLocked ? 'opacity-40' : ''}`}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {isOrdinary ? (
                      <span className="bg-slate-500 text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">Allogoo Ordinaire</span>
                    ) : (
                      <>
                        <span className="bg-orange-500 text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">Premium : Allo Privé</span>
                        <span className="bg-rose-500 text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">Urgent (80% requis)</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">{req.origin} → {req.destination}</h3>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Départ : {req.departureDate}</span>
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {isOrdinary ? 'Place unique / Partagée' : 'Voiture Entière'}</span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-none border-slate-200 dark:border-[#2A2A2A]">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Rémunération</p>
                    <p className="text-lg font-black text-orange-500">{req.price} FCFA</p>
                  </div>
                  {isLocked ? (
                    <button disabled className="bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2">
                      Verrouillé (Score insuffisant)
                    </button>
                  ) : hasApplied ? (
                    <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-2 rounded-xl text-xs font-bold">
                      Candidature Envoyée
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApplyAlloPrive(req.id)}
                      className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors shadow-md shadow-orange-600/10"
                    >
                      Postuler à l'offre
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {colis.filter(c => c.status === 'disponible').length > 0 && (
          <div className="mt-8 mb-4 border-t border-slate-200 dark:border-[#2A2A2A] pt-8 font-sans">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-purple-500" /> Colis Disponibles
            </h3>
            
            {!hasClient && (
              <div className="mb-4 bg-rose-500/10 border border-rose-500/30 text-rose-500 p-4 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-bold">Vous ne pouvez pas prendre de colis.</p>
                  <p className="mt-1 text-rose-500/80">Pour accepter un colis, vous devez avoir au moins un (1) client passager dans votre trajet Allo Dakar.</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {colis.filter(c => c.status === 'disponible').map(c => (
                <div key={c.id} className="bg-white dark:bg-[#141414] border hover:border-purple-500/30 rounded-2xl p-5 transition-colors group border-slate-200 dark:border-[#2A2A2A]/80">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-mono">Colis {String(c.id).startsWith('COL-') || String(c.id).startsWith('COLIS-') ? c.id : (String(c.id).includes('-') ? `COL-${String(c.id).split('-')[0].toUpperCase()}` : c.id)}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">• {c.taille}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{c.destinataire} - {c.tel}</h3>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> {c.taille}</span>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-none border-slate-200 dark:border-[#2A2A2A]">
                      <div className="text-left md:text-right">
                        <p className="text-xs text-slate-500 mb-0.5">Rémunération estimée</p>
                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{c.prix}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-slate-100 dark:bg-[#222222] hover:bg-slate-200 text-slate-700 dark:text-white text-xs font-semibold rounded-xl transition-colors">Ignorer</button>
                        <button 
                          disabled={!hasClient}
                          onClick={() => handleAccept(c.id, 'colis')}
                          className={`px-4 py-2 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${
                            hasClient 
                              ? 'bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-500/20' 
                              : 'bg-slate-300 dark:bg-[#333333] cursor-not-allowed opacity-50'
                          }`}
                        >
                          Prendre le colis <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

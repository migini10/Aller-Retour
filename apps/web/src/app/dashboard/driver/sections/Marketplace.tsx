'use client';
import React, { useState } from 'react';
import { Store, MapPin, Search, Calendar, ChevronRight, Package, AlertTriangle, X, Info } from 'lucide-react';

const initialMissions = [
  { id: 'M-104', trajet: 'Dakar → Saint-Louis', depart: 'Demain, 07:00', distance: '260 km', passagers: 4, remuneration: '18 000 FCFA', transporteur: 'Sénégal Express', urgent: true, status: 'disponible' },
  { id: 'M-105', trajet: 'Thiès → Dakar', depart: 'Aujourd\'hui, 16:00', distance: '70 km', passagers: 3, remuneration: '7 500 FCFA', transporteur: 'Indépendant', urgent: false, status: 'disponible' },
  { id: 'M-106', trajet: 'Dakar → Mbour', depart: 'Samedi, 09:00', distance: '85 km', passagers: 7, remuneration: '12 000 FCFA', transporteur: 'Allo Voyage', urgent: false, status: 'disponible' },
];

export default function SectionMarketplace() {
  const [missions, setMissions] = useState(initialMissions);
  const [colis, setColis] = useState<any[]>([]);
  const [hasClient, setHasClient] = useState(true);

  // State for the Release Modal
  const [releaseModalOpen, setReleaseModalOpen] = useState(false);
  const [releaseItemId, setReleaseItemId] = useState<string | null>(null);
  const [releaseItemType, setReleaseItemType] = useState<'mission' | 'colis' | null>(null);
  const [releaseReason, setReleaseReason] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');

  React.useEffect(() => {
    const loadData = () => {
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

      // Charger les colis
      const colisStored = localStorage.getItem('demo_colis');
      if (colisStored) {
        try {
          const parsedColis = JSON.parse(colisStored).map((c: any) => ({ ...c, status: 'disponible' }));
          setColis(parsedColis);
        } catch(e) {}
      }
    };
    
    loadData();
    window.addEventListener('colis_updated', loadData);
    return () => window.removeEventListener('colis_updated', loadData);
  }, []);

  const handleAccept = (id: string, type: 'mission' | 'colis') => {
    if (type === 'mission') {
      setMissions(missions.map(m => m.id === id ? { ...m, status: 'accepte' } : m));
    } else {
      setColis(colis.map(c => c.id === id ? { ...c, status: 'accepte' } : c));
    }
  };

  const handleOpenReleaseModal = (id: string, type: 'mission' | 'colis') => {
    setReleaseItemId(id);
    setReleaseItemType(type);
    setReleaseReason('');
    setCustomReason('');
    setReleaseModalOpen(true);
  };

  const confirmRelease = () => {
    if (!releaseItemId || !releaseItemType) return;
    
    if (releaseItemType === 'mission') {
      setMissions(missions.map(m => m.id === releaseItemId ? { ...m, status: 'disponible' } : m));
    } else {
      setColis(colis.map(c => c.id === releaseItemId ? { ...c, status: 'disponible' } : c));
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
        {missions.map(m => (
          <div key={m.id} className={`bg-white dark:bg-[#141414] border hover:border-orange-500/30 rounded-2xl p-5 transition-all group ${m.status === 'accepte' ? 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-slate-200 dark:border-[#2A2A2A]/80'}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {m.urgent && <span className="bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">Urgent</span>}
                  {m.status === 'accepte' && <span className="bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">Accepté</span>}
                  <span className="text-xs text-slate-500 font-mono">Mission {m.id}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 transition-colors">• {m.transporteur}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors">{m.trajet}</h3>
                <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400 transition-colors">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {m.depart}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {m.distance}</span>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-none border-slate-200 dark:border-[#2A2A2A] transition-colors">
                <div className="text-left md:text-right">
                  <p className="text-xs text-slate-500 mb-0.5">Rémunération</p>
                  <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{m.remuneration}</p>
                </div>
                <div className="flex gap-2">
                  {m.status === 'disponible' ? (
                    <>
                      <button className="px-4 py-2 bg-slate-100 dark:bg-[#222222] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white text-xs font-semibold rounded-xl transition-colors">Ignorer</button>
                      <button onClick={() => handleAccept(m.id, 'mission')} className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-1">Accepter <ChevronRight className="w-3.5 h-3.5" /></button>
                    </>
                  ) : (
                    <button onClick={() => handleOpenReleaseModal(m.id, 'mission')} className="px-4 py-2 bg-slate-100 dark:bg-[#222222] hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-700 dark:text-rose-500 hover:text-rose-600 border border-slate-200 dark:border-[#333] hover:border-rose-200 dark:hover:border-rose-500/30 text-xs font-bold rounded-xl transition-all flex items-center gap-1">
                      Libérer (Annuler)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {colis.length > 0 && (
          <div className="mt-8 mb-4 border-t border-slate-200 dark:border-[#2A2A2A] pt-8">
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
              {colis.map(c => (
                <div key={c.id} className={`bg-white dark:bg-[#141414] border hover:border-purple-500/30 rounded-2xl p-5 transition-colors group ${c.status === 'accepte' ? 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-slate-200 dark:border-[#2A2A2A]/80'}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {c.status === 'accepte' && <span className="bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">Accepté</span>}
                        <span className="text-xs text-slate-500 font-mono">Colis {c.id}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">• {c.taille}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{c.trajet}</h3>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {c.date}</span>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-none border-slate-200 dark:border-[#2A2A2A]">
                      <div className="text-left md:text-right">
                        <p className="text-xs text-slate-500 mb-0.5">Rémunération estimée</p>
                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">5 000 FCFA</p>
                      </div>
                      <div className="flex gap-2">
                        {c.status === 'disponible' ? (
                          <>
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
                          </>
                        ) : (
                          <button onClick={() => handleOpenReleaseModal(c.id, 'colis')} className="px-4 py-2 bg-slate-100 dark:bg-[#222222] hover:bg-rose-50 dark:hover:bg-rose-500/10 text-slate-700 dark:text-rose-500 hover:text-rose-600 border border-slate-200 dark:border-[#333] hover:border-rose-200 dark:hover:border-rose-500/30 text-xs font-bold rounded-xl transition-all flex items-center gap-1">
                            Libérer (Annuler)
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Release Confirmation Modal */}
      {releaseModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm" onClick={() => setReleaseModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
            <button onClick={() => setReleaseModalOpen(false)} className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-[#222] hover:bg-slate-200 dark:hover:bg-[#333] rounded-full text-slate-500 dark:text-slate-400 transition-colors">
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mb-6">
              <AlertTriangle className="w-6 h-6 text-rose-500" />
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Libérer cette {releaseItemType} ?</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Si vous libérez cette {releaseItemType}, elle sera de nouveau visible par tous les autres chauffeurs. Veuillez préciser la raison.
            </p>

            <div className="space-y-3 mb-6">
              {['Panne de véhicule', 'Client injoignable', 'Retard imprévu', 'Autre'].map(reason => (
                <label key={reason} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${releaseReason === reason ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10' : 'border-slate-200 dark:border-[#333] hover:border-orange-500/50'}`}>
                  <input type="radio" name="releaseReason" value={reason} checked={releaseReason === reason} onChange={(e) => setReleaseReason(e.target.value)} className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-slate-300" />
                  <span className={`text-sm font-semibold ${releaseReason === reason ? 'text-orange-600 dark:text-orange-400' : 'text-slate-700 dark:text-slate-300'}`}>{reason}</span>
                </label>
              ))}

              {releaseReason === 'Autre' && (
                <textarea 
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Précisez la raison..." 
                  className="w-full mt-2 p-3 rounded-xl border border-slate-200 dark:border-[#333] bg-slate-50 dark:bg-[#1A1A1A] text-sm text-slate-900 dark:text-white outline-none focus:border-orange-500 transition-colors"
                  rows={3}
                ></textarea>
              )}
            </div>

            <div className="flex gap-3 mt-auto">
              <button onClick={() => setReleaseModalOpen(false)} className="flex-1 px-4 py-3 bg-slate-100 dark:bg-[#222] hover:bg-slate-200 dark:hover:bg-[#333] text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors">
                Annuler
              </button>
              <button 
                onClick={confirmRelease} 
                disabled={!releaseReason || (releaseReason === 'Autre' && !customReason.trim())}
                className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:hover:bg-rose-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-rose-500/20"
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

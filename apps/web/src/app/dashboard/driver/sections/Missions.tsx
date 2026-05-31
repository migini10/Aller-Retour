'use client';
import React, { useState } from 'react';
import { Route, Clock, Play, CheckCircle2, AlertTriangle, MessageSquare, MapPin, Plus, X, Loader2, CarFront } from 'lucide-react';

const initialMissions = [
  { id: 'TRIP-402', trajet: 'Dakar → Touba', date: 'Aujourd\'hui', heure: '14:30', vehicule: 'Bus 50 Places', statut: 'à venir', passagers: 45 },
  { id: 'TRIP-398', trajet: 'Thiès → Dakar', date: 'Aujourd\'hui', heure: '08:00', vehicule: 'Bus 50 Places', statut: 'terminé', passagers: 48 },
  { id: 'TRIP-405', trajet: 'Dakar → Saint-Louis', date: 'Demain', heure: '07:00', vehicule: 'Bus 50 Places', statut: 'programmé', passagers: 22 },
];

const tabs = ['Toutes', 'Aujourd\'hui', 'Programmées', 'Historique'];

const statutStyle: Record<string, string> = {
  'à venir': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'terminé': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'programmé': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'en cours': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

export default function SectionMissions() {
  const [isMounted, setIsMounted] = React.useState(false);
  
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const [tab, setTab] = useState('Toutes');
  const [localMissions, setLocalMissions] = useState(initialMissions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [formData, setFormData] = useState({
    originCity: '',
    destinationCity: '',
    date: '',
    heure: '',
    pricePerSeat: '' as number | '',
    vehicleCapacity: '' as number | '',
    placesLibres: '' as number | '',
    isAirConditioned: true,
    takesTollRoad: true
  });

  const SENEGAL_CITIES = ['Dakar', 'Touba', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 'Mbour', 'Diourbel', 'Tambacounda', 'Louga', 'Kolda', 'Fatick', 'Kaffrine', 'Matam', 'Sédhiou', 'Kédougou'];
  const [originSuggestions, setOriginSuggestions] = useState<string[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<string[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  const getTodayStr = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };

  const getAvailableDates = () => {
    const dates = [];
    const base = new Date();
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(base.getTime());
      d.setDate(base.getDate() + i);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      const val = d.toISOString().split('T')[0];
      
      const formatD = new Date(base.getTime());
      formatD.setDate(base.getDate() + i);
      let dayName = formatD.toLocaleDateString('fr-FR', { weekday: 'long' });
      dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
      let dayNum = formatD.getDate();
      let dayStr = dayNum === 1 ? '1er' : dayNum.toString();
      let monthName = formatD.toLocaleDateString('fr-FR', { month: 'long' });
      let label = `${dayName} ${dayStr} ${monthName}`;
      dates.push({ value: val, label });
    }
    return dates;
  };

  const getAvailableHours = () => {
    const hours = [];
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const todayStr = today.toISOString().split('T')[0];
    const isToday = formData.date === todayStr || formData.date === "Aujourd'hui";
    
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    const currentTotalMinutes = currentHour * 60 + currentMinute;
    const MARGIN_MINUTES = 60; // 1 heure de délai minimum

    for (let i = 0; i < 24; i++) {
      const hourStr = i.toString().padStart(2, '0');
      
      const slot00TotalMinutes = i * 60;
      if (!isToday || slot00TotalMinutes >= currentTotalMinutes + MARGIN_MINUTES) {
        hours.push(`${hourStr}:00`);
      }
      
      const slot30TotalMinutes = i * 60 + 30;
      if (!isToday || slot30TotalMinutes >= currentTotalMinutes + MARGIN_MINUTES) {
        hours.push(`${hourStr}:30`);
      }
    }
    return hours;
  };

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitError('');
    setSubmitSuccess('');
    
    if (!formData.originCity || !formData.destinationCity || !formData.date || !formData.heure || !formData.pricePerSeat || !formData.placesLibres || !formData.vehicleCapacity) {
      setSubmitError('Veuillez remplir tous les champs obligatoires.');
      setIsLoading(false);
      return;
    }

    if (formData.placesLibres >= formData.vehicleCapacity) {
      setSubmitError('Le nombre de places disponibles doit être inférieur à la capacité totale du véhicule (il faut compter la place du chauffeur !).');
      setIsLoading(false);
      return;
    }

    const newMission = {
      id: `TRIP-${Math.floor(Math.random() * 1000)}`,
      trajet: `${formData.originCity} → ${formData.destinationCity}`,
      date: formData.date,
      heure: formData.heure,
      vehicule: 'Voiture Allo Dakar',
      statut: 'programmé',
      passagers: 0,
      placesLibres: formData.placesLibres,
      isAirConditioned: formData.isAirConditioned,
      takesTollRoad: formData.takesTollRoad
    };

    try {
      const departureTime = new Date(`${formData.date}T${formData.heure}`);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const res = await fetch(`${apiUrl}/v1/trips/create-allo-dakar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originCity: formData.originCity,
          destinationCity: formData.destinationCity,
          pricePerSeat: formData.pricePerSeat,
          departureTime: departureTime.toISOString(),
          placesLibres: formData.placesLibres,
          vehicleCapacity: formData.vehicleCapacity,
          isAirConditioned: formData.isAirConditioned,
          takesTollRoad: formData.takesTollRoad
        })
      });
      if (res.ok) {
        setSubmitSuccess('Trajet Allo Dakar créé avec succès sur le serveur ! Il est maintenant visible par les passagers.');
        setLocalMissions([newMission, ...localMissions]);
        
        // Sauvegarde dans le localStorage pour la démo Vercel
        const stored = localStorage.getItem('demo_trips');
        const demoTrips = stored ? JSON.parse(stored) : [];
        demoTrips.push(newMission);
        localStorage.setItem('demo_trips', JSON.stringify(demoTrips));

        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitSuccess('');
        }, 2000);
      } else {
        const errorText = await res.text();
        throw new Error(`${errorText}`);
      }
    } catch (err: any) {
      console.error("Erreur de connexion au backend:", err);
      let errMsg = err.message;
      try {
        const parsed = JSON.parse(errMsg);
        errMsg = parsed.message || parsed.error || errMsg;
      } catch (e) {}
      setSubmitError(typeof errMsg === 'string' ? errMsg : "Impossible de joindre le serveur. Assurez-vous que l'API est en ligne.");
    }
    setIsLoading(false);
  };

  const checkTooSoon = (dateStr: string, heureStr: string) => {
    if (dateStr === "Aujourd'hui") {
      const parts = heureStr.split(':');
      const h = parseInt(parts[0]);
      const m = parseInt(parts[1]);
      const currentHour = new Date().getHours();
      const currentMinute = new Date().getMinutes();
      const diffMinutes = (h * 60 + m) - (currentHour * 60 + currentMinute);
      return diffMinutes >= 0 && diffMinutes < 60;
    }
    return false;
  };
  
  const hasUrgentTrips = localMissions.some(m => checkTooSoon(m.date, m.heure) && m.statut === 'programmé');

  if (!isMounted) return null;

  return (
    <div className="space-y-6 relative">
      {hasUrgentTrips && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-500 p-4 rounded-xl flex items-start gap-3 animate-pulse">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold">Attention, votre départ est dans moins d'une heure !</p>
            <p className="mt-1 text-rose-500/80">Les réservations automatiques sont bloquées si vous ne changez pas votre heure de départ. Préparez-vous à recevoir des appels.</p>
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Route className="w-5 h-5 text-orange-400" /> Mes Missions & Trajets</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-2"
        >
          <CarFront className="w-4 h-4" /> Proposer un Trajet Allo Dakar
        </button>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${tab === t ? 'bg-orange-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {localMissions.map(m => (
          <div key={m.id} className="bg-[#101728] border border-slate-800/80 hover:border-orange-500/30 rounded-2xl p-5 transition-colors space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-500">{m.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-lg border font-bold ${statutStyle[m.statut]}`}>{m.statut}</span>
                </div>
                <p className="font-bold text-white text-lg">{m.trajet}</p>
                <p className="text-sm text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {m.date} à {m.heure}</p>
                <p className="text-xs text-slate-500">
                  {m.vehicule} • {m.passagers} passagers prévus
                  {m.placesLibres ? ` • ${m.placesLibres} places offertes` : ''}
                </p>
                {/* Options (mock pour les missions statiques si pas défini) */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {(m.isAirConditioned !== false) && (
                    <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-bold px-2 py-0.5 rounded-md">❄️ Climatisé</span>
                  )}
                  {(m.takesTollRoad !== false) && (
                    <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold px-2 py-0.5 rounded-md">🛣️ Autoroute</span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                {m.statut === 'à venir' && (
                  <button 
                    onClick={() => window.location.hash = 'localisation'}
                    className="flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" /> Démarrer trajet
                  </button>
                )}
                {m.statut === 'en cours' && (
                  <button className="flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Terminer trajet
                  </button>
                )}
                <button className="flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 transition-colors">
                  <MapPin className="w-3.5 h-3.5" /> Voir détails
                </button>
                {m.statut === 'programmé' && checkTooSoon(m.date, m.heure) && (
                  <button 
                    onClick={() => {
                      const parts = m.heure.split(':');
                      const newH = (parseInt(parts[0]) + 1).toString().padStart(2, '0');
                      const newHeure = `${newH}:${parts[1]}`;
                      setLocalMissions(localMissions.map(m2 => m2.id === m.id ? { ...m2, heure: newHeure } : m2));
                    }}
                    className="flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors shadow-lg shadow-indigo-600/20"
                  >
                    <Clock className="w-3.5 h-3.5" /> Repousser +1h
                  </button>
                )}
                {(m.statut === 'à venir' || m.statut === 'en cours') && (
                  <button className="flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700 transition-colors">
                    <AlertTriangle className="w-3.5 h-3.5" /> Signaler incident
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Création Trajet */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-[#050A15] sm:rounded-3xl border border-slate-800/80 shadow-2xl p-6 animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-900 rounded-full border border-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CarFront className="w-6 h-6 text-orange-500" /> Nouveau Trajet
            </h3>

            {submitError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium">
                {submitError}
              </div>
            )}
            
            {submitSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-medium">
                {submitSuccess}
              </div>
            )}

            <form onSubmit={handleCreateTrip} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 relative">
                  <label className="text-xs text-slate-400 font-medium">Départ</label>
                  <input type="text" value={formData.originCity} 
                    onChange={e => {
                      const val = e.target.value;
                      setFormData({...formData, originCity: val});
                      setOriginSuggestions(SENEGAL_CITIES.filter(c => c.toLowerCase().includes(val.toLowerCase())));
                      setShowOriginSuggestions(true);
                    }}
                    onFocus={() => {
                      setOriginSuggestions(SENEGAL_CITIES.filter(c => c.toLowerCase().includes(formData.originCity.toLowerCase())));
                      setShowOriginSuggestions(true);
                    }}
                    onBlur={() => setTimeout(() => setShowOriginSuggestions(false), 200)}
                    className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500 outline-none" required placeholder="Saisir ou choisir" 
                  />
                  {showOriginSuggestions && originSuggestions.length > 0 && (
                    <ul className="absolute z-50 w-full bg-[#101728] border border-slate-700 rounded-xl mt-1 max-h-40 overflow-y-auto shadow-xl custom-scrollbar">
                      {originSuggestions.map(city => (
                        <li key={city} onClick={() => {
                           setFormData({...formData, originCity: city});
                           setShowOriginSuggestions(false);
                        }} className="px-4 py-2 hover:bg-orange-500/20 text-slate-300 hover:text-white cursor-pointer text-sm">
                          {city}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="space-y-1.5 relative">
                  <label className="text-xs text-slate-400 font-medium">Arrivée</label>
                  <input type="text" value={formData.destinationCity} 
                    onChange={e => {
                      const val = e.target.value;
                      setFormData({...formData, destinationCity: val});
                      setDestSuggestions(SENEGAL_CITIES.filter(c => c.toLowerCase().includes(val.toLowerCase())));
                      setShowDestSuggestions(true);
                    }}
                    onFocus={() => {
                      setDestSuggestions(SENEGAL_CITIES.filter(c => c.toLowerCase().includes(formData.destinationCity.toLowerCase())));
                      setShowDestSuggestions(true);
                    }}
                    onBlur={() => setTimeout(() => setShowDestSuggestions(false), 200)}
                    className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500 outline-none" required placeholder="Saisir ou choisir" 
                  />
                  {showDestSuggestions && destSuggestions.length > 0 && (
                    <ul className="absolute z-50 w-full bg-[#101728] border border-slate-700 rounded-xl mt-1 max-h-40 overflow-y-auto shadow-xl custom-scrollbar">
                      {destSuggestions.map(city => (
                        <li key={city} onClick={() => {
                           setFormData({...formData, destinationCity: city});
                           setShowDestSuggestions(false);
                        }} className="px-4 py-2 hover:bg-orange-500/20 text-slate-300 hover:text-white cursor-pointer text-sm">
                          {city}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 relative">
                  <label className="text-xs text-slate-400 font-medium">Date</label>
                  <select 
                    value={formData.date} 
                    onChange={e => {
                      setFormData({...formData, date: e.target.value, heure: ''});
                    }} 
                    className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500 outline-none appearance-none" 
                    required
                  >
                    <option value="" disabled>Choisir la date</option>
                    {getAvailableDates().map(d => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-10 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
                <div className="space-y-1.5 relative">
                  <label className="text-xs text-slate-400 font-medium">Heure</label>
                  <select 
                    value={formData.heure} 
                    onChange={e => setFormData({...formData, heure: e.target.value})} 
                    className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500 outline-none appearance-none" 
                    required
                    disabled={!formData.date}
                  >
                    <option value="" disabled>Choisir l'heure</option>
                    {getAvailableHours().map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-10 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 relative">
                  <label className="text-xs text-slate-400 font-medium">Type de Voiture</label>
                  <select 
                    value={formData.vehicleCapacity} 
                    onChange={e => setFormData({...formData, vehicleCapacity: parseInt(e.target.value)})} 
                    className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500 outline-none appearance-none" 
                    required
                  >
                    <option value="" disabled>Capacité totale</option>
                    <option value="5">Voiture 5 places</option>
                    <option value="7">Voiture 7 places</option>
                  </select>
                  <div className="absolute right-4 top-10 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium">Places Disponibles</label>
                  <input type="number" min="1" max={formData.vehicleCapacity ? formData.vehicleCapacity - 1 : 6} value={formData.placesLibres} onChange={e => setFormData({...formData, placesLibres: e.target.value ? parseInt(e.target.value) : ''})} className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500 outline-none" required placeholder="ex: 4" disabled={!formData.vehicleCapacity} />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Prix par place (FCFA)</label>
                <input type="number" min="500" value={formData.pricePerSeat} onChange={e => setFormData({...formData, pricePerSeat: e.target.value ? parseInt(e.target.value) : ''})} className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-orange-500 outline-none" required placeholder="ex: 5000" />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm text-slate-300 font-medium cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.isAirConditioned} 
                    onChange={e => setFormData({...formData, isAirConditioned: e.target.checked})} 
                    className="w-4 h-4 rounded bg-[#0B0F19] border-slate-700 text-orange-500 focus:ring-orange-500"
                  />
                  ❄️ Climatisé
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-300 font-medium cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.takesTollRoad} 
                    onChange={e => setFormData({...formData, takesTollRoad: e.target.checked})} 
                    className="w-4 h-4 rounded bg-[#0B0F19] border-slate-700 text-orange-500 focus:ring-orange-500"
                  />
                  🛣️ Autoroute
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full mt-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publier le trajet'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

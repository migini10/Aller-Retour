'use client';
import React, { useState } from 'react';
import { Route, Clock, Play, CheckCircle2, AlertTriangle, MessageSquare, MapPin, Plus, X, Loader2, CarFront } from 'lucide-react';

const initialMissions = [
  { id: 'TRIP-402', displayId: 'TRIP-402', trajet: 'Dakar → Touba', date: 'Aujourd\'hui', heure: '14:30', vehicule: 'Bus 50 Places', statut: 'à venir', passagers: 45, placesLibres: 5, placesPrises: 45, isAirConditioned: true, takesTollRoad: true, pricePerSeat: 5000 },
  { id: 'TRIP-398', displayId: 'TRIP-398', trajet: 'Thiès → Dakar', date: 'Aujourd\'hui', heure: '08:00', vehicule: 'Bus 50 Places', statut: 'terminé', passagers: 48, placesLibres: 2, placesPrises: 48, isAirConditioned: true, takesTollRoad: true, pricePerSeat: 5000 },
  { id: 'TRIP-405', displayId: 'TRIP-405', trajet: 'Dakar → Saint-Louis', date: 'Demain', heure: '07:00', vehicule: 'Bus 50 Places', statut: 'programmé', passagers: 22, placesLibres: 28, placesPrises: 22, isAirConditioned: true, takesTollRoad: false, pricePerSeat: 5000 },
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
  const [cancelAlertMessage, setCancelAlertMessage] = useState('');
  const [tab, setTab] = useState('Toutes');
  const [localMissions, setLocalMissions] = useState(initialMissions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMissionId, setEditMissionId] = useState<string | null>(null);
  const [selectedDetailMission, setSelectedDetailMission] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const isTripInPast = (m: any) => {
    if (m.departureTime) {
      return new Date(m.departureTime).getTime() < new Date().getTime();
    }
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (m.date === "Aujourd'hui") {
        if (m.heure) {
          const [h, min] = m.heure.split(':').map(Number);
          const d = new Date();
          d.setHours(h, min, 0, 0);
          return d.getTime() < new Date().getTime();
        }
        return false;
      }
      if (m.date === "Demain") {
        return false;
      }
      const mDate = new Date(m.date);
      mDate.setHours(0, 0, 0, 0);
      if (mDate < today) return true;
      if (mDate.getTime() === today.getTime() && m.heure) {
        const [h, min] = m.heure.split(':').map(Number);
        const d = new Date();
        d.setHours(h, min, 0, 0);
        return d.getTime() < new Date().getTime();
      }
    } catch (e) {}
    return false;
  };

  const mapApiMissionToLocal = (m: any) => {
    let dateStr = "Aujourd'hui";
    let heureStr = "12:00";
    if (m.departureTime) {
      try {
        const d = new Date(m.departureTime);
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const dStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
        const tomorrowStr = tomorrow.getFullYear() + '-' + String(tomorrow.getMonth() + 1).padStart(2, '0') + '-' + String(tomorrow.getDate()).padStart(2, '0');

        if (dStr === todayStr) {
          dateStr = "Aujourd'hui";
        } else if (dStr === tomorrowStr) {
          dateStr = "Demain";
        } else {
          dateStr = dStr; // YYYY-MM-DD
        }
        heureStr = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      } catch (e) {
        console.error("Error formatting date:", e);
      }
    } else {
      let dateParts = m.depart.split(', ');
      if (dateParts.length > 1) {
        dateStr = dateParts[0];
        heureStr = dateParts[1];
      } else {
        heureStr = dateParts[0];
      }
    }
    return {
      id: m.tripId || m.id,
      displayId: (() => {
        const uuid = m.tripId && m.tripId !== 'M' ? m.tripId : (m.id && !m.id.startsWith('M-') && !m.id.startsWith('TRIP-') ? m.id : null);
        if (uuid) {
          return `TRIP-${String(uuid).split('-')[0].toUpperCase()}`;
        }
        const fallback = String(m.id || m.tripId || '');
        if (fallback.startsWith('TRIP-')) {
          return fallback;
        }
        if (fallback.startsWith('M-')) {
          const suffix = fallback.substring(2);
          if (suffix && suffix !== 'M') {
            return `TRIP-${suffix.toUpperCase()}`;
          }
        }
        const first = fallback.split('-')[0];
        return `TRIP-${first && first !== 'M' ? first.toUpperCase() : 'XXXX'}`;
      })(),
      trajet: m.trajet,
      date: dateStr,
      rawDate: m.departureTime ? m.departureTime.split('T')[0] : null,
      departureTime: m.departureTime || null,
      heure: heureStr,
      vehicule: m.transporteur,
      statut: m.status || 'programmé',
      passagers: m.passagers,
      placesLibres: m.placesLibres ?? 4,
      placesPrises: m.placesPrises ?? 0,
      isAirConditioned: m.isAirConditioned ?? true,
      takesTollRoad: m.takesTollRoad ?? true,
      pricePerSeat: m.pricePerSeat ?? 5000
    };
  };

  React.useEffect(() => {
    setIsMounted(true);

    const handleCancelAlert = (e: any) => {
      setCancelAlertMessage(`⚠️ ALERTE : Un passager vient d'annuler sa réservation pour le trajet ${e.detail.trajet} ! Une place s'est libérée.`);
      setTimeout(() => setCancelAlertMessage(''), 10000);
    };

    window.addEventListener('cancel_reservation', handleCancelAlert);
    
    // Fetch real missions from DB
    const fetchApiMissions = async () => {
      try {
        const res = await fetch('/api/missions', { cache: 'no-store' });
        if (res.ok) {
          const apiData = await res.json();
          const mappedMissions = apiData.map(mapApiMissionToLocal);
          setLocalMissions(mappedMissions);
        }
      } catch(e) {
        console.error("Erreur lors de la récupération des missions API:", e);
      }
    };
    
    fetchApiMissions();
    const interval = setInterval(fetchApiMissions, 10000); // refresh every 10s

    return () => {
      window.removeEventListener('cancel_reservation', handleCancelAlert);
      clearInterval(interval);
    };
  }, []);


  const [formData, setFormData] = useState({
    originCity: '',
    destinationCity: '',
    date: '',
    heure: '',
    pricePerSeat: '' as number | '',
    vehicleCapacity: '' as number | '',
    placesLibres: '' as number | '',
    passagers: 0,
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

    const missingFields = [];
    if (!formData.originCity) missingFields.push("Ville de départ");
    if (!formData.destinationCity) missingFields.push("Ville d'arrivée");
    if (!formData.date) missingFields.push("Date");
    if (!formData.heure) missingFields.push("Heure");
    if (!formData.pricePerSeat) missingFields.push("Prix par place");
    if (!formData.placesLibres) missingFields.push("Places libres");
    if (!formData.vehicleCapacity) missingFields.push("Type de voiture");

    if (missingFields.length > 0) {
      const errMsg = `Champs obligatoires manquants : ${missingFields.join(', ')}`;
      setSubmitError(errMsg);
      setIsLoading(false);
      return;
    }

    if (formData.placesLibres >= formData.vehicleCapacity) {
      const errMsg = 'Le nombre de places disponibles doit être inférieur à la capacité totale du véhicule (il faut compter la place du chauffeur !).';
      setSubmitError(errMsg);
      setIsLoading(false);
      return;
    }

    try {
      const dateStr = `${formData.date}T${formData.heure}`;
      const departureTime = new Date(dateStr);
      if (isNaN(departureTime.getTime())) {
        throw new Error("Date ou heure de départ invalide.");
      }

      const url = editMissionId ? `/api/missions/${editMissionId}` : `/api/missions`;
      const method = editMissionId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          originCity: formData.originCity,
          destinationCity: formData.destinationCity,
          pricePerSeat: formData.pricePerSeat,
          departureTime: departureTime,
          placesLibres: formData.placesLibres,
          vehicleCapacity: formData.vehicleCapacity,
          passagers: formData.passagers,
          isAirConditioned: formData.isAirConditioned,
          takesTollRoad: formData.takesTollRoad
        })
      });

      if (res.ok) {
        setSubmitSuccess("Trajet enregistré dans la base de données !");

        // Refresh list of missions in background
        fetch('/api/missions', { cache: 'no-store' })
          .then(fetchRes => {
            if (fetchRes.ok) {
              return fetchRes.json();
            }
            throw new Error("API error");
          })
          .then(apiData => {
            const mappedMissions = apiData.map(mapApiMissionToLocal);
            setLocalMissions(mappedMissions);
          })
          .catch(e => console.error("Error refreshing missions list in background:", e));

        setTimeout(() => {
          setIsModalOpen(false);
          setEditMissionId(null);
          setSubmitSuccess('');
          setFormData({
            originCity: '',
            destinationCity: '',
            date: '',
            heure: '',
            pricePerSeat: '',
            vehicleCapacity: '',
            placesLibres: '',
            passagers: 0,
            isAirConditioned: true,
            takesTollRoad: true
          });
        }, 800);
      } else {
        const errorText = await res.text();
        throw new Error(`${errorText}`);
      }
    } catch (err: any) {
      console.error("Erreur de connexion au backend:", err);
      let errMsg = err.message;
      try {
        const parsed = JSON.parse(errMsg);
        errMsg = parsed.message || (parsed.details ? `${parsed.error} (${parsed.details})` : parsed.error) || errMsg;
      } catch (e) {}
      setSubmitError(typeof errMsg === 'string' ? errMsg : "Impossible de joindre le serveur. Assurez-vous que l'API est en ligne.");
    }
    setIsLoading(false);
  };

  const handlePushBackOneHour = async (m: any) => {
    setIsLoading(true);
    try {
      let currentDep = m.departureTime ? new Date(m.departureTime) : null;
      if (!currentDep || isNaN(currentDep.getTime())) {
        const dateStr = `${m.rawDate || getTodayStr()}T${m.heure}`;
        currentDep = new Date(dateStr);
      }
      if (isNaN(currentDep.getTime())) {
        throw new Error("Date de départ invalide.");
      }

      const newDep = new Date(currentDep.getTime() + 60 * 60 * 1000);
      const newH = newDep.getHours().toString().padStart(2, '0');
      const newMin = newDep.getMinutes().toString().padStart(2, '0');
      const newHeure = `${newH}:${newMin}`;

      // 1. Optimistic UI update
      setLocalMissions(localMissions.map(m2 => m2.id === m.id ? { ...m2, heure: newHeure, departureTime: newDep.toISOString() } : m2));

      // 2. Database update
      const separator = m.trajet.includes('→') ? '→' : m.trajet.includes('->') ? '->' : m.trajet.includes(' - ') ? ' - ' : '-';
      const parts = m.trajet.split(separator).map((s: string) => s.trim());
      const originCity = parts[0] || '';
      const destinationCity = parts[1] || '';

      const res = await fetch(`/api/missions/${m.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          originCity,
          destinationCity,
          pricePerSeat: m.pricePerSeat || 5000,
          departureTime: newDep,
          placesLibres: m.placesLibres || 0,
          vehicleCapacity: (m.placesLibres || 0) + (m.placesPrises || 0) + 1,
          passagers: m.passagers || 0,
          isAirConditioned: m.isAirConditioned ?? true,
          takesTollRoad: m.takesTollRoad ?? true
        })
      });

      if (!res.ok) {
        throw new Error("Erreur de sauvegarde de l'heure sur le serveur.");
      }

      // Refresh list to sync with DB
      const freshRes = await fetch('/api/missions', { cache: 'no-store' });
      if (freshRes.ok) {
        const apiData = await freshRes.ok && await freshRes.json();
        if (apiData) {
          setLocalMissions(apiData.map(mapApiMissionToLocal));
        }
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Erreur de connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkTooSoon = (dateStr: string, heureStr: string) => {
    if (dateStr === "Aujourd'hui" || dateStr === getTodayStr()) {
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
      {cancelAlertMessage && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-500 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-sm font-medium">
            {cancelAlertMessage}
          </div>
        </div>
      )}

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
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors"><Route className="w-5 h-5 text-orange-500 dark:text-orange-400" /> Mes Missions & Trajets</h2>
        <button 
          onClick={() => {
            setEditMissionId(null);
            setFormData({
              originCity: '',
              destinationCity: '',
              date: '',
              heure: '',
              pricePerSeat: '' as any,
              vehicleCapacity: '' as any,
              placesLibres: '' as any,
              passagers: 0,
              isAirConditioned: true,
              takesTollRoad: true
            });
            setIsModalOpen(true);
          }}
          className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-2"
        >
          <CarFront className="w-4 h-4" /> Proposer un Trajet Allo Dakar
        </button>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${tab === t ? 'bg-orange-600 text-white' : 'bg-slate-100 dark:bg-[#1A1A1A] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#2A2A2A]'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {(() => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const currentHour = new Date().getHours();
          const currentMinute = new Date().getMinutes();
          const currentTotalMinutes = currentHour * 60 + currentMinute;
          
          const processedMissions = localMissions.map(m => {
            if (m.statut === 'programmé' || m.statut === 'à venir') {
              let isExpired = false;
              
              if (m.departureTime) {
                isExpired = new Date(m.departureTime).getTime() < Date.now();
              } else {
                if (m.date && m.date !== "Aujourd'hui" && m.date !== "Demain") {
                  const mDate = new Date(m.date);
                  mDate.setHours(0, 0, 0, 0);
                  if (mDate < today) {
                    isExpired = true;
                  } else if (mDate.getTime() === today.getTime() && m.heure) {
                    const parts = m.heure.split(':');
                    const h = parseInt(parts[0]);
                    const min = parseInt(parts[1]);
                    if ((h * 60 + min) < currentTotalMinutes) {
                      isExpired = true;
                    }
                  }
                } else if (m.date === "Aujourd'hui") {
                  if (m.heure) {
                    const parts = m.heure.split(':');
                    const h = parseInt(parts[0]);
                    const min = parseInt(parts[1]);
                    if ((h * 60 + min) < currentTotalMinutes) {
                      isExpired = true;
                    }
                  }
                }
              }

              if (isExpired) {
                return { ...m, statut: 'terminé' };
              }
            }
            return m;
          });

          const filteredMissions = processedMissions.filter(m => {
            if (tab === "Toutes") return m.statut !== 'terminé';
            if (tab === "Aujourd'hui") return (m.date === "Aujourd'hui" || m.date === getTodayStr()) && m.statut !== 'terminé';
            if (tab === "Programmées") return m.statut === 'programmé' || m.statut === 'à venir';
            if (tab === "Historique") return m.statut === 'terminé';
            return true;
          });

          return filteredMissions.map(m => {
            const isUrgentNotReady = m.statut === 'programmé' && checkTooSoon(m.date, m.heure);
            return (
            <div 
              key={m.id} 
              className={`border rounded-2xl p-5 transition-colors space-y-4 ${
                isUrgentNotReady
                  ? 'bg-rose-500/10 dark:bg-rose-950/20 border-rose-500/30 dark:border-rose-900/50 hover:border-rose-500/50'
                  : 'bg-white dark:bg-[#141414] border-slate-200 dark:border-[#2A2A2A]/80 hover:border-orange-500/30'
              }`}
            >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-500">{m.displayId || m.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-lg border font-bold ${statutStyle[m.statut]}`}>{m.statut}</span>
                </div>
                <p className="font-bold text-slate-900 dark:text-white text-lg transition-colors">{m.trajet}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 transition-colors"><Clock className="w-3.5 h-3.5" /> {
                  m.date === "Aujourd'hui" || m.date === "Demain" 
                  ? m.date 
                  : new Date(m.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
                } à {m.heure}</p>
                <p className="text-xs text-slate-500">
                  {m.vehicule} • {m.passagers} passagers prévus • {m.placesPrises ?? 0} places prises • {m.placesLibres} places offertes
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
                <button 
                  onClick={() => setSelectedDetailMission(m)}
                  className="flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1A1A1A] dark:hover:bg-[#222222] text-slate-700 dark:text-white border border-slate-200 dark:border-[#333333] transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" /> Voir détails
                </button>
                {m.statut === 'programmé' && checkTooSoon(m.date, m.heure) && (
                  <button 
                    onClick={() => handlePushBackOneHour(m)}
                    className="flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors shadow-lg shadow-indigo-600/20"
                  >
                    <Clock className="w-3.5 h-3.5" /> Repousser +1h
                  </button>
                )}
                {(m.statut === 'programmé' || m.statut === 'à venir') && (
                  <button 
                    onClick={() => {
                      const separator = m.trajet.includes('→') ? '→' : m.trajet.includes('->') ? '->' : m.trajet.includes(' - ') ? ' - ' : '-';
                      const parts = m.trajet.split(separator).map((s: string) => s.trim());
                      const originCity = parts[0] || '';
                      const destinationCity = parts[1] || '';

                      setEditMissionId(m.id);
                      setFormData({
                        originCity,
                        destinationCity,
                        date: m.rawDate || (m.date === "Aujourd'hui" ? getTodayStr() : m.date === "Demain" ? (() => { const d = new Date(); d.setDate(d.getDate()+1); return d.toISOString().split('T')[0]; })() : getTodayStr()),
                        heure: m.heure,
                        pricePerSeat: m.pricePerSeat || 5000,
                        vehicleCapacity: (m.placesLibres || 0) + (m.placesPrises || 0) + 1,
                        placesLibres: m.placesLibres || 0,
                        passagers: m.passagers || 0,
                        isAirConditioned: m.isAirConditioned ?? true,
                        takesTollRoad: m.takesTollRoad ?? true
                      });
                      setIsModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-lg shadow-blue-600/20"
                  >
                    <Route className="w-3.5 h-3.5" /> Modifier
                  </button>
                )}
                {(m.statut === 'à venir' || m.statut === 'en cours') && (
                  <button className="flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-[#1A1A1A] dark:hover:bg-[#222222] text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-[#333333] transition-colors">
                    <AlertTriangle className="w-3.5 h-3.5" /> Signaler incident
                  </button>
                )}
                {m.statut === 'programmé' && m.passagers === 0 && (
                  <button 
                    onClick={async () => {
                      if (confirm("Êtes-vous sûr de vouloir supprimer ce trajet ? Cette action est irréversible.")) {
                        try {
                          const res = await fetch(`/api/missions/${m.id}`, {
                            method: 'DELETE'
                          });

                          if (res.ok) {
                            const updatedMissions = localMissions.filter(m2 => m2.id !== m.id);
                            setLocalMissions(updatedMissions);
                            
                            // Si c'est un trajet demo, on le supprime du localStorage
                            const stored = localStorage.getItem('demo_trips');
                            if (stored) {
                              try {
                                const parsed = JSON.parse(stored);
                                const updatedStorage = parsed.filter((p: any) => p.id !== m.id);
                                localStorage.setItem('demo_trips', JSON.stringify(updatedStorage));
                              } catch(e) {}
                            }
                          } else {
                            const errText = await res.text();
                            let errMsg = "Erreur lors de la suppression";
                            try {
                              const parsedErr = JSON.parse(errText);
                              errMsg = parsedErr.details || parsedErr.error || errMsg;
                            } catch (e) {}
                            alert(`Impossible de supprimer le trajet : ${errMsg}`);
                          }
                        } catch (err: any) {
                          alert(`Erreur de connexion au serveur : ${err.message}`);
                        }
                      }
                    }}
                    className="flex items-center justify-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-white dark:bg-[#1A1A1A] hover:bg-rose-50 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 border border-slate-200 dark:border-[#333333] hover:border-rose-300 dark:hover:border-rose-500/50 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Supprimer
                  </button>
                )}
              </div>
            </div>
          </div>
        );})})()}
      </div>

      {/* Modal Création Trajet */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 dark:bg-black/90 backdrop-blur-sm transition-colors" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar bg-white dark:bg-[#000000] sm:rounded-3xl border border-slate-200 dark:border-[#2A2A2A]/80 shadow-2xl p-6 animate-in zoom-in-95 duration-300 transition-colors">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#1A1A1A] rounded-full border border-slate-200 dark:border-[#2A2A2A] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 dark:border-[#2A2A2A]">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <CarFront className="w-6 h-6 text-orange-500" /> {editMissionId ? 'Modifier le Trajet' : 'Nouveau Trajet'}
              </h2>
            </div>

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

            <form onSubmit={handleCreateTrip} noValidate className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 relative">
                  <label className="text-xs text-slate-400 font-medium">Départ</label>
                  <input 
                    type="text" 
                    value={formData.originCity} 
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
                    className="w-full bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-orange-500 outline-none transition-colors" 
                    required 
                    placeholder="Saisir ou choisir" 
                  />
                  {showOriginSuggestions && originSuggestions.length > 0 && (
                    <ul className="absolute z-[100] w-full bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#333333] rounded-xl mt-1 max-h-48 overflow-y-auto shadow-xl custom-scrollbar transition-colors">
                      {originSuggestions.map(city => (
                        <li key={city} onClick={() => {
                           setFormData({...formData, originCity: city});
                           setShowOriginSuggestions(false);
                        }} className="px-4 py-2 hover:bg-orange-100 dark:hover:bg-orange-500/20 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer text-sm transition-colors">
                          {city}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="space-y-1.5 relative">
                  <label className="text-xs text-slate-400 font-medium">Arrivée</label>
                  <input 
                    type="text" 
                    value={formData.destinationCity} 
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
                    className="w-full bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-orange-500 outline-none transition-colors" 
                    required 
                    placeholder="Saisir ou choisir" 
                  />
                  {showDestSuggestions && destSuggestions.length > 0 && (
                    <ul className="absolute z-[100] w-full bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#333333] rounded-xl mt-1 max-h-48 overflow-y-auto shadow-xl custom-scrollbar transition-colors">
                      {destSuggestions.map(city => (
                        <li key={city} onClick={() => {
                           setFormData({...formData, destinationCity: city});
                           setShowDestSuggestions(false);
                        }} className="px-4 py-2 hover:bg-orange-100 dark:hover:bg-orange-500/20 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer text-sm transition-colors">
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
                  {(() => {
                    const availableDates = getAvailableDates();
                    if (formData.date && !availableDates.some(d => d.value === formData.date)) {
                      try {
                        const d = new Date(formData.date);
                        let dayName = d.toLocaleDateString('fr-FR', { weekday: 'long' });
                        dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
                        let dayNum = d.getDate();
                        let dayStr = dayNum === 1 ? '1er' : dayNum.toString();
                        let monthName = d.toLocaleDateString('fr-FR', { month: 'long' });
                        let label = `${dayName} ${dayStr} ${monthName}`;
                        availableDates.unshift({ value: formData.date, label });
                      } catch (e) {
                        availableDates.unshift({ value: formData.date, label: formData.date });
                      }
                    }
                    return (
                      <select 
                        value={formData.date} 
                        onChange={e => {
                          setFormData({...formData, date: e.target.value, heure: ''});
                        }} 
                        className="w-full bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-orange-500 outline-none appearance-none transition-colors" 
                        required
                      >
                        <option value="" disabled>Choisir la date</option>
                        {availableDates.map(d => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>
                    );
                  })()}
                  <div className="absolute right-4 top-10 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
                <div className="space-y-1.5 relative">
                  <label className="text-xs text-slate-400 font-medium">Heure</label>
                  {(() => {
                    const availableHours = getAvailableHours();
                    if (formData.heure && !availableHours.includes(formData.heure)) {
                      availableHours.unshift(formData.heure);
                    }
                    return (
                      <select 
                        value={formData.heure} 
                        onChange={e => setFormData({...formData, heure: e.target.value})} 
                        className="w-full bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-orange-500 outline-none appearance-none transition-colors" 
                        required
                        disabled={!formData.date}
                      >
                        <option value="" disabled>Choisir l'heure</option>
                        {availableHours.map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    );
                  })()}
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
                    className="w-full bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-orange-500 outline-none appearance-none transition-colors" 
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
                  <input type="number" min="1" max={formData.vehicleCapacity ? formData.vehicleCapacity - 1 : 6} value={formData.placesLibres} onChange={e => setFormData({...formData, placesLibres: e.target.value ? parseInt(e.target.value) : ''})} className="w-full bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-orange-500 outline-none transition-colors" required placeholder="ex: 4" disabled={!formData.vehicleCapacity} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium">Prix par place (FCFA)</label>
                  <input type="number" min="500" value={formData.pricePerSeat} onChange={e => setFormData({...formData, pricePerSeat: e.target.value ? parseInt(e.target.value) : ''})} className="w-full bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-orange-500 outline-none transition-colors" required placeholder="ex: 5000" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium">Passagers prévus</label>
                  <input type="number" min="0" max={formData.placesLibres ? formData.placesLibres : 6} value={formData.passagers} onChange={e => setFormData({...formData, passagers: e.target.value ? parseInt(e.target.value) : 0})} className="w-full bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-orange-500 outline-none transition-colors" placeholder="ex: 0" />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    checked={formData.isAirConditioned} 
                    onChange={e => setFormData({...formData, isAirConditioned: e.target.checked})} 
                    className="w-4 h-4 rounded bg-white dark:bg-[#0A0A0A] border-slate-300 dark:border-[#333333] text-orange-500 focus:ring-orange-500 transition-colors"
                  />
                  ❄️ Climatisé
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    checked={formData.takesTollRoad} 
                    onChange={e => setFormData({...formData, takesTollRoad: e.target.checked})} 
                    className="w-4 h-4 rounded bg-white dark:bg-[#0A0A0A] border-slate-300 dark:border-[#333333] text-orange-500 focus:ring-orange-500 transition-colors"
                  />
                  🛣️ Autoroute
                </label>
              </div>

              {submitError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium">
                  {submitError}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full mt-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (editMissionId ? 'Modifier le trajet' : 'Publier le trajet')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedDetailMission && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 dark:bg-black/90 backdrop-blur-sm transition-colors" onClick={() => setSelectedDetailMission(null)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A]/80 rounded-3xl shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedDetailMission(null)}
              className="absolute top-4 right-4 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#1A1A1A] rounded-full border border-slate-200 dark:border-[#2A2A2A] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-500 font-bold bg-slate-100 dark:bg-[#1A1A1A] px-2 py-1 rounded-md">{selectedDetailMission.displayId || selectedDetailMission.id}</span>
                <span className={`text-xs px-2 py-0.5 rounded-lg border font-bold ${statutStyle[selectedDetailMission.statut]}`}>{selectedDetailMission.statut}</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">{selectedDetailMission.trajet}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 transition-colors mt-1">
                  <Clock className="w-4 h-4 text-orange-500" /> {
                    selectedDetailMission.date === "Aujourd'hui" || selectedDetailMission.date === "Demain" 
                    ? selectedDetailMission.date 
                    : new Date(selectedDetailMission.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
                  } à {selectedDetailMission.heure}
                </p>
              </div>

              <div className="border-t border-b border-slate-100 dark:border-[#2A2A2A] py-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Véhicule</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedDetailMission.vehicule}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Prix de la place</span>
                  <span className="font-bold text-orange-500">{selectedDetailMission.pricePerSeat || 5000} FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Places offertes</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{(selectedDetailMission.placesLibres || 0) + (selectedDetailMission.placesPrises || 0)} places</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Places réservées / prises</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedDetailMission.placesPrises || 0} places</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Places restantes libres</span>
                  <span className="font-semibold text-emerald-500">{selectedDetailMission.placesLibres || 0} places</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Passagers prévus</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedDetailMission.passagers || 0} passagers</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {(selectedDetailMission.isAirConditioned !== false) && (
                  <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-bold px-3 py-1 rounded-lg">❄️ Véhicule Climatisé</span>
                )}
                {(selectedDetailMission.takesTollRoad !== false) && (
                  <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold px-3 py-1 rounded-lg">🛣️ Passage par Autoroute</span>
                )}
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => setSelectedDetailMission(null)}
                  className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-[#1A1A1A] dark:hover:bg-[#222222] text-slate-800 dark:text-white font-bold py-2.5 rounded-xl border border-slate-200 dark:border-[#2A2A2A] transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

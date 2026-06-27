'use client';
import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Phone, MessageSquare, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SectionLocalisation() {
  const router = useRouter();
  const [eta] = useState('3 min');
  const [distance] = useState('1.2 km');

  const [isNavigating, setIsNavigating] = useState(false);
  const [navKey, setNavKey] = useState(0);
  const [activePassenger, setActivePassenger] = useState<any>(null);
  const [passagers, setPassagers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const loadRealPassengers = async () => {
      try {
        setLoading(true);
        // 1. Fetch missions to find the driver's active trip
        const resMissions = await fetch('/api/missions', { cache: 'no-store' });
        if (resMissions.ok) {
          const missions = await resMissions.json();
          // Find first active/scheduled mission (status not 'terminé' and scheduled for today)
          const todayStr = new Date().toISOString().split('T')[0];
          const activeMission = missions.find((m: any) => {
            const isToday = m.departureTime && m.departureTime.split('T')[0] === todayStr;
            return m.status !== 'terminé' && isToday;
          });
          
          if (activeMission) {
            // 2. Fetch manifest for this mission
            const resManifest = await fetch(`/api/trips/${activeMission.tripId}/manifest`);
            if (resManifest.ok) {
              const manifest = await resManifest.json();
              
              // Neighborhood list to assign randomly for visual realism
              const neighborhoods = ['Mermoz', 'Plateau', 'Almadies', 'Ouakam', 'Yoff', 'Pikine', 'Fann', 'Hann'];
              
              const mappedPassengers = (manifest.tickets || []).map((t: any, index: number) => {
                const distance = parseFloat((0.5 + index * 0.7).toFixed(1));
                const etaVal = Math.ceil(distance * 3);
                return {
                  id: t.id,
                  nom: t.nom,
                  quartier: neighborhoods[index % neighborhoods.length],
                  distance: distance,
                  eta: `${etaVal} min`,
                  tel: t.tel || '+221 77 123 45 67'
                };
              });

              setPassagers(mappedPassengers);
              return;
            }
          }
        }
        setPassagers([]);
      } catch (err) {
        console.error('Error loading real passengers:', err);
        setPassagers([]);
      } finally {
        setLoading(false);
      }
    };

    loadRealPassengers();
  }, []);

  // URL par défaut (vue générale de Dakar)
  const defaultMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d123689.70287413813!2d-17.5113945935741!3d14.736021669460292!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x168b2aba9d9b6d8b%3A0xc621b16c80210e7b!2sDakar%2C%20Senegal!5e0!3m2!1sen!2sfr!4v1716650454320!5m2!1sen!2sfr";
  
  // URL de l'itinéraire du chauffeur vers le client (Navigation Interne)
  const clientLocationUrl = activePassenger 
    ? `https://maps.google.com/maps?saddr=Avenue+Cheikh+Anta+Diop,+Dakar,+Senegal&daddr=${encodeURIComponent(activePassenger.quartier + ', Dakar, Senegal')}&output=embed`
    : "https://maps.google.com/maps?saddr=Avenue+Cheikh+Anta+Diop,+Dakar,+Senegal&daddr=Mermoz,+Dakar,+Senegal&output=embed";

  const handleStartNavigation = (p: any) => {
    setActivePassenger(p);
    setIsNavigating(true);
    setNavKey(k => k + 1);
  };

  const handleStartExternalNavigation = () => {
    if (!activePassenger) return;
    
    const destination = encodeURIComponent(activePassenger.quartier + ', Dakar, Senegal');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const url = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${destination}&travelmode=driving&dir_action=navigate`;
          window.open(url, '_blank');
        },
        (error) => {
          console.error("Erreur GPS:", error);
          // Fallback si l'utilisateur refuse la localisation ou si erreur
          const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving&dir_action=navigate`;
          window.open(url, '_blank');
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving&dir_action=navigate`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors"><Navigation className="w-5 h-5 text-orange-500 dark:text-orange-400" /> Récupération Client</h2>
        {isNavigating && activePassenger && (
          <span className="bg-orange-500/10 text-orange-400 px-3 py-1.5 rounded-xl text-xs font-bold border border-orange-500/20 animate-pulse">
            EN ROUTE VERS {activePassenger.nom.toUpperCase()}
          </span>
        )}
      </div>

      <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A]/80 rounded-2xl p-5 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mb-1 transition-colors">Destination</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white transition-colors">
              {activePassenger ? `Rejoindre ${activePassenger.nom}` : 'Point de rendez-vous'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-1 transition-colors">
              <MapPin className="w-4 h-4 text-orange-500 dark:text-orange-400" /> 
              {activePassenger ? activePassenger.quartier : 'En attente de sélection...'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-orange-500 dark:text-orange-400">{activePassenger ? activePassenger.eta : '--'}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">{activePassenger ? `${activePassenger.distance} km` : '--'}</p>
          </div>
        </div>
      </div>

      {/* Carte Interactive avec Fond Satellite */}
      <div 
        className="relative h-96 border border-[#333333]/60 rounded-3xl overflow-hidden shadow-xl"
        style={{ backgroundImage: "url('/dakar-map-bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Intégration Google Maps */}
        <iframe 
          key={navKey}
          src={isNavigating ? clientLocationUrl : defaultMapUrl}
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={false} 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className={`absolute inset-0 z-0 ${isNavigating ? 'opacity-100' : 'opacity-80'}`}
        ></iframe>

        {/* Overlays protecteurs pour empêcher les clics sur les logos/liens Google en haut et en bas */}
        <div className="absolute top-0 left-0 right-0 h-16 z-10" onPointerDownCapture={(e) => e.stopPropagation()} />
        <div className="absolute bottom-0 left-0 right-0 h-16 z-10" onPointerDownCapture={(e) => e.stopPropagation()} />

        {/* Overlay sombre pour garder le contraste des éléments UI */}
        <div className="absolute inset-0 bg-[#0a1520]/20 pointer-events-none z-10" />

        <div className="absolute top-4 right-4 flex justify-end gap-3 pointer-events-none z-20">
           <div className="bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur border border-slate-200 dark:border-[#333333] px-3 py-1.5 rounded-xl flex items-center gap-2 transition-colors pointer-events-auto shadow-lg">
             <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
             <span className="text-xs font-semibold text-slate-900 dark:text-white transition-colors">Trajet sécurisé</span>
           </div>
           <button className="bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur border border-slate-200 dark:border-[#333333] w-10 h-10 flex items-center justify-center rounded-xl pointer-events-auto hover:bg-slate-100 dark:hover:bg-[#222222] transition-colors shadow-lg">
             <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400" />
           </button>
        </div>

        <div className={`absolute bottom-4 left-4 right-4 flex gap-3 pointer-events-auto z-20`}>
          {!isNavigating || !activePassenger ? (
            <button 
              className="flex-1 bg-slate-800/80 text-white font-bold py-3.5 rounded-2xl transition-colors shadow-lg text-sm flex justify-center items-center gap-2 cursor-not-allowed backdrop-blur"
            >
              <Navigation className="w-4 h-4" /> Sélectionnez un passager
            </button>
          ) : (
            <button 
              onClick={handleStartExternalNavigation}
              className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-3.5 rounded-2xl transition-colors shadow-lg shadow-orange-500/30 text-sm flex justify-center items-center gap-2 animate-bounce"
            >
              <Navigation className="w-5 h-5 fill-current" /> Démarrer le trajet (GPS Audio)
            </button>
          )}
        </div>
      </div>

      {/* Liste des Passagers (Triés par proximité) */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Voyageurs à récupérer</h3>
        {passagers.length === 0 ? (
          <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A]/80 rounded-2xl p-8 text-center text-slate-500 font-semibold transition-colors">
            Ici vont apparaître vos passagers réservés
          </div>
        ) : (
          passagers.sort((a, b) => a.distance - b.distance).map(p => (
            <button 
              key={p.id} 
              onClick={() => handleStartNavigation(p)}
              className={`w-full text-left bg-white dark:bg-[#141414] border ${activePassenger?.id === p.id ? 'border-orange-500 shadow-orange-500/10' : 'border-slate-200 dark:border-[#2A2A2A]/80'} rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between transition-colors gap-4 hover:border-orange-500/50 hover:shadow-lg group`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${activePassenger?.id === p.id ? 'bg-orange-500 text-white' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20 group-hover:text-orange-600 dark:group-hover:text-orange-400'}`}>
                  {p.nom.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white transition-colors">{p.nom}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors mt-0.5">
                    <MapPin className="w-3 h-3 inline mr-1 text-orange-500" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300 mr-2">{p.quartier}</span>
                    À {p.distance} km ({p.eta})
                  </p>
                  <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                    <Phone className="w-3 h-3 inline mr-1" /> {p.tel}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 self-end sm:self-auto">
                <a href={`sms:${p.tel.replace(/\s+/g, '')}`} onClick={(e) => e.stopPropagation()} className="w-10 h-10 bg-slate-100 dark:bg-[#222222] hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-[#333333] rounded-xl flex items-center justify-center text-slate-700 dark:text-white transition-colors cursor-pointer"><MessageSquare className="w-4 h-4" /></a>
                <a href={`tel:${p.tel.replace(/\s+/g, '')}`} onClick={(e) => e.stopPropagation()} className="w-10 h-10 bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 transition-colors cursor-pointer"><Phone className="w-4 h-4" /></a>
              </div>
            </button>
          ))
        )}
      </div>

    </div>
  );
}

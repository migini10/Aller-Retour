'use client';

import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { 
  X, Search, MapPin, Calendar, Users, Bus, ArrowRight, CheckCircle2, 
  CreditCard, Wallet, Smartphone, ShieldCheck, Ticket, QrCode, Download, Share2, Star,
  ChevronLeft, Info, Map, Banknote, MessageCircle
} from 'lucide-react';
import { VILLES_SENEGAL, INITIAL_QUARTIERS } from '../data/quartiers';
import QRCodeBrandEngine from './QRCodeBrandEngine';

interface BookingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'bus' | 'allo-dakar';
}

export default function BookingWizardModal({ isOpen, onClose, initialType = 'bus' }: BookingWizardModalProps) {
  const [step, setStep] = useState(1);
  const [isClosing, setIsClosing] = useState(false);

  const [searchParams, setSearchParams] = useState({
    depart: '',
    arrivee: '',
    quartierArrivee: '',
    date: '',
    passagers: 1,
    type: initialType
  });

  const [generatedTicket, setGeneratedTicket] = useState<any>(null);
  
  const isAlloDakar = searchParams.type === 'allo-dakar';

  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [voyageurInfo, setVoyageurInfo] = useState({
    nom: 'Abdou Bakhe',
    telephone: '+221 77 123 45 67',
    email: 'abdou@example.com',
    bagages: 1
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`, {
            headers: { 'Accept-Language': 'fr' }
          });
          const data = await response.json();
          let address = data.display_name;
          
          if (address) {
            const parts = address.split(',').slice(0, 3);
            address = `${parts.join(', ')} (GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)})`;
          } else {
            address = `Point GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
          }
          
          setPickupLocation(address);
        } catch (error) {
          setPickupLocation(`Point GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        }
        setIsLocating(false);
      },
      (error) => {
        console.error("Erreur de géolocalisation:", error);
        alert("Impossible de récupérer votre position. Veuillez autoriser l'accès à la localisation.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const [showDepartSuggestions, setShowDepartSuggestions] = useState(false);
  const [showArriveeSuggestions, setShowArriveeSuggestions] = useState(false);
  const [showQuartierSuggestions, setShowQuartierSuggestions] = useState(false);

  
  const [quartiersSenegal, setQuartiersSenegal] = useState<Record<string, string[]>>(INITIAL_QUARTIERS);

  useEffect(() => {
    const saved = localStorage.getItem('custom_quartiers');
    if (saved) {
      try {
        setQuartiersSenegal(JSON.parse(saved));
      } catch (e) {
        console.error("Erreur lecture custom_quartiers", e);
      }
    }
  }, []);

  const saveCustomQuartier = (ville: string, quartier: string) => {
    if (!ville || !quartier) return;
    
    setQuartiersSenegal(prev => {
      const next = { ...prev };
      if (!next[ville]) next[ville] = [];
      const exists = next[ville].some(q => q.toLowerCase() === quartier.toLowerCase());
      if (!exists) {
        next[ville] = [...next[ville], quartier];
        localStorage.setItem('custom_quartiers', JSON.stringify(next));
      }
      return next;
    });
  };

  const filteredDepart = VILLES_SENEGAL.filter(v => searchParams.depart && v.toLowerCase().includes(searchParams.depart.toLowerCase()));
  const filteredArrivee = VILLES_SENEGAL.filter(v => searchParams.arrivee && v.toLowerCase().includes(searchParams.arrivee.toLowerCase()));
  const allQuartiers = Object.values(quartiersSenegal).flat();
  const selectedCityQuartiers = searchParams.arrivee ? (quartiersSenegal[searchParams.arrivee] || []) : allQuartiers;
  const filteredQuartiers = selectedCityQuartiers.filter(q => searchParams.quartierArrivee && q.toLowerCase().includes(searchParams.quartierArrivee.toLowerCase()));
  const displayQuartiers = searchParams.quartierArrivee 
    ? filteredQuartiers.slice(0, 15) 
    : (searchParams.arrivee ? selectedCityQuartiers : []);

  const departCityQuartiers = searchParams.depart ? (quartiersSenegal[searchParams.depart] || []) : allQuartiers;
  const filteredPickupQuartiers = departCityQuartiers.filter(q => pickupLocation && q.toLowerCase().includes(pickupLocation.toLowerCase()));
  // If pickupLocation is empty and depart is not set, show nothing. Otherwise, show filtered or all depart quartiers.
  const displayPickupQuartiers = pickupLocation 
    ? filteredPickupQuartiers.slice(0, 15) // Limit to 15 to avoid massive dropdowns
    : (searchParams.depart ? departCityQuartiers : []);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);

  const ticketRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (ticketRef.current) {
      try {
        const canvas = await html2canvas(ticketRef.current, { scale: 2 });
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = `Billet-AllerRetour-${searchParams.depart || 'Dakar'}-${searchParams.arrivee || 'Touba'}.png`;
        link.click();
      } catch (err) {
        console.error("Erreur lors de la génération du billet", err);
      }
    }
  };

  const handleShare = async () => {
    const shareData = isAlloDakar ? {
      title: 'Ma Demande AllerRetour',
      text: `J'ai fait une demande de covoiturage avec AllerRetour ! Départ de ${searchParams.depart || 'Dakar'} vers ${searchParams.arrivee || 'Touba'}.\n👉 https://aller-retour.sn`,
    } : {
      title: 'Mon Billet AllerRetour',
      text: `J'ai réservé mon billet avec AllerRetour ! Départ de ${searchParams.depart || 'Dakar'} vers ${searchParams.arrivee || 'Touba'} à ${selectedTrip?.departTime || '08:00'}. Siège: ${selectedSeat}.\n👉 https://aller-retour.sn`,
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);
        alert('Détails copiés dans le presse-papier !');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleWhatsApp = () => {
    const text = isAlloDakar 
      ? `🎫 *Ma Demande AllerRetour*\n\n🚕 Départ: ${searchParams.depart || 'Dakar'}\n📍 Arrivée: ${searchParams.arrivee || 'Touba'}\n👥 Passagers: ${searchParams.passagers}\n👉 https://aller-retour.sn`
      : `🎫 *Mon Billet AllerRetour*\n\n🚍 Trajet: ${searchParams.depart || 'Dakar'} → ${searchParams.arrivee || 'Touba'}\n📅 Heure: ${selectedTrip?.departTime || '08:00'}\n💺 Siège: ${selectedSeat}\n👉 https://aller-retour.sn`;
      
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep(1);
      setIsClosing(false);
      setSearchParams(s => ({ ...s, type: initialType }));
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, initialType]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const totalSteps = isAlloDakar ? 5 : 6;

  const nextStep = () => {
    if (step === 1) {
      if (searchParams.arrivee && searchParams.quartierArrivee) {
        saveCustomQuartier(searchParams.arrivee, searchParams.quartierArrivee.trim());
      }
      if (searchParams.depart && pickupLocation && !pickupLocation.includes('GPS:')) {
        saveCustomQuartier(searchParams.depart, pickupLocation.trim());
      }
    }
    
    if (step === totalSteps - 1) {
      const newTicket = {
        id: `AR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        trajet: `${searchParams.depart || 'Dakar'} → ${searchParams.arrivee || 'Touba'}`,
        date: searchParams.date || new Date().toISOString().split('T')[0],
        heure: selectedTrip?.departTime || '08:00',
        siege: isAlloDakar ? `${searchParams.passagers} Place(s)` : selectedSeat || '14A',
        compagnie: selectedTrip?.company || (isAlloDakar ? 'Allo Dakar' : 'Sénégal Express'),
        vehicule: isAlloDakar ? 'Voiture Privée' : 'Bus',
        statut: 'actif'
      };
      setGeneratedTicket(newTicket);
      try {
        const existing = JSON.parse(localStorage.getItem('my_tickets') || '[]');
        localStorage.setItem('my_tickets', JSON.stringify([newTicket, ...existing]));
      } catch (e) {
        console.error('Could not save ticket', e);
      }
    }
    
    setStep(s => Math.min(s + 1, totalSteps));
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  if (!isOpen && !isClosing) return null;

  const renderStep1Search = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-slate-900/50 p-4 sm:p-6 rounded-2xl border border-slate-800">
        <h3 className="text-lg font-bold text-white mb-4">Où allez-vous ?</h3>
        <div className="space-y-3">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Ville de départ"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              value={searchParams.depart}
              onFocus={() => setShowDepartSuggestions(true)}
              onBlur={() => setTimeout(() => setShowDepartSuggestions(false), 200)}
              onChange={(e) => {
                setSearchParams({...searchParams, depart: e.target.value});
                setShowDepartSuggestions(true);
              }}
            />
            {showDepartSuggestions && searchParams.depart.length > 0 && filteredDepart.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                {filteredDepart.map(ville => (
                  <div 
                    key={ville} 
                    className="px-4 py-2 hover:bg-slate-700 cursor-pointer text-slate-300 text-sm"
                    onClick={() => {
                      setSearchParams({...searchParams, depart: ville});
                      setShowDepartSuggestions(false);
                    }}
                  >
                    {ville}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {isAlloDakar && (
            <div className="relative border border-orange-500/30 rounded-xl p-3 bg-orange-500/5 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-orange-400 font-bold">Adresse de prise en charge (Tapez ou localisez)</label>
                <button 
                  onClick={handleGeolocate} 
                  disabled={isLocating}
                  className="text-white hover:text-white font-bold flex items-center gap-1 bg-orange-600 px-3 py-1 rounded-lg disabled:opacity-50 text-xs transition-colors shrink-0 ml-2"
                >
                  <MapPin className="w-3 h-3" />
                  {isLocating ? 'Patientez...' : 'Me localiser'}
                </button>
              </div>
              <input 
                type="text" 
                placeholder="Tapez l'adresse exacte du passager ou géolocalisez-vous"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-orange-500 text-sm"
                value={pickupLocation}
                onFocus={() => setShowPickupSuggestions(true)}
                onBlur={() => setTimeout(() => setShowPickupSuggestions(false), 200)}
                onChange={(e) => {
                  setPickupLocation(e.target.value);
                  setShowPickupSuggestions(true);
                }}
              />
              {showPickupSuggestions && displayPickupQuartiers.length > 0 && (
                <div className="absolute z-50 w-full left-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                  {displayPickupQuartiers.map(quartier => (
                    <div 
                      key={quartier} 
                      className="px-4 py-2 hover:bg-slate-700 cursor-pointer text-slate-300 text-sm"
                      onClick={() => {
                        setPickupLocation(quartier);
                        setShowPickupSuggestions(false);
                      }}
                    >
                      {quartier}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
            <input 
              type="text" 
              placeholder="Ville d'arrivée"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              value={searchParams.arrivee}
              onFocus={() => setShowArriveeSuggestions(true)}
              onBlur={() => setTimeout(() => setShowArriveeSuggestions(false), 200)}
              onChange={(e) => {
                setSearchParams({...searchParams, arrivee: e.target.value});
                setShowArriveeSuggestions(true);
              }}
            />
            {showArriveeSuggestions && searchParams.arrivee.length > 0 && filteredArrivee.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                {filteredArrivee.map(ville => (
                  <div 
                    key={ville} 
                    className="px-4 py-2 hover:bg-slate-700 cursor-pointer text-slate-300 text-sm"
                    onClick={() => {
                      setSearchParams({...searchParams, arrivee: ville});
                      setShowArriveeSuggestions(false);
                    }}
                  >
                    {ville}
                  </div>
                ))}
              </div>
            )}
          </div>

          {searchParams.arrivee && (
            <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="text" 
                placeholder={isAlloDakar ? "Quartier ou point de chute exact" : "Quartier (Optionnel)"}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-300 focus:outline-none focus:border-orange-500 text-sm"
                value={searchParams.quartierArrivee}
                onFocus={() => setShowQuartierSuggestions(true)}
                onBlur={() => setTimeout(() => setShowQuartierSuggestions(false), 200)}
                onChange={(e) => {
                  setSearchParams({...searchParams, quartierArrivee: e.target.value});
                  setShowQuartierSuggestions(true);
                }}
              />
              {showQuartierSuggestions && displayQuartiers.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                  {displayQuartiers.map(quartier => (
                    <div 
                      key={quartier} 
                      className="px-4 py-2 hover:bg-slate-700 cursor-pointer text-slate-300 text-sm"
                      onClick={() => {
                        setSearchParams({...searchParams, quartierArrivee: quartier});
                        setShowQuartierSuggestions(false);
                      }}
                    >
                      {quartier}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="date" 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500 text-sm [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                value={searchParams.date}
                onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
              />
            </div>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500 appearance-none text-sm"
                value={searchParams.passagers}
                onChange={(e) => setSearchParams({...searchParams, passagers: parseInt(e.target.value)})}
              >
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Passager{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
      <button 
        disabled={!searchParams.depart || !searchParams.arrivee || (isAlloDakar && (!searchParams.quartierArrivee || !pickupLocation))}
        onClick={nextStep}
        className="w-full bg-orange-600 disabled:bg-slate-800 disabled:text-slate-500 hover:bg-orange-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-orange-600/20"
      >
        <Search className="w-5 h-5" />
        {(searchParams.depart && searchParams.arrivee && (!isAlloDakar || (pickupLocation && searchParams.quartierArrivee))) ? 'Rechercher un trajet' : 'Informations incomplètes'}
      </button>
    </div>
  );

  const renderStep2Results = () => {
    if (isAlloDakar) {
      const mockServices = [
        { id: 1, company: "Allo Dakar Confort", price: 6000, type: "Voiture 5 places", options: "Climatisé", route: "Autoroute" },
        { id: 2, company: "Allo Dakar Confort", price: 5500, type: "Voiture 7 places", options: "Climatisé", route: "Autoroute" },
        { id: 3, company: "Allo Dakar Économie", price: 4500, type: "Voiture 5 places", options: "Non Climatisé", route: "Nationale" },
        { id: 4, company: "Allo Dakar Économie", price: 3500, type: "Voiture 7 places", options: "Non Climatisé", route: "Nationale" },
      ];

      return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <h3 className="text-sm font-semibold text-slate-400 px-1">Choix du type de covoiturage</h3>
          <div className="space-y-3">
            {mockServices.map(service => (
              <div 
                key={service.id} 
                onClick={() => { setSelectedTrip(service); nextStep(); }}
                className="bg-slate-900 border border-slate-800 hover:border-orange-500/50 p-4 rounded-2xl cursor-pointer transition-all hover:bg-slate-800/50"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-white">{service.company}</span>
                    <span className="bg-slate-800 text-xs text-slate-300 px-2 py-0.5 rounded-full">{service.type}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${service.options === 'Climatisé' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-slate-800/50 text-slate-400'}`}>
                      {service.options}
                    </span>
                    {service.route === 'Autoroute' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Via Autoroute
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xl font-bold text-orange-500">{service.price} <span className="text-sm text-slate-400 font-normal">FCFA / pers</span></p>
                  <div className="text-orange-500 flex items-center gap-1 text-sm font-bold bg-orange-500/10 px-3 py-1.5 rounded-xl">
                    Choisir <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      const mockTrips = [
        { id: 1, company: "Salam Transport", departTime: "08:00", arriveTime: "12:30", price: 4500, type: "Bus Classique", seats: 12 },
        { id: 2, company: "Ndiambour VIP", departTime: "09:30", arriveTime: "14:00", price: 6000, type: "Bus VIP", seats: 4 },
      ];

      return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <h3 className="text-sm font-semibold text-slate-400 px-1">Trajets disponibles pour Dakar → Touba</h3>
          <div className="space-y-3">
            {mockTrips.map(trip => (
              <div 
                key={trip.id} 
                onClick={() => { setSelectedTrip(trip); nextStep(); }}
                className="bg-slate-900 border border-slate-800 hover:border-orange-500/50 p-4 rounded-2xl cursor-pointer transition-all hover:bg-slate-800/50"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{trip.company}</span>
                      <span className="bg-slate-800 text-xs text-slate-300 px-2 py-0.5 rounded-full">{trip.type}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="text-center">
                        <p className="text-lg font-bold text-white leading-none">{trip.departTime}</p>
                        <p className="text-[10px] text-slate-500 uppercase mt-1">Départ</p>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <p className="text-[10px] text-slate-400 mb-1">4h 30m</p>
                        <div className="w-full h-[1px] bg-slate-700 relative">
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-white leading-none">{trip.arriveTime}</p>
                        <p className="text-[10px] text-slate-500 uppercase mt-1">Arrivée</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-orange-500">{trip.price} <span className="text-sm">FCFA</span></p>
                    <p className={`text-xs mt-1 ${trip.seats < 5 ? 'text-rose-400 font-bold' : 'text-emerald-400'}`}>
                      {trip.seats} places restantes
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  const renderStep3Seats = () => {
    // Generate a simple bus layout
    const seats = Array.from({ length: 12 }, (_, i) => ({
      id: `${i + 1}`,
      label: `${i + 1}`,
      isOccupied: [2, 5, 8].includes(i + 1)
    }));

    return (
      <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-4 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-bold">Choix du siège</h3>
            <div className="flex gap-3 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-slate-800 border border-slate-700"></div> Libre</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-orange-600"></div> Sélection</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-rose-500/20 border border-rose-500/50"></div> Occupé</div>
            </div>
          </div>
          
          <div className="max-w-[200px] mx-auto bg-slate-950 border-4 border-slate-800 rounded-[40px] p-4 py-8 relative">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-2 bg-slate-800 rounded-full"></div>
            
            <div className="grid grid-cols-3 gap-2 mt-8">
              {seats.map((seat, i) => (
                <button
                  key={seat.id}
                  disabled={seat.isOccupied}
                  onClick={() => setSelectedSeat(seat.id)}
                  className={`aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all
                    ${seat.isOccupied ? 'bg-rose-500/10 border border-rose-500/20 text-rose-500/50 cursor-not-allowed' : 
                      selectedSeat === seat.id ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/40 scale-110 z-10' : 
                      'bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'}
                    ${(i + 1) % 3 === 2 ? 'mb-4' : ''}`} // Aisle simulation
                >
                  {seat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button 
          disabled={!selectedSeat}
          onClick={nextStep}
          className="w-full bg-orange-600 disabled:bg-slate-800 disabled:text-slate-500 hover:bg-orange-500 text-white font-bold py-4 rounded-xl transition-colors"
        >
          {selectedSeat ? `Confirmer le siège ${selectedSeat}` : 'Veuillez choisir un siège'}
        </button>
      </div>
    );
  };

  const renderStep4Info = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-emerald-400 text-sm mb-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p>Profil connecté détecté. Informations pré-remplies.</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 font-medium mb-1 block">Nom Complet</label>
            <input 
              type="text" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-orange-500 outline-none"
              value={voyageurInfo.nom}
              onChange={(e) => setVoyageurInfo({...voyageurInfo, nom: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-medium mb-1 block">Téléphone (requis pour billet SMS)</label>
            <input 
              type="tel" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-orange-500 outline-none"
              value={voyageurInfo.telephone}
              onChange={(e) => setVoyageurInfo({...voyageurInfo, telephone: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-medium mb-1 block">Email (optionnel)</label>
            <input 
              type="email" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-orange-500 outline-none"
              value={voyageurInfo.email}
              onChange={(e) => setVoyageurInfo({...voyageurInfo, email: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-medium mb-1 block">Nombre de bagages</label>
            <select 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-orange-500 outline-none appearance-none"
              value={voyageurInfo.bagages}
              onChange={(e) => setVoyageurInfo({...voyageurInfo, bagages: parseInt(e.target.value)})}
            >
              <option value={0}>Aucun bagage soute</option>
              <option value={1}>1 bagage (inclus)</option>
              <option value={2}>2 bagages (+1000 FCFA)</option>
              <option value={3}>3 bagages (+2000 FCFA)</option>
            </select>
          </div>
        </div>
      </div>
      <button 
        onClick={nextStep}
        className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl transition-colors"
      >
        Procéder au paiement
      </button>
    </div>
  );

  const renderStep5Payment = () => {
    const basePrice = selectedTrip?.price || 5000;
    const luggageFee = voyageurInfo.bagages > 1 ? (voyageurInfo.bagages - 1) * 1000 : 0;
    const taxes = 250;
    const total = (basePrice * searchParams.passagers) + luggageFee + taxes;

    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6">
          <h3 className="text-white font-bold mb-4">Résumé de la commande</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>Billet {selectedTrip?.company}</span>
              <span>{basePrice * searchParams.passagers} FCFA</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Frais de bagages ({voyageurInfo.bagages})</span>
              <span>{luggageFee} FCFA</span>
            </div>
            <div className="flex justify-between text-slate-400 text-xs">
              <span>Taxes et frais de service</span>
              <span>{taxes} FCFA</span>
            </div>
            <div className="border-t border-slate-800 pt-3 mt-3 flex justify-between items-center">
              <span className="font-bold text-white">Total à payer</span>
              <span className="text-xl font-bold text-orange-500">{total} FCFA</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-400 px-1 mb-3">Moyen de paiement</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'wave', name: 'Wave', color: 'bg-blue-600 text-white border-blue-500', icon: Smartphone },
              { id: 'om', name: 'Orange Money', color: 'bg-orange-500 text-white border-orange-400', icon: Smartphone },
              { id: 'wallet', name: 'AllerRetour Wallet', color: 'bg-slate-800 text-white border-slate-700', icon: Wallet },
              { id: 'card', name: 'Carte Bancaire', color: 'bg-slate-800 text-white border-slate-700', icon: CreditCard },
              ...(isAlloDakar ? [{ id: 'cash', name: 'Espèces à l\'arrivée', color: 'bg-emerald-600 text-white border-emerald-500', icon: Banknote }] : [])
            ].map(method => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all
                  ${paymentMethod === method.id ? method.color + ' ring-2 ring-white/20' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
              >
                <method.icon className="w-6 h-6" />
                <span className="text-xs font-bold">{method.name}</span>
              </button>
            ))}
          </div>
        </div>

        <button 
          disabled={!paymentMethod}
          onClick={nextStep}
          className="w-full bg-orange-600 disabled:bg-slate-800 disabled:text-slate-500 hover:bg-orange-500 text-white font-bold py-4 rounded-xl transition-colors mt-4 flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-5 h-5" />
          Payer {total} FCFA
        </button>
      </div>
    );
  };

  const renderStep6SuccessAlloDakar = () => (
    <div className="flex flex-col items-center justify-center py-8 animate-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 relative">
        <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-2 text-center">Demande Envoyée !</h2>
      <p className="text-slate-400 text-center mb-8 text-sm">Votre demande de covoiturage a été diffusée aux chauffeurs à proximité. Vous recevrez une notification dès qu'un chauffeur l'acceptera.</p>

      {/* Request Recap UI */}
      <div ref={ticketRef} className="w-full max-w-sm bg-white rounded-2xl overflow-hidden relative shadow-2xl">
        <div className="bg-[#0B0F19] p-4 text-center border-b-[3px] border-orange-500">
          <h3 className="text-xl font-bold text-white tracking-tight flex justify-center items-center gap-2">
            <Bus className="w-5 h-5 text-orange-500" />
            Aller<span className="text-orange-500">Retour</span>
          </h3>
          <p className="text-slate-400 text-xs mt-1">Demande en attente : {selectedTrip?.company}</p>
        </div>
        
        <div className="p-6 relative">
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Départ</p>
              <p className="text-xl font-black text-slate-900">{searchParams.depart || 'Dakar'}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-orange-500 mb-1" />
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Arrivée</p>
              <p className="text-xl font-black text-slate-900">{searchParams.arrivee || 'Touba'}</p>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-slate-200 py-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Passager</p>
              <p className="font-bold text-slate-900 truncate">{voyageurInfo.nom}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Places</p>
              <p className="font-bold text-orange-600 text-lg">{searchParams.passagers}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Date</p>
              <p className="font-bold text-slate-900">{searchParams.date || 'Aujourd\'hui'}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Prix Total</p>
              <p className="font-bold text-slate-900">{(selectedTrip?.price || 0) * searchParams.passagers} FCFA</p>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-slate-200 pt-4 flex justify-center">
            <div className="text-center">
              <div className="flex justify-center mb-4 mt-2">
                <QRCodeBrandEngine 
                  value={generatedTicket?.id || `ALLORETOUR-DEMANDE-${searchParams.depart}-${searchParams.arrivee}`} 
                  size={120} 
                />
              </div>
              <p className="text-[10px] text-slate-500 animate-pulse font-bold text-orange-500">Recherche de chauffeurs en cours...</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full mt-6">
        <button onClick={handleDownload} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-1 transition-colors text-xs">
          <Download className="w-4 h-4" /> Billet
        </button>
        <button onClick={handleShare} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-1 transition-colors text-xs">
          <Share2 className="w-4 h-4" /> Partager
        </button>
        <button onClick={handleWhatsApp} className="bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-1 transition-colors text-xs">
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </button>
      </div>
      
      <button 
        onClick={handleClose}
        className="w-full bg-slate-900 border border-slate-800 text-slate-300 font-bold py-4 rounded-xl mt-3 transition-colors hover:bg-slate-800"
      >
        Retour à l'accueil
      </button>
    </div>
  );

  const renderStep6SuccessBus = () => (
    <div className="flex flex-col items-center justify-center py-8 animate-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 relative">
        <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-2 text-center">Paiement Réussi !</h2>
      <p className="text-slate-400 text-center mb-8 text-sm">Votre billet a été généré et envoyé par WhatsApp et Email.</p>

      {/* Ticket UI */}
      <div ref={ticketRef} className="w-full max-w-sm bg-white rounded-2xl overflow-hidden relative shadow-2xl">
        <div className="bg-[#0B0F19] p-4 text-center border-b-[3px] border-orange-500">
          <h3 className="text-xl font-bold text-white tracking-tight flex justify-center items-center gap-2">
            <Bus className="w-5 h-5 text-orange-500" />
            Aller<span className="text-orange-500">Retour</span>
          </h3>
          <p className="text-slate-400 text-xs mt-1">{selectedTrip?.company}</p>
        </div>
        
        <div className="p-6 relative">
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#050A15] rounded-full"></div>
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#050A15] rounded-full"></div>
          
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Départ</p>
              <p className="text-xl font-black text-slate-900">{searchParams.depart || 'Dakar'}</p>
              <p className="text-sm font-bold text-slate-600">{selectedTrip?.departTime}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-orange-500 mb-1" />
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Arrivée</p>
              <p className="text-xl font-black text-slate-900">{searchParams.arrivee || 'Touba'}</p>
              <p className="text-sm font-bold text-slate-600">{selectedTrip?.arriveTime}</p>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-slate-200 py-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Passager</p>
              <p className="font-bold text-slate-900 truncate">{voyageurInfo.nom}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Siège</p>
              <p className="font-bold text-orange-600 text-lg">{selectedSeat}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Date</p>
              <p className="font-bold text-slate-900">{searchParams.date || 'Aujourd\'hui'}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Référence</p>
              <p className="font-bold text-slate-900">{generatedTicket?.id || 'AR-XXXXXX'}</p>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-slate-200 pt-4 flex justify-center">
            <div className="text-center">
              <div className="flex justify-center mb-4 mt-2">
                <QRCodeBrandEngine 
                  value={generatedTicket?.id || 'ALLORETOUR-TICKET'} 
                  size={120} 
                />
              </div>
              <p className="text-[10px] text-slate-500">Scanner au moment de l'embarquement</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full mt-6">
        <button onClick={handleDownload} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-1 transition-colors text-xs">
          <Download className="w-4 h-4" /> Billet
        </button>
        <button onClick={handleShare} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-1 transition-colors text-xs">
          <Share2 className="w-4 h-4" /> Partager
        </button>
        <button onClick={handleWhatsApp} className="bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-1 transition-colors text-xs">
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </button>
      </div>
      
      <button 
        onClick={handleClose}
        className="w-full bg-slate-900 border border-slate-800 text-slate-300 font-bold py-4 rounded-xl mt-3 transition-colors hover:bg-slate-800"
      >
        Retour à l'accueil
      </button>
    </div>
  );

  const steps = isAlloDakar 
    ? [
        { id: 1, title: 'Recherche' },
        { id: 2, title: 'Offres' },
        { id: 3, title: 'Infos' },
        { id: 4, title: 'Paiement' },
        { id: 5, title: 'Confirmation' },
      ]
    : [
        { id: 1, title: 'Recherche' },
        { id: 2, title: 'Trajets' },
        { id: 3, title: 'Siège' },
        { id: 4, title: 'Infos' },
        { id: 5, title: 'Paiement' },
        { id: 6, title: 'Confirmation' },
      ];

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center ${isClosing ? 'animate-out fade-out duration-300' : 'animate-in fade-in duration-300'}`}>
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={step < totalSteps ? handleClose : undefined}></div>
      
      <div className={`relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-md bg-[#050A15] sm:rounded-[2rem] sm:border border-slate-800/80 flex flex-col shadow-2xl overflow-hidden
        ${isClosing ? 'animate-out slide-out-to-bottom-8 sm:slide-out-to-bottom-0 sm:zoom-out-95 duration-300' : 'animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300'}`}
      >
        {/* Header */}
        <div className="flex-none bg-[#0B0F19] border-b border-slate-800/80 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {step > 1 && step < totalSteps && (
              <button onClick={prevStep} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-white font-bold leading-none">{step === totalSteps ? (isAlloDakar ? 'Demande Envoyée' : 'Billet Confirmé') : 'Nouvelle Demande'}</h2>
              {step < totalSteps && (
                <p className="text-xs text-slate-400 mt-1">Étape {step} sur {totalSteps - 1} : {steps[step-1].title}</p>
              )}
            </div>
          </div>
          {step < totalSteps && (
            <button onClick={handleClose} className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-full border border-slate-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress bar */}
        {step < totalSteps && (
          <div className="h-1 bg-slate-900 w-full flex-none">
            <div 
              className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-500 ease-out"
              style={{ width: `${(step / (totalSteps - 1)) * 100}%` }}
            ></div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-hide">
          {step === 1 && renderStep1Search()}
          {step === 2 && renderStep2Results()}
          
          {step === 3 && !isAlloDakar && renderStep3Seats()}
          {step === 3 && isAlloDakar && renderStep4Info()}

          {step === 4 && !isAlloDakar && renderStep4Info()}
          {step === 4 && isAlloDakar && renderStep5Payment()}

          {step === 5 && !isAlloDakar && renderStep5Payment()}
          {step === 5 && isAlloDakar && renderStep6SuccessAlloDakar()}

          {step === 6 && !isAlloDakar && renderStep6SuccessBus()}
        </div>
      </div>
    </div>
  );
}

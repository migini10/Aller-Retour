'use client';

import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { 
  X, Search, MapPin, Calendar, Users, User, CarFront, ArrowRight, CheckCircle2, 
  CreditCard, Wallet, Smartphone, ShieldCheck, Ticket, QrCode, Download, Share2, Star,
  ChevronLeft, Info, Map, Banknote, MessageCircle, Clock, ChevronDown, Loader2
} from 'lucide-react';
import { VILLES_SENEGAL, INITIAL_QUARTIERS } from '../data/quartiers';
import QRCodeBrandEngine from './QRCodeBrandEngine';
import { OrangeMoneyLogo } from './OrangeMoneyLogo';
import { useAuth } from './AuthContext';
import { useUser } from '../hooks/useUser';

interface BookingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'bus' | 'allo-dakar';
  initialData?: { origin?: string; destination?: string, pickupLocation?: string };
}

export default function BookingWizardModal({ isOpen, onClose, initialType = 'allo-dakar', initialData }: BookingWizardModalProps) {
  const [step, setStep] = useState(1);
  const [isClosing, setIsClosing] = useState(false);
  const { isAuthenticated, openAuthModal, user } = useAuth();
  const [globalError, setGlobalError] = useState('');
  const [globalSuccess, setGlobalSuccess] = useState('');

  const [searchParams, setSearchParams] = useState({
    depart: initialData?.origin || '',
    arrivee: initialData?.destination || '',
    quartierArrivee: '',
    date: '',
    heure: '',
    passagers: 1,
    type: 'allo-dakar'
  });

  const [generatedTicket, setGeneratedTicket] = useState<any>(null);
  
  const isAlloDakar = true;

  const { userName, userPhone } = useUser();
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [voyageurInfo, setVoyageurInfo] = useState({
    nom: userName,
    telephone: userPhone,
    email: 'abdou@example.com',
    bagages: 1
  });
  const [ticketPour, setTicketPour] = useState<'moi' | 'autre' | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('wave');
  const [pickupLocation, setPickupLocation] = useState(initialData?.pickupLocation || '');
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [realTrips, setRealTrips] = useState<any[]>([]);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [windowWidth, setWindowWidth] = useState(1024);
  const [isQueued, setIsQueued] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [queueMessage, setQueueMessage] = useState('');
  const [alternativeTrips, setAlternativeTrips] = useState<any[]>([]);
  const [isAlloPrive, setIsAlloPrive] = useState(false);
  const [isAlloPriveSuccess, setIsAlloPriveSuccess] = useState(false);
  const [alloPriveRequestId, setAlloPriveRequestId] = useState('');

  // Réinitialiser les champs à chaque ouverture de la modale
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setGlobalError('');
      setGlobalSuccess('');
      setSearchParams({
        depart: initialData?.origin || '',
        arrivee: initialData?.destination || '',
        quartierArrivee: '',
        date: '',
        heure: '',
        passagers: 1,
        type: initialType
      });
      setGeneratedTicket(null);
      setSelectedTrip(null);
      setSelectedSeat(null);
      setVoyageurInfo({
        nom: userName || '',
        telephone: userPhone || '',
        email: 'abdou@example.com',
        bagages: 1
      });
      setTicketPour(null);
      setPaymentMethod('wave');
      setPickupLocation(initialData?.pickupLocation || '');
      setRealTrips([]);
      setPaymentData(null);
      setIsQueued(false);
      setQueueMessage('');
      setAlternativeTrips([]);
    }
  }, [isOpen, initialType, userName, userPhone, initialData]);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Polling automatique du statut de paiement
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (paymentData && paymentData.bookingId) {
      interval = setInterval(async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
          const token = localStorage.getItem('token');
          const res = await fetch(`${apiUrl}/bookings/${paymentData.bookingId}/status`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
          const data = await res.json();
          if (data.status === 'CONFIRMED') {
            clearInterval(interval);
            setPaymentData(null);
            setGeneratedTicket(data.qrCodeToken);
            setStep(6);
          }
        } catch (e) {
          // ignorer les erreurs de réseau pendant le polling
        }
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [paymentData]);

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
    const isToday = searchParams.date === todayStr;
    
    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();
    const currentTotalMinutes = currentHour * 60 + currentMinute;
    const MARGIN_MINUTES = 0; // Le passager peut chercher l'heure actuelle pour voir les départs imminents

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

  const handleGeolocate = () => {
    setGlobalError('');
    if (!navigator.geolocation) {
      setGlobalError("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';
          const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}`);
          const data = await response.json();
          
          if (data.status === 'OK' && data.results.length > 0) {
            let address = data.results[0].formatted_address;
            setPickupLocation(address);
            
            // Extract city from address_components
            const components = data.results[0].address_components;
            let city = '';
            for (const component of components) {
              if (component.types.includes('locality') || component.types.includes('administrative_area_level_2')) {
                city = component.long_name;
                break;
              }
            }
            if (city) {
              setSearchParams(prev => ({ ...prev, depart: city }));
            }
          } else {
            setPickupLocation(`Point GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
          }
        } catch (error) {
          setPickupLocation(`Point GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        }
        setIsLocating(false);
      },
      (error) => {
        console.error("Erreur de géolocalisation:", error);
        setGlobalError("Impossible de récupérer votre position. Veuillez autoriser l'accès à la localisation.");
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

  const getCityKey = (address: string) => {
    if (!address) return '';
    const clean = address.toLowerCase();
    const found = Object.keys(quartiersSenegal).find(city => clean.includes(city.toLowerCase()));
    return found || '';
  };

  const arriveeCityKey = getCityKey(searchParams.arrivee);
  const selectedCityQuartiers = arriveeCityKey ? (quartiersSenegal[arriveeCityKey] || []) : [];
  const filteredQuartiers = selectedCityQuartiers.filter(q => searchParams.quartierArrivee && q.toLowerCase().includes(searchParams.quartierArrivee.toLowerCase()));
  const displayQuartiers = searchParams.quartierArrivee 
    ? filteredQuartiers.slice(0, 15) 
    : (arriveeCityKey ? selectedCityQuartiers : []);

  const departCityKey = getCityKey(searchParams.depart);
  const departCityQuartiers = departCityKey ? (quartiersSenegal[departCityKey] || []) : [];
  const filteredPickupQuartiers = departCityQuartiers.filter(q => pickupLocation && q.toLowerCase().includes(pickupLocation.toLowerCase()));
  const displayPickupQuartiers = pickupLocation 
    ? filteredPickupQuartiers.slice(0, 15)
    : (departCityKey ? departCityQuartiers : []);

  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);

  const departInputRef = useRef<HTMLInputElement>(null);
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const arriveeInputRef = useRef<HTMLInputElement>(null);
  const quartierArriveeInputRef = useRef<HTMLInputElement>(null);

  const pickupAutocompleteRef = useRef<any>(null);
  const quartierArriveeAutocompleteRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen || step !== 1) return;

    const initAutocomplete = () => {
      if (!(window as any).google || !(window as any).google.maps || !(window as any).google.maps.places) return;
      const options = { 
        componentRestrictions: { country: 'sn' }, 
        types: ['(cities)'],
        fields: ['formatted_address'] 
      };

      const neighborhoodOptions = {
        componentRestrictions: { country: 'sn' },
        fields: ['formatted_address']
      };

      if (departInputRef.current) {
        const autocomplete = new (window as any).google.maps.places.Autocomplete(departInputRef.current, options);
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) setSearchParams(s => ({ ...s, depart: place.formatted_address || '' }));
        });
      }
      if (arriveeInputRef.current) {
        const autocomplete = new (window as any).google.maps.places.Autocomplete(arriveeInputRef.current, options);
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) setSearchParams(s => ({ ...s, arrivee: place.formatted_address || '' }));
        });
      }
      if (pickupInputRef.current) {
        pickupAutocompleteRef.current = new (window as any).google.maps.places.Autocomplete(pickupInputRef.current, neighborhoodOptions);
        pickupAutocompleteRef.current.addListener('place_changed', () => {
          const place = pickupAutocompleteRef.current.getPlace();
          if (place.formatted_address) setPickupLocation(place.formatted_address);
        });
      }
      if (quartierArriveeInputRef.current) {
        quartierArriveeAutocompleteRef.current = new (window as any).google.maps.places.Autocomplete(quartierArriveeInputRef.current, neighborhoodOptions);
        quartierArriveeAutocompleteRef.current.addListener('place_changed', () => {
          const place = quartierArriveeAutocompleteRef.current.getPlace();
          if (place.formatted_address) setSearchParams(s => ({ ...s, quartierArrivee: place.formatted_address || '' }));
        });
      }
    };

    if (!(window as any).google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initAutocomplete;
      document.head.appendChild(script);
    } else {
      setTimeout(initAutocomplete, 500);
    }
  }, [isOpen, step]);

  // Restreindre l'adresse de prise en charge (pickupLocation) à la ville de départ sélectionnée
  useEffect(() => {
    if (!searchParams.depart || !pickupAutocompleteRef.current || !(window as any).google) return;
    const geocoder = new (window as any).google.maps.Geocoder();
    geocoder.geocode({ address: searchParams.depart }, (results: any, status: any) => {
      if (status === 'OK' && results && results[0] && results[0].geometry.viewport) {
        pickupAutocompleteRef.current.setBounds(results[0].geometry.viewport);
        pickupAutocompleteRef.current.setOptions({ strictBounds: true });
      }
    });
  }, [searchParams.depart]);

  // Restreindre le quartier d'arrivée à la ville d'arrivée sélectionnée
  useEffect(() => {
    if (!searchParams.arrivee || !quartierArriveeAutocompleteRef.current || !(window as any).google) return;
    const geocoder = new (window as any).google.maps.Geocoder();
    geocoder.geocode({ address: searchParams.arrivee }, (results: any, status: any) => {
      if (status === 'OK' && results && results[0] && results[0].geometry.viewport) {
        quartierArriveeAutocompleteRef.current.setBounds(results[0].geometry.viewport);
        quartierArriveeAutocompleteRef.current.setOptions({ strictBounds: true });
      }
    });
  }, [searchParams.arrivee]);

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
    const shareData = {
      title: 'Ma Demande Allo Dakar',
      text: `J'ai fait une demande de covoiturage Allo Dakar ! Départ de ${searchParams.depart || 'Dakar'} vers ${searchParams.arrivee || 'Touba'}.\n👉 https://allogoo.com`,
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleWhatsApp = async () => {
    const text = `🎫 *Ma Demande Allo Dakar*\n\n🚍 Départ: ${searchParams.depart || 'Dakar'}\n📍 Arrivée: ${searchParams.arrivee || 'Touba'}\n👥 Passagers: ${searchParams.passagers}\n\n👉 https://allogoo.com`;
      
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep(1);
      setIsClosing(false);
      setTicketPour(null);
      
      const storedDepart = localStorage.getItem('ar_search_depart') || '';
      const storedArrivee = localStorage.getItem('ar_search_arrivee') || '';

      setSearchParams(s => ({ 
        ...s, 
        type: initialType,
        depart: storedDepart || s.depart,
        arrivee: storedArrivee || s.arrivee
      }));
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

  const nextStep = (overrideMethod?: string | React.MouseEvent) => {
    const finalMethod = typeof overrideMethod === 'string' ? overrideMethod : paymentMethod;
    if (step === 1) {
      if (searchParams.arrivee && searchParams.quartierArrivee) {
        saveCustomQuartier(searchParams.arrivee, searchParams.quartierArrivee.trim());
      }
      if (searchParams.depart && pickupLocation && !pickupLocation.includes('GPS:')) {
        saveCustomQuartier(searchParams.depart, pickupLocation.trim());
      }
    }
    
    if (step === totalSteps - 1) {
      const isAlloDakar = true;
      let formattedTrajet = `${searchParams.depart || 'Dakar'} → ${searchParams.arrivee || 'Touba'}`;
      if (isAlloDakar && pickupLocation && searchParams.quartierArrivee) {
        formattedTrajet = `${searchParams.depart} (${pickupLocation}) → ${searchParams.arrivee} (${searchParams.quartierArrivee})`;
      }

      const attemptBooking = async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 seconds timeout

        try {
          if (!isQueued) setIsSearching(true); 
          const token = localStorage.getItem('ar_auth_token');
          let apiData: any = {};
          
          if (token && selectedTrip?.id) {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
            const res = await fetch(`${apiUrl}/v1/bookings`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                tripId: selectedTrip.id,
                seatNumber: 1, 
                passengersCount: parseInt(searchParams.passagers?.toString().split(' ')[0] || '1', 10),
                paymentMethod: finalMethod === 'om' ? 'ORANGE_MONEY' : (finalMethod.toUpperCase() || 'WAVE')
              }),
              signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (res.ok) {
              apiData = await res.json();
              setIsQueued(false);
            } else {
              if (res.status === 401) {
                localStorage.removeItem('ar_auth_token');
                localStorage.removeItem('ar_auth_user');
                localStorage.removeItem('isAuthenticated');
                setGlobalError('Votre session a expiré ou est invalide. Veuillez recharger la page ou vous reconnecter.');
                setIsSearching(false);
                return;
              }

              let errorData: any = {};
              try {
                errorData = await res.json();
              } catch (e) {
                errorData = { message: 'Erreur serveur.' };
              }

              if (errorData.code === 'QUEUE_WAIT') {
                setIsQueued(true);
                setQueueMessage(errorData.message);
                setTimeout(attemptBooking, 2000);
                return;
              } else if (errorData.code === 'TRIP_FULL_ALTERNATIVES') {
                setIsSearching(false);
                setGlobalError('');
                setAlternativeTrips(errorData.alternatives || []);
                return;
              } else {
                setGlobalError(errorData.message || 'Erreur de réservation');
                setIsSearching(false);
                return;
              }
            }
          } else {
             console.warn("User is not logged in. Generating a demo ticket.");
             apiData = { booking: { status: 'CONFIRMED' } }; 
             clearTimeout(timeoutId);
          }

          // Si le paiement est en attente (Wave ou OM)
          if (apiData.booking?.status === 'PENDING_PAYMENT' && apiData.paymentSession) {
             setPaymentData(apiData.paymentSession);
             
             if (windowWidth < 768) {
               // Mobile : Redirection vers l'application de paiement
               if (apiData.paymentSession.paymentUrl) {
                 window.open(apiData.paymentSession.paymentUrl, '_blank');
               }
               
               // Simulation en arrière-plan pour le test
               setTimeout(() => {
                 const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
                 fetch(`${apiUrl}${apiData.paymentSession.webhook_simulation_url}`).catch(() => {});
               }, 8000);
             }
          }

          const newTicket = {
            id: apiData.booking?.qrCodeToken || `AR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            qrCodeToken: apiData.booking?.qrCodeToken || 'TOKEN-FALLBACK',
            trajet: formattedTrajet,
            date: searchParams.date || new Date().toISOString().split('T')[0],
            heure: searchParams.heure || 'Horaire Flexible',
            siege: `${searchParams.passagers} Place(s)`,
            compagnie: selectedTrip?.company?.name || 'Allo Dakar',
            vehicule: selectedTrip?.vehicle?.type || 'Voiture Privée',
            statut: 'actif',
            passager: voyageurInfo.nom || 'Passager Inconnu'
          };
          
          setGeneratedTicket(newTicket);
          setIsSearching(false);
          setStep(prev => prev + 1);
        } catch (error: any) {
          clearTimeout(timeoutId);
          console.error('Erreur lors de la réservation:', error);
          if (error.name === 'AbortError') {
             setGlobalError('Le serveur met trop de temps à répondre (Timeout).');
          } else {
             setGlobalError('Erreur de connexion. Veuillez réessayer.');
          }
          setIsSearching(false);
        }
      };

      attemptBooking();
      return;
    }
    
    setStep(s => Math.min(s + 1, totalSteps));
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  if (!isOpen && !isClosing) return null;

  const renderStep1Search = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-slate-50 dark:bg-[#1A1A1A]/50 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-[#2A2A2A] transition-colors">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Où allez-vous avec Allo Dakar ?</h3>
        <div className="space-y-3">
          <div className="relative z-[60]">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              ref={departInputRef}
              type="text" 
              placeholder="Ville de départ (ex: Dakar)"
              className="w-full bg-white dark:bg-black border border-slate-200 dark:border-[#2A2A2A] rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              value={searchParams.depart}
              onChange={(e) => setSearchParams({...searchParams, depart: e.target.value})}
            />
          </div>
          
          {isAlloDakar && (
            <div className="relative z-[50] border border-orange-500/30 rounded-xl p-3 bg-orange-50 dark:bg-orange-500/5 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-orange-600 dark:text-orange-400 font-bold">Adresse de prise en charge (Google Places)</label>
                <button 
                  onClick={handleGeolocate} 
                  disabled={isLocating}
                  className="text-white font-bold flex items-center gap-1 bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded-lg disabled:opacity-50 text-xs transition-colors shrink-0 ml-2"
                >
                  <MapPin className="w-3 h-3" />
                  {isLocating ? 'Patientez...' : 'Me localiser'}
                </button>
              </div>
              <input 
                ref={pickupInputRef}
                type="text" 
                placeholder="Entrez l'adresse exacte du passager"
                className="w-full bg-white dark:bg-black border border-slate-200 dark:border-[#2A2A2A] rounded-lg py-2 px-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 text-sm transition-colors"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
              />
            </div>
          )}

          <div className="relative z-[40]">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500 dark:text-orange-400" />
            <input 
              ref={arriveeInputRef}
              type="text" 
              placeholder="Ville d'arrivée (ex: Saly)"
              className="w-full bg-white dark:bg-black border border-slate-200 dark:border-[#2A2A2A] rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              value={searchParams.arrivee}
              onChange={(e) => setSearchParams({...searchParams, arrivee: e.target.value})}
            />
          </div>

          <div className="relative z-[30]">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input 
              ref={quartierArriveeInputRef}
              type="text" 
              placeholder={isAlloDakar ? "Quartier ou point de chute exact" : "Quartier (Optionnel)"}
              className="w-full bg-slate-100 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-slate-300 focus:outline-none focus:border-orange-500 text-sm transition-colors"
              value={searchParams.quartierArrivee}
              onChange={(e) => setSearchParams({...searchParams, quartierArrivee: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 relative z-[20]">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <select 
                className="w-full bg-white dark:bg-black border border-slate-200 dark:border-[#2A2A2A] rounded-xl py-3 pl-10 pr-10 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 appearance-none text-sm cursor-pointer transition-colors"
                value={searchParams.date}
                onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
              >
                <option value="" disabled>Date de départ</option>
                {getAvailableDates().map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
            
            {/* Removed hour selector so passenger sees all cars for the selected date */}

            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <select 
                className="w-full bg-white dark:bg-black border border-slate-200 dark:border-[#2A2A2A] rounded-xl py-3 pl-10 pr-10 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 appearance-none text-sm cursor-pointer transition-colors"
                value={searchParams.passagers}
                onChange={(e) => setSearchParams({...searchParams, passagers: parseInt(e.target.value)})}
              >
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Passager{n > 1 ? 's' : ''}</option>)}
              </select>
               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>          </div>
        </div>
      </div>
      <button 
        disabled={!searchParams.depart || !searchParams.arrivee || !searchParams.quartierArrivee || !pickupLocation || !searchParams.date || isSearching}
        onClick={async () => {
          setIsSearching(true);
          if (isAlloPrive) {
            try {
              const res = await fetch('/api/allo-prive', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  clientId: userPhone || 'demo-client-id',
                  clientName: userName || 'Client Allo Privé',
                  clientPhone: userPhone || '+221776783412',
                  origin: `${searchParams.depart} (${pickupLocation})`,
                  destination: `${searchParams.arrivee} (${searchParams.quartierArrivee})`,
                  departureDate: searchParams.date,
                  price: 20000,
                }),
              });
              if (res.ok) {
                const data = await res.json();
                setAlloPriveRequestId(data.request.id);
                setIsAlloPriveSuccess(true);
                setStep(6); // Go to success step directly
              } else {
                setGlobalError("Échec de la création de la demande Allo Privé.");
              }
            } catch (e: any) {
              setGlobalError(`Erreur: ${e.message}`);
            }
          } else {
            try {
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
              const res = await fetch(`${apiUrl}/v1/trips/search?originCity=${searchParams.depart}&destinationCity=${searchParams.arrivee}&date=${searchParams.date}`);
              const data = await res.json();
              if (Array.isArray(data)) {
                setRealTrips(data);
              }
            } catch (e: any) {
              console.error("Erreur de connexion au serveur", e);
              setGlobalError(`Impossible de joindre l'API en ligne: ${e.message}`);
            }
            nextStep();
          }
          setIsSearching(false);
        }}
        className="w-full bg-orange-600 disabled:bg-slate-200 dark:disabled:bg-[#222222] disabled:text-slate-400 dark:disabled:text-slate-500 hover:bg-orange-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-orange-600/20"
      >
        {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        {isSearching ? 'Recherche...' : (isAlloPrive ? 'Créer la demande Allo Privé' : ((searchParams.depart && searchParams.arrivee && pickupLocation && searchParams.quartierArrivee && searchParams.date) ? 'Rechercher un trajet' : 'Informations incomplètes'))}
      </button>
    </div>
  );

  const renderStep2Results = () => {
    // Si l'API retourne des données, on les utilise, sinon on affiche une liste vide ou un fallback
    const displayTrips = realTrips.length > 0 ? realTrips.map((t: any) => {
      let isTooSoon = false;
      if (t.departureTime) {
        const depTime = new Date(t.departureTime);
        const now = new Date();
        const diffMinutes = (depTime.getTime() - now.getTime()) / (1000 * 60);
        isTooSoon = diffMinutes >= 0 && diffMinutes < 60;
      }
      return {
        id: t.id,
        company: t.company?.name || "Allogoo",
        price: t.pricePerSeat || 5000,
        type: `Voiture ${t.vehicle?.capacity || 5} places`,
        options: t.isAirConditioned !== false ? "Climatisé" : "Standard",
        route: t.takesTollRoad !== false ? "Autoroute" : "Nationale",
        time: new Date(t.departureTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        passagers: t.passagers ?? 0,
        placesPrises: t.placesPrises ?? 0,
        availableSeats: t.availableSeats || 4,
        seatsOffered: t.seatsOffered || 4,
        isTooSoon,
        driverPhone: t.driverPhone || '+221 77 000 00 00'
      };
    }) : [];

      return (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 px-1">Choix du type de véhicule Allo Dakar</h3>
          <div className="space-y-3">
            {displayTrips.length === 0 ? (
              <div className="bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] p-6 rounded-2xl text-center transition-colors">
                <p className="text-slate-500 dark:text-slate-400 text-sm">Aucun trajet trouvé sur cette liaison.</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Vous pouvez faire une demande Allogoo ordinaire ou privatiser une voiture avec Allo Privé.</p>
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    onClick={async () => {
                      setIsSearching(true);
                      try {
                        const res = await fetch('/api/allo-prive', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            clientId: userPhone || 'demo-client-id',
                            clientName: userName || 'Client',
                            clientPhone: userPhone || '+221776783412',
                            origin: `${searchParams.depart} (${pickupLocation})`,
                            destination: `${searchParams.arrivee} (${searchParams.quartierArrivee})`,
                            departureDate: searchParams.date,
                            price: 5000,
                            type: 'ordinaire',
                          }),
                        });
                        if (res.ok) {
                          const data = await res.json();
                          setAlloPriveRequestId(data.request.id);
                          setIsAlloPriveSuccess(true);
                          setStep(6);
                        } else {
                          setGlobalError("Échec de la création de la demande Allogoo ordinaire.");
                        }
                      } catch (e: any) {
                        setGlobalError(`Erreur: ${e.message}`);
                      }
                      setIsSearching(false);
                    }}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-3 rounded-xl transition-colors border border-slate-700"
                  >
                    Demande Allogoo ordinaire
                  </button>
                  <button
                    onClick={async () => {
                      setIsSearching(true);
                      try {
                        const res = await fetch('/api/allo-prive', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            clientId: userPhone || 'demo-client-id',
                            clientName: userName || 'Client Allo Privé',
                            clientPhone: userPhone || '+221776783412',
                            origin: `${searchParams.depart} (${pickupLocation})`,
                            destination: `${searchParams.arrivee} (${searchParams.quartierArrivee})`,
                            departureDate: searchParams.date,
                            price: 20000,
                            type: 'allo-prive',
                          }),
                        });
                        if (res.ok) {
                          const data = await res.json();
                          setAlloPriveRequestId(data.request.id);
                          setIsAlloPriveSuccess(true);
                          setStep(6);
                        } else {
                          setGlobalError("Échec de la création de la demande Allo Privé.");
                        }
                      } catch (e: any) {
                        setGlobalError(`Erreur: ${e.message}`);
                      }
                      setIsSearching(false);
                    }}
                    className="flex-1 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold py-3 rounded-xl transition-colors shadow-lg shadow-orange-600/20"
                  >
                    Demande Allo Privé
                  </button>
                </div>
              </div>
            ) : displayTrips.map((service: any) => (
              <div 
                key={service.id} 
                onClick={() => {
                  if (service.isTooSoon) {
                    setGlobalError(`Vous ne pouvez pas réserver à moins d'une heure du départ. Appelez le chauffeur au ${service.driverPhone}`);
                  } else if (searchParams.passagers > service.availableSeats) {
                    setGlobalError(`Impossible de choisir ce trajet : vous demandez ${searchParams.passagers} place(s) mais il n'en reste que ${service.availableSeats}.`);
                  } else {
                    setSelectedTrip(service); 
                    nextStep();
                  }
                }}
                className={`border p-4 rounded-2xl transition-all ${
                  service.isTooSoon || searchParams.passagers > service.availableSeats
                  ? 'bg-slate-50 dark:bg-[#1A1A1A]/50 border-slate-200 dark:border-[#2A2A2A]/50 opacity-70 cursor-not-allowed' 
                  : 'bg-white dark:bg-[#1A1A1A] border-slate-200 dark:border-[#2A2A2A] hover:border-orange-500/50 hover:bg-slate-50 dark:hover:bg-[#222222]/50 cursor-pointer'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`font-bold text-lg px-2 py-0.5 rounded-lg border ${
                        service.isTooSoon 
                        ? 'bg-slate-100 dark:bg-[#222222] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-[#333333]' 
                        : 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/30'
                      }`}>
                        {service.time}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">{service.company}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-slate-100 dark:bg-[#222222] text-xs text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">{service.type}</span>
                      <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        Capacité : {service.seatsOffered} places • Réservé : {service.placesPrises} • Disponible : {service.availableSeats}
                      </span>
                      {service.options === 'Climatisé' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          ❄️ Climatisé
                        </span>
                      )}
                      {service.route === 'Autoroute' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          🛣️ Via Autoroute
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xl font-bold text-orange-500">{service.price} <span className="text-sm text-slate-500 dark:text-slate-400 font-normal">FCFA / pers</span></p>
                  
                  {service.isTooSoon ? (
                    <a 
                      href={`tel:${service.driverPhone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-white flex items-center gap-2 text-sm font-bold bg-rose-600 hover:bg-rose-500 px-4 py-2 rounded-xl transition-colors shadow-lg shadow-rose-600/20"
                    >
                      <Smartphone className="w-4 h-4" /> Appeler
                    </a>
                  ) : searchParams.passagers > service.availableSeats ? (
                    <div className="text-slate-400 dark:text-slate-500 flex items-center gap-1 text-sm font-bold bg-slate-100 dark:bg-[#222] px-3 py-1.5 rounded-xl">
                      Places insuffisantes
                    </div>
                  ) : (
                    <div className="text-orange-500 flex items-center gap-1 text-sm font-bold bg-orange-500/10 px-3 py-1.5 rounded-xl">
                      Choisir <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
  };

  const renderStep3Seats = () => {
    // Generate a simple bus layout
    const seats = Array.from({ length: 12 }, (_, i) => ({
      id: `${i + 1}`,
      label: `${i + 1}`,
      isOccupied: [2, 5, 8].includes(i + 1)
    }));

    return (
      <div className="space-y-4 h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-4 sm:p-6 mb-4 flex-1 overflow-y-auto transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-slate-900 dark:text-white font-bold">Choix du siège</h3>
            <div className="flex gap-3 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-slate-200 dark:bg-[#222222] border border-slate-300 dark:border-[#333333]"></div> Libre</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-orange-600"></div> Sélection</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-rose-100 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-500/50"></div> Occupé</div>
            </div>
          </div>
          
          <div className="max-w-[200px] mx-auto bg-white dark:bg-black border-4 border-slate-200 dark:border-[#2A2A2A] rounded-[40px] p-4 py-8 relative transition-colors">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-2 bg-slate-200 dark:bg-[#222222] rounded-full"></div>
            
            <div className="grid grid-cols-3 gap-2 mt-8">
              {seats.map((seat, i) => (
                <button
                  key={seat.id}
                  disabled={seat.isOccupied}
                  onClick={() => setSelectedSeat(seat.id)}
                  className={`aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all
                    ${seat.isOccupied ? 'bg-rose-100 dark:bg-rose-500/10 border border-rose-300 dark:border-rose-500/20 text-rose-500 cursor-not-allowed' : 
                      selectedSeat === seat.id ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/40 scale-110 z-10' : 
                      'bg-slate-100 dark:bg-[#222222] border border-slate-200 dark:border-[#333333] text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}
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
          className="w-full bg-orange-600 disabled:bg-slate-200 dark:disabled:bg-[#222222] disabled:text-slate-400 dark:disabled:text-slate-500 hover:bg-orange-500 text-white font-bold py-4 rounded-xl transition-colors"
        >
          {selectedSeat ? `Confirmer le siège ${selectedSeat}` : 'Veuillez choisir un siège'}
        </button>
      </div>
    );
  };

  const renderStep4Info = () => {
    const handleContinueInfo = () => {
      if (!isAuthenticated) {
        openAuthModal(() => nextStep());
      } else {
        nextStep();
      }
    };

    if (ticketPour === null) {
      return (
        <div className="space-y-6 animate-in zoom-in-95 duration-300 py-8">
          <div className="bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden transition-colors">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500"></div>
            
            <div className="w-16 h-16 bg-slate-100 dark:bg-[#222222] rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-200 dark:border-[#333333]">
              <User className="w-8 h-8 text-orange-500" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Pour qui est ce billet ?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Veuillez sélectionner le bénéficiaire du trajet pour continuer.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setTicketPour('moi');
                  setVoyageurInfo({...voyageurInfo, nom: userName, telephone: userPhone, email: 'abdou@example.com'});
                }}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-slate-200 dark:border-[#333333] hover:border-orange-500 bg-white dark:bg-[#222222]/50 hover:bg-slate-50 dark:hover:bg-[#222222] transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20 flex items-center justify-center transition-colors">
                  <User className="w-6 h-6 text-slate-400 dark:text-slate-300 group-hover:text-orange-500 transition-colors" />
                </div>
                <span className="font-bold text-slate-900 dark:text-white">C'est pour moi</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Utiliser mon profil actuel</span>
              </button>

              <button
                onClick={() => {
                  setTicketPour('autre');
                  setVoyageurInfo({...voyageurInfo, nom: '', telephone: '', email: ''});
                }}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-slate-200 dark:border-[#333333] hover:border-orange-500 bg-white dark:bg-[#222222]/50 hover:bg-slate-50 dark:hover:bg-[#222222] transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20 flex items-center justify-center transition-colors">
                  <Users className="w-6 h-6 text-slate-400 dark:text-slate-300 group-hover:text-orange-500 transition-colors" />
                </div>
                <span className="font-bold text-slate-900 dark:text-white">Pour un proche</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Saisir de nouvelles informations</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-4 sm:p-6 space-y-4 transition-colors">
        <div className="flex items-center justify-between bg-white dark:bg-black p-3 rounded-xl border border-slate-200 dark:border-[#2A2A2A] mb-2 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center border border-orange-200 dark:border-orange-500/20">
              {ticketPour === 'moi' ? <User className="w-5 h-5 text-orange-500" /> : <Users className="w-5 h-5 text-orange-500" />}
            </div>
            <div className="text-left">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Billet destiné à</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{ticketPour === 'moi' ? 'Moi-même' : 'Un proche'}</p>
            </div>
          </div>
          <button 
            onClick={() => setTicketPour(null)}
            className="text-xs font-bold text-orange-500 hover:text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Modifier
          </button>
        </div>

        {ticketPour === 'moi' && (
          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-emerald-400 text-sm mb-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p>Profil connecté détecté. Informations pré-remplies.</p>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1 block">{ticketPour === 'moi' ? 'Nom Complet' : 'Nom Complet du Passager'}</label>
            <input 
              type="text" 
              className="w-full bg-white dark:bg-black border border-slate-200 dark:border-[#2A2A2A] rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:border-orange-500 outline-none transition-colors"
              value={voyageurInfo.nom}
              onChange={(e) => setVoyageurInfo({...voyageurInfo, nom: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1 block">Téléphone (requis pour billet SMS)</label>
            <input 
              type="tel" 
              className="w-full bg-white dark:bg-black border border-slate-200 dark:border-[#2A2A2A] rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:border-orange-500 outline-none transition-colors"
              value={voyageurInfo.telephone}
              onChange={(e) => setVoyageurInfo({...voyageurInfo, telephone: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1 block">Email (optionnel)</label>
            <input 
              type="email" 
              className="w-full bg-white dark:bg-black border border-slate-200 dark:border-[#2A2A2A] rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:border-orange-500 outline-none transition-colors"
              value={voyageurInfo.email}
              onChange={(e) => setVoyageurInfo({...voyageurInfo, email: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1 block">Nombre de colis</label>
            <select 
              className="w-full bg-white dark:bg-black border border-slate-200 dark:border-[#2A2A2A] rounded-xl py-3 px-4 text-slate-900 dark:text-white focus:border-orange-500 outline-none appearance-none transition-colors"
              value={voyageurInfo.bagages}
              onChange={(e) => setVoyageurInfo({...voyageurInfo, bagages: parseInt(e.target.value)})}
            >
              <option value={0}>Aucun colis supplémentaire</option>
              <option value={1}>1 colis inclus</option>
              <option value={2}>2 colis (+1000 FCFA)</option>
              <option value={3}>3 colis (+2000 FCFA)</option>
            </select>
          </div>
        </div>
      </div>
      <button 
        onClick={handleContinueInfo}
        disabled={!voyageurInfo.nom || !voyageurInfo.telephone}
        className="w-full bg-orange-600 hover:bg-orange-500 disabled:bg-slate-200 dark:disabled:bg-[#222222] disabled:text-slate-400 dark:disabled:text-slate-500 text-white font-bold py-4 rounded-xl transition-colors"
      >
        Procéder au paiement
      </button>
    </div>
  );
};

  const renderStep5Payment = () => {
    const basePrice = selectedTrip?.price || 5000;
    const ticketSubtotal = basePrice * searchParams.passagers;
    const luggageFee = voyageurInfo.bagages > 1 ? (voyageurInfo.bagages - 1) * 1000 : 0;
    const taxes = 250;
    const clientFee = Math.round(ticketSubtotal * 0.03);
    const total = ticketSubtotal + luggageFee + taxes + clientFee;

    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-4 sm:p-6 transition-colors">
          <h3 className="text-slate-900 dark:text-white font-bold mb-4">Résumé de la commande</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Billet {selectedTrip?.company}</span>
              <span>{ticketSubtotal} FCFA</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Frais de colis ({voyageurInfo.bagages})</span>
              <span>{luggageFee} FCFA</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400 text-xs">
              <span>Frais de service client (3%)</span>
              <span>{clientFee} FCFA</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400 text-xs">
              <span>Taxes et redevances</span>
              <span>{taxes} FCFA</span>
            </div>
            <div className="border-t border-slate-200 dark:border-[#2A2A2A] pt-3 mt-3 flex justify-between items-center transition-colors">
              <span className="font-bold text-slate-900 dark:text-white">Total à payer</span>
              <span className="text-xl font-bold text-orange-500">{total} FCFA</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 px-1 mb-3">Moyen de paiement</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'cash', name: 'Payer à l\'arrivée', subLabel: '✅ Place confirmée', color: 'bg-emerald-600 text-white border-emerald-500', icon: Banknote },
              { id: 'wave', name: 'Wave', subLabel: '⏳ Validation mobile', color: 'bg-blue-600 text-white border-blue-500', icon: Smartphone },
              { id: 'om', name: 'Orange Money', subLabel: '⏳ Validation mobile', color: 'bg-orange-500 text-white border-orange-400', customIcon: OrangeMoneyLogo },
              { id: 'wallet', name: 'AllerRetour Wallet', subLabel: '', color: 'bg-slate-100 dark:bg-[#222222] text-slate-900 dark:text-white border-slate-300 dark:border-[#333333]', icon: Wallet },
            ].map(method => (
              <button
                key={method.id}
                onClick={() => {
                  setPaymentMethod(method.id);
                }}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all
                  ${paymentMethod === method.id ? method.color + ' ring-2 ring-orange-500/50 dark:ring-white/20' : 'bg-white dark:bg-[#1A1A1A] border-slate-200 dark:border-[#2A2A2A] text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-[#333333]'}`}
              >
                {method.customIcon ? <method.customIcon className="w-6 h-6" /> : (method.icon && <method.icon className="w-6 h-6" />)}
                <span className="text-xs font-bold">{method.name}</span>
                {method.subLabel && <span className="text-[10px] opacity-80 -mt-1">{method.subLabel}</span>}
              </button>
            ))}
          </div>
        </div>

        {isQueued && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-3 animate-pulse mt-4">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <div>
              <p className="font-bold text-orange-600 dark:text-orange-400 text-sm">File d'attente</p>
              <p className="text-xs text-orange-600/80 dark:text-orange-400/80">{queueMessage || "Un autre client réserve une place devant vous. Veuillez patienter..."}</p>
            </div>
          </div>
        )}

        {alternativeTrips.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mt-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="bg-red-500/20 p-2 rounded-full">
                <ShieldCheck className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="font-bold text-red-600 dark:text-red-400 text-sm">Véhicule complet !</p>
                <p className="text-xs text-red-600/80 dark:text-red-400/80">
                  La voiture que vous avez choisie vient d'être remplie. Voici d'autres trajets disponibles pour {searchParams.arrivee} :
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {alternativeTrips.map(alt => (
                <button 
                  key={alt.id}
                  onClick={() => {
                    setSelectedTrip(alt);
                    setAlternativeTrips([]);
                    setGlobalError('');
                  }}
                  className="w-full flex items-center justify-between bg-white dark:bg-[#222] border border-slate-200 dark:border-[#333] p-3 rounded-lg hover:border-orange-500 transition-colors text-left"
                >
                  <div>
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{new Date(alt.departureTime).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})} - {alt.companyName}</p>
                    <p className="text-xs text-slate-500">{alt.availableSeats} place(s) dispo</p>
                  </div>
                  <span className="font-bold text-orange-500 text-sm">{alt.price} FCFA</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <button 
          disabled={!paymentMethod || isSearching || isQueued || alternativeTrips.length > 0}
          onClick={nextStep}
          className="w-full bg-orange-600 disabled:bg-[#222222] disabled:text-slate-500 hover:bg-orange-500 text-white font-bold py-4 rounded-xl transition-colors mt-4 flex items-center justify-center gap-2 relative overflow-hidden"
        >
          {isQueued ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
              En attente...
            </>
          ) : isSearching ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Traitement du paiement...
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              Payer {total} FCFA
            </>
          )}
        </button>
      </div>
    );
  };

  const renderStep6SuccessAlloDakar = () => {
    // Si le paiement est en attente
    if (paymentData) {
      return (
        <div className="flex flex-col items-center justify-center py-8 animate-in zoom-in-95 duration-500 px-4">
          <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mb-6 relative">
            <Smartphone className="w-10 h-10 text-orange-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">Paiement en attente</h2>
          
          <div className="bg-slate-50 dark:bg-[#1A1A1A] p-6 rounded-2xl border border-slate-200 dark:border-[#2A2A2A] w-full text-center space-y-4 shadow-xl">
            {windowWidth < 768 ? (
              <p className="text-sm font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/10 p-3 rounded-lg border border-orange-200 dark:border-orange-500/20">
                Vous avez été redirigé vers l'application {paymentData.provider}.<br/>
                Veuillez y valider le paiement.
              </p>
            ) : windowWidth >= 768 && windowWidth < 1024 ? (
              <p className="text-sm font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/10 p-3 rounded-lg border border-orange-200 dark:border-orange-500/20">
                Option 1 : Vérifiez votre téléphone, un Push USSD a été envoyé.<br/>
                Option 2 : Scannez le QR Code ci-dessous.
              </p>
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">Scannez ce QR Code avec l'application <b>{paymentData.provider}</b> pour payer.</p>
            )}

            <div className="flex justify-center bg-white p-4 rounded-xl border-4 border-slate-200 inline-block mx-auto shadow-sm">
              <QRCodeBrandEngine value={paymentData.paymentUrl} size={180} />
            </div>

            <button 
              disabled={isVerifyingPayment}
              onClick={async () => {
                setIsVerifyingPayment(true);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
                await fetch(`${apiUrl}${paymentData.webhook_simulation_url}`);
                
                try {
                  const res = await fetch(`${apiUrl}/v1/bookings/${paymentData.bookingId}/status`);
                  if (res.ok) {
                    const data = await res.json();
                    if (data.status === 'CONFIRMED') {
                      const index = realTrips.findIndex((t: any) => t.id === selectedTrip?.id);
                      if (index !== -1) {
                        const updatedTrips = [...realTrips];
                        updatedTrips[index].availableSeats = Math.max(0, updatedTrips[index].availableSeats - searchParams.passagers);
                        setRealTrips(updatedTrips);
                      }
                      setPaymentData(null); 
                    } else {
                      alert("Le paiement n'a pas encore été reçu. Veuillez vérifier votre application Mobile Money.");
                    }
                  } else {
                    alert("Erreur de communication avec le serveur.");
                  }
                } catch (e) {
                  alert("Erreur de vérification du paiement.");
                }
                setIsVerifyingPayment(false);
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl mt-4 transition-colors flex items-center justify-center gap-2"
            >
              {isVerifyingPayment ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Vérification en cours...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  J'ai scanné et payé
                </>
              )}
            </button>
          </div>
        </div>
      );
    }

    return (
    <div className="flex flex-col items-center justify-center py-8 animate-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 relative">
        <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">Paiement Réussi !</h2>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-8 text-sm">Votre billet a été généré et envoyé par WhatsApp et Email.</p>

      {/* Request Recap UI */}
      <div ref={ticketRef} className="w-full max-w-sm bg-white rounded-2xl overflow-hidden relative shadow-2xl">
        <div className="bg-[#0A0A0A] p-4 text-center border-b-[3px] border-orange-500">
          <h3 className="text-xl font-bold text-white tracking-tight flex justify-center items-center gap-2">
            <CarFront className="w-5 h-5 text-orange-500" />
            Aller<span className="text-orange-500">Retour</span>
          </h3>
          <p className="text-slate-400 text-xs mt-1">Billet Confirmé : {selectedTrip?.company}</p>
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
              <p className="font-bold text-slate-900 break-words leading-tight">{voyageurInfo.nom}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Places</p>
              <p className="font-bold text-orange-600 text-lg">{searchParams.passagers}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Date & Heure</p>
              <p className="font-bold text-slate-900">{searchParams.date || 'Aujourd\'hui'} à {searchParams.heure || 'Flexible'}</p>
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
                  size={200} 
                />
              </div>
              <p className="text-[10px] text-slate-500 font-bold text-emerald-500">Scanner au moment de l'embarquement</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full mt-6">
        <button onClick={handleDownload} className="bg-slate-100 dark:bg-[#222222] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-[#333333] font-bold py-3 rounded-xl flex items-center justify-center gap-1 transition-colors text-xs">
          <Download className="w-4 h-4" /> Billet
        </button>
        <button onClick={handleShare} className="bg-slate-100 dark:bg-[#222222] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-[#333333] font-bold py-3 rounded-xl flex items-center justify-center gap-1 transition-colors text-xs">
          <Share2 className="w-4 h-4" /> Partager
        </button>
        <button onClick={handleWhatsApp} className="bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-1 transition-colors text-xs">
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </button>
      </div>
      
      <button 
        onClick={handleClose}
        className="w-full bg-slate-100 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] text-slate-700 dark:text-slate-300 font-bold py-4 rounded-xl mt-3 transition-colors hover:bg-slate-200 dark:hover:bg-[#222222]"
      >
        Retour à l'accueil
      </button>
    </div>
  );
  };

  const renderStep6SuccessBus = () => {
    // Si le paiement est en attente
    if (paymentData) {
      return (
        <div className="flex flex-col items-center justify-center py-8 animate-in zoom-in-95 duration-500 px-4">
          <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mb-6 relative">
            <Smartphone className="w-10 h-10 text-orange-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">Paiement en attente</h2>
          
          <div className="bg-slate-50 dark:bg-[#1A1A1A] p-6 rounded-2xl border border-slate-200 dark:border-[#2A2A2A] w-full text-center space-y-4 shadow-xl">
            {windowWidth < 768 ? (
              <p className="text-sm font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/10 p-3 rounded-lg border border-orange-200 dark:border-orange-500/20">
                Vous avez été redirigé vers l'application {paymentData.provider}.<br/>
                Veuillez y valider le paiement.
              </p>
            ) : windowWidth >= 768 && windowWidth < 1024 ? (
              <p className="text-sm font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/10 p-3 rounded-lg border border-orange-200 dark:border-orange-500/20">
                Option 1 : Vérifiez votre téléphone, un Push USSD a été envoyé.<br/>
                Option 2 : Scannez le QR Code ci-dessous.
              </p>
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">Scannez ce QR Code avec l'application <b>{paymentData.provider}</b> pour payer.</p>
            )}

            <div className="flex justify-center bg-white p-4 rounded-xl border-4 border-slate-200 inline-block mx-auto shadow-sm">
              <QRCodeBrandEngine value={paymentData.paymentUrl} size={180} />
            </div>

            <button 
              disabled={isVerifyingPayment}
              onClick={async () => {
                setIsVerifyingPayment(true);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
                await fetch(`${apiUrl}${paymentData.webhook_simulation_url}`);
                
                try {
                  const res = await fetch(`${apiUrl}/v1/bookings/${paymentData.bookingId}/status`);
                  if (res.ok) {
                    const data = await res.json();
                    if (data.status === 'CONFIRMED') {
                      const index = realTrips.findIndex((t: any) => t.id === selectedTrip?.id);
                      if (index !== -1) {
                        const updatedTrips = [...realTrips];
                        updatedTrips[index].availableSeats = Math.max(0, updatedTrips[index].availableSeats - searchParams.passagers);
                        setRealTrips(updatedTrips);
                      }
                      setPaymentData(null); 
                    } else {
                      alert("Le paiement n'a pas encore été reçu. Veuillez vérifier votre application Mobile Money.");
                    }
                  } else {
                    alert("Erreur de communication avec le serveur.");
                  }
                } catch (e) {
                  alert("Erreur de vérification du paiement.");
                }
                setIsVerifyingPayment(false);
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl mt-4 transition-colors flex items-center justify-center gap-2"
            >
              {isVerifyingPayment ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Vérification en cours...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  J'ai scanné et payé
                </>
              )}
            </button>
          </div>
        </div>
      );
    }

    return (
    <div className="flex flex-col items-center justify-center py-8 animate-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 relative">
        <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">Paiement Réussi !</h2>
      <p className="text-slate-500 dark:text-slate-400 text-center mb-8 text-sm">Votre billet a été généré et envoyé par WhatsApp et Email.</p>

      {/* Ticket UI */}
      <div ref={ticketRef} className="w-full max-w-sm bg-white rounded-2xl overflow-hidden relative shadow-2xl">
        <div className="bg-slate-50 dark:bg-[#0A0A0A] p-4 text-center border-b-[3px] border-orange-500 transition-colors">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex justify-center items-center gap-2">
            <CarFront className="w-5 h-5 text-orange-500" />
            Aller<span className="text-orange-500">Retour</span>
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{selectedTrip?.company}</p>
        </div>
        
        <div className="p-6 relative">
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 dark:bg-[#000000] rounded-full transition-colors"></div>
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-slate-50 dark:bg-[#000000] rounded-full transition-colors"></div>
          
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
              <p className="font-bold text-slate-900 break-words leading-tight">{voyageurInfo.nom}</p>
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
                  size={200} 
                />
              </div>
              <p className="text-[10px] text-slate-500">Scanner au moment de l'embarquement</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full mt-6">
        <button onClick={handleDownload} className="bg-slate-100 dark:bg-[#222222] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-[#333333] font-bold py-3 rounded-xl flex items-center justify-center gap-1 transition-colors text-xs">
          <Download className="w-4 h-4" /> Billet
        </button>
        <button onClick={handleShare} className="bg-slate-100 dark:bg-[#222222] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-[#333333] font-bold py-3 rounded-xl flex items-center justify-center gap-1 transition-colors text-xs">
          <Share2 className="w-4 h-4" /> Partager
        </button>
        <button onClick={handleWhatsApp} className="bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-1 transition-colors text-xs">
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </button>
      </div>
      
      <button 
        onClick={handleClose}
        className="w-full bg-slate-100 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] text-slate-700 dark:text-slate-300 font-bold py-4 rounded-xl mt-3 transition-colors hover:bg-slate-200 dark:hover:bg-[#222222]"
      >
        Retour à l'accueil
      </button>
    </div>
  );
  };

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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={step < totalSteps ? handleClose : undefined}></div>
      
      <div className={`relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-md bg-white dark:bg-[#000000] sm:rounded-[2rem] sm:border border-slate-200 dark:border-[#2A2A2A]/80 flex flex-col shadow-2xl overflow-hidden transition-colors
        ${isClosing ? 'animate-out slide-out-to-bottom-8 sm:slide-out-to-bottom-0 sm:zoom-out-95 duration-300' : 'animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300'}`}
      >
        {/* Header */}
        <div className="flex-none bg-slate-50 dark:bg-[#0A0A0A] border-b border-slate-200 dark:border-[#2A2A2A]/80 px-4 py-3 flex items-center justify-between sticky top-0 z-10 transition-colors">
          <div className="flex items-center gap-3">
            {step > 1 && step < totalSteps && (
              <button onClick={prevStep} className="p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-[#222222]">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-slate-900 dark:text-white font-bold leading-none">{step === totalSteps ? (isAlloDakar ? 'Demande Envoyée' : 'Billet Confirmé') : 'Nouvelle Demande'}</h2>
              {step < totalSteps && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Étape {step} sur {totalSteps - 1} : {steps[step-1].title}</p>
              )}
            </div>
          </div>
          {step < totalSteps && (
            <button onClick={handleClose} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-[#1A1A1A] rounded-full border border-slate-200 dark:border-[#2A2A2A] transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress bar */}
        {step < totalSteps && (
          <div className="h-1 bg-slate-100 dark:bg-[#1A1A1A] w-full flex-none transition-colors">
            <div 
              className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-500 ease-out"
              style={{ width: `${(step / (totalSteps - 1)) * 100}%` }}
            ></div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-hide">
          {globalError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium relative">
              <button onClick={() => setGlobalError('')} className="absolute top-2 right-2 p-1 text-rose-500/60 hover:text-rose-500">
                <X className="w-3 h-3" />
              </button>
              {globalError}
            </div>
          )}
          {globalSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-medium relative">
              <button onClick={() => setGlobalSuccess('')} className="absolute top-2 right-2 p-1 text-emerald-500/60 hover:text-emerald-500">
                <X className="w-3 h-3" />
              </button>
              {globalSuccess}
            </div>
          )}
          {isAlloPriveSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center animate-in zoom-in-95 duration-300 font-sans">
              <div className="w-20 h-20 bg-orange-100 dark:bg-orange-500/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-orange-500" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Demande Allo Privé créée !</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                Votre appel d'offres pour une voiture entière de <b>{searchParams.depart}</b> à <b>{searchParams.arrivee}</b> a été publié. Les chauffeurs qualifiés (fiabilité ≥ 80%) vont postuler.
              </p>
              <div className="bg-slate-50 dark:bg-[#141414] p-4 rounded-xl border border-slate-200 dark:border-[#2A2A2A] w-full max-w-sm text-left mb-6 space-y-2">
                <p className="text-xs text-slate-600 dark:text-slate-400"><span className="font-semibold text-slate-900 dark:text-white">Départ:</span> {searchParams.date}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400"><span className="font-semibold text-slate-900 dark:text-white">Lieu:</span> {pickupLocation}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400"><span className="font-semibold text-slate-900 dark:text-white">Budget:</span> 20 000 FCFA</p>
              </div>
              <button
                onClick={() => {
                  setIsAlloPriveSuccess(false);
                  setIsAlloPrive(false);
                  handleClose();
                }}
                className="w-full max-w-xs bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-orange-600/20"
              >
                Fermer
              </button>
            </div>
          ) : (
            <>
              {step === 1 && renderStep1Search()}
              {step === 2 && renderStep2Results()}
              
              {step === 3 && !isAlloDakar && renderStep3Seats()}
              {step === 3 && isAlloDakar && renderStep4Info()}

              {step === 4 && !isAlloDakar && renderStep4Info()}
              {step === 4 && isAlloDakar && renderStep5Payment()}

              {step === 5 && !isAlloDakar && renderStep5Payment()}
              {step === 5 && isAlloDakar && renderStep6SuccessAlloDakar()}

              {step === 6 && !isAlloDakar && renderStep6SuccessBus()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// trigger vercel build

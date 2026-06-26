'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, MapPin, Package, User, ArrowRight, CheckCircle2, 
  Smartphone, QrCode, Download, Share2, Box, Wallet
} from 'lucide-react';
import QRCodeBrandEngine from './QRCodeBrandEngine';
import html2canvas from 'html2canvas';
import { OrangeMoneyLogo } from './OrangeMoneyLogo';
import { useAuth } from './AuthContext';
import { VILLES_SENEGAL, INITIAL_QUARTIERS } from '../data/quartiers';

interface ColisWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ColisWizardModal({ isOpen, onClose }: ColisWizardModalProps) {
  const [step, setStep] = useState(1);
  const [isClosing, setIsClosing] = useState(false);
  const { isAuthenticated, openAuthModal, user } = useAuth();

  const [colisParams, setColisParams] = useState({
    depart: '',
    quartierDepart: '',
    arrivee: '',
    quartierArrivee: '',
    destinataireNom: '',
    destinataireTel: '',
    taille: 'Moyen',
    modePaiement: 'Wave',
    usePoints: false
  });

  const [showQuartierDepartSuggestions, setShowQuartierDepartSuggestions] = useState(false);
  const [showQuartierArriveeSuggestions, setShowQuartierArriveeSuggestions] = useState(false);
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

  const getCityKey = (address: string) => {
    if (!address) return '';
    const clean = address.toLowerCase();
    const found = Object.keys(quartiersSenegal).find(city => clean.includes(city.toLowerCase()));
    return found || '';
  };

  const formatPhoneForSubmit = (p: string): string => {
    let clean = p.replace(/\s+/g, '');
    if (!clean.startsWith('+221') && !clean.startsWith('221') && !clean.startsWith('00221')) {
      return `+221${clean}`;
    } else if (clean.startsWith('221')) {
      return `+${clean}`;
    } else if (clean.startsWith('00221')) {
      return clean.replace('00221', '+221');
    }
    return clean;
  };

  const departCityKey = getCityKey(colisParams.depart);
  const selectedDepartQuartiers = departCityKey ? (quartiersSenegal[departCityKey] || []) : [];
  const filteredDepartQuartiers = selectedDepartQuartiers.filter(q => 
    colisParams.quartierDepart && q.toLowerCase().includes(colisParams.quartierDepart.toLowerCase())
  );
  const displayDepartQuartiers = colisParams.quartierDepart 
    ? filteredDepartQuartiers.slice(0, 15) 
    : (departCityKey ? selectedDepartQuartiers : []);

  const arriveeCityKey = getCityKey(colisParams.arrivee);
  const selectedArriveeQuartiers = arriveeCityKey ? (quartiersSenegal[arriveeCityKey] || []) : [];
  const filteredArriveeQuartiers = selectedArriveeQuartiers.filter(q => 
    colisParams.quartierArrivee && q.toLowerCase().includes(colisParams.quartierArrivee.toLowerCase())
  );
  const displayArriveeQuartiers = colisParams.quartierArrivee 
    ? filteredArriveeQuartiers.slice(0, 15) 
    : (arriveeCityKey ? selectedArriveeQuartiers : []);

  const [generatedTicket, setGeneratedTicket] = useState<any>(null);

  const departInputRef = useRef<HTMLInputElement>(null);
  const quartierDepartInputRef = useRef<HTMLInputElement>(null);
  const arriveeInputRef = useRef<HTMLInputElement>(null);
  const quartierArriveeInputRef = useRef<HTMLInputElement>(null);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || step !== 1) return;

    const initAutocomplete = () => {
      if (!(window as any).google || !(window as any).google.maps || !(window as any).google.maps.places) return;
      const options = { 
        componentRestrictions: { country: 'sn' }, 
        types: ['(cities)'],
        fields: ['formatted_address'] 
      };

      if (departInputRef.current) {
        const autocomplete = new (window as any).google.maps.places.Autocomplete(departInputRef.current, options);
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) setColisParams(s => ({ ...s, depart: place.formatted_address || '' }));
        });
      }
      if (arriveeInputRef.current) {
        const autocomplete = new (window as any).google.maps.places.Autocomplete(arriveeInputRef.current, options);
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) setColisParams(s => ({ ...s, arrivee: place.formatted_address || '' }));
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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep(1);
      setIsClosing(false);
      setColisParams({
        depart: '',
        quartierDepart: '',
        arrivee: '',
        quartierArrivee: '',
        destinataireNom: '',
        destinataireTel: '',
        taille: 'Moyen',
        modePaiement: '',
        usePoints: false
      });
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const nextStep = async () => {
    if (step === 2) {
      if (!isAuthenticated) {
        openAuthModal(() => {
          setStep(3);
        });
        return;
      }
    }

    if (step === 3) {
      try {
        const res = await fetch('/api/colis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destinataire: colisParams.destinataireNom,
            tel: formatPhoneForSubmit(colisParams.destinataireTel),
            taille: colisParams.taille,
            senderName: user?.fullName || 'Expéditeur Anonyme',
            senderPhone: formatPhoneForSubmit(user?.phone || '+221770000000'),
            email: (user as any)?.email || 'allogoosn@gmail.com',
            usePoints: colisParams.usePoints
          })
        });
        if (res.ok) {
          const { parcel } = await res.json();
          const newTicket = {
            id: parcel.trackingCode,
            qrCodeToken: 'TOKEN-COLIS',
            trajet: `${colisParams.depart} → ${colisParams.arrivee}`,
            date: new Date().toLocaleDateString('fr-FR'),
            taille: colisParams.taille,
            destinataire: colisParams.destinataireNom,
            tel: colisParams.destinataireTel,
            modePaiement: colisParams.modePaiement,
            statut: 'En attente de prise en charge'
          };
          setGeneratedTicket(newTicket);
          window.dispatchEvent(new Event('colis_updated'));
        }
      } catch (e) {
        console.error(e);
      }
    }
    setStep(s => Math.min(s + 1, 4));
  };
  
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleDownload = async () => {
    if (ticketRef.current) {
      try {
        const canvas = await html2canvas(ticketRef.current, { scale: 2 });
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = `Recu-Colis-AlloDakar.png`;
        link.click();
      } catch (err) {
        console.error("Erreur téléchargement", err);
      }
    }
  };

  if (!isOpen && !isClosing) return null;

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if ((window as any).google && (window as any).google.maps) {
            const geocoder = new (window as any).google.maps.Geocoder();
            geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results: any, status: any) => {
              if (status === 'OK' && results && results[0]) {
                const components = results[0].address_components || [];
                let quartier = '';
                let city = '';
                for (const component of components) {
                  if (
                    component.types.includes('neighborhood') || 
                    component.types.includes('sublocality') || 
                    component.types.includes('sublocality_level_1') ||
                    component.types.includes('route')
                  ) {
                    if (!quartier) quartier = component.long_name;
                  }
                  if (component.types.includes('locality') || component.types.includes('administrative_area_level_2')) {
                    if (!city) city = component.long_name;
                  }
                }
                setColisParams(s => ({ 
                  ...s, 
                  depart: city || s.depart,
                  quartierDepart: quartier || s.quartierDepart
                }));
              }
            });
          }
        },
        (error) => {
          console.error("Erreur géolocalisation", error);
        }
      );
    }
  };

  const renderStep1Lieux = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-slate-50 dark:bg-[#1A1A1A]/50 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-[#2A2A2A] transition-colors">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Où envoyer votre colis ?</h3>
        <div className="space-y-3">
          <div className="relative z-[60]">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              ref={departInputRef}
              type="text" 
              placeholder="Adresse de retrait (Expéditeur)"
              className="w-full bg-white dark:bg-black border border-slate-200 dark:border-[#2A2A2A] rounded-xl py-3 pl-10 pr-24 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              value={colisParams.depart}
              onChange={(e) => setColisParams({...colisParams, depart: e.target.value})}
            />
            <button 
              type="button"
              onClick={handleLocateMe}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-orange-200 dark:hover:bg-orange-800/50 transition-colors"
            >
              Me localiser
            </button>
          </div>

          <div className="relative z-[50]">
            <input 
              type="text" 
              placeholder="Sous-quartier de retrait exact"
              className="w-full bg-white dark:bg-black border border-slate-200 dark:border-[#2A2A2A] rounded-xl py-2 px-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 transition-colors"
              value={colisParams.quartierDepart}
              onChange={(e) => setColisParams({...colisParams, quartierDepart: e.target.value})}
              onFocus={() => setShowQuartierDepartSuggestions(true)}
              onBlur={() => setTimeout(() => setShowQuartierDepartSuggestions(false), 200)}
            />
            {showQuartierDepartSuggestions && displayDepartQuartiers.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl shadow-lg max-h-60 overflow-y-auto z-[999]">
                {displayDepartQuartiers.map((q) => (
                  <div 
                    key={q}
                    onClick={() => setColisParams({...colisParams, quartierDepart: q})}
                    className="px-4 py-2 hover:bg-orange-500/10 dark:hover:bg-orange-500/20 text-slate-800 dark:text-slate-200 text-sm cursor-pointer transition-colors"
                  >
                    {q}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative z-[40] mt-4">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
            <input 
              ref={arriveeInputRef}
              type="text" 
              placeholder="Adresse de livraison (Destinataire)"
              className="w-full bg-white dark:bg-black border border-slate-200 dark:border-[#2A2A2A] rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
              value={colisParams.arrivee}
              onChange={(e) => setColisParams({...colisParams, arrivee: e.target.value})}
            />
          </div>

          <div className="relative z-[30]">
            <input 
              type="text" 
              placeholder="Sous-quartier de livraison exact"
              className="w-full bg-white dark:bg-black border border-slate-200 dark:border-[#2A2A2A] rounded-xl py-2 px-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 transition-colors"
              value={colisParams.quartierArrivee}
              onChange={(e) => setColisParams({...colisParams, quartierArrivee: e.target.value})}
              onFocus={() => setShowQuartierArriveeSuggestions(true)}
              onBlur={() => setTimeout(() => setShowQuartierArriveeSuggestions(false), 200)}
            />
            {showQuartierArriveeSuggestions && displayArriveeQuartiers.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl shadow-lg max-h-60 overflow-y-auto z-[999]">
                {displayArriveeQuartiers.map((q) => (
                  <div 
                    key={q}
                    onClick={() => setColisParams({...colisParams, quartierArrivee: q})}
                    className="px-4 py-2 hover:bg-orange-500/10 dark:hover:bg-orange-500/20 text-slate-800 dark:text-slate-200 text-sm cursor-pointer transition-colors"
                  >
                    {q}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <button 
        disabled={!colisParams.depart || !colisParams.arrivee || !colisParams.quartierDepart || !colisParams.quartierArrivee}
        onClick={nextStep}
        className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
          (colisParams.depart && colisParams.arrivee && colisParams.quartierDepart && colisParams.quartierArrivee)
            ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/30' 
            : 'bg-slate-200 dark:bg-[#222222] text-slate-400 dark:text-slate-500 cursor-not-allowed'
        }`}
      >
        Continuer <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );

  const renderStep2Details = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-slate-50 dark:bg-[#1A1A1A]/50 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-[#2A2A2A] space-y-5 transition-colors">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Détails du destinataire</h3>
        
        <div className="space-y-3">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Nom complet du destinataire"
              className="w-full bg-white dark:bg-black border border-slate-200 dark:border-[#2A2A2A] rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 transition-colors"
              value={colisParams.destinataireNom}
              onChange={(e) => setColisParams({...colisParams, destinataireNom: e.target.value})}
            />
          </div>
          <div className="relative">
            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="tel" 
              placeholder="Numéro de téléphone"
              className="w-full bg-white dark:bg-black border border-slate-200 dark:border-[#2A2A2A] rounded-xl py-3 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 transition-colors"
              value={colisParams.destinataireTel}
              onChange={(e) => setColisParams({...colisParams, destinataireTel: e.target.value})}
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 dark:border-[#333333]">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-300 mb-3 uppercase tracking-wider">Taille du Colis</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'Enveloppe', icon: Box, desc: 'Documents', price: '5000F + Frais' },
              { id: 'Petit', icon: Package, desc: 'Boîte à chaussures', price: '5000F + Frais' },
              { id: 'Moyen', icon: Package, desc: 'Valise cabine', price: '5000F + Frais' },
              { id: 'Grand', icon: Box, desc: 'Gros carton', price: 'À négocier' }
            ].map(size => (
              <div 
                key={size.id}
                onClick={() => setColisParams({...colisParams, taille: size.id})}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  colisParams.taille === size.id 
                    ? 'bg-orange-100 dark:bg-orange-600/20 border-orange-500 text-orange-600 dark:text-orange-500' 
                    : 'bg-white dark:bg-black border-slate-200 dark:border-[#2A2A2A] text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-[#444444]'
                }`}
              >
                <size.icon className="w-6 h-6" />
                <div className="text-center">
                  <p className={`font-bold text-sm ${colisParams.taille === size.id ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{size.id}</p>
                  <p className="text-[10px] opacity-80 mb-1">{size.desc}</p>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${colisParams.taille === size.id ? 'bg-orange-500 text-white' : 'bg-slate-100 dark:bg-[#1A1A1A] text-slate-500 dark:text-slate-400'}`}>
                    {size.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button 
        disabled={!colisParams.destinataireNom || !colisParams.destinataireTel}
        onClick={nextStep}
        className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
          (colisParams.destinataireNom && colisParams.destinataireTel)
            ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/30' 
            : 'bg-slate-200 dark:bg-[#222222] text-slate-400 dark:text-slate-500 cursor-not-allowed'
        }`}
      >
        Continuer vers le paiement <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );

  const renderStep3Paiement = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-slate-50 dark:bg-[#1A1A1A]/50 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-[#2A2A2A] space-y-5 transition-colors">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Mode de paiement</h3>
        
        <div className="space-y-3">
          {[
            { id: 'Wave', icon: Smartphone, title: 'Wave', desc: 'Payer via l\'application Wave', color: 'cyan' },
            { id: 'Orange Money', customIcon: OrangeMoneyLogo, title: 'Orange Money', desc: 'Payer via Orange Money', color: 'orange' },
            { id: 'Wallet', icon: Wallet, title: 'Mon Solde', desc: 'Paiement instantané via votre portefeuille', color: 'blue' }
          ].map(method => (
            <div 
              key={method.id}
              onClick={() => setColisParams({...colisParams, modePaiement: method.id})}
              className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${
                colisParams.modePaiement === method.id 
                  ? 'bg-orange-100 dark:bg-orange-600/20 border-orange-500' 
                  : 'bg-white dark:bg-black border-slate-200 dark:border-[#2A2A2A] hover:border-slate-300 dark:hover:border-[#444444]'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                colisParams.modePaiement === method.id 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-slate-100 dark:bg-[#222222] text-slate-500 dark:text-slate-400'
              }`}>
                {method.customIcon ? <method.customIcon className="w-5 h-5" /> : (method.icon && <method.icon className="w-5 h-5" />)}
              </div>
              <div className="flex-1">
                <p className={`font-bold text-sm ${colisParams.modePaiement === method.id ? 'text-orange-700 dark:text-orange-400' : 'text-slate-900 dark:text-white'}`}>
                  {method.title}
                </p>
                <p className={`text-xs ${colisParams.modePaiement === method.id ? 'text-orange-600/80 dark:text-orange-400/80' : 'text-slate-500 dark:text-slate-400'}`}>
                  {method.desc}
                </p>
              </div>
              {colisParams.modePaiement === method.id && (
                <CheckCircle2 className="w-5 h-5 text-orange-500" />
              )}
            </div>
          ))}
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-500/30 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-bold text-orange-800 dark:text-orange-400">Utiliser mes points de colis</p>
            <p className="text-xs text-orange-600/80 dark:text-orange-400/80 mt-1">Solde : {(user as any)?.colisPoints || 30} pts. Économisez 1000 FCFA avec 50 pts.</p>
          </div>
          <button 
            type="button"
            onClick={() => setColisParams({...colisParams, usePoints: !colisParams.usePoints})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${colisParams.usePoints ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${colisParams.usePoints ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

        <button 
          disabled={!colisParams.modePaiement}
          onClick={nextStep}
          className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
            colisParams.modePaiement 
              ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/30' 
              : 'bg-slate-200 dark:bg-[#222222] text-slate-400 dark:text-slate-500 cursor-not-allowed'
          }`}
        >
          Valider et créer le reçu <CheckCircle2 className="w-5 h-5" />
        </button>
    </div>
  );

  const renderStep3Ticket = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div 
        ref={ticketRef}
        className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-6 shadow-2xl relative overflow-hidden transition-colors"
      >
        {/* Déco */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-tr-full blur-2xl"></div>
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <p className="text-xs text-orange-500 font-bold tracking-wider uppercase mb-1">Reçu de Colis</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{generatedTicket?.id}</h3>
          </div>
          <div className="bg-orange-100 dark:bg-orange-500/20 p-2 rounded-xl">
            <Package className="w-6 h-6 text-orange-500" />
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="bg-slate-50 dark:bg-black/50 rounded-xl p-4 border border-slate-200 dark:border-[#2A2A2A]">
            <p className="text-xs text-slate-500 font-medium mb-1">Trajet</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{generatedTicket?.trajet}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-black/50 rounded-xl p-3 border border-slate-200 dark:border-[#2A2A2A]">
              <p className="text-[10px] text-slate-500 font-medium mb-1 uppercase">Destinataire</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{generatedTicket?.destinataire}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{generatedTicket?.tel}</p>
            </div>
            <div className="bg-slate-50 dark:bg-black/50 rounded-xl p-3 border border-slate-200 dark:border-[#2A2A2A]">
              <p className="text-[10px] text-slate-500 font-medium mb-1 uppercase">Taille</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{generatedTicket?.taille}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center relative z-10">
          <div className="bg-white p-3 rounded-2xl shadow-xl">
            <QRCodeBrandEngine value={`https://allogoo.com/verify/${generatedTicket?.id}`} size={160} />
          </div>
        </div>
        <p className="text-center text-xs text-slate-500 mt-4 font-medium relative z-10">
          À présenter au chauffeur lors du dépôt.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={handleDownload}
          className="bg-slate-100 dark:bg-[#1A1A1A] hover:bg-slate-200 dark:hover:bg-[#222222] border border-slate-200 dark:border-[#333333] text-slate-900 dark:text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" /> Enregistrer
        </button>
        <button 
          className="bg-slate-100 dark:bg-[#1A1A1A] hover:bg-slate-200 dark:hover:bg-[#222222] border border-slate-200 dark:border-[#333333] text-slate-900 dark:text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Share2 className="w-4 h-4" /> Partager
        </button>
      </div>

      <button 
        onClick={handleClose}
        className="w-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white py-4 rounded-xl font-bold text-base transition-colors mt-2"
      >
        Fermer
      </button>
    </div>
  );

  return (
    <div className={`fixed inset-0 z-[100] flex justify-center items-end sm:items-center p-0 sm:p-4 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isOpen && !isClosing ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />
      
      <div 
        className={`
          relative w-full sm:w-[500px] bg-white dark:bg-[#0A0A0A] sm:rounded-[32px] rounded-t-[32px] 
          flex flex-col max-h-[90dvh] shadow-2xl border-t sm:border border-slate-200 dark:border-[#2A2A2A]
          transition-all duration-300 ease-out
          ${isOpen && !isClosing ? 'translate-y-0 opacity-100' : 'translate-y-full sm:translate-y-8 sm:opacity-0'}
        `}
      >
        <div className="flex-shrink-0 flex items-center justify-between p-6 pb-4 border-b border-slate-100 dark:border-[#1A1A1A] transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Envoi de Colis</h2>
              {step < 4 && <p className="text-xs font-bold text-orange-500 uppercase tracking-wider">Étape {step} sur 3</p>}
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#1A1A1A] hover:bg-slate-200 dark:hover:bg-[#222222] flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar min-h-[50vh] sm:min-h-0 overscroll-contain">
          {step === 1 && renderStep1Lieux()}
          {step === 2 && renderStep2Details()}
          {step === 3 && renderStep3Paiement()}
          {step === 4 && renderStep3Ticket()}
        </div>
      </div>
    </div>
  );
}

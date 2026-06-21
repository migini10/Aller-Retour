'use client';

import React, { useRef, useEffect, useState } from 'react';
import { QrCode, Wallet, Award, Package, ArrowRight, Sparkles, CarFront, CheckCircle2, Gift, Map, Building2, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useModal } from '../../../components/ModalContext';

const ALL_DESTINATIONS = [
  { id: 'dakar', name: 'Dakar', price: '4000 FCFA', image: '/images/destinations/dakar.jpg' },
  { id: 'touba', name: 'Touba', price: '5000 FCFA', image: '/images/destinations/touba.jpg' },
  { id: 'thies', name: 'Thiès', price: '2500 FCFA', image: '/images/destinations/thies.jpg' },
  { id: 'mbour', name: 'Mbour', price: '3000 FCFA', image: '/images/destinations/mbour.jpg' },
  { id: 'kaolack', name: 'Kaolack', price: '4500 FCFA', image: '/images/destinations/kaolack.jpg' },
  { id: 'saint_louis', name: 'Saint-Louis', price: '6000 FCFA', image: '/images/destinations/saint_louis.jpg' },
];

const getPopularDestinations = (currentCity: string) => {
  if (!currentCity) return ALL_DESTINATIONS;
  const normalizedCity = currentCity.toLowerCase();
  
  let filtered = ALL_DESTINATIONS.filter(d => !normalizedCity.includes(d.name.toLowerCase().replace('è', 'e')));
  
  if (normalizedCity.includes('dakar')) {
    filtered.sort((a, b) => {
      const popular = ['touba', 'thiès', 'mbour'];
      const aIndex = popular.indexOf(a.name.toLowerCase());
      const bIndex = popular.indexOf(b.name.toLowerCase());
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return 0;
    });
  } else if (normalizedCity.includes('touba')) {
    filtered.sort((a, b) => {
      const popular = ['dakar', 'thiès', 'kaolack'];
      const aIndex = popular.indexOf(a.name.toLowerCase());
      const bIndex = popular.indexOf(b.name.toLowerCase());
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return 0;
    });
  }
  return filtered;
};

export default function ClientDashboard() {
  const { openModal, openBookingWizard, openRechargeWizard } = useModal();
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const [currentCity, setCurrentCity] = useState<string | null>(null);
  const [showLiveStatusModal, setShowLiveStatusModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [destinations, setDestinations] = useState(ALL_DESTINATIONS);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      const token = localStorage.getItem('ar_auth_token');
      if (!token) return;
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
        const res = await fetch(`${apiUrl}/v1/wallets/my-balance`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setWalletBalance(data.balance);
        }
      } catch (e) {
        console.error("Erreur solde wallet", e);
      }
    };
    fetchBalance();
  }, []);

  useEffect(() => {
    setMounted(true);
    // 1. Get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // 2. Reverse Geocode with Google Maps
            const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
            if (!apiKey) return;
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
              const addressComponents = data.results[0].address_components;
              const localityObj = addressComponents.find((c: any) => c.types.includes('locality') || c.types.includes('administrative_area_level_2'));
              if (localityObj) {
                const city = localityObj.long_name;
                setCurrentCity(city);
                setDestinations(getPopularDestinations(city));
              }
            }
          } catch (e) {
            console.error("Geocoding error:", e);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        const maxScroll = scrollWidth - clientWidth;
        // Si on est à la fin, on revient au début, sinon on avance d'une carte (env. 320px + gap)
        if (scrollLeft >= maxScroll - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: 336, behavior: 'smooth' });
        }
      }
    }, 6000); // 6 secondes comme sur Flutter
    return () => clearInterval(interval);
  }, []);

  const sections = [
    {
      id: 'colis',
      title: 'Colis',
      description: 'Gérez vos franchises et suivez l\'expédition de vos colis à travers le pays.',
      icon: Package,
      href: '/dashboard/client/colis',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
    {
      id: 'wallet',
      title: 'Wallet',
      description: 'Rechargez via Wave, Orange Money et gérez vos paiements en séquestre.',
      icon: Wallet,
      href: '/dashboard/client/wallet',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      id: 'fidelite',
      title: 'Fidélité',
      description: 'Consultez vos points, débloquez des paliers et obtenez des trajets gratuits.',
      icon: Award,
      href: '/dashboard/client/fidelite',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      id: 'qr-code',
      title: 'QR code',
      description: 'Vos billets actifs, réservations passées et historiques de voyage interurbain.',
      icon: QrCode,
      href: '/dashboard/client/qr-code',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20'
    }
  ];

  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <div className="w-full max-w-7xl px-5 sm:px-8 lg:px-12 pt-6 sm:pt-10 pb-12 space-y-8 animate-fade-in mx-auto">
        
        {/* Header & Wallet Quick Look with Hero Background */}
        <div className="relative -mx-5 sm:-mx-8 lg:-mx-12 sm:rounded-3xl overflow-hidden mb-8 shadow-xl">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img src="/images/hero_client_premium.png" alt="Allogoo Premium Transport" className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/40 dark:from-black/95 dark:via-black/80 dark:to-black/40"></div>
          </div>

          <div className="relative z-10 px-5 sm:px-10 py-8 sm:py-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="max-w-xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-3">Espace Voyageur</h1>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                Bienvenue sur votre tableau de bord. Gérez vos réservations Allo Dakar, recharges Wave/OM et votre fidélité en un seul endroit.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto shrink-0">
              {/* Wallet Card - Transparent avec effet lumineux turquoise (pulsing) */}
              <div className="relative w-full sm:w-auto bg-black/5 border-2 border-white/30 hover:border-white/50 rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all hover:bg-black/10 group overflow-hidden">
                {/* L'effet lumineux turquoise à l'intérieur de la bordure */}
                <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(6,182,212,0.7)] animate-pulse pointer-events-none rounded-2xl mix-blend-screen"></div>
                
                <div className="relative z-10 px-5 py-4 flex items-center justify-between sm:justify-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                    <Wallet className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-300 font-medium mb-0.5">Solde Wallet (XOF)</p>
                    <p className="text-xl font-black text-white">{walletBalance !== null ? walletBalance.toLocaleString('fr-FR') : '---'} <span className="text-sm font-bold text-cyan-400">FCFA</span></p>
                    <Link href="/dashboard/client/wallet" className="text-[11px] text-cyan-400 font-bold hover:text-cyan-300 hover:underline mt-1.5 flex items-center gap-1 w-fit transition-colors">
                      Voir mon compte <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <button onClick={openRechargeWizard} className="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 active:scale-95 text-sm border border-orange-500/50">
                  <Sparkles className="w-4 h-4" /> Recharger via Wave ou OM
                </button>
                <button onClick={() => openBookingWizard('allo-dakar')} className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-900 font-bold px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/20 active:scale-95 text-sm">
                  <CarFront className="w-4 h-4" /> Réserver une voiture
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statut en Direct */}
        <div className="pt-4">
          <button onClick={() => setShowLiveStatusModal(true)} className="w-full text-left bg-gradient-to-br from-green-50 to-white dark:from-[#1E293B] dark:to-[#0F172A] border border-green-200 dark:border-green-500/30 p-5 rounded-3xl shadow-lg dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] flex items-center gap-4 hover:scale-[1.01] transition-transform cursor-pointer">
            <div className="flex items-center gap-4 w-full">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 w-6 h-6"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Colis en transit</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Dakar &rarr; Touba &bull; Arrivée estimée : 14h30</p>
              </div>
              <div className="w-8 h-8 rounded-full border border-green-500/50 bg-white dark:bg-[#0F172A] flex items-center justify-center shrink-0">
                <ArrowRight className="text-green-500 w-4 h-4" />
              </div>
            </div>
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="pt-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-orange-500 rounded-full"></div> 
            Vos Services
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Link 
                  key={section.id} 
                  href={section.href}
                  className={`group bg-gradient-to-br from-white to-slate-50 dark:from-[#1E293B] dark:to-[#0F172A] border-[1.5px] ${section.border} hover:border-opacity-60 p-4 sm:p-8 rounded-3xl transition-all duration-300 shadow-lg dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] flex flex-col h-full relative overflow-hidden`}
                >
                  <Icon className={`absolute -bottom-6 -right-6 w-24 h-24 sm:w-32 sm:h-32 ${section.color} opacity-[0.03] dark:opacity-[0.04] -rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`} />
                  
                  <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${section.bg} ${section.border} border flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative z-10`}>
                    <Icon className={`w-5 h-5 sm:w-7 sm:h-7 ${section.color}`} />
                  </div>
                  <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white mb-2 sm:mb-3 tracking-tight relative z-10">{section.title}</h3>
                  <p className="text-[11px] sm:text-sm text-slate-500 dark:text-slate-400 flex-1 leading-relaxed relative z-10 line-clamp-3 sm:line-clamp-none">{section.description}</p>
                  
                  <div className={`mt-4 sm:mt-8 flex items-center text-[11px] sm:text-sm font-bold ${section.color} transition-colors relative z-10`}>
                    Ouvrir <span className="hidden sm:inline">&nbsp;{section.title}</span> <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Desktop Split Grid: Offres Exclusives & Historique Récent */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
          
          {/* Left Column: Offres Exclusives */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <div className="w-2 h-6 bg-orange-500 rounded-full"></div> 
              Offres Exclusives
            </h2>
            <div ref={carouselRef} className="-mx-5 px-5 overflow-x-auto lg:overflow-x-visible no-scrollbar" style={{ scrollSnapType: 'x mandatory' }}>
              <div className="flex lg:grid lg:grid-cols-2 gap-4 min-w-max lg:min-w-0 pb-4 lg:pb-0">
                {/* Promo 1 */}
                <Link href="/dashboard/parrainage" className="w-80 lg:w-full h-40 rounded-3xl bg-gradient-to-br from-orange-500 to-orange-400 p-6 relative overflow-hidden shadow-lg shadow-orange-500/20 block hover:scale-[1.02] transition-all" style={{ scrollSnapAlign: 'start' }}>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 text-white/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
                  </div>
                  <div className="relative z-10 flex flex-col justify-center h-full">
                    <h3 className="text-white font-bold text-xl mb-1">Parrainez un proche</h3>
                    <p className="text-white/90 text-sm line-clamp-2">Gagnez 1000 FCFA sur votre prochain trajet</p>
                  </div>
                </Link>
                {/* Promo 2 */}
                <Link href="/dashboard/colis" className="w-80 lg:w-full h-40 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-400 p-6 relative overflow-hidden shadow-lg shadow-emerald-500/20 block hover:scale-[1.02] transition-all" style={{ scrollSnapAlign: 'start' }}>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 text-white/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                  </div>
                  <div className="relative z-10 flex flex-col justify-center h-full">
                    <h3 className="text-white font-bold text-xl mb-1">Voyagez Léger</h3>
                    <p className="text-white/90 text-sm line-clamp-2">-10% sur les envois de colis cette semaine</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Historique Récent */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <div className="w-2 h-6 bg-orange-500 rounded-full"></div> 
              Historique Récent
            </h2>
            <div className="flex flex-col bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800/80 p-5 rounded-3xl shadow-lg dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] h-40 justify-between">
              {/* Item 1 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div className="flex-1 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Réservation confirmée</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Dakar - Touba</p>
                  </div>
                  <span className="text-slate-400 text-[10px] font-bold">Il y a 2h</span>
                </div>
              </div>
              
              <div className="w-full h-px bg-slate-100 dark:bg-slate-800/60"></div>

              {/* Item 2 */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Colis livré</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Touba - Dakar</p>
                  </div>
                  <span className="text-slate-400 text-[10px] font-bold">Hier</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Destinations Populaires */}
        <div className="pt-6 pb-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-orange-500 rounded-full"></div> 
            Destinations Populaires
          </h2>
          <div className="-mx-5 px-5 overflow-x-auto lg:overflow-x-visible no-scrollbar">
            <div className="flex lg:grid lg:grid-cols-6 gap-4 pb-4 lg:pb-0">
              {destinations.map((dest) => (
                <div key={dest.id} className="w-36 lg:w-auto h-48 rounded-[20px] relative overflow-hidden shadow-lg p-3 flex flex-col justify-end group shrink-0">
                  <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  <h3 className="text-white font-bold text-lg relative z-10">{dest.name}</h3>
                  <p className="text-white/90 text-xs relative z-10 mt-1">{dest.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Responsive Footer */}
        <footer className="mt-8 pt-6 border-t border-slate-200 dark:border-[#2A2A2A] text-slate-500 dark:text-slate-400 text-xs animate-fade-in pb-2">
          <div className="flex flex-col gap-5">
            
            {/* Top Section: Newsletter & Links */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-5">
              
              {/* Newsletter */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                <span className="font-bold text-slate-900 dark:text-white hidden sm:block whitespace-nowrap">Newsletter</span>
                <div className="flex w-full sm:w-64">
                  <input 
                    type="email" 
                    placeholder="Votre email" 
                    className="px-3 py-2 bg-slate-100 dark:bg-[#222222] rounded-l-lg outline-none flex-1 text-slate-900 dark:text-white border border-transparent focus:border-orange-500 transition-colors" 
                  />
                  <button className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-white font-bold rounded-r-lg transition-colors whitespace-nowrap">
                    OK
                  </button>
                </div>
              </div>

              {/* Links (Visible everywhere) */}
              <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
                <Link href="#" className="hover:text-orange-500 transition-colors font-bold text-slate-700 dark:text-slate-300">Contact</Link>
                <Link href="#" className="hover:text-orange-500 transition-colors">Aide & Support</Link>
                <Link href="#" className="hover:text-orange-500 transition-colors">Confidentialité</Link>
                <Link href="#" className="hover:text-orange-500 transition-colors">Conditions</Link>
              </div>
            </div>

            <div className="w-full h-px bg-slate-200 dark:bg-[#2A2A2A]"></div>

            {/* Bottom Section: Logo, Copyright & Version */}
            <div className="flex flex-row justify-between items-center w-full text-[11px] sm:text-xs">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-black text-slate-900 dark:text-white">Allogoo</span>
                <span>© {new Date().getFullYear()}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span>Version</span> 
                <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-[#222222] rounded font-bold">v1.2.0</span>
              </div>
            </div>

          </div>
        </footer>

      </div>

      {showLiveStatusModal && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-[#141414] animate-in fade-in zoom-in-95 duration-200">
          <div className="flex-none p-4 sm:p-6 border-b border-slate-200 dark:border-[#2A2A2A] flex justify-between items-center bg-white/80 dark:bg-[#141414]/80 backdrop-blur z-20">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Suivi en direct</h2>
              <p className="text-sm font-mono text-slate-500 mt-1">Colis Express</p>
            </div>
            <button onClick={() => setShowLiveStatusModal(false)} className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-[#222222] dark:hover:bg-[#2A2A2A] rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 dark:text-slate-300"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-slate-100 dark:bg-[#1A1A1A]">
              <iframe 
                src="https://maps.google.com/maps?saddr=Dakar,+Senegal&daddr=Touba,+Senegal&output=embed"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 z-0 opacity-90 grayscale-[0.2]"
              ></iframe>
            </div>
            <div className="absolute top-0 left-0 right-0 h-24 z-10" onPointerDownCapture={(e) => e.stopPropagation()} />
            <div className="absolute bottom-0 left-0 right-0 h-16 z-10" onPointerDownCapture={(e) => e.stopPropagation()} />
            <div className="absolute inset-0 bg-[#0a1520]/10 pointer-events-none z-10" />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-20">
              <div className="bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-md p-4 rounded-3xl border border-slate-200/50 dark:border-[#333333]/50 shadow-2xl animate-bounce-slow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-orange-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500 w-6 h-6"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-orange-500 font-bold uppercase tracking-wider mb-0.5">Livraison en cours</p>
                    <h3 className="text-slate-900 dark:text-white font-bold text-base">Ousmane Diop</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Arrivée estimée : 14h30</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

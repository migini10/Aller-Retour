'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Car, MapPin, ArrowRight, Shield, Star, Smartphone, Truck, Users, 
  Sun, Moon, LogIn, ChevronRight, CheckCircle2, Ticket, Wifi, 
  Map, Award, Calendar, Search, Package, Clock
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useModal } from '../components/ModalContext';
import { useAuth } from '../components/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { openBookingWizard, openColisWizard } = useModal();
  const { isAuthenticated, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // States for interactive departure/arrival selection on the Hero
  const [depart, setDepart] = useState('Dakar');
  const [arrivee, setArrivee] = useState('Touba');

  const heroDepartRef = useRef<HTMLInputElement>(null);
  const heroArriveeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const initHeroAutocomplete = () => {
      if (!(window as any).google || !(window as any).google.maps || !(window as any).google.maps.places) return;
      const options = { componentRestrictions: { country: 'sn' }, fields: ['formatted_address'] };

      if (heroDepartRef.current) {
        const autocomplete = new (window as any).google.maps.places.Autocomplete(heroDepartRef.current, options);
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) setDepart(place.formatted_address);
        });
      }
      if (heroArriveeRef.current) {
        const autocomplete = new (window as any).google.maps.places.Autocomplete(heroArriveeRef.current, options);
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) setArrivee(place.formatted_address);
        });
      }
    };

    if (!(window as any).google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initHeroAutocomplete;
      document.head.appendChild(script);
    } else {
      setTimeout(initHeroAutocomplete, 500);
    }
  }, [mounted]);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* 1. Sleek Glassmorphic Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-slate-800/40 bg-white/75 dark:bg-[#0B0F19]/75 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(234,88,12,0.1)]">
              <Car className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Allo<span className="text-orange-500">goo</span>
            </span>
          </Link>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#fonctionnement" className="hover:text-orange-500 dark:hover:text-white transition-colors">Comment ça marche</a>
            <a href="#services" className="hover:text-orange-500 dark:hover:text-white transition-colors">Nos Services</a>
            <a href="#partners" className="hover:text-orange-500 dark:hover:text-white transition-colors">Transporteurs / GIE</a>
            <a href="#testimonials" className="hover:text-orange-500 dark:hover:text-white transition-colors">Témoignages</a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            
            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-white transition-colors"
              aria-label="Changer le thème"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth Button */}
            {isAuthenticated ? (
              <Link 
                href="/dashboard/client" 
                className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-orange-600 dark:hover:bg-orange-500 hover:text-white dark:hover:text-white transition-all transform hover:-translate-y-0.5"
              >
                <span>Mon Espace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/auth/login" 
                  className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-orange-500 dark:hover:text-white transition-colors px-3 py-2"
                >
                  <LogIn className="w-4 h-4" />
                  Connexion
                </Link>
                <Link 
                  href="/auth/register" 
                  className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-orange-600/10 hover:shadow-orange-600/20 transition-all transform hover:-translate-y-0.5"
                >
                  Créer un compte
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-1/10 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Side: Headline & Dynamic Search Box */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-orange-600 dark:text-orange-400 mx-auto lg:mx-0">
                <Award className="w-3.5 h-3.5" />
                <span>Le transport interurbain réinventé</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                Voyagez l'esprit tranquille partout au <span className="text-orange-500">Sénégal</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 font-medium">
                Réservez vos trajets interurbains avec horaires garantis, billets QR Code sécurisés et paiement mobile Wave & Orange Money instantané.
              </p>

              {/* Download Quick Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <a href="#" className="flex items-center gap-2 bg-slate-900 dark:bg-slate-800 hover:bg-orange-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md transform hover:-translate-y-0.5">
                  <Smartphone className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>Télécharger Passager (Android/iOS)</span>
                </a>
                <a href="#" className="flex items-center gap-2 bg-slate-900 dark:bg-slate-800 hover:bg-orange-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md transform hover:-translate-y-0.5">
                  <Smartphone className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>Télécharger Chauffeur (Android)</span>
                </a>
              </div>

              {/* Search Widget */}
              <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl max-w-xl mx-auto lg:mx-0 transition-colors">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  
                  {/* Depart Selector */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
                    <div className="text-left w-full">
                      <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Départ</label>
                      <input 
                        ref={heroDepartRef}
                        type="text" 
                        placeholder="Ex: Dakar"
                        value={depart} 
                        onChange={(e) => setDepart(e.target.value)}
                        className="bg-transparent text-sm font-bold text-slate-800 dark:text-white outline-none w-full border-none focus:ring-0 p-0"
                      />
                    </div>
                  </div>

                  {/* Arrivée Selector */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div className="text-left w-full">
                      <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Arrivée</label>
                      <input 
                        ref={heroArriveeRef}
                        type="text" 
                        placeholder="Ex: Touba"
                        value={arrivee} 
                        onChange={(e) => setArrivee(e.target.value)}
                        className="bg-transparent text-sm font-bold text-slate-800 dark:text-white outline-none w-full border-none focus:ring-0 p-0"
                      />
                    </div>
                  </div>

                </div>

                {/* Primary CTA */}
                <button 
                  onClick={() => {
                    localStorage.setItem('ar_search_depart', depart);
                    localStorage.setItem('ar_search_arrivee', arrivee);
                    openBookingWizard('allo-dakar');
                  }}
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] shadow-lg shadow-orange-600/20"
                >
                  <Search className="w-5 h-5" />
                  <span>Rechercher un trajet</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Float Features Summary */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Validation par code unique</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Billet QR sécurisé</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Service client 24/7</span>
              </div>

            </div>

            {/* Right Side: Visual Mockup Showcase */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative mx-auto w-full max-w-[380px] h-[520px] rounded-[48px] border-[10px] border-slate-900 bg-slate-900 shadow-2xl overflow-hidden">
                {/* Phone Speaker & Camera Bar */}
                <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 z-30 flex items-center justify-center">
                  <div className="w-24 h-4 rounded-full bg-black"></div>
                </div>

                {/* Phone Screen Mock */}
                <div className="w-full h-full bg-slate-100 dark:bg-[#0B0F19] p-5 pt-8 flex flex-col justify-between relative">
                  
                  {/* Mock App Header */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[#00437A] dark:text-white font-black text-xs flex items-center">
                      <Car className="w-4 h-4 mr-1 text-orange-500" />
                      Allô<span className="text-orange-500">Dakar</span>
                    </span>
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  </div>

                  {/* Mock Ticket Card */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-lg space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Billet Actif</p>
                        <p className="text-xs font-black text-slate-900 dark:text-white">DK-TB-0254</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">Validé</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs font-black text-slate-800 dark:text-white">Dakar Gpt</p>
                        <p className="text-[10px] text-slate-400">14:30</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] text-slate-400">Direct</span>
                        <div className="w-16 h-0.5 bg-orange-300 dark:bg-orange-800 relative my-1">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full absolute -top-0.5 left-1/2 -translate-x-1/2"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-slate-800 dark:text-white">Touba Gare</p>
                        <p className="text-[10px] text-slate-400">17:15</p>
                      </div>
                    </div>

                    {/* QR Code Placeholder */}
                    <div className="w-32 h-32 bg-slate-100 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl mx-auto flex items-center justify-center">
                      <div className="text-center p-2">
                        <div className="grid grid-cols-4 gap-1 w-12 h-12 mx-auto mb-1">
                          {[...Array(16)].map((_, i) => (
                            <div key={i} className={`w-2 h-2 ${i % 3 === 0 ? 'bg-slate-900 dark:bg-white' : 'bg-transparent'}`}></div>
                          ))}
                        </div>
                        <span className="text-[8px] font-bold text-slate-400">Scanner à la montée</span>
                      </div>
                    </div>
                  </div>

                  {/* Mock Bottom Navigation */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-2.5 flex justify-around items-center">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500"><Car className="w-4 h-4" /></div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400"><Package className="w-4 h-4" /></div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400"><Users className="w-4 h-4" /></div>
                  </div>

                </div>

                {/* Floating Widget 1 */}
                <div className="absolute top-12 -left-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xl flex items-center gap-3 transition-transform hover:scale-105 duration-300">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500"><Users className="w-5 h-5" /></div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Voyageurs</p>
                    <p className="text-xs font-extrabold text-slate-800 dark:text-white">50k+ Actifs</p>
                  </div>
                </div>

                {/* Floating Widget 2 */}
                <div className="absolute bottom-20 -right-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xl flex items-center gap-3 transition-transform hover:scale-105 duration-300">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Shield className="w-5 h-5" /></div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Sécurité</p>
                    <p className="text-xs font-extrabold text-slate-800 dark:text-white">Billet Garanti</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Statistiques Clés Section */}
      <section className="py-12 bg-slate-100/50 dark:bg-slate-950/40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { val: "50 000+", label: "Voyages réservés", desc: "Dans tout le Sénégal" },
              { val: "98%", label: "Taux de ponctualité", desc: "Mesuré en temps réel" },
              { val: "150+", label: "Chauffeurs vérifiés", desc: "Sélectionnés avec soin" },
              { val: "100%", label: "Paiements sécurisés", desc: "Wave & OM certifiés" }
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-white dark:bg-[#111622] rounded-3xl border border-slate-200/60 dark:border-slate-800/40 shadow-sm transition-transform hover:-translate-y-1">
                <p className="text-3xl sm:text-4xl font-black text-orange-500">{stat.val}</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white mt-2">{stat.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. "Comment ça marche" Section */}
      <section id="fonctionnement" className="py-24 bg-white dark:bg-slate-900/30 border-y border-slate-200/50 dark:border-slate-800/40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-3">Fonctionnement</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Réservez en 3 étapes simples</p>
            <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium">Nous numérisons le voyage en GIE et transporteur pour vous offrir le confort moderne.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-8 relative hover:border-orange-500/30 transition-colors group">
              <span className="absolute top-6 right-8 text-6xl font-black text-slate-200 dark:text-slate-800/60 select-none group-hover:text-orange-500/10 transition-colors">01</span>
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Recherchez & Comparez</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Indiquez votre ville de départ et de destination. Comparez les horaires et tarifs des transporteurs et GIE partenaires.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-8 relative hover:border-orange-500/30 transition-colors group">
              <span className="absolute top-6 right-8 text-6xl font-black text-slate-200 dark:text-slate-800/60 select-none group-hover:text-orange-500/10 transition-colors">02</span>
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Ticket className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Payez en Mobile Money</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Réglez instantanément avec Wave ou Orange Money. Recevez immédiatement votre billet sous forme de QR Code par email et SMS.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-8 relative hover:border-orange-500/30 transition-colors group">
              <span className="absolute top-6 right-8 text-6xl font-black text-slate-200 dark:text-slate-800/60 select-none group-hover:text-orange-500/10 transition-colors">03</span>
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Scannez & Partez</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Présentez votre QR Code au chauffeur ou au guichet lors de la montée. Le chauffeur scanne et valide votre présence. Bon voyage !
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Our Services Section */}
      <section id="services" className="py-24 bg-slate-50 dark:bg-[#0B0F19] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-3">Nos Services</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Bien plus qu'un simple ticket de bus</p>
            <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium">Découvrez notre gamme complète de services conçus pour faciliter votre mobilité interurbaine.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Service 1: Voyage Voyageur */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500"><Car className="w-6 h-6" /></div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Allo Dakar & GIE</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                  Réservez vos places à bord de véhicules confortables (minibus, berlines) de transporteurs professionnels et GIE affiliés.
                </p>
              </div>
              <button 
                onClick={() => openBookingWizard('allo-dakar')}
                className="mt-6 flex items-center gap-1 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors"
              >
                <span>Réserver un trajet</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Service 2: Livraison de Colis */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500"><Package className="w-6 h-6" /></div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Envoi de Colis Sécurisé</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                  Expédiez vos colis d'une ville à une autre. Code unique de livraison requis à la réception pour garantir une sécurité totale.
                </p>
              </div>
              <button 
                onClick={() => openColisWizard()}
                className="mt-6 flex items-center gap-1 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors"
              >
                <span>Envoyer un colis</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Service 3: Conducteurs professionnels */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500"><Users className="w-6 h-6" /></div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Espace Conducteurs</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                  Chauffeurs indépendants ou affiliés : accédez à une plateforme moderne pour gérer vos départs, valider les passagers et encaisser vos gains.
                </p>
              </div>
              <Link 
                href="/dashboard/driver"
                className="mt-6 flex items-center gap-1 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors"
              >
                <span>Accéder à l'espace chauffeur</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* Destinations Populaires Section */}
      <section className="py-24 bg-slate-50 dark:bg-[#0B0F19] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-3">Destinations Populaires</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Liaisons les plus fréquentées</p>
            <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium">Réservez vos places instantanément sur nos trajets réguliers à prix fixes garantis.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { from: "Dakar", to: "Touba", price: "5 000 FCFA", time: "2h 30m", road: "Via Autoroute", desc: "Départs réguliers toutes les heures en voitures climatisées." },
              { from: "Dakar", to: "Saint-Louis", price: "7 000 FCFA", time: "4h 00m", road: "Via Nationale", desc: "Voyagez en toute sérénité vers la capitale du nord." },
              { from: "Dakar", to: "Mbour", price: "3 000 FCFA", time: "1h 15m", road: "Via Autoroute", desc: "Idéal pour vos week-ends sur la Petite Côte." },
              { from: "Thiès", to: "Dakar", price: "2 000 FCFA", time: "1h 00m", road: "Via Autoroute", desc: "Navettes quotidiennes rapides pour les travailleurs." }
            ].map((dest, i) => (
              <div key={i} className="bg-white dark:bg-[#111622] border border-slate-200/80 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-orange-500/30 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold px-2 py-1 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20">{dest.road}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium"><Clock className="w-3.5 h-3.5" /> {dest.time}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                    {dest.from} <ArrowRight className="w-4 h-4 text-orange-500" /> {dest.to}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{dest.desc}</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">À partir de</p>
                    <p className="text-base font-black text-orange-500">{dest.price}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setDepart(dest.from);
                      setArrivee(dest.to);
                      openBookingWizard('allo-dakar');
                    }}
                    className="w-8 h-8 rounded-lg bg-orange-500/10 hover:bg-orange-500 text-orange-500 hover:text-white flex items-center justify-center transition-all group-hover:scale-105 duration-300"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. GIE / Partners Banner Split */}
      <section id="partners" className="py-24 bg-white dark:bg-slate-900/30 border-y border-slate-200/50 dark:border-slate-800/40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-[32px] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
            {/* Design accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px]"></div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-6">
                <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Partenariat GIE & Transporteurs</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  Vous êtes un transporteur ou un gestionnaire de GIE ?
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Numérisez votre flotte de véhicules, gérez vos gares routières en temps réel, optimisez le taux de remplissage de vos voitures et sécurisez vos transactions financières.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-slate-300 font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                    <span>Tableau de bord de gestion complet</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300 font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                    <span>Reversements bancaires automatisés</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300 font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                    <span>Suivi GPS et scanner passagers embarqués</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Link 
                    href="/auth/register" 
                    className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-6 py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-orange-600/10 transition-colors"
                  >
                    <span>Créer un compte Partenaire</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500"><Truck className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-extrabold text-white text-base">Allogoo Pro</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Système de gestion de flotte</p>
                  </div>
                </div>
                
                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800/80">
                    <p className="text-2xl font-black text-orange-500">98%</p>
                    <p className="text-[10px] text-slate-400 mt-1">Taux de ponctualité garanti</p>
                  </div>
                  <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800/80">
                    <p className="text-2xl font-black text-orange-500">1.2M</p>
                    <p className="text-[10px] text-slate-400 mt-1">Kilomètres parcourus</p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed italic">
                  "Depuis que nous utilisons Allogoo pour le GIE de Dakar, nous avons réduit de 40% l'attente en gare routière et éliminé la fraude sur les billets."
                </p>
                <div className="flex items-center gap-3 border-t border-slate-800 pt-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 text-xs font-bold">MD</div>
                  <div>
                    <p className="text-xs font-bold text-white">Moustapha Diop</p>
                    <p className="text-[9px] text-slate-500">Secrétaire Général - GIE Transport Dakar</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6.5 Apps Download Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-[#0B0F19] dark:to-slate-950 border-t border-slate-200/50 dark:border-slate-800/40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Text & Badges */}
            <div className="space-y-6 text-center lg:text-left">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest font-mono">Applications Mobiles Allogoo</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Emportez Allogoo dans votre poche
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xl mx-auto lg:mx-0">
                Que vous soyez passager ou chauffeur, profitez d'une expérience optimisée, rapide et fluide directement sur votre smartphone Android ou iOS.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-4">
                {/* Passenger app card */}
                <div className="bg-white dark:bg-[#111622] border border-slate-200/60 dark:border-slate-800/40 p-6 rounded-3xl text-left shadow-sm flex flex-col justify-between max-w-xs mx-auto sm:mx-0 w-full">
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Allogoo Passager</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Réservez vos voyages et expédiez vos colis en quelques clics.</p>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <a href="#" className="flex-1 bg-slate-900 dark:bg-slate-800 hover:bg-orange-500 text-white p-2.5 rounded-xl text-center text-xs font-bold transition-all transform hover:-translate-y-0.5">Google Play</a>
                    <a href="#" className="flex-1 bg-slate-900 dark:bg-slate-800 hover:bg-orange-500 text-white p-2.5 rounded-xl text-center text-xs font-bold transition-all transform hover:-translate-y-0.5">App Store</a>
                  </div>
                </div>

                {/* Driver app card */}
                <div className="bg-white dark:bg-[#111622] border border-slate-200/60 dark:border-slate-800/40 p-6 rounded-3xl text-left shadow-sm flex flex-col justify-between max-w-xs mx-auto sm:mx-0 w-full">
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Allogoo Conducteur</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gérez votre flotte, validez vos passagers et encaissez vos revenus.</p>
                  </div>
                  <div className="flex gap-2 mt-6">
                    <a href="#" className="flex-1 bg-slate-900 dark:bg-slate-800 hover:bg-orange-500 text-white p-2.5 rounded-xl text-center text-xs font-bold transition-all transform hover:-translate-y-0.5">Google Play</a>
                    <a href="#" className="flex-1 bg-slate-900 dark:bg-slate-800 hover:bg-orange-500 text-white p-2.5 rounded-xl text-center text-xs font-bold transition-all transform hover:-translate-y-0.5">App Store</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Phone Illustrations */}
            <div className="relative justify-center hidden lg:flex">
              <div className="relative w-80 h-[480px] rounded-[36px] border-[8px] border-slate-900 bg-slate-900 shadow-2xl overflow-hidden transform rotate-3">
                <div className="absolute top-0 inset-x-0 h-4 bg-slate-900 z-30 flex items-center justify-center">
                  <div className="w-16 h-2 rounded-full bg-black"></div>
                </div>
                <div className="w-full h-full bg-[#0B0F19] p-4 pt-6 flex flex-col justify-between text-white">
                  <div className="text-center mt-4 space-y-2">
                    <p className="text-xs font-bold text-orange-500">Allogoo Passager</p>
                    <p className="text-sm font-black">Réservez en 1 clic</p>
                  </div>
                  <div className="w-48 h-48 bg-orange-500/10 border border-orange-500/20 rounded-full blur-2xl mx-auto"></div>
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-xs space-y-2 mb-2 text-left">
                    <div className="flex justify-between font-bold"><span>Dakar ➔ Touba</span><span className="text-orange-500">5 000 F</span></div>
                    <p className="text-[10px] text-slate-500">Départ aujourd'hui à 14:30</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-12 left-12 w-80 h-[480px] rounded-[36px] border-[8px] border-slate-900 bg-slate-900 shadow-2xl overflow-hidden transform -rotate-3 z-10">
                <div className="absolute top-0 inset-x-0 h-4 bg-slate-900 z-30 flex items-center justify-center">
                  <div className="w-16 h-2 rounded-full bg-black"></div>
                </div>
                <div className="w-full h-full bg-white p-4 pt-6 flex flex-col justify-between text-slate-900">
                  <div className="text-center mt-4 space-y-2">
                    <p className="text-xs font-bold text-orange-500">Allogoo Conducteur</p>
                    <p className="text-sm font-black">Validez les passagers</p>
                  </div>
                  <div className="w-32 h-32 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto"><QrCode className="w-16 h-16 text-orange-500" /></div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-[10px] text-center font-bold text-emerald-500 mb-2">Chauffeur en ligne</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section id="testimonials" className="py-24 bg-slate-50 dark:bg-[#0B0F19] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-3">Témoignages</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Ce qu'en disent nos voyageurs</p>
            <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium">Des milliers d'utilisateurs font confiance à Allogoo chaque jour pour leurs trajets et envois.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="flex gap-1 text-orange-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-orange-500" />)}
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                "Super service ! J'ai pu réserver ma place Dakar-Touba directement depuis mon canapé et payer par Wave. Pas d'attente stressante à la gare routière."
              </p>
              <div className="flex items-center gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-600/20 flex items-center justify-center text-orange-500 font-bold text-sm">AS</div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Aminata Sall</p>
                  <p className="text-[10px] text-slate-400">Voyageuse régulière</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="flex gap-1 text-orange-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-orange-500" />)}
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                "J'utilise Aller-Retour pour envoyer des colis à ma famille à Saint-Louis. Le code de livraison sécurisé par SMS évite tout vol ou erreur de destinataire. Je recommande."
              </p>
              <div className="flex items-center gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-600/20 flex items-center justify-center text-orange-500 font-bold text-sm">OD</div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Ousmane Diallo</p>
                  <p className="text-[10px] text-slate-400">Commerçant indépendant</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 space-y-4 hover:shadow-lg transition-shadow">
              <div className="flex gap-1 text-orange-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-orange-500" />)}
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                "En tant que chauffeur de GIE, cette application m'a permis de mieux remplir ma voiture et d'éviter les négociations de prix fatigantes. Tout est enregistré et transparent."
              </p>
              <div className="flex items-center gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-600/20 flex items-center justify-center text-orange-500 font-bold text-sm">IB</div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Ibrahima Beye</p>
                  <p className="text-[10px] text-slate-400">Conducteur GIE</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white dark:bg-[#0B0F19]/30 border-t border-slate-200/50 dark:border-slate-800/40 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-3">FAQ</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Questions fréquentes</p>
            <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium">Tout ce que vous devez savoir pour voyager l'esprit tranquille.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Comment fonctionne le paiement par Wave ou Orange Money ?",
                a: "Lors de la finalisation de votre réservation ou de l'envoi d'un colis, vous sélectionnez votre opérateur (Wave ou OM). Vous recevez alors une invite de paiement sécurisée sur votre téléphone pour valider la transaction instantanément. Vos fonds restent en sécurité jusqu'à la fin du trajet."
              },
              {
                q: "Mon billet est-il modifiable ou remboursable ?",
                a: "Oui, vous pouvez annuler ou modifier votre réservation gratuitement jusqu'à 2 heures avant le départ prévu directement depuis votre Espace Client. Passé ce délai, veuillez contacter directement le chauffeur."
              },
              {
                q: "Comment le chauffeur valide-t-il la montée ?",
                a: "Chaque passager reçoit un billet électronique contenant un QR Code unique et sécurisé. À la montée, le chauffeur scanne votre QR Code avec son application mobile Allogoo Driver pour valider votre présence en temps réel."
              },
              {
                q: "Puis-je envoyer un colis sans voyager moi-même ?",
                a: "Absolument ! Notre service d'envoi de colis vous permet de confier vos paquets à un chauffeur effectuant le trajet. Le destinataire recevra un code de sécurité unique par SMS, indispensable pour retirer le colis."
              }
            ].map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50 dark:bg-[#111622] border border-slate-200 dark:border-slate-800/60 rounded-2xl overflow-hidden transition-colors"
              >
                <button 
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-slate-900 dark:text-white text-base hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaqIndex === idx ? 'rotate-90 text-orange-500' : ''}`} />
                </button>
                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    openFaqIndex === idx ? 'max-h-40 border-t border-slate-200/50 dark:border-slate-800/40 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}
                >
                  <p className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed bg-[#F8FAFC]/50 dark:bg-[#0B0F19]/25">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            
            {/* Column 1: Brand */}
            <div className="col-span-2 md:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <Car className="w-4 h-4 text-orange-500" />
                </div>
                <span className="text-lg font-black text-white">Allogoo</span>
              </div>
              <p className="text-xs leading-relaxed">
                La plateforme technologique panafricaine qui modernise le transport interurbain et la logistique.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigation</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#fonctionnement" className="hover:text-white transition-colors">Comment ça marche</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Services voyageurs</a></li>
                <li><a href="#partners" className="hover:text-white transition-colors">Devenir chauffeur</a></li>
                <li><a href="#partners" className="hover:text-white transition-colors">Espace GIE / Flottes</a></li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Mentions Légales</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Conditions générales d'utilisation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Politique des cookies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Garanties de sécurité</a></li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact & Support</h4>
              <ul className="space-y-2 text-xs">
                <li>Email : support@allogoo.sn</li>
                <li>Téléphone : +221 33 800 00 00</li>
                <li>Dakar, Sénégal</li>
              </ul>
            </div>

          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <p>&copy; {new Date().getFullYear()} Allogoo. Tous droits réservés.</p>
            <p className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-orange-500" />
              <span>Disponible sur Android & iOS</span>
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}

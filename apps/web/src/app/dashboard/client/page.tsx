'use client';

import React, { useRef, useEffect } from 'react';
import { QrCode, Wallet, Award, Package, ArrowRight, Sparkles, CarFront, CheckCircle2, Gift, Map, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useModal } from '../../../components/ModalContext';

export default function ClientDashboard() {
  const { openModal, openBookingWizard, openRechargeWizard } = useModal();
  const carouselRef = useRef<HTMLDivElement>(null);

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
      <div className="w-full max-w-7xl px-5 sm:px-8 lg:px-12 pt-24 pb-12 space-y-8 animate-fade-in mx-auto">
        
        {/* Header & Wallet Quick Look with Hero Background */}
        <div className="relative rounded-3xl overflow-hidden mb-8 shadow-xl">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img src="/images/peugeot_406_hero.png" alt="Peugeot 406 sur autoroute" className="w-full h-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/40 dark:from-black/95 dark:via-black/80 dark:to-black/40"></div>
          </div>

          <div className="relative z-10 p-6 sm:p-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="max-w-xl">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">Espace Voyageur</h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Bienvenue sur votre tableau de bord. Gérez vos QR codes, recharges Wave/OM et votre fidélité en un seul endroit.
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
                    <p className="text-xl font-black text-white">45 000 <span className="text-sm font-bold text-cyan-400">FCFA</span></p>
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
          <div className="bg-gradient-to-br from-green-50 to-white dark:from-[#1E293B] dark:to-[#0F172A] border border-green-200 dark:border-green-500/30 p-5 rounded-3xl shadow-lg dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] flex items-center gap-4">
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
        </div>

        {/* Dashboard Grid */}
        <div className="pt-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-orange-500 rounded-full"></div> 
            Vos Services
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
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

        {/* Aperçu de l'activité (added to sync with Flutter) */}
        <div className="pt-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-orange-500 rounded-full"></div> 
            Aperçu de l'activité
          </h2>
          <div className="flex flex-col gap-4">
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Award className="text-orange-500 w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white">Points Cumulés</h3>
              </div>
              <div className="bg-slate-100 dark:bg-[#0F172A] px-4 py-2 rounded-xl">
                <span className="font-bold text-slate-900 dark:text-white">X</span>
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <QrCode className="text-blue-500 w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white">Dernier Billet</h3>
              </div>
              <div className="bg-slate-100 dark:bg-[#0F172A] px-4 py-2 rounded-xl">
                <span className="font-bold text-slate-900 dark:text-white">X</span>
              </div>
            </div>
            
            <div className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Package className="text-purple-500 w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white">Dernier Colis</h3>
              </div>
              <div className="bg-slate-100 dark:bg-[#0F172A] px-4 py-2 rounded-xl">
                <span className="font-bold text-slate-900 dark:text-white">X</span>
              </div>
            </div>
          </div>
        </div>

        {/* Offres Exclusives */}
        <div className="pt-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-orange-500 rounded-full"></div> 
            Offres Exclusives
          </h2>
          <div ref={carouselRef} className="-mx-5 px-5 overflow-x-auto no-scrollbar" style={{ scrollSnapType: 'x mandatory' }}>
            <div className="flex gap-4 min-w-max pb-4">
              {/* Promo 1 */}
              <div className="w-80 h-40 rounded-3xl bg-gradient-to-br from-orange-500 to-orange-400 p-6 relative overflow-hidden shadow-lg shadow-orange-500/20" style={{ scrollSnapAlign: 'start' }}>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 text-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
                </div>
                <div className="relative z-10 flex flex-col justify-center h-full">
                  <h3 className="text-white font-bold text-xl mb-1">Parrainez un proche</h3>
                  <p className="text-white/90 text-sm line-clamp-2">Gagnez 2000 FCFA sur votre prochain trajet</p>
                </div>
              </div>
              {/* Promo 2 */}
              <div className="w-80 h-40 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-400 p-6 relative overflow-hidden shadow-lg shadow-emerald-500/20" style={{ scrollSnapAlign: 'start' }}>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 text-white/20">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                </div>
                <div className="relative z-10 flex flex-col justify-center h-full">
                  <h3 className="text-white font-bold text-xl mb-1">Voyagez Léger</h3>
                  <p className="text-white/90 text-sm line-clamp-2">-10% sur les envois de colis cette semaine</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Historique Récent */}
        <div className="pt-8">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="w-2 h-6 bg-orange-500 rounded-full"></div> 
              Historique Récent
            </h2>
          </div>
          <div className="flex flex-col">
            {/* Item 1 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div className="w-[2px] h-10 bg-slate-200 dark:bg-slate-800 my-1"></div>
              </div>
              <div className="flex-1 pb-4 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Réservation confirmée</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Dakar - Touba</p>
                </div>
                <span className="text-slate-400 text-xs font-bold">Il y a 2h</span>
              </div>
            </div>
            {/* Item 2 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4 text-blue-500" />
                </div>
              </div>
              <div className="flex-1 pb-4 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Colis livré</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Touba - Dakar</p>
                </div>
                <span className="text-slate-400 text-xs font-bold">Hier</span>
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
          <div className="-mx-5 px-5 overflow-x-auto no-scrollbar">
            <div className="flex gap-4 min-w-max pb-4">
              {/* Dakar */}
              <div className="w-36 h-48 rounded-[20px] relative overflow-hidden shadow-lg p-3 flex flex-col justify-end group">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/African_Renaissance_Monument_%285502494604%29.jpg/960px-African_Renaissance_Monument_%285502494604%29.jpg" alt="Dakar" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <h3 className="text-white font-bold text-lg relative z-10">Dakar</h3>
                <p className="text-white/90 text-xs relative z-10 mt-1">4000 FCFA</p>
              </div>
              {/* Touba */}
              <div className="w-36 h-48 rounded-[20px] relative overflow-hidden shadow-lg p-3 flex flex-col justify-end group">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/La_grande_mosqu%C3%A9e_de_Touba.jpg/960px-La_grande_mosqu%C3%A9e_de_Touba.jpg" alt="Touba" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <h3 className="text-white font-bold text-lg relative z-10">Touba</h3>
                <p className="text-white/90 text-xs relative z-10 mt-1">5000 FCFA</p>
              </div>
              {/* Thiès */}
              <div className="w-36 h-48 rounded-[20px] relative overflow-hidden shadow-lg p-3 flex flex-col justify-end group">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Thi%C3%A8sCarrefour.JPG/960px-Thi%C3%A8sCarrefour.JPG" alt="Thiès" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <h3 className="text-white font-bold text-lg relative z-10">Thiès</h3>
                <p className="text-white/90 text-xs relative z-10 mt-1">2500 FCFA</p>
              </div>
              {/* Mbour */}
              <div className="w-36 h-48 rounded-[20px] relative overflow-hidden shadow-lg p-3 flex flex-col justify-end group">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/M%27bour_harbor.jpeg/960px-M%27bour_harbor.jpeg" alt="Mbour" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <h3 className="text-white font-bold text-lg relative z-10">Mbour</h3>
                <p className="text-white/90 text-xs relative z-10 mt-1">3000 FCFA</p>
              </div>
              {/* Kaolack */}
              <div className="w-36 h-48 rounded-[20px] relative overflow-hidden shadow-lg p-3 flex flex-col justify-end group">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/KaolackCommerce.JPG/960px-KaolackCommerce.JPG" alt="Kaolack" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <h3 className="text-white font-bold text-lg relative z-10">Kaolack</h3>
                <p className="text-white/90 text-xs relative z-10 mt-1">4500 FCFA</p>
              </div>
              {/* Saint-Louis */}
              <div className="w-36 h-48 rounded-[20px] relative overflow-hidden shadow-lg p-3 flex flex-col justify-end group">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Saintlouis_pont_Faidherbe.jpg/960px-Saintlouis_pont_Faidherbe.jpg" alt="Saint-Louis" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <h3 className="text-white font-bold text-lg relative z-10">Saint-Louis</h3>
                <p className="text-white/90 text-xs relative z-10 mt-1">6000 FCFA</p>
              </div>
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
                <span className="font-black text-slate-900 dark:text-white">Aller-Retour</span>
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
    </div>
  );
}

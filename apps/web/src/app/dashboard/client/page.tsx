'use client';

import React from 'react';
import { QrCode, Wallet, Award, Package, ArrowRight, Sparkles, CarFront } from 'lucide-react';
import Link from 'next/link';
import { useModal } from '../../../components/ModalContext';

export default function ClientDashboard() {
  const { openModal, openBookingWizard, openRechargeWizard } = useModal();

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
    <div className="h-full min-w-0 overflow-y-auto overscroll-contain scrollbar-hide flex flex-col items-center">
      <div className="w-full max-w-7xl px-5 sm:px-8 lg:px-12 py-8 pb-8 space-y-8 animate-fade-in mx-auto">
        
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

        {/* Dashboard Grid */}
        <div className="pt-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-orange-500 rounded-full"></div> 
            Vos Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Link 
                  key={section.id} 
                  href={section.href}
                  className={`group bg-gradient-to-br from-white to-slate-50 dark:from-[#1E293B] dark:to-[#0F172A] border-[1.5px] ${section.border} hover:border-opacity-60 p-6 sm:p-8 rounded-3xl transition-all duration-300 shadow-lg dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] flex flex-col h-full relative overflow-hidden`}
                >
                  <Icon className={`absolute -bottom-6 -right-6 w-32 h-32 ${section.color} opacity-[0.03] dark:opacity-[0.04] -rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`} />
                  
                  <div className={`w-14 h-14 rounded-2xl ${section.bg} ${section.border} border flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative z-10`}>
                    <Icon className={`w-7 h-7 ${section.color}`} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 tracking-tight relative z-10">{section.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex-1 leading-relaxed relative z-10">{section.description}</p>
                  
                  <div className={`mt-8 flex items-center text-sm font-bold ${section.color} transition-colors relative z-10`}>
                    Ouvrir {section.title} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
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

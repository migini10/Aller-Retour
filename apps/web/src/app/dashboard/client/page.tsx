'use client';

import React from 'react';
import { QrCode, Wallet, Award, Package, ArrowRight, Sparkles, CarFront } from 'lucide-react';
import Link from 'next/link';
import { useModal } from '../../../components/ModalContext';

export default function ClientDashboard() {
  const { openModal, openBookingWizard, openRechargeWizard } = useModal();

  const sections = [
    {
      id: 'qr-code',
      title: 'QR code',
      description: 'Vos billets actifs, réservations passées et historiques de voyage interurbain.',
      icon: QrCode,
      href: '/dashboard/client/qr-code',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20'
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
      id: 'colis',
      title: 'Colis',
      description: 'Gérez vos franchises et suivez l\'expédition de vos colis à travers le pays.',
      icon: Package,
      href: '/dashboard/client/colis',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    }
  ];

  return (
    <div className="h-full min-w-0 overflow-y-auto overscroll-contain scrollbar-hide flex flex-col items-center">
      <div className="w-full max-w-[1600px] px-5 sm:px-8 lg:px-12 py-8 pb-24 space-y-8 animate-fade-in">
        
        {/* Header & Wallet Quick Look */}
        <div className="pb-8 border-b border-slate-200 dark:border-[#2A2A2A] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">Espace Voyageur</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-xl">
              Bienvenue sur votre tableau de bord. Gérez vos QR codes, recharges Wave/OM et votre fidélité en un seul endroit.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            <div className="w-full sm:w-auto bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] px-5 py-3.5 rounded-2xl flex items-center justify-between sm:justify-start gap-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/20">
                <Wallet className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-0.5">Solde Wallet (XOF)</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">45 000 <span className="text-sm font-bold text-slate-500">FCFA</span></p>
                <Link href="/dashboard/client/wallet" className="text-[11px] text-orange-600 dark:text-orange-500 font-bold hover:underline mt-1.5 flex items-center gap-1 w-fit">
                  Voir l'historique <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <button onClick={openRechargeWizard} className="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 active:scale-95 text-sm">
                <Sparkles className="w-4 h-4" /> Recharger via Wave ou OM
              </button>
              <button onClick={() => openBookingWizard('allo-dakar')} className="w-full sm:w-auto bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 active:scale-95 text-sm">
                <CarFront className="w-4 h-4" /> Réserver une voiture
              </button>
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
                  className="group bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] hover:border-orange-500/50 dark:hover:border-orange-500/50 p-6 sm:p-8 rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 flex flex-col h-full relative overflow-hidden"
                >
                  <div className={`absolute -right-6 -top-6 w-24 h-24 ${section.bg} rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                  
                  <div className={`w-14 h-14 rounded-2xl ${section.bg} ${section.border} border flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative z-10`}>
                    <Icon className={`w-7 h-7 ${section.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-orange-500 transition-colors relative z-10">{section.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex-1 leading-relaxed relative z-10">{section.description}</p>
                  
                  <div className="mt-8 flex items-center text-sm font-bold text-slate-400 group-hover:text-orange-500 transition-colors relative z-10">
                    Ouvrir {section.title} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { CarFront, Ticket, Sun, Moon } from 'lucide-react';
import { BrandingProvider } from '../../components/BrandingContext';
import { useModal } from '../../components/ModalContext';
import { useTheme } from 'next-themes';


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { openBookingWizard } = useModal();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSuperAdmin = pathname.startsWith('/dashboard/admin');

  // Fermer la sidebar automatiquement à chaque changement de page (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (pathname.startsWith('/dashboard/traveller')) {
    return (
      <BrandingProvider>
        <div className="h-[100dvh] overflow-hidden bg-slate-50 flex flex-col text-slate-900">
          <main className="flex-1 min-w-0 flex flex-col h-full relative">
            {children}
          </main>
        </div>
      </BrandingProvider>
    );
  }

  const getLogoLink = () => {
    if (pathname.startsWith('/dashboard/client')) return '/dashboard/client';
    if (pathname.startsWith('/dashboard/carrier')) return '/dashboard/carrier';
    if (pathname.startsWith('/dashboard/station')) return '/dashboard/station';
    if (pathname.startsWith('/dashboard/admin')) return '/dashboard/admin';
    if (pathname.startsWith('/dashboard/driver')) return '/dashboard/driver';
    if (pathname.startsWith('/dashboard/dispatcher')) return '/dashboard/dispatcher';
    return '/';
  };

  return (
    <BrandingProvider>
      <div className="h-[100dvh] overflow-hidden bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      {/* Topbar Fixe (Mobile & Desktop) */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-slate-200 dark:border-[#2A2A2A]/80 flex items-center justify-between px-5 shadow-md transition-colors duration-300">
        <Link href={getLogoLink()} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-600/20 border border-orange-200 dark:border-orange-500/30 flex items-center justify-center transition-colors">
            <CarFront className="w-4 h-4 text-orange-500" />
          </div>
          <span className="text-base font-bold text-slate-900 dark:text-white transition-colors">
            Aller<span className="text-orange-500">Retour</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {!isSuperAdmin && (
            <button
              onClick={() => openBookingWizard('allo-dakar')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-colors"
            >
              <CarFront className="w-3.5 h-3.5" />
              Allo Dakar
            </button>
          )}
          {mounted && (
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-orange-500 dark:hover:text-white transition-colors"
              aria-label="Changer le thème"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl border border-orange-200 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/10 text-orange-500 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-600 hover:text-orange-600 dark:hover:text-white transition-colors"
            aria-label="Ouvrir le menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Overlay sombre sur mobile quand la sidebar est ouverte */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-slate-900/50 dark:bg-[#0A0A0A]/70 backdrop-blur-sm lg:hidden transition-colors"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Desktop : miniature w-20, expansible au hover (w-72) */}
        <div
          className={`
            fixed top-16 bottom-0 left-0 z-40 transform transition-all duration-300 ease-in-out group
            w-72 lg:w-20 lg:hover:w-72 overflow-hidden
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            ${isSuperAdmin ? 'lg:-translate-x-full lg:hidden' : 'lg:translate-x-0'}
          `}
        >
          <Sidebar onLinkClick={() => setSidebarOpen(false)} />
        </div>

        {/* Contenu principal: un conteneur flex qui ne scrolle pas, pour permettre aux headers d'être vraiment fixes */}
        <main className={`flex-1 min-w-0 flex flex-col h-full relative bg-slate-50 dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-16 lg:pt-16 ${isSuperAdmin ? '' : 'lg:ml-20'} transition-colors duration-300`}>
          {children}
        </main>
      </div>
      </div>
    </BrandingProvider>
  );
}

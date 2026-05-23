'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { Bus } from 'lucide-react';
import { BrandingProvider } from '../../components/BrandingContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isSuperAdmin = pathname.startsWith('/dashboard/admin');

  // Fermer la sidebar automatiquement à chaque changement de page (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <BrandingProvider>
      <div className="h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col">
      {/* Topbar Mobile-only : fixée en haut, visible uniquement sur petits écrans */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-[#0B0F19]/95 backdrop-blur-xl border-b border-slate-800/80 flex items-center justify-between px-5 shadow-md">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-600/20 border border-orange-500/30 flex items-center justify-center">
            <Bus className="w-4 h-4 text-orange-500" />
          </div>
          <span className="text-base font-bold text-white">
            Aller<span className="text-orange-500">Retour</span>
          </span>
        </Link>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400 hover:bg-orange-600 hover:text-white transition-colors"
          aria-label="Ouvrir le menu"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Overlay sombre sur mobile quand la sidebar est ouverte */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-[#0B0F19]/70 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar Desktop : toujours visible sauf sur Super Admin. Mobile : tiroir coulissant */}
        <div
          className={`
            fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            ${isSuperAdmin ? 'lg:-translate-x-full lg:hidden' : 'lg:translate-x-0'}
          `}
        >
          <Sidebar onLinkClick={() => setSidebarOpen(false)} />
        </div>

        {/* Contenu principal: un conteneur flex qui ne scrolle pas, pour permettre aux headers d'être vraiment fixes */}
        <main className={`flex-1 flex flex-col h-full relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-16 lg:pt-0 ${isSuperAdmin ? '' : 'lg:ml-72'}`}>
          {children}
        </main>
      </div>
    </div>
    </BrandingProvider>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Car, Menu, ArrowLeft } from 'lucide-react';

export default function PublicNavbar() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-slate-800/40 bg-white/75 dark:bg-[#0B0F19]/75 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Back Button & Logo */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Retour"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </button>
          
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(234,88,12,0.1)]">
              <Car className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Allo<span className="text-orange-500">goo</span>
            </span>
          </Link>
        </div>

        {/* Right: Hamburger Menu */}
        <button 
          className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Menu"
        >
          <Menu className="w-6 h-6 text-slate-700 dark:text-slate-300" />
        </button>

      </div>
    </header>
  );
}

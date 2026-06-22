'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Car, Menu, X, ArrowLeft, Home, HelpCircle, Mail, LogIn, UserPlus } from 'lucide-react';

export default function PublicNavbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

        {/* Right: Hamburger Menu Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors relative z-50"
          aria-label="Menu"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-slate-700 dark:text-slate-300" />
          ) : (
            <Menu className="w-6 h-6 text-slate-700 dark:text-slate-300" />
          )}
        </button>

      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 shadow-xl animate-in slide-in-from-top-2 duration-200 z-40">
          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-2">
            <Link 
              href="/" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium transition-colors"
            >
              <Home className="w-5 h-5 text-slate-400" />
              Accueil
            </Link>
            <Link 
              href="/support" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium transition-colors"
            >
              <HelpCircle className="w-5 h-5 text-slate-400" />
              Centre d'Aide
            </Link>
            <Link 
              href="/contact" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium transition-colors"
            >
              <Mail className="w-5 h-5 text-slate-400" />
              Contactez-nous
            </Link>
            
            <div className="h-px bg-slate-200 dark:bg-slate-800 my-2"></div>
            
            <Link 
              href="/auth/login" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium transition-colors"
            >
              <LogIn className="w-5 h-5 text-orange-500" />
              Se connecter
            </Link>
            <Link 
              href="/auth/register" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 font-medium transition-colors mt-2 border border-orange-100 dark:border-orange-500/20"
            >
              <UserPlus className="w-5 h-5" />
              Créer un compte
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

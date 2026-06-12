'use client';

import React, { useEffect, useState } from 'react';
import { Gift, ArrowLeft, Copy, Share2, CheckCircle2, Users, Coins } from 'lucide-react';
import Link from 'next/link';

export default function ParrainagePage() {
  const [referralCode, setReferralCode] = useState('CHARGEMENT...');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate a pseudo-random referral code and persist it in localStorage
    const savedCode = localStorage.getItem('aller_retour_referral_code');
    if (savedCode) {
      setReferralCode(savedCode);
    } else {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = 'AR-';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      localStorage.setItem('aller_retour_referral_code', code);
      setReferralCode(code);
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Rejoins Aller-Retour',
          text: `Inscris-toi sur Aller-Retour avec mon code ${referralCode} et gagne 2000 FCFA sur ton premier trajet !`,
          url: 'https://aller-retour.app',
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black font-sans pb-20 sm:pb-0">
      {/* Navbar mobile */}
      <div className="sm:hidden flex items-center justify-between p-4 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
        <Link href="/dashboard/client" className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-900 dark:text-white" />
        </Link>
        <h1 className="font-bold text-lg text-slate-900 dark:text-white">Parrainage</h1>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="max-w-md sm:max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 pt-6 sm:pt-10">
        
        {/* Back button (Desktop) */}
        <Link href="/dashboard/client" className="hidden sm:inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-8 font-medium">
          <ArrowLeft className="w-5 h-5" />
          Retour au tableau de bord
        </Link>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden shadow-2xl shadow-orange-500/20 mb-8">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">Parrainez un proche</h1>
            <p className="text-white/90 text-lg sm:text-xl font-medium max-w-sm">
              Offrez <span className="font-black text-white">2000 FCFA</span> à vos amis et gagnez <span className="font-black text-white">2000 FCFA</span> à leur premier trajet complété.
            </p>
          </div>
        </div>

        {/* Code Section */}
        <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 text-center mb-8 shadow-sm">
          <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Votre code personnel</h2>
          
          <div className="bg-slate-100 dark:bg-[#1A1A1A] rounded-2xl p-4 sm:p-6 mb-6 border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-4 group hover:border-orange-500/50 transition-colors">
            <span className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-wider font-mono">
              {referralCode}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button 
              onClick={handleCopy}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-[#222] dark:hover:bg-[#333] text-slate-900 dark:text-white font-bold py-4 px-6 rounded-xl transition-all border border-slate-200 dark:border-slate-700 active:scale-95"
            >
              {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Copié !' : 'Copier le code'}
            </button>
            <button 
              onClick={handleShare}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-orange-500/30 active:scale-95"
            >
              <Share2 className="w-5 h-5" />
              Partager mon code
            </button>
          </div>
        </div>

        {/* How it works */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-orange-500 rounded-full"></div> 
            Comment ça marche ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center shadow-sm">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                <Share2 className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">1. Partagez</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Envoyez votre code unique à vos amis et votre famille.</p>
            </div>
            <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center shadow-sm">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">2. Inscription</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Vos amis s'inscrivent en utilisant votre code de parrainage.</p>
            </div>
            <div className="bg-white dark:bg-[#111111] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center shadow-sm">
              <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
                <Coins className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">3. Récompense</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Recevez 2000 FCFA dès leur premier trajet terminé !</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

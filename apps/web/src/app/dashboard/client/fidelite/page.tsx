'use client';

import React from 'react';
import { ArrowLeft, Award, Gift, Zap, Crown, CheckCircle2, Star, Target } from 'lucide-react';
import Link from 'next/link';

export default function FidelitePage() {
  return (
    <div className="flex flex-col items-center bg-slate-50 dark:bg-black transition-colors duration-300">
      <div className="w-full max-w-[1200px] px-5 sm:px-8 lg:px-12 py-8 pb-24 space-y-8 animate-fade-in">
        
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-200 dark:border-[#2A2A2A]">
          <Link href="/dashboard/client" className="p-2.5 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <Award className="w-7 h-7 text-emerald-500" /> Points de Transport
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Gagnez des points à chaque trajet et débloquez des récompenses.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Main Card (Balance & Level) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl shadow-emerald-900/20">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 blur-3xl rounded-full"></div>
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-teal-900/40 blur-3xl rounded-full"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-lg border border-white/10">
                    <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span className="text-xs font-bold text-white tracking-wider uppercase">Statut Gold</span>
                  </div>
                  <Award className="w-6 h-6 text-emerald-200 opacity-80" />
                </div>
                
                <div>
                  <p className="text-emerald-100 text-sm font-medium mb-1">Solde actuel</p>
                  <p className="text-4xl sm:text-6xl font-black tracking-tight">450 <span className="text-2xl font-bold text-emerald-200">PTS</span></p>
                </div>
                
                <div className="mt-8 bg-black/20 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                  <div className="flex justify-between text-sm font-bold text-emerald-100 mb-2">
                    <span className="flex items-center gap-1.5"><Target className="w-4 h-4" /> Prochain Palier</span>
                    <span>550 PTS</span>
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-3">
                    <div className="bg-gradient-to-r from-emerald-400 to-amber-300 h-3 rounded-full relative" style={{ width: '80%' }}>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md"></div>
                    </div>
                  </div>
                  <p className="text-xs text-emerald-200 mt-3 font-medium">Plus que 100 PTS pour un trajet Dakar ➔ Thiès gratuit !</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-5 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Comment gagner des points ?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Gagnez 10 points par tranche de 1000 FCFA dépensée sur la plateforme (Billets, Colis).</p>
              </div>
              <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-5 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-3">
                  <Star className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Avantages VIP</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Embarquement prioritaire, support 24/7 et annulation gratuite jusqu'à 2h avant le départ.</p>
              </div>
            </div>
          </div>
          
          {/* Rewards List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-3xl p-6 sm:p-8 shadow-xl h-full flex flex-col">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Gift className="w-5 h-5 text-emerald-500" /> Récompenses
              </h2>

              <div className="space-y-4 flex-1">
                {/* Reward 1 */}
                <div className="p-4 bg-slate-50 dark:bg-[#1A1A1A] rounded-2xl border border-emerald-500/30 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full -mr-4 -mt-4"></div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Billet Gratuit (Thiès)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Valable pour 1 trajet simple</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-black text-emerald-600 dark:text-emerald-400">550 pts</span>
                    <button className="px-3 py-1.5 bg-slate-200 dark:bg-[#222222] text-slate-500 dark:text-slate-400 text-xs font-bold rounded-lg cursor-not-allowed">
                      Bientôt
                    </button>
                  </div>
                </div>

                {/* Reward 2 */}
                <div className="p-4 bg-slate-50 dark:bg-[#1A1A1A] rounded-2xl border border-slate-200 dark:border-[#222222]">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Billet Gratuit (Touba)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Valable pour 1 trajet simple</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-black text-slate-400">800 pts</span>
                    <button className="px-3 py-1.5 bg-slate-100 dark:bg-[#222222] text-slate-400 text-xs font-bold rounded-lg cursor-not-allowed border border-slate-200 dark:border-[#333333]">
                      Bloqué
                    </button>
                  </div>
                </div>

                {/* Reward 3 */}
                <div className="p-4 bg-slate-50 dark:bg-[#1A1A1A] rounded-2xl border border-slate-200 dark:border-[#222222]">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Franchise Colis (10kg)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Envoyez 10kg gratuitement</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-black text-slate-400">300 pts</span>
                    <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                      Débloquer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

'use client';
import React from 'react';
import { Truck, ArrowLeft, Info, ShieldCheck, Scale, History, Star } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';

export default function ColisFranchisePage() {
  const { user } = useAuth();
  return (
    <div className="flex-1 w-full pb-20 bg-slate-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/client/colis" className="w-10 h-10 rounded-full bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333] flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#222] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <Star className="w-7 h-7 text-blue-500" /> Points de Colis
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Cumulez des points à chaque envoi et gagnez des récompenses.</p>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-blue-900/20 mb-8">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <Star className="absolute -bottom-6 -right-6 w-32 h-32 text-white/10 -rotate-12" />
          
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-blue-200 font-medium mb-1">Reste disponible</p>
              <h2 className="text-5xl font-black tracking-tight">{(user as any)?.colisPoints || 30} <span className="text-2xl text-blue-300">pts</span></h2>
            </div>
            <div className="w-full sm:w-1/2 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex justify-between text-sm mb-2">
                <span>Total gagnés: {(user as any)?.colisPoints || 30} pts</span>
              </div>
              <div className="w-full bg-black/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2" style={{ width: `${(((user as any)?.colisPoints || 30) % 50) / 50 * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-4">
              <Info className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Comment ça marche ?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Chaque 1000 FCFA dépensé lors de l'envoi d'un colis vous rapporte 1 point. Une fois que vous atteignez 50 points, cela équivaut à 1000 FCFA qui pourront être utilisés pour réduire les tarifs de vos prochains envois de colis !
            </p>
          </div>

          <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Renouvellement</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Vos points n'expirent jamais tant que votre compte est actif. Vous pouvez les utiliser quand vous le souhaitez.
            </p>
          </div>
        </div>

        {/* History */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-slate-400" /> Historique des points
        </h3>
        <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 dark:border-[#222] flex justify-between items-center bg-slate-50/50 dark:bg-[#1A1A1A]">
            <span className="text-sm font-medium text-slate-500">Date</span>
            <span className="text-sm font-medium text-slate-500">Points</span>
          </div>
          <div className="p-4 flex justify-between items-center border-b border-slate-100 dark:border-[#222]">
            <span className="text-sm text-slate-900 dark:text-white font-medium">12 Mai 2026</span>
            <span className="text-sm font-bold text-emerald-500">+ 50 pts</span>
          </div>
          <div className="p-8 text-center text-slate-500 text-sm">
            Fin de l'historique de ce mois.
          </div>
        </div>

      </div>
    </div>
  );
}

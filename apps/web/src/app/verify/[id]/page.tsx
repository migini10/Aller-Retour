'use client';

import React, { useEffect, useState } from 'react';
import { Package, Truck, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function VerifyColisPage({ params }: { params: { id: string } }) {
  const [colis, setColis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation du fetch d'un colis depuis la base de données
    const loadColis = () => {
      try {
        const stored = localStorage.getItem('demo_colis');
        if (stored) {
          const colisList = JSON.parse(stored);
          const found = colisList.find((c: any) => c.id === params.id);
          if (found) {
            setColis(found);
            setLoading(false);
            return;
          }
        }
      } catch (e) {}

      // Fallback: mock if not found in localstorage (pour le visiteur par hasard)
      setTimeout(() => {
        setColis({
          id: params.id,
          destinataire: 'Confidentiel',
          tel: '*** *** ** **',
          taille: 'Moyen',
          trajet: 'Dakar → Saint-Louis',
          date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
          statut: 'En transit',
        });
        setLoading(false);
      }, 1000);
    };

    loadColis();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!colis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-black text-center p-6">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <Package className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Colis introuvable</h1>
        <p className="text-slate-500 mb-8 max-w-sm">Le numéro de suivi {params.id} n'existe pas ou le colis a été supprimé.</p>
        <Link href="/" className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-8 rounded-xl transition-colors">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black flex flex-col items-center p-4 sm:p-8 relative">
      <div className="w-full max-w-2xl bg-white dark:bg-[#111111] border border-slate-200 dark:border-[#2A2A2A] rounded-3xl p-6 sm:p-10 shadow-xl mt-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-[#2A2A2A]">
          <div>
            <p className="text-orange-500 font-bold text-xs tracking-wider uppercase mb-1">Suivi Public</p>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Colis {colis.id}</h1>
          </div>
          <div className="bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold px-4 py-2 rounded-xl border border-orange-200 dark:border-orange-500/20">
            {colis.statut}
          </div>
        </div>

        {/* Détails publics (Masque les infos sensibles) */}
        <div className="bg-slate-50 dark:bg-[#1A1A1A] rounded-2xl p-6 border border-slate-200 dark:border-[#2A2A2A] mb-10">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Trajet</p>
              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                {colis.trajet}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Date d'envoi</p>
              <p className="font-bold text-slate-900 dark:text-white">{colis.date}</p>
            </div>
            <div className="col-span-2 pt-4 border-t border-slate-200 dark:border-[#2A2A2A]">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1 flex items-center gap-2">
                <Package className="w-4 h-4 text-purple-500" /> Info destinataire
              </p>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                Les informations de contact (Nom, Numéro de téléphone du chauffeur et du destinataire) sont masquées pour des raisons de confidentialité sur cette page publique.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <h2 className="font-black text-xl text-slate-900 dark:text-white mb-6">Historique d'expédition</h2>
        <div className="relative pl-6 space-y-8">
          {/* Ligne verticale de la timeline */}
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-[#2A2A2A]"></div>

          <div className="relative">
            <div className={`absolute -left-6 w-4 h-4 rounded-full border-4 ${colis.statut === 'En attente de prise en charge' ? 'bg-orange-500 border-orange-200 dark:border-orange-900 shadow-[0_0_0_4px_rgba(249,115,22,0.2)]' : 'bg-orange-500 border-white dark:border-[#111111]'}`}></div>
            <h4 className={`font-bold ${colis.statut === 'En attente de prise en charge' ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>En attente de prise en charge</h4>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> {colis.date}</p>
          </div>

          <div className="relative">
            <div className={`absolute -left-6 w-4 h-4 rounded-full border-4 ${colis.statut === 'Accepté' ? 'bg-blue-500 border-blue-200 shadow-[0_0_0_4px_rgba(59,130,246,0.2)]' : 'bg-slate-200 dark:bg-[#2A2A2A] border-white dark:border-[#111111]'}`}></div>
            <h4 className={`font-bold ${colis.statut === 'Accepté' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Course acceptée par un chauffeur</h4>
            <p className="text-xs text-slate-400 mt-1">Colis sécurisé et prêt au départ</p>
          </div>

          <div className="relative">
            <div className={`absolute -left-6 w-4 h-4 rounded-full border-4 ${colis.statut === 'En transit' ? 'bg-indigo-500 border-indigo-200 shadow-[0_0_0_4px_rgba(99,102,241,0.2)]' : 'bg-slate-200 dark:bg-[#2A2A2A] border-white dark:border-[#111111]'}`}></div>
            <h4 className={`font-bold ${colis.statut === 'En transit' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>En transit vers la destination</h4>
            <p className="text-xs text-slate-400 mt-1">{(colis.trajet || '').split('→')[1]?.trim() || 'Destination'}</p>
          </div>

          <div className="relative">
            <div className={`absolute -left-6 w-4 h-4 rounded-full border-4 ${colis.statut === 'Livré' ? 'bg-emerald-500 border-emerald-200 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]' : 'bg-slate-200 dark:bg-[#2A2A2A] border-white dark:border-[#111111]'}`}></div>
            <h4 className={`font-bold ${colis.statut === 'Livré' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Livré</h4>
            <p className="text-xs text-slate-400 mt-1">Le colis est arrivé à destination</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            ← Revenir à l'accueil
          </Link>
        </div>

      </div>
    </div>
  );
}

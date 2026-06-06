'use client';
import React, { useState, useEffect } from 'react';
import { Package, MapPin, Clock, CheckCircle2, Truck, AlertTriangle } from 'lucide-react';

export default function SectionColis() {
  const [colis, setColis] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadColis = () => {
      const stored = localStorage.getItem('demo_colis');
      if (stored) {
        try {
          setColis(JSON.parse(stored));
        } catch(e) {}
      }
    };
    loadColis();
    window.addEventListener('colis_updated', loadColis);
    return () => window.removeEventListener('colis_updated', loadColis);
  }, []);

  const updateStatut = (id: string, nextStatut: string) => {
    const updatedList = colis.map(c => {
      if (c.id === id) {
        return { ...c, statut: nextStatut };
      }
      return c;
    });
    setColis(updatedList);
    localStorage.setItem('demo_colis', JSON.stringify(updatedList));
    window.dispatchEvent(new Event('colis_updated'));
  };

  const getActionBtn = (c: any) => {
    switch (c.statut) {
      case 'En attente de prise en charge':
        return (
          <button 
            onClick={() => updateStatut(c.id, 'Pris en charge')}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <Truck className="w-4 h-4 shrink-0" /> Prendre en charge
          </button>
        );
      case 'Pris en charge':
        return (
          <button 
            onClick={() => updateStatut(c.id, 'En transit')}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <MapPin className="w-4 h-4 shrink-0" /> En transit
          </button>
        );
      case 'En transit':
        return (
          <button 
            onClick={() => updateStatut(c.id, 'Livré')}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" /> Livrer
          </button>
        );
      case 'Livré':
        return (
          <div className="w-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> Terminé
          </div>
        );
      default:
        return null;
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex justify-between items-center bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-6 shadow-sm transition-colors">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-orange-500" />
            Gestion des Colis
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Acceptez, transportez et mettez à jour le statut des colis.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {colis.length === 0 ? (
          <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-8 text-center transition-colors">
            <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Aucun colis disponible pour le moment.</p>
          </div>
        ) : (
          colis.map((c, idx) => (
            <div key={idx} className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-4 sm:p-5 shadow-sm transition-colors flex flex-col lg:flex-row lg:items-center justify-between hover:border-orange-500/30 gap-6">
              
              {/* Infos principales */}
              <div className="flex-1 flex gap-5 items-start">
                <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-100 dark:border-orange-500/20">
                  <Package className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-mono text-xs font-bold text-orange-500 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-md">{c.id}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${
                      c.statut === 'En attente de prise en charge' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20' :
                      c.statut === 'Pris en charge' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' :
                      c.statut === 'En transit' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20' :
                      'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                    }`}>
                      {c.statut}
                    </span>
                  </div>
                  <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg tracking-tight mb-2">
                    {c.trajet || 'Trajet Inconnu'}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {c.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-slate-400" />
                      {c.taille || 'Taille Inconnue'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Destinataire */}
              <div className="w-full lg:w-64 bg-slate-50 dark:bg-[#1A1A1A] rounded-xl p-3 sm:p-4 border border-slate-100 dark:border-[#222222] shrink-0">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Destinataire</p>
                <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{c.destinataire || 'Inconnu'}</p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{c.tel || 'Aucun numéro'}</p>
              </div>

              {/* Action Button */}
              <div className="w-full lg:w-48 shrink-0">
                {getActionBtn(c)}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

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
            className="w-full mt-4 bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Truck className="w-5 h-5" /> Accepter et Prendre en charge
          </button>
        );
      case 'Pris en charge':
        return (
          <button 
            onClick={() => updateStatut(c.id, 'En transit')}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <MapPin className="w-5 h-5" /> Mettre en transit
          </button>
        );
      case 'En transit':
        return (
          <button 
            onClick={() => updateStatut(c.id, 'Livré')}
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <CheckCircle2 className="w-5 h-5" /> Marquer comme Livré
          </button>
        );
      case 'Livré':
        return (
          <div className="w-full mt-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> Colis Livré avec succès
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {colis.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-8 text-center transition-colors">
            <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Aucun colis disponible pour le moment.</p>
          </div>
        ) : (
          colis.map((c, idx) => (
            <div key={idx} className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-5 shadow-sm transition-colors flex flex-col justify-between hover:border-orange-500/30">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-mono text-xs font-bold text-orange-500 mb-1">{c.id}</p>
                    <p className="font-bold text-slate-900 dark:text-white">{c.trajet || 'Trajet Inconnu'}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md border uppercase tracking-wider ${
                    c.statut === 'En attente de prise en charge' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20' :
                    c.statut === 'Pris en charge' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' :
                    c.statut === 'En transit' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20' :
                    'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                  }`}>
                    {c.statut}
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{c.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Package className="w-4 h-4 shrink-0" />
                    <span>{c.taille || 'Taille Inconnue'}</span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-[#1A1A1A] rounded-xl p-3 border border-slate-100 dark:border-[#222222]">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Destinataire</p>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{c.destinataire || 'Inconnu'}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{c.tel || 'Aucun numéro'}</p>
                </div>
              </div>

              {getActionBtn(c)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

'use client';
import React, { useEffect, useState } from 'react';
import { Clock, ArrowLeft, Search, MapPin, Package } from 'lucide-react';
import Link from 'next/link';

export default function ColisActifsPage() {
  const [colis, setColis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchColis = async () => {
      try {
        const res = await fetch('/api/colis');
        if (res.ok) {
          const data = await res.json();
          // Filter only active parcels
          const actifs = data.filter((c: any) => c.statut !== 'Livré');
          setColis(actifs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchColis();
  }, []);

  const filteredColis = colis.filter(c => 
    String(c.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(c.destinataire).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 w-full overflow-y-auto pb-20 bg-slate-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/client/colis" className="w-10 h-10 rounded-full bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333] flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#222] transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <Clock className="w-7 h-7 text-amber-500" /> Colis Actifs
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Vos colis actuellement en cours d'expédition.</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8 relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par numéro ou destinataire..." 
            className="w-full bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-xl pl-12 pr-4 py-3.5 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-sm"
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
          </div>
        ) : filteredColis.length === 0 ? (
          <div className="bg-white dark:bg-[#141414] rounded-2xl p-10 text-center border border-slate-200 dark:border-[#2A2A2A]">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Aucun colis actif trouvé.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredColis.map((c, i) => (
              <div key={i} className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-amber-500/30 transition-colors shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 dark:bg-[#222] px-2 py-1 rounded">Réf: {c.id}</span>
                    <span className="text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                      {c.statut}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">{c.trajet}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> À {c.destinataire} ({c.tel})
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{c.taille}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center sm:justify-end gap-1">
                    <Clock className="w-3.5 h-3.5" /> {c.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

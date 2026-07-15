'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface CityData {
  id: string;
  name: string;
  value: number; // e.g. number of trips
  coordinates: { x: number; y: number }; // percentage positions
}

interface DashboardMapProps {
  title?: string;
  subtitle?: string;
  data?: CityData[];
  delay?: number;
  isEmpty?: boolean;
}

export function DashboardMap({ title = 'Carte des trajets', subtitle = 'Répartition géographique sur le Sénégal', data = [], delay = 0, isEmpty = false }: DashboardMapProps) {
  
  // This is a completely abstract placeholder for the map of Senegal
  // In a future sprint, this container will host Leaflet or Mapbox.
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col w-full h-full min-h-[400px] overflow-hidden relative"
    >
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 relative z-10 bg-white/80 dark:bg-[#141414]/80 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
      </div>
      
      <div className="flex-1 relative bg-slate-50 dark:bg-[#0A0A0A] flex items-center justify-center p-6 overflow-hidden">
        {isEmpty ? (
          <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-3xl text-slate-400">
            <span className="text-sm font-medium">Données bientôt disponibles</span>
          </div>
        ) : (
          <>
            {/* Placeholder decorative grid */}
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(148, 163, 184, 0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            
            {/* Abstract Senegal Map Outline Placeholder (SVG) */}
            <div className="relative w-full max-w-md aspect-[4/3] flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-[#1A1A1A]/50">
               <div className="text-center">
                 <MapPin className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                 <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Carte Interactive Bientôt Disponible</p>
                 <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[200px] mx-auto">Cette fonctionnalité sera ajoutée lors d'une prochaine mise à jour.</p>
               </div>
               
               {/* Data Points */}
               {data.map((city) => (
                 <div 
                   key={city.id} 
                   className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
                   style={{ left: `${city.coordinates.x}%`, top: `${city.coordinates.y}%` }}
                 >
                   <div className="relative">
                     <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-30"></div>
                     <div className="relative w-3 h-3 bg-orange-600 rounded-full border-2 border-white dark:border-[#141414] shadow-sm"></div>
                   </div>
                   
                   <div className="absolute top-full mt-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none whitespace-nowrap">
                     {city.name}
                     <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-medium">{city.value} trajets</span>
                   </div>
                 </div>
               ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

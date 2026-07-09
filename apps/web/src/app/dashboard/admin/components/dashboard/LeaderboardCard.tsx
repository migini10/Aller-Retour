'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, ChevronRight } from 'lucide-react';

export interface LeaderboardItem {
  id: string;
  name: string;
  avatarUrl?: string;
  initials: string;
  primaryMetric: string | React.ReactNode;
  secondaryMetric?: string;
  rating?: number;
}

interface LeaderboardCardProps {
  title: string;
  subtitle?: string;
  items: LeaderboardItem[];
  delay?: number;
  isEmpty?: boolean;
}

export function LeaderboardCard({ title, subtitle, items, delay = 0, isEmpty = false }: LeaderboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col w-full h-full"
    >
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-5 h-5 text-orange-500" />
            {title}
          </h3>
          {subtitle && <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <button className="text-sm font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-400 transition-colors flex items-center">
          Voir tout
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      <div className="flex-1 p-2 flex flex-col">
        {isEmpty ? (
          <div className="flex-1 flex items-center justify-center p-6 m-4 border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl text-slate-400">
            <span className="text-sm font-medium">Données bientôt disponibles</span>
          </div>
        ) : (
          <ul className="space-y-1">
            {items.map((item, index) => (
              <li key={item.id}>
                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#1A1A1A] transition-colors cursor-pointer group">
                  <div className="flex items-center justify-center w-6 font-bold text-slate-400 dark:text-slate-500 text-sm">
                    {index + 1}
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-400 overflow-hidden shrink-0">
                    {item.avatarUrl ? (
                      <img src={item.avatarUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      item.initials
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 truncate">{item.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      {item.rating !== undefined && (
                        <div className="flex items-center text-xs font-semibold text-amber-500">
                          <Star className="w-3 h-3 fill-current mr-1" />
                          {item.rating.toFixed(1)}
                        </div>
                      )}
                      {item.secondaryMetric && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {item.secondaryMetric}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.primaryMetric}
                    </div>
                  </div>
                </div>
              </li>
            ))}
            
            {items.length === 0 && (
              <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                Aucun classement disponible.
              </div>
            )}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

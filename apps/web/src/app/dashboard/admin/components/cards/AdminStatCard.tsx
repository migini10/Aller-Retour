'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number; // percentage
    isPositive: boolean;
  };
  subtitle?: string;
  delay?: number;
}

export function AdminStatCard({ title, value, icon: Icon, trend, subtitle, delay = 0 }: AdminStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white dark:bg-[#141414] rounded-2xl p-5 border border-slate-200 dark:border-[#2A2A2A]/80 shadow-sm relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500 transform group-hover:scale-110">
        <Icon className="w-24 h-24 text-orange-500" />
      </div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-2.5 bg-orange-50 dark:bg-orange-500/10 rounded-xl border border-orange-100 dark:border-orange-500/20 text-orange-600 dark:text-orange-400">
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-md ${
            trend.isPositive 
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' 
              : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20'
          }`}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
        )}
      </div>
      
      <div className="relative z-10">
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">{value}</h3>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        {subtitle && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}

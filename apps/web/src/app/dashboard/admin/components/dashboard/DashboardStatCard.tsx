'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

export interface DashboardStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number; // percentage
    isPositive: boolean;
  };
  sparklineData?: { value: number }[];
  isLoading?: boolean;
  isEmpty?: boolean;
  delay?: number;
}

export function DashboardStatCard({
  title,
  value,
  icon: Icon,
  trend,
  sparklineData,
  isLoading = false,
  isEmpty = false,
  delay = 0,
}: DashboardStatCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#141414] rounded-2xl p-5 border border-slate-200 dark:border-slate-800/80 shadow-sm h-32 animate-pulse flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
          <div className="w-16 h-6 rounded-md bg-slate-200 dark:bg-slate-800"></div>
        </div>
        <div>
          <div className="w-24 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 mb-2"></div>
          <div className="w-32 h-4 rounded-md bg-slate-200 dark:bg-slate-800"></div>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="bg-slate-50 dark:bg-[#0A0A0A] rounded-2xl p-5 border border-dashed border-slate-200 dark:border-slate-800/80 h-32 flex flex-col items-center justify-center text-slate-400">
        <HelpCircle className="w-6 h-6 mb-2 opacity-50" />
        <span className="text-xs font-medium">Aucune donnée</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white dark:bg-[#141414] rounded-2xl p-5 border border-slate-200 dark:border-slate-800/80 shadow-sm relative overflow-hidden group hover:border-orange-500/30 transition-colors"
    >
      <div className="flex justify-between items-start mb-2 relative z-10">
        <div className="p-2.5 bg-orange-50 dark:bg-orange-500/10 rounded-xl border border-orange-100 dark:border-orange-500/20 text-orange-600 dark:text-orange-400">
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${
              trend.isPositive
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20'
                : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20'
            }`}
          >
            {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>

      <div className="relative z-10 flex justify-between items-end">
        <div>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">{value}</h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        </div>

        {/* Sparkline */}
        {sparklineData && sparklineData.length > 0 && (
          <div className="w-20 h-10 opacity-70 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <YAxis domain={['dataMin', 'dataMax']} hide />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={trend?.isPositive === false ? '#f43f5e' : '#10b981'} // rose-500 or emerald-500
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
}

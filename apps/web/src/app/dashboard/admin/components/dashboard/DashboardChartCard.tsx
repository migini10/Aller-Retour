'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type ChartType = 'area' | 'bar';

interface DashboardChartCardProps {
  title: string;
  subtitle?: string;
  data: any[];
  type?: ChartType;
  dataKeys: { key: string; color: string; name: string }[];
  xAxisKey: string;
  height?: number;
  delay?: number;
}

export function DashboardChartCard({
  title,
  subtitle,
  data,
  type = 'area',
  dataKeys,
  xAxisKey,
  height = 300,
  delay = 0,
}: DashboardChartCardProps) {
  const renderChart = () => {
    if (type === 'area') {
      return (
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            {dataKeys.map((item) => (
              <linearGradient key={`color${item.key}`} id={`color${item.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={item.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={item.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
          <XAxis 
            dataKey={xAxisKey} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            dy={10} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
            itemStyle={{ color: '#f8fafc' }}
            cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '3 3' }}
          />
          {dataKeys.map((item) => (
            <Area
              key={item.key}
              type="monotone"
              dataKey={item.key}
              name={item.name}
              stroke={item.color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#color${item.key})`}
            />
          ))}
        </AreaChart>
      );
    }

    if (type === 'bar') {
      return (
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
          <XAxis 
            dataKey={xAxisKey} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            dy={10} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
            cursor={{ fill: '#334155', opacity: 0.2 }}
          />
          {dataKeys.map((item) => (
            <Bar
              key={item.key}
              dataKey={item.key}
              name={item.name}
              fill={item.color}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white dark:bg-[#141414] rounded-2xl p-6 border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col w-full"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>
        {subtitle && <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
      </div>
      <div style={{ height: height, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

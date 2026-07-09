'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TicketCheck, CheckCircle2, Route, Star, UserPlus, Undo2 } from 'lucide-react';

export type TimelineEventType = 
  | 'BookingCreated' 
  | 'PaymentSuccess' 
  | 'TripPublished' 
  | 'ReviewCreated' 
  | 'DriverRegistered' 
  | 'RefundIssued';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description: string;
  time: string;
  isNew?: boolean;
}

interface DashboardTimelineProps {
  events: TimelineEvent[];
  title?: string;
  delay?: number;
  isEmpty?: boolean;
}

export function DashboardTimeline({ events, title = 'Activité récente', delay = 0, isEmpty = false }: DashboardTimelineProps) {
  
  const getEventConfig = (type: TimelineEventType) => {
    switch (type) {
      case 'BookingCreated':
        return { icon: TicketCheck, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-500/20' };
      case 'PaymentSuccess':
        return { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20' };
      case 'TripPublished':
        return { icon: Route, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10', border: 'border-orange-200 dark:border-orange-500/20' };
      case 'ReviewCreated':
        return { icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20' };
      case 'DriverRegistered':
        return { icon: UserPlus, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10', border: 'border-purple-200 dark:border-purple-500/20' };
      case 'RefundIssued':
        return { icon: Undo2, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10', border: 'border-rose-200 dark:border-rose-500/20' };
      default:
        return { icon: CheckCircle2, color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-500/10', border: 'border-slate-200 dark:border-slate-500/20' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col w-full h-full"
    >
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/50">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>
      </div>
      
      <div className="p-6 flex-1 overflow-y-auto flex flex-col">
        {isEmpty ? (
          <div className="flex-1 flex items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl text-slate-400">
            <span className="text-sm font-medium">Données bientôt disponibles</span>
          </div>
        ) : (
          <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 space-y-6">
            {events.map((event, index) => {
              const config = getEventConfig(event.type);
              const Icon = config.icon;
              
              return (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: delay + (index * 0.1) }}
                  key={event.id} 
                  className="relative pl-6"
                >
                  {/* Connector Point */}
                  <span className="absolute -left-[5px] top-1.5 flex h-2.5 w-2.5">
                    {event.isNew && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.bg}`}></span>}
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${config.bg} border ${config.border}`}></span>
                  </span>

                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${config.color}`} />
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">{event.title}</h4>
                    </div>
                    <time className="text-xs font-medium text-slate-400 whitespace-nowrap ml-4">{event.time}</time>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{event.description}</p>
                </motion.div>
              );
            })}

            {events.length === 0 && (
              <div className="text-sm text-slate-400 pl-6">Aucune activité récente.</div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

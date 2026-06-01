'use client';
import React from 'react';
import { Bell, MapPin, CheckCircle2, Wallet, AlertTriangle } from 'lucide-react';

const notifs = [
  { id: 1, type: 'mission', icon: MapPin, title: 'Nouvelle mission urgente', desc: 'Dakar → Saint-Louis, départ 18:00', time: 'Il y a 5 min', isNew: true },
  { id: 2, type: 'wallet', icon: Wallet, title: 'Paiement reçu', desc: 'Retrait de 45 000 FCFA effectué vers Wave.', time: 'Il y a 2h', isNew: true },
  { id: 3, type: 'alert', icon: AlertTriangle, title: 'Alerte maintenance', desc: 'Votre visite technique expire dans 15 jours.', time: 'Hier', isNew: false },
  { id: 4, type: 'success', icon: CheckCircle2, title: 'Mission terminée', desc: 'Le trajet Thiès → Dakar a été validé.', time: 'Hier', isNew: false },
];

export default function SectionNotifications() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors"><Bell className="w-5 h-5 text-orange-500 dark:text-orange-400" /> Notifications</h2>
        <button className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 transition-colors"><CheckCircle2 className="w-3.5 h-3.5" /> Tout marquer lu</button>
      </div>

      <div className="space-y-3">
        {notifs.map(n => {
          const Icon = n.icon;
          const bg = n.type === 'mission' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 
                     n.type === 'wallet' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                     n.type === 'alert' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                     'bg-orange-500/20 text-orange-400 border-orange-500/30';
                     
          return (
            <div key={n.id} className={`bg-white dark:bg-[#141414] border ${n.isNew ? 'border-orange-500/40' : 'border-slate-200 dark:border-[#2A2A2A]'} rounded-2xl p-4 flex gap-4 transition-colors`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${bg}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors">
                    {n.title}
                    {n.isNew && <span className="w-2 h-2 rounded-full bg-orange-500" />}
                  </h3>
                  <span className="text-xs text-slate-500">{n.time}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 transition-colors">{n.desc}</p>
                {n.type === 'mission' && n.isNew && (
                  <div className="mt-3 flex gap-2">
                    <button className="text-xs font-bold px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors">Voir l'offre</button>
                    <button className="text-xs font-bold px-3 py-1.5 bg-slate-100 dark:bg-[#222222] text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Ignorer</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

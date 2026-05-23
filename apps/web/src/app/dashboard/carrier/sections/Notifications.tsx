'use client';
import React from 'react';
import { Bell, CheckCircle2, UserPlus, AlertTriangle, Wallet } from 'lucide-react';

const notifs = [
  { id: 1, type: 'alert', icon: AlertTriangle, title: 'Contrôle Technique - AA-123-BB', desc: 'La visite technique expire dans 15 jours.', time: 'Il y a 1h', isNew: true },
  { id: 2, type: 'driver', icon: UserPlus, title: 'Nouveau Chauffeur Libre', desc: 'Ibrahima Fall (Taxi 7 Places) est disponible à 800m de la gare de Dakar.', time: 'Il y a 2h', isNew: true },
  { id: 3, type: 'wallet', icon: Wallet, title: 'Facture Hebdomadaire', desc: 'La facture des commissions (Semaine 42) est disponible.', time: 'Hier', isNew: false },
  { id: 4, type: 'success', icon: CheckCircle2, title: 'Trajet Terminé', desc: 'TRIP-402 (Dakar-Touba) s\'est terminé avec succès.', time: 'Hier', isNew: false },
];

export default function SectionNotifications() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Bell className="w-5 h-5 text-orange-400" /> Notifications Entreprise</h2>
        <button className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"><CheckCircle2 className="w-3.5 h-3.5" /> Tout marquer lu</button>
      </div>

      <div className="space-y-3">
        {notifs.map(n => {
          const Icon = n.icon;
          const bg = n.type === 'alert' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 
                     n.type === 'wallet' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                     n.type === 'driver' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                     'bg-orange-500/20 text-orange-400 border-orange-500/30';
                     
          return (
            <div key={n.id} className={`bg-[#101728] border ${n.isNew ? 'border-orange-500/40' : 'border-slate-800'} rounded-2xl p-4 flex gap-4 transition-colors`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${bg}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {n.title}
                    {n.isNew && <span className="w-2 h-2 rounded-full bg-orange-500" />}
                  </h3>
                  <span className="text-xs text-slate-500">{n.time}</span>
                </div>
                <p className="text-sm text-slate-400 mt-1">{n.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

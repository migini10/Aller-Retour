'use client';
import React from 'react';
import { Bell, AlertTriangle, CheckCircle2, Ticket } from 'lucide-react';

const notifs = [
  { id: 1, type: 'alert', icon: AlertTriangle, title: 'Retard de Bus', desc: 'Le véhicule pour le trajet Dakar-Thiès (TRIP-399) a signalé un retard de 30 minutes.', time: 'Il y a 5 min', isNew: true },
  { id: 2, type: 'info', icon: Bell, title: 'Embarquement Imminent', desc: 'Le trajet Dakar-Touba (TRIP-402) est prêt pour l\'embarquement. 45/50 passagers enregistrés.', time: 'Il y a 10 min', isNew: true },
  { id: 3, type: 'success', icon: CheckCircle2, title: 'Départ Clôturé', desc: 'Le trajet Dakar-Mbour (TRIP-398) a quitté la gare avec succès.', time: 'Il y a 1h', isNew: false },
  { id: 4, type: 'ticket', icon: Ticket, title: 'Remboursement Demandé', desc: 'Le passager du billet AR-84512987 a annulé sa réservation (Guichet 2).', time: 'Il y a 2h', isNew: false },
];

export default function SectionNotifications() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Bell className="w-5 h-5 text-orange-400" /> Notifications Gare</h2>
        <button className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"><CheckCircle2 className="w-3.5 h-3.5" /> Tout marquer lu</button>
      </div>

      <div className="space-y-3">
        {notifs.map(n => {
          const Icon = n.icon;
          const bg = n.type === 'alert' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 
                     n.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                     n.type === 'ticket' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                     'bg-blue-500/20 text-blue-400 border-blue-500/30';
                     
          return (
            <div key={n.id} className={`bg-[#141414] border ${n.isNew ? 'border-orange-500/40' : 'border-[#2A2A2A]'} rounded-2xl p-4 flex gap-4 transition-colors`}>
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
                {n.type === 'alert' && n.isNew && (
                  <button className="mt-3 text-xs bg-[#222222] hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded-lg border border-[#333333] transition-colors">Diffuser l'alerte audio (Gare)</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

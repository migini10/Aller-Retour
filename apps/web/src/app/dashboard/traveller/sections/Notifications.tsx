'use client';
import React, { useState } from 'react';
import { Bell, Calendar, CreditCard, AlertTriangle, Megaphone, MessageSquare, CheckCircle2 } from 'lucide-react';

const notifs = [
  { id: 1, type: 'reservation', icon: Calendar, titre: 'Réservation confirmée', msg: 'Votre réservation RES-004 pour Dakar → Kaolack est confirmée.', date: 'Il y a 2h', lu: false, color: 'text-orange-400 bg-orange-500/20' },
  { id: 2, type: 'paiement', icon: CreditCard, titre: 'Paiement reçu', msg: 'Dépôt Wave de 20 000 FCFA crédité sur votre wallet.', date: 'Il y a 4h', lu: false, color: 'text-emerald-400 bg-emerald-500/20' },
  { id: 3, type: 'retard', icon: AlertTriangle, titre: 'Retard signalé', msg: 'Votre bus AR-74892374 a 15 min de retard au départ.', date: 'Hier', lu: true, color: 'text-amber-400 bg-amber-500/20' },
  { id: 4, type: 'promo', icon: Megaphone, titre: 'Promotion spéciale', msg: '-20% sur tous les trajets vers Saint-Louis ce week-end !', date: 'Il y a 2j', lu: true, color: 'text-purple-400 bg-purple-500/20' },
  { id: 5, type: 'support', icon: MessageSquare, titre: 'Réponse support', msg: 'Votre ticket TKT-012 a reçu une réponse.', date: 'Il y a 3j', lu: true, color: 'text-blue-400 bg-blue-500/20' },
];

const categories = ['Toutes', 'Réservations', 'Paiements', 'Retards', 'Promotions', 'Support'];

export default function SectionNotifications() {
  const [cat, setCat] = useState('Toutes');
  const nonLues = notifs.filter(n => !n.lu).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-orange-400" /> Notifications
          {nonLues > 0 && <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-bold">{nonLues}</span>}
        </h2>
        <button className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Tout marquer lu
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(c => (
          <button key={c} onClick={() => setCat(c)} className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${cat === c ? 'bg-orange-600 text-white' : 'bg-[#1A1A1A] text-slate-400 hover:text-white border border-[#2A2A2A]'}`}>{c}</button>
        ))}
      </div>

      <div className="space-y-2">
        {notifs.map(n => {
          const Icon = n.icon;
          return (
            <div key={n.id} className={`bg-[#141414] border rounded-2xl p-4 flex items-start gap-4 transition-colors ${n.lu ? 'border-[#2A2A2A]/60 opacity-70' : 'border-orange-500/20 hover:border-orange-500/40'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white">{n.titre}</p>
                  {!n.lu && <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{n.msg}</p>
                <p className="text-xs text-slate-600 mt-1">{n.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

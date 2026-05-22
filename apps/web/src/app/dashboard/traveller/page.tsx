'use client';

import React from 'react';
import { useBranding } from '../../../components/BrandingContext';
import QRCodeBrandEngine from '../../../components/QRCodeBrandEngine';
import { Calendar, MapPin, CreditCard, Gift, User, Settings, Mail, Bell, Share2, Download, Loader2, Truck, Tag, Package, CheckCircle, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';

// Dummy data – replace with real API later
const user = {
  name: 'Abdou Bakhe',
  avatar: '/placeholder-profile.png', // placeholder image
  loyaltyPoints: 1240,
  wallet: 53900,
  reservations: 12,
  activeTickets: 3,
  completedTrips: 45,
  notifications: 5,
};

const upcomingTrip = {
  id: 'AR-74892374',
  from: 'Dakar',
  to: 'Touba',
  date: '2026-06-05',
  time: '08:00',
  seat: '#14 (VIP)',
  company: 'Sénégal Express',
  vehicle: 'Bus Climatisé',
};

export default function TravellerPremiumDashboard() {
  const { branding } = useBranding();

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col items-center p-4 lg:p-8 space-y-8">
      {/* Header */}
      <header className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={user.avatar} alt="profile" className="w-14 h-14 rounded-full border border-orange-500/30" />
          <div>
            <h1 className="text-2xl font-bold">Bienvenue, {user.name}</h1>
            <p className="text-sm text-slate-400">Votre espace voyageur premium.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl transition-colors">
            <Settings className="w-4 h-4" />
            Paramètres
          </button>
          <button className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl transition-colors">
            <Mail className="w-4 h-4" />
            Support
          </button>
        </div>
      </header>

      {/* Statistiques principales */}
      <section className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<Calendar className="w-6 h-6" />} label="Réservations" value={user.reservations} />
        <StatCard icon={<Gift className="w-6 h-6" />} label="Points Fidélité" value={user.loyaltyPoints} />
        <StatCard icon={<CreditCard className="w-6 h-6" />} label="Wallet" value={user.wallet + ' FCFA'} />
      </section>

      {/* Prochain voyage */}
      <section className="w-full max-w-5xl bg-[#101728] border border-slate-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-400" />
          Prochain voyage
        </h2>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-1 space-y-2">
            <p className="text-sm text-slate-400">ID Billet</p>
            <p className="text-lg font-bold text-white">{upcomingTrip.id}</p>
            <p className="text-sm text-slate-400">{upcomingTrip.from} ➔ {upcomingTrip.to}</p>
            <p className="text-sm text-slate-400">{upcomingTrip.date} • {upcomingTrip.time}</p>
            <p className="text-sm text-slate-400">Siège: {upcomingTrip.seat}</p>
            <p className="text-sm text-slate-400">Compagnie: {upcomingTrip.company}</p>
          </div>
          <div className="shrink-0">
            <QRCodeBrandEngine value={upcomingTrip.id} size={160} />
          </div>
        </div>
      </section>

      {/* Billets actifs */}
      <section className="w-full max-w-5xl space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Tag className="w-5 h-5 text-orange-400" />
          Billets actifs ({user.activeTickets})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(idx => (
            <div key={idx} className="bg-[#101728] border border-slate-800/80 rounded-xl p-4 flex flex-col items-center space-y-3">
              <QRCodeBrandEngine value={`AR-${Math.random().toString(36).substr(2, 8).toUpperCase()}`} size={120} />
              <p className="text-sm text-slate-400">Billet #{idx}</p>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs px-3 py-1 rounded-lg transition-colors">
                  <Download className="w-3 h-3" /> PDF
                </button>
                <button className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs px-3 py-1 rounded-lg transition-colors">
                  <Share2 className="w-3 h-3" /> Partager
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Réservations */}
      <section className="w-full max-w-5xl space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Truck className="w-5 h-5 text-orange-400" />
          Mes réservations ({user.reservations})
        </h2>
        {/* Simple table mockup */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-slate-800/60 rounded-lg">
            <thead className="bg-[#101728]">
              <tr className="text-slate-400 text-xs uppercase">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Itinéraire</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Statut</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {[1,2,3].map(i => (
                <tr key={i} className="border-t border-slate-800/30 hover:bg-slate-800/30 transition-colors">
                  <td className="px-3 py-2">RES-{i}00{i}</td>
                  <td className="px-3 py-2">Dakar ➔ Touba</td>
                  <td className="px-3 py-2">2026-06-{5+i}</td>
                  <td className="px-3 py-2"><span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded text-xs">Confirmé</span></td>
                  <td className="px-3 py-2 flex gap-1">
                    <button className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs px-2 py-1 rounded">Voir</button>
                    <button className="flex items-center gap-1.5 bg-rose-500/20 text-rose-400 px-2 py-1 rounded text-xs">Annuler</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Suivi GPS en temps réel (placeholder) */}
      <section className="w-full max-w-5xl space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-400" />
          Suivi GPS (Live)
        </h2>
        <div className="h-64 bg-slate-800/30 rounded-xl flex items-center justify-center">
          <p className="text-slate-400">[Carte interactive à intégrer – ex. react‑leaflet]</p>
        </div>
      </section>

      {/* Wallet & Paiements */}
      <section className="w-full max-w-5xl space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-orange-400" />
          Wallet & Paiements
        </h2>
        <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Solde disponible</p>
            <p className="text-2xl font-bold text-white">{user.wallet} FCFA</p>
          </div>
          <button className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl transition-colors">
            <ArrowRight className="w-4 h-4" />
            Historique
          </button>
        </div>
      </section>

      {/* Programme fidélité */}
      <section className="w-full max-w-5xl space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Gift className="w-5 h-5 text-orange-400" />
          Programme fidélité
        </h2>
        <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm text-slate-400">Points accumulés</p>
            <p className="text-2xl font-bold text-white">{user.loyaltyPoints}</p>
          </div>
          <button className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition-colors">
            <ArrowRight className="w-4 h-4" />
            Récompenses
          </button>
        </div>
      </section>

      {/* Gestion bagages */}
      <section className="w-full max-w-5xl space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Package className="w-5 h-5 text-orange-400" />
          Gestion bagages
        </h2>
        <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <p className="text-slate-400">Aucun bagage déclaré pour le moment.</p>
          <button className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition-colors">
            <Plus className="w-4 h-4" />
            Ajouter bagage
          </button>
        </div>
      </section>

      {/* Notifications */}
      <section className="w-full max-w-5xl space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bell className="w-5 h-5 text-orange-400" />
          Notifications récentes ({user.notifications})
        </h2>
        <ul className="space-y-2">
          {[1,2,3,4,5].map(i => (
            <li key={i} className="bg-[#101728] border border-slate-800/80 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-slate-300">Notification #{i} – Exemple d'information.</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Support */}
      <section className="w-full max-w-5xl space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Mail className="w-5 h-5 text-orange-400" />
          Support & FAQ
        </h2>
        <p className="text-slate-400">Accédez à la messagerie, aux tickets d'incident et à la FAQ via le bouton dans le header.</p>
      </section>

      {/* Paramètres du compte */}
      <section className="w-full max-w-5xl space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Settings className="w-5 h-5 text-orange-400" />
          Paramètres du compte
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition-colors">
            <User className="w-4 h-4" /> Modifier profil
          </button>
          <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition-colors">
            <Lock className="w-4 h-4" /> Sécurité & Mot de passe
          </button>
          <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition-colors">
            <Globe className="w-4 h-4" /> Préférences langue/pays
          </button>
          <button className="flex items-center gap-2 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/20 px-4 py-2 rounded-xl transition-colors">
            <Trash2 className="w-4 h-4" /> Supprimer compte
          </button>
        </div>
      </section>
    </div>
  );
}

// Reusable stat card component
function StatCard({ icon, label, value }: { icon: JSX.Element; label: string; value: number | string }) {
  return (
    <div className="bg-[#101728] border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3">
      <div className="p-2 bg-slate-900 rounded-lg">{icon}</div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-lg font-bold text-white">{value}</p>
      </div>
    </div>
  );
}


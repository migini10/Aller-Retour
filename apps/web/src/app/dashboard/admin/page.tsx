'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, CarFront, Route, TicketCheck, TrendingUp, XCircle, Star, Wallet } from 'lucide-react';

import { AdminPageContainer } from './components/shared/AdminPageContainer';
import { AdminPageHeader } from './components/shared/AdminPageHeader';
import { AdminBreadcrumb } from './components/layout/AdminBreadcrumb';
import { useDashboard } from './hooks/useDashboard';
import { DashboardSkeleton } from './components/dashboard/DashboardSkeleton';

// Dashboard Components
import { DashboardStatCard } from './components/dashboard/DashboardStatCard';
import { DashboardChartCard } from './components/dashboard/DashboardChartCard';
import { DashboardTimeline, TimelineEvent } from './components/dashboard/DashboardTimeline';
import { DashboardAlerts, AlertItem } from './components/dashboard/DashboardAlerts';
import { DashboardMap } from './components/dashboard/DashboardMap';
import { DashboardQuickActions } from './components/dashboard/DashboardQuickActions';
import { LeaderboardCard, LeaderboardItem } from './components/dashboard/LeaderboardCard';
import { DashboardRecentBookings } from './components/dashboard/DashboardRecentBookings';

// MOCK DATA (Pour le UI/UX uniquement)

const sparklineDataPos = [{ value: 10 }, { value: 15 }, { value: 12 }, { value: 20 }, { value: 25 }, { value: 22 }, { value: 30 }];
const sparklineDataNeg = [{ value: 30 }, { value: 28 }, { value: 25 }, { value: 20 }, { value: 22 }, { value: 15 }, { value: 10 }];

const chartData = Array.from({ length: 30 }).map((_, i) => ({
  name: `Jour ${i + 1}`,
  reservations: Math.floor(Math.random() * 50) + 20,
  commissions: Math.floor(Math.random() * 50000) + 10000,
  users: Math.floor(Math.random() * 100) + 10,
}));

const alertsData: AlertItem[] = [
  { id: '1', type: 'error', title: 'Erreur de paiement', message: '3 transactions Orange Money ont échoué lors de la dernière heure.', action: { label: 'Voir les logs', onClick: () => {} } },
  { id: '2', type: 'warning', title: 'Chauffeurs en attente', message: '12 chauffeurs attendent la validation de leur KYC depuis plus de 24h.' },
  { id: '3', type: 'info', title: 'Mise à jour système', message: 'La maintenance prévue aura lieu ce soir à 02h00 GMT.' },
];

const timelineEvents: TimelineEvent[] = [
  { id: '1', type: 'BookingCreated', title: 'Nouvelle réservation', description: 'Ousmane S. a réservé Dakar - Touba', time: 'Il y a 5 min', isNew: true },
  { id: '2', type: 'PaymentSuccess', title: 'Paiement confirmé', description: 'Wave: 4 500 FCFA reçu pour Trajet #402', time: 'Il y a 12 min', isNew: true },
  { id: '3', type: 'TripPublished', title: 'Trajet publié', description: 'Modou F. a publié Thiès - Saint-Louis', time: 'Il y a 28 min' },
  { id: '4', type: 'ReviewCreated', title: 'Avis 5 étoiles', description: 'Fatou N. a noté le chauffeur Amadou D.', time: 'Il y a 1h' },
  { id: '5', type: 'DriverRegistered', title: 'Nouveau Chauffeur', description: "Ibrahima C. s'est inscrit. KYC en attente.", time: 'Il y a 2h' },
  { id: '6', type: 'RefundIssued', title: 'Remboursement', description: 'Annulation du trajet #304. 3000 FCFA remboursés.', time: 'Il y a 4h' },
];

const topDrivers: LeaderboardItem[] = [
  { id: '1', name: 'Amadou Diallo', initials: 'AD', primaryMetric: '450k FCFA', secondaryMetric: '124 trajets', rating: 4.9 },
  { id: '2', name: 'Modou Fall', initials: 'MF', primaryMetric: '380k FCFA', secondaryMetric: '98 trajets', rating: 4.8 },
  { id: '3', name: 'Cheikh Ndiaye', initials: 'CN', primaryMetric: '310k FCFA', secondaryMetric: '85 trajets', rating: 4.7 },
  { id: '4', name: 'Ousmane Sow', initials: 'OS', primaryMetric: '290k FCFA', secondaryMetric: '82 trajets', rating: 4.6 },
  { id: '5', name: 'Moussa Diop', initials: 'MD', primaryMetric: '250k FCFA', secondaryMetric: '70 trajets', rating: 4.9 },
];

const recentBookings = [
  { id: 'BK-1002', passenger: 'Fatou Ndiaye', trip: 'Dakar → Thiès', paymentMethod: 'Wave', amount: '2 500 FCFA', status: 'confirmed' as const, date: "Aujourd'hui, 14:30" },
  { id: 'BK-1003', passenger: 'Alioune Badara', trip: 'Touba → Dakar', paymentMethod: 'Orange Money', amount: '4 000 FCFA', status: 'pending' as const, date: "Aujourd'hui, 14:15" },
  { id: 'BK-1004', passenger: 'Aïssatou Sy', trip: 'Saint-Louis → Dakar', paymentMethod: 'Carte Bancaire', amount: '5 000 FCFA', status: 'confirmed' as const, date: "Aujourd'hui, 13:45" },
  { id: 'BK-1005', passenger: 'Mamadou Ba', trip: 'Mbour → Thiès', paymentMethod: 'Wave', amount: '1 500 FCFA', status: 'cancelled' as const, date: "Aujourd'hui, 11:20" },
  { id: 'BK-1006', passenger: 'Khadija Sall', trip: 'Dakar → Kaolack', paymentMethod: 'Orange Money', amount: '3 500 FCFA', status: 'confirmed' as const, date: 'Hier, 18:00' },
];

const mapData = [
  { id: 'dakar', name: 'Dakar', value: 1245, coordinates: { x: 20, y: 55 } },
  { id: 'thies', name: 'Thiès', value: 854, coordinates: { x: 35, y: 50 } },
  { id: 'touba', name: 'Touba', value: 650, coordinates: { x: 60, y: 40 } },
  { id: 'stlouis', name: 'Saint-Louis', value: 420, coordinates: { x: 35, y: 15 } },
  { id: 'kaolack', name: 'Kaolack', value: 380, coordinates: { x: 55, y: 70 } },
  { id: 'ziguinchor', name: 'Ziguinchor', value: 150, coordinates: { x: 45, y: 90 } },
];

export default function AdminDashboardPage() {
  const { isLoading } = useDashboard();

  return (
    <AdminPageContainer>
      <AdminBreadcrumb />
      
      <AdminPageHeader 
        title="Dashboard" 
        description="Aperçu global et en temps réel de l'activité de la marketplace."
      />

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="flex flex-col gap-6">
          
          {/* Ligne 1 : KPI (8 Cartes) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardStatCard title="Nouveaux utilisateurs" value="245" icon={Users} trend={{ value: 12.5, isPositive: true }} sparklineData={sparklineDataPos} delay={0.1} />
            <DashboardStatCard title="Chauffeurs actifs" value="1,204" icon={CarFront} trend={{ value: 3.2, isPositive: true }} sparklineData={sparklineDataPos} delay={0.15} />
            <DashboardStatCard title="Trajets publiés (Ajd)" value="84" icon={Route} trend={{ value: 5.1, isPositive: false }} sparklineData={sparklineDataNeg} delay={0.2} />
            <DashboardStatCard title="Réservations (Ajd)" value="342" icon={TicketCheck} trend={{ value: 18.4, isPositive: true }} sparklineData={sparklineDataPos} delay={0.25} />
            <DashboardStatCard title="Paiements réussis" value="8.4M FCFA" icon={Wallet} trend={{ value: 2.1, isPositive: true }} sparklineData={sparklineDataPos} delay={0.3} />
            <DashboardStatCard title="Commissions Allogoo" value="840k FCFA" icon={TrendingUp} trend={{ value: 8.4, isPositive: true }} sparklineData={sparklineDataPos} delay={0.35} />
            <DashboardStatCard title="Annulations" value="12" icon={XCircle} trend={{ value: 1.5, isPositive: false }} sparklineData={sparklineDataPos} delay={0.4} />
            <DashboardStatCard title="Note moyenne" value="4.8/5" icon={Star} trend={{ value: 0.2, isPositive: true }} delay={0.45} />
          </div>

          {/* Ligne 2 : Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardChartCard 
              title="Évolution des réservations" 
              subtitle="30 derniers jours"
              data={chartData} 
              type="area"
              xAxisKey="name"
              dataKeys={[{ key: 'reservations', name: 'Réservations', color: '#3b82f6' }]} 
              delay={0.5} 
            />
            <DashboardChartCard 
              title="Commissions générées (FCFA)" 
              subtitle="30 derniers jours"
              data={chartData} 
              type="bar"
              xAxisKey="name"
              dataKeys={[{ key: 'commissions', name: 'Commissions', color: '#10b981' }]} 
              delay={0.55} 
            />
          </div>

          {/* Ligne 3 : Carte + Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DashboardMap data={mapData} delay={0.6} />
            </div>
            <div className="lg:col-span-1">
              <LeaderboardCard 
                title="Top Chauffeurs" 
                subtitle="Basé sur les revenus générés"
                items={topDrivers} 
                delay={0.65} 
              />
            </div>
          </div>

          {/* Ligne 4 : Dernières réservations + Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DashboardRecentBookings bookings={recentBookings} delay={0.7} />
            </div>
            <div className="lg:col-span-1">
              <DashboardTimeline events={timelineEvents} delay={0.75} />
            </div>
          </div>

          {/* Ligne 5 : Alertes + Actions Rapides */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <DashboardAlerts alerts={alertsData} delay={0.8} />
            </div>
            <div className="lg:col-span-2">
              <DashboardQuickActions delay={0.85} />
            </div>
          </div>

        </div>
      )}
    </AdminPageContainer>
  );
}

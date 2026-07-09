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

// MOCK DATA REMOVED

export default function AdminDashboardPage() {
  const { data, isLoading } = useDashboard();

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
            <DashboardStatCard 
              title="Total utilisateurs" 
              value={data?.usersTotal || 0} 
              icon={Users} 
              delay={0.1} 
            />
            <DashboardStatCard 
              title="Chauffeurs actifs" 
              value={data?.activeDriversTotal || 0} 
              icon={CarFront} 
              delay={0.15} 
            />
            {/* Trajets n'ayant pas d'endpoint "total" disponible pour l'instant */}
            <DashboardStatCard 
              title="Trajets publiés" 
              value="-" 
              icon={Route} 
              isEmpty={true}
              delay={0.2} 
            />
            <DashboardStatCard 
              title="Réservations (Ajd)" 
              value={data?.todayBookingsTotal || 0} 
              icon={TicketCheck} 
              delay={0.25} 
            />
            <DashboardStatCard 
              title="Paiements réussis" 
              value={`${(data?.totalCollectedAmount || 0).toLocaleString('fr-FR')} FCFA`} 
              icon={Wallet} 
              delay={0.3} 
            />
            <DashboardStatCard 
              title="Commissions Allogoo" 
              value={`${(data?.totalPlatformFees || 0).toLocaleString('fr-FR')} FCFA`} 
              icon={TrendingUp} 
              delay={0.35} 
            />
            <DashboardStatCard 
              title="Annulations" 
              value={data?.cancelledBookingsTotal || 0} 
              icon={XCircle} 
              delay={0.4} 
            />
            {/* Note moyenne non disponible */}
            <DashboardStatCard 
              title="Note moyenne" 
              value="-" 
              icon={Star} 
              isEmpty={true}
              delay={0.45} 
            />
          </div>

          {/* Ligne 2 : Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardChartCard 
              title="Évolution des réservations" 
              subtitle="30 derniers jours"
              data={[]} 
              type="area"
              xAxisKey="name"
              dataKeys={[{ key: 'reservations', name: 'Réservations', color: '#3b82f6' }]} 
              delay={0.5} 
              isEmpty={true}
            />
            <DashboardChartCard 
              title="Commissions générées (FCFA)" 
              subtitle="30 derniers jours"
              data={[]} 
              type="bar"
              xAxisKey="name"
              dataKeys={[{ key: 'commissions', name: 'Commissions', color: '#10b981' }]} 
              delay={0.55} 
              isEmpty={true}
            />
          </div>

          {/* Ligne 3 : Carte + Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DashboardMap data={[]} delay={0.6} isEmpty={true} />
            </div>
            <div className="lg:col-span-1">
              <LeaderboardCard 
                title="Top Chauffeurs" 
                subtitle="Basé sur les revenus générés"
                items={[]} 
                delay={0.65} 
                isEmpty={true}
              />
            </div>
          </div>

          {/* Ligne 4 : Dernières réservations + Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DashboardRecentBookings 
                bookings={(data?.recentBookings || []).map(b => ({
                  id: b.id,
                  passenger: b.user?.fullName || 'Client inconnu',
                  trip: `${b.trip?.route?.originStation?.city || '?'} → ${b.trip?.route?.destinationStation?.city || '?'}`,
                  paymentMethod: b.paymentMethod,
                  amount: `${(b.amountPaid || 0).toLocaleString('fr-FR')} FCFA`,
                  status: b.status.toLowerCase() as any,
                  date: new Date(b.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                }))} 
                delay={0.7} 
              />
            </div>
            <div className="lg:col-span-1">
              <DashboardTimeline events={[]} delay={0.75} isEmpty={true} />
            </div>
          </div>

          {/* Ligne 5 : Alertes + Actions Rapides */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <DashboardAlerts alerts={[]} delay={0.8} isEmpty={true} />
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

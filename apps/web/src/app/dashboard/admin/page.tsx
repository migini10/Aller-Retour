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

// Map deterministic coordinates
const getDeterministicCoordinates = (cityName: string) => {
  const knownCities: Record<string, { x: number, y: number }> = {
    'Dakar': { x: 10, y: 50 },
    'Thiès': { x: 20, y: 50 },
    'Mbour': { x: 25, y: 60 },
    'Saint-Louis': { x: 20, y: 20 },
    'Touba': { x: 40, y: 45 },
    'Ziguinchor': { x: 25, y: 85 },
    'Tambacounda': { x: 70, y: 60 },
    'Kolda': { x: 50, y: 80 },
    'Kaolack': { x: 35, y: 65 }
  };
  
  if (knownCities[cityName]) {
    return knownCities[cityName];
  }
  
  // Deterministic fallback for unknown cities
  let hash = 0;
  for (let i = 0; i < cityName.length; i++) {
    hash = cityName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const normalizedHash = Math.abs(hash);
  return { 
    x: 20 + (normalizedHash % 60), 
    y: 20 + ((normalizedHash >> 4) % 60) 
  };
};

import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const { data, isLoading } = useDashboard();
  const analytics = data?.analytics;
  const router = useRouter();

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
              value={analytics?.kpis.totalUsers || 0} 
              icon={Users} 
              delay={0.1} 
            />
            <DashboardStatCard 
              title="Chauffeurs actifs" 
              value={analytics?.kpis.activeDrivers || 0} 
              icon={CarFront} 
              delay={0.15} 
            />
            <DashboardStatCard 
              title="Trajets publiés" 
              value={analytics?.kpis.totalTrips || 0} 
              icon={Route} 
              delay={0.2} 
            />
            <DashboardStatCard 
              title="Réservations (Ajd)" 
              value={analytics?.kpis.bookingsToday || 0} 
              icon={TicketCheck} 
              delay={0.25} 
            />
            <DashboardStatCard 
              title="Revenu Total" 
              value={`${(analytics?.kpis.totalRevenue || 0).toLocaleString('fr-FR')} FCFA`} 
              icon={Wallet} 
              delay={0.3} 
            />
            <DashboardStatCard 
              title="Total Commissions" 
              value={`${(analytics?.kpis.totalPlatformFees || 0).toLocaleString('fr-FR')} FCFA`} 
              icon={TrendingUp} 
              delay={0.35} 
            />
            <DashboardStatCard 
              title="Annulations" 
              value={analytics?.kpis.cancelledBookings || 0} 
              icon={XCircle} 
              delay={0.4} 
            />
            <DashboardStatCard 
              title="Note moyenne" 
              value={analytics?.kpis.averageRating.toFixed(1) || "-"} 
              icon={Star} 
              delay={0.45} 
            />
          </div>

          {/* Ligne 2 : Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardChartCard 
              title="Évolution des réservations" 
              subtitle="30 derniers jours"
              data={analytics?.trends || []} 
              type="area"
              xAxisKey="date"
              dataKeys={[{ key: 'bookings', name: 'Réservations', color: '#3b82f6' }]} 
              delay={0.5} 
              isEmpty={!analytics?.trends || analytics.trends.length === 0}
            />
            <DashboardChartCard 
              title="Commissions générées (FCFA)" 
              subtitle="30 derniers jours"
              data={analytics?.trends || []} 
              type="bar"
              xAxisKey="date"
              dataKeys={[{ key: 'platformFees', name: 'Commissions', color: '#10b981' }]} 
              delay={0.55} 
              isEmpty={!analytics?.trends || analytics.trends.length === 0}
            />
          </div>

          {/* Ligne 3 : Carte + Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DashboardMap 
                data={(analytics?.cityActivity || []).map(city => ({
                  id: city.city,
                  name: city.city,
                  value: city.bookings,
                  coordinates: getDeterministicCoordinates(city.city)
                }))} 
                delay={0.6} 
                isEmpty={!analytics?.cityActivity || analytics.cityActivity.length === 0} 
              />
            </div>
            <div className="lg:col-span-1">
              <LeaderboardCard 
                title="Top Chauffeurs" 
                subtitle="Basé sur les revenus générés"
                items={(analytics?.topDrivers || []).map(driver => ({
                  id: driver.driverId,
                  name: driver.name,
                  score: driver.totalEarnings,
                  value: `${(driver.totalEarnings || 0).toLocaleString('fr-FR')} FCFA`
                }))} 
                delay={0.65} 
                isEmpty={!analytics?.topDrivers || analytics.topDrivers.length === 0}
                onViewAll={() => router.push('/dashboard/admin/drivers')}
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
                onViewDetails={(id) => router.push(`/dashboard/admin/bookings/${id}`)}
              />
            </div>
            <div className="lg:col-span-1">
              <DashboardTimeline 
                events={(analytics?.timeline || []).map(t => ({
                  id: t.id,
                  title: t.title,
                  description: t.description,
                  date: t.createdAt,
                  type: t.type
                })) as any} 
                delay={0.75} 
                isEmpty={!analytics?.timeline || analytics.timeline.length === 0} 
              />
            </div>
          </div>

          {/* Ligne 5 : Alertes + Actions Rapides */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <DashboardAlerts 
                alerts={(analytics?.alerts || []).map(a => {
                  let action;
                  if (a.id === 'alert_pending_earnings') {
                    action = { label: 'Gérer les paiements', onClick: () => router.push('/dashboard/admin/driver-operations') };
                  } else if (a.id === 'alert_pending_kyc') {
                    action = { label: 'Vérifier les profils', onClick: () => router.push('/dashboard/admin/drivers') };
                  }
                  
                  return {
                    id: a.id,
                    type: a.type as any,
                    title: a.title,
                    message: a.message,
                    action
                  };
                })} 
                delay={0.8} 
                isEmpty={!analytics?.alerts || analytics.alerts.length === 0} 
              />
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

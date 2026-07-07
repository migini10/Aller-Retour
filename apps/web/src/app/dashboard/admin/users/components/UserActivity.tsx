
'use client';

import React from 'react';
import { DashboardTimeline, TimelineEvent } from '../../components/dashboard/DashboardTimeline';

export function UserActivity() {
  const events: TimelineEvent[] = [
    { id: '1', type: 'BookingCreated', title: 'Réservation créée', description: 'Trajet Dakar-Thiès', time: 'Hier' },
    { id: '2', type: 'PaymentSuccess', title: 'Paiement effectué', description: 'Wave - 2500 FCFA', time: 'Hier' },
  ];

  return <DashboardTimeline events={events} title="Historique d'activité" />;
}
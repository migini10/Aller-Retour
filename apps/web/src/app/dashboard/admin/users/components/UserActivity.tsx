'use client';

import React, { useEffect, useState } from 'react';
import { DashboardTimeline, TimelineEvent } from '../../components/dashboard/DashboardTimeline';
import { UsersService } from '../../services/users.service';

interface UserActivityProps {
  userId: string;
}

export function UserActivity({ userId }: UserActivityProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchActivity = async () => {
      try {
        const data = await UsersService.getUserActivity(userId);
        if (mounted) {
          // Map UserActivityEvent to TimelineEvent if needed, or use as is
          setEvents(data.map((evt: any) => ({
            id: evt.id,
            type: evt.type,
            title: evt.title,
            description: evt.description,
            time: evt.date || new Date().toLocaleDateString()
          })));
        }
      } catch (err) {
        console.error('Failed to load user activity:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchActivity();
    return () => { mounted = false; };
  }, [userId]);

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Chargement de l'activité...</div>;
  }

  if (events.length === 0) {
    return <div className="p-8 text-center text-slate-500">Aucune activité récente.</div>;
  }

  return <DashboardTimeline events={events} title="Historique d'activité" />;
}
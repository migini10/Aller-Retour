'use client';

import React from 'react';
import { TripManifest } from '../../types/trip.types';
import { AdminTable } from '../../components/tables/AdminTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Users } from 'lucide-react';

export function TripManifestView({ manifest }: { manifest: TripManifest }) {
  if (!manifest) return null;

  return (
    <div className="bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Manifeste Passagers</h3>
          <p className="text-sm text-slate-500">Liste officielle des passagers pour ce trajet.</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#1A1A1A] px-4 py-2 rounded-lg border border-slate-100 dark:border-slate-800">
          <div className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Réservations</div>
            <div className="font-bold text-slate-900 dark:text-white">
              {manifest.totalSeats - manifest.availableSeats} / {manifest.totalSeats} places
            </div>
          </div>
        </div>
      </div>

      <AdminTable
        data={manifest.passengers || []}
        columns={[
          { header: 'Passager', accessorKey: 'passengerName', cell: (p) => <div className="font-medium text-slate-900 dark:text-white">{p.passengerName}</div> },
          { header: 'Téléphone', accessorKey: 'passengerPhone' },
          { header: 'Places', accessorKey: 'seats' },
          { header: 'Point de RDV', accessorKey: 'pickupLocation', cell: (p) => p.pickupLocation || 'Non précisé' },
          { 
            header: 'Paiement', 
            accessorKey: 'paymentStatus',
            cell: (p) => <StatusBadge label={p.paymentStatus} variant={p.paymentStatus === 'PAID' || p.paymentStatus === 'SUCCESS' ? 'success' : 'warning'} />
          },
          { 
            header: 'Statut', 
            accessorKey: 'status',
            cell: (p) => <StatusBadge label={p.status} />
          }
        ]}
        keyExtractor={(p) => p.bookingId}
        emptyState={
          <div className="text-center p-8 text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            Aucun passager dans le manifeste pour le moment.
          </div>
        }
      />
    </div>
  );
}

export function TripBookingsView({ manifest }: { manifest: TripManifest }) {
  // Use the same data as manifest for now, but formatted differently if needed
  if (!manifest) return null;

  return (
    <div className="bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Réservations</h3>
          <p className="text-sm text-slate-500">Détails des réservations effectuées sur ce trajet.</p>
        </div>
      </div>

      <AdminTable
        data={manifest.passengers || []}
        columns={[
          { header: 'ID Réservation', accessorKey: 'bookingId', cell: (p) => <span className="text-xs font-mono text-slate-500">{p.bookingId.split('-')[0]}...</span> },
          { header: 'Client', accessorKey: 'passengerName', cell: (p) => <div className="font-medium">{p.passengerName}</div> },
          { header: 'Places', accessorKey: 'seats' },
          { header: 'Statut Paiement', accessorKey: 'paymentStatus', cell: (p) => <StatusBadge label={p.paymentStatus} variant={p.paymentStatus === 'SUCCESS' || p.paymentStatus === 'PAID' ? 'success' : 'warning'} /> },
          { header: 'Statut Trajet', accessorKey: 'status', cell: (p) => <StatusBadge label={p.status} /> }
        ]}
        keyExtractor={(p) => p.bookingId}
        emptyState={
          <div className="text-center p-8 text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            Aucune réservation n'a encore été effectuée.
          </div>
        }
      />
    </div>
  );
}

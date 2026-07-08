'use client';

import React, { useEffect, useState } from 'react';
import { DriverProfile, Vehicle, DriverEarning, DriverReview } from '../../types/driver.types';
import { DriversService } from '../../services/drivers.service';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { AdminTable } from '../../components/tables/AdminTable';

export function DriverVehiclesView({ driverId }: { driverId: string }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const data = await DriversService.getDriverVehicles(driverId);
      setVehicles(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [driverId]);

  const handleStatusChange = async (vehicleId: string, status: 'ACTIVE' | 'SUSPENDED') => {
    try {
      await DriversService.updateVehicleStatus(driverId, vehicleId, status);
      fetchVehicles();
    } catch (e) {
      alert('Erreur lors de la mise à jour');
    }
  };

  if (isLoading) return <div className="p-4 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl h-40"></div>;

  return (
    <div className="bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-slate-800 p-4">
      <h3 className="font-bold text-lg mb-4">Véhicules</h3>
      <AdminTable
        data={vehicles}
        columns={[
          { header: 'Marque/Modèle', accessorKey: 'make', cell: (v) => `${v.make} ${v.model} (${v.year})` },
          { header: 'Plaque', accessorKey: 'licensePlate' },
          { 
            header: 'Statut', 
            accessorKey: 'status', 
            cell: (v) => (
              <StatusBadge 
                label={v.status} 
                variant={v.status === 'ACTIVE' ? 'success' : v.status === 'SUSPENDED' ? 'error' : 'warning'} 
              />
            )
          },
          {
            header: 'Actions',
            accessorKey: 'actions',
            cell: (v) => (
              <div className="flex gap-2 text-sm">
                {v.status !== 'ACTIVE' && (
                  <button onClick={() => handleStatusChange(v.id, 'ACTIVE')} className="text-emerald-600 hover:underline">Activer</button>
                )}
                {v.status !== 'SUSPENDED' && (
                  <button onClick={() => handleStatusChange(v.id, 'SUSPENDED')} className="text-rose-600 hover:underline">Suspendre</button>
                )}
              </div>
            )
          }
        ]}
        keyExtractor={(v) => v.id}
      />
    </div>
  );
}

export function DriverEarningsView({ driverId }: { driverId: string }) {
  const [earnings, setEarnings] = useState<DriverEarning[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    DriversService.getDriverEarnings(driverId).then(setEarnings).finally(() => setIsLoading(false));
  }, [driverId]);

  if (isLoading) return <div className="p-4 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl h-40"></div>;

  return (
    <div className="bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-slate-800 p-4">
      <h3 className="font-bold text-lg mb-4">Revenus</h3>
      <AdminTable
        data={earnings}
        columns={[
          { header: 'Date', accessorKey: 'createdAt', cell: (e) => new Date(e.createdAt).toLocaleDateString() },
          { header: 'Montant', accessorKey: 'amount', cell: (e) => `${e.amount} FCFA` },
          { header: 'Statut', accessorKey: 'status', cell: (e) => <StatusBadge label={e.status} /> },
        ]}
        keyExtractor={(e) => e.id}
      />
    </div>
  );
}

export function DriverReviewsView({ driverId }: { driverId: string }) {
  const [reviews, setReviews] = useState<DriverReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    DriversService.getDriverReviews(driverId).then(setReviews).finally(() => setIsLoading(false));
  }, [driverId]);

  if (isLoading) return <div className="p-4 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl h-40"></div>;

  return (
    <div className="bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-slate-800 p-4">
      <h3 className="font-bold text-lg mb-4">Avis</h3>
      <div className="flex flex-col gap-4">
        {reviews.length === 0 ? <p className="text-slate-500">Aucun avis trouvé.</p> : reviews.map(r => (
          <div key={r.id} className="p-4 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#1A1A1A]">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{r.clientName}</span>
              <span className="text-orange-500">{'★'.repeat(Math.round(r.rating))}{'☆'.repeat(5 - Math.round(r.rating))}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

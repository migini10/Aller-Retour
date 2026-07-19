'use client';

import React, { useEffect, useState } from 'react';
import { DriverProfile, Vehicle, DriverEarning, DriverReview } from '../../types/driver.types';
import { DriversService } from '../../services/drivers.service';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { AdminTable } from '../../components/tables/AdminTable';
import { useModal } from '../../../../../components/ModalContext';

export function DriverVehiclesView({ driverId }: { driverId: string }) {
  const { showToast } = useModal();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ plateNumber: '', type: 'TAXI_5_PLACES', capacity: 5, brand: '', model: '', year: new Date().getFullYear() });

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

  const handleStatusChange = async (vehicleId: string, status: 'ACTIVE' | 'SUSPENDED' | 'APPROVED' | 'REJECTED') => {
    try {
      if (status === 'APPROVED') {
        await DriversService.approveVehicle(vehicleId);
      } else if (status === 'REJECTED') {
        await DriversService.rejectVehicle(vehicleId);
      } else {
        await DriversService.updateVehicleStatus(driverId, vehicleId, status);
      }
      fetchVehicles();
      showToast('Mise à jour réussie', 'success');
    } catch (e) {
      showToast('Erreur lors de la mise à jour', 'error');
    }
  };

  const handleCertificationChange = async (vehicleId: string, isCertifying: boolean) => {
    try {
      if (isCertifying) {
        await DriversService.certifyVehicle(vehicleId);
      } else {
        await DriversService.revokeCertification(vehicleId);
      }
      fetchVehicles();
      showToast('Certification mise à jour', 'success');
    } catch (e) {
      showToast('Erreur lors de la mise à jour de la certification', 'error');
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await DriversService.createDriverVehicle(driverId, newVehicle);
      setIsAdding(false);
      fetchVehicles();
      showToast('Véhicule ajouté avec succès', 'success');
    } catch (e) {
      showToast("Erreur lors de l'ajout du véhicule", 'error');
    }
  };

  if (isLoading) return <div className="p-4 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl h-40"></div>;

  return (
    <div className="bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-slate-800 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Véhicules</h3>
        <button onClick={() => setIsAdding(!isAdding)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold">
          {isAdding ? 'Annuler' : 'Ajouter un véhicule'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddVehicle} className="mb-6 p-4 border border-slate-200 dark:border-slate-800 rounded-lg flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Plaque d'immatriculation</label>
              <input required value={newVehicle.plateNumber} onChange={e => setNewVehicle({...newVehicle, plateNumber: e.target.value})} className="w-full p-2 border rounded-md dark:bg-slate-900" placeholder="AA-123-BB" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select value={newVehicle.type} onChange={e => setNewVehicle({...newVehicle, type: e.target.value, capacity: e.target.value === 'TAXI_7_PLACES' ? 7 : 5})} className="w-full p-2 border rounded-md dark:bg-slate-900">
                <option value="TAXI_5_PLACES">Taxi 5 Places</option>
                <option value="TAXI_7_PLACES">Taxi 7 Places</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Marque</label>
              <input value={newVehicle.brand} onChange={e => setNewVehicle({...newVehicle, brand: e.target.value})} className="w-full p-2 border rounded-md dark:bg-slate-900" placeholder="Peugeot" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Modèle</label>
              <input value={newVehicle.model} onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} className="w-full p-2 border rounded-md dark:bg-slate-900" placeholder="504" />
            </div>
          </div>
          <button type="submit" className="self-end px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold">Enregistrer le véhicule</button>
        </form>
      )}

      <AdminTable
        data={vehicles}
        columns={[
          { header: 'Marque/Modèle', accessorKey: 'make', cell: (v) => `${v.brand || ''} ${v.model || ''} (${v.year || ''})` },
          { header: 'Plaque', accessorKey: 'plateNumber' },
          { 
            header: 'Approbation', 
            accessorKey: 'approvalStatus', 
            cell: (v: any) => (
              <StatusBadge 
                label={v.approvalStatus || v.status} 
                variant={v.approvalStatus === 'APPROVED' || v.approvalStatus === 'ACTIVE' || v.status === 'APPROVED' ? 'success' : v.approvalStatus === 'REJECTED' || v.status === 'REJECTED' ? 'error' : 'warning'} 
              />
            )
          },
          { 
            header: 'Certification', 
            accessorKey: 'certificationStatus', 
            cell: (v: any) => (
              <StatusBadge 
                label={v.certificationStatus || 'NOT_CERTIFIED'} 
                variant={v.certificationStatus === 'CERTIFIED' ? 'success' : v.certificationStatus === 'REVOKED' ? 'error' : 'warning'} 
              />
            )
          },
          {
            header: 'Actions',
            accessorKey: 'actions',
            cell: (v: any) => {
              const appStatus = v.approvalStatus || v.status;
              const certStatus = v.certificationStatus || 'NOT_CERTIFIED';
              return (
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex gap-2">
                  {appStatus === 'PENDING_REVIEW' && (
                    <>
                      <button onClick={() => handleStatusChange(v.id, 'APPROVED')} className="text-emerald-600 hover:underline">Approuver</button>
                      <button onClick={() => handleStatusChange(v.id, 'REJECTED')} className="text-rose-600 hover:underline">Rejeter</button>
                    </>
                  )}
                  {(appStatus === 'APPROVED' || appStatus === 'REJECTED') && (
                    <button onClick={() => handleStatusChange(v.id, 'SUSPENDED')} className="text-slate-600 hover:underline">Suspendre</button>
                  )}
                  {appStatus === 'SUSPENDED' && (
                    <button onClick={() => handleStatusChange(v.id, 'ACTIVE')} className="text-emerald-600 hover:underline">Activer</button>
                  )}
                </div>
                <div className="flex gap-2">
                  {appStatus === 'APPROVED' && certStatus !== 'CERTIFIED' && (
                    <button onClick={() => handleCertificationChange(v.id, true)} className="text-blue-600 hover:underline font-semibold">Certifier</button>
                  )}
                  {certStatus === 'CERTIFIED' && (
                    <button onClick={() => handleCertificationChange(v.id, false)} className="text-orange-600 hover:underline font-semibold">Révoquer Certif.</button>
                  )}
                </div>
              </div>
            )}
          }
        ]}
        keyExtractor={(v: any) => v.id}
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

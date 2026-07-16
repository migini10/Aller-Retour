'use client';

import React, { useEffect, useState } from 'react';
import { Vehicle } from '../../types/driver.types';
import { DriversService } from '../../services/drivers.service';
import { StatusBadge } from '../../components/ui/StatusBadge';

export default function VehiclesView() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterApproval, setFilterApproval] = useState<string>('ALL');
  const [filterCertification, setFilterCertification] = useState<string>('ALL');

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const data = await DriversService.getAllVehicles();
      setVehicles(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleApprove = async (vehicleId: string) => {
    if (!confirm('Approuver ce véhicule ?')) return;
    try {
      await DriversService.approveVehicle(vehicleId);
      fetchVehicles();
    } catch (e) {
      alert('Erreur');
    }
  };

  const handleReject = async (vehicleId: string) => {
    const reason = prompt('Raison du rejet (optionnel) :');
    if (reason === null) return;
    try {
      await DriversService.rejectVehicle(vehicleId, reason);
      fetchVehicles();
    } catch (e) {
      alert('Erreur');
    }
  };

  const handleCertify = async (vehicleId: string) => {
    if (!confirm('Certifier ce véhicule ?')) return;
    try {
      await DriversService.certifyVehicle(vehicleId);
      fetchVehicles();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur');
    }
  };

  const handleRevoke = async (vehicleId: string) => {
    if (!confirm('Révoquer la certification de ce véhicule ?')) return;
    try {
      await DriversService.revokeCertification(vehicleId);
      fetchVehicles();
    } catch (e) {
      alert('Erreur');
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    if (filterApproval !== 'ALL' && v.approvalStatus !== filterApproval) return false;
    if (filterCertification !== 'ALL' && v.certificationStatus !== filterCertification) return false;
    return true;
  });

  if (isLoading) return <div className="p-8 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl h-64"></div>;

  return (
    <div className="bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-slate-800 p-4">
      <div className="flex gap-4 mb-6">
        <div>
          <label className="text-xs text-slate-500 block mb-1">Filtre Approbation</label>
          <select value={filterApproval} onChange={e => setFilterApproval(e.target.value)} className="p-2 border rounded-md dark:bg-slate-900 text-sm">
            <option value="ALL">Tous</option>
            <option value="PENDING_REVIEW">En attente (Pending)</option>
            <option value="APPROVED">Approuvés</option>
            <option value="REJECTED">Rejetés</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Filtre Certification</label>
          <select value={filterCertification} onChange={e => setFilterCertification(e.target.value)} className="p-2 border rounded-md dark:bg-slate-900 text-sm">
            <option value="ALL">Tous</option>
            <option value="NOT_CERTIFIED">Non Certifiés</option>
            <option value="CERTIFIED">Certifiés</option>
            <option value="REVOKED">Révoqués</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
            <tr>
              <th className="p-3 rounded-tl-lg font-medium">Chauffeur</th>
              <th className="p-3 font-medium">Plaque & Modèle</th>
              <th className="p-3 font-medium">Type</th>
              <th className="p-3 font-medium">Photos</th>
              <th className="p-3 font-medium">Approbation</th>
              <th className="p-3 font-medium">Certification</th>
              <th className="p-3 rounded-tr-lg font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredVehicles.map(v => (
              <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                <td className="p-3">
                  <div className="font-semibold">{v.owner?.user?.fullName || 'Inconnu'}</div>
                  <div className="text-xs text-slate-500">{v.owner?.user?.phone || ''}</div>
                </td>
                <td className="p-3">
                  <div className="font-bold">{v.plateNumber}</div>
                  <div className="text-xs text-slate-500">{v.brand} {v.model} ({v.year})</div>
                </td>
                <td className="p-3">
                  <div className="text-slate-700 dark:text-slate-300">{v.type === 'TAXI_5_PLACES' ? 'Taxi 5 Places' : v.type === 'TAXI_7_PLACES' ? 'Taxi 7 Places' : v.type}</div>
                  <div className="text-xs text-slate-500">{v.capacity} places</div>
                </td>
                <td className="p-3 flex gap-2">
                  {v.frontPhotoData ? <img src={v.frontPhotoData} alt="Front" className="w-10 h-10 object-cover rounded bg-slate-200" title="Avant" /> : <div className="w-10 h-10 bg-slate-100 flex items-center justify-center rounded text-[10px]">AV</div>}
                  {v.rearPhotoData ? <img src={v.rearPhotoData} alt="Rear" className="w-10 h-10 object-cover rounded bg-slate-200" title="Arrière" /> : <div className="w-10 h-10 bg-slate-100 flex items-center justify-center rounded text-[10px]">AR</div>}
                  {v.sidePhotoData ? <img src={v.sidePhotoData} alt="Side" className="w-10 h-10 object-cover rounded bg-slate-200" title="Côté" /> : <div className="w-10 h-10 bg-slate-100 flex items-center justify-center rounded text-[10px]">LAT</div>}
                </td>
                <td className="p-3">
                  <StatusBadge status={v.approvalStatus} />
                </td>
                <td className="p-3">
                  {v.certificationStatus === 'CERTIFIED' ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400">Certifié</span>
                  ) : v.certificationStatus === 'REVOKED' ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400">Révoqué</span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400">Non Certifié</span>
                  )}
                </td>
                <td className="p-3 text-right">
                  <div className="flex flex-col gap-1 items-end">
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(v.id)} className="text-xs px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded">Approuver</button>
                      <button onClick={() => handleReject(v.id)} className="text-xs px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded">Rejeter</button>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <button onClick={() => handleCertify(v.id)} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded">Certifier</button>
                      <button onClick={() => handleRevoke(v.id)} className="text-xs px-2 py-1 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded">Révoquer</button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
            {filteredVehicles.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-slate-500">Aucun véhicule trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

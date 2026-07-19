'use client';

import React, { useEffect, useState } from 'react';
import { Vehicle } from '../../types/driver.types';
import { DriversService } from '../../services/drivers.service';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useModal } from '../../../../../components/ModalContext';

const SafeImage = ({ src, alt }: { src: string | null | undefined; alt: string }) => {
  const [error, setError] = useState(false);
  useEffect(() => {
    setError(false);
  }, [src]);
  if (!src) {
    return <div className="w-full h-32 bg-slate-100 dark:bg-slate-800 flex items-center justify-center rounded-lg text-slate-400">Manquante</div>;
  }
  if (error) {
    return <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 flex items-center justify-center rounded-lg text-red-400 border border-red-200 dark:border-red-900/30 text-sm">Image inaccessible</div>;
  }
  return (
    <a href={src} target="_blank" rel="noopener noreferrer" className="block w-full h-48 rounded-lg overflow-hidden border dark:border-slate-800 hover:opacity-90 transition-opacity">
      <img src={src} alt={alt} onError={() => setError(true)} className="w-full h-full object-cover bg-slate-100" />
    </a>
  );
};

export default function VehiclesView() {
  const { showConfirmDialog, showPromptDialog, showToast } = useModal();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterApproval, setFilterApproval] = useState<string>('ALL');
  const [filterCertification, setFilterCertification] = useState<string>('ALL');
  
  // Drawer state
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const data = await DriversService.getAllVehicles();
      setVehicles(data);
      
      // If a vehicle is currently selected in the drawer, update its data
      if (selectedVehicle) {
        const updatedVehicle = data.find((v: any) => v.id === selectedVehicle.id);
        if (updatedVehicle) {
          setSelectedVehicle(updatedVehicle);
          fetchDocuments(updatedVehicle.id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDocuments = async (vehicleId: string) => {
    setIsLoadingDocs(true);
    try {
      const response = await DriversService.getVehicleDocuments(vehicleId);
      const docs = Array.isArray(response) ? response : (response?.documents || []);
      setDocuments(docs);
    } catch (e) {
      console.error('Erreur chargement documents', e);
      setDocuments([]);
    } finally {
      setIsLoadingDocs(false);
    }
  };

  const openVehicleDetails = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    fetchDocuments(vehicle.id);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleApprove = async (vehicleId: string) => {
    if (!(await showConfirmDialog('Approuver le véhicule', 'Approuver ce véhicule ?'))) return;
    try {
      await DriversService.approveVehicle(vehicleId);
      await fetchVehicles();
      showToast('Véhicule approuvé avec succès', 'success');
    } catch (e) {
      showToast("Erreur lors de l'approbation", 'error');
    }
  };

  const handleReject = async (vehicleId: string) => {
    const reason = await showPromptDialog('Rejeter le véhicule', 'Raison du rejet (optionnel) :');
    if (reason === null) return;
    try {
      await DriversService.rejectVehicle(vehicleId, reason);
      await fetchVehicles();
      showToast('Véhicule rejeté', 'success');
    } catch (e) {
      showToast('Erreur lors du rejet', 'error');
    }
  };

  const handleCertify = async (vehicleId: string) => {
    if (!(await showConfirmDialog('Certifier le véhicule', 'Le véhicule sera marqué comme certifié et pourra être priorisé.'))) return;
    try {
      await DriversService.certifyVehicle(vehicleId);
      await fetchVehicles();
      showToast('Véhicule certifié avec succès', 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Erreur lors de la certification', 'error');
    }
  };

  const handleRevoke = async (vehicleId: string) => {
    if (!(await showConfirmDialog('Révoquer', 'Révoquer la certification de ce véhicule ?', 'danger'))) return;
    try {
      await DriversService.revokeCertification(vehicleId);
      await fetchVehicles();
      showToast('Certification révoquée', 'success');
    } catch (e) {
      showToast('Erreur lors de la révocation', 'error');
    }
  };

  const filteredVehicles = vehicles.filter(v => {
    if (filterApproval !== 'ALL' && v.approvalStatus !== filterApproval) return false;
    if (filterCertification !== 'ALL' && v.certificationStatus !== filterCertification) return false;
    return true;
  });

  if (isLoading && vehicles.length === 0) return <div className="p-8 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl h-64"></div>;

  return (
    <div className="bg-white dark:bg-[#141414] rounded-xl border border-slate-200 dark:border-slate-800 p-4 relative">
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
                  <div className="text-xs text-slate-500">{v.brand} {v.model} {v.year ? `(${v.year})` : ''}</div>
                </td>
                <td className="p-3">
                  <div className="text-slate-700 dark:text-slate-300">{v.type === 'TAXI_5_PLACES' ? 'Taxi 5 Places' : v.type === 'TAXI_7_PLACES' ? 'Taxi 7 Places' : v.type}</div>
                  <div className="text-xs text-slate-500">{v.capacity} places</div>
                </td>
                <td className="p-3">
                  <StatusBadge 
                    label={v.approvalStatus === 'PENDING_REVIEW' ? 'En attente' : v.approvalStatus === 'APPROVED' ? 'Approuvé' : v.approvalStatus === 'REJECTED' ? 'Rejeté' : (v.approvalStatus || 'Inconnu')} 
                    variant={v.approvalStatus === 'APPROVED' ? 'success' : v.approvalStatus === 'REJECTED' ? 'error' : 'warning'} 
                  />
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
                  <button onClick={() => openVehicleDetails(v)} className="text-sm px-4 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-md shadow-sm transition-colors">
                    Détails
                  </button>
                </td>
              </tr>
            ))}
            {filteredVehicles.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-slate-500">Aucun véhicule trouvé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      {selectedVehicle && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setSelectedVehicle(null)}></div>
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col transform transition-transform overflow-y-auto">
            <div className="p-4 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900 sticky top-0 z-10">
              <h2 className="text-lg font-bold">Détails du Véhicule</h2>
              <button onClick={() => setSelectedVehicle(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full">
                ✕
              </button>
            </div>
            
            <div className="p-6 flex-1">
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500">Chauffeur</div>
                  <div className="font-semibold">{selectedVehicle.owner?.user?.fullName || 'Inconnu'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Téléphone</div>
                  <div className="font-semibold">{selectedVehicle.owner?.user?.phone || 'Inconnu'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Plaque</div>
                  <div className="font-bold text-lg">{selectedVehicle.plateNumber}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Véhicule</div>
                  <div className="font-semibold">{selectedVehicle.brand} {selectedVehicle.model} {selectedVehicle.year ? `(${selectedVehicle.year})` : ''}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Approbation</div>
                  <div className="mt-1">
                    <StatusBadge 
                      label={selectedVehicle.approvalStatus === 'PENDING_REVIEW' ? 'En attente' : selectedVehicle.approvalStatus === 'APPROVED' ? 'Approuvé' : selectedVehicle.approvalStatus === 'REJECTED' ? 'Rejeté' : (selectedVehicle.approvalStatus || 'Inconnu')} 
                      variant={selectedVehicle.approvalStatus === 'APPROVED' ? 'success' : selectedVehicle.approvalStatus === 'REJECTED' ? 'error' : 'warning'} 
                    />
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Certification</div>
                  <div className="mt-1">
                    {selectedVehicle.certificationStatus === 'CERTIFIED' ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400">Certifié</span>
                    ) : selectedVehicle.certificationStatus === 'REVOKED' ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400">Révoqué</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400">Non Certifié</span>
                    )}
                  </div>
                </div>
              </div>

              {selectedVehicle.approvalStatus === 'REJECTED' && selectedVehicle.rejectionReason && (
                <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/50">
                  <div className="font-semibold text-sm mb-1">Raison du rejet:</div>
                  <div className="text-sm">{selectedVehicle.rejectionReason}</div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-bold mb-4 border-b pb-2 dark:border-slate-800">Photos (Obligatoires)</h3>
                
                {selectedVehicle.photosRenewalStatus && (
                  <div className="mb-4 text-sm">
                    Statut du renouvellement : 
                    <span className={`ml-2 font-medium ${selectedVehicle.photosRenewalStatus === 'VALID' ? 'text-green-600' : selectedVehicle.photosRenewalStatus === 'EXPIRING_SOON' ? 'text-orange-500' : selectedVehicle.photosRenewalStatus === 'EXPIRED' ? 'text-red-600' : 'text-yellow-600'}`}>
                      {selectedVehicle.photosRenewalStatus}
                    </span>
                    {selectedVehicle.photosExpireAt && (
                      <span className="ml-2 text-slate-500">
                        (Expire le : {new Date(selectedVehicle.photosExpireAt).toLocaleDateString()})
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <div>
                    <div className="text-sm text-slate-500 mb-2">Avant</div>
                    <SafeImage src={selectedVehicle?.frontPhotoUrl ?? null} alt="Front" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 mb-2">Arrière</div>
                    <SafeImage src={selectedVehicle?.rearPhotoUrl ?? null} alt="Rear" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 mb-2">Latérale</div>
                    <SafeImage src={selectedVehicle?.sidePhotoUrl ?? null} alt="Side" />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-4 border-b pb-2 dark:border-slate-800">Documents Administratifs</h3>
                {isLoadingDocs ? (
                  <div className="text-sm text-slate-500 animate-pulse">Chargement des documents...</div>
                ) : documents.length === 0 ? (
                  <div className="text-sm text-slate-500">Aucun document téléchargé.</div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {documents.map((doc: any) => (
                      <div key={doc.id} className="border dark:border-slate-800 rounded-lg p-4 bg-slate-50 dark:bg-slate-800/30">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-sm">
                            {doc.type === 'REGISTRATION_CARD' ? 'Carte Grise' : doc.type === 'INSURANCE' ? 'Assurance' : doc.type === 'TECHNICAL_INSPECTION' ? 'Visite Technique' : doc.type}
                          </div>
                          <StatusBadge 
                            label={doc.status === 'PENDING_REVIEW' ? 'En attente' : doc.status === 'APPROVED' ? 'Approuvé' : 'Rejeté'} 
                            variant={doc.status === 'APPROVED' ? 'success' : doc.status === 'REJECTED' ? 'error' : 'warning'} 
                          />
                        </div>
                        {doc.expiresAt && (
                          <div className="text-xs text-slate-500 mb-2">
                            Expire le : {new Date(doc.expiresAt).toLocaleDateString()}
                          </div>
                        )}
                        <div className="flex flex-col sm:flex-row gap-3 mb-3">
                          {doc.fileUrl ? (
                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs block">
                              Voir le document {doc.type === 'REGISTRATION_CARD' && doc.backUrl ? '(Recto)' : ''}
                            </a>
                          ) : (
                            <span className="text-red-500 font-medium text-xs block">Fichier manquant</span>
                          )}
                          {doc.backUrl ? (
                            <a href={doc.backUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs block">
                              Voir le Verso
                            </a>
                          ) : null}
                        </div>
                        {doc.status !== 'APPROVED' && (
                          <div className="flex gap-2">
                            {doc.fileUrl ? (
                              <button onClick={async () => {
                                if (!(await showConfirmDialog('Approuver', 'Approuver ce document ?'))) return;
                                try {
                                  await DriversService.approveVehicleDocument(doc.id);
                                  fetchDocuments(selectedVehicle.id);
                                  showToast('Document approuvé', 'success');
                                } catch(e) {
                                  showToast("Erreur lors de l'approbation", 'error');
                                }
                              }} className="px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded text-xs font-medium dark:bg-green-900/30 dark:text-green-400">
                                Approuver
                              </button>
                            ) : (
                              <button disabled className="px-3 py-1 bg-slate-100 text-slate-400 rounded text-xs font-medium cursor-not-allowed dark:bg-slate-800 dark:text-slate-600" title="Impossible d'approuver un document sans fichier">
                                Approuver
                              </button>
                            )}
                            {doc.status !== 'REJECTED' && (
                              <button onClick={async () => {
                                const r = await showPromptDialog('Rejeter', 'Raison du rejet :');
                                if (!r) return;
                                try {
                                  await DriversService.rejectVehicleDocument(doc.id, r);
                                  fetchDocuments(selectedVehicle.id);
                                  showToast('Document rejeté', 'success');
                                } catch(e) {
                                  showToast('Erreur lors du rejet', 'error');
                                }
                              }} className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-xs font-medium dark:bg-red-900/30 dark:text-red-400">
                                Rejeter
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t dark:border-slate-800 bg-slate-50 dark:bg-slate-900 sticky bottom-0">
              <h3 className="font-semibold text-sm mb-3">Actions d'Approbation</h3>
              <div className="flex gap-3 mb-4">
                {selectedVehicle.approvalStatus === 'APPROVED' ? (
                  <button disabled className="flex-1 py-2 bg-slate-200 text-slate-500 rounded-lg font-medium cursor-not-allowed dark:bg-slate-800 dark:text-slate-500">Déjà approuvé</button>
                ) : (
                  <button onClick={() => handleApprove(selectedVehicle.id)} className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">Approuver</button>
                )}
                <button onClick={() => handleReject(selectedVehicle.id)} className="flex-1 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50">Rejeter</button>
              </div>
              <h3 className="font-semibold text-sm mb-3">Actions de Certification</h3>
              <div className="flex gap-3">
                {selectedVehicle.certificationStatus === 'CERTIFIED' ? (
                  <button disabled className="flex-1 py-2 bg-slate-200 text-slate-500 rounded-lg font-medium cursor-not-allowed dark:bg-slate-800 dark:text-slate-500">Déjà certifié</button>
                ) : (() => {
                  const hasCarteGrise = (documents || []).some(d => d?.type === 'REGISTRATION_CARD' && d?.status === 'APPROVED' && !!d?.fileUrl);
                  const hasAssurance = (documents || []).some(d => d?.type === 'INSURANCE' && d?.status === 'APPROVED' && !!d?.fileUrl);
                  const hasVisite = (documents || []).some(d => d?.type === 'TECHNICAL_INSPECTION' && d?.status === 'APPROVED' && !!d?.fileUrl);
                  const arePhotosValid = !selectedVehicle.photosExpireAt || new Date(selectedVehicle.photosExpireAt) > new Date();

                  let blockReason = "";
                  if (selectedVehicle.approvalStatus !== 'APPROVED') {
                    blockReason = "Véhicule non approuvé";
                  } else if (!arePhotosValid) {
                    blockReason = "Photos expirées";
                  } else {
                    const missing = [];
                    if (!hasCarteGrise) missing.push("Carte Grise");
                    if (!hasAssurance) missing.push("Assurance");
                    if (!hasVisite) missing.push("Visite Technique");
                    if (missing.length > 0) {
                      blockReason = `Documents manquants/invalides (${missing.join(", ")})`;
                    }
                  }

                  const isCertifiable = !blockReason;

                  return (
                    <button 
                      onClick={() => handleCertify(selectedVehicle.id)} 
                      disabled={!isCertifiable}
                      title={!isCertifiable ? `Certification bloquée : ${blockReason}` : ""}
                      className={`flex-1 py-2 rounded-lg font-medium ${isCertifiable ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50' : 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'}`}
                    >
                      Certifier
                    </button>
                  );
                })()}
                <button onClick={() => handleRevoke(selectedVehicle.id)} className="flex-1 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">Révoquer</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

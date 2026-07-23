'use client';

import React, { useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api.client';
import { useModal } from '../../../../components/ModalContext';
import { StatusBadge } from '../../admin/components/ui/StatusBadge';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MyDriversPage() {
  const { showToast } = useModal();
  const [drivers, setDrivers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchDrivers = async () => {
    setIsLoading(true);
    try {
      const data = await ApiClient.get('/v1/drivers/me/assigned-drivers');
      setDrivers(data || []);
    } catch (e: any) {
      showToast('Erreur lors du chargement de vos chauffeurs', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mes Chauffeurs</h1>
          <p className="text-sm text-slate-500">Gérez vos chauffeurs assignés</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition"
        >
          <Plus className="w-4 h-4" />
          Ajouter Chauffeur
        </button>
      </div>

      <div className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Chargement...</div>
        ) : drivers.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Vous n'avez aucun chauffeur assigné.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Chauffeur</th>
                  <th className="p-4">Téléphone</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4">Date d'ajout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {drivers.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{d.firstName} {d.lastName}</div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{d.phone}</td>
                    <td className="p-4">
                      {d.status === 'ACTIVE' ? <StatusBadge label="Actif" variant="success" /> : <StatusBadge label="Suspendu" variant="error" />}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <CreateDriverOwnerModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onSuccess={fetchDrivers} 
        />
      )}
    </div>
  );
}

function CreateDriverOwnerModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const { showToast } = useModal();
  const [formData, setFormData] = useState({ fullName: '', phone: '', temporaryPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await ApiClient.post('/v1/drivers/me/assigned', formData);
      showToast('Chauffeur assigné créé avec succès', 'success');
      onSuccess();
      onClose();
    } catch (error: any) {
      showToast(error.message || 'Erreur lors de la création', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Ajouter un Chauffeur Assigné</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom Complet</label>
            <input required type="text" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Téléphone</label>
            <input required type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mot de passe temporaire</label>
            <input required type="text" value={formData.temporaryPassword} onChange={e => setFormData({ ...formData, temporaryPassword: e.target.value })} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
            <p className="text-xs text-slate-500 mt-1">Donnez ce mot de passe à votre chauffeur pour sa première connexion.</p>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Annuler</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg disabled:opacity-50">
              {isSubmitting ? 'Création...' : 'Créer'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

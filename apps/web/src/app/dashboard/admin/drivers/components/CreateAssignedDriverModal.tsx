import React, { useState } from 'react';
import { ApiClient } from '@/lib/api.client';
import { useModal } from '../../../../../components/ModalContext';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { DriverProfile } from '../../types/driver.types';

export function CreateAssignedDriverModal({ onClose, onSuccess, owners }: { onClose: () => void, onSuccess: () => void, owners: DriverProfile[] }) {
  const { showToast } = useModal();
  const [formData, setFormData] = useState({ fullName: '', phone: '', managerId: '', temporaryPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await ApiClient.post('/v1/drivers/admin/assigned', formData);
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
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Créer Chauffeur Assigné</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Manager (OWNER)</label>
            <select required value={formData.managerId} onChange={e => setFormData({ ...formData, managerId: e.target.value })} className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
              <option value="">Sélectionnez un manager</option>
              {owners.filter(o => o.type === 'OWNER').map(o => (
                <option key={o.id} value={o.id}>{o.firstName} {o.lastName} ({o.phone})</option>
              ))}
            </select>
          </div>
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
            <p className="text-xs text-slate-500 mt-1">Le chauffeur sera invité à changer ce mot de passe à la première connexion.</p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
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

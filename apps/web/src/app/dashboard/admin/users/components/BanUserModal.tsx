import React, { useState } from 'react';
import { ShieldBan, X } from 'lucide-react';

interface BanUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  userName: string;
}

export function BanUserModal({ isOpen, onClose, onConfirm, userName }: BanUserModalProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    try {
      setIsSubmitting(true);
      await onConfirm(reason);
      setReason('');
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl w-full max-w-md shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-3 text-rose-600 dark:text-rose-500">
            <ShieldBan className="w-5 h-5" />
            <h3 className="font-bold text-lg">Bannir l'utilisateur</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Vous êtes sur le point de bannir définitivement <strong>{userName}</strong>. Veuillez préciser la raison de ce bannissement.
          </p>
          
          <div className="flex flex-col gap-2">
            <label htmlFor="reason" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Raison du bannissement <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Fraude, comportement abusif, etc."
              className="w-full min-h-[100px] p-3 bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all resize-none"
              required
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!reason.trim() || isSubmitting}
              className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isSubmitting ? 'Bannissement...' : 'Confirmer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

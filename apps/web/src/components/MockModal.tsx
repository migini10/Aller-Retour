import React, { useState } from 'react';
import { X, CheckCircle2, Loader2 } from 'lucide-react';

interface MockModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  buttonText?: string;
}

export default function MockModal({ isOpen, onClose, title, description = "Remplissez les informations ci-dessous pour continuer.", buttonText = "Valider" }: MockModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#101728] border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white bg-slate-900 rounded-full transition-colors">
          <X className="w-4 h-4" />
        </button>
        
        {success ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Opération réussie !</h3>
            <p className="text-slate-400 text-sm">Vos modifications ont été enregistrées avec succès.</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
            <p className="text-sm text-slate-400 mb-6">{description}</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 ml-1">Nom / Libellé</label>
                <input required type="text" placeholder="Entrez le nom..." className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 ml-1">Détails optionnels</label>
                <textarea rows={3} placeholder="Ajoutez des détails ici..." className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-colors resize-none" />
              </div>
              
              <button disabled={loading} type="submit" className="w-full mt-4 bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : buttonText}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

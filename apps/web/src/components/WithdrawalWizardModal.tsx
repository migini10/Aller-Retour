'use client';

import { getApiUrl } from '@/lib/config';
import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ChevronRight, Phone, User, ShieldAlert, CreditCard } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { OrangeMoneyLogo } from './OrangeMoneyLogo';

interface WithdrawalWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  maxAmount: number;
}

export default function WithdrawalWizardModal({ isOpen, onClose, maxAmount }: WithdrawalWizardModalProps) {
  const { userName, userPhone, isLoaded } = useUser();
  const [operator, setOperator] = useState<'wave' | 'orange' | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCloseAndReset = React.useCallback(() => {
    onClose();
    if (step === 3) {
      window.dispatchEvent(new Event('wallet_updated'));
      window.dispatchEvent(new Event('driver_wallet_updated'));
    }
    setTimeout(() => {
      setStep(1);
      setOperator(null);
      setFullName('');
      setPhone('');
      setAmount('');
      setErrorMessage('');
    }, 300);
  }, [onClose, step]);

  React.useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        handleCloseAndReset();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [step, handleCloseAndReset]);

  useEffect(() => {
    if (isOpen) {
      const storedName = localStorage.getItem('userName') || 'Utilisateur';
      const storedPhone = localStorage.getItem('userPhone') || '';
      
      // Try to read from current user session object too
      const storedUser = localStorage.getItem('ar_auth_user');
      let sessionName = '';
      let sessionPhone = '';
      try {
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          sessionName = parsed.fullName || '';
          sessionPhone = parsed.phone || '';
        }
      } catch (e) {}

      setFullName(sessionName || storedName);
      setPhone(sessionPhone || storedPhone);
    }
  }, [isOpen, isLoaded, userName, userPhone]);

  if (!isOpen) return null;

  const handleWithdrawalAPI = async () => {
    setErrorMessage('');
    const numericAmount = parseInt(amount, 10);
    
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMessage('Veuillez entrer un montant valide.');
      return;
    }

    if (numericAmount > maxAmount) {
      setErrorMessage(`Solde insuffisant. Vous pouvez retirer jusqu'à ${maxAmount.toLocaleString('fr-FR')} F.`);
      return;
    }

    setLoading(true);
    try {
      const activeToken = localStorage.getItem('ar_auth_token');
      const base = getApiUrl();
      const apiUrl = base.endsWith('/v1') ? base : `${base}/v1`;

      const response = await fetch(`${apiUrl}/wallets/driver-withdrawal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({
          operator,
          amount: numericAmount,
          phone,
          fullName
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        setErrorMessage(resData.message || 'Le retrait a échoué. Veuillez réessayer.');
        return;
      }
      
      setStep(3);
      window.dispatchEvent(new Event('wallet_updated'));
      window.dispatchEvent(new Event('driver_wallet_updated'));
    } catch (e) {
      setErrorMessage('Une erreur est survenue lors du traitement du retrait. Veuillez vérifier votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (step === 1 && operator) setStep(2);
    else if (step === 2 && fullName && phone && amount) {
      await handleWithdrawalAPI();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={handleCloseAndReset}
      />
      
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-[#2A2A2A] flex justify-between items-center bg-slate-50/50 dark:bg-[#141414]/50">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {step === 3 ? 'Retrait réussi !' : 'Retirer mes gains'}
            </h2>
            {step < 3 && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Étape {step} sur 2 • Solde disponible : {maxAmount.toLocaleString('fr-FR')} F</p>}
          </div>
          <button 
            onClick={handleCloseAndReset}
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-[#222222] border border-slate-200 dark:border-[#333333] rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center gap-3 text-sm font-semibold">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Choisissez l'opérateur de réception</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Wave Option */}
                <button 
                  onClick={() => setOperator('wave')}
                  className={`relative p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-4 ${
                    operator === 'wave' 
                      ? 'border-[#1da1f2] bg-[#1da1f2]/5' 
                      : 'border-slate-200 dark:border-[#333333] hover:border-[#1da1f2]/50 bg-white dark:bg-[#141414]'
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-[#1da1f2] flex items-center justify-center shadow-lg">
                    <svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mt-1">
                      <rect x="50" y="20" width="100" height="190" rx="50" fill="black"/>
                      <rect x="20" y="80" width="40" height="90" rx="20" transform="rotate(-40 20 80)" fill="black"/>
                      <ellipse cx="100" cy="140" rx="28" ry="55" fill="white"/>
                      <circle cx="82" cy="55" r="7" fill="white"/>
                      <circle cx="118" cy="55" r="7" fill="white"/>
                      <path d="M75 80 Q100 98 125 80 Q100 70 75 80Z" fill="#F7931E"/>
                      <ellipse cx="75" cy="220" rx="22" ry="12" fill="#F7931E"/>
                      <ellipse cx="125" cy="220" rx="22" ry="12" fill="#F7931E"/>
                    </svg>
                  </div>
                  <span className={`font-bold ${operator === 'wave' ? 'text-[#1da1f2]' : 'text-slate-700 dark:text-slate-300'}`}>
                    Wave Mobile Money
                  </span>
                </button>

                {/* Orange Money Option */}
                <button 
                  onClick={() => setOperator('orange')}
                  className={`relative p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-4 ${
                    operator === 'orange' 
                      ? 'border-[#ff6600] bg-[#ff6600]/5' 
                      : 'border-slate-200 dark:border-[#333333] hover:border-[#ff6600]/50 bg-white dark:bg-[#141414]'
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-[#ff6600] flex items-center justify-center shadow-lg">
                    <OrangeMoneyLogo className="w-12 h-12" />
                  </div>
                  <span className={`font-bold ${operator === 'orange' ? 'text-[#ff6600]' : 'text-slate-700 dark:text-slate-300'}`}>
                    Orange Money
                  </span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nom complet (bénéficiaire vérifié)</label>
                <div className="relative">
                  <User className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    readOnly
                    className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-[#333333] rounded-xl outline-none transition-all dark:text-slate-400 cursor-not-allowed opacity-80"
                    value={fullName}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Numéro de téléphone de réception (non modifiable)</label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    type="tel" 
                    readOnly
                    className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-[#333333] rounded-xl outline-none transition-all dark:text-slate-400 cursor-not-allowed opacity-80"
                    value={phone}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Montant à retirer (FCFA)</label>
                <div className="relative">
                  <CreditCard className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    type="number" 
                    max={maxAmount}
                    placeholder={`Max: ${maxAmount}`}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#333333] rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all dark:text-white font-bold"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-8 flex flex-col items-center justify-center text-center animate-scale-in">
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Transfert initié</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
                Votre demande de retrait de <strong className="text-slate-900 dark:text-white font-bold">{parseInt(amount, 10).toLocaleString('fr-FR')} FCFA</strong> via <strong>{operator === 'wave' ? 'Wave' : 'Orange Money'}</strong> a été transmise aux services de l'opérateur.
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-xs mt-6">Cette fenêtre se fermera automatiquement dans quelques secondes.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {step < 3 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-[#2A2A2A] flex justify-between gap-4 bg-slate-50/50 dark:bg-[#141414]/50">
            {step === 2 && (
              <button 
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-white dark:bg-[#222222] border border-slate-200 dark:border-[#333333] rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2a2a2a] transition-colors"
              >
                Retour
              </button>
            )}
            
            <button 
              disabled={loading || (step === 1 && !operator) || (step === 2 && (!fullName || !phone || !amount))}
              onClick={handleNext}
              className={`flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Traitement en cours...</span>
                </>
              ) : (
                <>
                  <span>{step === 1 ? 'Suivant' : 'Confirmer le retrait'}</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

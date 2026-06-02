'use client';

import React, { useState } from 'react';
import { X, ArrowRight, User, Phone, CheckCircle2, AlertCircle, Lock, Shield } from 'lucide-react';

interface TransferWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TransferWizardModal({ isOpen, onClose }: TransferWizardModalProps) {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [accessCode, setAccessCode] = useState('');

  React.useEffect(() => {
    const cleanPhone = phone.replace(/\s/g, '');
    if (cleanPhone.length >= 9) {
      // Simulation d'un appel API pour récupérer le nom du voyageur
      setRecipientName('Mamadou Ndiaye');
    } else {
      setRecipientName('');
    }
  }, [phone]);

  const handleCloseAndReset = React.useCallback(() => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setPhone('');
      setAmount('');
      setAccessCode('');
    }, 300);
  }, [onClose]);

  React.useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        handleCloseAndReset();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [step, handleCloseAndReset]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1 && phone && amount) setStep(2);
    else if (step === 2 && accessCode.length >= 4) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(3); // Success
      }, 1500);
    }
  };

  const parsedAmount = parseInt(amount, 10) || 0;
  const fee = Math.ceil(parsedAmount * 0.01);
  const total = parsedAmount + fee;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={handleCloseAndReset}
      />
      
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-[#222222]">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Transférer du solde</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Envoyez de l'argent à un autre voyageur
            </p>
          </div>
          <button 
            onClick={handleCloseAndReset}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#222222] flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Numéro du destinataire</label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      type="tel" 
                      placeholder="Ex: 77 123 45 67"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#333333] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  {recipientName && (
                    <div className="mt-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg p-3 flex items-center gap-3 animate-fade-in">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-green-600 dark:text-green-500" />
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Destinataire trouvé : </span>
                        <strong className="text-slate-900 dark:text-white">{recipientName}</strong>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Montant à envoyer (FCFA)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="0"
                      className="w-full px-4 py-3.5 bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#333333] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white text-lg font-bold"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">XOF</span>
                  </div>
                </div>
              </div>

              {parsedAmount > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">Frais de transfert (1%)</p>
                    <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-0.5">Un montant de {fee} FCFA sera déduit de votre compte en plus du transfert.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in text-center">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Confirmation</h3>
              <p className="text-slate-500 dark:text-slate-400">
                Vous êtes sur le point de transférer des fonds à <br/>
                <strong className="text-slate-900 dark:text-white text-lg">{recipientName || phone}</strong>
                {recipientName && <span className="block text-sm">({phone})</span>}
              </p>

              <div className="bg-slate-50 dark:bg-[#141414] rounded-2xl p-5 mt-6 border border-slate-100 dark:border-[#222222] text-left space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Montant envoyé</span>
                  <span className="font-bold text-slate-900 dark:text-white">{parsedAmount} FCFA</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Frais (1%)</span>
                  <span className="font-bold text-slate-900 dark:text-white">{fee} FCFA</span>
                </div>
                <div className="pt-3 border-t border-slate-200 dark:border-[#333333] flex justify-between items-center">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Total à débiter</span>
                  <span className="text-xl font-black text-blue-600 dark:text-blue-500">{total} FCFA</span>
                </div>
              </div>

              <div className="mt-6 text-left">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Code d'accès secret</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    type="password" 
                    maxLength={4}
                    placeholder="Entrez votre code à 4 chiffres"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-[#333333] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all dark:text-white font-mono tracking-widest text-lg"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5"/> Requis pour sécuriser la transaction</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-8 text-center animate-fade-in">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Transfert réussi !</h3>
              <p className="text-slate-500 dark:text-slate-400">
                Les fonds ont été transférés avec succès au numéro {phone}.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {step < 3 ? (
          <div className="p-6 border-t border-slate-100 dark:border-[#222222] bg-slate-50 dark:bg-[#141414] flex gap-4">
            <button 
              onClick={step === 1 ? handleCloseAndReset : () => setStep(1)}
              className="flex-1 py-3.5 px-4 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333333] text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-[#222222] transition-colors"
            >
              {step === 1 ? 'Annuler' : 'Retour'}
            </button>
            <button 
              onClick={handleNext}
              disabled={loading || (step === 1 && (!phone || !amount)) || (step === 2 && accessCode.length < 4)}
              className="flex-1 py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : step === 1 ? (
                'Suivant'
              ) : (
                'Confirmer le transfert'
              )}
            </button>
          </div>
        ) : (
          <div className="p-6 border-t border-slate-100 dark:border-[#222222] bg-slate-50 dark:bg-[#141414]">
            <button 
              onClick={handleCloseAndReset}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors"
            >
              Terminer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

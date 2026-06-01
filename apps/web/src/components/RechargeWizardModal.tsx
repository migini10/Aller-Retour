'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ChevronRight, Phone, User, CreditCard } from 'lucide-react';

interface RechargeWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RechargeWizardModal({ isOpen, onClose }: RechargeWizardModalProps) {
  const [operator, setOperator] = useState<'wave' | 'orange' | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1 && operator) setStep(2);
    else if (step === 2 && fullName && phone && amount) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(3); // Success
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-[#2A2A2A] flex justify-between items-center bg-slate-50/50 dark:bg-[#141414]/50">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {step === 3 ? 'Recharge réussie' : 'Recharger mon Wallet'}
            </h2>
            {step < 3 && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Étape {step} sur 2</p>}
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-[#222222] border border-slate-200 dark:border-[#333333] rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Choisissez votre opérateur</h3>
              
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
                    {/* Simplified Wave-like logo (using text for placeholder) */}
                    <span className="text-white font-black text-2xl tracking-tighter">wave</span>
                  </div>
                  <span className={`font-bold ${operator === 'wave' ? 'text-[#1da1f2]' : 'text-slate-700 dark:text-slate-300'}`}>
                    Wave Mobile Money
                  </span>
                  {operator === 'wave' && (
                    <div className="absolute top-3 right-3 text-[#1da1f2]">
                      <CheckCircle2 className="w-6 h-6 fill-current text-white" />
                    </div>
                  )}
                </button>

                {/* Orange Option */}
                <button 
                  onClick={() => setOperator('orange')}
                  className={`relative p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-4 ${
                    operator === 'orange' 
                      ? 'border-[#ff7900] bg-[#ff7900]/5' 
                      : 'border-slate-200 dark:border-[#333333] hover:border-[#ff7900]/50 bg-white dark:bg-[#141414]'
                  }`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#000000] flex items-center justify-center shadow-lg overflow-hidden border border-[#ff7900]/20">
                    <div className="w-8 h-8 bg-[#ff7900]"></div>
                  </div>
                  <span className={`font-bold ${operator === 'orange' ? 'text-[#ff7900]' : 'text-slate-700 dark:text-slate-300'}`}>
                    Orange Money
                  </span>
                  {operator === 'orange' && (
                    <div className="absolute top-3 right-3 text-[#ff7900]">
                      <CheckCircle2 className="w-6 h-6 fill-current text-white" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-[#222222] bg-slate-50 dark:bg-[#141414]">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${operator === 'wave' ? 'bg-[#1da1f2]' : 'bg-black border border-[#ff7900]/30'}`}>
                   {operator === 'wave' ? (
                     <span className="text-white font-black text-sm tracking-tighter">wave</span>
                   ) : (
                     <div className="w-5 h-5 bg-[#ff7900]"></div>
                   )}
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Recharge via</p>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {operator === 'wave' ? 'Wave Mobile Money' : 'Orange Money'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nom Complet</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: Abdoulaye Ndiaye"
                      className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333333] rounded-xl focus:border-slate-500 dark:focus:border-slate-400 outline-none transition-colors text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Numéro de Téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ex: 77 123 45 67"
                      className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333333] rounded-xl focus:border-slate-500 dark:focus:border-slate-400 outline-none transition-colors text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Montant à Recharger (FCFA)</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Ex: 10000"
                      className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333333] rounded-xl focus:border-slate-500 dark:focus:border-slate-400 outline-none transition-colors text-slate-900 dark:text-white font-black text-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="py-8 flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Demande Envoyée !</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                Veuillez valider le paiement de <strong className="text-slate-900 dark:text-white">{amount} FCFA</strong> sur votre téléphone via l'application {operator === 'wave' ? 'Wave' : 'Orange Money'}.
              </p>
              <button 
                onClick={onClose}
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-8 py-3.5 rounded-xl transition-colors hover:bg-slate-800 dark:hover:bg-slate-100"
              >
                Retour au Wallet
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step < 3 && (
          <div className="p-6 border-t border-slate-100 dark:border-[#2A2A2A] bg-slate-50/50 dark:bg-[#141414]/50 flex justify-between gap-4">
            {step === 2 && (
              <button 
                onClick={() => setStep(1)}
                className="px-6 py-3.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#222222] transition-colors"
              >
                Retour
              </button>
            )}
            <button 
              onClick={handleNext}
              disabled={
                (step === 1 && !operator) || 
                (step === 2 && (!fullName || !phone || !amount)) ||
                loading
              }
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all ${
                operator === 'wave' ? 'bg-[#1da1f2] hover:bg-[#1da1f2]/90 text-white' :
                operator === 'orange' ? 'bg-[#ff7900] hover:bg-[#ff7900]/90 text-white' :
                'bg-slate-900 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed ml-auto`}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  {step === 1 ? 'Suivant' : 'Confirmer le paiement'}
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

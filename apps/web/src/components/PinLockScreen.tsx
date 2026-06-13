'use client';

import React, { useState, useEffect } from 'react';
import { CarFront, Lock, ShieldCheck, Fingerprint } from 'lucide-react';

interface PinLockScreenProps {
  onUnlock: () => void;
}

export default function PinLockScreen({ onUnlock }: PinLockScreenProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const correctPin = '1234'; // Simulated PIN code for this demonstration

  useEffect(() => {
    // Check if WebAuthn is available. We force it to true for the prototype demonstration
    // so the user can test the simultaneous PIN & Biometric UI.
    setBiometricAvailable(true);
  }, []);

  const handleBiometricAuth = async () => {
    try {
      setIsAuthenticating(true);
      
      // We simulate a tiny delay to represent the OS prompt
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real environment, we would use navigator.credentials.create(...)
      // But for this prototype, we immediately unlock
      onUnlock();
    } catch (err) {
      console.error("Biometric auth failed or cancelled", err);
      setError(true);
      setTimeout(() => setError(false), 2000);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleNumberClick = (num: number) => {
    if (pin.length < 4) {
      const newPin = pin + num.toString();
      setPin(newPin);
      setError(false);
      
      if (newPin.length === 4) {
        if (newPin === correctPin) {
          setTimeout(onUnlock, 300);
        } else {
          setError(true);
          setTimeout(() => setPin(''), 500);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 dark:bg-[#0B0F19] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* App Logo */}
        <div className="w-20 h-20 bg-orange-600/10 border-2 border-orange-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(234,88,12,0.1)]">
          <CarFront className="w-10 h-10 text-orange-500" />
        </div>
        
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-2 text-center">
          Aller<span className="text-orange-500">Retour</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-10 flex items-center gap-2">
          <Lock className="w-4 h-4" /> Espace Sécurisé
        </p>

        {/* PIN Indicators */}
        <div className={`flex gap-4 mb-12 ${error ? 'animate-shake' : ''}`}>
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                pin.length > i 
                  ? error 
                    ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' 
                    : 'bg-orange-500 shadow-[0_0_10px_rgba(234,88,12,0.5)]'
                  : 'bg-slate-200 dark:bg-slate-800'
              }`} 
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-6 w-full max-w-[280px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="w-16 h-16 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 text-2xl font-semibold text-slate-800 dark:text-white flex items-center justify-center hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-500/30 hover:text-orange-600 dark:hover:text-orange-400 transition-colors active:scale-95"
            >
              {num}
            </button>
          ))}
          
          <button
            onClick={biometricAvailable ? handleBiometricAuth : undefined}
            disabled={!biometricAvailable || isAuthenticating}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors active:scale-95 ${
              biometricAvailable 
                ? 'text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20' 
                : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
            }`}
          >
            <Fingerprint className={`w-8 h-8 ${isAuthenticating ? 'animate-pulse' : ''}`} />
          </button>
          
          <button
            onClick={() => handleNumberClick(0)}
            className="w-16 h-16 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 text-2xl font-semibold text-slate-800 dark:text-white flex items-center justify-center hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-500/30 hover:text-orange-600 dark:hover:text-orange-400 transition-colors active:scale-95"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="w-16 h-16 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors active:scale-95"
          >
            <span className="text-sm font-bold tracking-widest">SUPP</span>
          </button>
        </div>

        {/* Error Message */}
        <div className={`mt-8 text-sm font-medium text-rose-500 h-5 transition-opacity ${error ? 'opacity-100' : 'opacity-0'}`}>
          Code PIN incorrect (Essayer 1234)
        </div>

        {/* Info */}
        <div className="mt-auto pt-12 flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Protégé par le système de sécurité Allogoo
        </div>
      </div>
    </div>
  );
}

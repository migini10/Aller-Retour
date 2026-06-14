'use client';

import React, { useState, useEffect } from 'react';
import { CarFront, Lock, ShieldCheck, Fingerprint } from 'lucide-react';

interface PinLockScreenProps {
  onUnlock: () => void;
}

export default function PinLockScreen({ onUnlock }: PinLockScreenProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState('Code PIN incorrect');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/v1` : 'http://localhost:3333/v1';

  const handleBiometricAuth = async () => {
    try {
      setIsAuthenticating(true);
      
      // Simulate OS biometric prompt delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onUnlock();
    } catch (err) {
      console.error("Biometric auth failed or cancelled", err);
      setError(true);
      setTimeout(() => setError(false), 2000);
    } finally {
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
    const useBiometrics = localStorage.getItem('ar_use_biometrics') === 'true';
    if (useBiometrics) {
      setBiometricAvailable(true);
      // Put biometrics first: automatically trigger biometric prompt on load
      handleBiometricAuth();
    } else {
      setBiometricAvailable(false);
    }
  }, []);

  const handleNumberClick = async (num: number) => {
    if (pin.length < 6) {
      const newPin = pin + num.toString();
      setPin(newPin);
      setError(false);
      
      if (newPin.length === 6) {
        setIsAuthenticating(true);
        try {
          const phone = localStorage.getItem('userPhone') || '';
          const res = await fetch(`${API_URL}/auth/login-mobile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, pin: newPin })
          });
          
          if (res.ok) {
            setTimeout(onUnlock, 300);
          } else {
            const data = await res.json();
            setErrorText(data.message || 'Code PIN incorrect');
            setError(true);
            setTimeout(() => setPin(''), 500);
          }
        } catch (err) {
          setErrorText('Impossible de contacter le serveur');
          setError(true);
          setTimeout(() => setPin(''), 500);
        } finally {
          setIsAuthenticating(false);
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
          {[...Array(6)].map((_, i) => (
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
        <div className={`mt-8 text-sm font-medium text-rose-500 text-center max-w-xs transition-opacity ${error ? 'opacity-100' : 'opacity-0'}`}>
          {errorText}
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

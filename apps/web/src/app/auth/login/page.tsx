'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CarFront, Phone, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../components/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/v1` : 'http://localhost:3333/v1';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  // View mode
  const [mode, setMode] = useState<'LOGIN' | 'FORGOT' | 'RESET'>('LOGIN');

  // Form states
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password recovery states
  const [resetPhone, setResetPhone] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPin, setNewPin] = useState('');
  const [showNewPin, setShowNewPin] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) return;

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await login(phone.trim(), password.trim());
      if (res.success) {
        router.push('/dashboard/client');
      } else {
        setErrorMsg(res.message || 'Numéro de téléphone ou code PIN incorrect.');
      }
    } catch (err) {
      setErrorMsg('Impossible de se connecter au serveur.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPhone) return;

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: resetPhone.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message || 'Un code de vérification a été envoyé à votre adresse e-mail.');
        setMode('RESET');
      } else {
        setErrorMsg(data.message || 'Une erreur est survenue.');
      }
    } catch (err) {
      setErrorMsg('Impossible de contacter le serveur.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPhone || !resetCode || !newPin) return;

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: resetPhone.trim(),
          code: resetCode.trim(),
          newPin: newPin.trim()
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg('Votre code PIN a été modifié avec succès. Vous pouvez maintenant vous connecter.');
        setPhone(resetPhone);
        setMode('LOGIN');
        // Clear recovery fields
        setResetCode('');
        setNewPin('');
      } else {
        setErrorMsg(data.message || 'Une erreur est survenue.');
      }
    } catch (err) {
      setErrorMsg('Impossible de contacter le serveur.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800/30 flex items-center justify-center w-28 h-20">
            <img 
              src="/logo-allogoo.png" 
              alt="Allogoo Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 dark:text-white">
          Bienvenue sur <span className="text-orange-500">Allogoo</span>
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          {mode === 'LOGIN' && 'Connectez-vous pour accéder à votre espace sécurisé'}
          {mode === 'FORGOT' && 'Récupérez l\'accès à votre compte'}
          {mode === 'RESET' && 'Choisissez votre nouveau code PIN de sécurité'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900/50 py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-200 dark:border-slate-800/50">
          
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs text-center font-medium">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs text-center font-medium">
              {successMsg}
            </div>
          )}

          {mode === 'LOGIN' && (
            <form className="space-y-6 animate-in fade-in duration-300" onSubmit={handleLogin}>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Numéro de téléphone
                </label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-orange-500" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white sm:text-sm transition-colors"
                    placeholder="Ex: +221 77 123 45 67"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Code PIN (6 chiffres)
                </label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-orange-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    maxLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white sm:text-sm transition-colors font-mono tracking-widest"
                    placeholder="••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-slate-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900 dark:text-slate-300">
                    Se souvenir de moi
                  </label>
                </div>

                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('FORGOT');
                      setErrorMsg('');
                      setSuccessMsg('');
                      setResetPhone(phone);
                    }}
                    className="font-medium text-orange-600 hover:text-orange-500 bg-transparent border-0 outline-none cursor-pointer"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-70 group"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      Se connecter <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </div>
            </form>
          )}

          {mode === 'FORGOT' && (
            <form className="space-y-6 animate-in fade-in duration-300" onSubmit={handleForgotPassword}>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Saisissez votre numéro de téléphone. Si un compte y est associé, nous vous enverrons un e-mail contenant un code de réinitialisation à 6 chiffres.
              </p>
              <div>
                <label htmlFor="resetPhone" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Numéro de téléphone
                </label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-orange-500" />
                  </div>
                  <input
                    id="resetPhone"
                    name="resetPhone"
                    type="tel"
                    required
                    value={resetPhone}
                    onChange={(e) => setResetPhone(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white sm:text-sm transition-colors"
                    placeholder="Ex: +221 77 123 45 67"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isLoading || !resetPhone}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Envoyer le code</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('LOGIN');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="w-full flex justify-center py-3 px-4 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 bg-transparent transition-colors"
                >
                  <span className="flex items-center gap-1.5"><ArrowLeft className="w-4 h-4" /> Retour</span>
                </button>
              </div>
            </form>
          )}

          {mode === 'RESET' && (
            <form className="space-y-6 animate-in fade-in duration-300" onSubmit={handleResetPassword}>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Saisissez le code de validation reçu et choisissez votre nouveau code PIN de sécurité à 6 chiffres.
              </p>
              <div>
                <label htmlFor="resetCode" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Code de validation (6 chiffres)
                </label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-orange-500" />
                  </div>
                  <input
                    id="resetCode"
                    name="resetCode"
                    type="text"
                    required
                    maxLength={6}
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white sm:text-sm transition-colors font-mono tracking-widest"
                    placeholder="••••••"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="newPin" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nouveau code PIN (6 chiffres)
                </label>
                <div className="mt-2 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-orange-500" />
                  </div>
                  <input
                    id="newPin"
                    name="newPin"
                    type={showNewPin ? 'text' : 'password'}
                    required
                    maxLength={6}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-orange-500 focus:border-orange-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white sm:text-sm transition-colors font-mono tracking-widest"
                    placeholder="••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowNewPin(!showNewPin)}
                      className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 focus:outline-none"
                    >
                      {showNewPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={isLoading || !resetCode || !newPin}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span>Réinitialiser mon PIN</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('FORGOT');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="w-full flex justify-center py-3 px-4 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 bg-transparent transition-colors"
                >
                  <span className="flex items-center gap-1.5"><ArrowLeft className="w-4 h-4" /> Retour</span>
                </button>
              </div>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-900/50 text-slate-500">
                  Nouveau sur Allogoo ?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/auth/register"
                className="w-full flex justify-center py-3 px-4 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

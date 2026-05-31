'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { X, Smartphone, User, Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

interface UserData {
  id: string;
  phone: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (phone: string, pin: string) => Promise<{ success: boolean; message?: string }>;
  register: (phone: string, fullName: string, pin: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  openAuthModal: (callback?: () => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [authCallback, setAuthCallback] = useState<(() => void) | null>(null);
  
  // Forms state
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('ar_auth_token');
      const storedUser = localStorage.getItem('ar_auth_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {}
  }, []);

  const API_URL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/v1` : 'http://localhost:3333/v1';

  const saveAuth = (tokenData: string, userData: any) => {
    localStorage.setItem('ar_auth_token', tokenData);
    localStorage.setItem('ar_auth_user', JSON.stringify(userData));
    setToken(tokenData);
    setUser(userData);
  };

  const login = async (phone: string, pin: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login-mobile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, pin })
      });
      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, message: data.message || "Erreur de connexion" };
      }
      
      saveAuth(data.token, data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: "Impossible de contacter le serveur." };
    }
  };

  const register = async (phone: string, fullName: string, pin: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, fullName, pin })
      });
      const data = await res.json();
      
      if (!res.ok) {
        return { success: false, message: data.message || "Erreur d'inscription" };
      }
      
      saveAuth(data.token, data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: "Impossible de contacter le serveur." };
    }
  };

  const logout = () => {
    localStorage.removeItem('ar_auth_token');
    localStorage.removeItem('ar_auth_user');
    setToken(null);
    setUser(null);
  };

  const openAuthModal = (callback?: () => void) => {
    if (callback) setAuthCallback(() => callback);
    setIsModalOpen(true);
    setPhone('');
    setPin('');
    setFullName('');
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    let res;
    if (modalMode === 'LOGIN') {
      res = await login(phone, pin);
    } else {
      res = await register(phone, fullName, pin);
    }

    setIsLoading(false);
    
    if (res.success) {
      setIsModalOpen(false);
      if (authCallback) {
        authCallback();
        setAuthCallback(null);
      }
    } else {
      setErrorMsg(res.message || "Une erreur est survenue");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, register, logout, openAuthModal }}>
      {children}

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative w-full max-w-sm bg-[#050A15] sm:rounded-3xl border border-slate-800/80 shadow-2xl p-6 animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-900 rounded-full border border-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-6 mt-2">
              <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6 text-orange-500" />
              </div>
              <h2 className="text-xl font-bold text-white">
                {modalMode === 'LOGIN' ? 'Bon retour !' : 'Créer un compte'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {modalMode === 'LOGIN' ? 'Saisissez votre numéro pour continuer' : 'Rejoignez la révolution de la mobilité'}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs text-center font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {modalMode === 'REGISTER' && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">Nom complet</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="Ex: Abdou Bakhe"
                      className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">Numéro de téléphone</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+221 77 000 00 00"
                    className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">Code PIN (6 chiffres)</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="password" 
                    required
                    maxLength={6}
                    value={pin}
                    onChange={e => setPin(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white tracking-widest focus:outline-none focus:border-orange-500 transition-colors font-mono"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(234,88,12,0.3)] flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    <span>{modalMode === 'LOGIN' ? 'Se connecter' : 'S\'inscrire'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button 
                onClick={() => {
                  setModalMode(modalMode === 'LOGIN' ? 'REGISTER' : 'LOGIN');
                  setErrorMsg('');
                }}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                {modalMode === 'LOGIN' ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

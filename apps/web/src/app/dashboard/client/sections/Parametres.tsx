'use client';
import { getApiUrl } from '@/lib/config';
import React, { useState, useEffect } from 'react';
import { Settings, User, Lock, Globe, CreditCard, Trash2, Save, Eye, EyeOff, Sun, Moon, ShieldCheck } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useUser } from '../../../../hooks/useUser';

const sections = ['Profil', 'Sécurité', 'Préférences', 'Paiements', 'Compte'];

export default function SectionParametres() {
  const [tab, setTab] = useState('Profil');
  const [showPwd, setShowPwd] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { userName, userPhone, updateUser, isLoaded } = useUser();
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Biometric / PIN Lock Settings States
  const [appLockEnabled, setAppLockEnabled] = useState(false);
  const [useBiometrics, setUseBiometrics] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [confirmPinVal, setConfirmPinVal] = useState('');
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);
  const [pinError, setPinError] = useState('');
  const [pendingToggle, setPendingToggle] = useState<{ type: 'appLock' | 'biometrics', value: boolean } | null>(null);

  useEffect(() => {
    setAppLockEnabled(localStorage.getItem('ar_app_lock_enabled') === 'true');
    setUseBiometrics(localStorage.getItem('ar_use_biometrics') === 'true');
  }, []);

  const handleToggleAppLock = (checked: boolean) => {
    setPendingToggle({ type: 'appLock', value: checked });
    setConfirmPinVal('');
    setPinError('');
    setShowConfirmPin(true);
  };

  const handleToggleBiometrics = (checked: boolean) => {
    setPendingToggle({ type: 'biometrics', value: checked });
    setConfirmPinVal('');
    setPinError('');
    setShowConfirmPin(true);
  };

  const handleConfirmPin = async () => {
    if (!pendingToggle) return;
    if (confirmPinVal.length !== 6) {
      setPinError('Le code PIN doit comporter 6 chiffres.');
      return;
    }
    
    setIsVerifyingPin(true);
    setPinError('');
    
    try {
      const phone = localStorage.getItem('userPhone') || '';
      const API_URL = `${getApiUrl()}/v1`;
      
      const res = await fetch(`${API_URL}/auth/login-mobile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, pin: confirmPinVal })
      });
      
      if (res.ok) {
        if (pendingToggle.type === 'appLock') {
          localStorage.setItem('ar_app_lock_enabled', pendingToggle.value ? 'true' : 'false');
          setAppLockEnabled(pendingToggle.value);
          if (!pendingToggle.value) {
            localStorage.setItem('ar_use_biometrics', 'false');
            setUseBiometrics(false);
          }
          alert(`Verrouillage de l'application ${pendingToggle.value ? 'activé' : 'désactivé'} avec succès !`);
        } else {
          localStorage.setItem('ar_use_biometrics', pendingToggle.value ? 'true' : 'false');
          setUseBiometrics(pendingToggle.value);
          alert(`Sécurité biométrique ${pendingToggle.value ? 'activée' : 'désactivée'} avec succès !`);
        }
        setShowConfirmPin(false);
        setPendingToggle(null);
      } else {
        const data = await res.json();
        setPinError(data.message || 'Code PIN incorrect.');
      }
    } catch (err) {
      setPinError('Impossible de se connecter au serveur.');
    } finally {
      setIsVerifyingPin(false);
    }
  };
  
  useEffect(() => {
    if (isLoaded) {
      setEditName(userName);
      setEditPhone(userPhone);
    }
  }, [isLoaded, userName, userPhone]);

  useEffect(() => setMounted(true), []);

  const handleSave = () => {
    updateUser(editName, editPhone);
    alert('Profil mis à jour avec succès !');
  };

  const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors"><Settings className="w-5 h-5 text-[#003B73] dark:text-orange-400" /> Profil & Paramètres</h2>

      <div className="flex gap-2 flex-wrap">
        {sections.map(s => (
          <button key={s} onClick={() => setTab(s)} className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${tab === s ? 'bg-[#003B73] text-white' : 'bg-white dark:bg-[#1A1A1A] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#2A2A2A]'}`}>{s}</button>
        ))}
      </div>

      <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A]/80 rounded-2xl p-6 transition-colors shadow-sm">
        {tab === 'Profil' && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#003B73]/10 dark:bg-orange-600/20 border border-[#003B73]/20 dark:border-orange-500/30 flex items-center justify-center text-2xl font-bold text-[#003B73] dark:text-orange-400">{initials}</div>
              <div>
                <p className="text-slate-900 dark:text-white font-bold transition-colors">{userName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">Client Allo Dakar</p>
                <button className="text-xs text-[#003B73] dark:text-orange-400 hover:text-[#002D59] dark:hover:text-orange-300 mt-1 transition-colors">Changer photo</button>
              </div>
            </div>
            
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block transition-colors">Nom complet</label>
              <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333333] focus:border-[#003B73] dark:focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition-colors" />
            </div>
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block transition-colors">Email</label>
              <input defaultValue="abdou@example.com" disabled className="w-full bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333333] focus:border-[#003B73] dark:focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-slate-500 outline-none transition-colors opacity-50 cursor-not-allowed" />
            </div>
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block transition-colors">Téléphone</label>
              <input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333333] focus:border-[#003B73] dark:focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none transition-colors" />
            </div>

            <button onClick={handleSave} className="flex items-center gap-2 bg-[#003B73] dark:bg-orange-600 hover:bg-[#002D59] dark:hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors mt-2 shadow-lg shadow-blue-900/10">
              <Save className="w-4 h-4" /> Sauvegarder
            </button>
          </div>
        )}

        {tab === 'Sécurité' && (
          <div className="space-y-6">
            <div className="space-y-4 pb-6 border-b border-slate-200 dark:border-slate-800/80">
              <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors"><Lock className="w-4 h-4 text-[#003B73] dark:text-orange-400" /> Modifier le mot de passe / PIN</p>
              {['Mot de passe actuel', 'Nouveau mot de passe', 'Confirmer nouveau'].map(l => (
                <div key={l}>
                  <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block transition-colors">{l}</label>
                  <div className="relative">
                    <input type={showPwd ? 'text' : 'password'} className="w-full bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333333] focus:border-[#003B73] dark:focus:border-orange-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none pr-10 transition-colors" />
                    <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white transition-colors">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
              <button className="flex items-center gap-2 bg-[#003B73] dark:bg-orange-600 hover:bg-[#002D59] dark:hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-900/10">
                <Save className="w-4 h-4" /> Mettre à jour
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors"><ShieldCheck className="w-4 h-4 text-[#003B73] dark:text-orange-400" /> Sécurité Biométrique / PIN</p>
              
              {/* App Lock Switch */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl transition-colors">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white transition-colors">Verrouillage de l'application</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">Activer le verrouillage automatique (PIN/Biométrie) après 10 minutes d'inactivité.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={appLockEnabled} 
                    onChange={(e) => handleToggleAppLock(e.target.checked)} 
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-orange-500 rounded-full"></div>
                </label>
              </div>

              {/* Biometrics Switch - Only shown if App Lock is enabled */}
              {appLockEnabled && (
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl transition-colors animate-in fade-in slide-in-from-top-2 duration-200">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white transition-colors">Biométrie</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">Mettre en avant la connexion avec Face ID / Touch ID.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={useBiometrics} 
                      onChange={(e) => handleToggleBiometrics(e.target.checked)} 
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-orange-500 rounded-full"></div>
                  </label>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'Préférences' && (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3 transition-colors"><Sun className="w-4 h-4 text-[#003B73] dark:text-orange-400" /> Apparence</p>
              {mounted && (
                <div className="flex gap-3">
                  <button onClick={() => setTheme('light')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all ${theme === 'light' ? 'bg-orange-100 border-orange-500 text-orange-600' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-[#1A1A1A] dark:border-[#333333] dark:text-slate-400 dark:hover:bg-[#222222]'}`}>
                    <Sun className="w-4 h-4" /> Clair
                  </button>
                  <button onClick={() => setTheme('dark')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all ${theme === 'dark' ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-[#1A1A1A] dark:border-[#333333] dark:text-slate-400 dark:hover:bg-[#222222]'}`}>
                    <Moon className="w-4 h-4" /> Sombre
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors"><Globe className="w-4 h-4 text-[#003B73] dark:text-orange-400" /> Langue & Région</p>
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block transition-colors">Langue</label>
              <select className="w-full bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333333] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none cursor-pointer transition-colors">
                <option>Français</option>
                <option>Wolof</option>
                <option>English</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block transition-colors">Pays</label>
              <select className="w-full bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333333] rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none cursor-pointer transition-colors">
                <option>Sénégal</option>
                <option>Mali</option>
                <option>Côte d'Ivoire</option>
              </select>
            </div>
            </div>
            <button className="flex items-center gap-2 bg-[#003B73] dark:bg-orange-600 hover:bg-[#002D59] dark:hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-900/10">
              <Save className="w-4 h-4" /> Sauvegarder
            </button>
          </div>
        )}

        {tab === 'Paiements' && (
          <div className="space-y-4">
            <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors"><CreditCard className="w-4 h-4 text-[#003B73] dark:text-orange-400" /> Méthodes de paiement enregistrées</p>
            {[{ n: 'Wave', num: '+221 77 *** 45 67', actif: true }, { n: 'Orange Money', num: '+221 78 *** 22 11', actif: false }].map(m => (
              <div key={m.n} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl transition-colors">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white transition-colors">{m.n}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">{m.num}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-lg font-bold transition-colors ${m.actif ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30' : 'bg-slate-200 dark:bg-[#222222] text-slate-500 dark:text-slate-500 border border-slate-300 dark:border-[#333333]'}`}>
                  {m.actif ? 'Principal' : 'Secondaire'}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'Compte' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 transition-colors">Zone de danger — ces actions sont irréversibles.</p>
            <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl space-y-3 transition-colors">
              <p className="text-sm font-bold text-rose-600 dark:text-rose-400 transition-colors">Supprimer mon compte</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 transition-colors">Toutes vos données seront supprimées définitivement. Cette action ne peut pas être annulée.</p>
              <button className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-lg shadow-rose-900/10">
                <Trash2 className="w-3.5 h-3.5" /> Supprimer définitivement
              </button>
            </div>
          </div>
        )}
      </div>

      {showConfirmPin && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowConfirmPin(false)}></div>
          
          <div className="relative w-full max-w-sm bg-[#0A0A0A] rounded-2xl border border-slate-800 shadow-2xl p-6 animate-in zoom-in-95 duration-300">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-bold text-white">Confirmation de sécurité</h3>
              <p className="text-xs text-slate-400 mt-1">Saisissez votre code PIN à 6 chiffres pour valider cette modification.</p>
            </div>

            {pinError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs text-center font-medium">
                {pinError}
              </div>
            )}

            <div className="space-y-4">
              <input 
                type="password" 
                maxLength={6} 
                required
                value={confirmPinVal}
                onChange={e => setConfirmPinVal(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-center text-lg tracking-widest text-white focus:outline-none focus:border-orange-500 font-mono transition-colors"
              />

              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => setShowConfirmPin(false)}
                  disabled={isVerifyingPin}
                  className="flex-1 py-2.5 rounded-xl border border-slate-800 text-sm text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-900 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleConfirmPin}
                  disabled={isVerifyingPin}
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm transition-all shadow-[0_0_15px_rgba(234,88,12,0.3)] disabled:opacity-50"
                >
                  {isVerifyingPin ? 'Validation...' : 'Confirmer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

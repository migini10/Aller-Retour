'use client';

import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, Lock, Bell, Shield, Camera, LogOut, AlertTriangle, ChevronRight, Check } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { useUser } from '@/hooks/useUser';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { userName, userPhone, updateUser, isLoaded } = useUser();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [isSaved, setIsSaved] = useState(false);

  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  React.useEffect(() => {
    if (isLoaded) {
      setEditName(userName);
      setEditPhone(userPhone);
    }
  }, [isLoaded, userName, userPhone]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(editName, editPhone);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center bg-slate-50 dark:bg-black transition-colors duration-300">
      <div className="w-full max-w-4xl px-5 sm:px-8 lg:px-12 pt-6 sm:pt-10 pb-24 space-y-8 animate-fade-in">
        
        {/* Header with Back Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200 dark:border-[#2A2A2A]">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/client" className="p-2.5 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#2A2A2A] rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Paramètres</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Gérez votre compte et vos préférences de sécurité.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Navigation Sidebar */}
          <div className="w-full lg:w-64 flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${activeTab === 'profile' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1A1A1A]'}`}
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5" />
                <span className="font-bold">Profil</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'profile' ? 'translate-x-1' : ''}`} />
            </button>
            
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${activeTab === 'security' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1A1A1A]'}`}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5" />
                <span className="font-bold">Sécurité</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'security' ? 'translate-x-1' : ''}`} />
            </button>
            
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${activeTab === 'notifications' ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1A1A1A]'}`}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5" />
                <span className="font-bold">Notifications</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'notifications' ? 'translate-x-1' : ''}`} />
            </button>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-[#2A2A2A]">
              <button onClick={logout} className="flex items-center gap-3 p-4 rounded-2xl w-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="font-bold">Se déconnecter</span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white dark:bg-[#141414] border border-slate-200 dark:border-[#2A2A2A] rounded-3xl p-6 sm:p-8 shadow-xl">
              
              {activeTab === 'profile' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="flex items-center gap-6">
                    <div className="relative group cursor-pointer">
                      <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-[#141414] shadow-md flex items-center justify-center overflow-hidden">
                        {(user as any)?.avatarUrl ? (
                          <img src={(user as any).avatarUrl} alt="Profil" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-10 h-10 text-slate-400" />
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Photo de profil</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Format recommandé : JPG ou PNG. Taille max : 5MB.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSave} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nom complet</label>
                        <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333] text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all outline-none" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="w-5 h-5 text-slate-400" />
                        </div>
                        <input type="email" defaultValue={(user as any)?.email || 'client@allerretour.sn'} className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333] text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all outline-none" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Numéro de téléphone</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone className="w-5 h-5 text-slate-400" />
                        </div>
                        <input type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333] text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all outline-none" />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button type="submit" className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-orange-500/20 flex items-center gap-2">
                        {isSaved ? <Check className="w-5 h-5" /> : null}
                        {isSaved ? 'Enregistré' : 'Enregistrer les modifications'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Mot de passe</h3>
                      <p className="text-sm text-slate-500">Mettez à jour votre mot de passe pour sécuriser votre compte.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSave} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Mot de passe actuel</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333] text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all outline-none" />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nouveau mot de passe</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333] text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all outline-none" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Confirmer le nouveau mot de passe</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333] text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all outline-none" />
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button type="submit" className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
                        Mettre à jour le mot de passe
                      </button>
                    </div>
                  </form>

                  <div className="mt-12 pt-8 border-t border-slate-200 dark:border-[#2A2A2A]">
                    <h3 className="text-lg font-bold text-rose-500 flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5" /> Zone de danger
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">La suppression de votre compte est définitive. Toutes vos données, y compris votre historique de trajets, seront effacées.</p>
                    <button className="px-4 py-2 border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 font-bold rounded-lg transition-colors text-sm">
                      Supprimer mon compte
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-8 animate-fade-in">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Bell className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Préférences de communication</h3>
                      <p className="text-sm text-slate-500">Choisissez comment vous souhaitez être contacté.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1A1A1A] rounded-2xl border border-slate-200 dark:border-[#333]">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Emails de voyage</h4>
                        <p className="text-xs text-slate-500 mt-1">Billets, reçus et rappels de départ.</p>
                      </div>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="toggle" id="toggle1" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-slate-300 dark:border-slate-600 appearance-none cursor-pointer checked:right-0 checked:border-orange-500" style={{ right: '24px', transition: 'right 0.2s ease-in' }} />
                        <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 dark:bg-slate-600 cursor-pointer"></label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1A1A1A] rounded-2xl border border-slate-200 dark:border-[#333]">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">SMS d'urgence</h4>
                        <p className="text-xs text-slate-500 mt-1">Changements de dernière minute, retards ou annulations.</p>
                      </div>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="toggle" id="toggle2" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-slate-300 dark:border-slate-600 appearance-none cursor-pointer checked:right-0 checked:border-orange-500" style={{ right: '0px', transition: 'right 0.2s ease-in' }} />
                        <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-6 rounded-full bg-orange-500 cursor-pointer"></label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1A1A1A] rounded-2xl border border-slate-200 dark:border-[#333]">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Promotions et offres</h4>
                        <p className="text-xs text-slate-500 mt-1">Réductions exclusives et actualités d'Allogoo.</p>
                      </div>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="toggle" id="toggle3" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-slate-300 dark:border-slate-600 appearance-none cursor-pointer checked:right-0 checked:border-orange-500" style={{ right: '24px', transition: 'right 0.2s ease-in' }} />
                        <label htmlFor="toggle3" className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 dark:bg-slate-600 cursor-pointer"></label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .toggle-checkbox:checked {
          right: 0 !important;
          border-color: #f97316 !important; /* Tailwind orange-500 */
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #f97316 !important; /* Tailwind orange-500 */
        }
      `}} />
    </div>
  );
}

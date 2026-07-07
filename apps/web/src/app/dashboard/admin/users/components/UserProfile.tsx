
'use client';

import React from 'react';
import { User } from '../../types/user.types';
import { KeyRound, Smartphone, Mail, Calendar, Info } from 'lucide-react';

export function UserProfile({ user }: { user: User }) {
  return (
    <div className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/50">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Informations du profil</h3>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Email</p>
            <p className="font-semibold text-slate-900 dark:text-white">{user.email}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <Smartphone className="w-5 h-5 text-slate-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Téléphone</p>
            <p className="font-semibold text-slate-900 dark:text-white">{user.phone}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <KeyRound className="w-5 h-5 text-slate-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Sécurité (PIN)</p>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${user.hasPinConfigured ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
              <p className="font-semibold text-slate-900 dark:text-white">
                {user.hasPinConfigured ? 'Configuré' : 'Non configuré'}
              </p>
            </div>
            {user.pinLastModified && (
              <p className="text-xs text-slate-500 mt-1">Modifié le {new Date(user.pinLastModified).toLocaleDateString()}</p>
            )}
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Inscription</p>
            <p className="font-semibold text-slate-900 dark:text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
            <p className="text-xs text-slate-500 mt-1">Il y a 1 an</p>
          </div>
        </div>
      </div>
      <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border-t border-blue-100 dark:border-blue-500/20 flex gap-3 text-sm text-blue-800 dark:text-blue-300">
        <Info className="w-5 h-5 shrink-0" />
        <p>Le code PIN de l'utilisateur n'est jamais affiché en clair par mesure de sécurité. Si l'utilisateur l'oublie, vous pouvez uniquement forcer une réinitialisation.</p>
      </div>
    </div>
  );
}
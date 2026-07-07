
'use client';

import React from 'react';
import { User, UserStatus, UserPermissions } from '../../types/user.types';
import { ShieldBan, ShieldCheck, KeyRound, Clock } from 'lucide-react';

export function UserActions({ user, permissions }: { user: User, permissions: UserPermissions }) {
  const isSuspended = user.status === UserStatus.SUSPENDED || user.status === UserStatus.BANNED;

  return (
    <div className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/50">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Actions Administratives</h3>
      </div>
      <div className="p-4 flex flex-col gap-2">
        {permissions.canSuspendUser && (
          !isSuspended ? (
            <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-rose-50 text-rose-600 dark:hover:bg-rose-500/10 transition-colors text-left w-full font-semibold text-sm">
              <ShieldBan className="w-5 h-5" />
              Suspendre le compte
            </button>
          ) : (
            <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 text-emerald-600 dark:hover:bg-emerald-500/10 transition-colors text-left w-full font-semibold text-sm">
              <ShieldCheck className="w-5 h-5" />
              Réactiver le compte
            </button>
          )
        )}
        
        {permissions.canResetPin && (
          <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 text-orange-600 dark:hover:bg-orange-500/10 transition-colors text-left w-full font-semibold text-sm">
            <KeyRound className="w-5 h-5" />
            Forcer réinitialisation PIN
          </button>
        )}

        {permissions.canViewUser && (
          <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 dark:hover:bg-slate-800 dark:text-slate-300 transition-colors text-left w-full font-semibold text-sm">
            <Clock className="w-5 h-5" />
            Voir l'historique de sécurité
          </button>
        )}
      </div>
    </div>
  );
}
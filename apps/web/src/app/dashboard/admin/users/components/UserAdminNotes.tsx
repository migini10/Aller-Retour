
'use client';

import React from 'react';
import { User } from '../../types/user.types';

export function UserAdminNotes({ user }: { user: User }) {
  return (
    <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-amber-800 dark:text-amber-400 mb-4">Notes Administratives (Privé)</h3>
      <textarea 
        className="w-full bg-white dark:bg-[#141414] border border-amber-200 dark:border-amber-500/30 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        defaultValue={user.adminNotes || ''}
        placeholder="Ajoutez des notes internes concernant cet utilisateur. Celles-ci ne seront visibles que par les administrateurs."
      />
      <div className="mt-4 flex justify-end">
        <button className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors">
          Enregistrer les notes
        </button>
      </div>
    </div>
  );
}
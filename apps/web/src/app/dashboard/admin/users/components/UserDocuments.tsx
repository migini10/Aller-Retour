
'use client';

import React from 'react';
import { User, UserRole } from '../../types/user.types';
import { ShieldCheck, Clock, XCircle, FileText } from 'lucide-react';

export function UserDocuments({ user }: { user: User }) {
  const isDriver = user.role === UserRole.DRIVER;
  
  const docs = [
    { name: 'Photo de profil', status: 'APPROVED' },
    { name: 'Carte d\'identité', status: 'APPROVED' },
    { name: 'Permis de conduire', status: isDriver ? 'PENDING' : null },
    { name: 'Assurance véhicule', status: isDriver ? 'REJECTED' : null },
  ].filter(d => d.status !== null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {docs.map((doc, i) => (
        <div key={i} className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800/50 flex justify-between items-center bg-slate-50 dark:bg-[#1A1A1A]">
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              {doc.name}
            </h4>
          </div>
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center gap-3">
            {doc.status === 'APPROVED' && (
              <>
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">Vérifié</p>
                  <p className="text-xs text-slate-500 mt-1">Le document est valide</p>
                </div>
              </>
            )}
            {doc.status === 'PENDING' && (
              <>
                <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="font-bold text-amber-600 dark:text-amber-400">En attente</p>
                  <p className="text-xs text-slate-500 mt-1">Examen requis</p>
                </div>
                <button className="mt-2 text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1.5 rounded-lg w-full">Examiner</button>
              </>
            )}
            {doc.status === 'REJECTED' && (
              <>
                <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <p className="font-bold text-rose-600 dark:text-rose-400">Rejeté</p>
                  <p className="text-xs text-slate-500 mt-1">Document invalide</p>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
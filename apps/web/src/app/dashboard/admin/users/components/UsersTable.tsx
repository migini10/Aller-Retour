
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminTable, ColumnDef } from '../../components/tables/AdminTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { User, UserRole, UserStatus } from '../../types/user.types';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
}

export function UsersTable({ users, isLoading }: UsersTableProps) {
  const router = useRouter();

  const columns: ColumnDef<User>[] = [
    {
      header: 'Utilisateur',
      accessorKey: 'firstName',
      cell: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-400">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              {user.firstName} {user.lastName}
              {user.badges?.includes('VERIFIED') && <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />}
            </div>
            <div className="text-xs text-slate-500">{user.email}</div>
          </div>
        </div>
      ),
    },
    { header: 'Téléphone', accessorKey: 'phone' },
    {
      header: 'Rôle',
      cell: (user) => (
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${user.role === UserRole.DRIVER ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
          {user.role === UserRole.DRIVER ? 'Chauffeur' : 'Client'}
        </span>
      ),
    },
    {
      header: 'Statut',
      cell: (user) => {
        switch (user.status) {
          case UserStatus.ACTIVE: return <StatusBadge label="Actif" variant="success" />;
          case UserStatus.PENDING: return <StatusBadge label="En attente" variant="warning" />;
          case UserStatus.SUSPENDED: return <StatusBadge label="Suspendu" variant="error" />;
          case UserStatus.BANNED: return <StatusBadge label="Banni" variant="error" />;
          default: return <StatusBadge label={user.status} />;
        }
      },
    },
    { header: 'Inscrit le', cell: (user) => new Date(user.createdAt).toLocaleDateString() },
    {
      header: 'Action',
      cell: (user) => (
        <button 
          onClick={() => router.push(`/dashboard/admin/users/${user.id}`)}
          className="text-orange-600 hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-400 text-sm font-semibold transition-colors"
        >
          Gérer
        </button>
      ),
    },
  ];

  if (isLoading) {
    return <div className="animate-pulse bg-white dark:bg-[#141414] h-96 rounded-2xl"></div>;
  }

  return (
    <div className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm overflow-hidden">
      <AdminTable
        data={users}
        columns={columns}
        keyExtractor={(item) => item.id}
        emptyState={<EmptyState title="Aucun utilisateur" description="Aucun compte ne correspond à votre recherche." />}
      />
    </div>
  );
}
'use client';

import React from 'react';
import { Globe, LogOut, Menu } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AdminTopbarProps {
  onToggleSidebar?: () => void;
}

import { useAuth } from '@/components/AuthContext';

export function AdminTopbar({ onToggleSidebar }: AdminTopbarProps) {
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('ar_auth_token');
    localStorage.removeItem('ar_auth_user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userPhone');
    router.push('/auth/login');
  };

  const displayName = user?.fullName || user?.phone || 'Utilisateur';
  const displayRole = user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 
                      user?.role === 'ADMIN' ? 'Admin' : 
                      user?.role === 'DRIVER' ? 'Chauffeur' : 'Passager';

  return (
    <div className="flex-none z-40 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-slate-200 dark:border-[#2A2A2A]/80 px-4 sm:px-6 lg:px-8 py-3 sticky top-0">
      <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button 
            className="lg:hidden p-2 text-slate-500 hover:text-orange-500 transition-colors"
            onClick={onToggleSidebar}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-purple-600 p-[1px]">
            <div className="w-full h-full bg-white dark:bg-[#0A0A0A] rounded-[11px] flex items-center justify-center">
              <Globe className="w-5 h-5 text-orange-500 dark:text-orange-400" />
            </div>
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white leading-none">{displayName}</h1>
            <p className="text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider mt-1">{displayRole}</p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="bg-slate-100 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333333] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 dark:hover:border-rose-500/30 text-slate-600 dark:text-slate-300 p-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline text-xs font-semibold">Déconnexion</span>
        </button>
      </div>
    </div>
  );
}

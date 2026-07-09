'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminNavigation } from '../../../../../config/adminNavigation';
import { usePermissions, Permission } from '../../hooks/usePermissions';
import { useAuth } from '@/components/AuthContext';

export function AdminSidebar() {
  const pathname = usePathname();
  const { hasPermission, permissions, isLoading } = usePermissions();
  const { user, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div className="w-64 border-r border-slate-200 dark:border-[#2A2A2A] bg-white dark:bg-[#0A0A0A] p-4 flex flex-col animate-pulse">
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4 mb-8"></div>
      <div className="space-y-4">
        {[1,2,3,4,5,6].map(i => <div key={i} className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>)}
      </div>
    </div>;
  }

  const filteredItems = adminNavigation.filter(item => {
    if (!item.requiredPermission) return true;
    return hasPermission(item.requiredPermission as Permission);
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('--- ADMIN SIDEBAR DEBUG ---');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user (safe):', user ? { id: user.id, role: user.role } : null);
    console.log('user.role:', user?.role);
    console.log('calculated permissions:', permissions);
    console.log('adminNavigation length (before):', adminNavigation.length);
    console.log('adminNavigation length (after):', filteredItems.length);
  }

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-[#0A0A0A] border-r border-slate-200 dark:border-[#2A2A2A]/80 overflow-y-auto scrollbar-hide">
      <div className="p-4 mb-2">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">
          Marketplace Admin
        </h2>
        <nav className="space-y-1">
          {filteredItems.map((item) => {
            const isActive = item.path === '/dashboard/admin' 
              ? pathname === '/dashboard/admin'
              : pathname.startsWith(item.path);

            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm group ${
                  isActive
                    ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#141414] hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-orange-500' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                {item.label}
                {item.badge && (
                  <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    isActive 
                      ? 'bg-orange-200 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

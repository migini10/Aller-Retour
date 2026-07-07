'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { adminNavigation } from '../../../../../config/adminNavigation';

export function AdminBreadcrumb() {
  const pathname = usePathname();
  
  // Find current navigation item
  const currentItem = adminNavigation.find(item => 
    item.path !== '/dashboard/admin' && pathname.startsWith(item.path)
  );

  return (
    <nav className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
      <Link 
        href="/dashboard/admin" 
        className="flex items-center hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <Home className="w-4 h-4 mr-1.5" />
        Admin
      </Link>
      
      {currentItem && (
        <>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
          <span className="text-slate-900 dark:text-slate-200">
            {currentItem.label}
          </span>
        </>
      )}
    </nav>
  );
}

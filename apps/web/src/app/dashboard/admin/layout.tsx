'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from './components/layout/AdminSidebar';
import { AdminTopbar } from './components/layout/AdminTopbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const ALLOWED_ADMIN_ROLES = ['SUPER_ADMIN'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { user, isAuthenticated, isHydrated } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated || !user) {
      router.replace('/auth/login');
      return;
    }

    if (!ALLOWED_ADMIN_ROLES.includes(user.role)) {
      if (user.role === 'DRIVER') {
        router.replace('/dashboard/driver');
      } else {
        router.replace('/dashboard/client');
      }
      return;
    }

    setIsAuthorized(true);
  }, [isHydrated, isAuthenticated, user, router]);

  if (!isHydrated || !isAuthorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-[#050A15]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-[#050A15] text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-full shrink-0 z-20">
        <AdminSidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 z-50 lg:hidden shadow-2xl"
              onClick={() => setIsMobileSidebarOpen(false)} // close on link click
            >
              <AdminSidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        <AdminTopbar onToggleSidebar={() => setIsMobileSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}

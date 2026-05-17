import React from 'react';
import Sidebar from '../../components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar />
      <main className="flex-1 px-12 py-10 overflow-y-auto bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {children}
      </main>
    </div>
  );
}

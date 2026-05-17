'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User, 
  Bus, 
  Building2, 
  TicketCheck, 
  ShieldAlert, 
  Wallet, 
  TrendingUp, 
  MapPin, 
  QrCode, 
  LogOut,
  Sparkles
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Espace Voyageur', path: '/dashboard/client', icon: User, badge: 'Client' },
    { name: 'Espace Chauffeur', path: '/dashboard/driver', icon: Bus, badge: 'Driver' },
    { name: 'Espace Transporteur (GIE)', path: '/dashboard/carrier', icon: Building2, badge: 'Tenant' },
    { name: 'Guichet & Contrôle', path: '/dashboard/dispatcher', icon: TicketCheck, badge: 'Gare' },
    { name: 'Super Admin SaaS', path: '/dashboard/superadmin', icon: ShieldAlert, badge: 'Global' },
  ];

  return (
    <aside className="w-72 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 flex flex-col justify-between p-6 h-screen sticky top-0 shadow-2xl">
      <div>
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-3 mb-10 group">
          <div className="w-12 h-12 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
            <Bus className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-emerald-200 to-emerald-400 bg-clip-text text-transparent">
              Aller-Retour
            </h1>
            <p className="text-xs text-emerald-400/80 flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3 h-3" /> Panafrican SaaS
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">
            Espaces & Rôles (Démo)
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 font-bold'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-slate-950' : 'text-emerald-400'}`} />
                  <span>{item.name}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  isActive ? 'bg-slate-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Profile & Switch */}
      <div className="border-t border-slate-800/80 pt-6 mt-6">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center font-bold text-white shadow-md">
              AB
            </div>
            <div>
              <p className="text-sm font-bold text-white">Abdou Bakhe</p>
              <p className="text-xs text-emerald-400">Mode Superviseur</p>
            </div>
          </div>
          <Link href="/" className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition-colors">
            <LogOut className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

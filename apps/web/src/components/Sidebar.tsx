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
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Espace Voyageur', path: '/dashboard/client', icon: User, badge: 'Client' },
    { name: 'Espace Chauffeur', path: '/dashboard/driver', icon: Bus, badge: 'Driver' },
    { name: 'Transporteur (GIE)', path: '/dashboard/carrier', icon: Building2, badge: 'Tenant' },
    { name: 'Guichet & Contrôle', path: '/dashboard/dispatcher', icon: TicketCheck, badge: 'Gare' },
    { name: 'Super Admin SaaS', path: '/dashboard/superadmin', icon: ShieldAlert, badge: 'Global' },
  ];

  return (
    <aside className="w-72 bg-[#0B0F19]/90 backdrop-blur-xl border-r border-slate-800/80 flex flex-col justify-between p-6 h-screen sticky top-0 font-sans shadow-sm">
      <div>
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-3 mb-8 group">
          <div className="w-10 h-10 bg-emerald-600/20 border border-emerald-500/30 rounded-xl flex items-center justify-center group-hover:bg-emerald-600/30 transition-colors">
            <Bus className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Aller<span className="text-emerald-500 font-extrabold">Retour</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              Panafrican SaaS
            </p>
          </div>
        </Link>

        {/* Bouton Retour à l'accueil principal */}
        <div className="mb-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all group shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-1 transition-transform" />
            <span>Retour à l'accueil principal</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">
            Espaces & Rôles
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                  isActive ? 'bg-slate-900 text-emerald-300 border border-emerald-500/30' : 'bg-slate-900 border border-slate-800 text-slate-400'
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
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-xs">
              AB
            </div>
            <div>
              <p className="text-xs font-bold text-white">Abdou Bakhe</p>
              <p className="text-[10px] text-slate-400 font-medium">Superviseur</p>
            </div>
          </div>
          <Link href="/" className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-slate-800 transition-colors">
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

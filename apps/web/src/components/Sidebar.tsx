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
  LogOut,
  ArrowLeft
} from 'lucide-react';

interface SidebarProps {
  onLinkClick?: () => void;
}

export default function Sidebar({ onLinkClick }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Allo Dakar', path: '/dashboard/traveller', icon: User, badge: 'Premium' },
    { name: 'Espace Voyageur', path: '/dashboard/client', icon: User, badge: 'Client' },
    { name: 'Espace Chauffeur', path: '/dashboard/driver', icon: Bus, badge: 'Driver' },
    { name: 'Transporteur (GIE)', path: '/dashboard/carrier', icon: Building2, badge: 'Tenant' },
    { name: 'Guichet & Contrôle', path: '/dashboard/station', icon: TicketCheck, badge: 'Gare' },
    { name: 'Super Admin SaaS', path: '/dashboard/admin', icon: ShieldAlert, badge: 'Global' },
  ];

  return (
    <aside className="w-full h-full bg-[#0B0F19]/95 backdrop-blur-xl border-r border-slate-800/80 flex flex-col p-4 shadow-sm overflow-hidden">
      <div className="flex-none">
        {/* Logo & Brand */}
        <Link
          href="/"
          onClick={onLinkClick}
          className="hidden lg:flex items-center gap-3 mb-8 group/logo w-[230px]"
        >
          <div className="w-10 h-10 bg-orange-600/20 border border-orange-500/30 rounded-xl flex items-center justify-center shrink-0 group-hover/logo:bg-orange-600/30 transition-colors">
            <Bus className="w-5 h-5 text-orange-500 shrink-0" />
          </div>
          <div className="lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap flex-1">
            <h1 className="text-lg font-bold tracking-tight text-white">
              Aller<span className="text-orange-500 font-extrabold">Retour</span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              Panafrican SaaS
            </p>
          </div>
        </Link>

        {/* Espace supplémentaire sur mobile pour compenser l'absence du logo */}
        <div className="h-4 lg:hidden" />

        {/* Bouton Retour à l'accueil */}
        <div className="mb-8">
          <Link
            href="/"
            onClick={onLinkClick}
            className="flex items-center gap-3 p-3 w-[230px] rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 text-xs font-semibold text-slate-300 hover:text-white transition-all group/btn shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-orange-500 shrink-0 group-hover/btn:-translate-x-1 transition-transform" />
            <span className="lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Retour à l'accueil</span>
          </Link>
        </div>
      </div>

      {/* Navigation Links (Scrollable) */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-hide -mx-2 px-2 space-y-1.5">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap w-[230px]">
          Espaces & Rôles
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={onLinkClick}
              className={`flex items-center justify-between p-3 w-[230px] rounded-xl font-medium text-sm transition-colors ${
                isActive
                  ? 'bg-orange-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">{item.name}</span>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-orange-300 border border-orange-500/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400'
              }`}>
                {item.badge}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Logout Footer */}
      <div className="flex-none pt-6 border-t border-slate-800/80 mt-auto">
        <button className="flex items-center gap-3 p-3 w-[230px] rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors">
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Se déconnecter</span>
        </button>
      </div>
    </aside>
  );
}

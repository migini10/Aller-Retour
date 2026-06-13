'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useModal } from './ModalContext';
import { 
  User, 
  CarFront, 
  Building2, 
  TicketCheck, 
  ShieldAlert,
  LogOut,
  ArrowLeft,
  Package,
  Wallet,
  Award,
  History,
  Code,
  Settings,
  LayoutDashboard,
  Route,
  MapPin,
  QrCode,
  Users,
  Store,
  Bus,
  Bell,
  HelpCircle,
  Gift
} from 'lucide-react';

interface SidebarProps {
  onLinkClick?: () => void;
}

export default function Sidebar({ onLinkClick }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { openBookingWizard } = useModal();
  
  const [hash, setHash] = React.useState('');
  
  React.useEffect(() => {
    setHash(window.location.hash);
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [showDevMenu, setShowDevMenu] = React.useState(false);
  const isClientPage = pathname.startsWith('/dashboard/client');

  const isDriverPage = pathname.startsWith('/dashboard/driver');

  const roleNavItems = [
    { name: 'Allo Dakar', path: 'https://allogoo.com/', icon: User, badge: 'Premium', colorClass: 'text-amber-500', bgClass: 'bg-amber-500/15', borderClass: 'border-amber-500/30' },
    { name: 'Espace Voyageur', path: '/dashboard/client', icon: User, badge: 'Client', colorClass: 'text-cyan-500', bgClass: 'bg-cyan-500/15', borderClass: 'border-cyan-500/30' },
    { name: 'Espace Chauffeur', path: '/dashboard/driver', icon: CarFront, badge: 'Driver', colorClass: 'text-emerald-500', bgClass: 'bg-emerald-500/15', borderClass: 'border-emerald-500/30' },
    { name: 'Transporteur (GIE)', path: '/dashboard/carrier', icon: Building2, badge: 'Tenant', colorClass: 'text-blue-500', bgClass: 'bg-blue-500/15', borderClass: 'border-blue-500/30' },
    { name: 'Guichet & Contrôle', path: '/dashboard/station', icon: TicketCheck, badge: 'Gare', colorClass: 'text-indigo-500', bgClass: 'bg-indigo-500/15', borderClass: 'border-indigo-500/30' },
    { name: 'Super Admin SaaS', path: '/dashboard/admin', icon: ShieldAlert, badge: 'Global', colorClass: 'text-rose-500', bgClass: 'bg-rose-500/15', borderClass: 'border-rose-500/30' },
  ];

  const clientNavItems = [
    { name: 'Tableau de bord', path: '/dashboard/client', icon: User, badge: '', colorClass: 'text-cyan-500', bgClass: 'bg-cyan-500/15', borderClass: 'border-cyan-500/30' },
    { name: 'Mon Wallet', path: '/dashboard/client/wallet', icon: Wallet, badge: '', colorClass: 'text-emerald-500', bgClass: 'bg-emerald-500/15', borderClass: 'border-emerald-500/30' },
    { name: 'Mes Colis', path: '/dashboard/client/colis', icon: Package, badge: '', colorClass: 'text-purple-500', bgClass: 'bg-purple-500/15', borderClass: 'border-purple-500/30' },
    { name: 'QR Code & Billets', path: '/dashboard/client/qr-code', icon: TicketCheck, badge: '', colorClass: 'text-orange-500', bgClass: 'bg-orange-500/15', borderClass: 'border-orange-500/30' },
    { name: 'Fidélité', path: '/dashboard/client/fidelite', icon: Award, badge: '', colorClass: 'text-amber-500', bgClass: 'bg-amber-500/15', borderClass: 'border-amber-500/30' },
    { name: 'Parrainage', path: '/dashboard/parrainage', icon: Gift, badge: 'Nouveau', colorClass: 'text-rose-500', bgClass: 'bg-rose-500/15', borderClass: 'border-rose-500/30' },
    { name: 'Historique', path: '/dashboard/client/transactions', icon: History, badge: '', colorClass: 'text-blue-500', bgClass: 'bg-blue-500/15', borderClass: 'border-blue-500/30' },
    { name: 'Paramètres', path: '/dashboard/client/settings', icon: Settings, badge: '', colorClass: 'text-slate-500 dark:text-slate-400', bgClass: 'bg-slate-500/15', borderClass: 'border-slate-500/30' },
  ];

  const driverNavItems = [
    { name: 'Accueil', path: '/dashboard/driver#accueil', icon: LayoutDashboard, badge: '', colorClass: 'text-orange-500', bgClass: 'bg-orange-500/15', borderClass: 'border-orange-500/30' },
    { name: 'Missions & Trajets', path: '/dashboard/driver#missions', icon: Route, badge: '', colorClass: 'text-emerald-500', bgClass: 'bg-emerald-500/15', borderClass: 'border-emerald-500/30' },
    { name: 'Localisation Client', path: '/dashboard/driver#localisation', icon: MapPin, badge: '', colorClass: 'text-cyan-500', bgClass: 'bg-cyan-500/15', borderClass: 'border-cyan-500/30' },
    { name: 'Scanner Billet', path: '/dashboard/driver#scanner', icon: QrCode, badge: '', colorClass: 'text-purple-500', bgClass: 'bg-purple-500/15', borderClass: 'border-purple-500/30' },
    { name: 'Passagers', path: '/dashboard/driver#passagers', icon: Users, badge: '', colorClass: 'text-blue-500', bgClass: 'bg-blue-500/15', borderClass: 'border-blue-500/30' },
    { name: 'Revenus', path: '/dashboard/driver#revenus', icon: Wallet, badge: '', colorClass: 'text-emerald-600', bgClass: 'bg-emerald-600/15', borderClass: 'border-emerald-600/30' },
    { name: 'Marketplace', path: '/dashboard/driver#marketplace', icon: Store, badge: '', colorClass: 'text-indigo-500', bgClass: 'bg-indigo-500/15', borderClass: 'border-indigo-500/30' },
    { name: 'Gestion des Colis', path: '/dashboard/driver#colis', icon: Package, badge: '', colorClass: 'text-amber-500', bgClass: 'bg-amber-500/15', borderClass: 'border-amber-500/30' },
    { name: 'Véhicule', path: '/dashboard/driver#vehicule', icon: Bus, badge: '', colorClass: 'text-slate-700 dark:text-slate-300', bgClass: 'bg-slate-500/15', borderClass: 'border-slate-500/30' },
    { name: 'Notifications', path: '/dashboard/driver#notifications', icon: Bell, badge: '2', colorClass: 'text-rose-500', bgClass: 'bg-rose-500/15', borderClass: 'border-rose-500/30' },
    { name: 'Support', path: '/dashboard/driver#support', icon: HelpCircle, badge: '', colorClass: 'text-blue-400', bgClass: 'bg-blue-400/15', borderClass: 'border-blue-400/30' },
    { name: 'Paramètres', path: '/dashboard/driver#parametres', icon: Settings, badge: '', colorClass: 'text-slate-500 dark:text-slate-400', bgClass: 'bg-slate-500/15', borderClass: 'border-slate-500/30' },
  ];

  const currentNavItems = showDevMenu 
    ? roleNavItems 
    : isClientPage 
      ? clientNavItems 
      : isDriverPage 
        ? driverNavItems 
        : roleNavItems;
        
  const menuTitle = showDevMenu 
    ? "Espaces & Rôles (Dev)" 
    : isClientPage 
      ? "Espace Voyageur" 
      : isDriverPage 
        ? "Espace Chauffeur" 
        : "Espaces & Rôles (Dev)";

  return (
    <aside className="w-full h-full bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-xl border-l border-slate-200 dark:border-slate-800/80 flex flex-col p-4 shadow-sm overflow-hidden transition-colors duration-300">
      <div className="flex-none">
        {/* Logo & Brand */}
        <Link
          href="/"
          onClick={onLinkClick}
          className="hidden lg:flex items-center gap-3 mb-8 group/logo w-[230px]"
        >
          <div className="w-10 h-10 bg-orange-600/20 border border-orange-500/30 rounded-xl flex items-center justify-center shrink-0 group-hover/logo:bg-orange-600/30 transition-colors">
            <CarFront className="w-5 h-5 text-orange-500 shrink-0" />
          </div>
          <div className="lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap flex-1">
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white transition-colors">
              Aller<span className="text-orange-500 font-extrabold">Retour</span>
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 transition-colors">
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
            className="flex items-center gap-3 p-3 w-[230px] rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500/50 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all group/btn shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-orange-500 shrink-0 group-hover/btn:-translate-x-1 transition-transform" />
            <span className="lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Retour à l'accueil</span>
          </Link>

        {/* Quick Action */}
        {!isDriverPage && (
          <div className="mb-4">
            <button
              onClick={() => {
                if (onLinkClick) onLinkClick();
                openBookingWizard('allo-dakar');
              }}
              className="flex items-center gap-3 p-3 w-[230px] rounded-xl bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white transition-all shadow-[0_0_15px_rgba(234,88,12,0.3)] border border-orange-500/50 group/buybtn"
            >
              <TicketCheck className="w-5 h-5 shrink-0 group-hover/buybtn:scale-110 transition-transform" />
              <span className="lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Acheter un billet</span>
            </button>
          </div>
        )}
        </div>
      </div>

      {/* Navigation Links (Scrollable) */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-hide -mx-2 px-2 space-y-1.5">
        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-3 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap w-[230px]">
          {menuTitle}
        </p>
        {currentNavItems.map((item) => {
          const Icon = item.icon;
          
          let isActive = false;
          if (item.path === '/' || item.path.startsWith('http')) {
            isActive = pathname === '/';
          } else if (item.path.includes('#')) {
            const [basePath, itemHash] = item.path.split('#');
            isActive = pathname === basePath && hash === `#${itemHash}`;
          } else {
            isActive = pathname.startsWith(item.path);
          }

          const isSamePageHash = item.path.includes('#') && pathname === item.path.split('#')[0];

          const linkContent = (
            <>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover/item:scale-105 ${
                  isActive 
                    ? `${item.bgClass} ${item.borderClass}` 
                    : `${item.bgClass} border-transparent group-hover/item:${item.borderClass}`
                }`}>
                  <Icon className={`w-4 h-4 ${item.colorClass}`} />
                </div>
                <span className={`lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ${
                  isActive ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-600 dark:text-slate-300 group-hover/item:text-slate-900 dark:group-hover/item:text-white'
                }`}>
                  {item.name}
                </span>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap ${
                !item.badge ? 'hidden' :
                isActive
                  ? 'bg-slate-100 dark:bg-slate-900 text-orange-600 dark:text-orange-300 border border-orange-500/30'
                  : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
              }`}>
                {item.badge}
              </span>
            </>
          );

          const className = `group/item flex items-center justify-between p-2.5 w-[230px] rounded-2xl font-medium text-sm transition-all duration-300 ${
            isActive
              ? 'bg-slate-100 dark:bg-slate-800/80 shadow-sm border border-slate-200 dark:border-slate-700/50'
              : 'border border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:border-slate-200 dark:hover:border-slate-800/50'
          }`;

          if (isSamePageHash) {
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={() => { if (onLinkClick) onLinkClick(); }}
                className={className}
              >
                {linkContent}
              </a>
            );
          }

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => { if (onLinkClick) onLinkClick(); }}
              className={className}
            >
              {linkContent}
            </Link>

          );
        })}
      </div>

      {/* Bottom Actions Footer */}
      <div className="flex-none pt-4 border-t border-slate-200 dark:border-slate-800/80 mt-auto space-y-2">
        {isClientPage && (
          <Link 
            href="/dashboard/driver"
            className="flex items-center gap-3 p-3 w-[230px] rounded-xl text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
          >
            <CarFront className="w-5 h-5 shrink-0" />
            <span className="text-sm font-semibold lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-bold">Espace Chauffeur</span>
          </Link>
        )}
        {isDriverPage && (
          <Link 
            href="/dashboard/client"
            className="flex items-center gap-3 p-3 w-[230px] rounded-xl text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition-colors"
          >
            <User className="w-5 h-5 shrink-0" />
            <span className="text-sm font-semibold lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-bold">Espace Voyageur</span>
          </Link>
        )}
        <button 
          onClick={() => setShowDevMenu(!showDevMenu)}
          className={`flex items-center gap-3 p-3 w-[230px] rounded-xl transition-colors ${showDevMenu ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'}`}
        >
          <Code className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Mode Dev</span>
        </button>

        <button 
          onClick={() => {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userName');
            localStorage.removeItem('userPhone');
            router.push('/auth/login');
          }}
          className="flex items-center gap-3 p-3 w-[230px] rounded-xl text-slate-500 dark:text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Se déconnecter</span>
        </button>
      </div>
    </aside>
  );
}

import {
  LayoutDashboard,
  Users,
  CarFront,
  Route,
  TicketCheck,
  Wallet,
  Settings,
  Bell,
  BarChart3,
  Activity,
  Star,
  Wrench
} from 'lucide-react';

export type AdminNavItem = {
  id: string;
  label: string;
  path: string;
  icon: any;
  badge?: string;
  requiredPermission?: string;
};

export const adminNavigation: AdminNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard/admin', icon: LayoutDashboard },
  { id: 'users', label: 'Utilisateurs', path: '/dashboard/admin/users', icon: Users, requiredPermission: 'view_users' },
  { id: 'drivers', label: 'Chauffeurs', path: '/dashboard/admin/drivers', icon: CarFront, requiredPermission: 'view_drivers' },
  { id: 'trips', label: 'Trajets', path: '/dashboard/admin/trips', icon: Route, requiredPermission: 'view_trips' },
  { id: 'bookings', label: 'Réservations', path: '/dashboard/admin/bookings', icon: TicketCheck, requiredPermission: 'view_bookings' },
  { id: 'payments', label: 'Paiements', path: '/dashboard/admin/payments', icon: Wallet, requiredPermission: 'view_payments' },
  { id: 'driver-operations', label: 'Opérations Chauffeurs', path: '/dashboard/admin/driver-operations', icon: Wrench, requiredPermission: 'manage_drivers' },
  { id: 'reviews', label: 'Avis', path: '/dashboard/admin/reviews', icon: Star, requiredPermission: 'view_reviews' },
  { id: 'notifications', label: 'Notifications', path: '/dashboard/admin/notifications', icon: Bell, requiredPermission: 'manage_notifications' },
  { id: 'analytics', label: 'Analytics', path: '/dashboard/admin/analytics', icon: BarChart3, requiredPermission: 'view_analytics' },
  { id: 'settings', label: 'Paramètres', path: '/dashboard/admin/settings', icon: Settings, requiredPermission: 'manage_settings' },
  { id: 'monitoring', label: 'Monitoring', path: '/dashboard/admin/monitoring', icon: Activity, requiredPermission: 'view_monitoring' },
];

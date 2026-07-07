export enum UserRole {
  CLIENT = 'CLIENT',
  DRIVER = 'DRIVER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING', // pending verification
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED',
}

export type UserBadge = 'VERIFIED' | 'SUSPENDED' | 'NEW' | 'TOP_DRIVER' | 'TOP_CLIENT' | 'REPORTED' | 'VIP';

export interface UserPermissions {
  canViewUser: boolean;
  canEditUser: boolean;
  canSuspendUser: boolean;
  canResetPin: boolean;
  canViewPayments: boolean;
  canViewBookings: boolean;
}

export interface UserStats {
  totalTrips: number;
  totalBookings: number;
  totalCancellations: number;
  averageRating: number;
  totalSpent: number; // For clients
  totalEarned: number; // For drivers
  totalCommissions: number;
}

export interface UserDocument {
  id: string;
  type: 'PHOTO' | 'DRIVING_LICENSE' | 'ID_CARD' | 'INSURANCE';
  url: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  uploadedAt: string;
}

export interface UserActivityEvent {
  id: string;
  type: 'BookingCreated' | 'PaymentSuccess' | 'TripPublished' | 'ReviewCreated' | 'DriverRegistered' | 'RefundIssued' | 'SystemAlert';
  title: string;
  description: string;
  date: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  badges: UserBadge[];
  avatarUrl?: string;
  hasPinConfigured: boolean;
  pinLastModified?: string;
  createdAt: string;
  lastLoginAt: string;
  stats: UserStats;
  documents?: UserDocument[];
  adminNotes?: string;
}

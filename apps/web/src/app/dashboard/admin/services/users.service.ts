import { User, UserRole, UserStatus } from '../types/user.types';

// Mocked Users Data
const mockUsers: User[] = [
  {
    id: 'USR-001',
    firstName: 'Amadou',
    lastName: 'Diallo',
    email: 'amadou.diallo@example.com',
    phone: '+221 77 123 45 67',
    role: UserRole.DRIVER,
    status: UserStatus.ACTIVE,
    badges: ['VERIFIED', 'TOP_DRIVER', 'VIP'],
    hasPinConfigured: true,
    pinLastModified: '2023-11-15T10:30:00Z',
    createdAt: '2023-01-10T08:00:00Z',
    lastLoginAt: '2024-05-12T14:20:00Z',
    stats: {
      totalTrips: 124,
      totalBookings: 0,
      totalCancellations: 2,
      averageRating: 4.9,
      totalSpent: 0,
      totalEarned: 450000,
      totalCommissions: 45000,
    },
    adminNotes: 'Chauffeur très fiable. A participé au programme bêta.',
  },
  {
    id: 'USR-002',
    firstName: 'Fatou',
    lastName: 'Ndiaye',
    email: 'fatou.ndiaye@example.com',
    phone: '+221 76 987 65 43',
    role: UserRole.CLIENT,
    status: UserStatus.ACTIVE,
    badges: ['VERIFIED', 'TOP_CLIENT'],
    hasPinConfigured: true,
    pinLastModified: '2024-02-20T09:15:00Z',
    createdAt: '2023-05-22T11:45:00Z',
    lastLoginAt: '2024-05-14T09:10:00Z',
    stats: {
      totalTrips: 0,
      totalBookings: 45,
      totalCancellations: 1,
      averageRating: 4.8,
      totalSpent: 125000,
      totalEarned: 0,
      totalCommissions: 0,
    },
  },
  {
    id: 'USR-003',
    firstName: 'Modou',
    lastName: 'Fall',
    email: 'modou.fall@example.com',
    phone: '+221 70 456 78 90',
    role: UserRole.DRIVER,
    status: UserStatus.PENDING,
    badges: ['NEW'],
    hasPinConfigured: false,
    createdAt: '2024-05-10T16:20:00Z',
    lastLoginAt: '2024-05-10T16:25:00Z',
    stats: {
      totalTrips: 0,
      totalBookings: 0,
      totalCancellations: 0,
      averageRating: 0,
      totalSpent: 0,
      totalEarned: 0,
      totalCommissions: 0,
    },
  },
  {
    id: 'USR-004',
    firstName: 'Cheikh',
    lastName: 'Seck',
    email: 'cheikh.seck@example.com',
    phone: '+221 78 111 22 33',
    role: UserRole.CLIENT,
    status: UserStatus.SUSPENDED,
    badges: ['REPORTED'],
    hasPinConfigured: true,
    pinLastModified: '2023-08-05T14:00:00Z',
    createdAt: '2023-08-01T10:00:00Z',
    lastLoginAt: '2024-04-30T18:45:00Z',
    stats: {
      totalTrips: 0,
      totalBookings: 12,
      totalCancellations: 8,
      averageRating: 2.5,
      totalSpent: 35000,
      totalEarned: 0,
      totalCommissions: 0,
    },
    adminNotes: 'Suspendu suite à plusieurs annulations abusives et plaintes de chauffeurs.',
  }
];

export class UsersService {
  static async getUsers(): Promise<User[]> {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockUsers);
      }, 800);
    });
  }

  static async getUserById(id: string): Promise<User | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.id === id);
        resolve(user || null);
      }, 500);
    });
  }

  static async updateUserStatus(id: string, status: UserStatus): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 600);
    });
  }

  static async resetUserPin(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 600);
    });
  }
}

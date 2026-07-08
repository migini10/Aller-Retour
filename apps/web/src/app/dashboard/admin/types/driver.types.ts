export interface DriverProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  kycStatus: string;
  createdAt: string;
  driverDetails?: {
    licenseNumber: string;
    licenseExpiry: string;
    identityCardNumber: string;
  };
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  isVerified: boolean;
  createdAt: string;
}

export interface DriverEarning {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  bookingId?: string;
}

export interface DriverReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  clientName: string;
}

export interface DriverPermissions {
  canViewDriver: boolean;
  canEditKyc: boolean;
  canManageVehicles: boolean;
}

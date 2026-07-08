import { DriverProfile, Vehicle } from './driver.types';

export interface Trip {
  id: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  isLocked: boolean;
  driverId: string;
  vehicleId?: string;
  createdAt: string;
  
  // Relations
  driver?: DriverProfile;
  vehicle?: Vehicle;
}

export interface PassengerInfo {
  bookingId: string;
  passengerName: string;
  passengerPhone: string;
  seats: number;
  status: string;
  pickupLocation?: string;
  paymentStatus: string;
}

export interface TripManifest {
  tripId: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  passengers: PassengerInfo[];
  totalSeats: number;
  availableSeats: number;
  totalRevenue: number;
}

export interface TransferTarget {
  id: string;
  departureTime: string;
  availableSeats: number;
  driverName: string;
  vehicleModel: string;
}

export interface TripPermissions {
  canViewTrip: boolean;
  canEditTrip: boolean;
  canDeleteTrip: boolean;
  canLockTrip: boolean;
  canManageBookings: boolean;
}

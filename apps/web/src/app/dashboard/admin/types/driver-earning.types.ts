export type EarningStatus = 'PENDING' | 'PAID' | 'CANCELLED';

export interface DriverEarningDriver {
  id: string;
  fullName: string;
  phone: string;
}

export interface DriverEarningRoute {
  id: string;
  originStation?: { name: string; city: string };
  destinationStation?: { name: string; city: string };
  distance?: number;
  estimatedDuration?: number;
}

export interface DriverEarningTrip {
  id: string;
  departureTime: string;
  pricePerSeat: number;
  route?: DriverEarningRoute;
  // NOTE: vehicle and driver (conducteur) are not included by the backend
}

export interface DriverEarningBooking {
  id: string;
  seatNumber: number;
  trip?: DriverEarningTrip;
}

export interface DriverEarning {
  id: string;
  driverId: string; // The beneficiary (owner)
  bookingId: string;
  baseAmount: number;
  platformCommission: number;
  driverCut: number;
  status: EarningStatus;
  payoutRef: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  
  driver?: DriverEarningDriver; // This is the owner/beneficiary
  booking?: DriverEarningBooking;
}

export interface GetEarningsFilters {
  status?: EarningStatus | '';
  driverId?: string;
  date?: string;
}

export interface DriverEarningSummary {
  totalPending: number;
  totalPaid: number;
  totalPlatformFees: number;
  totalDriverNet: number;
}

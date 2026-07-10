export type AlloPriveRequestStatus = 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';
export type AlloPriveApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface AlloPriveApplication {
  id: string;
  requestId: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverScore: number;
  driverRating: number;
  driverVerified: boolean;
  status: AlloPriveApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AlloPriveRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone?: string; // Conditionnel: caché aux chauffeurs non acceptés
  origin: string;
  destination: string;
  departureDate: string;
  price: number;
  type: string;
  status: AlloPriveRequestStatus;
  createdAt: string;
  updatedAt: string;
  applications?: AlloPriveApplication[];
}

export type ReviewStatus = 'VISIBLE' | 'HIDDEN';

export interface ReviewUser {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface Review {
  id: string;
  authorId: string;
  receiverId: string;
  rating: number;
  comment: string | null;
  status: ReviewStatus;
  bookingId: string | null;
  createdAt: string;
  author: ReviewUser;
  receiver: ReviewUser;
  booking?: any; // To be mapped with the real booking/trip type if needed
}

export interface GetReviewsFilters {
  page?: number;
  limit?: number;
  search?: string;
  rating?: number;
  status?: string;
  authorId?: string;
  receiverId?: string;
  bookingId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface GetReviewsResponse {
  data: Review[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

import { ApiClient } from '@/lib/api.client';
import { GetReviewsFilters, GetReviewsResponse, Review, ReviewStatus } from '../types/review.types';

export class ReviewsService {
  static async getReviews(filters: GetReviewsFilters): Promise<GetReviewsResponse> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.rating) params.append('rating', filters.rating.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.authorId) params.append('authorId', filters.authorId);
    if (filters.receiverId) params.append('receiverId', filters.receiverId);
    if (filters.bookingId) params.append('bookingId', filters.bookingId);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);

    const queryString = params.toString();
    const url = `/reviews${queryString ? `?${queryString}` : ''}`;
    
    return ApiClient.get<GetReviewsResponse>(url);
  }

  static async getReviewById(id: string): Promise<Review> {
    return ApiClient.get<Review>(`/reviews/${id}`);
  }

  static async updateReviewStatus(id: string, status: ReviewStatus): Promise<Review> {
    return ApiClient.patch<Review>(`/reviews/${id}/status`, { status });
  }
}

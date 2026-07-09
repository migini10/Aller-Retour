import { useState, useCallback } from 'react';
import { ReviewsService } from '../services/reviews.service';
import { GetReviewsFilters, Review, ReviewStatus } from '../types/review.types';

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchReviews = useCallback(async (filters: GetReviewsFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ReviewsService.getReviews(filters);
      setReviews(response.data);
      setTotal(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (err: any) {
      setError(err);
      alert(err.message || 'Erreur lors du chargement des avis');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateReviewStatus = async (id: string, status: ReviewStatus) => {
    try {
      // Optimistic update
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      await ReviewsService.updateReviewStatus(id, status);
      alert(status === 'VISIBLE' ? 'Avis publié avec succès' : 'Avis masqué avec succès');
      return true;
    } catch (err: any) {
      // Rollback on error
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status: status === 'VISIBLE' ? 'HIDDEN' : 'VISIBLE' } : r));
      alert(err.message || 'Erreur lors de la mise à jour du statut');
      return false;
    }
  };

  return {
    reviews,
    total,
    totalPages,
    isLoading,
    error,
    fetchReviews,
    updateReviewStatus,
  };
}

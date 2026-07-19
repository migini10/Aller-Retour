import { useState, useCallback } from 'react';
import { ReviewsService } from '../services/reviews.service';
import { Review, ReviewStatus } from '../types/review.types';
import { useModal } from '../../../../components/ModalContext';

export function useReviewDetails(id: string) {
  const { showToast } = useModal();
  const [review, setReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchReview = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await ReviewsService.getReviewById(id);
      setReview(data);
    } catch (err: any) {
      setError(err);
      showToast(err.message || "Erreur lors du chargement de l'avis", 'error');
    } finally {
      setIsLoading(false);
    }
  }, [id, showToast]);

  const updateStatus = async (status: ReviewStatus) => {
    if (!review) return false;
    try {
      const updated = await ReviewsService.updateReviewStatus(id, status);
      setReview(prev => prev ? { ...prev, status: updated.status } : null);
      showToast(status === 'VISIBLE' ? 'Avis publié avec succès' : 'Avis masqué avec succès', 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la mise à jour du statut', 'error');
      return false;
    }
  };

  return {
    review,
    isLoading,
    error,
    fetchReview,
    updateStatus,
  };
}

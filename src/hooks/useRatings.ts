import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { ratingsApi } from '@/lib/api/ratings';
import type { Rating, CreateRatingInput, GetRatingsQuery, GetRatingsResponse } from '@/lib/types';

/**
 * Query keys for ratings
 */
export const ratingKeys = {
  all: ['ratings'] as const,
  lists: () => [...ratingKeys.all, 'list'] as const,
  list: (filters: GetRatingsQuery) => [...ratingKeys.lists(), filters] as const,
  details: () => [...ratingKeys.all, 'detail'] as const,
  detail: (mealId: string) => [...ratingKeys.details(), mealId] as const,
};

/**
 * Fetch all ratings with optional filters
 */
export function useRatingsQuery(
  filters?: GetRatingsQuery,
  options?: Omit<UseQueryOptions<GetRatingsResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ratingKeys.list(filters || {}),
    queryFn: async () => {
      const response = await ratingsApi.getRatings(filters?.mealId || '');
      return response;
    },
    ...options,
  });
}

/**
 * Fetch ratings for a specific meal
 */
export function useRatingsByMealQuery(
  mealId: string,
  options?: Omit<UseQueryOptions<GetRatingsResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: ratingKeys.detail(mealId),
    queryFn: async () => {
      const response = await ratingsApi.getRatings(mealId);
      return response;
    },
    enabled: !!mealId,
    ...options,
  });
}

/**
 * Create a new rating
 */
export function useCreateRatingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateRatingInput) => {
      const response = await ratingsApi.createRating(input);
      return response.rating;
    },
    onMutate: async (newRating) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ratingKeys.lists() });
      await queryClient.cancelQueries({ queryKey: ratingKeys.detail(newRating.mealId) });

      // Snapshot previous data
      const previousRatings = queryClient.getQueryData<GetRatingsResponse>(ratingKeys.detail(newRating.mealId));

      // Optimistically add to cache
      if (previousRatings) {
        queryClient.setQueryData<GetRatingsResponse>(ratingKeys.detail(newRating.mealId), {
          ...previousRatings,
          ratings: [
            ...previousRatings.ratings,
            { ...newRating, id: `temp-${Date.now()}`, createdAt: new Date().toISOString() } as Rating,
          ],
        });
      }

      return { previousRatings };
    },
    onError: (_err, variables, context) => {
      // Rollback on error
      if (context?.previousRatings) {
        queryClient.setQueryData(ratingKeys.detail(variables.mealId), context.previousRatings);
      }
    },
    onSettled: (_data, _error, variables) => {
      // Refetch to ensure cache is in sync
      if (variables && 'mealId' in variables) {
        queryClient.invalidateQueries({ queryKey: ratingKeys.detail(variables.mealId) });
      }
      queryClient.invalidateQueries({ queryKey: ratingKeys.lists() });
      // Also invalidate meals to update average ratings
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });
}

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { recommendationsApi } from "@/lib/api/recommendations";
import type {
  RecommendationsResponse,
  RefreshRecommendationsInput,
  MealType,
} from "@/lib/types";

/**
 * Query keys for recommendations
 */
export const recommendationKeys = {
  all: ["recommendations"] as const,
  detail: (mealType: string, date?: string) => 
    [...recommendationKeys.all, mealType, date] as const,
};

/**
 * Fetch recommendations for a specific meal type
 */
export function useRecommendationsQuery(
  mealType: MealType,
  date?: string,
  options?: Omit<
    UseQueryOptions<RecommendationsResponse>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: recommendationKeys.detail(mealType, date),
    queryFn: async () => {
      const response = await recommendationsApi.getRecommendations({
        mealType,
        date,
      });
      return response;
    },
    enabled: !!mealType,
    ...options,
  });
}

/**
 * Refresh recommendations
 */
export function useRefreshRecommendationsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RefreshRecommendationsInput) => {
      const response = await recommendationsApi.refreshRecommendations(input);
      return response;
    },
    onMutate: async (input) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: recommendationKeys.detail(input.mealType, input.date),
      });

      // No optimistic update for recommendations - wait for server response

      return null;
    },
    onSettled: (_data, _error, variables) => {
      // Refetch recommendations
      if (variables?.mealType) {
        queryClient.invalidateQueries({
          queryKey: recommendationKeys.detail(variables.mealType, variables.date),
        });
      }
    },
  });
}

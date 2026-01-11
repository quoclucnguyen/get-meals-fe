import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { mealsApi } from '@/lib/api/meals';

export const mealNameAutocompleteKeys = {
  search: (query: string) => ['mealNames', 'search', query] as const,
};

interface MealNameSearchResponse {
  names: string[];
}

export function useMealNameAutocomplete(
  query: string,
  options?: Omit<UseQueryOptions<MealNameSearchResponse>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: mealNameAutocompleteKeys.search(query),
    queryFn: async () => {
      if (!query || query.length < 2) return { names: [] };

      const response = await mealsApi.searchMealNames(query);
      return response;
    },
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

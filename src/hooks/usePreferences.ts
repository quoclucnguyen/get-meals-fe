import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { preferencesApi } from '@/lib/api/preferences';
import type { Preferences, UpdatePreferencesInput } from '@/lib/types';

/**
 * Query keys for preferences
 */
export const preferenceKeys = {
  all: ['preferences'] as const,
  detail: () => [...preferenceKeys.all, 'detail'] as const,
};

/**
 * Fetch preferences
 */
export function usePreferencesQuery(
  options?: Omit<UseQueryOptions<Preferences>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: preferenceKeys.detail(),
    queryFn: async () => {
      const response = await preferencesApi.getPreferences();
      return response.preferences;
    },
    ...options,
  });
}

/**
 * Update preferences
 */
export function useUpdatePreferencesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdatePreferencesInput) => {
      const response = await preferencesApi.updatePreferences(input);
      return response.preferences;
    },
    onMutate: async (newPreferences) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: preferenceKeys.detail() });

      // Snapshot previous data
      const previousPreferences = queryClient.getQueryData<Preferences>(preferenceKeys.detail());

      // Optimistically update cache
      if (previousPreferences) {
        queryClient.setQueryData<Preferences>(preferenceKeys.detail(), {
          ...previousPreferences,
          ...newPreferences,
        });
      }

      return { previousPreferences };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousPreferences) {
        queryClient.setQueryData(preferenceKeys.detail(), context.previousPreferences);
      }
    },
    onSettled: () => {
      // Refetch to ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: preferenceKeys.detail() });
    },
  });
}

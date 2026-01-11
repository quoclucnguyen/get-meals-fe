import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { mealsApi } from "@/lib/api/meals";
import type {
  Meal,
  CreateMealInput,
  UpdateMealInput,
  GetMealsQuery,
} from "@/lib/types";

/**
 * Query keys for meals
 */
export const mealKeys = {
  all: ["meals"] as const,
  lists: () => [...mealKeys.all, "list"] as const,
  list: (filters: GetMealsQuery) => [...mealKeys.lists(), filters] as const,
  details: () => [...mealKeys.all, "detail"] as const,
  detail: (id: string) => [...mealKeys.details(), id] as const,
  byDate: (date: string) => [...mealKeys.all, "byDate", date] as const,
};

/**
 * Fetch all meals with optional filters
 */
export function useMealsQuery(
  filters?: GetMealsQuery,
  options?: Omit<UseQueryOptions<Meal[]>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: mealKeys.list(filters || {}),
    queryFn: async () => {
      const response = await mealsApi.getMeals(filters);
      return response.meals;
    },
    ...options,
  });
}

/**
 * Fetch meals for a specific date
 */
export function useMealsByDateQuery(
  date: Date,
  options?: Omit<UseQueryOptions<Meal[]>, "queryKey" | "queryFn">
) {
  const dateStr = date.toISOString().split("T")[0];

  return useQuery({
    queryKey: mealKeys.byDate(dateStr),
    queryFn: async () => {
      const response = await mealsApi.getMeals({
        startDate: dateStr,
        endDate: dateStr,
      });
      return response.meals;
    },
    ...options,
  });
}

/**
 * Fetch a single meal by ID
 */
export function useMealQuery(
  id: string,
  options?: Omit<UseQueryOptions<Meal>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: mealKeys.detail(id),
    queryFn: async () => {
      const response = await mealsApi.getMeal(id);
      return response.meal;
    },
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new meal with optimistic update
 */
export function useCreateMealMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateMealInput) => {
      const response = await mealsApi.createMeal(input);
      return response.meal;
    },
    onMutate: async (newMeal) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: mealKeys.lists() });

      // Snapshot previous data
      const previousMeals = queryClient.getQueryData<Meal[]>(
        mealKeys.byDate(newMeal.date)
      );

      // Optimistically add to cache
      if (previousMeals) {
        queryClient.setQueryData<Meal[]>(mealKeys.byDate(newMeal.date), [
          ...previousMeals,
          {
            ...newMeal,
            id: `temp-${Date.now()}`,
            createdAt: new Date().toISOString(),
          } as Meal,
        ]);
      }

      return { previousMeals };
    },
    onError: (_err, variables, context) => {
      // Rollback on error
      if (context?.previousMeals) {
        queryClient.setQueryData(
          mealKeys.byDate(variables.date),
          context.previousMeals
        );
      }
    },
    onSuccess: (data, variables) => {
      // Replace optimistic update with actual data
      queryClient.setQueryData(mealKeys.byDate(variables.date), (old: Meal[] | undefined) => {
        if (!old) return [data];
        return old.map((meal: Meal) =>
          meal.id.startsWith("temp-") ? data : meal
        );
      });
    },
    onSettled: () => {
      // Refetch to ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: mealKeys.lists() });
    },
  });
}

/**
 * Update an existing meal with optimistic update
 */
export function useUpdateMealMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateMealInput;
    }) => {
      const response = await mealsApi.updateMeal(id, input);
      return response.meal;
    },
    onMutate: async ({ id, input }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: mealKeys.lists() });
      await queryClient.cancelQueries({ queryKey: mealKeys.detail(id) });

      // Snapshot previous data
      const previousMeals = input.date
        ? queryClient.getQueryData<Meal[]>(mealKeys.byDate(input.date))
        : null;
      const previousMeal = queryClient.getQueryData<Meal>(mealKeys.detail(id));

      // Optimistically update cache
      if (previousMeals && input.date) {
        queryClient.setQueryData<Meal[]>(mealKeys.byDate(input.date), (old) =>
          old?.map((meal: Meal) =>
            meal.id === id ? { ...meal, ...input } : meal
          )
        );
      }
      if (previousMeal) {
        queryClient.setQueryData<Meal>(
          mealKeys.detail(id),
          (old) =>
            ({
              ...old,
              ...input,
            } as Meal)
        );
      }

      return { previousMeals, previousMeal };
    },
    onError: (_err, variables, context) => {
      // Rollback on error
      if (context?.previousMeals && variables.input.date) {
        queryClient.setQueryData(
          mealKeys.byDate(variables.input.date),
          context.previousMeals
        );
      }
      if (context?.previousMeal) {
        queryClient.setQueryData(
          mealKeys.detail(variables.id),
          context.previousMeal
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      // Refetch to ensure cache is in sync
      if (variables?.input?.date) {
        queryClient.invalidateQueries({
          queryKey: mealKeys.detail(variables.id),
        });
        queryClient.invalidateQueries({
          queryKey: mealKeys.byDate(variables.input.date),
        });
      }
      queryClient.invalidateQueries({ queryKey: mealKeys.lists() });
    },
  });
}

/**
 * Delete a meal with optimistic update
 */
export function useDeleteMealMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (meal: Meal) => {
      const response = await mealsApi.deleteMeal(meal.id);
      return response;
    },
    onMutate: async (meal) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: mealKeys.lists() });
      await queryClient.cancelQueries({ queryKey: mealKeys.detail(meal.id) });

      // Snapshot previous data
      const previousMeals = queryClient.getQueryData<Meal[]>(
        mealKeys.byDate(meal.date)
      );

      // Optimistically remove from cache
      if (previousMeals) {
        queryClient.setQueryData<Meal[]>(mealKeys.byDate(meal.date), (old) =>
          old?.filter((m: Meal) => m.id !== meal.id)
        );
      }

      return { previousMeals };
    },
    onError: (_err, variables, context) => {
      // Rollback on error
      if (context?.previousMeals) {
        queryClient.setQueryData(
          mealKeys.byDate(variables.date),
          context.previousMeals
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      // Refetch to ensure cache is in sync
      if (variables?.id) {
        queryClient.invalidateQueries({
          queryKey: mealKeys.detail(variables.id),
        });
        queryClient.invalidateQueries({
          queryKey: mealKeys.byDate(variables.date),
        });
      }
      queryClient.invalidateQueries({ queryKey: mealKeys.lists() });
    },
  });
}

import {
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { weatherApi } from "@/lib/api/weather";
import type { Weather, GetWeatherQuery } from "@/lib/types";

/**
 * Query keys for weather
 */
export const weatherKeys = {
  all: ["weather"] as const,
  current: (params?: GetWeatherQuery) =>
    [...weatherKeys.all, "current", params] as const,
};

/**
 * Fetch current weather
 */
export function useWeatherQuery(
  params?: GetWeatherQuery,
  options?: Omit<UseQueryOptions<Weather>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: weatherKeys.current(params),
    queryFn: async () => {
      const response = await weatherApi.getWeather(params);
      return response.weather;
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    ...options,
  });
}

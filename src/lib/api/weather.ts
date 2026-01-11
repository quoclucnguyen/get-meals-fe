import apiClient, { handleApiResponse } from './client';
import type { ApiResponse, Weather, GetWeatherQuery } from '../types';

export const weatherApi = {
  // Get current weather
  async getWeather(query?: GetWeatherQuery): Promise<{ weather: Weather }> {
    const response = await apiClient.get<ApiResponse<{ weather: Weather }>>(
      '/api/weather',
      { params: query }
    );
    return handleApiResponse(response.data);
  },
};

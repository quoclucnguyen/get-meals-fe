import apiClient, { handleApiResponse } from './client';
import type {
  ApiResponse,
  RecommendationsResponse,
  GetRecommendationsQuery,
  RefreshRecommendationsInput,
} from '../types';

export const recommendationsApi = {
  // Get recommendations for a meal type
  async getRecommendations(
    query: GetRecommendationsQuery
  ): Promise<RecommendationsResponse> {
    const response = await apiClient.get<ApiResponse<RecommendationsResponse>>(
      '/api/recommendations',
      { params: query }
    );
    return handleApiResponse(response.data);
  },

  // Refresh recommendations (force new ones)
  async refreshRecommendations(
    input: RefreshRecommendationsInput
  ): Promise<RecommendationsResponse> {
    const response = await apiClient.post<ApiResponse<RecommendationsResponse>>(
      '/api/recommendations/refresh',
      input
    );
    return handleApiResponse(response.data);
  },
};

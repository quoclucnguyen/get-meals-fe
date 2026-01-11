import apiClient, { handleApiResponse } from './client';
import type {
  ApiResponse,
  Rating,
  CreateRatingInput,
  GetRatingsResponse,
} from '../types';

export const ratingsApi = {
  // Get ratings for a meal
  async getRatings(mealId: string): Promise<GetRatingsResponse> {
    const response = await apiClient.get<ApiResponse<GetRatingsResponse>>(
      '/api/ratings',
      { params: { mealId } }
    );
    return handleApiResponse(response.data);
  },

  // Create a rating
  async createRating(input: CreateRatingInput): Promise<{ rating: Rating }> {
    const response = await apiClient.post<ApiResponse<{ rating: Rating }>>(
      '/api/ratings',
      input
    );
    return handleApiResponse(response.data);
  },
};

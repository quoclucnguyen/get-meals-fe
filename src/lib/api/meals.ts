import apiClient, { handleApiResponse } from './client';
import type {
  ApiResponse,
  Meal,
  CreateMealInput,
  UpdateMealInput,
  GetMealsQuery,
  GetMealsResponse,
} from '../types';

export const mealsApi = {
  // Get all meals with optional filters
  async getMeals(query?: GetMealsQuery): Promise<GetMealsResponse> {
    const response = await apiClient.get<ApiResponse<GetMealsResponse>>('/api/meals', {
      params: query,
    });
    return handleApiResponse(response.data);
  },

  // Get a single meal by ID
  async getMeal(id: string): Promise<{ meal: Meal }> {
    const response = await apiClient.get<ApiResponse<{ meal: Meal }>>(
      `/api/meals/${id}`
    );
    return handleApiResponse(response.data);
  },

  // Create a new meal
  async createMeal(input: CreateMealInput): Promise<{ meal: Meal }> {
    const response = await apiClient.post<ApiResponse<{ meal: Meal }>>(
      '/api/meals',
      input
    );
    return handleApiResponse(response.data);
  },

  // Update an existing meal
  async updateMeal(id: string, input: UpdateMealInput): Promise<{ meal: Meal }> {
    const response = await apiClient.put<ApiResponse<{ meal: Meal }>>(
      `/api/meals/${id}`,
      input
    );
    return handleApiResponse(response.data);
  },

  // Delete a meal
  async deleteMeal(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/api/meals/${id}`
    );
    return handleApiResponse(response.data);
  },

  // Get today's meals
  async getTodayMeals(): Promise<Meal[]> {
    const today = new Date().toISOString().split('T')[0];
    const response = await this.getMeals({
      startDate: today,
      endDate: today,
    });
    return response.meals;
  },

  // Search meal names for autocomplete
  async searchMealNames(query: string): Promise<{ names: string[] }> {
    const response = await apiClient.get<ApiResponse<{ names: string[] }>>(
      '/api/meals/search/names',
      {
        params: { query },
      }
    );
    return handleApiResponse(response.data);
  },
};

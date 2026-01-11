import apiClient, { handleApiResponse } from './client';
import type {
  ApiResponse,
  Preferences,
  UpdatePreferencesInput,
} from '../types';

export const preferencesApi = {
  // Get user preferences
  async getPreferences(): Promise<{ preferences: Preferences }> {
    const response = await apiClient.get<ApiResponse<{ preferences: Preferences }>>(
      '/api/preferences'
    );
    return handleApiResponse(response.data);
  },

  // Update user preferences
  async updatePreferences(
    input: UpdatePreferencesInput
  ): Promise<{ preferences: Preferences }> {
    const response = await apiClient.put<ApiResponse<{ preferences: Preferences }>>(
      '/api/preferences',
      input
    );
    return handleApiResponse(response.data);
  },
};

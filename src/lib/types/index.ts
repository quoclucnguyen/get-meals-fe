// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    message: string;
    code: string;
    details?: unknown;
  } | null;
}

// Meal Types
export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';

export interface Meal {
  id: string;
  name: string;
  description: string | null;
  mealType: MealType;
  date: string;
  createdAt: string;
  ratings?: Rating[];
}

export interface CreateMealInput {
  name: string;
  description?: string;
  mealType: MealType;
  date: string;
}

export interface UpdateMealInput {
  name?: string;
  description?: string;
  mealType?: MealType;
  date?: string;
}

export interface GetMealsQuery {
  startDate?: string;
  endDate?: string;
  mealType?: MealType;
  limit?: number;
  offset?: number;
}

export interface GetMealsResponse {
  meals: Meal[];
  total: number;
}

// Rating Types
export interface Rating {
  id: string;
  mealId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface CreateRatingInput {
  mealId: string;
  rating: number;
  comment?: string;
}

export interface GetRatingsQuery {
  mealId?: string;
  limit?: number;
  offset?: number;
}

export interface GetRatingsResponse {
  ratings: Rating[];
  average: number;
  count: number;
}

// Recommendation Types
export interface Recommendation {
  name: string;
  description: string;
  reasoning: string;
  cookingTime: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  calories?: string;
  protein?: string;
  ingredients?: string[];
}

export interface RecommendationsResponse {
  recommendations: Recommendation[];
  context: {
    weather: {
      condition: string;
      temperature: number;
    };
    mealHistory: Array<{
      name: string;
      mealType: MealType;
      date: string;
    }>;
    preferences: {
      favoriteCuisines: string[];
      dietaryRestrictions: string[];
    };
  };
  generatedAt: string;
}

export interface GetRecommendationsQuery {
  mealType: MealType;
  date?: string;
  refresh?: boolean;
}

export interface RefreshRecommendationsInput {
  mealType: MealType;
  date?: string;
}

// Preferences Types
export interface Preferences {
  id: string;
  dietaryRestrictions: string[];
  favoriteCuisines: string[];
  dislikedIngredients: string[];
  locationName: string | null;
  locationLat: number | null;
  locationLng: number | null;
  updatedAt: string;
}

export interface UpdatePreferencesInput {
  dietaryRestrictions?: string[];
  favoriteCuisines?: string[];
  dislikedIngredients?: string[];
  locationName?: string;
  locationLat?: number;
  locationLng?: number;
}

// Weather Types
export interface Weather {
  temp: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  location: string;
  fetchedAt: string;
}

export interface GetWeatherQuery {
  lat?: number;
  lng?: number;
}

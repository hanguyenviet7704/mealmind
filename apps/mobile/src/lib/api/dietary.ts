import { api } from './client';

export interface DietaryRestrictions {
  userId: string;
  profileId?: string;
  dietType: 'normal' | 'vegetarian' | 'vegan' | 'keto' | 'lowCarb' | 'halal';
  allergens: string[];
  medicalConditions: string[];
  customBlacklist: string[];
}

export interface NutritionGoals {
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams?: number;
}

export const dietaryApi = {
  getRestrictions: (userId: string, profileId?: string) => {
    const qs = profileId ? `?profileId=${profileId}` : '';
    return api.get<{ data: DietaryRestrictions }>(`/users/${userId}/dietary${qs}`);
  },

  updateRestrictions: (userId: string, data: Partial<DietaryRestrictions>) =>
    api.put<{ data: DietaryRestrictions }>(`/users/${userId}/dietary`, data),

  getNutritionGoals: (userId: string) =>
    api.get<{ data: NutritionGoals }>(`/users/${userId}/nutrition-goals`),

  updateNutritionGoals: (userId: string, goals: NutritionGoals) =>
    api.put<{ data: NutritionGoals }>(`/users/${userId}/nutrition-goals`, goals),
};

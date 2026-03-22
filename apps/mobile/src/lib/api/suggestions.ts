import { api } from './client';

export interface RecipeSummary {
  id: string;
  name: string;
  imageUrl: string;
  cookTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  calories: number;
  cuisine: string;
  mealTypes: Array<'breakfast' | 'lunch' | 'dinner' | 'snack'>;
}

export interface SuggestionCard {
  id: string;
  recipe: RecipeSummary;
  score: number;
  reason: string;
  reasonType: 'taste_match' | 'context_match' | 'diversity' | 'popular' | 'surprise';
  tags: string[];
}

export interface ContextData {
  currentMealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  weather: { temperature: number; condition: string; available: boolean };
  season: string;
  dayOfWeek: string;
  isWeekend: boolean;
  timeOfDay: string;
}

export interface ComboItem {
  role: 'main' | 'soup' | 'vegetable' | 'dessert' | 'side';
  recipe: RecipeSummary;
}

export interface ComboSuggestion {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  items: ComboItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  servings: number;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export const suggestionsApi = {
  getSuggestions: (params?: { mealType?: MealType; count?: number }) => {
    const qs = new URLSearchParams();
    if (params?.mealType) qs.set('mealType', params.mealType);
    if (params?.count) qs.set('count', String(params.count));
    return api.get<{
      data: { suggestions: SuggestionCard[]; context: ContextData; remaining: number };
    }>(`/suggestions?${qs}`);
  },

  getSurprise: (mealType?: MealType) => {
    const qs = mealType ? `?mealType=${mealType}` : '';
    return api.get<{ data: SuggestionCard }>(`/suggestions/surprise${qs}`);
  },

  getCombo: (mealType: 'breakfast' | 'lunch' | 'dinner', servings = 2) =>
    api.get<{ data: ComboSuggestion }>(
      `/suggestions/combo?mealType=${mealType}&servings=${servings}`,
    ),

  swapComboItem: (comboId: string, role: string, excludeRecipeId?: string) =>
    api.post<{ data: ComboSuggestion }>('/suggestions/combo/swap', {
      comboId,
      role,
      excludeRecipeId,
    }),

  refreshSuggestions: (params: {
    mealType?: MealType;
    excludeRecipeIds: string[];
    count?: number;
  }) =>
    api.post<{ data: { suggestions: SuggestionCard[] } }>('/suggestions/refresh', params),

  recordInteractions: (
    interactions: Array<{
      recipeId: string;
      action: 'view' | 'skip' | 'save' | 'cook';
      suggestionId?: string;
      context?: { mealType?: string; source?: string };
      timestamp?: string;
    }>,
  ) => api.post<{ data: { accepted: number } }>('/interactions', { interactions }),

  getHistory: (params?: {
    days?: number;
    action?: 'view' | 'skip' | 'save' | 'cook';
    page?: number;
    pageSize?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params?.days) qs.set('days', String(params.days));
    if (params?.action) qs.set('action', params.action);
    if (params?.page) qs.set('page', String(params.page));
    if (params?.pageSize) qs.set('pageSize', String(params.pageSize));
    return api.get<{ data: unknown[]; meta: { page: number; pageSize: number; total: number } }>(
      `/interactions/history?${qs}`,
    );
  },
};

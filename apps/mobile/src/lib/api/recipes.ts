import { api } from './client';
import type { RecipeSummary } from './suggestions';

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  group: 'main' | 'seasoning' | 'garnish';
}

export interface CookingStep {
  order: number;
  description: string;
  timerSeconds?: number;
  imageUrl?: string;
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sodium?: number;
}

export interface RecipeDetail {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  cookTime: number;
  prepTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  calories: number;
  cuisine: string;
  mealTypes: string[];
  defaultServings: number;
  ingredients: Ingredient[];
  steps: CookingStep[];
  nutrition: Nutrition;
  tags: string[];
  rating?: { average: number; count: number };
  isBookmarked?: boolean;
}

export interface RecipeListMeta {
  total: number;
  page: number;
  pageSize: number;
}

export const recipesApi = {
  list: (params?: {
    cuisine?: string;
    mealType?: string;
    difficulty?: string;
    maxCookTime?: number;
    sortBy?: string;
    page?: number;
    pageSize?: number;
    q?: string;
  }) => {
    const qs = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined) qs.set(k, String(v));
      });
    }
    return api.get<{ data: RecipeSummary[]; meta: RecipeListMeta }>(`/recipes?${qs}`);
  },

  search: (q: string, params?: { cuisine?: string; mealType?: string; page?: number }) => {
    const qs = new URLSearchParams({ q });
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined) qs.set(k, String(v));
      });
    }
    return api.get<{ data: RecipeSummary[]; meta: RecipeListMeta }>(`/recipes/search?${qs}`);
  },

  getDetail: (recipeId: string, servings?: number) => {
    const qs = servings ? `?servings=${servings}` : '';
    return api.get<{ data: RecipeDetail }>(`/recipes/${recipeId}${qs}`);
  },

  bookmark: (recipeId: string) =>
    api.post<void>(`/recipes/${recipeId}/bookmark`),

  unbookmark: (recipeId: string) =>
    api.delete<void>(`/recipes/${recipeId}/bookmark`),

  getBookmarks: (params?: { page?: number; pageSize?: number }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set('page', String(params.page));
    if (params?.pageSize) qs.set('pageSize', String(params.pageSize));
    return api.get<{ data: RecipeSummary[]; meta: RecipeListMeta }>(`/recipes/bookmarks?${qs}`);
  },

  rate: (recipeId: string, rating: number, comment?: string) =>
    api.post<void>(`/recipes/${recipeId}/ratings`, { rating, comment }),
};

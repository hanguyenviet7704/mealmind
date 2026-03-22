import { api } from './client';
import type { RecipeSummary } from './suggestions';

export type MealType = 'breakfast' | 'lunch' | 'dinner';
export type PlanStatus = 'draft' | 'active' | 'archived';

export interface MealSlot {
  id: string;
  dayOfWeek: number; // 0=Mon ... 6=Sun
  mealType: MealType;
  recipe: RecipeSummary | null;
  servings: number;
  isLocked: boolean;
}

export interface MealPlan {
  id: string;
  name: string;
  status: PlanStatus;
  weekStart: string; // ISO date
  weekEnd: string;
  totalCalories: number;
  slots: MealSlot[];
  createdAt: string;
}

export interface MealPlanSummary {
  id: string;
  name: string;
  status: PlanStatus;
  weekStart: string;
  weekEnd: string;
  totalCalories: number;
  createdAt: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  checked: boolean;
  category: string;
}

export interface ShoppingList {
  id: string;
  mealPlanId: string;
  items: ShoppingItem[];
  generatedAt: string;
}

export const mealPlansApi = {
  create: (params: {
    name?: string;
    weekStart: string;
    profileId?: string;
    preferences?: {
      excludeRecipeIds?: string[];
      preferredCuisines?: string[];
    };
  }) => api.post<{ data: MealPlan }>('/meal-plans', params),

  list: (params?: { status?: PlanStatus; page?: number; pageSize?: number }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.page) qs.set('page', String(params.page));
    if (params?.pageSize) qs.set('pageSize', String(params.pageSize));
    return api.get<{ data: MealPlanSummary[]; meta: { total: number } }>(`/meal-plans?${qs}`);
  },

  getDetail: (id: string) =>
    api.get<{ data: MealPlan }>(`/meal-plans/${id}`),

  updateStatus: (id: string, status: PlanStatus) =>
    api.patch<{ data: MealPlan }>(`/meal-plans/${id}`, { status }),

  delete: (id: string) =>
    api.delete<void>(`/meal-plans/${id}`),

  updateSlot: (planId: string, slotId: string, params: {
    recipeId?: string | null;
    servings?: number;
    isLocked?: boolean;
  }) =>
    api.patch<{ data: MealSlot }>(`/meal-plans/${planId}/slots/${slotId}`, params),

  getSlotSuggestions: (planId: string, slotId: string) =>
    api.get<{ data: RecipeSummary[] }>(
      `/meal-plans/${planId}/slots/${slotId}/suggestions`,
    ),

  generateShopping: (planId: string) =>
    api.post<{ data: ShoppingList }>(`/meal-plans/${planId}/shopping`),

  getShopping: (planId: string) =>
    api.get<{ data: ShoppingList }>(`/meal-plans/${planId}/shopping`),

  toggleShoppingItem: (itemId: string, checked: boolean) =>
    api.patch<{ data: ShoppingItem }>(`/shopping/${itemId}`, { checked }),
};

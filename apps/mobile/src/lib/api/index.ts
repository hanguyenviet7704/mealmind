export { api, tokenStorage, ApiError } from './client';
export { authApi } from './auth';
export { suggestionsApi } from './suggestions';
export { recipesApi } from './recipes';
export { mealPlansApi } from './mealPlans';
export { onboardingApi } from './onboarding';
export { dietaryApi } from './dietary';
export { notificationsApi } from './notifications';

export type { UserSummary, AuthResponse } from './auth';
export type { RecipeSummary, SuggestionCard, ComboSuggestion, ComboItem, ContextData, MealType } from './suggestions';
export type { RecipeDetail, Ingredient, CookingStep, Nutrition } from './recipes';
export type { MealPlan, MealPlanSummary, MealSlot, ShoppingList, ShoppingItem } from './mealPlans';
export type { TasteProfile, FamilyProfile } from './onboarding';
export type { DietaryRestrictions, NutritionGoals } from './dietary';
export type { Notification } from './notifications';

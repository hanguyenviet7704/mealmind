export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token?: string };
  Onboarding: undefined;
  Main: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Search: undefined;
  Surprise: undefined;
  QuickCook: undefined;
  Combo: undefined;
};

export type RecipesStackParamList = {
  Recipes: undefined;
  RecipeDetail: { id: string | number };
  NutritionDetail: { id: string | number };
  CookingMode: { id: string | number };
};

export type PlanStackParamList = {
  MealPlan: undefined;
  MealPlanDetail: { planId: string };
  CreatePlan: undefined;
  ShoppingList: { planId: string };
  WeekNutrition: { planId: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  Dietary: undefined;
  NutritionGoals: undefined;
  Family: undefined;
  Settings: undefined;
  ChangePassword: undefined;
  DeleteAccount: undefined;
  CookingHistory: undefined;
  Notification: undefined;
  UpgradePro: undefined;
};

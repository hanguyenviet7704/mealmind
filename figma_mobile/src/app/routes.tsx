import { createBrowserRouter, Navigate } from "react-router";
import { MobileLayout } from "./components/MobileLayout";
import { SplashScreen } from "./screens/SplashScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { RegisterScreen } from "./screens/RegisterScreen";
import { ForgotPasswordScreen } from "./screens/ForgotPasswordScreen";
import { ResetPasswordScreen } from "./screens/ResetPasswordScreen";
import { OnboardingScreen } from "./screens/OnboardingScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { SearchScreen } from "./screens/SearchScreen";
import { SurpriseScreen } from "./screens/SurpriseScreen";
import { QuickCookScreen } from "./screens/QuickCookScreen";
import { ComboScreen } from "./screens/ComboScreen";
import { RecipesScreen } from "./screens/RecipesScreen";
import { RecipeDetailScreen } from "./screens/RecipeDetailScreen";
import { NutritionDetailScreen } from "./screens/NutritionDetailScreen";
import { CookingModeScreen } from "./screens/CookingModeScreen";
import { MealPlanScreen } from "./screens/MealPlanScreen";
import { MealPlanDetailScreen } from "./screens/MealPlanDetailScreen";
import { CreatePlanScreen } from "./screens/CreatePlanScreen";
import { ShoppingListScreen } from "./screens/ShoppingListScreen";
import { WeekNutritionScreen } from "./screens/WeekNutritionScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { EditProfileScreen } from "./screens/EditProfileScreen";
import { DietaryScreen } from "./screens/DietaryScreen";
import { NutritionGoalsScreen } from "./screens/NutritionGoalsScreen";
import { FamilyScreen } from "./screens/FamilyScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { ChangePasswordScreen } from "./screens/ChangePasswordScreen";
import { DeleteAccountScreen } from "./screens/DeleteAccountScreen";
import { CookingHistoryScreen } from "./screens/CookingHistoryScreen";
import { NotificationScreen } from "./screens/NotificationScreen";
import { UpgradeProScreen } from "./screens/UpgradeProScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MobileLayout,
    children: [
      { index: true, element: <Navigate to="/splash" replace /> },
      { path: "splash", Component: SplashScreen },
      { path: "login", Component: LoginScreen },
      { path: "register", Component: RegisterScreen },
      { path: "forgot-password", Component: ForgotPasswordScreen },
      { path: "reset-password", Component: ResetPasswordScreen },
      { path: "onboarding", Component: OnboardingScreen },
      { path: "home", Component: HomeScreen },
      { path: "search", Component: SearchScreen },
      { path: "surprise", Component: SurpriseScreen },
      { path: "quick-cook", Component: QuickCookScreen },
      { path: "combo", Component: ComboScreen },
      { path: "recipes", Component: RecipesScreen },
      { path: "recipes/:id", Component: RecipeDetailScreen },
      { path: "recipes/:id/nutrition", Component: NutritionDetailScreen },
      { path: "recipes/:id/cook", Component: CookingModeScreen },
      { path: "plan", Component: MealPlanScreen },
      { path: "plan/active", Component: MealPlanDetailScreen },
      { path: "plan/create", Component: CreatePlanScreen },
      { path: "plan/shopping", Component: ShoppingListScreen },
      { path: "plan/nutrition", Component: WeekNutritionScreen },
      { path: "profile", Component: ProfileScreen },
      { path: "profile/edit", Component: EditProfileScreen },
      { path: "profile/dietary", Component: DietaryScreen },
      { path: "profile/goals", Component: NutritionGoalsScreen },
      { path: "profile/family", Component: FamilyScreen },
      { path: "settings", Component: SettingsScreen },
      { path: "settings/password", Component: ChangePasswordScreen },
      { path: "settings/delete", Component: DeleteAccountScreen },
      { path: "history", Component: CookingHistoryScreen },
      { path: "notifications", Component: NotificationScreen },
      { path: "upgrade", Component: UpgradeProScreen },
      { path: "*", element: <Navigate to="/home" replace /> },
    ],
  },
]);

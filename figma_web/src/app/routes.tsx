import { createBrowserRouter } from "react-router";
import RootLayout from "./layouts/root-layout";
import SplashScreen from "./screens/system/splash-screen";
import LoginScreen from "./screens/auth/login-screen";
import RegisterScreen from "./screens/auth/register-screen";
import ForgotPasswordScreen from "./screens/auth/forgot-password-screen";
import ResetPasswordScreen from "./screens/auth/reset-password-screen";
import OnboardingScreen from "./screens/onboarding/onboarding-screen";
import HomeScreen from "./screens/home/home-screen";
import ComboScreen from "./screens/home/combo-screen";
import SurpriseScreen from "./screens/home/surprise-screen";
import QuickCookScreen from "./screens/home/quick-cook-screen";
import RecipeListScreen from "./screens/recipes/recipe-list-screen";
import RecipeDetailScreen from "./screens/recipes/recipe-detail-screen";
import MealPlanScreen from "./screens/meal-plan/meal-plan-screen";
import ProfileScreen from "./screens/profile/profile-screen";
import SettingsScreen from "./screens/settings/settings-screen";
import UpgradeScreen from "./screens/premium/upgrade-screen";
import CookingHistoryScreen from "./screens/history/cooking-history-screen";
import AddBookmarkScreen from "./screens/recipes/add-bookmark-screen";
import CookingModeScreen from "./screens/recipes/cooking-mode-screen";
import ErrorScreen from "./screens/system/error-screen";
import OfflineScreen from "./screens/system/offline-screen";
import MaintenanceScreen from "./screens/system/maintenance-screen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <ErrorScreen />,
    children: [
      { index: true, Component: SplashScreen },
      { path: "login", Component: LoginScreen },
      { path: "register", Component: RegisterScreen },
      { path: "forgot-password", Component: ForgotPasswordScreen },
      { path: "reset-password", Component: ResetPasswordScreen },
      { path: "onboarding", Component: OnboardingScreen },
      { path: "home", Component: HomeScreen },
      { path: "combo", Component: ComboScreen },
      { path: "surprise", Component: SurpriseScreen },
      { path: "quick-cook", Component: QuickCookScreen },
      { path: "recipes", Component: RecipeListScreen },
      { path: "recipes/new", Component: AddBookmarkScreen },
      { path: "recipes/:id", Component: RecipeDetailScreen },
      { path: "recipes/:id/cook", Component: CookingModeScreen },
      { path: "meal-plan", Component: MealPlanScreen },
      { path: "profile", Component: ProfileScreen },
      { path: "profile/history", Component: CookingHistoryScreen },
      { path: "settings", Component: SettingsScreen },
      { path: "upgrade", Component: UpgradeScreen },
      { path: "offline", Component: OfflineScreen },
      { path: "maintenance", Component: MaintenanceScreen },
      { path: "error", Component: ErrorScreen },
    ],
  },
]);
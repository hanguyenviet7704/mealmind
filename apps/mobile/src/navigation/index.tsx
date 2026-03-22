import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useAuthStore } from '../store/authStore';

import {
  RootStackParamList,
  HomeStackParamList,
  RecipesStackParamList,
  PlanStackParamList,
  ProfileStackParamList,
} from './types';

// Auth Screens
import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { ResetPasswordScreen } from '../screens/ResetPasswordScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';

// Home Screens
import { HomeScreen } from '../screens/HomeScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { SurpriseScreen } from '../screens/SurpriseScreen';
import { QuickCookScreen } from '../screens/QuickCookScreen';
import { ComboScreen } from '../screens/ComboScreen';

// Recipes Screens
import { RecipesScreen } from '../screens/RecipesScreen';
import { RecipeDetailScreen } from '../screens/RecipeDetailScreen';
import { NutritionDetailScreen } from '../screens/NutritionDetailScreen';
import { CookingModeScreen } from '../screens/CookingModeScreen';

// Plan Screens
import { MealPlanScreen } from '../screens/MealPlanScreen';
import { MealPlanDetailScreen } from '../screens/MealPlanDetailScreen';
import { CreatePlanScreen } from '../screens/CreatePlanScreen';
import { ShoppingListScreen } from '../screens/ShoppingListScreen';
import { WeekNutritionScreen } from '../screens/WeekNutritionScreen';

// Profile / Settings Screens
import { ProfileScreen } from '../screens/ProfileScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { DietaryScreen } from '../screens/DietaryScreen';
import { NutritionGoalsScreen } from '../screens/NutritionGoalsScreen';
import { FamilyScreen } from '../screens/FamilyScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen';
import { DeleteAccountScreen } from '../screens/DeleteAccountScreen';
import { CookingHistoryScreen } from '../screens/CookingHistoryScreen';
import { NotificationScreen } from '../screens/NotificationScreen';
import { UpgradeProScreen } from '../screens/UpgradeProScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const RecipesStack = createNativeStackNavigator<RecipesStackParamList>();
const PlanStack = createNativeStackNavigator<PlanStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Search" component={SearchScreen} />
      <HomeStack.Screen name="Surprise" component={SurpriseScreen} />
      <HomeStack.Screen name="QuickCook" component={QuickCookScreen} />
      <HomeStack.Screen name="Combo" component={ComboScreen} />
    </HomeStack.Navigator>
  );
}

function RecipesStackNavigator() {
  return (
    <RecipesStack.Navigator screenOptions={{ headerShown: false }}>
      <RecipesStack.Screen name="Recipes" component={RecipesScreen} />
      <RecipesStack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
      <RecipesStack.Screen name="NutritionDetail" component={NutritionDetailScreen} />
      <RecipesStack.Screen name="CookingMode" component={CookingModeScreen} />
    </RecipesStack.Navigator>
  );
}

function PlanStackNavigator() {
  return (
    <PlanStack.Navigator screenOptions={{ headerShown: false }}>
      <PlanStack.Screen name="MealPlan" component={MealPlanScreen} />
      <PlanStack.Screen name="MealPlanDetail" component={MealPlanDetailScreen} />
      <PlanStack.Screen name="CreatePlan" component={CreatePlanScreen} />
      <PlanStack.Screen name="ShoppingList" component={ShoppingListScreen} />
      <PlanStack.Screen name="WeekNutrition" component={WeekNutritionScreen} />
    </PlanStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
      <ProfileStack.Screen name="Dietary" component={DietaryScreen} />
      <ProfileStack.Screen name="NutritionGoals" component={NutritionGoalsScreen} />
      <ProfileStack.Screen name="Family" component={FamilyScreen} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
      <ProfileStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <ProfileStack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
      <ProfileStack.Screen name="CookingHistory" component={CookingHistoryScreen} />
      <ProfileStack.Screen name="Notification" component={NotificationScreen} />
      <ProfileStack.Screen name="UpgradePro" component={UpgradeProScreen} />
    </ProfileStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.neutral400,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.neutral100,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="RecipesTab"
        component={RecipesStackNavigator}
        options={{
          tabBarLabel: 'Món ăn',
          tabBarIcon: ({ color, size }) => (
            <Feather name="book-open" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PlanTab"
        component={PlanStackNavigator}
        options={{
          tabBarLabel: 'Thực đơn',
          tabBarIcon: ({ color, size }) => (
            <Feather name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Cá nhân',
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { isAuthenticated, user } = useAuthStore();

  // Auth gate: if authenticated but onboarding not done → Onboarding
  // if authenticated and onboarding done → Main
  // otherwise → Auth screens
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        // Auth screens group
        <>
          <RootStack.Screen name="Splash" component={SplashScreen} />
          <RootStack.Screen name="Login" component={LoginScreen} />
          <RootStack.Screen name="Register" component={RegisterScreen} />
          <RootStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <RootStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </>
      ) : !user?.onboardingCompleted ? (
        <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <RootStack.Screen name="Main" component={MainTabs} />
      )}
    </RootStack.Navigator>
  );
}

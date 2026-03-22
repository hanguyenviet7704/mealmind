import { api } from './client';

export interface QuizStepData {
  step: number;
  data: Record<string, unknown>;
}

export interface TasteProfile {
  id: string;
  userId: string;
  cuisinePreferences: string[];
  spiceLevel: number;
  sweetLevel: number;
  saltyLevel: number;
  dietType: 'normal' | 'vegetarian' | 'vegan' | 'keto';
  allergens: string[];
  cookTimePreference: string;
  familySize: number;
  cookingLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface FamilyProfile {
  id: string;
  name: string;
  emoji: string;
  ageGroup: 'child' | 'teen' | 'adult' | 'senior';
  dietType?: string;
  allergens?: string[];
  isActive: boolean;
}

export const onboardingApi = {
  saveStep: (step: number, data: Record<string, unknown>) =>
    api.patch<void>(`/onboarding/quiz/${step}`, { data }),

  submitQuiz: (answers: {
    cuisinePreferences: string[];
    spiceLevel: number;
    sweetLevel: number;
    saltyLevel: number;
    allergens: string[];
    dietType: string;
    cookTimePreference: string;
    familySize: number;
    cookingLevel: string;
  }) => api.post<{ data: TasteProfile }>('/onboarding/quiz', answers),

  getProgress: () =>
    api.get<{ data: { completedSteps: number[]; lastStep: number } | null }>(
      '/onboarding/quiz/progress',
    ),

  // Family profiles
  getFamilyProfiles: () =>
    api.get<{ data: FamilyProfile[] }>('/profiles/family'),

  createFamilyProfile: (profile: Omit<FamilyProfile, 'id'>) =>
    api.post<{ data: FamilyProfile }>('/profiles/family', profile),

  updateFamilyProfile: (id: string, profile: Partial<FamilyProfile>) =>
    api.patch<{ data: FamilyProfile }>(`/profiles/family/${id}`, profile),

  deleteFamilyProfile: (id: string) =>
    api.delete<void>(`/profiles/family/${id}`),
};

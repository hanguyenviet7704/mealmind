# Screen Index & Navigation Map

Tổng cộng **45 screens** cho MealMind App (MVP + essential UX). Tổ chức theo 10 flows.

## Navigation Map

```
[S00 Splash / Loading]
  │
  ├─ Chưa login ─────────────────────────────────────────────────┐
  │                                                               │
  │   ┌──────────┐    ┌──────────┐    ┌──────────────────┐       │
  │   │  Login    │───>│ Register │    │ Forgot Password  │       │
  │   │  (S01)   │<───│  (S02)   │    │     (S03)        │       │
  │   │          │───>│          │    │        │         │       │
  │   └────┬─────┘    └──────────┘    │   ┌────▼───────┐ │       │
  │        │                          │   │Reset Pass   │ │       │
  │        │                          │   │   (S04)     │ │       │
  │        │                          │   └────┬───────┘ │       │
  │        │                          └────────┼─────────┘       │
  │        │                                   │                  │
  ├────────┼───────────────────────────────────┘                  │
  │        │                                                       │
  │        ▼                                                       │
  │  Chưa onboarding?                                              │
  │   YES ──────────────────────────────────────┐                 │
  │                                             │                 │
  │   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
  │   │ OB 1/5 │→│ OB 2/5 │→│ OB 3/5 │→│ OB 4/5 │→│ OB 5/5 │   │
  │   │ Vùng   │ │ Khẩu vị│ │ Dị ứng │ │Chế độ  │ │TG+GĐ  │   │
  │   │ (S05)  │ │ (S06)  │ │ (S07)  │ │ (S08)  │ │ (S09)  │   │
  │   └────────┘ └────────┘ └────────┘ └────────┘ └───┬────┘   │
  │                                                     │         │
  │   ┌─────────────────────────────────────────────────┘         │
  │   │                                                            │
  │   ▼                                                            │
  │  ┌═══════════════════════ MAIN APP ═══════════════════════┐   │
  │  │                                                         │   │
  │  │  Tab/Nav:  [Home] [Recipes] [Meal Plan] [Profile]       │   │
  │  │                                                         │   │
  │  │  HOME TAB ─────────────────────────────────────────     │   │
  │  │  │ S10 Home (Suggestions)                              │   │
  │  │  │  ├─ S11 Combo Suggestion                            │   │
  │  │  │  ├─ S12 Surprise Suggestion                         │   │
  │  │  │  └─ S13 Quick Cook (< 15 min)                       │   │
  │  │  │                                                      │   │
  │  │  RECIPE TAB ───────────────────────────────────────     │   │
  │  │  │ S14 Recipe List / Search                            │   │
  │  │  │  ├─ S15 Recipe Detail ─┬─ S16 Cooking Mode          │   │
  │  │  │  │                     └─ S17 Nutrition Detail       │   │
  │  │  │  ├─ S18 Bookmarks                                   │   │
  │  │  │  └─ S19 Search Results (filters)                    │   │
  │  │  │                                                      │   │
  │  │  MEAL PLAN TAB ────────────────────────────────────     │   │
  │  │  │ S20 Meal Plan List                                  │   │
  │  │  │  ├─ S21 Meal Plan Detail ─┬─ S22 Slot Swap Modal    │   │
  │  │  │  │                        ├─ S23 Weekly Nutrition     │   │
  │  │  │  │                        └─ S24 Shopping List       │   │
  │  │  │  └─ S25 Create Plan Wizard                          │   │
  │  │  │                                                      │   │
  │  │  PROFILE TAB ──────────────────────────────────────     │   │
  │  │  │ S26 Profile Overview                                │   │
  │  │  │  ├─ S27 Edit Taste Profile                          │   │
  │  │  │  ├─ S28 Dietary Settings                            │   │
  │  │  │  ├─ S29 Nutrition Goals                             │   │
  │  │  │  ├─ S30 Family Profiles ─── S31 Edit Family Member  │   │
  │  │  │  ├─ S32 Settings ─┬─ S33 Change Password            │   │
  │  │  │  │                ├─ S34 Notification Settings       │   │
  │  │  │  │                ├─ S35 Language Selection          │   │
  │  │  │  │                └─ S36 Delete Account              │   │
  │  │  │  ├─ S37 Upgrade Pro                                 │   │
  │  │  │  └─ S38 Cooking History                             │   │
  │  │  │                                                      │   │
  │  │  GLOBAL OVERLAYS ──────────────────────────────────     │   │
  │  │    S39 Notification Center                             │   │
  │  │    S40 Share Modal                                     │   │
  │  │    S41 Upgrade Pro Modal                               │   │
  │  │    S42 Rate Recipe Modal                               │   │
  │  │                                                         │   │
  │  └═════════════════════════════════════════════════════┘   │
  │                                                            │
  │  SYSTEM SCREENS ──────────────────────────────────────     │
  │    S43 Offline Screen                                      │
  │    S44 Error Boundary Screen                               │
  │    S45 Maintenance Screen                                  │
  └────────────────────────────────────────────────────────────┘
```

---

## Screen List — Full Index

### Flow 0: System (`00-system.md`)
| ID | Screen | Route (web) | Mobile | Priority |
|----|--------|-------------|--------|----------|
| S00 | Splash / Loading | — (auto) | SplashScreen | P0 |
| S43 | Offline | — (overlay) | OfflineScreen | P0 |
| S44 | Error Boundary | /error | ErrorScreen | P0 |
| S45 | Maintenance | /maintenance | MaintenanceScreen | P1 |

### Flow 1: Auth (`01-auth.md`)
| ID | Screen | Route (web) | Mobile | Priority |
|----|--------|-------------|--------|----------|
| S01 | Login | /login | LoginScreen | P0 |
| S02 | Register | /register | RegisterScreen | P0 |
| S03 | Forgot Password | /forgot-password | ForgotPasswordScreen | P1 |
| S04 | Reset Password | /reset-password?token= | ResetPasswordScreen | P1 |

### Flow 2: Onboarding (`02-onboarding.md`)
| ID | Screen | Route (web) | Mobile | Priority |
|----|--------|-------------|--------|----------|
| S05 | OB 1/5: Vùng miền | /onboarding?step=1 | OnboardingScreen | P0 |
| S06 | OB 2/5: Khẩu vị | /onboarding?step=2 | OnboardingScreen | P0 |
| S07 | OB 3/5: Dị ứng | /onboarding?step=3 | OnboardingScreen | P0 |
| S08 | OB 4/5: Chế độ ăn | /onboarding?step=4 | OnboardingScreen | P0 |
| S09 | OB 5/5: Thời gian + Gia đình | /onboarding?step=5 | OnboardingScreen | P0 |

### Flow 3: Home / Suggestion (`03-suggestion.md`)
| ID | Screen | Route (web) | Mobile | Priority |
|----|--------|-------------|--------|----------|
| S10 | Home (Suggestions) | / | HomeScreen | P0 |
| S11 | Combo Suggestion | /combo | ComboScreen | P0 |
| S12 | Surprise Suggestion | /surprise | SurpriseScreen | P1 |
| S13 | Quick Cook (< 15 min) | /quick-cook | QuickCookScreen | P1 |

### Flow 4: Recipes (`04-recipe.md`)
| ID | Screen | Route (web) | Mobile | Priority |
|----|--------|-------------|--------|----------|
| S14 | Recipe List / Browse | /recipes | RecipesScreen | P0 |
| S15 | Recipe Detail | /recipes/:slug | RecipeDetailScreen | P0 |
| S16 | Cooking Mode | /recipes/:slug/cook | CookingModeScreen | P0 |
| S17 | Nutrition Detail | /recipes/:slug/nutrition | NutritionDetailScreen | P1 |
| S18 | Bookmarks | /bookmarks | BookmarksScreen | P1 |
| S19 | Search Results | /search?q= | SearchScreen | P0 |

### Flow 5: Meal Plan (`05-meal-plan.md`)
| ID | Screen | Route (web) | Mobile | Priority |
|----|--------|-------------|--------|----------|
| S20 | Meal Plan List | /meal-plans | MealPlanListScreen | P0 |
| S21 | Meal Plan Detail | /meal-plans/:id | MealPlanDetailScreen | P0 |
| S22 | Slot Swap (Modal/Sheet) | — (modal) | — (bottom sheet) | P0 |
| S23 | Weekly Nutrition | /meal-plans/:id/nutrition | WeekNutritionScreen | P1 |
| S24 | Shopping List | /meal-plans/:id/shopping | ShoppingListScreen | P1 |
| S25 | Create Plan Wizard | /meal-plans/create | CreatePlanScreen | P0 |

### Flow 6: Profile & Settings (`06-profile.md`)
| ID | Screen | Route (web) | Mobile | Priority |
|----|--------|-------------|--------|----------|
| S26 | Profile Overview | /profile | ProfileScreen | P0 |
| S27 | Edit Taste Profile | /profile/taste | EditTasteScreen | P1 |
| S28 | Dietary Settings | /profile/dietary | DietaryScreen | P1 |
| S29 | Nutrition Goals | /profile/nutrition-goals | NutritionGoalsScreen | P1 |
| S30 | Family Profiles | /profile/family | FamilyProfilesScreen | P1 |
| S31 | Edit Family Member | /profile/family/:id | EditFamilyScreen | P1 |

### Flow 7: Settings (`07-settings.md`) — NEW
| ID | Screen | Route (web) | Mobile | Priority |
|----|--------|-------------|--------|----------|
| S32 | Settings | /settings | SettingsScreen | P0 |
| S33 | Change Password | /settings/password | ChangePasswordScreen | P1 |
| S34 | Notification Settings | /settings/notifications | NotificationSettingsScreen | P1 |
| S35 | Language Selection | /settings/language | LanguageScreen | P2 |
| S36 | Delete Account | /settings/delete-account | DeleteAccountScreen | P1 |

### Flow 8: Premium (`08-premium.md`) — NEW
| ID | Screen | Route (web) | Mobile | Priority |
|----|--------|-------------|--------|----------|
| S37 | Upgrade Pro | /upgrade | UpgradeScreen | P1 |

### Flow 9: History & Stats (`09-history.md`) — NEW
| ID | Screen | Route (web) | Mobile | Priority |
|----|--------|-------------|--------|----------|
| S38 | Cooking History | /profile/history | CookingHistoryScreen | P1 |

### Flow 10: Modals & Overlays (`10-modals.md`) — NEW
| ID | Screen | Route (web) | Mobile | Priority |
|----|--------|-------------|--------|----------|
| S39 | Notification Center | /notifications (drawer) | NotificationScreen | P1 |
| S40 | Share Modal | — (modal) | — (share sheet) | P1 |
| S41 | Upgrade Pro Modal | — (modal) | — (modal) | P1 |
| S42 | Rate Recipe Modal | — (modal) | — (bottom sheet) | P1 |

---

## Priority Summary

| Priority | Count | Mô tả |
|----------|-------|-------|
| P0 | 22 | Core MVP — phải có để app chạy được |
| P1 | 19 | Important UX — nên có trước launch |
| P2 | 4 | Nice to have — làm sau launch |

---

## Shared / Global Components (luôn hiện)

| Component | Web | Mobile | Mô tả |
|-----------|-----|--------|-------|
| **NavBar** | Sticky top 64px | Hidden | Logo + tabs + avatar dropdown |
| **BottomTabBar** | Hidden | Fixed bottom 56px + safe area | 4 tabs: Home / Recipes / Meal Plan / Profile |
| **ProfileSwitcher** | Below NavBar | Top of Home | Switch individual ↔ family mode |
| **Loading Fullscreen** | Centered spinner | Centered spinner | Khi app bootstrap |
| **Offline Banner** | Sticky top below nav | Sticky top | "Mất kết nối mạng" + retry |
| **Toast** | Top-center | Top | Success / Error / Info notifications |

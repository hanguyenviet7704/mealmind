# Mobile Platform Guide — React Native

Bổ sung cho `docs/ui/design-tokens.md` (shared tokens). File này chỉ chứa phần khác biệt mobile.

---

## Navigation Architecture

```
App.tsx
├── AuthStack (khi chưa login)
│   ├── LoginScreen
│   ├── RegisterScreen
│   ├── ForgotPasswordScreen
│   └── ResetPasswordScreen
│
├── OnboardingStack (khi chưa onboarding)
│   └── OnboardingScreen (internal step state 1-5)
│
└── MainTabs (sau khi login + onboarding)
    ├── HomeStack
    │   ├── HomeScreen (S10)
    │   ├── ComboScreen (S11)
    │   └── RecipeDetailScreen (S15)
    │
    ├── RecipeStack
    │   ├── RecipesScreen (S14)
    │   ├── RecipeDetailScreen (S15)
    │   └── BookmarksScreen (S16)
    │
    ├── MealPlanStack
    │   ├── MealPlanScreen (S17)
    │   ├── MealPlanDetailScreen (S18)
    │   └── WeekNutritionScreen (S20)
    │
    └── ProfileStack
        ├── ProfileScreen (S21)
        ├── EditProfileScreen (S22)
        ├── DietaryScreen (S23)
        ├── NutritionGoalsScreen (S24)
        └── FamilyScreen (S25)
```

### Navigation Library
- **React Navigation v6+**
- `@react-navigation/native-stack` — cho stack navigators
- `@react-navigation/bottom-tabs` — cho bottom tab bar
- Animations: iOS default (slide from right), Android default (fade)

---

## Layout & Safe Areas

```
┌──────────────────────────┐
│ Status Bar (iOS/Android) │  ← SafeAreaView top
├──────────────────────────┤
│                          │
│    Screen Content        │  ← flex: 1, ScrollView
│                          │
│                          │
│                          │
│                          │
├──────────────────────────┤
│ Bottom Tab Bar (56px)    │  ← SafeAreaView bottom
└──────────────────────────┘
```

- **SafeAreaView** bọc mọi screen — xử lý notch (iPhone), status bar (Android)
- **KeyboardAvoidingView** cho screens có input (Login, Register, Search)
- **Bottom sheet** dùng `@gorhom/bottom-sheet` — cho action sheets, modals

---

## Screen Sizes Target

| Device | Width | Density | Notes |
|--------|-------|---------|-------|
| iPhone SE | 375pt | 2x | Minimum width support |
| iPhone 15 | 393pt | 3x | Primary design target |
| iPhone 15 Pro Max | 430pt | 3x | Large phone |
| Android Medium | 360dp | 2-3x | Most Android phones |
| Android Large | 412dp | 3x | Samsung Galaxy S series |

### Design Rules
- Min touch target: **44×44pt** (iOS HIG) / **48×48dp** (Material)
- Content padding: 16pt horizontal (tất cả screens)
- Card gap: 12pt
- Section gap: 24pt

---

## Typography (Mobile Override)

| Token | Web | Mobile | Lý do |
|-------|-----|--------|-------|
| `text-h1` | 30px | 28pt | Nhỏ hơn trên mobile |
| `text-h2` | 24px | 22pt | |
| `text-h3` | 20px | 18pt | |
| `text-body` | 16px | 16pt | Giữ nguyên |
| `text-body-sm` | 14px | 14pt | Giữ nguyên |
| `text-caption` | 12px | 12pt | Giữ nguyên — không nhỏ hơn |

**Font:** System font (San Francisco trên iOS, Roboto trên Android) — KHÔNG load custom font để tối ưu performance.

---

## Bottom Tab Bar

```
┌─────────┬─────────┬─────────┬─────────┐
│  🏠     │  📖     │  📅     │  👤     │
│  Home   │ Món ăn  │Thực đơn │ Cá nhân │
└─────────┴─────────┴─────────┴─────────┘
Height: 56pt + safe area bottom
```

| Tab | Icon (inactive) | Icon (active) | Label |
|-----|----------------|---------------|-------|
| Home | `Home` (outline) | `Home` (filled) | "Home" |
| Recipes | `BookOpen` (outline) | `BookOpen` (filled) | "Món ăn" |
| Meal Plan | `CalendarDays` (outline) | `CalendarDays` (filled) | "Thực đơn" |
| Profile | `User` (outline) | `User` (filled) | "Cá nhân" |

- Active: `orange-500` icon + label
- Inactive: `neutral-400` icon + label
- Badge: red dot trên tab khi có notification (Phase 2)

---

## Header Bar (Stack Screens)

```
┌──────────────────────────────────────┐
│ [←]  Title                    [♥][📤]│
│                                      │
│ Height: 44pt (iOS) / 56dp (Android) │
└──────────────────────────────────────┘
```

- Back button [←]: luôn hiện trên screens không phải tab root
- Title: centered (iOS), left-aligned (Android)
- Right actions: icon buttons (max 2)
- Background: white, border-bottom: neutral-200

---

## Gestures

| Gesture | Behavior | Screens |
|---------|----------|---------|
| Swipe from left edge | Go back (stack pop) | Tất cả non-root screens |
| Swipe card left/right | Skip/Accept suggestion | S10 Home |
| Pull down | Refresh data | S10, S14, S17, S21 |
| Long press card | Show context menu | S18 (meal plan slots) |
| Pinch zoom | Zoom recipe image | S15 Recipe Detail hero |
| Scroll to bottom | Load more (pagination) | S14, S16 |

### Pull-to-Refresh
```
Screens có pull-to-refresh:
- S10 Home → refetch suggestions
- S14 Recipe List → refetch recipes
- S16 Bookmarks → refetch bookmarks
- S17 Meal Plan List → refetch plans
- S21 Profile → refetch profile data

RefreshControl color: orange-500
```

---

## Bottom Sheet (thay Modal trên web)

Mobile dùng **bottom sheet** thay cho modal/dialog trên web:

| Web Component | Mobile Equivalent | Height |
|--------------|-------------------|--------|
| Modal (small) | Bottom Sheet 30% | ~300pt |
| Modal (medium) | Bottom Sheet 50% | ~450pt |
| Modal (large) | Bottom Sheet 85% | ~700pt |
| Dialog (confirm) | Alert.alert() native | Native OS dialog |
| Dropdown (select) | ActionSheet | Auto height |
| Filter dropdown | Bottom Sheet 50% | ~450pt |

### Bottom Sheet Template
```
┌──────────────────────────────────────┐
│              ── (drag handle)        │
│                                      │
│  Title                        [✕]   │
│  ─────────────────────────────────── │
│                                      │
│  Content                             │
│                                      │
│  ┌────────────────────────────────┐  │
│  │      [Primary Action]         │  │
│  └────────────────────────────────┘  │
│                                      │
│  Safe area bottom                    │
└──────────────────────────────────────┘
```

- Drag handle: 40×4pt, neutral-300, rounded
- Swipe down to dismiss
- Backdrop: black 50% opacity, tap to dismiss

---

## Haptic Feedback

| Action | Haptic Type | iOS | Android |
|--------|------------|-----|---------|
| Swipe accept suggestion | `notificationSuccess` | UIImpactFeedbackGenerator(.medium) | HapticFeedbackConstants.LONG_PRESS |
| Swipe skip suggestion | `notificationWarning` | UIImpactFeedbackGenerator(.light) | SHORT vibration |
| Bookmark toggle | `impactLight` | .light | SHORT |
| Timer complete | `notificationSuccess` | .heavy + sound | LONG + sound |
| Lock/unlock slot | `impactMedium` | .medium | SHORT |
| Pull-to-refresh trigger | `impactLight` | .light | — |
| Error (validation) | `notificationError` | .error | SHORT |

---

## Notifications (Push)

| Event | Title | Body | Action on tap |
|-------|-------|------|---------------|
| Morning suggestion | "Chào buổi sáng! 🌅" | "Hôm nay thử {recipeName} nhé!" | → S10 Home, mealType=breakfast |
| Lunch suggestion | "Đến giờ ăn trưa! 🍜" | "Gợi ý: {recipeName}" | → S10, mealType=lunch |
| Timer complete | "⏱ Hết giờ!" | "{stepDescription}" | → S15 Recipe Detail, step |
| Meal plan reminder | "📅 Thực đơn tuần mới" | "Tạo thực đơn cho tuần tới?" | → S17 Meal Plan |
| Shared plan | "📤 Thực đơn mới" | "{ownerName} chia sẻ thực đơn với bạn" | → S18 Plan Detail |

### Deep Link Scheme
```
mealmind://recipe/{id}       → S15
mealmind://meal-plan/{id}    → S18
mealmind://onboarding        → S05
mealmind://home?meal=lunch   → S10
mealmind://profile           → S21
```

---

## Offline & Loading

### Skeleton Screens
Mọi screen hiện skeleton thay loading spinner:
- RecipeCard skeleton: gray rectangle (image) + 2 text lines
- MealSlotCard skeleton: gray square + 1 text line
- Profile section skeleton: circle (avatar) + 3 text lines

### Offline Banner
```
┌──────────────────────────────────────┐
│ ⚠ Mất kết nối mạng                  │
│ Dữ liệu có thể không cập nhật       │
└──────────────────────────────────────┘
Position: top, below status bar
Background: warning (yellow)
Show/hide animated (slide down/up)
```

### Image Loading
- Dùng `FastImage` (react-native-fast-image) — disk cache
- Placeholder: neutral-200 background + food icon
- Error: neutral-100 background + broken image icon
- Progressive loading: blur → sharp

---

## Auth Token Storage

| Platform | Storage | What |
|----------|---------|------|
| iOS | Keychain (react-native-keychain) | accessToken + refreshToken |
| Android | EncryptedSharedPreferences | accessToken + refreshToken |

KHÔNG dùng AsyncStorage cho tokens — không encrypted.

---

## Platform-Specific Differences

| Behavior | iOS | Android |
|----------|-----|---------|
| Back navigation | Swipe from left edge | Hardware back button |
| Share | UIActivityViewController | Intent.ACTION_SEND |
| Date picker | UIDatePicker (wheel) | Material DatePicker |
| Alert/Confirm | UIAlertController | AlertDialog |
| Status bar | Light content on dark screens | Translucent |
| Keyboard | `keyboardDismissMode="interactive"` | `android:windowSoftInputMode="adjustResize"` |
| Tab bar | Bottom, with labels | Bottom, with labels (same) |
| Timer notification | UNUserNotificationCenter | NotificationManager |
| Haptics | UIImpactFeedbackGenerator | Vibrator |
| Font | San Francisco | Roboto |
| Splash screen | LaunchScreen.storyboard | SplashActivity |

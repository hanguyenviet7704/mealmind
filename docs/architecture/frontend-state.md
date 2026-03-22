# Frontend State Management

Quy tắc quản lý state cho Web (Next.js) và Mobile (React Native).

## Stack

| Concern | Tool | Why |
|---------|------|-----|
| Server state (API data) | **TanStack Query** | Cache, refetch, optimistic updates |
| Client state (UI state) | **Zustand** | Lightweight, no boilerplate |
| Form state | **React Hook Form + Zod** | Validation dùng chung packages/validation |
| URL state | **Next.js searchParams** (web) | Filter, pagination, tab |

## Nguyên tắc

### TanStack Query — dùng cho MỌI API data

```typescript
// ✅ Đúng: fetch API data qua TanStack Query
const { data: recipes } = useQuery({
  queryKey: ['recipes', { page, cuisine, q }],
  queryFn: () => api.recipes.list({ page, cuisine, q }),
})

// ❌ Sai: fetch API data rồi bỏ vào Zustand
// Không bao giờ lưu API response vào Zustand store
```

**Query Key Convention:**
```typescript
['auth', 'me']                          // GET /auth/me
['recipes', { page, cuisine, q }]       // GET /recipes?page=&cuisine=&q=
['recipes', recipeId]                   // GET /recipes/:id
['recipes', recipeId, 'nutrition']      // GET /recipes/:id/nutrition
['suggestions', { mealType }]           // GET /suggestions?mealType=
['meal-plans']                          // GET /meal-plans
['meal-plans', planId]                  // GET /meal-plans/:id
['nutrition', 'daily', { date }]        // GET /nutrition/daily?date=
['nutrition', 'weekly', { weekStart }]  // GET /nutrition/weekly?weekStart=
['nutrition', 'goals']                  // GET /nutrition/goals
```

**Invalidation:**
```typescript
// Sau khi swap slot trong meal plan:
queryClient.invalidateQueries({ queryKey: ['meal-plans', planId] })
queryClient.invalidateQueries({ queryKey: ['nutrition', 'daily'] })

// Sau khi update taste profile:
queryClient.invalidateQueries({ queryKey: ['suggestions'] })
```

### Zustand — CHỈ cho UI state

```typescript
// ✅ Đúng: UI state thuần túy
interface AppStore {
  // Auth (token management)
  accessToken: string | null
  refreshToken: string | null
  setTokens: (access: string, refresh: string) => void
  clearTokens: () => void

  // Active profile selection
  activeProfileId: string | null
  isFamily Mode: boolean
  setActiveProfile: (id: string | null) => void

  // Onboarding progress (trước khi submit)
  onboardingDraft: Partial<QuizSubmission>
  setOnboardingStep: (step: number, data: any) => void

  // UI preferences
  sidebarOpen: boolean
  toggleSidebar: () => void
}

// ❌ Sai: lưu recipe list, meal plan data, suggestions trong Zustand
```

### Zustand Stores

| Store | State | Persist? |
|-------|-------|---------|
| `useAuthStore` | accessToken, refreshToken | localStorage (encrypted) |
| `useProfileStore` | activeProfileId, isFamilyMode | localStorage |
| `useOnboardingStore` | draft quiz answers | sessionStorage |
| `useUIStore` | sidebar, theme, locale | localStorage |

### React Hook Form + Zod — Forms

```typescript
// Dùng schema từ packages/validation
import { updateTasteProfileSchema } from '@mealmind/validation'

const form = useForm({
  resolver: zodResolver(updateTasteProfileSchema),
})
```

## Data Flow

```
User Action
  │
  ├─ UI change (toggle sidebar, select tab)
  │  → Zustand store → re-render
  │
  ├─ Form submit (update profile, set goals)
  │  → React Hook Form → validate (Zod) → mutation (TanStack)
  │  → API call → invalidate queries → refetch
  │
  ├─ Navigation (filter recipes, change page)
  │  → URL searchParams → TanStack Query key change → refetch
  │
  └─ Token expired
     → TanStack Query onError → refresh interceptor → retry
     → If refresh fail → Zustand clearTokens → redirect /login
```

## API Client Setup

```typescript
// packages/api-client sẽ wrap fetch với:
// 1. Base URL from env
// 2. Auto attach Authorization header from Zustand auth store
// 3. Auto refresh on 401
// 4. Error mapping to standard format

import { createApiClient } from '@mealmind/api-client'

const api = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  getToken: () => useAuthStore.getState().accessToken,
  onTokenRefresh: async () => {
    const { refreshToken } = useAuthStore.getState()
    const res = await fetch('/api/v1/auth/refresh', { ... })
    useAuthStore.getState().setTokens(res.accessToken, res.refreshToken)
  },
  onAuthError: () => {
    useAuthStore.getState().clearTokens()
    window.location.href = '/login'
  },
})
```

## Optimistic Updates

Dùng cho actions cần phản hồi nhanh:

| Action | Optimistic? | Why |
|--------|------------|-----|
| Bookmark recipe | ✅ Yes | Toggle ngay, rollback nếu fail |
| Swap meal plan slot | ✅ Yes | Cập nhật UI ngay |
| Submit onboarding | ❌ No | Cần server confirm |
| Create meal plan | ❌ No | Generate mất 3s, show loading |
| Rate recipe | ✅ Yes | Cập nhật star ngay |

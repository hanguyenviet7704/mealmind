# Cross-Feature Dependency Map

Agent PHẢI đọc file này trước khi implement feature — để biết feature nào cần có trước.

## Dependency Graph

```
SETUP (monorepo, packages, infra)
  │
  ├─→ AUTH (không phụ thuộc feature khác)
  │     │
  │     ├─→ ONBOARDING (cần auth để biết user)
  │     │     │
  │     │     ├─→ DIETARY-FILTER (cần taste profile + dietary restriction từ onboarding)
  │     │     │
  │     │     └─→ RECIPE-DETAIL (cần auth cho bookmark, cần dietary-filter cho auto-filter search)
  │     │           │
  │     │           ├─→ MEAL-SUGGESTION (cần recipes, cần taste profile, cần dietary filter)
  │     │           │     │
  │     │           │     └─→ MEAL-PLANNING (cần suggestion engine cho generate plan)
  │     │           │           │
  │     │           │           └─→ NUTRITION-TRACKING (cần meal plan data để tính daily/weekly)
  │     │           │
  │     │           └─→ NUTRITION-DISPLAY (nutrition per recipe — phần của recipe-detail, ko phụ thuộc plan)
  │     │
  │     └─→ DATA-IMPORT (seed recipes, ingredients, nutrition — chạy song song)
  │
  └─→ RECOMMENDATION-SERVICE (Python, chạy song song với API setup)
```

## Implementation Order (tuần tự bắt buộc)

```
Layer 0: SETUP          — Monorepo, packages, DB, Redis, Meilisearch, CI/CD
Layer 1: AUTH + DATA     — Song song: auth API + seed data
Layer 2: ONBOARDING     — Cần auth
Layer 3: RECIPE + DIETARY — Song song: recipe CRUD + dietary settings
Layer 4: SUGGESTION      — Cần recipe + profile + dietary + recommendation service
Layer 5: MEAL-PLANNING   — Cần suggestion engine
Layer 6: NUTRITION       — Cần meal plan + recipe nutrition
```

## Cụ thể: Feature cần gì trước khi code?

### AUTH
- **Cần:** SETUP xong (NestJS running, DB connected)
- **Không cần:** Bất kỳ feature nào khác
- **Output:** JWT auth guard, user table, login/register endpoints

### ONBOARDING
- **Cần:** AUTH (user phải login trước khi onboarding)
- **Cần DB tables:** users, taste_profiles, dietary_restrictions
- **Output:** Taste profile, dietary restrictions per user

### RECIPE-DETAIL
- **Cần:** AUTH (bookmark cần user), DATA-IMPORT (cần có recipes trong DB)
- **Cần DB tables:** recipes, recipe_ingredients, ingredients, nutrition_info, recipe_steps, bookmarks
- **Cần service:** Meilisearch (cho search)
- **Output:** Recipe CRUD, search, bookmark, ingredient scaling

### DIETARY-FILTER
- **Cần:** ONBOARDING (dietary restriction gắn với taste profile)
- **Cần DB tables:** dietary_restrictions, ingredients (allergen_tags)
- **Output:** Filter logic dùng chung cho suggestion + search + meal plan

### MEAL-SUGGESTION
- **Cần:** RECIPE-DETAIL (có recipes), ONBOARDING (có profile), DIETARY-FILTER (có filter logic)
- **Cần service:** Recommendation service (Python) phải running
- **Cần DB tables:** user_interactions (để track)
- **Output:** /suggestions endpoint, interaction tracking

### MEAL-PLANNING
- **Cần:** MEAL-SUGGESTION (dùng recommendation engine), RECIPE-DETAIL (hiển thị recipe trong slot)
- **Cần DB tables:** meal_plans, meal_plan_items, meal_plan_shares
- **Output:** Meal plan CRUD, generate, regenerate, share

### NUTRITION-TRACKING
- **Cần:** RECIPE-DETAIL (nutrition per recipe), MEAL-PLANNING (daily/weekly tính từ meal plan)
- **Cần DB tables:** nutrition_info, nutrition_goals (cần thêm vào schema)
- **Output:** Dashboard daily/weekly, nutrition goals

## Recommendation Service (Python) — Song song với NestJS

Recommendation service phát triển **song song** với API. Không block nhau:

```
API team:                              ML team:
  Layer 0-1: SETUP + AUTH               Layer 0: Python service setup
  Layer 2: ONBOARDING                   Layer 1: Content-based model
  Layer 3: RECIPE + DIETARY             Layer 2: Popularity fallback
                                         Layer 3: Context engine
  Layer 4: SUGGESTION ←── integrate ──→  Layer 4: /recommend endpoint
```

API team dùng **mock recommendation** (random recipes respecting filters) cho đến khi Python service sẵn sàng.

## Shared Dependencies (packages/)

| Package | Used by |
|---------|---------|
| `packages/types` | Mọi service + app |
| `packages/validation` | API (request validation) + Web + Mobile (form validation) |
| `packages/api-client` | Web + Mobile (generated từ OpenAPI) |
| `packages/ui` | Web + Mobile (shared components) |
| `packages/config` | Mọi project (ESLint, Tailwind, TS config) |
| `packages/utils` | Mọi project |

**Quan trọng:** Khi thay đổi `packages/types`, phải rebuild tất cả consumers.

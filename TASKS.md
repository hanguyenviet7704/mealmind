# TASKS.md

Task list tổng cho MVP (Phase 1 — 12 tuần). Mỗi task có:
- **ID** — duy nhất, dùng cho commit message: `feat(OB): OB-005`
- **Type** — BE (backend), FE-W (frontend web), FE-M (frontend mobile), ML (AI/ML), INFRA, TEST, DATA
- **Deps** — task phải xong trước (xem `docs/architecture/dependency-map.md`)
- **Spec** — file spec chi tiết

---

## Week 1-2: Project Setup & Data

### INFRA — Hạ tầng

| ID | Task | Deps | Spec |
|----|------|------|------|
| SETUP-001 | Init Turborepo + pnpm workspaces (apps/*, services/*, packages/*) | — | PROJECT_MAP.md |
| SETUP-002 | Setup NestJS API service + base config (modules, guards, pipes, filters) | SETUP-001 | docs/architecture/system-overview.md |
| SETUP-003 | Setup Next.js 14 web app + Tailwind (config từ design tokens) | SETUP-001 | docs/ui/design-tokens.md |
| SETUP-004 | Setup React Native mobile app (Expo hoặc bare) + React Navigation | SETUP-001 | docs/ui/mobile/platform-guide.md |
| SETUP-005 | Setup MySQL + Prisma schema (copy từ schema.prisma) | SETUP-002 | services/api/prisma/schema.prisma |
| SETUP-006 | Setup Redis (docker-compose) | SETUP-001 | docs/architecture/system-overview.md |
| SETUP-007 | Setup CI/CD — GitHub Actions: lint + test + build on PR | SETUP-001 | — |
| SETUP-008 | Setup shared packages: types, validation (Zod), config (ESLint, Tailwind, TS), utils | SETUP-001 | docs/architecture/frontend-state.md |
| SETUP-009 | Setup docker-compose.yml: MySQL + Redis + Meilisearch | SETUP-001 | — |
| SETUP-010 | Setup packages/ui — empty component library + Lucide icons + Tailwind | SETUP-003 | docs/ui/components.md |

### DATA — Seed data

| ID | Task | Deps | Spec |
|----|------|------|------|
| DATA-001 | Prisma migration: tạo tất cả MVP tables | SETUP-005 | docs/architecture/database-schema.md |
| DATA-002 | Import ingredient master data (300+ nguyên liệu + allergen tags) | DATA-001 | docs/data/recipe-data-spec.md |
| DATA-003 | Import ingredient nutrients (calories, protein, carb, fat per 100g) | DATA-002 | docs/data/nutrition-data-spec.md |
| DATA-004 | Import recipe seed data (500+ recipes) | DATA-002 | docs/data/seed-strategy.md |
| DATA-005 | Calculate nutrition_info per recipe (từ ingredients) | DATA-003, DATA-004 | docs/data/nutrition-data-spec.md |
| DATA-006 | Seed dietary options master data (enums, labels) | DATA-001 | docs/data/master-data.md |

---

## Week 3-4: Auth + Onboarding

### AUTH — Authentication (spec: `specs/auth/`)

**Backend:**

| ID | Type | Task | Deps |
|----|------|------|------|
| AUTH-001 | BE | NestJS auth module: JWT RS256 strategy, AuthGuard, decorators | SETUP-002 |
| AUTH-002 | BE | POST /auth/register — email/password, bcrypt hash, auto-login | AUTH-001, DATA-001 |
| AUTH-003 | BE | POST /auth/login — validate credentials, issue access+refresh tokens | AUTH-001 |
| AUTH-004 | BE | POST /auth/google — verify Google ID token, create/link account | AUTH-001 |
| AUTH-005 | BE | POST /auth/apple — verify Apple identity token, handle relay email | AUTH-001 |
| AUTH-006 | BE | POST /auth/refresh — token rotation, revoke old, issue new pair | AUTH-001 |
| AUTH-007 | BE | POST /auth/logout — revoke current device OR all devices | AUTH-001 |
| AUTH-008 | BE | POST /auth/forgot-password — send reset email (always 200) | AUTH-001 |
| AUTH-009 | BE | POST /auth/reset-password — validate token, update password, revoke all sessions | AUTH-001 |
| AUTH-010 | BE | GET /auth/me — return current user from JWT | AUTH-001 |
| AUTH-011 | BE | Rate limiting middleware (login 5/15min, register 3/hr, reset 3/hr) | AUTH-001 |

**Frontend:**

| ID | Type | Task | Deps |
|----|------|------|------|
| AUTH-012 | FE-W | Login page (S01): email, password, Google, Apple, remember me | AUTH-003, SETUP-003 |
| AUTH-013 | FE-W | Register page (S02): form, password strength, validation | AUTH-002 |
| AUTH-014 | FE-W | Forgot + Reset password pages (S03, S04): send, countdown, 3 states | AUTH-008, AUTH-009 |
| AUTH-015 | FE-M | Auth screens mobile (M-S01→M-S04): KeyboardAvoiding, input chain | AUTH-003, SETUP-004 |
| AUTH-016 | FE-W+M | Token management: Zustand store, auto-refresh interceptor, secure storage | AUTH-006 |

**Testing:**

| ID | Type | Task | Deps |
|----|------|------|------|
| AUTH-017 | TEST | Integration: register → login → refresh → logout | AUTH-002→AUTH-007 |
| AUTH-018 | TEST | Integration: Google OAuth flow | AUTH-004 |
| AUTH-019 | TEST | Integration: rate limiting | AUTH-011 |

### OB — Onboarding (spec: `specs/onboarding/`)

**Backend:**

| ID | Type | Task | Deps |
|----|------|------|------|
| OB-001 | BE | Quiz API: POST submit, GET progress, PATCH step, POST skip | AUTH-001, DATA-001 |
| OB-002 | BE | Taste profile CRUD: GET/PATCH /taste-profiles/:id | OB-001 |
| OB-003 | BE | Dietary restriction CRUD (link với DF-001) | OB-001 |
| OB-004 | BE | Family profiles API: CRUD, set active, merge preferences | OB-002 |
| OB-009 | BE | Validation schemas (Zod): quiz, taste profile, family profile | OB-001 |
| OB-010 | BE | Auto-save quiz step logic (PATCH per step) | OB-001 |
| OB-011 | BE | Merge preferences algorithm (union allergens, avg taste, strictest diet) | OB-004 |
| OB-012 | BE | Child profile auto-filter (no spicy, no raw, no caffeine) | OB-004 |

**Frontend:**

| ID | Type | Task | Deps |
|----|------|------|------|
| OB-005 | FE-W | Onboarding 5 screens (S05-S09): region, taste, allergen, diet, family | OB-001, AUTH-012 |
| OB-013 | FE-W | Profile settings page + profile switcher component | OB-002, OB-004 |
| OB-014 | FE-W | Family profile management page (S25 web) | OB-004 |
| OB-006 | FE-M | Onboarding mobile (M-S05→M-S09): swipe steps, haptic, Lottie | OB-001, AUTH-015 |
| OB-015 | FE-M | Profile settings + switcher mobile (M-S22, M-S25) | OB-002, OB-004 |

**Testing:**

| ID | Type | Task | Deps |
|----|------|------|------|
| OB-007 | TEST | Unit: quiz validation, merge algorithm, child filter | OB-009, OB-011, OB-012 |
| OB-008 | TEST | Integration: full onboarding flow API | OB-001→OB-004 |

---

## Week 5-6: Recipe + Dietary Filter

### RD — Recipe Detail (spec: `specs/recipe-detail/`)

**Backend:**

| ID | Type | Task | Deps |
|----|------|------|------|
| RD-001 | BE | GET /recipes — list, pagination, filter (cuisine, meal, difficulty), sort | DATA-004, AUTH-001 |
| RD-002 | BE | GET /recipes/:id — full detail (ingredients grouped, steps, nutrition) | DATA-004 |
| RD-003 | BE | Ingredient scaling logic: quantity × (desired / default), rounding rules | RD-002 |
| RD-004 | BE | Bookmark API: POST/DELETE /recipes/:id/bookmark, GET /recipes/bookmarks | AUTH-001, DATA-001 |
| RD-008 | INFRA | Meilisearch: setup index, sync recipes, Vietnamese search, dietary filter | DATA-004, SETUP-009 |

**Frontend:**

| ID | Type | Task | Deps |
|----|------|------|------|
| RD-005 | FE-W | Recipe list + search page (S14): grid, filters, sort, infinite scroll | RD-001, RD-008 |
| RD-006 | FE-M | Recipe list mobile (M-S14): FlatList 2-col, filter ActionSheet | RD-001, RD-008 |
| RD-007 | FE-W | Recipe detail page (S15): 3 tabs, scaling, timer, bookmark, share | RD-002, RD-003, RD-004 |
| RD-009 | FE-M | Recipe detail mobile (M-S15): parallax hero, floating buttons, bg timer | RD-002, RD-003 |
| RD-010 | FE-W | Bookmarks page (S16): grid, search, filter, unbookmark confirm | RD-004 |
| RD-011 | FE-M | Bookmarks mobile (M-S16): list, swipe-to-unbookmark | RD-004 |

### DF — Dietary Filter (spec: `specs/dietary-filter/`)

**Backend:**

| ID | Type | Task | Deps |
|----|------|------|------|
| DF-001 | BE | Dietary restriction CRUD: GET/PUT /users/:id/dietary | OB-003, DATA-006 |
| DF-002 | BE | GET /dietary/options — master data (diet types, allergens, conditions) | DATA-006 |
| DF-003 | BE | Filter logic in recommendation pipeline (hard filter chain) | DF-001 |
| DF-004 | BE | Filter logic in recipe search (Prisma WHERE + Meilisearch filter) | DF-001, RD-008 |

**Frontend:**

| ID | Type | Task | Deps |
|----|------|------|------|
| DF-005 | FE-W | Dietary settings page (S23): allergens, blacklist, religious | DF-001, DF-002 |
| DF-006 | FE-M | Dietary settings mobile (M-S23): chips, autocomplete, ActionSheet | DF-001, DF-002 |

---

## Week 7-8: AI Suggestion

### MS — Meal Suggestion (spec: `specs/meal-suggestion/`)

**AI/ML (Python):**

| ID | Type | Task | Deps |
|----|------|------|------|
| MS-001 | ML | Setup FastAPI service, MySQL read-only, Redis cache | SETUP-009, DATA-004 |
| MS-002 | ML | Content-based filtering: taste profile ↔ recipe similarity scoring | MS-001 |
| MS-003 | ML | Popularity-based fallback: interaction count → normalized score | MS-001 |
| MS-004 | ML | Context engine: weather API, time/day/season bias | MS-001 |
| MS-009 | ML | Diversity controller: max 2 same cuisine, spread protein types | MS-002 |
| MS-010 | ML | Surprise algorithm: exclude 30 days, prioritize unexplored cuisines | MS-002 |
| MS-011 | ML | Combo generation: role assignment (main/soup/veg), nutrition balance | MS-002 |
| MS-012 | ML | Explainability: generate Vietnamese reason strings from score breakdown | MS-002 |

**Backend (NestJS):**

| ID | Type | Task | Deps |
|----|------|------|------|
| MS-005 | BE | GET /suggestions — call recommendation service, enrich with recipe data | MS-001, RD-001, DF-003 |
| MS-013 | BE | GET /suggestions/surprise | MS-010, MS-005 |
| MS-014 | BE | GET /suggestions/combo | MS-011, MS-005 |
| MS-015 | BE | POST /suggestions/combo/swap — swap 1 item, return new combo | MS-014 |
| MS-016 | BE | POST /suggestions/refresh — new batch excluding seen IDs | MS-005 |
| MS-017 | BE | GET /suggestions/context — return current context (debug) | MS-004 |
| MS-008 | BE | POST /interactions (batch) + GET /interactions/history | AUTH-001, DATA-001 |
| MS-018 | BE | Rate limiting: 50 req/day Free, unlimited Pro | MS-005 |
| MS-019 | BE | Weather API integration + Redis cache 30min | MS-004, SETUP-006 |

**Frontend:**

| ID | Type | Task | Deps |
|----|------|------|------|
| MS-006 | FE-W | Home page (S10): suggestion cards, meal tabs, profile switcher | MS-005, OB-013 |
| MS-020 | FE-W | Combo page (S11): 4 roles, swap modal, macro summary | MS-014 |
| MS-021 | FE-W | Interaction tracking client: batch buffer, flush 30s/10 events | MS-008 |
| MS-007 | FE-M | Home mobile (M-S10): swipe card stack, haptic, pull-to-refresh | MS-005, OB-015 |
| MS-022 | FE-M | Combo mobile (M-S11): vertical list, bottom sheet swap | MS-014 |
| MS-023 | FE-M | Interaction tracking mobile: batch + AppState flush on background | MS-008 |

**Testing:**

| ID | Type | Task | Deps |
|----|------|------|------|
| MS-024 | TEST | Unit: content-based, context engine, diversity, combo generation | MS-002→MS-012 |
| MS-025 | TEST | Integration: full suggestion pipeline request → response | MS-005 |
| MS-026 | TEST | Load: suggestion API < 500ms p95, 100 concurrent users | MS-005 |

---

## Week 9-10: Meal Planning

### MP — Meal Plan (spec: `specs/meal-planning/`)

**Backend + ML:**

| ID | Type | Task | Deps |
|----|------|------|------|
| MP-001 | BE | POST /meal-plans — call recommendation /recommend/meal-plan, create 21 slots | MS-005, DF-003 |
| MP-002 | ML | Nutrition balance algorithm: protein rotation, veggie min, calorie ±10% | MS-002, MS-009 |
| MP-003 | BE | Meal plan CRUD: list, detail, update status (draft→active→archived) | MP-001 |
| MP-004 | BE | PATCH /meal-plans/:id/slots/:id — swap recipe, lock/unlock | MP-003 |
| MP-005 | BE | GET /meal-plans/:id/slots/:id/suggestions — 5 alternatives | MP-003, MS-005 |
| MP-006 | BE | POST /meal-plans/:id/regenerate — regenerate unlocked slots | MP-003, MP-002 |
| MP-007 | BE | POST /meal-plans/:id/share — share with family (viewer/editor) | MP-003 |

**Frontend:**

| ID | Type | Task | Deps |
|----|------|------|------|
| MP-008 | FE-W | Meal plan list page (S17): active/draft/archived, create modal | MP-003 |
| MP-009 | FE-W | Meal plan detail page (S18): 7×3 grid, slot actions, nutrition bar | MP-003, MP-004 |
| MP-010 | FE-W | Drag & drop swap (web): dnd-kit, visual feedback, undo | MP-004 |
| MP-011 | FE-W | Lock/regenerate UI (web): lock icon, regenerate confirm, 70% limit | MP-004, MP-006 |
| MP-012 | FE-W | Slot swap modal (S19): 5 alternatives, select, load more | MP-005 |
| MP-013 | FE-W | Share modal + manage collaborators | MP-007 |
| MP-014 | FE-M | Meal plan list mobile (M-S17): cards, create, delete | MP-003 |
| MP-015 | FE-M | Meal plan detail mobile (M-S18): day tabs, slot ActionSheet | MP-003, MP-004 |
| MP-016 | FE-M | Slot swap bottom sheet mobile (M-S19) | MP-005 |
| MP-017 | FE-M | Share bottom sheet mobile | MP-007 |

**Testing:**

| ID | Type | Task | Deps |
|----|------|------|------|
| MP-018 | TEST | Integration: generate → swap → lock → regenerate flow | MP-001→MP-006 |

---

## Week 11: Nutrition

### NT — Nutrition Tracking (spec: `specs/nutrition-tracking/`)

**Backend:**

| ID | Type | Task | Deps |
|----|------|------|------|
| NT-001 | BE | GET /recipes/:id/nutrition — calc from ingredients, cache, servings param | DATA-005, RD-002 |
| NT-002 | BE | GET /nutrition/daily — sum from active meal plan, compare with goals | MP-003, NT-004 |
| NT-003 | BE | GET /nutrition/weekly — 7-day summary, avg, on-target count | NT-002 |
| NT-004 | BE | GET/PUT /nutrition/goals — presets (maintain, loss, gain, diabetic) + custom | AUTH-001, DATA-001 |

**Frontend:**

| ID | Type | Task | Deps |
|----|------|------|------|
| NT-005 | FE-W | Nutrition tab in recipe detail (S15 tab 3): bars, pie chart, per-ingredient | NT-001 |
| NT-006 | FE-W | Nutrition goals page (S24): presets, custom inputs, save | NT-004 |
| NT-007 | FE-W | Weekly nutrition page (S20): bar chart, macro bars, daily breakdown | NT-003 |
| NT-008 | FE-M | Nutrition in recipe detail mobile (M-S15 tab 3) | NT-001 |
| NT-009 | FE-M | Nutrition goals mobile (M-S24): preset cards, inputs | NT-004 |
| NT-010 | FE-M | Weekly nutrition mobile (M-S20): horizontal chart, accordion | NT-003 |

---

## Week 12: Testing & Launch

### QA — Quality Assurance

| ID | Type | Task | Deps |
|----|------|------|------|
| QA-001 | TEST | Integration tests: tất cả API endpoints (happy + error paths) | All BE tasks |
| QA-002 | TEST | E2E web: register → onboarding → suggestion → meal plan → nutrition | All FE-W tasks |
| QA-003 | TEST | E2E mobile: same flow on React Native | All FE-M tasks |
| QA-004 | TEST | Performance: API < 200ms p95, suggestion < 500ms p95, plan gen < 5s | All BE + ML |
| QA-005 | TEST | Security: auth bypass, SQL injection, XSS, rate limit validation | AUTH-*, RD-001 |
| QA-006 | — | Bug fix round (1 tuần) | QA-001→QA-005 |
| QA-007 | — | Soft launch — closed beta 100 users | QA-006 |

---

## Task Summary

| Category | Count |
|----------|-------|
| SETUP / INFRA | 10 |
| DATA (seed) | 6 |
| AUTH (backend) | 11 |
| AUTH (frontend) | 5 |
| AUTH (test) | 3 |
| ONBOARDING (backend) | 8 |
| ONBOARDING (frontend) | 5 |
| ONBOARDING (test) | 2 |
| RECIPE (backend + infra) | 5 |
| RECIPE (frontend) | 6 |
| DIETARY (backend) | 4 |
| DIETARY (frontend) | 2 |
| SUGGESTION (ML) | 8 |
| SUGGESTION (backend) | 9 |
| SUGGESTION (frontend) | 6 |
| SUGGESTION (test) | 3 |
| MEAL PLAN (backend + ML) | 7 |
| MEAL PLAN (frontend) | 10 |
| MEAL PLAN (test) | 1 |
| NUTRITION (backend) | 4 |
| NUTRITION (frontend) | 6 |
| QA | 7 |
| **TOTAL** | **128** |

---

## Parallel Track Guide

```
TRACK A (Backend NestJS):     SETUP → AUTH-BE → OB-BE → RD-BE + DF-BE → MS-BE → MP-BE → NT-BE
TRACK B (Frontend Web):       SETUP → AUTH-FE-W → OB-FE-W → RD-FE-W + DF-FE-W → MS-FE-W → MP-FE-W → NT-FE-W
TRACK C (Frontend Mobile):    SETUP → AUTH-FE-M → OB-FE-M → RD-FE-M + DF-FE-M → MS-FE-M → MP-FE-M → NT-FE-M
TRACK D (AI/ML Python):       SETUP → MS-ML (content, popularity, context, diversity, combo, explain) → MP-ML
TRACK E (Data):               SETUP → DATA-001→006 (chạy song song với Track A)
TRACK F (Testing):            Theo sau mỗi feature hoàn thành
```

Xem `docs/architecture/dependency-map.md` cho chi tiết.

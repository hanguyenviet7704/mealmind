# PROJECT_MAP.md

## Apps (Frontend)
- `apps/web` — Web app cho end users (Next.js + Tailwind)
- `apps/mobile` — Mobile app iOS + Android (React Native)
- `apps/admin` — Admin dashboard: quản trị recipe, moderation, analytics

## Services (Backend)
- `services/api` — Business API chính (NestJS). Modules: auth, users, recipes, meal-plans, nutrition, dietary
- `services/recommendation` — Engine gợi ý món ăn (Python). Pipeline: candidate-generation → ranking → filters → diversity → explainability
- `services/workers` — Background jobs: notification, data sync, ML batch processing

## Shared Packages
- `packages/types` — Shared TypeScript types & interfaces
- `packages/validation` — Schema validation (Zod schemas dùng chung giữa frontend + backend)
- `packages/api-client` — Generated API client từ OpenAPI spec
- `packages/ui` — Shared UI components (design system)
- `packages/config` — Shared config (ESLint, Tailwind, TypeScript)
- `packages/utils` — Shared utilities

## Feature Source of Truth
- `specs/auth/` — Authentication & Authorization (email, Google, Apple, JWT)
- `specs/onboarding/` — F1: Onboarding & Taste Profile
- `specs/meal-suggestion/` — F2: Smart Meal Suggestion
- `specs/meal-planning/` — F3: Weekly/Monthly Meal Planning
- `specs/nutrition-tracking/` — F4: Nutrition Tracking
- `specs/dietary-filter/` — F5: Dietary Filter & Restrictions
- `specs/recipe-detail/` — F6: Recipe Detail & Cooking Guide
- `specs/shopping-list/` — F7: Smart Shopping List (Phase 2)
- `specs/pantry-management/` — F8: Pantry Management (Phase 2)

## Data
- `data/seeds/` — Seed data (recipes, ingredients, nutrition)
- `data/fixtures/` — Test fixtures
- `data/raw/` — Raw data imports
- `data/processed/` — Processed/cleaned data

## Testing
- `testing/acceptance/` — Acceptance tests theo spec
- `testing/integration/` — Integration tests (API + DB)
- `testing/e2e/` — End-to-end tests (Playwright/Detox)
- `testing/performance/` — Load testing, benchmark

## Docs
- `docs/product/` — Vision, personas, roadmap, pricing
- `docs/architecture/` — System overview, DB schema, Prisma schema, dependency map, sequence diagrams, service integration, error handling, recommendation spec, frontend state, API standards, security, domain boundaries, event model, UI flows
- `docs/ui/design-tokens.md` — Colors, typography, spacing, icons, animation (shared)
- `docs/ui/components.md` — Component library spec (packages/ui)
- `docs/ui/screen-map.md` — Navigation map + 25 screen index
- `docs/ui/web/screens/` — Web wireframes (6 flows)
- `docs/ui/web/interactions/` — Web interaction maps: button → event → API → state
- `docs/ui/mobile/platform-guide.md` — Navigation, gestures, haptics, push, deep links
- `docs/ui/mobile/screens/` — Mobile wireframes (3 files)
- `docs/ui/mobile/interaction-diffs.md` — Mobile vs web differences
- `docs/data/` — Recipe data spec, nutrition data spec, seed strategy, **master data & enums**
- `docs/decisions/` — Architecture Decision Records (ADR-xxx)

## Scripts
- `scripts/dev.sh` — Start dev environment
- `scripts/seed.ts` — Seed database
- `scripts/generate-api-client.ts` — Generate API client from OpenAPI
- `scripts/verify-feature.sh` — Verify feature meets acceptance criteria

## Worklog (Agent Handoff)
- `worklog/todo/` — Tasks chưa ai nhận
- `worklog/doing/` — Đang được agent xử lý
- `worklog/review/` — Xong, cần review
- `worklog/done/` — Hoàn thành

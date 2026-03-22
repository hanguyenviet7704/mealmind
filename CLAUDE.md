# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

MealMind — AI meal recommendation app cho cá nhân/gia đình Việt Nam. Monorepo (Turborepo + pnpm) với web (Next.js), mobile (React Native), API (NestJS), recommendation engine (Python), và shared packages.

## Agent Collaboration

Repo này được thiết kế cho multi-agent development. **Đọc `AGENTS.md` trước tiên** — đây là "hiến pháp" chung cho mọi coding agent. Xem `PROJECT_MAP.md` để hiểu bản đồ code.

## Source of Truth

Khi implement feature, đọc theo thứ tự:
1. `specs/<feature>/spec.md` — nghiệp vụ
2. `specs/<feature>/acceptance.md` — tiêu chí done
3. `specs/<feature>/api.yaml` — API contract
4. `specs/<feature>/tasks.md` — task cụ thể

Không tự tạo business rules. Nếu spec không rõ, ghi câu hỏi vào `worklog/`.

## Commands

```bash
pnpm install              # Install all dependencies
pnpm dev                  # Start all services (web + api + mobile)
pnpm dev:web              # Web app only (Next.js, port 3000)
pnpm dev:api              # API only (NestJS, port 3001)
pnpm dev:mobile           # Mobile app only (React Native)
pnpm build                # Build all packages
pnpm test                 # Run all tests
pnpm test --filter=api    # Run tests for specific package
pnpm lint                 # Lint all
pnpm lint:fix             # Auto-fix lint issues
pnpm db:migrate           # Run Prisma migrations
pnpm db:seed              # Seed database (scripts/seed.ts)
pnpm db:studio            # Open Prisma Studio
pnpm generate:api         # Generate API client from OpenAPI specs
docker compose up -d      # Start infra (MySQL, Redis, Meilisearch)
```

## Architecture

```
apps/web          → Next.js + Tailwind + Zustand + TanStack Query
apps/mobile       → React Native
apps/admin        → Admin dashboard
services/api      → NestJS (modules: auth, users, recipes, meal-plans, nutrition, dietary)
services/recommendation → Python ML service (content-based + popularity → ranking → filter → diversity)
services/workers  → Background jobs (notifications, data sync, ML batch)
packages/types    → Shared TypeScript types
packages/validation → Zod schemas (shared frontend + backend)
packages/api-client → Generated from OpenAPI
packages/ui       → Shared design system components
packages/config   → Shared ESLint, Tailwind, TS config
packages/utils    → Shared utilities
```

## Coding Conventions

- **TypeScript:** strict mode, no `any`. camelCase vars/functions, PascalCase types/components
- **Python:** type hints required, snake_case, Ruff formatter
- **Imports:** absolute paths with aliases (`@mealmind/types`, `@mealmind/ui`)
- **API response:** `{ data, meta, error }` format. Versioned: `/api/v1/`
- **Database:** Prisma ORM. Migrations required, never modify DB directly
- **Validation:** Zod (TS), Pydantic (Python)
- **Commits:** Conventional Commits — `feat(meal-suggestion):`, `fix(onboarding):`

## Testing

- Unit tests: co-located with source (`*.spec.ts` / `*.test.ts`)
- Integration tests: `services/*/tests/` or `testing/integration/`
- E2E tests: `testing/e2e/`
- Acceptance criteria defined in `specs/<feature>/acceptance.md`
- Mock external services only, hit real DB in integration tests

## Key Architectural Decisions

- **Monorepo** (ADR-001): Turborepo for shared types, atomic changes, unified CI
- **NestJS** (ADR-002): TypeScript API shares types with frontends. Python only for ML
- **Recommendation v1** (ADR-003): Content-based + popularity. Collaborative filtering deferred to Phase 2
- See `docs/decisions/` for full ADRs

## Agent Handoff

When completing a task:
1. Move worklog file from `worklog/doing/` → `worklog/review/` or `worklog/done/`
2. Document what was done, files changed, and notes for next agent
3. Mark task in `specs/<feature>/tasks.md`

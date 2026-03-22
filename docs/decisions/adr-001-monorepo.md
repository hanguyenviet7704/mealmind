# ADR-001: Monorepo với Turborepo

## Status
Accepted

## Context
MealMind có nhiều components: web, mobile, API, recommendation service, shared packages. Cần quyết định quản lý code trong 1 repo hay nhiều repo.

## Decision
Dùng monorepo với Turborepo + pnpm workspaces.

## Reasons
- Shared types/validation giữa frontend và backend
- Atomic changes across packages
- Unified CI/CD
- Dễ hơn cho multi-agent development (1 repo = 1 context)
- Turborepo caching giúp build nhanh

## Consequences
- Cần quản lý dependencies cẩn thận
- CI build time có thể tăng (mitigate bằng Turborepo cache)
- Python recommendation service dùng riêng virtualenv trong `services/recommendation/`

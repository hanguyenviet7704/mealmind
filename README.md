# MealMind

AI-powered meal recommendation app cho cá nhân/gia đình Việt Nam.

## Quick Start

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env

# Start database
docker compose up -d mysql redis meilisearch

# Run migrations
pnpm db:migrate

# Seed data
pnpm db:seed

# Start all services in dev mode
pnpm dev
```

## Test Accounts

Sau khi chạy `pnpm db:seed` (hoặc khởi động Docker lần đầu), bạn có thể đăng nhập bằng tài khoản sau:

| Vai trò | Email | Mật khẩu |
| :--- | :--- | :--- |
| **Demo User** | `demo@mealmind.vn` | `Demo@1234` |
| **Test Admin** | `admin@mealmind.vn*` | `Admin@1234` |

*\*Lưu ý: Email admin chỉ dùng cho môi trường dev.*

## Project Structure

```
apps/          → Frontend apps (web, mobile, admin)
services/      → Backend services (api, recommendation, workers)
packages/      → Shared packages (types, ui, validation, utils)
specs/         → Feature specifications (source of truth)
docs/          → Architecture docs, ADRs, data specs
data/          → Seeds, fixtures, raw data
testing/       → Acceptance, integration, e2e, performance tests
scripts/       → Dev scripts
worklog/       → Agent task handoff logs
```

## Key Commands

```bash
pnpm dev              # Start all services
pnpm dev:web          # Start web app only
pnpm dev:mobile       # Start mobile app only
pnpm dev:api          # Start API service only
pnpm build            # Build all
pnpm test             # Run all tests
pnpm test:unit        # Unit tests only
pnpm test:integration # Integration tests only
pnpm test:e2e         # E2E tests
pnpm lint             # Lint all
pnpm lint:fix         # Lint + auto-fix
pnpm db:migrate       # Run database migrations
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio
pnpm generate:api     # Generate API client from OpenAPI
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Web | Next.js, Tailwind, Zustand, TanStack Query |
| Mobile | React Native |
| API | NestJS (TypeScript) |
| AI/ML | Python, TensorFlow/PyTorch |
| Database | MySQL, Redis, Meilisearch |
| Infra | Docker, GitHub Actions |

## Multi-Agent Development

Repo này được thiết kế để nhiều coding agent (Claude, Cursor, Codex, Antigravity) cùng làm việc.

- **AGENTS.md** — Quy ước chung (đọc trước tiên)
- **PROJECT_MAP.md** — Bản đồ code
- **TASKS.md** — Task list tổng
- **specs/** — Spec từng feature (source of truth cho implementation)
- **worklog/** — Bàn giao giữa các agent

Xem [AGENTS.md](AGENTS.md) để biết quy trình làm việc.

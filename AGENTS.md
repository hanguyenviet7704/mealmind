# AGENTS.md

Đây là file quy ước chung cho mọi coding agent (Claude, Cursor, Codex, Antigravity) làm việc trong repo này.

## Project

MealMind là app AI gợi ý món ăn cá nhân hóa cho cá nhân/gia đình Việt Nam. App học từ lịch sử ăn uống, sở thích và hành vi để gợi ý bữa ăn phù hợp — từ bữa sáng hàng ngày đến thực đơn tiệc đặc biệt.

- **Nền tảng:** Mobile (React Native) + Web (Next.js)
- **Backend:** NestJS (TypeScript)
- **Database:** MySQL + Redis + Meilisearch
- **AI/ML:** Python (TensorFlow/PyTorch) + LLM APIs
- **Monorepo:** Turborepo — apps/, services/, packages/

## MVP Scope (Phase 1 — 12 tuần)

1. **Onboarding & Taste Profile** — Khảo sát sở thích (5-10 câu), multi-profile gia đình
2. **Smart Meal Suggestion** — Gợi ý 3-5 món/bữa, context-aware (thời tiết, mùa, lịch sử)
3. **Weekly Meal Planning** — Tự động tạo thực đơn 7 ngày × 3 bữa, drag & drop
4. **Nutrition Display** — Calo, protein, carb, fat per recipe
5. **Dietary Filter** — 1 chế độ ăn (chay/keto/low-carb) + allergen filter
6. **Recipe Detail** — Step-by-step guide, ingredient scaling, timer

## Source of Truth

1. `specs/<feature>/spec.md` — Đặc tả nghiệp vụ feature
2. `specs/<feature>/acceptance.md` — Tiêu chí done/QA
3. `specs/<feature>/api.yaml` — API contract (OpenAPI)
4. `docs/architecture/*` — Quyết định kiến trúc
5. `TASKS.md` — Task list tổng
6. `PROJECT_MAP.md` — Bản đồ code

## Coding Rules

- **Language:** TypeScript (strict mode) cho apps + services, Python cho ML
- **Style:** ESLint + Prettier (TS), Ruff (Python). Không tắt lint rule bằng inline comment trừ khi có lý do rõ ràng
- **Naming:** camelCase (TS variables/functions), PascalCase (TS types/components), snake_case (Python, DB columns)
- **API:** RESTful, versioned (`/api/v1/`), response format: `{ data, meta, error }`
- **Database:** Migrations bắt buộc, không sửa DB trực tiếp. Dùng Prisma (TS) hoặc Alembic (Python)
- **Tests:** Mỗi module phải có unit test. Integration test cho API endpoints. E2E cho critical flows
- **Commits:** Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)
- **Imports:** Absolute imports với path alias (`@mealmind/types`, `@mealmind/ui`)

## Required Workflow (Mọi agent phải tuân theo)

1. **Đọc spec trước khi code** — `specs/<feature>/spec.md` + `acceptance.md`
2. **Nếu sửa API** — Cập nhật `specs/<feature>/api.yaml` + `services/api/openapi/`
3. **Nếu sửa UI** — Cập nhật/thêm test tương ứng trong `apps/*/tests/`
4. **Nếu thêm shared type** — Đặt trong `packages/types/`
5. **Không tự đổi business scope** — Chỉ implement đúng spec. Nếu cần thay đổi, ghi vào `worklog/`
6. **Mỗi thay đổi phải gắn với 1 feature** — Commit message prefix: `feat(meal-suggestion):`, `fix(onboarding):`

## Definition of Done

- [ ] Code chạy được (`pnpm dev` không lỗi)
- [ ] Test pass (`pnpm test` không fail)
- [ ] Lint pass (`pnpm lint` không warning)
- [ ] Không phá API contract (backward compatible hoặc version bump)
- [ ] Cập nhật docs nếu thay đổi architecture/API
- [ ] Ghi worklog nếu có quyết định đáng chú ý

## Bàn giao giữa các agent

Khi hoàn thành task, agent phải:
1. Di chuyển file task từ `worklog/doing/` sang `worklog/review/` hoặc `worklog/done/`
2. Ghi lại những gì đã làm, file nào đã sửa, và bất kỳ lưu ý nào cho agent tiếp theo
3. Nếu task chưa xong, ghi rõ phần nào còn lại trong file task

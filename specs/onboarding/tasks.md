# F1: Onboarding & Taste Profile - Tasks

## Backend

- [ ] OB-001: Onboarding quiz API — Tạo endpoints POST /onboarding/quiz, GET /onboarding/quiz/progress, PATCH /onboarding/quiz/{step}, POST /onboarding/skip
- [ ] OB-002: Taste profile CRUD API — Tạo endpoints GET/PATCH cho /taste-profiles và /taste-profiles/{profileId}
- [ ] OB-003: Dietary restriction CRUD API — Lưu và quản lý allergens, dietType trong taste profile (tích hợp với F5)
- [ ] OB-004: Multi-profile (family) API — Tạo endpoints CRUD cho /family-profiles, logic set active profile, logic merge preferences
- [ ] OB-009: Database schema — Tạo Prisma schema cho bảng taste_profiles, family_profiles, quiz_progress
- [ ] OB-010: Validation schemas — Tạo Zod schemas cho quiz submission, taste profile update, family profile create/update
- [ ] OB-011: Auto-save quiz step logic — Implement lưu từng bước quiz riêng lẻ vào quiz_progress
- [ ] OB-012: Merge preferences algorithm — Implement logic merge allergens (union), khẩu vị (average), chế độ ăn (strictest)
- [ ] OB-013: Child profile filter — Implement auto-filter cho profile trẻ em (loại gia vị mạnh, đồ sống, caffeine)

## Frontend (Web)

- [ ] OB-005: Onboarding UI (web) — Implement quiz flow 5 màn hình: region select, flavor sliders, allergen chips, diet select, cook time & family size
- [ ] OB-014: Quiz progress bar component — Component hiển thị bước hiện tại và cho phép navigate giữa các bước
- [ ] OB-015: Taste profile settings page (web) — Trang Settings cho phép xem và chỉnh sửa taste profile
- [ ] OB-016: Family profile management page (web) — Trang quản lý profile gia đình: list, create, edit, delete, switch active
- [ ] OB-017: Profile switcher component (web) — Component chuyển đổi active profile trong header/drawer

## Frontend (Mobile)

- [ ] OB-006: Onboarding UI (mobile) — Implement quiz flow 5 màn hình cho React Native với swipe navigation
- [ ] OB-018: Quiz progress indicator (mobile) — Component progress dots/bar cho mobile quiz flow
- [ ] OB-019: Taste profile settings screen (mobile) — Màn hình Settings cho phép xem và chỉnh sửa taste profile
- [ ] OB-020: Family profile management screen (mobile) — Màn hình quản lý profile gia đình cho mobile
- [ ] OB-021: Profile switcher (mobile) — Bottom sheet hoặc modal chuyển đổi active profile

## Testing

- [ ] OB-007: Unit tests — Tests cho quiz submission validation, merge preferences algorithm, child filter logic
- [ ] OB-008: Integration tests — Tests cho toàn bộ onboarding flow API (quiz submit, skip, resume, profile CRUD)
- [ ] OB-022: E2E tests — Tests cho complete onboarding journey: signup > quiz > home screen

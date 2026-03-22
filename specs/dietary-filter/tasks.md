# F5: Dietary Filter & Restrictions - Tasks

## Backend

- [ ] DF-001: Dietary restriction CRUD API — Implement GET /users/:id/dietary và PUT /users/:id/dietary. Bao gồm Prisma schema cho bảng dietary_restrictions (dietType, allergens, medicalConditions, religiousDiet, ingredientBlacklist). Validation bằng Zod. Hỗ trợ query theo profileId.
- [ ] DF-002: Dietary options master data — Implement GET /dietary/options trả danh sách diet types, allergens, medical conditions, religious diets. Seed data vào DB (scripts/seed.ts). Mỗi option có key, label (tiếng Việt), description, iconUrl, phase (mvp/phase2). Cache response trong Redis.

## Recommendation / Search Integration

- [ ] DF-003: Filter logic in recommendation pipeline — Tích hợp dietary filter vào recommendation engine (services/recommendation). Implement filter chain theo thứ tự: diet type > allergen > medical condition > religious > ingredient blacklist. Filter áp dụng trước ranking. Hỗ trợ family merge (union allergens, strictest diet). Unit tests cho từng filter type.
- [ ] DF-004: Filter logic in recipe search — Tích hợp dietary filter vào recipe search endpoint (GET /recipes, GET /recipes/search). Filter áp dụng ở query level (Prisma WHERE hoặc Meilisearch filter). Đảm bảo filter không làm tăng response time quá 50ms. Integration tests.

## Frontend

- [ ] DF-005: Dietary settings UI (web + mobile) — Implement trang/màn hình Dietary Settings trong cả web (Next.js) và mobile (React Native). Bao gồm: diet type single-select, allergen multi-select chips, medical condition multi-select (disabled cho Phase 2 với label "Sắp ra mắt"), religious diet select, ingredient blacklist input (free text + autocomplete). Save button với loading state và toast notification "Đã cập nhật chế độ ăn". Truy cập từ Settings > Chế độ ăn.

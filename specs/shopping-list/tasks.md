# F7: Smart Shopping List — Tasks

> **Status:** MVP (integrated vào Meal Planning — xem specs/meal-planning/api.yaml)
>
> Shopping list được generate tự động từ active meal plan.
> API endpoints sống trong meal-planning api.yaml (tag: Shopping).

## Backend (NestJS)

- [ ] SL-001: DB schema cho shopping_list và shopping_items — Prisma migration
  - Fields: mealPlanId, name, quantity, unit, category, checked, createdAt
  - Category enum: meat_fish, vegetables, seasoning, dry_goods, dairy, other
- [ ] SL-002: GET /meal-plans/:id/shopping — Aggregate nguyên liệu từ tất cả slots (sum quantities, group by ingredient + unit), map sang category, trả grouped list
  - Logic: khi cùng nguyên liệu ở nhiều recipe → cộng quantity, note cả 2 recipe names
- [ ] SL-003: PATCH /shopping/:itemId { checked } — Toggle đã mua, cập nhật progress counter
- [ ] SL-004: DELETE /shopping/:itemId — Xóa item khỏi list (user tự thêm hoặc remove)
- [ ] SL-005: Cache shopping list — Invalidate khi plan slots thay đổi (slot swap triggers re-generate)

## Frontend (Web)

- [ ] SL-006: ShoppingListScreen S24 (web) — grouped by category, checkbox toggle, delete, progress bar, share
  - Wireframe: `docs/ui/web/screens/05-meal-plan-extra.md#S24`
  - Interactions: `docs/ui/web/interactions/05-meal-plan.md`

## Frontend (Mobile)

- [ ] SL-007: ShoppingListScreen M-S24 — grouped FlatList, swipe-right = check (green + strikethrough + haptic), swipe-left = delete (animated row removal), native Share.share()
  - Wireframe: `docs/ui/mobile/screens/05-meal-plan-extra.md#M-S24`
  - Progress bar hiển thị X/Y items đã mua

## Testing

- [ ] SL-008: Unit tests — ingredient aggregation logic (sum quantities, handle different units)
- [ ] SL-009: Integration tests — generate list → check items → delete item → share text format

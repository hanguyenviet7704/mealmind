# F3: Weekly Meal Planning — Tasks

## Backend (NestJS)

- [ ] MP-001: POST /meal-plans — Generate thực đơn tuần mới (7 ngày × 3 bữa), gọi recommendation service, lưu status `draft`
  - Screens: S25 CreatePlanScreen (web), M-S25 (mobile)
- [ ] MP-003: Meal plan CRUD — GET /meal-plans (list), GET /meal-plans/:id (detail + slots), PATCH /meal-plans/:id (name, status), DELETE /meal-plans/:id (soft delete)
  - Plan status lifecycle: draft → active → archived
  - Screens: S20 List (web), S21 Detail (web), M-S20/M-S21 (mobile)
- [ ] MP-009: GET /meal-plans/:planId/slots/:slotId/suggestions — 5 gợi ý thay thế cho 1 slot, excludeRecipeIds để reload
  - Screen: M-S22 SlotSwapSheet
- [ ] MP-010: PATCH /meal-plans/:planId/slots/:slotId — Đổi recipe của 1 slot (swap)
  - Screen: M-S22 SlotSwapSheet, S21 web drag-and-drop
- [ ] MP-011: POST /suggestions/refresh — Refresh thêm 5 gợi ý (loại trừ đã hiển thị)
  - Screen: M-S22 "Xem thêm gợi ý"
- [ ] MP-012: GET /meal-plans/:id/shopping — Tạo shopping list từ meal plan (aggregate nguyên liệu, group by category)
  - Screen: S24 ShoppingListScreen (web), M-S24 (mobile)
- [ ] MP-013: PATCH /shopping/:itemId — Đánh dấu đã mua / bỏ đánh dấu
  - Screen: M-S24 swipe-right / tap checkbox
- [ ] MP-014: DELETE /shopping/:itemId — Xóa item khỏi shopping list
  - Screen: M-S24 swipe-left

## AI/ML Service (Python)

- [ ] MP-002: Nutrition balance algorithm — cân bằng dinh dưỡng 21 slots:
  - Phân bổ calo: Sáng 25% / Trưa 40% / Tối 35%
  - Không lặp protein chính 3 ngày liên tục
  - Ít nhất 1 bữa rau xanh/ngày
  - Tổng calo ±10% target
  - Input: locked slots, nutrition goals, taste profile
  - Output: 21 recipe assignments tối ưu

## Frontend (Web)

- [ ] MP-004: MealPlanListScreen S20 — list plans, status chips, create new, activate, archive
  - Wireframe: `docs/ui/web/screens/05-meal-plan.md#S20`
  - Interactions: `docs/ui/web/interactions/05-meal-plan.md`
- [ ] MP-015: MealPlanDetailScreen S21 — bảng 7×3 (ngày × bữa), nutrition summary per ngày, activate button
  - Wireframe: `docs/ui/web/screens/05-meal-plan.md#S21`
- [ ] MP-006: Drag & drop swap — dnd-kit, ghost element, highlight target cell, optimistic update, undo/redo 5 bước
- [ ] MP-007: Lock/regenerate slots — lock icon per slot, regenerate unlocked, loading state, cảnh báo > 70% locked
- [ ] MP-016: CreatePlanScreen S25 (web) — week date picker, nutrition goals display, generate loading state
  - Wireframe: `docs/ui/web/screens/05-meal-plan-extra.md#S25`
- [ ] MP-017: ShoppingListScreen S24 (web) — grouped by category, check/uncheck, delete, share
  - Wireframe: `docs/ui/web/screens/05-meal-plan-extra.md#S24`
- [ ] MP-018: WeekNutritionScreen S23 (web) — bar chart 7 ngày, macro progress bars, accordion per ngày
  - Wireframe: `docs/ui/web/screens/05-meal-plan-extra.md#S23`

## Frontend (Mobile)

- [ ] MP-005: MealPlanListScreen M-S20 + MealPlanDetailScreen M-S21 — horizontal day scroll, vertical meal scroll, day summary bar, pull-to-refresh
  - Wireframe: `docs/ui/mobile/screens/03-main.md#M-S20`, `#M-S21`
- [ ] MP-019: SlotSwapSheet M-S22 — bottom sheet 85% (@gorhom/bottom-sheet), 5 alternatives, "Chọn" button, tap ảnh → navigate S15, "Xem thêm" append
  - Wireframe: `docs/ui/mobile/screens/05-meal-plan-extra.md#M-S22`
- [ ] MP-020: WeekNutritionScreen M-S23 — horizontal scrollable bar chart (react-native-chart-kit), tap bar → scroll to day detail, accordion
  - Wireframe: `docs/ui/mobile/screens/05-meal-plan-extra.md#M-S23`
- [ ] MP-021: ShoppingListScreen M-S24 — grouped FlatList, swipe-right = check (haptic + strikethrough), swipe-left = delete (animated), native Share
  - Wireframe: `docs/ui/mobile/screens/05-meal-plan-extra.md#M-S24`
- [ ] MP-022: CreatePlanScreen M-S25 — native date picker (iOS/Android), Lottie loading animation khi generate, timeout 10s → retry
  - Wireframe: `docs/ui/mobile/screens/05-meal-plan-extra.md#M-S25`

## Sharing & Export

- [ ] MP-008: Share meal plan — POST /meal-plans/:id/share (invite link / direct), collaborator roles (owner/editor/viewer), web share dialog, mobile share sheet, notification khi plan update

## Testing

- [ ] MP-023: Unit tests — nutrition balance algorithm, slot swap validation, shopping list aggregation
- [ ] MP-024: Integration tests — create plan → activate → swap slot → shopping list flow
- [ ] MP-025: Integration tests — shopping list check/uncheck/delete

# F6: Recipe Detail & Cooking Guide — Tasks

## Backend (NestJS)

- [ ] RD-001: Recipe list API — GET /recipes với pagination, filter (cuisine, mealType, difficulty, maxCookTime), sort, dietary filter tự động từ active profile
  - Screens: S14 (web), M-S14 (mobile)
- [ ] RD-002: Recipe detail API — GET /recipes/:id trả đầy đủ ingredients (grouped), cooking steps (imageUrl, duration), nutrition, gallery, isBookmarked
  - Screens: S15 (web), M-S15 (mobile)
- [ ] RD-003: Ingredient scaling — query param `servings`, scale quantity + nutrition theo tỉ lệ, làm tròn đúng đơn vị
- [ ] RD-004: Bookmark API — POST /recipes/:id/bookmark (201/409), DELETE /recipes/:id/bookmark (204), GET /recipes/bookmarks
  - Screens: S18 (web), M-S18 (mobile)
- [ ] RD-008: Meilisearch setup + recipe indexing — docker-compose, index fields, Vietnamese typo tolerance, sync từ Postgres
  - Screen: S19/M-S19 Search
- [ ] RD-009: GET /recipes/search — proxy tới Meilisearch, áp dietary filter, trả kết quả + facets
- [ ] RD-010: POST /recipes/:id/ratings — Đánh giá món (stars 1-5, quick tags, note tuỳ chọn). Screen M-S42.
- [ ] RD-011: GET /interactions/history — Lịch sử nấu ăn (action=cook), grouped by date. Screen M-S38.
- [ ] RD-012: DELETE /meal-logs/:id — Xóa 1 entry khỏi lịch sử (swipe left M-S38)
- [ ] RD-013: GET /recipes/:id/nutrition — Nutrition per serving, hỗ trợ ?servings=N, cache per recipe. Screen M-S17.

## Frontend (Web)

- [ ] RD-005: RecipeListScreen S14 — grid layout, filter bar, bookmark toggle, sort dropdown, infinite scroll
  - Wireframe: `docs/ui/web/screens/04-recipe.md#S14`
  - Interactions: `docs/ui/web/interactions/04-recipe.md`
- [ ] RD-014: RecipeDetailScreen S15 — header ảnh, ingredient list + serving picker, step accordion, nutrition panel, bookmark, timer, cooking mode entry
  - Wireframe: `docs/ui/web/screens/04-recipe.md#S15`
- [ ] RD-015: BookmarksScreen S18 — saved recipes, filter, remove
  - Wireframe: `docs/ui/web/screens/04-recipe.md#S18`
- [ ] RD-016: SearchScreen S19 (web) — debounce 300ms, filter chips, recent searches, empty state
  - Wireframe: `docs/ui/web/screens/04-recipe-extra.md` (hoặc section tương ứng)

## Frontend (Mobile)

- [ ] RD-006: RecipeListScreen M-S14 — FlashList single/2-col, filter bottom sheet, bookmark, pull-to-refresh, infinite scroll
  - Wireframe: `docs/ui/mobile/screens/03-main.md#M-S14`
- [ ] RD-007: RecipeDetailScreen M-S15 — ScrollView, step-by-step, serving picker, bookmark, timer, navigate to CookingMode
  - Wireframe: `docs/ui/mobile/screens/03-main.md#M-S15`
- [ ] RD-017: CookingModeScreen M-S16 — keep-awake, swipe left/right steps, background timer, push notification khi timer xong, shake-to-pause
  - Wireframe: `docs/ui/mobile/screens/04-recipe-extra.md#M-S16`
- [ ] RD-018: NutritionDetailScreen M-S17 — pie chart (react-native-chart-kit), progress bars, serving stepper, accordion per ingredient
  - Wireframe: `docs/ui/mobile/screens/04-recipe-extra.md#M-S17`
- [ ] RD-019: SearchScreen M-S19 — auto-focus, keyboard open, recent searches (AsyncStorage max 10), ActionSheet filters, Vietnamese search
  - Wireframe: `docs/ui/mobile/screens/04-recipe-extra.md#M-S19`
- [ ] RD-020: BookmarksScreen M-S18 — filter chips, bookmark toggle, pull-to-refresh
  - Wireframe: `docs/ui/mobile/screens/03-main.md#M-S18`
- [ ] RD-021: CookingHistoryScreen M-S38 — grouped by date, swipe-left delete, tap stars → RateRecipeSheet, pull-to-refresh
  - Wireframe: `docs/ui/mobile/screens/06-profile-settings.md#M-S38`
- [ ] RD-022: RateRecipeSheet M-S42 — bottom sheet 50%, star tap + haptic, quick tags, note input
  - Wireframe: `docs/ui/mobile/screens/06-profile-settings.md#M-S42`

## Infrastructure

- [ ] RD-008: Meilisearch setup — (xem Backend section)

## Testing

- [ ] RD-023: Unit tests — ingredient scaling (edge cases: rounding, unit types), recipe nutrition calculation
- [ ] RD-024: Integration tests — recipe CRUD, bookmark flow, search (Vietnamese typo), rating submission
- [ ] RD-025: Integration tests — cooking history: create entry → list → delete

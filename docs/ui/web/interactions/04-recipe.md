# Interaction Map: Recipe Flow (S14-S16)

---

## S14: Recipe List / Search

| # | Element | Event | Handler | API Call | On Success | On Error | Loading UI |
|---|---------|-------|---------|----------|------------|----------|------------|
| 1 | — (on mount) | useEffect | `fetchRecipes()` | `GET /recipes?page=1&pageSize=20&sort=popular` | Render RecipeGrid | Error state + retry | Grid of 6× Skeleton cards |
| 2 | SearchBar input | onChange | `setQuery(value)` (debounce 300ms) | `GET /recipes?q={value}&page=1` | Update grid with results + "X kết quả" count | — | Skeleton cards |
| 3 | SearchBar submit (Enter) | onSubmit | `handleSearch()` | Same as #2 but immediate | Same | — | — |
| 4 | SearchBar clear [✕] | onClick | `clearSearch()` | `GET /recipes?page=1` (no query) | Reset to default list | — | — |
| 5 | Filter chip "Vùng miền ▾" | onClick | `openFilterDropdown('cuisine')` | — | Show dropdown: [Tất cả, Bắc, Trung, Nam, QT] | — | — |
| 6 | Filter dropdown item | onClick | `setFilter('cuisine', value)` | `GET /recipes?cuisine={value}&...` | Close dropdown + update grid + show active filter badge | — | Skeleton cards |
| 7 | Filter chip "Bữa ▾" | onClick | `openFilterDropdown('mealType')` | — | Show dropdown | — | — |
| 8 | Filter dropdown item (bữa) | onClick | `setFilter('mealType', value)` | `GET /recipes?mealType={value}&...` | Same as #6 | — | — |
| 9 | Filter chip "Độ khó ▾" | onClick | `openFilterDropdown('difficulty')` | — | Show dropdown | — | — |
| 10 | Filter chip "Thời gian ▾" | onClick | `openFilterDropdown('cookTime')` | — | Show dropdown: [< 15p, 15-30p, 30-60p, > 60p] | — | — |
| 11 | "Xóa filter" | onClick | `clearAllFilters()` | `GET /recipes?page=1` | Reset all filters + grid | — | — |
| 12 | Sort dropdown | onChange | `setSort(value)` | `GET /recipes?sort={value}&...` | Reorder grid | — | — |
| 13 | RecipeCard tap | onClick | `navigate('/recipes/{id}')` | — | → S15 Recipe Detail | — | — |
| 14 | RecipeCard bookmark ♡ | onClick | `toggleBookmark(recipeId)` | `POST` or `DELETE /recipes/{id}/bookmark` | Toggle ♡ ↔ ♥ (optimistic) | Rollback | — |
| 15 | Scroll to bottom | onScroll | `loadMore()` | `GET /recipes?page={nextPage}&...` | Append cards to grid | Toast error | 2× Skeleton cards appended |

### URL Sync (Web)
```
Mọi filter/sort/search → sync vào URL query params:
/recipes?q=pho&cuisine=north&mealType=lunch&sort=cook_time_asc&page=2

→ TanStack Query key: ['recipes', { q, cuisine, mealType, difficulty, sort, page }]
→ Back button restores previous filters
```

### Empty Search Result
```
Khi results = 0:
  Icon: 🔍
  Title: "Không tìm thấy món nào"
  Description: "Thử thay đổi từ khóa hoặc bỏ bớt filter"
  Button: [Xóa filter]
```

---

## S15: Recipe Detail

| # | Element | Event | Handler | API Call | On Success | On Error | Loading UI |
|---|---------|-------|---------|----------|------------|----------|------------|
| 1 | — (on mount) | useEffect | `fetchRecipe(id)` | `GET /recipes/{id}` | Render full detail | 404 → "Món ăn không tìm thấy" + [← Quay lại] | Full-page skeleton |
| 2 | Button [← Back] | onClick | `router.back()` | — | Go back | — | — |
| 3 | Button [♡/♥] bookmark | onClick | `toggleBookmark(id)` | `POST` or `DELETE /recipes/{id}/bookmark` | Toggle icon (optimistic) + Toast "Đã lưu" / "Đã bỏ lưu" | Rollback | — |
| 4 | Button [📤 Share] | onClick | `handleShare()` | — | Web: `navigator.share()` or copy URL. Mobile: native share sheet | Fallback: copy to clipboard + Toast "Đã sao chép link" | — |
| 5 | Tab "Nguyên liệu" | onClick | `setActiveTab('ingredients')` | — | Show ingredients tab | — | — |
| 6 | Tab "Cách nấu" | onClick | `setActiveTab('steps')` | — | Show steps tab | — | — |
| 7 | Tab "Dinh dưỡng" | onClick | `setActiveTab('nutrition')` | `GET /recipes/{id}/nutrition?servings={current}` (lazy load) | Show nutrition tab | Error state in tab | Skeleton bars |
| 8 | Button "−" (servings) | onClick | `setServings(Math.max(1, n-1))` | — | Recalculate ingredient quantities client-side: `qty * (newServings / defaultServings)` | Disabled if n=1 | — |
| 9 | Button "+" (servings) | onClick | `setServings(Math.min(20, n+1))` | — | Recalculate quantities | Disabled if n=20 | — |
| 10 | Ingredient checkbox | onClick | `toggleIngredientCheck(index)` | — (local state only) | Toggle ☐ ↔ ☑ + strikethrough text | — | — |
| 11 | Ingredient group header | onClick | `toggleGroupCollapse(group)` | — | Expand/collapse ingredient group | — | — |
| 12 | Step "⏱ Bấm timer" button | onClick | `startTimer(durationMinutes)` | — | Start countdown. Mobile: schedule notification. Web: floating timer widget | — | — |
| 13 | Timer widget "Dừng" | onClick | `stopTimer()` | — | Stop + reset timer | — | — |
| 14 | Timer — countdown = 0 | — (auto) | `onTimerComplete()` | — | Sound alert + vibration (mobile) + Toast "Hết giờ! {stepDescription}" | — | — |
| 15 | Nutrition serving change | onChange | — | `GET /recipes/{id}/nutrition?servings={n}` | Update nutrition bars | — | Skeleton bars |

### Ingredient Scaling Logic (Client-Side)
```typescript
function scaleQuantity(
  originalQty: number,
  defaultServings: number,
  desiredServings: number,
  unit: string
): { quantity: number; display: string } {
  const scaled = originalQty * (desiredServings / defaultServings)

  // Rounding rules (from specs/recipe-detail/spec.md BR-RD-02)
  if (['piece', 'slice', 'clove', 'bunch'].includes(unit)) {
    // Countable units: round up to nearest integer
    return { quantity: Math.ceil(scaled), display: `${Math.ceil(scaled)}` }
  }

  // Weight/volume: round to 1 decimal
  if (scaled < 1) {
    return { quantity: Math.round(scaled * 10) / 10, display: `${(Math.round(scaled * 10) / 10)}` }
  }
  return { quantity: Math.round(scaled), display: `${Math.round(scaled)}` }
}
```

### Timer Widget (Floating)
```
┌─────────────────────┐
│ ⏱ Hầm nước dùng    │
│    2:45:30           │
│ [Dừng]  [Thu nhỏ]   │
└─────────────────────┘
Position: bottom-right (web), top floating (mobile)
Z-index: above content, below modals
Drag-to-move (mobile)
```

---

## S16: Bookmarks

| # | Element | Event | Handler | API Call | On Success | On Error | Loading UI |
|---|---------|-------|---------|----------|------------|----------|------------|
| 1 | — (on mount) | useEffect | `fetchBookmarks()` | `GET /recipes/bookmarks?page=1` | Render grid | Error state | Skeleton grid |
| 2 | Button [← Back] | onClick | `router.back()` | — | Go back | — | — |
| 3 | SearchBar | onChange | `setQuery(value)` (debounce 300ms) | `GET /recipes/bookmarks?q={value}` | Filter bookmarks | — | Skeleton |
| 4 | Filter tab "Tất cả" | onClick | `setMealTypeFilter(null)` | `GET /recipes/bookmarks` | Show all | — | — |
| 5 | Filter tab "Sáng" | onClick | `setMealTypeFilter('breakfast')` | `GET /recipes/bookmarks?mealType=breakfast` | Filter by meal type | — | — |
| 6 | Filter tab "Trưa/Tối/Phụ" | onClick | Same pattern | Same | Same | — | — |
| 7 | RecipeCard tap | onClick | `navigate('/recipes/{id}')` | — | → S15 | — | — |
| 8 | RecipeCard bookmark ♥ | onClick | `handleUnbookmark(recipeId)` | — | Show confirm dialog | — | — |
| 9 | Confirm "Bỏ lưu" | onClick | `confirmUnbookmark(recipeId)` | `DELETE /recipes/{id}/bookmark` | Remove card from grid (optimistic) + Toast "Đã bỏ lưu" | Rollback (re-add card) | — |
| 10 | Confirm "Hủy" | onClick | `closeDialog()` | — | Close dialog | — | — |
| 11 | Empty state "Khám phá" | onClick | `navigate('/recipes')` | — | → S14 | — | — |
| 12 | Scroll to bottom | onScroll | `loadMore()` | `GET /recipes/bookmarks?page={next}` | Append cards | — | Skeleton append |

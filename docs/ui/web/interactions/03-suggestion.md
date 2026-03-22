# Interaction Map: Home & Suggestion Flow (S10-S11)

---

## S10: Home (Suggestions)

| # | Element | Event | Handler | API Call | On Success | On Error | Loading UI |
|---|---------|-------|---------|----------|------------|----------|------------|
| 1 | — (on mount) | useEffect | `fetchSuggestions()` | `GET /suggestions?mealType={auto}&profileId={active}` | Render 5 suggestion cards | Error state: "Không thể tải gợi ý" + retry button | 5× Skeleton cards |
| 2 | ProfileSwitcher chip | onClick | `setActiveProfile(profileId)` | `PATCH /family-profiles/active { profileId }` | Invalidate suggestions → refetch | Toast error | Chip loading state |
| 3 | Chip "Cả gia đình" | onClick | `setActiveProfile(null)` | `PATCH /family-profiles/active { profileId: null }` | Invalidate suggestions → refetch | Toast error | — |
| 4 | Tab "Sáng" | onClick | `setMealType('breakfast')` | Invalidate → `GET /suggestions?mealType=breakfast` | New cards | — | Skeleton cards |
| 5 | Tab "Trưa" | onClick | `setMealType('lunch')` | Invalidate → `GET /suggestions?mealType=lunch` | New cards | — | Skeleton cards |
| 6 | Tab "Tối" | onClick | `setMealType('dinner')` | Invalidate → `GET /suggestions?mealType=dinner` | New cards | — | Skeleton cards |
| 7 | Tab "Phụ" | onClick | `setMealType('snack')` | Invalidate → `GET /suggestions?mealType=snack` | New cards | — | Skeleton cards |
| 8 | SuggestionCard — swipe right (mobile) | onSwipeRight | `handleAccept(suggestion)` | (1) Queue interaction `{ recipeId, action: 'cook', source: 'home' }` | Green overlay → remove card → navigate `/recipes/{id}` (S15) | — | — |
| 9 | SuggestionCard — swipe left (mobile) | onSwipeLeft | `handleSkip(suggestion)` | (1) Queue interaction `{ recipeId, action: 'skip', source: 'home' }` | Red overlay → remove card → show next card | — | — |
| 10 | Button "♥ Chọn" (web) | onClick | `handleAccept(suggestion)` | Same as #8 | Navigate `/recipes/{id}` | — | — |
| 11 | Button "✗ Bỏ qua" (web) | onClick | `handleSkip(suggestion)` | Same as #9 | Show next card | — | — |
| 12 | Card tap (anywhere) | onClick | `navigate('/recipes/{id}')` | Queue interaction `{ action: 'view' }` | → S15 Recipe Detail | — | — |
| 13 | Card bookmark icon | onClick | `toggleBookmark(recipeId)` | `POST /recipes/{id}/bookmark` or `DELETE /recipes/{id}/bookmark` | Toggle ♡ ↔ ♥ (optimistic) | Rollback toggle | — |
| 14 | Button "🎲 Surprise me!" | onClick | `handleSurprise()` | `GET /suggestions/surprise?mealType={current}` | Replace card stack with 1 surprise card (special animation) | Toast error | Card skeleton |
| 15 | Button "🍱 Combo" | onClick | `navigate('/combo')` | — | → S11 Combo screen | — | — |
| 16 | Link "Nâng cấp Pro" | onClick | `openUpgradeModal()` | — | Show upgrade modal | — | — |
| 17 | "Xem thêm gợi ý" (when empty) | onClick | `handleRefresh()` | `POST /suggestions/refresh { mealType, excludeRecipeIds: [...seen] }` | New 5 cards | Toast error | Skeleton cards |

### Interaction Batch Logic
```typescript
// Queue interactions locally
const queue: Interaction[] = []

function queueInteraction(interaction: Interaction) {
  queue.push({ ...interaction, timestamp: new Date().toISOString() })

  // Flush when queue reaches 10 OR every 30 seconds
  if (queue.length >= 10) flush()
}

async function flush() {
  if (queue.length === 0) return
  const batch = [...queue]
  queue.length = 0

  await api.post('/interactions', { interactions: batch })
  // Fire-and-forget, no retry needed (best effort)
}

// Timer: flush every 30s
useInterval(flush, 30_000)

// Flush on unmount (page leave)
useEffect(() => () => flush(), [])
```

### Quota Display (Free tier)
```
remaining = response.data.remaining  // from /suggestions response
Display: "Gợi ý hôm nay: {remaining}/50"
When remaining <= 5: text turns warning (yellow)
When remaining = 0:
  - Disable suggestion fetch
  - Show: "Đã hết lượt gợi ý hôm nay"
  - Show: [⭐ Nâng cấp Pro — không giới hạn]
```

---

## S11: Combo Suggestion

| # | Element | Event | Handler | API Call | On Success | On Error | Loading UI |
|---|---------|-------|---------|----------|------------|----------|------------|
| 1 | — (on mount) | useEffect | `fetchCombo()` | `GET /suggestions/combo?mealType={from_prev}&servings={familySize}` | Render 4 combo items + macro summary | Error state + retry | 4× Skeleton cards |
| 2 | Button [← Home] | onClick | `navigate('/')` | — | → S10 | — | — |
| 3 | Button "🔄 Đổi" (món chính) | onClick | `openSwapSheet('main')` | `POST /suggestions/combo/swap { comboId, role: 'main', excludeRecipeId }` | Show 3 alternatives in bottom sheet | Toast error | Sheet skeleton |
| 4 | Button "🔄 Đổi" (canh) | onClick | `openSwapSheet('soup')` | `POST /suggestions/combo/swap { comboId, role: 'soup', excludeRecipeId }` | Show 3 alternatives | Toast error | Sheet skeleton |
| 5 | Button "🔄 Đổi" (rau) | onClick | `openSwapSheet('vegetable')` | Same with role='vegetable' | Show 3 alternatives | Toast error | Sheet skeleton |
| 6 | Button "🔄 Đổi" (tráng miệng) | onClick | `openSwapSheet('dessert')` | Same with role='dessert' | Show 3 alternatives | Toast error | Sheet skeleton |
| 7 | Swap sheet — "Chọn" item | onClick | `handleSwapSelect(role, newRecipeId)` | — (update from response of #3-6) | Replace combo item → recalculate totals → close sheet | — | — |
| 8 | Tap combo item (ảnh/tên) | onClick | `navigate('/recipes/{id}')` | — | → S15 Recipe Detail | — | — |
| 9 | Button "✓ Chọn combo này" | onClick | `handleAcceptCombo()` | Queue interactions for all 4 items `{ action: 'cook', source: 'combo' }` | Toast "Đã lưu combo!" → navigate `/` (S10) | Toast error | Button spinner |
| 10 | Button "🔄 Đổi toàn bộ" | onClick | `handleRegenerateCombo()` | `GET /suggestions/combo?mealType={}&servings={}` (new request) | Replace all 4 items | Toast error | Full loading overlay |

### Macro Summary Recalculation
```
Khi swap 1 item:
  totalCalories = sum(items.map(i => i.recipe.calories))
  totalProtein  = sum(items.map(i => i.recipe.protein))
  totalCarbs    = sum(items.map(i => i.recipe.carbs))
  totalFat      = sum(items.map(i => i.recipe.fat))

  → Update UI immediately (client-side calc)
```

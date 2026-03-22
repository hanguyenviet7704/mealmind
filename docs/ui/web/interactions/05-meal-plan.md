# Interaction Map: Meal Plan Flow (S17-S20)

---

## S17: Meal Plan List

| # | Element | Event | Handler | API Call | On Success | On Error | Loading UI |
|---|---------|-------|---------|----------|------------|----------|------------|
| 1 | — (on mount) | useEffect | `fetchPlans()` | `GET /meal-plans?page=1&pageSize=10` | Render plan cards grouped by status | Error state | 3× Skeleton cards |
| 2 | Active plan card "Xem →" | onClick | `navigate('/meal-plan/{id}')` | — | → S18 | — | — |
| 3 | Draft plan card "Xem →" | onClick | `navigate('/meal-plan/{id}')` | — | → S18 | — | — |
| 4 | Draft plan card [🗑] | onClick | `openDeleteDialog(planId)` | — | Show confirm: "Xóa thực đơn nháp này?" | — | — |
| 5 | Delete confirm "Xóa" | onClick | `handleDeletePlan(planId)` | `DELETE /meal-plans/{planId}` | Remove card (optimistic) + Toast "Đã xóa" | Rollback | — |
| 6 | Delete confirm "Hủy" | onClick | `closeDialog()` | — | Close | — | — |
| 7 | Archived plan card "Xem →" | onClick | `navigate('/meal-plan/{id}')` | — | → S18 (read-only) | — | — |
| 8 | Button "+ Tạo thực đơn mới" | onClick | `openCreateModal()` | — | Show create modal | — | — |
| 9 | Create modal — week picker [←] | onClick | `setPrevWeek()` | — | Update weekStart display | — | — |
| 10 | Create modal — week picker [→] | onClick | `setNextWeek()` | — | Update weekStart display | — | — |
| 11 | Create modal — "Tạo thực đơn" | onClick | `handleCreatePlan()` | `POST /meal-plans { weekStart, preferences }` | Close modal → navigate `/meal-plan/{newId}` (S18) | Toast error | Full-screen loading: "⏳ Đang tạo thực đơn... AI đang chọn món phù hợp cho bạn" (2-5s) |
| 12 | Empty state "Tạo đầu tiên" | onClick | Same as #8 | — | Same | — | — |

### Create Loading Screen
```
┌──────────────────────────────────────┐
│                                      │
│         🍳 (animated icon)           │
│                                      │
│    "Đang tạo thực đơn tuần..."      │
│                                      │
│    AI đang chọn 21 món phù hợp      │
│    với khẩu vị và dinh dưỡng        │
│    của bạn                           │
│                                      │
│    ████████████░░░░░░ (progress)     │
│                                      │
└──────────────────────────────────────┘
Timeout: 10s → show "Đang mất nhiều thời gian hơn bình thường..." + retry option
```

### Error: Max Drafts
```
HTTP 400, code BIZ_PLAN_LIMIT
→ Toast: "Đã đạt giới hạn 4 thực đơn nháp. Xóa bớt hoặc kích hoạt 1 plan."
→ Highlight draft plans
```

---

## S18: Meal Plan Detail

| # | Element | Event | Handler | API Call | On Success | On Error | Loading UI |
|---|---------|-------|---------|----------|------------|----------|------------|
| 1 | — (on mount) | useEffect | `fetchPlan(id)` | `GET /meal-plans/{id}` | Render MealPlanGrid | Error / 404 | Grid skeleton |
| 2 | Button [← Back] | onClick | `navigate('/meal-plan')` | — | → S17 | — | — |
| 3 | Status dropdown [Active ▾] | onClick | `openStatusMenu()` | — | Show: [Draft, Active, Archive] | — | — |
| 4 | Status menu → "Active" | onClick | `handleActivate(planId)` | `PATCH /meal-plans/{id} { status: 'active' }` | Update badge. Previous active auto-archived | Toast error | — |
| 5 | Status menu → "Archive" | onClick | `handleArchive(planId)` | `PATCH /meal-plans/{id} { status: 'archived' }` | Update badge → grid becomes read-only | Toast error | — |
| 6 | MealSlotCard tap | onClick | `openSlotActionSheet(slot)` | — | Show bottom sheet / popover with actions | — | — |
| 7 | Action: "👁 Xem chi tiết" | onClick | `navigate('/recipes/{recipeId}')` | — | → S15 Recipe Detail | — | — |
| 8 | Action: "🔄 Đổi món" | onClick | `openSwapModal(slot)` | `GET /meal-plans/{planId}/slots/{slotId}/suggestions` | → S19 Swap modal | Toast error | Modal skeleton |
| 9 | Action: "🔒 Lock" | onClick | `handleLockSlot(slotId)` | `PATCH /meal-plans/{planId}/slots/{slotId} { isLocked: true }` | Show lock icon on slot (optimistic) | Rollback + Toast | — |
| 10 | Action: "🔓 Unlock" | onClick | `handleUnlockSlot(slotId)` | `PATCH /meal-plans/{planId}/slots/{slotId} { isLocked: false }` | Remove lock icon (optimistic) | Rollback | — |
| 11 | Action: "🗑 Xóa" | onClick | `handleDeleteSlot(slotId)` | `PATCH /meal-plans/{planId}/slots/{slotId} { recipeId: null }` | Show empty slot | Rollback | — |
| 12 | Drag start (desktop) | onDragStart | `setDragging(slotId)` | — | Highlight source slot + show drop targets | — | — |
| 13 | Drag drop (desktop) | onDrop | `handleSwapSlots(sourceId, targetId)` | `PATCH /meal-plans/{planId}/slots/{sourceId} { recipeId: targetRecipeId }` + `PATCH .../slots/{targetId} { recipeId: sourceRecipeId }` | Swap 2 slots visually (optimistic) + recalc nutrition | Rollback both | — |
| 14 | Button "🔄 Tạo lại" | onClick | `openRegenerateDialog()` | — | Show confirm dialog | — | — |
| 15 | Regenerate confirm "Tạo lại" | onClick | `handleRegenerate()` | `POST /meal-plans/{planId}/regenerate` | Replace unlocked slots + recalc nutrition | Toast error | Full loading overlay (2-5s) |
| 16 | Regenerate confirm "Hủy" | onClick | `closeDialog()` | — | Close | — | — |
| 17 | Button "📤 Chia sẻ" | onClick | `openShareModal()` | — | Show share modal | — | — |
| 18 | Share modal — input email | onChange | `setShareEmail(value)` | — | — | Validate email format | — |
| 19 | Share modal — permission radio | onChange | `setSharePermission(value)` | — | — | — | — |
| 20 | Share modal — "Chia sẻ" | onClick | `handleShare()` | `POST /meal-plans/{planId}/share { userId/email, permission }` | Add to shared list + Toast "Đã chia sẻ" | Toast error | Button spinner |
| 21 | Share modal — "🗑 Gỡ" | onClick | `handleUnshare(shareId)` | `DELETE /meal-plans/{planId}/share/{shareId}` | Remove from list | Toast error | — |
| 22 | Button "📊 Dinh dưỡng" | onClick | `navigate('/meal-plan/{id}/nutrition')` | — | → S20 | — | — |
| 23 | Nutrition summary bar (bottom) | — (reactive) | Auto-calc from plan data | — | Show today's nutrition vs target | — | — |

### Lock Limit Check (Client-Side)
```typescript
function canLockMore(slots: Slot[]): boolean {
  const total = slots.length  // 21
  const locked = slots.filter(s => s.isLocked).length
  return locked < Math.floor(total * 0.7)  // max 70%
}

// If exceeded → Toast: "Không thể lock quá 70% slots"
```

### Regenerate Loading
```
Same as create loading but message:
"🔄 Đang tạo lại thực đơn..."
"Giữ nguyên {lockedCount} món đã lock"
```

---

## S19: Slot Swap Modal

| # | Element | Event | Handler | API Call | On Success | On Error | Loading UI |
|---|---------|-------|---------|----------|------------|----------|------------|
| 1 | — (on open) | useEffect | `fetchAlternatives()` | `GET /meal-plans/{planId}/slots/{slotId}/suggestions` | Render 5 alternative RecipeCards | Error + retry | 5× Skeleton rows |
| 2 | Button [✕] close | onClick | `closeModal()` | — | Close modal | — | — |
| 3 | Alternative — "Chọn món này" | onClick | `handleSelectAlternative(recipeId)` | `PATCH /meal-plans/{planId}/slots/{slotId} { recipeId }` | Close modal + update slot in grid (optimistic) + recalc nutrition | Rollback + Toast | Button spinner |
| 4 | Alternative — tap image/name | onClick | `navigate('/recipes/{id}')` | — | → S15 (push, modal stays in stack) | — | — |
| 5 | Button "🔄 Xem thêm" | onClick | `handleLoadMore()` | `POST /suggestions/refresh { mealType, excludeRecipeIds: [...current + planRecipes] }` | Append 5 more alternatives | Toast error | Skeleton append |

---

## S20: Weekly Nutrition Dashboard

| # | Element | Event | Handler | API Call | On Success | On Error | Loading UI |
|---|---------|-------|---------|----------|------------|----------|------------|
| 1 | — (on mount) | useEffect | `fetchWeeklyNutrition()` | `GET /nutrition/weekly?weekStart={planWeekStart}` | Render bar chart + macro bars + daily breakdown | Error + retry | Skeleton chart + bars |
| 2 | Button [← Back] | onClick | `router.back()` | — | → S18 | — | — |
| 3 | Bar chart day column | onClick | `scrollToDay(dayIndex)` | — | Scroll to that day's detail section | — | — |
| 4 | Day detail section ▾ | onClick | `toggleDayExpand(dayIndex)` | — | Expand/collapse meal breakdown | — | — |
| 5 | Meal item in breakdown | onClick | `navigate('/recipes/{recipeId}')` | — | → S15 | — | — |

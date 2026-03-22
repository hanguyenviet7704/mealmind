# Flow 5: Meal Plan Screens

## S17: Meal Plan List

**Route:** `/meal-plan` | `MealPlanScreen`
**Tab:** Thực đơn (active)

```
┌──────────────────────────────────────┐
│ [NavBar]                  Thực đơn   │
├──────────────────────────────────────┤
│                                      │
│  ── Active Plan ──                   │
│  ┌────────────────────────────────┐  │
│  │  📅 24/3 – 30/3/2026          │  │
│  │  [Active] ● Đang dùng         │  │
│  │  21 món · Avg 1,950 kcal/ngày │  │
│  │                    [Xem →]    │  │
│  └────────────────────────────────┘  │
│                                      │
│  ── Drafts ──                        │
│  ┌────────────────────────────────┐  │
│  │  📅 31/3 – 6/4/2026           │  │
│  │  [Draft] Nháp                  │  │
│  │  15/21 món · Chưa hoàn thành  │  │
│  │              [Xem →] [🗑]     │  │
│  └────────────────────────────────┘  │
│                                      │
│  ── Archived ──                      │
│  ┌────────────────────────────────┐  │
│  │  📅 17/3 – 23/3/2026          │  │
│  │  [Archived] Lưu trữ           │  │
│  │              [Xem →]          │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  [+ Tạo thực đơn mới]        │  │
│  └────────────────────────────────┘  │
│                                      │
├──────────────────────────────────────┤
│ [Home] [Món ăn] [●Thực đơn] [Cá nhân]│
└──────────────────────────────────────┘

      ═══ EMPTY STATE ═══

│  ┌────────────────────────────────┐  │
│  │      📅 (icon lớn)            │  │
│  │                                │  │
│  │  "Chưa có thực đơn nào"       │  │
│  │  "Tạo thực đơn tuần để AI     │  │
│  │   lên menu cho cả gia đình"   │  │
│  │                                │  │
│  │  [+ Tạo thực đơn đầu tiên]   │  │
│  └────────────────────────────────┘  │
```

### "Tạo thực đơn mới" Flow
```
Tap [+ Tạo thực đơn mới]
  │
  ▼
┌────────────────────────────────┐
│ Tạo thực đơn mới        [✕]  │
├────────────────────────────────┤
│                                │
│ Tuần bắt đầu:                 │
│ [← ] 31/3/2026 (Thứ 2) [ →]  │
│                                │
│ Tùy chọn:                     │
│ ☐ Ưu tiên món nấu nhanh      │
│   (< 30 phút)                 │
│ ☐ Bao gồm bữa phụ            │
│                                │
│ ┌──────────────────────────┐   │
│ │   [Tạo thực đơn]        │   │
│ └──────────────────────────┘   │
│                                │
│ ⏳ Đang tạo... (loading 2-5s) │
│                                │
└────────────────────────────────┘
```

### API
```
GET  /meal-plans?page=1&pageSize=10
POST /meal-plans { weekStart, preferences }
```

---

## S18: Meal Plan Detail

**Route:** `/meal-plan/:id` | `MealPlanDetailScreen`
**Entry:** Tap plan từ S17

```
┌──────────────────────────────────────┐
│ [← Back]  Thực đơn 24/3   [Active ▾]│
├──────────────────────────────────────┤
│                                      │
│  ┌────┬────┬────┬────┬────┬────┬────┐│
│  │ T2 │ T3 │ T4 │ T5 │ T6 │ T7 │ CN ││
│  │24/3│25/3│26/3│27/3│28/3│29/3│30/3││
│  ├────┼────┼────┼────┼────┼────┼────┤│
│  │Sáng│Sáng│Sáng│Sáng│Sáng│Sáng│Sáng││
│  │┌──┐│┌──┐│┌──┐│┌──┐│┌──┐│┌──┐│┌──┐││
│  ││🔒││    ││    ││    ││    ││    ││    │││
│  ││Phở││Bánh││Xôi ││Cháo││Bánh││Bún ││Phở │││
│  ││450││ mì ││350 ││280 ││cuốn││chả ││bò  │││
│  ││   ││320 ││    ││    ││300 ││350 ││400 │││
│  │└──┘│└──┘│└──┘│└──┘│└──┘│└──┘│└──┘││
│  ├────┼────┼────┼────┼────┼────┼────┤│
│  │Trưa│Trưa│Trưa│Trưa│Trưa│Trưa│Trưa││
│  │┌──┐│┌──┐│┌──┐│┌──┐│┌──┐│┌──┐│┌──┐││
│  ││Cơm ││Bún ││Cơm ││Bún ││Mì  ││Cơm ││Bún │││
│  ││rang││bò  ││tấm ││riêu││xào ││gà  ││đậu │││
│  ││520 ││480 ││550 ││400 ││450 ││380 ││420 │││
│  │└──┘│└──┘│└──┘│└──┘│└──┘│└──┘│└──┘││
│  ├────┼────┼────┼────┼────┼────┼────┤│
│  │Tối │Tối │Tối │Tối │Tối │Tối │Tối ││
│  │┌──┐│┌──┐│┌──┐│┌──┐│┌──┐│┌──┐│┌──┐││
│  ││Canh││Lẩu ││Gà  ││Cá  ││Thịt││Canh││Bún │││
│  ││chua││thái││kho ││kho ││bò  ││bí  ││chả │││
│  ││380 ││550 ││350 ││400 ││480 ││320 ││400 │││
│  │└──┘│└──┘│└──┘│└──┘│└──┘│└──┘│└──┘││
│  └────┴────┴────┴────┴────┴────┴────┘│
│                                      │
│  ── Hôm nay (T2) ──                 │
│  🔥 1,350 / 2,000 kcal ████████░░   │
│  💪 Protein: 85 / 120g              │
│                                      │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │🔄    │ │📤    │ │📊    │        │
│  │Tạo   │ │Chia  │ │Dinh  │        │
│  │lại   │ │sẻ    │ │dưỡng │        │
│  └──────┘ └──────┘ └──────┘        │
│                                      │
└──────────────────────────────────────┘
```

### Mobile Layout (nhỏ hơn)
- Scroll horizontal cho 7 ngày (chỉ hiện 3-4 ngày)
- Mỗi cell chỉ hiện: tên (truncate 1 line) + calo
- Tap cell → action sheet

### Tap vào 1 slot
```
┌──────────────────────────────┐
│ Phở bò Hà Nội         [✕]  │
│ T2 · Bữa sáng · 450 kcal   │
├──────────────────────────────┤
│                              │
│ [👁 Xem chi tiết] → S15     │
│ [🔄 Đổi món] → S19          │
│ [🔒 Lock món này]            │
│ [🔓 Unlock] (nếu đã lock)  │
│ [🗑 Xóa khỏi plan]          │
│                              │
└──────────────────────────────┘
```

### "Tạo lại" (Regenerate)
```
┌────────────────────────────────┐
│ Tạo lại thực đơn?       [✕]  │
├────────────────────────────────┤
│                                │
│ ⚠ Các món đã lock sẽ được     │
│   giữ nguyên. Chỉ thay đổi   │
│   các món chưa lock.          │
│                                │
│ Đã lock: 3 / 21 món           │
│                                │
│ [Hủy]        [Tạo lại]        │
│                                │
│ ⏳ Đang tạo lại... (2-5s)     │
└────────────────────────────────┘
```

### "Chia sẻ"
```
┌────────────────────────────────┐
│ Chia sẻ thực đơn         [✕] │
├────────────────────────────────┤
│                                │
│ Chia sẻ với thành viên:       │
│ ┌──────────────────────────┐   │
│ │ 📧 Email hoặc tên...     │   │
│ └──────────────────────────┘   │
│                                │
│ Quyền: ○ Xem  ○ Xem + Sửa   │
│                                │
│ Đã chia sẻ:                   │
│ 👦 Bảo (xem)      [🗑 Gỡ]   │
│                                │
│ [Chia sẻ]                      │
│                                │
└────────────────────────────────┘
```

---

## S19: Slot Swap (Modal / Bottom Sheet)

**Entry:** Tap "🔄 Đổi món" từ S18

```
┌──────────────────────────────────────┐
│ Đổi bữa sáng T2                [✕] │
│ Thay thế: Phở bò Hà Nội            │
├──────────────────────────────────────┤
│                                      │
│  Gợi ý thay thế:                    │
│                                      │
│  ┌──────┐  Bánh mì trứng ốp la     │
│  │[Ảnh] │  ⏱ 15p · 🔥 380 kcal     │
│  │      │  [Dễ] [Nhanh gọn]        │
│  └──────┘  [Chọn món này]           │
│                                      │
│  ┌──────┐  Xôi xéo                  │
│  │[Ảnh] │  ⏱ 25p · 🔥 420 kcal     │
│  │      │  [Dễ] [Miền Bắc]         │
│  └──────┘  [Chọn món này]           │
│                                      │
│  ┌──────┐  Cháo gà                  │
│  │[Ảnh] │  ⏱ 35p · 🔥 320 kcal     │
│  │      │  [Dễ] [Comfort food]     │
│  └──────┘  [Chọn món này]           │
│                                      │
│  ┌──────┐  Bún chả cá              │
│  │[Ảnh] │  ⏱ 30p · 🔥 350 kcal     │
│  │      │  [TB] [Miền Trung]       │
│  └──────┘  [Chọn món này]           │
│                                      │
│  ┌──────┐  Bánh cuốn               │
│  │[Ảnh] │  ⏱ 40p · 🔥 300 kcal     │
│  │      │  [TB] [Miền Bắc]        │
│  └──────┘  [Chọn món này]           │
│                                      │
│  [🔄 Xem thêm gợi ý]               │
│                                      │
└──────────────────────────────────────┘
```

### API
```
GET   /meal-plans/:planId/slots/:slotId/suggestions
PATCH /meal-plans/:planId/slots/:slotId { recipeId }
```

### Behavior
- "Chọn món này" → optimistic update grid → close modal
- "Xem thêm" → `POST /suggestions/refresh { excludeRecipeIds }`
- Tap ảnh/tên → navigate to recipe detail (S15) (push, not replace)

---

## S20: Weekly Nutrition Dashboard

**Route:** `/meal-plan/:id/nutrition` | `WeekNutritionScreen`
**Entry:** Tap "📊 Dinh dưỡng" từ S18

```
┌──────────────────────────────────────┐
│ [← Back]     Dinh dưỡng tuần        │
│              24/3 – 30/3             │
├──────────────────────────────────────┤
│                                      │
│  ── Tổng quan ──                     │
│  Trung bình: 1,920 kcal/ngày        │
│  Target: 2,000 kcal/ngày            │
│  Ngày đạt target: 5/7 ngày          │
│                                      │
│  ── Calories theo ngày ──            │
│  ┌────────────────────────────────┐  │
│  │ 2500 ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │  │
│  │ 2000 ─ ─ ─ ─ ─ ─target─ ─ ─  │  │
│  │ 1500 ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │  │
│  │ 1000 ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │  │
│  │  500 ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │  │
│  │    0 ─┬──┬──┬──┬──┬──┬──┬──  │  │
│  │       T2 T3 T4 T5 T6 T7 CN   │  │
│  │       ██ ██ ██ ██ ██ ██ ██    │  │
│  │       🟢 🟢 🟡 🟢 🟢 🔴 🟢    │  │
│  └────────────────────────────────┘  │
│  🟢 Đạt target  🟡 Gần vượt  🔴 Vượt│
│                                      │
│  ── Macro trung bình/ngày ──         │
│                                      │
│  💪 Protein   105g / 120g           │
│  ████████████████░░░░  88% 🟢       │
│                                      │
│  🍚 Carbs     230g / 250g           │
│  ██████████████████░░  92% 🟢       │
│                                      │
│  🧈 Fat        58g / 65g            │
│  ████████████████░░░░  89% 🟢       │
│                                      │
│  🥬 Fiber      18g / 25g            │
│  ████████████░░░░░░░░  72% 🟡       │
│                                      │
│  ── Chi tiết theo ngày ──            │
│                                      │
│  ▾ Thứ 2 (24/3)  1,850 kcal  🟢    │
│    Sáng: Phở bò (450 kcal)         │
│    Trưa: Cơm rang (520 kcal)       │
│    Tối:  Canh chua (380 kcal)       │
│                                      │
│  ▸ Thứ 3 (25/3)  2,050 kcal  🟢    │
│  ▸ Thứ 4 (26/3)  1,750 kcal  🟡    │
│  ▸ Thứ 5 (27/3)  1,980 kcal  🟢    │
│  ▸ Thứ 6 (28/3)  1,930 kcal  🟢    │
│  ▸ Thứ 7 (29/3)  2,350 kcal  🔴    │
│  ▸ CN    (30/3)  1,920 kcal  🟢    │
│                                      │
└──────────────────────────────────────┘
```

### API
```
GET /nutrition/weekly?weekStart=2026-03-24&profileId={}
TanStack Query: ['nutrition', 'weekly', { weekStart, profileId }]
```

### Status Colors
| Status | Condition | Color |
|--------|-----------|-------|
| `good` 🟢 | Within ±10% of target | Green (success) |
| `warning` 🟡 | ±10-20% of target | Yellow (warning) |
| `alert` 🔴 | > 20% off target | Red (error) |

# Mobile Screens: Meal Plan Extra (S22, S23, S24, S25)

File `03-main.md` đã có M-S20 (List) + M-S21 (Detail). File này bổ sung còn thiếu.

---

## M-S22: SlotSwapSheet (Bottom Sheet)

```
┌──────────────────────────┐
│                          │
│   (backdrop 50% black)   │
│                          │
├── drag handle ───────────┤
│ Đổi bữa sáng T2    [✕] │
│ Thay: Phở bò Hà Nội     │
├──────────────────────────┤
│                          │
│  ┌────────────────┬─────┐│
│  │ [Ảnh]          │Chọn ││
│  │ Bánh mì trứng  │     ││
│  │ ⏱15p · 🔥380   │     ││
│  │ [Dễ][Nhanh]    │     ││
│  └────────────────┴─────┘│
│                          │
│  ┌────────────────┬─────┐│
│  │ [Ảnh]          │Chọn ││
│  │ Xôi xéo        │     ││
│  │ ⏱25p · 🔥420   │     ││
│  │ [Dễ][Bắc]      │     ││
│  └────────────────┴─────┘│
│                          │
│  ┌────────────────┬─────┐│
│  │ [Ảnh]          │Chọn ││
│  │ Cháo gà        │     ││
│  │ ⏱35p · 🔥320   │     ││
│  │ [Dễ]           │     ││
│  └────────────────┴─────┘│
│                          │
│  ┌────────────────┬─────┐│
│  │ [Ảnh]          │Chọn ││
│  │ Bún chả cá     │     ││
│  │ ⏱30p · 🔥350   │     ││
│  │ [TB][Trung]     │     ││
│  └────────────────┴─────┘│
│                          │
│  ┌────────────────┬─────┐│
│  │ [Ảnh]          │Chọn ││
│  │ Bánh cuốn      │     ││
│  │ ⏱40p · 🔥300   │     ││
│  │ [TB][Bắc]      │     ││
│  └────────────────┴─────┘│
│                          │
│  [🔄 Xem thêm gợi ý]   │
│                          │
└──────────────────────────┘
```

### Mobile-Specific
- **Bottom Sheet 85%** — `@gorhom/bottom-sheet`, snapPoints: ['85%']
- **Swipe down to dismiss**
- **Haptic** on select
- **Tap ảnh/tên** → navigate S15 (push, sheet stays in stack)

### Interactions
| # | Element | Event | API | On Success |
|---|---------|-------|-----|------------|
| 1 | — (on open) | auto | GET /meal-plans/:planId/slots/:slotId/suggestions | Render 5 alternatives |
| 2 | [✕] or swipe down | onPress | — | Close sheet |
| 3 | "Chọn" | onPress | PATCH /meal-plans/:planId/slots/:slotId { recipeId } | Close sheet + update slot (optimistic) + haptic |
| 4 | Ảnh/tên | onPress | — | Navigate → S15 |
| 5 | "Xem thêm" | onPress | POST /suggestions/refresh { excludeRecipeIds } | Append 5 more |

---

## M-S23: WeekNutritionScreen

```
┌──────────────────────────┐
│░░░░░░ Status Bar ░░░░░░░│
├──────────────────────────┤
│ [←]  Dinh dưỡng tuần    │
│       24/3 – 30/3        │
├──────────────────────────┤
│                          │
│ TB: 1,920 kcal/ngày     │
│ Target: 2,000 kcal      │
│ Đạt: 5/7 ngày           │
│                          │
│ ← scroll chart →        │
│ ┌────────────────────────┐
│ │2500 ─ ─ ─ ─ ─ ─ ─ ─  │
│ │2000 ─ ─ ─target─ ─ ─  │
│ │1500 ─ ─ ─ ─ ─ ─ ─ ─  │
│ │1000 ─ ─ ─ ─ ─ ─ ─ ─  │
│ │ 500 ─ ─ ─ ─ ─ ─ ─ ─  │
│ │   0 T2 T3 T4 T5 T6 T7 CN │
│ │     ██ ██ ██ ██ ██ ██ ██  │
│ │     🟢 🟢 🟡 🟢 🟢 🔴 🟢  │
│ └────────────────────────┘
│                          │
│ 💪 Protein  105/120g    │
│ ████████████████░░ 88%🟢│
│                          │
│ 🍚 Carbs   230/250g     │
│ ██████████████████░░ 92%🟢│
│                          │
│ 🧈 Fat     58/65g       │
│ ████████████████░░░ 89%🟢│
│                          │
│ 🥬 Fiber   18/25g       │
│ ████████████░░░░░░ 72%🟡│
│                          │
│ ── Chi tiết theo ngày ── │
│                          │
│ ▾ T2 (24/3) 1,850kcal 🟢│
│   Sáng: Phở bò  450kcal │
│   Trưa: Cơm rang 520kcal│
│   Tối: Canh chua 380kcal│
│                          │
│ ▸ T3 (25/3) 2,050kcal 🟢│
│ ▸ T4 (26/3) 1,750kcal 🟡│
│ ▸ T5 ...                │
│                          │
└──────────────────────────┘
```

### Mobile-Specific
- **Chart:** `react-native-chart-kit` BarChart, horizontal scroll
- **Tap bar** → scroll to day detail below
- **Accordion** for day breakdown
- **Tap meal item** → navigate to S15

### Interactions
| # | Element | Event | API | On Success |
|---|---------|-------|-----|------------|
| 1 | — (on mount) | auto | GET /nutrition/weekly?weekStart={} | Render chart + bars |
| 2 | Bar column tap | onPress | — | Scroll to day detail section |
| 3 | Day header ▾ | onPress | — | Expand/collapse meals |
| 4 | Meal item | onPress | — | Navigate → S15 |

---

## M-S24: ShoppingListScreen

```
┌──────────────────────────┐
│░░░░░░ Status Bar ░░░░░░░│
├──────────────────────────┤
│ [←]  Danh sách mua sắm  │
│       Tuần 24/3          │
├──────────────────────────┤
│                          │
│ Đã mua: 5/18 items      │
│ ████████░░░░░░░░░░ 28%  │
│                          │
│ ── 🥩 Thịt cá (4) ──    │
│ ┌──────────────────────┐ │
│ │ ☐ Thịt bò nạm  500g │ │ ← swipe → ✓ đã mua
│ │ ☐ Ức gà        400g │ │
│ │ ☑ Cá lóc       300g │ │ ← strikethrough + green
│ │ ☑ Tôm sú      200g  │ │
│ └──────────────────────┘ │
│                          │
│ ── 🥬 Rau củ (6) ──     │
│ ┌──────────────────────┐ │
│ │ ☐ Hành tây    3 củ   │ │
│ │ ☐ Cà chua     500g   │ │
│ │ ☐ Rau muống   2 bó   │ │
│ │ ☐ Giá đỗ     200g    │ │
│ │ ☐ Gừng       100g    │ │
│ │ ☑ Hành lá    1 bó    │ │
│ └──────────────────────┘ │
│                          │
│ ── 🧂 Gia vị (5) ──     │
│ ┌──────────────────────┐ │
│ │ ☑ Nước mắm          │ │
│ │ ☐ Hoa hồi     5 cái │ │
│ │ ☐ Quế         2 thanh│ │
│ │ ☑ Đường phèn         │ │
│ │ ☐ Hạt tiêu           │ │
│ └──────────────────────┘ │
│                          │
│ ── 🍚 Đồ khô (3) ──    │
│ ...                      │
│                          │
│ ┌──────────────────────┐ │
│ │ 📤 Chia sẻ danh sách │ │
│ └──────────────────────┘ │
│                          │
└──────────────────────────┘
```

### Mobile-Specific
- **Swipe right** on item → mark "đã mua" (green check + strikethrough + haptic)
- **Swipe left** → remove from list
- **Group by category** (thịt, rau, gia vị, đồ khô)
- **Auto-generated** từ active meal plan
- **Share** → native share sheet (text format)

### Interactions
| # | Element | Event | API | On Success |
|---|---------|-------|-----|------------|
| 1 | — (on mount) | auto | GET /meal-plans/:id/shopping | Render grouped list |
| 2 | Swipe right | onSwipe | PATCH /shopping/:itemId { checked: true } | Green check + strikethrough + haptic |
| 3 | Swipe left | onSwipe | DELETE /shopping/:itemId | Remove row (animated) |
| 4 | Tap checkbox | onPress | Same as #2 toggle | Toggle check |
| 5 | "📤 Chia sẻ" | onPress | — | Share.share({ message: formatted list }) |
| 6 | Pull down | onRefresh | Refetch | Reload list |

---

## M-S25: CreatePlanScreen

```
┌──────────────────────────┐
│░░░░░░ Status Bar ░░░░░░░│
├──────────────────────────┤
│ [←]  Tạo thực đơn mới   │
├──────────────────────────┤
│                          │
│  Tuần bắt đầu:          │
│  ┌──────────────────────┐│
│  │ [←] T2, 31/3/2026 [→]││
│  └──────────────────────┘│
│  (tap → native date picker│
│   bottom sheet)          │
│                          │
│  ── Tùy chọn ──         │
│                          │
│  ☐ Ưu tiên món nấu nhanh│
│    (< 30 phút)          │
│                          │
│  ☐ Bao gồm bữa phụ     │
│                          │
│  ── Mục tiêu dinh dưỡng │
│  (lấy từ profile)        │
│                          │
│  🔥 2,000 kcal/ngày     │
│  💪 120g protein         │
│  [Thay đổi mục tiêu →]  │
│                          │
│                          │
│  ┌──────────────────────┐│
│  │  🍳 Tạo thực đơn    ││
│  │  (primary, 48pt)     ││
│  └──────────────────────┘│
│                          │
└──────────────────────────┘

   ═══ LOADING ═══

┌──────────────────────────┐
│                          │
│                          │
│     🍳 (Lottie anim)    │
│                          │
│  "Đang tạo thực đơn..." │
│                          │
│  AI đang chọn 21 món    │
│  phù hợp với khẩu vị    │
│  và dinh dưỡng của bạn  │
│                          │
│  ████████████░░░░ 60%    │
│                          │
│                          │
└──────────────────────────┘
```

### Mobile-Specific
- **Date picker:** Native bottom sheet (iOS DatePicker / Android Material)
- **Loading:** Lottie animation (cooking), full-screen, 2-5s
- **Timeout:** 10s → "Mất nhiều thời gian hơn..." + retry

### Interactions
| # | Element | Event | API | On Success |
|---|---------|-------|-----|------------|
| 1 | Date picker [←][→] | onPress | — | Change weekStart ±7 days |
| 2 | Date picker tap | onPress | — | Open native date picker |
| 3 | Checkbox "Nhanh" | onPress | — | Toggle preference |
| 4 | Checkbox "Bữa phụ" | onPress | — | Toggle preference |
| 5 | "Thay đổi mục tiêu" | onPress | — | Navigate → S29 |
| 6 | "Tạo thực đơn" | onPress | POST /meal-plans { weekStart, preferences } | Loading screen → navigate S21 Plan Detail |
| 7 | Loading timeout 10s | auto | — | Show "Thử lại?" button |

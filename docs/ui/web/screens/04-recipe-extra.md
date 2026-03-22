# Flow 4 Addendum: S16 Cooking Mode + S17 Nutrition Detail + S19 Search — SDD

Bổ sung cho `04-recipe.md` đã có S14, S15, S18.

---

## S16 — Cooking Mode Screen

### Mục đích
Step-by-step cooking guide với timer, keep-screen-on, voice-friendly layout.

### Layout
```
┌──────────────────────────────────┐
│ ✕ Close              Step 3/8   │
│──────────────────────────────────│
│ [ ═══════●══════════ ] 3/8     │
│──────────────────────────────────│
│                                  │
│  ┌──────────────────────────┐   │
│  │ 📸 Step Image (optional)  │   │
│  │ Full width, 200px height  │   │
│  └──────────────────────────┘   │
│                                  │
│  "Cho thịt vào chảo đã nóng    │
│   dầu, đảo đều trên lửa lớn   │
│   trong 3 phút cho thịt chín   │
│   se mặt ngoài."               │
│                                  │
│  text-body-lg, 20px line-height │
│  neutral-800                     │
│                                  │
│  ┌────────────────────┐         │
│  │  ⏱ TIMER: 03:00    │         │
│  │                    │         │
│  │  [ ▶ Bắt đầu ]    │         │
│  └────────────────────┘         │
│                                  │
│  ┌─ Nguyên liệu bước này ──┐   │
│  │ • Thịt bò: 200g          │   │
│  │ • Dầu ăn: 2 thìa         │   │
│  └──────────────────────────┘   │
│                                  │
│  [ ← Trước ] ──── [ Tiếp → ]   │
│                                  │
└──────────────────────────────────┘
```

### Timer Component
```
┌─────────────────────────────┐
│     ⏱  03:00               │
│                             │
│   ┌────────────────────┐    │
│   │  ▶ Bắt đầu        │    │  ← Chưa chạy: xanh dương
│   │  ⏸ Tạm dừng       │    │  ← Đang chạy: cam
│   │  ■ Dừng           │    │  ← Tạm dừng: xám
│   └────────────────────┘    │
│                             │
│   Alarm: 🔔 (rung + beep)  │
└─────────────────────────────┘
```

### Behavior
1. Keep screen on (Wakelock API for web, KeepAwake for RN)
2. Timer features:
   - Start / Pause / Reset
   - Alarm sound + vibration when done
   - Notification if app in background
3. Step navigation: ← → buttons + swipe (mobile)
4. Progress bar at top
5. Large font (20px+) for kitchen reading
6. Ingredient list relevant to current step only
7. "Hoàn thành" on last step → confetti + log to history

### Design
- Background: neutral-50 (easy on eyes)
- Timer: monospace font (JetBrains Mono), 48px
- Timer running: orange-500 accent
- Timer done: green pulse animation
- Step text: max 3-4 lines, large typeface

---

## S17 — Nutrition Detail Screen

### Mục đích
Chi tiết dinh dưỡng cho 1 recipe, có thể điều chỉnh servings.

### Layout
```
┌──────────────────────────────────┐
│ ← Dinh dưỡng          🔢 Phần  │
│──────────────────────────────────│
│                                  │
│  Phở Bò Hà Nội                  │
│  text-h2, neutral-800           │
│                                  │
│  Số phần: [ − ]  4  [ + ]      │
│                                  │
│  ┌─ Tổng quan ─────────────┐   │
│  │ 🔥 Calories    520 kcal  │   │
│  │ 💪 Protein     32g       │   │
│  │ 🌾 Carbs       65g       │   │
│  │ 🧈 Fat         14g       │   │
│  │ 🥬 Fiber       4g        │   │
│  │ 🧂 Sodium      980mg     │   │
│  └──────────────────────────┘   │
│                                  │
│  ┌─ So với mục tiêu ───────┐   │
│  │ Calo  ████████░░ 26%     │   │
│  │ Prot  █████████░ 27%     │   │
│  │ Carb  ███████░░░ 24%     │   │
│  │ Fat   ████░░░░░░ 22%     │   │
│  └──────────────────────────┘   │
│                                  │
│  ── Theo nguyên liệu ──────    │
│  ┌────────────────────────┐     │
│  │ Bún phở   │ 280 kcal   │     │
│  │ Thịt bò   │ 180 kcal   │     │
│  │ Nước dùng │ 45 kcal    │     │
│  │ Rau sống  │ 15 kcal    │     │
│  └────────────────────────┘     │
│                                  │
│  ⚠ Sodium cao — hạn chế muối   │
│                                  │
└──────────────────────────────────┘
```

### Behavior
- Servings ± → auto-recalculate tất cả macro
- "So với mục tiêu" → so sánh với NutritionGoal / 3 (per meal)
- Color coding: green ≤ 100%, yellow 100-120%, red > 120%
- Breakdown by ingredient → tap để xem nutrition per ingredient
- Warning badges: high sodium, high sugar, high calorie

---

## S19 — Search Results Screen

### Mục đích
Tìm kiếm nâng cao với multiple filters.

### Layout
```
┌──────────────────────────────────┐
│ 🔍 [   phở                   ]  │
│──────────────────────────────────│
│ ┌─ Filters ────────────────┐    │
│ │ [Miền Bắc ✓] [Dễ] [🕐≤30]│    │
│ │ [Chay] [Keto] [Bữa sáng] │    │
│ │ [Xóa bộ lọc]              │    │
│ └────────────────────────────┘   │
│                                  │
│  12 kết quả cho "phở"          │
│                                  │
│  Sắp xếp: [Phổ biến ▾]        │
│                                  │
│  ┌────────┐ ┌────────┐         │
│  │ Phở bò │ │ Phở gà │         │
│  │ Hà Nội │ │ Nam Định│         │
│  │ ⏱45 🔥520│ ⏱30 🔥380│        │
│  └────────┘ └────────┘         │
│  ┌────────┐ ┌────────┐         │
│  │ Phở    │ │ Phở    │         │
│  │ cuốn   │ │ xào    │         │
│  └────────┘ └────────┘         │
│                                  │
│  (infinite scroll)              │
│                                  │
│  ┌─ Empty state ────────────┐   │
│  │ 🔍 Không tìm thấy        │   │
│  │ Thử tìm "bún" hoặc       │   │
│  │ bỏ bớt bộ lọc            │   │
│  └──────────────────────────┘   │
│                                  │
└──────────────────────────────────┘
```

### Filters Available
| Filter | Type | Options |
|--------|------|---------|
| `cuisine` | Multi-select chips | Bắc, Trung, Nam, Quốc tế |
| `mealType` | Multi-select chips | Sáng, Trưa, Tối, Snack |
| `difficulty` | Single-select | Dễ, Trung bình, Khó |
| `maxCookTime` | Slider / chips | ≤15, ≤30, ≤60, >60 phút |
| `dietType` | Single-select | Thường, Chay, Keto, Low-carb |
| `maxCalories` | Slider | 0 → 1000 kcal |

### Behavior
- Debounce search: 300ms
- Filters collapsible on mobile
- Sort options: Phổ biến, Mới nhất, Thời gian nấu, Calo
- Infinite scroll pagination (pageSize=20)
- Empty state with suggestions
- History: recent searches (last 10, stored locally)

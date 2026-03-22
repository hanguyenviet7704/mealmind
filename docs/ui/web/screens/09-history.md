# Flow 9: Cooking History & Stats — SDD

---

## S38 — Cooking History Screen

### Mục đích
Xem lại tất cả món đã nấu, đánh giá, thống kê bếp.

### Layout
```
┌──────────────────────────────────┐
│ ← Lịch sử nấu ăn         📊   │
│──────────────────────────────────│
│                                  │
│  ┌─ Stats Banner ───────────┐   │
│  │ 🍳 87 món          📅 45 ngày│
│  │ ⭐ 4.2 TB          🔥 Streak: 7│
│  │ gradient bg: orange-50    │   │
│  └──────────────────────────┘   │
│                                  │
│  ┌─ Filter Tabs ────────────┐   │
│  │ [Tất cả] [Tuần này]     │   │
│  │ [Tháng này] [Yêu thích]  │   │
│  └──────────────────────────┘   │
│                                  │
│  ── Hôm nay, 21/03 ─────────   │
│  ┌──────────────────────────┐   │
│  │ 🌅 Sáng: Phở bò Hà Nội  │   │
│  │   ⭐⭐⭐⭐⭐  520 kcal       │   │
│  │──────────────────────────│   │
│  │ ☀ Trưa: Cơm tấm sườn    │   │
│  │   ⭐⭐⭐⭐☆  650 kcal       │   │
│  └──────────────────────────┘   │
│                                  │
│  ── Hôm qua, 20/03 ─────────   │
│  ┌──────────────────────────┐   │
│  │ 🌅 Sáng: Bánh mì trứng  │   │
│  │   ⭐⭐⭐☆☆  380 kcal       │   │
│  │──────────────────────────│   │
│  │ ☀ Trưa: Bún chả Hà Nội  │   │
│  │   ⭐⭐⭐⭐⭐  480 kcal       │   │
│  │──────────────────────────│   │
│  │ 🌙 Tối: Canh chua cá    │   │
│  │   ⭐⭐⭐⭐☆  350 kcal       │   │
│  └──────────────────────────┘   │
│                                  │
│  ── 19/03 ───────────────────   │
│  ... (infinite scroll)           │
│                                  │
└──────────────────────────────────┘
```

### Stats Banner Detail
| Stat | Source |
|------|--------|
| Tổng món đã nấu | count(interactions where action=cook) |
| Số ngày nấu | distinct dates |
| Đánh giá TB | avg(rating) from meal_logs |
| Streak | consecutive days with cook action |

### Item Tap → Recipe Detail (S15)

### 📊 Icon → Stats View
```
┌──────────────────────────────────┐
│ ← Thống kê nấu ăn              │
│──────────────────────────────────│
│                                  │
│  ── Vùng miền hay nấu ─────    │
│  ┌──────────────────────────┐   │
│  │ Bắc   ████████████ 45%   │   │
│  │ Nam   ██████████   35%   │   │
│  │ Trung ████         15%   │   │
│  │ QT    ██           5%    │   │
│  └──────────────────────────┘   │
│                                  │
│  ── Dinh dưỡng trung bình ──   │
│  ┌──────────────────────────┐   │
│  │ Calo  1,850 / 2,000 kcal │   │
│  │ Protein 95 / 120g         │   │
│  │ Carbs   230 / 250g        │   │
│  │ Fat     55 / 65g          │   │
│  └──────────────────────────┘   │
│                                  │
│  ── Top 5 món nấu nhiều nhất ── │
│  1. Phở bò (12 lần)             │
│  2. Cơm tấm (9 lần)             │
│  3. Bún chả (7 lần)             │
│  4. Canh chua (6 lần)           │
│  5. Cá kho (5 lần)              │
│                                  │
│  ── Cooking Streak ─────────    │
│  🔥🔥🔥🔥🔥🔥🔥 7 ngày liên tiếp    │
│  Kỷ lục: 14 ngày               │
│                                  │
└──────────────────────────────────┘
```

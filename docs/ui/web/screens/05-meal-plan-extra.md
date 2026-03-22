# Flow 5 Addendum: S24 Shopping List + S25 Create Plan Wizard — SDD

Bổ sung cho `05-meal-plan.md` đã có S20–S23.

---

## S24 — Shopping List Screen

### Mục đích
Tự động tạo danh sách đi chợ từ meal plan, gom nguyên liệu trùng.

### Layout
```
┌──────────────────────────────────┐
│ ← Danh sách đi chợ       📤    │
│──────────────────────────────────│
│                                  │
│  Tuần 24/03 – 30/03             │
│  21 món · 48 nguyên liệu        │
│                                  │
│  ┌─ Filter ────────────────┐    │
│  │ [Tất cả ✓] [Chưa mua]  │    │
│  │ [Đã mua] [Theo loại]    │    │
│  └──────────────────────────┘   │
│                                  │
│  🥩 PROTEIN (12 items)          │
│  ┌──────────────────────────┐   │
│  │ ☐ Thịt bò      │ 800g   │   │
│  │ ☐ Thịt gà      │ 600g   │   │
│  │ ☑ Tôm sú       │ 400g   │   │ ← checked = đã mua
│  │ ☐ Cá basa      │ 500g   │   │
│  │ ☐ Trứng gà     │ 12 quả │   │
│  │ ☐ Đậu phụ      │ 400g   │   │
│  └──────────────────────────┘   │
│                                  │
│  🥬 RAU CỦ (18 items)          │
│  ┌──────────────────────────┐   │
│  │ ☐ Hành tây     │ 300g   │   │
│  │ ☐ Cà chua      │ 500g   │   │
│  │ ☐ Rau muống    │ 400g   │   │
│  │ ... more                  │   │
│  └──────────────────────────┘   │
│                                  │
│  🧂 GIA VỊ (8 items)           │
│  ┌──────────────────────────┐   │
│  │ ☐ Nước mắm     │ 100ml  │   │
│  │ ☐ Dầu ăn      │ 200ml  │   │
│  └──────────────────────────┘   │
│                                  │
│  🌾 NGŨ CỐC (5 items)          │
│  └──────────────────────────┘   │
│                                  │
│  🥛 KHÁC (5 items)              │
│  └──────────────────────────┘   │
│                                  │
│  ── Tổng ước tính ──────────    │
│  💰 ~350,000₫                   │
│                                  │
│  [ 📤 Chia sẻ danh sách ]      │
│                                  │
└──────────────────────────────────┘
```

### Behavior
1. Auto-generate từ all recipes in meal plan
2. Gom nguyên liệu trùng (cùng ingredient → cộng quantity)
3. Group by `IngredientCategory`: protein, vegetable, grain, seasoning, etc.
4. Check/uncheck → persist locally (localStorage)
5. "Chia sẻ" → copy text format hoặc share sheet
6. Ước tính giá: sum(`avg_price_per_kg × quantity`)
7. Exclude `isOptional` ingredients (show separately)
8. Handle unit conversion (thìa → ml, quả → g)

### Share Format (text)
```
🛒 Đi chợ tuần 24/03:
🥩 Protein:
- Thịt bò: 800g
- Tôm sú: 400g
🥬 Rau:
- Hành tây: 300g
...
```

### Empty State
```
🛒 Chưa có thực đơn tuần này
[Tạo thực đơn]
```

---

## S25 — Create Meal Plan Wizard

### Mục đích
Flow tạo meal plan mới — chọn tuần, preferences, generate.

### Layout — 3 Steps
```
Step 1: Chọn tuần
┌──────────────────────────────────┐
│ ← Tạo thực đơn          1/3    │
│ [ ════●═══════════════ ]        │
│──────────────────────────────────│
│                                  │
│  📅 Chọn tuần bắt đầu          │
│                                  │
│  ┌─ Calendar Picker ────────┐   │
│  │     Tháng 3, 2026        │   │
│  │  T2  T3  T4  T5  T6  T7  CN │
│  │  ...                     │   │
│  │  [24] 25  26  27  28  29  30 │
│  │  [31] ...                │   │
│  └──────────────────────────┘   │
│                                  │
│  Tuần: 24/03 – 30/03           │
│  7 ngày × 3 bữa = 21 món       │
│                                  │
│  [ Tiếp theo → ]                │
│                                  │
└──────────────────────────────────┘

Step 2: Tùy chỉnh
┌──────────────────────────────────┐
│ ← Tạo thực đơn          2/3    │
│ [ ═══════════●═════════ ]       │
│──────────────────────────────────│
│                                  │
│  ⚙ Tùy chỉnh thực đơn         │
│                                  │
│  Profile: [Cả gia đình ▾]      │
│                                  │
│  Ưu tiên:                       │
│  ☐ Ưu tiên món mới             │
│  ☑ Không lặp lại trong tuần    │
│  ☐ Ưu tiên món nhanh (< 30p)   │
│                                  │
│  Bỏ qua bữa nào?               │
│  ☐ Sáng thứ 7, CN (ăn ngoài)  │
│  ☐ Trưa (mang cơm văn phòng)   │
│                                  │
│  Ngân sách/tuần:                │
│  [ 500,000₫ ────●───── 2,000K ] │
│                                  │
│  [ ← Quay lại ] [ Tiếp → ]     │
│                                  │
└──────────────────────────────────┘

Step 3: Generating
┌──────────────────────────────────┐
│   Tạo thực đơn           3/3    │
│ [ ═══════════════════●═ ]       │
│──────────────────────────────────│
│                                  │
│  ✨ Đang tạo thực đơn...       │
│                                  │
│  ┌──────────────────────────┐   │
│  │   🍳 → 🥗 → 🍲           │   │
│  │   (loading animation)    │   │
│  │                          │   │
│  │  "Đang phân tích sở      │   │
│  │   thích của bạn..."      │   │
│  │                          │   │
│  │  "Chọn món phù hợp       │   │
│  │   dinh dưỡng..."         │   │
│  │                          │   │
│  │  "Hoàn thành! ✓"        │   │
│  └──────────────────────────┘   │
│                                  │
│  → Auto navigate to S21         │
│    (Meal Plan Detail)            │
│                                  │
└──────────────────────────────────┘
```

### Behavior
1. Step 1: Calendar chỉ cho chọn ngày thứ 2 (weekStart)
2. Step 2: Profile switcher, preference toggles
3. Step 3: Call POST /meal-plans → loading 3-5s → navigate
4. Draft limit check: max 3 drafts → show warning
5. Back button: xác nhận "Hủy tạo thực đơn?"

### Loading Messages (cycle every 2s)
```
"Đang phân tích sở thích của bạn..."
"Chọn món phù hợp dinh dưỡng..."
"Cân bằng vùng miền cho cả tuần..."
"Kiểm tra dị ứng và chế độ ăn..."
"Hoàn thành! ✓"
```

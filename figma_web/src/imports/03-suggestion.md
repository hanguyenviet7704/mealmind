# Flow 3: Home & Suggestion Screens

## S10: Home (Suggestions)

**Route:** `/` | `HomeScreen`
**Tab:** Home (active)

```
┌──────────────────────────────────────┐
│ [NavBar / StatusBar]                 │
├──────────────────────────────────────┤
│                                      │
│  "Chào buổi trưa, Lan!"             │
│  🌤️ TP.HCM, 28°C                   │
│                                      │
│  ── Profile ──                       │
│  [👩Lan ✓] [👦Bảo] [👧Mai] [👨‍👩‍👧‍👦GĐ]   │
│                                      │
│  ── Bữa ──                          │
│  [Sáng] [●Trưa] [Tối] [Phụ]        │
│  (auto-select theo giờ hiện tại)     │
│                                      │
│  ┌────────────────────────────────┐  │
│  │                                │  │
│  │     [Ảnh cơm tấm sườn]       │  │
│  │                                │  │
│  │  Cơm tấm sườn nướng           │  │
│  │  ⏱ 30 phút · 🔥 550 kcal     │  │
│  │  [Miền Nam] [Dễ]              │  │
│  │                                │  │
│  │  💡 "Món quen thuộc miền      │  │
│  │     Nam, nấu nhanh cho        │  │
│  │     buổi trưa bận rộn"        │  │
│  │                                │  │
│  │  [Nhanh gọn] [Comfort food]   │  │
│  │                                │  │
│  │  [✗ Bỏ qua]       [♥ Chọn]   │  │
│  │                                │  │
│  │  ← swipe left    swipe right → │  │
│  └────────────────────────────────┘  │
│                                      │
│  ●○○○○ (5 cards indicator)          │
│                                      │
│  ┌──────────────┐ ┌──────────────┐  │
│  │ 🎲 Surprise  │ │ 🍱 Combo    │  │
│  │    me!       │ │  bữa ăn     │  │
│  └──────────────┘ └──────────────┘  │
│                                      │
│  Gợi ý hôm nay: 47/50 (Free)        │
│  [⭐ Nâng cấp Pro — không giới hạn] │
│                                      │
├──────────────────────────────────────┤
│ [●Home] [Món ăn] [Thực đơn] [Cá nhân]│
└──────────────────────────────────────┘
```

### Card Stack Behavior (Mobile)
- 5 cards stacked, only top card fully visible
- Peek next card 8px behind
- Swipe right → green overlay + ✓ → accept → track `cook` interaction
- Swipe left → red overlay + ✗ → skip → track `skip` interaction
- Velocity threshold: 0.5 → trigger, else bounce back
- Haptic feedback on trigger

### Card Stack Behavior (Web)
- Cards displayed as carousel hoặc vertical list
- Buttons "Bỏ qua" (ghost) + "Chọn" (primary) thay swipe
- Keyboard: ← skip, → accept, Enter accept

### Auto Meal Type Detection
| Giờ | Auto-select |
|-----|-------------|
| 05:00-10:00 | Sáng |
| 10:00-14:00 | Trưa |
| 14:00-17:00 | Phụ |
| 17:00-22:00 | Tối |
| 22:00-05:00 | Phụ |

### When All Cards Swiped
```
│  ┌────────────────────────────────┐  │
│  │         [Empty State]          │  │
│  │                                │  │
│  │      🍽️ (icon lớn)            │  │
│  │                                │  │
│  │  "Bạn đã xem hết gợi ý!"     │  │
│  │                                │  │
│  │  [🔄 Xem thêm gợi ý]        │  │
│  │  [🎲 Thử Surprise me!]       │  │
│  └────────────────────────────────┘  │
```

### Data Flow
```
Mount → GET /suggestions?mealType={auto}
        → TanStack Query key: ['suggestions', { mealType, profileId }]

Swipe → Batch interactions locally
        → Every 30s OR 10 events: POST /interactions { interactions[] }

Change meal type tab → invalidate + refetch suggestions
Change profile → invalidate + refetch suggestions
```

---

## S11: Combo Suggestion

**Route:** `/combo` | `ComboScreen`
**Entry:** Tap "🍱 Combo bữa ăn" trên Home

```
┌──────────────────────────────────────┐
│ [← Home]        Combo bữa trưa      │
├──────────────────────────────────────┤
│                                      │
│  "Combo bữa trưa cho 2 người"       │
│  Tổng: 🔥 1,050 kcal                │
│                                      │
│  ── Món chính ──                     │
│  ┌────────────────────────────────┐  │
│  │ [Ảnh] Cá kho tộ               │  │
│  │ ⏱ 40p · 🔥 380 kcal · Miền Nam│  │
│  │                     [🔄 Đổi]  │  │
│  └────────────────────────────────┘  │
│                                      │
│  ── Canh ──                          │
│  ┌────────────────────────────────┐  │
│  │ [Ảnh] Canh chua cá lóc        │  │
│  │ ⏱ 25p · 🔥 180 kcal          │  │
│  │                     [🔄 Đổi]  │  │
│  └────────────────────────────────┘  │
│                                      │
│  ── Rau ──                           │
│  ┌────────────────────────────────┐  │
│  │ [Ảnh] Rau muống xào tỏi       │  │
│  │ ⏱ 10p · 🔥 120 kcal          │  │
│  │                     [🔄 Đổi]  │  │
│  └────────────────────────────────┘  │
│                                      │
│  ── Tráng miệng ──                  │
│  ┌────────────────────────────────┐  │
│  │ [Ảnh] Chè đậu xanh            │  │
│  │ ⏱ 30p · 🔥 150 kcal          │  │
│  │                     [🔄 Đổi]  │  │
│  └────────────────────────────────┘  │
│                                      │
│  ─────────────────────────────────── │
│  Dinh dưỡng tổng combo:              │
│  🔥 1,050 kcal                       │
│  💪 Protein: 65g                     │
│  🍚 Carbs: 95g                      │
│  🧈 Fat: 35g                        │
│                                      │
│  ┌────────────────────────────────┐  │
│  │    [✓ Chọn combo này]         │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │    [🔄 Đổi toàn bộ combo]    │  │
│  └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘
```

### "Đổi" 1 món
Tap "🔄 Đổi" → Bottom sheet / Modal:
```
┌────────────────────────────────────┐
│ Đổi món chính                [✕]  │
├────────────────────────────────────┤
│                                    │
│  ┌──────┐  Gà kho gừng            │
│  │ [Ảnh]│  ⏱ 35p · 🔥 350 kcal   │
│  └──────┘  [Chọn]                  │
│                                    │
│  ┌──────┐  Thịt kho trứng         │
│  │ [Ảnh]│  ⏱ 45p · 🔥 420 kcal   │
│  └──────┘  [Chọn]                  │
│                                    │
│  ┌──────┐  Đậu hũ sốt cà chua     │
│  │ [Ảnh]│  ⏱ 20p · 🔥 280 kcal   │
│  └──────┘  [Chọn]                  │
│                                    │
└────────────────────────────────────┘
```

### API
```
GET  /suggestions/combo?mealType=lunch&servings=2
POST /suggestions/combo/swap { comboId, role: 'main', excludeRecipeId }
```

### Data
```typescript
TanStack Query: ['suggestions', 'combo', { mealType, servings }]
```

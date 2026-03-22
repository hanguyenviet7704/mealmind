# Mobile Screens: Recipe Extra (S16, S17, S19)

File `03-main.md` đã có M-S14 (List) + M-S15 (Detail) + M-S18 (Bookmarks). File này bổ sung còn thiếu.

---

## M-S16: CookingModeScreen

```
┌──────────────────────────┐
│░░░░░░ Status Bar ░░░░░░░│
├──────────────────────────┤
│ [✕ Thoát]    Bước 3/8   │
│ ═══════●═════════════    │
├──────────────────────────┤
│                          │
│  ┌──────────────────────┐│
│  │                      ││
│  │   [Step Image]       ││
│  │   full width         ││
│  │   auto height        ││
│  │                      ││
│  └──────────────────────┘│
│                          │
│  "Cho thịt vào chảo đã  │
│   nóng dầu, đảo đều     │
│   trên lửa lớn trong    │
│   3 phút cho thịt chín  │
│   se mặt ngoài."        │
│                          │
│  (text 22pt, high        │
│   contrast, line-h 1.8)  │
│                          │
│  ┌──────────────────────┐│
│  │      ⏱ 03:00         ││
│  │   (56pt monospace)    ││
│  │                      ││
│  │  [▶ Bắt đầu timer]  ││
│  │  (48pt touch target) ││
│  └──────────────────────┘│
│                          │
│  ← Swipe    Swipe →     │
│                          │
│  [← Trước]   [Tiếp →]   │
│                          │
└──────────────────────────┘

   ═══ TIMER RUNNING ═══

│  ┌──────────────────────┐│
│  │      ⏱ 02:45         ││
│  │   (đang đếm ngược)   ││
│  │                      ││
│  │  [⏸ Tạm dừng]       ││
│  └──────────────────────┘│

   ═══ TIMER DONE ═══

│  ┌──────────────────────┐│
│  │   ✅ Hết giờ!        ││
│  │   🔔 (vibrate+sound) ││
│  │                      ││
│  │  [Tiếp tục →]        ││
│  └──────────────────────┘│
```

### Mobile-Specific
- **Keep Awake:** `expo-keep-awake` — màn hình không tắt
- **Step navigation:** Swipe left/right HOẶC buttons
- **Timer:** Background counting + local push notification khi xong
- **Font:** 22pt body (lớn hơn bình thường — đọc trong bếp)
- **Orientation:** Support landscape cho tablet
- **Shake to pause:** Shake device → pause timer

### Interactions
| # | Element | Event | API | On Success |
|---|---------|-------|-----|------------|
| 1 | [✕ Thoát] | onPress | — | Confirm "Thoát cooking mode?" → back to S15 |
| 2 | Swipe left | onSwipe | — | Next step (if exists) |
| 3 | Swipe right | onSwipe | — | Previous step (if exists) |
| 4 | [← Trước] | onPress | — | Previous step |
| 5 | [Tiếp →] | onPress | — | Next step. Last step → "Hoàn thành! Đánh giá?" → S42 |
| 6 | [▶ Bắt đầu] | onPress | — | Start countdown + haptic + schedule notification |
| 7 | [⏸ Tạm dừng] | onPress | — | Pause timer |
| 8 | Timer = 0 | auto | — | Vibration + sound + push notification + show "Hết giờ" |
| 9 | Shake | onShake | — | Pause/resume timer |

---

## M-S17: NutritionDetailScreen

```
┌──────────────────────────┐
│░░░░░░ Status Bar ░░░░░░░│
├──────────────────────────┤
│ [←]  Dinh dưỡng         │
│       Phở bò Hà Nội     │
├──────────────────────────┤
│                          │
│  Số người: [−] 2 [+]    │
│                          │
│  ┌──────────────────────┐│
│  │    🔥 450 kcal       ││
│  │                      ││
│  │   [Pie Chart 120pt]  ││
│  │   P:31% C:38% F:31%  ││
│  └──────────────────────┘│
│                          │
│  💪 Protein    35.2g     │
│  ████████████████░░ 70%  │
│                          │
│  🍚 Carbs      42.8g    │
│  ██████████████░░░░ 53%  │
│                          │
│  🧈 Fat        15.3g    │
│  ██████████░░░░░░░░ 33%  │
│                          │
│  🥬 Fiber       4.6g    │
│  ██████░░░░░░░░░░░░ 18%  │
│                          │
│  🧂 Sodium     680mg    │
│                          │
│  ⚠ Một số giá trị ước   │
│    tính                  │
│                          │
│  ── Chi tiết nguyên liệu│
│                          │
│  ▾ Ức gà (200g)         │
│    280kcal · P:52g C:0g  │
│  ▾ Bánh phở (400g)      │
│    240kcal · P:4g C:54g  │
│  ▸ Hành tây (100g)      │
│  ▸ Nước mắm (45ml)      │
│  ...                     │
│                          │
└──────────────────────────┘
```

### Mobile-Specific
- **Pie chart:** `react-native-chart-kit` hoặc `victory-native`
- **Servings stepper:** Larger touch targets (48pt buttons)
- **NutritionBar:** Full width, colored fill
- **Ingredient breakdown:** Expandable accordion

### Interactions
| # | Element | Event | API | On Success |
|---|---------|-------|-----|------------|
| 1 | — (on mount) | auto | GET /recipes/:id/nutrition?servings=2 | Render chart + bars |
| 2 | [−] serving | onPress | GET .../nutrition?servings={n-1} | Recalc all values |
| 3 | [+] serving | onPress | GET .../nutrition?servings={n+1} | Recalc all values |
| 4 | Ingredient row | onPress | — | Expand/collapse detail |

---

## M-S19: SearchScreen

```
┌──────────────────────────┐
│░░░░░░ Status Bar ░░░░░░░│
├──────────────────────────┤
│ ┌──────────────────────┐ │
│ │ 🔍 phở bò         [✕]│ │
│ └──────────────────────┘ │
│ (keyboard auto-open)     │
├──────────────────────────┤
│                          │
│  Filter: [Vùng miền ▾]  │
│  [Bữa ▾] [Độ khó ▾]    │
│                          │
│  15 kết quả cho "phở bò"│
│                          │
│  ┌──────────────────────┐│
│  │ [Ảnh] Phở bò Hà Nội ││
│  │ ⏱45p · 🔥450 · [Bắc]││
│  │                 [♡]  ││
│  └──────────────────────┘│
│  ┌──────────────────────┐│
│  │ [Ảnh] Phở bò Nam Định││
│  │ ⏱50p · 🔥480 · [Bắc]││
│  │                 [♡]  ││
│  └──────────────────────┘│
│  ┌──────────────────────┐│
│  │ [Ảnh] Phở bò tái lăn││
│  │ ⏱35p · 🔥420 · [Bắc]││
│  │                 [♡]  ││
│  └──────────────────────┘│
│                          │
│  (scroll to load more)   │
│                          │
├──────────────────────────┤
│ [🏠][●📖][📅][👤]       │
└──────────────────────────┘

   ═══ EMPTY RESULT ═══

│  🔍 (icon lớn)          │
│  "Không tìm thấy"       │
│  "Thử từ khóa khác hoặc │
│   bỏ bớt filter"        │
│  [Xóa filter]           │

   ═══ RECENT SEARCHES ═══
   (hiện khi input trống)

│  Tìm kiếm gần đây:      │
│  [phở bò ✕] [bún chả ✕] │
│  [cơm tấm ✕]            │
│                          │
│  Phổ biến:              │
│  [Phở] [Bún] [Cơm]     │
│  [Lẩu] [Canh]          │
```

### Mobile-Specific
- **Search bar:** Auto-focus + keyboard opens immediately
- **Recent searches:** Lưu trong AsyncStorage (max 10)
- **Filter chips:** Tap → ActionSheet per filter
- **Results:** Single column FlatList (full-width cards)
- **Debounce:** 300ms
- **Vietnamese search:** "pho" → match "Phở bò" (Meilisearch typo tolerance)

### Interactions
| # | Element | Event | API | On Success |
|---|---------|-------|-----|------------|
| 1 | Search input | onChangeText (debounce 300ms) | GET /recipes?q={value} | Update results |
| 2 | [✕] clear | onPress | — | Clear input, show recent searches |
| 3 | Recent search chip | onPress | — | Set input value → trigger search |
| 4 | Recent [✕] | onPress | — | Remove from recent (AsyncStorage) |
| 5 | Filter chip | onPress | — | Open ActionSheet |
| 6 | ActionSheet item | onPress | GET /recipes?q=&cuisine={} | Update results |
| 7 | Result card | onPress | — | Navigate → S15 |
| 8 | Bookmark ♡ | onPress | POST/DELETE bookmark | Toggle (optimistic) |
| 9 | Scroll bottom | onEndReached | GET ...&page=next | Append results |
| 10 | "Xóa filter" | onPress | GET /recipes?q={current} | Reset filters |

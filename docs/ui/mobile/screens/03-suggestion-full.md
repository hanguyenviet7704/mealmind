# Mobile Screens: Suggestion Flow (S10-S13)

Bổ sung S12, S13 — file `03-main.md` đã có S10, S11.

---

## M-S12: SurpriseScreen

```
┌──────────────────────────┐
│░░░░░░ Status Bar ░░░░░░░│
├──────────────────────────┤
│ [←]  Surprise Me!   🎲  │
├──────────────────────────┤
│                          │
│                          │
│  ┌──────────────────────┐│
│  │                      ││
│  │   🎰 Animation      ││
│  │   (spin → reveal)   ││
│  │                      ││
│  │   ┌────────────────┐ ││
│  │   │                │ ││
│  │   │ [Ảnh full]     │ ││
│  │   │  280pt height  │ ││
│  │   │                │ ││
│  │   │ Phở bò Hà Nội  │ ││
│  │   │ ⏱45p · 🔥520   │ ││
│  │   │ [Miền Bắc][TB] │ ││
│  │   │                │ ││
│  │   │ 💡"Thử món miền│ ││
│  │   │   Bắc nhé!"    │ ││
│  │   └────────────────┘ ││
│  │                      ││
│  └──────────────────────┘│
│                          │
│  ┌──────────────────────┐│
│  │   🍳 Nấu món này!   ││
│  │   (primary, 48pt)   ││
│  └──────────────────────┘│
│                          │
│  ┌──────────────────────┐│
│  │   🎲 Thử lại        ││
│  │   (secondary, 48pt) ││
│  └──────────────────────┘│
│                          │
│  "Shake phone để thử    │
│   lại! 📱"              │
│                          │
└──────────────────────────┘
```

### Mobile-Specific
- **Shake gesture:** Accelerometer listener → trigger new surprise
- **Reveal animation:** 3D card flip (react-native-reanimated)
- **Haptic:** `notificationSuccess` on reveal
- **Entry:** Từ S10 Home → tap "🎲 Surprise me!"

### Components
| Component | Config |
|-----------|--------|
| Animation container | Lottie (slot machine) → RecipeCard (large) |
| `RecipeCard` | size=lg, showReason=true |
| `Button` primary | "🍳 Nấu món này!" → navigate S15 + track `cook` |
| `Button` secondary | "🎲 Thử lại" → re-spin animation |

### API
```
GET /suggestions/surprise?mealType={auto}&profileId={active}
TanStack Query: ['suggestions', 'surprise', { mealType }]
```

### Interactions
| # | Element | Event | API | On Success |
|---|---------|-------|-----|------------|
| 1 | — (on mount) | auto | GET /suggestions/surprise | Spin animation → reveal card |
| 2 | "Nấu món này!" | onPress | Queue `{ action: 'cook', source: 'surprise' }` | Navigate → S15 RecipeDetail |
| 3 | "Thử lại" | onPress | GET /suggestions/surprise (excludeIds) | Re-spin animation → new card |
| 4 | Shake phone | onShake | Same as #3 | Re-spin + haptic |
| 5 | [←] Back | onPress | — | Navigate back → S10 |

---

## M-S13: QuickCookScreen

```
┌──────────────────────────┐
│░░░░░░ Status Bar ░░░░░░░│
├──────────────────────────┤
│ [←]  Nấu nhanh ⚡       │
├──────────────────────────┤
│                          │
│  "Món nấu dưới 15 phút" │
│                          │
│  Bữa: [●Sáng][Trưa][Tối]│
│                          │
│  ── Gợi ý cho bạn ──    │
│                          │
│  ┌──────────────────────┐│
│  │ [Ảnh]                ││
│  │ Bánh mì trứng ốp la  ││
│  │ ⏱ 10p · 🔥 320kcal   ││
│  │ [Dễ] [Miền Nam]      ││
│  │ 💡"Nhanh gọn cho     ││
│  │   buổi sáng bận rộn" ││
│  │              [♡]     ││
│  └──────────────────────┘│
│                          │
│  ┌──────────────────────┐│
│  │ [Ảnh]                ││
│  │ Mì gói xào rau       ││
│  │ ⏱ 8p · 🔥 380kcal    ││
│  │ [Dễ] [Quốc tế]      ││
│  │              [♡]     ││
│  └──────────────────────┘│
│                          │
│  ┌──────────────────────┐│
│  │ [Ảnh]                ││
│  │ Salad trứng cá ngừ   ││
│  │ ⏱ 12p · 🔥 280kcal   ││
│  │ [Dễ] [Quốc tế]      ││
│  │              [♡]     ││
│  └──────────────────────┘│
│                          │
│  (scroll to load more)   │
│                          │
└──────────────────────────┘
```

### Mobile-Specific
- **FlatList** single column (khác recipe grid 2-col)
- **Auto meal type** từ giờ hiện tại
- **Pull-to-refresh**
- **Cards lớn hơn** (single column → full width card)

### Components
| Component | Config |
|-----------|--------|
| Meal type tabs | horizontal, auto-select |
| `RecipeCard` | size=md, layout=horizontal (ảnh trái + info phải), full width |
| `FlatList` | single column, onEndReached loadMore |

### API
```
GET /recipes?maxCookTime=15&mealType={auto}&sort=cook_time_asc&page=1
TanStack Query: ['recipes', 'quick-cook', { mealType, page }]
```

### Interactions
| # | Element | Event | API | On Success |
|---|---------|-------|-----|------------|
| 1 | — (on mount) | auto | GET /recipes?maxCookTime=15 | Render list |
| 2 | Meal type tab | onPress | Refetch with mealType | Update list |
| 3 | RecipeCard | onPress | — | Navigate → S15 |
| 4 | Bookmark ♡ | onPress | POST/DELETE bookmark | Toggle (optimistic) |
| 5 | Pull down | onRefresh | Refetch | Reset list |
| 6 | Scroll bottom | onEndReached | GET ...&page=next | Append cards |

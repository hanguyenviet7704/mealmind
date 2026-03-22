# Mobile Screens: Main App (Home, Recipe, Meal Plan, Profile)

## M-S10: HomeScreen

```
┌──────────────────────────┐
│░░░░░░ Status Bar ░░░░░░░│
├──────────────────────────┤
│                          │
│ "Chào buổi trưa, Lan!"  │
│ 🌤️ 28°C TP.HCM          │
│                          │
│ [👩✓][👦][👧][👨‍👩‍👧‍👦GĐ]     │
│                          │
│ [Sáng][●Trưa][Tối][Phụ] │
│                          │
│ ┌────────────────────────┐
│ │                        │
│ │   [Ảnh full width]    │
│ │                        │
│ │  Cơm tấm sườn nướng   │
│ │  ⏱30p · 🔥550kcal     │
│ │  [Miền Nam] [Dễ]      │
│ │                        │
│ │  💡"Món quen thuộc    │
│ │    miền Nam..."        │
│ │                        │
│ │  ← swipe   swipe →    │
│ └────────────────────────┘
│       ●○○○○              │
│                          │
│  [🎲Surprise] [🍱Combo] │
│                          │
│  47/50 gợi ý hôm nay    │
│                          │
├──────────────────────────┤
│[●🏠][📖][📅][👤]        │
└──────────────────────────┘
```

### Card Stack (Mobile Native)
- `react-native-deck-swiper` hoặc custom PanResponder/Reanimated
- Card size: full width - 32pt padding, height ~420pt
- Stack: 3 cards visible (top = full, 2nd = peek 8pt, 3rd = peek 4pt)
- Swipe threshold: translateX > 120pt OR velocity > 0.5
- Rotation on drag: ±15° max
- Overlay: green (right) / red (left) gradient

### Pull-to-Refresh
```
Kéo xuống → refresh suggestions (new batch)
RefreshControl tintColor: orange-500
```

---

## M-S11: ComboScreen

```
┌──────────────────────────┐
│░░░░░░ Status Bar ░░░░░░░│
├──────────────────────────┤
│ [←]  Combo bữa trưa     │
├──────────────────────────┤
│                          │
│ Tổng: 🔥 1,050 kcal     │
│                          │
│ ── Món chính ──          │
│ ┌────────────────────────┐
│ │[Ảnh] Cá kho tộ        │
│ │⏱40p 🔥380kcal  [🔄]  │
│ └────────────────────────┘
│                          │
│ ── Canh ──               │
│ ┌────────────────────────┐
│ │[Ảnh] Canh chua   [🔄] │
│ └────────────────────────┘
│                          │
│ ── Rau ──                │
│ ┌────────────────────────┐
│ │[Ảnh] Rau muống   [🔄] │
│ └────────────────────────┘
│                          │
│ ── Tráng miệng ──       │
│ ┌────────────────────────┐
│ │[Ảnh] Chè đậu    [🔄] │
│ └────────────────────────┘
│                          │
│ P:65g C:95g F:35g       │
│                          │
│ ┌────────────────────────┐
│ │   ✓ Chọn combo này    │
│ └────────────────────────┘
│ [🔄 Đổi toàn bộ]       │
│                          │
└──────────────────────────┘
```

### "Đổi" → Bottom Sheet (30%)
```
┌──────────────────────────┐
│         ── handle ──     │
│  Đổi món chính     [✕]  │
├──────────────────────────┤
│ [Ảnh] Gà kho gừng       │
│       ⏱35p 🔥350  [Chọn]│
│ [Ảnh] Thịt kho trứng    │
│       ⏱45p 🔥420  [Chọn]│
│ [Ảnh] Đậu hũ sốt cà    │
│       ⏱20p 🔥280  [Chọn]│
└──────────────────────────┘
```

---

## M-S14: RecipesScreen

```
┌──────────────────────────┐
│░░░░░░ Status Bar ░░░░░░░│
├──────────────────────────┤
│ ┌────────────────────────┐
│ │ 🔍 Tìm món ăn...      │
│ └────────────────────────┘
│ [Vùng miền▾][Bữa▾][Khó▾]│
│ (horizontal scroll chips)│
│                          │
│ 342 món · Sắp xếp [▾]   │
│                          │
│ ┌──────────┐┌──────────┐ │
│ │ [Ảnh]    ││ [Ảnh]    │ │
│ │ Phở bò   ││ Bún chả  │ │
│ │ ⏱45 🔥450││ ⏱30 🔥380│ │
│ │[Bắc] [♡] ││[Bắc] [♡]│ │
│ └──────────┘└──────────┘ │
│ ┌──────────┐┌──────────┐ │
│ │ [Ảnh]    ││ [Ảnh]    │ │
│ │ Cơm tấm  ││ Lẩu thái │ │
│ │ ⏱25 🔥520││ ⏱60 🔥380│ │
│ │[Nam] [♡] ││[QT]  [♡]│ │
│ └──────────┘└──────────┘ │
│                          │
│ (scroll to load more)    │
│                          │
├──────────────────────────┤
│[🏠][●📖][📅][👤]        │
└──────────────────────────┘
```

- 2 columns grid, `FlatList` with `numColumns={2}`
- Pull-to-refresh
- Filter chips: horizontal `ScrollView`
- Tap filter chip → ActionSheet (iOS) / Bottom Sheet (Android)

---

## M-S15: RecipeDetailScreen

```
┌──────────────────────────┐
│░░░ Status Bar (light) ░░░│
├──────────────────────────┤
│ ┌────────────────────────┐
│ │                        │
│ │   [Hero Image         │
│ │    full width,        │
│ │    250pt height]      │
│ │                        │
│ │  [←]            [♥][📤]│  ← floating buttons
│ └────────────────────────┘
│                          │
│ Phở bò Hà Nội           │
│ ⏱45p chuẩn bị + nấu    │
│ 🔥450kcal · ⭐TB         │
│ [Miền Bắc][Sáng][Tối]   │
│                          │
│ "Phở bò truyền thống..." │
│                          │
│ [●NL] [Cách nấu] [DD]  │
│ ═══════════════════════  │
│                          │
│ ── TAB NL ──             │
│ Số người: [−] 2 [+]     │
│                          │
│ ▾ Nguyên liệu chính     │
│ ☐ Bánh phở ........ 400g │
│ ☐ Thịt bò nạm ..... 200g│
│ ☐ Xương ống ....... 500g │
│                          │
│ ▾ Gia vị                │
│ ☐ Nước mắm ...... 3 tbsp│
│ ☐ Hoa hồi ......... 3   │
│                          │
│ ▸ Trang trí (4)         │
│                          │
│ ── TAB CÁCH NẤU ──      │
│ (khi chuyển tab)         │
│                          │
│ Bước 1/8                 │
│ [Ảnh bước 1]            │
│ "Rửa sạch xương bò..." │
│                          │
│ Bước 2/8                 │
│ [Ảnh bước 2]            │
│ "Cho xương vào nồi..."  │
│ [⏱ Timer: 3 giờ]       │
│                          │
│ ── TAB DD ──             │
│ 🔥 450kcal               │
│ [Pie chart nhỏ]         │
│ P:31% C:38% F:31%       │
│                          │
│ 💪 Protein 35.2g        │
│ ████████████░░░░ 70%    │
│ 🍚 Carbs 42.8g          │
│ ██████████░░░░░░ 53%    │
│ 🧈 Fat 15.3g            │
│ ████████░░░░░░░░ 33%    │
│                          │
└──────────────────────────┘
```

### Mobile-Specific
- Hero image: parallax scroll effect (image shrinks as scroll down)
- Back + bookmark + share: floating on hero image (white icons, dark shadow)
- Status bar: transparent/light on hero, revert to dark when scrolled past hero
- Timer: khi tap → start background timer + show notification
- Tabs: sticky below hero (not scroll away)
- Ingredient checkbox: tap entire row to toggle
- Pinch-to-zoom on hero image

### Timer Notification (Background)
```
[MealMind] ⏱ Hết giờ!
Hầm nước dùng — Phở bò Hà Nội
[Xem bước tiếp theo]
```

---

## M-S17: MealPlanScreen (List)

```
┌──────────────────────────┐
│░░░░░░ Status Bar ░░░░░░░│
├──────────────────────────┤
│  Thực đơn                │
├──────────────────────────┤
│                          │
│ ── Đang dùng ──          │
│ ┌────────────────────────┐
│ │📅 24/3 – 30/3         │
│ │[Active] · 21 món       │
│ │Avg 1,950 kcal/ngày    │
│ │                  [→]   │
│ └────────────────────────┘
│                          │
│ ── Nháp ──               │
│ ┌────────────────────────┐
│ │📅 31/3 – 6/4          │
│ │[Draft] · 15/21 món    │
│ │              [→]  [🗑]│
│ └────────────────────────┘
│                          │
│ ┌────────────────────────┐
│ │  [+ Tạo thực đơn mới] │
│ └────────────────────────┘
│                          │
├──────────────────────────┤
│[🏠][📖][●📅][👤]        │
└──────────────────────────┘
```

---

## M-S18: MealPlanDetailScreen

```
┌──────────────────────────┐
│░░░░░░ Status Bar ░░░░░░░│
├──────────────────────────┤
│ [←] 24/3-30/3   [Active▾]│
├──────────────────────────┤
│                          │
│ ← T2  T3  T4  T5  T6 → │
│ (horizontal scroll days) │
│                          │
│ ── T2 (24/3) ──         │
│                          │
│ Sáng                     │
│ ┌────────────────────────┐
│ │ 🔒 [Ảnh] Phở bò       │
│ │     ⏱45p  🔥450kcal   │
│ └────────────────────────┘
│                          │
│ Trưa                     │
│ ┌────────────────────────┐
│ │    [Ảnh] Cơm rang     │
│ │     ⏱20p  🔥520kcal   │
│ └────────────────────────┘
│                          │
│ Tối                      │
│ ┌────────────────────────┐
│ │    [Ảnh] Canh chua    │
│ │     ⏱25p  🔥380kcal   │
│ └────────────────────────┘
│                          │
│ Tổng ngày: 🔥1,350kcal  │
│ ████████████░░ 68%target │
│                          │
│[🔄Tạo lại][📤Share][📊] │
│                          │
└──────────────────────────┘
```

### Mobile Layout
- Day selector: horizontal scroll tabs (highlight selected day)
- Mỗi ngày: vertical list 3 slots (sáng/trưa/tối)
- Slot card: horizontal layout (ảnh trái + info phải), full width
- Long press slot → ActionSheet

### Slot ActionSheet (iOS) / Bottom Sheet (Android)
```
┌──────────────────────────┐
│  Phở bò Hà Nội          │
│  T2 · Bữa sáng          │
├──────────────────────────┤
│  👁  Xem chi tiết       │
│  🔄  Đổi món            │
│  🔒  Lock món này       │
│  🗑  Xóa khỏi plan     │
├──────────────────────────┤
│  Hủy                    │
└──────────────────────────┘
```

---

## M-S21: ProfileScreen

```
┌──────────────────────────┐
│░░░░░░ Status Bar ░░░░░░░│
├──────────────────────────┤
│  Cá nhân                 │
├──────────────────────────┤
│                          │
│    [Avatar 80pt]         │
│    Chị Lan   [Free]     │
│    lan@email.com         │
│                          │
│ [👩✓][👦][👧][+] [Quản lý]│
│                          │
│ ┌────────────────────────┐
│ │ 🍜 Khẩu vị        [→] │
│ │   Bắc, Nam · Cay ●●●○○│
│ └────────────────────────┘
│ ┌────────────────────────┐
│ │ 🛡 Chế độ ăn      [→] │
│ │   Dị ứng: Đậu phộng   │
│ └────────────────────────┘
│ ┌────────────────────────┐
│ │ 📊 Dinh dưỡng     [→] │
│ │   2,000kcal · 120g P   │
│ └────────────────────────┘
│ ┌────────────────────────┐
│ │ ♥ Món yêu thích (12)[→]│
│ └────────────────────────┘
│                          │
│ ┌────────────────────────┐
│ │ ⭐ Nâng cấp Pro   [→] │
│ └────────────────────────┘
│                          │
│ [🚪 Đăng xuất]          │
│                          │
├──────────────────────────┤
│[🏠][📖][📅][●👤]        │
└──────────────────────────┘
```

- List items: tap → navigate to sub-screen
- Logout: `Alert.alert()` native confirm
- Pull-to-refresh: reload profile data

---

## M-S22 → M-S25: Profile Sub-Screens

Layout giống web (form screens) nhưng với mobile adaptations:

### M-S22: EditProfileScreen
- Full-screen form, `ScrollView`
- Header: [←] [Lưu] (right button)
- Same fields as web S22

### M-S23: DietaryScreen
- Full-screen form
- Allergen chips: wrap layout (3 per row)
- Autocomplete: keyboard pushes up, dropdown overlays

### M-S24: NutritionGoalsScreen
- Preset cards: vertical list
- Number inputs: `keyboardType="numeric"`
- Inputs disabled when preset selected (grayed out)

### M-S25: FamilyScreen
- List of profile cards
- [+ Thêm] → Modal (Bottom Sheet 85%)
- Edit → same Bottom Sheet pre-filled
- Delete → `Alert.alert()` native confirm
- Swipe-to-delete on profile card (alternative to trash icon)

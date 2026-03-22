# Flow 4: Recipe Screens

## S14: Recipe List / Search

**Route:** `/recipes` | `RecipesScreen`
**Tab:** Món ăn (active)

```
┌──────────────────────────────────────┐
│ [NavBar]                    Món ăn   │
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 🔍 Tìm món ăn...              │  │
│  └────────────────────────────────┘  │
│                                      │
│  Filters (horizontal scroll):        │
│  [Vùng miền ▾] [Bữa ▾] [Độ khó ▾] │
│  [Thời gian ▾] [Xóa filter]         │
│                                      │
│  342 kết quả · Sắp xếp: [Phổ biến ▾]│
│                                      │
│  ┌──────────┐  ┌──────────┐         │
│  │[Ảnh phở] │  │[Ảnh bún] │         │
│  │          │  │          │         │
│  │ Phở bò   │  │ Bún chả  │         │
│  │ Hà Nội   │  │ Hà Nội   │         │
│  │⏱45p 🔥450│  │⏱30p 🔥380│         │
│  │[Bắc][TB] │  │[Bắc][Dễ] │         │
│  │      [♥] │  │      [♡] │         │
│  └──────────┘  └──────────┘         │
│  ┌──────────┐  ┌──────────┐         │
│  │[Ảnh cơm] │  │[Ảnh lẩu] │         │
│  │ Cơm tấm  │  │ Lẩu thái │         │
│  │⏱25p 🔥520│  │⏱60p 🔥380│         │
│  │[Nam][Dễ] │  │[QT][TB]  │         │
│  │      [♡] │  │      [♡] │         │
│  └──────────┘  └──────────┘         │
│                                      │
│  (infinite scroll hoặc Load more)    │
│                                      │
├──────────────────────────────────────┤
│ [Home] [●Món ăn] [Thực đơn] [Cá nhân]│
└──────────────────────────────────────┘
```

### Filter Dropdown Detail
```
┌─── Vùng miền ────────────────────┐
│  [☑ Tất cả]                      │
│  [☐ Miền Bắc]                    │
│  [☐ Miền Trung]                  │
│  [☐ Miền Nam]                    │
│  [☐ Quốc tế]                    │
│                   [Áp dụng]      │
└──────────────────────────────────┘
```

### Sort Options
| Value | Label |
|-------|-------|
| `popular` | Phổ biến nhất (default) |
| `newest` | Mới nhất |
| `cook_time_asc` | Nấu nhanh nhất |
| `calories_asc` | Ít calo nhất |
| `calories_desc` | Nhiều calo nhất |

### Data
```
GET /recipes?q={search}&cuisine={}&mealType={}&difficulty={}&sort={}&page={}
TanStack Query: ['recipes', { q, cuisine, mealType, difficulty, sort, page }]
URL sync: filters reflected in URL query params (web)
```

### Search Behavior
- Debounce 300ms
- Min 2 chars to trigger search
- Tiếng Việt: tìm "pho" match "Phở bò" (không dấu tolerance)
- Dietary filter auto-applied (user không thấy món bị filter)
- Empty state: "Không tìm thấy món nào phù hợp. Thử thay đổi filter?"

---

## S15: Recipe Detail

**Route:** `/recipes/:id` | `RecipeDetailScreen`
**Entry:** Tap RecipeCard từ bất kỳ screen nào

```
┌──────────────────────────────────────┐
│ [← Back]              [♥] [📤 Share]│
├──────────────────────────────────────┤
│ ┌────────────────────────────────┐   │
│ │                                │   │
│ │      [Hero Image 16:9]        │   │
│ │                                │   │
│ └────────────────────────────────┘   │
│                                      │
│  Phở bò Hà Nội                      │
│  ⏱ Nấu 45 phút · Chuẩn bị 15 phút │
│  🔥 450 kcal/phần · ⭐ Trung bình   │
│  [Miền Bắc] [Bữa sáng] [Bữa tối]  │
│                                      │
│  "Phở bò Hà Nội truyền thống với   │
│   nước dùng trong, thịt bò tái      │
│   và chín, ăn kèm rau thơm."       │
│                                      │
│  Tab: [●Nguyên liệu] [Cách nấu] [DD]│
│ ════════════════════════════════════ │
│                                      │
│  (Tab content — xem bên dưới)        │
│                                      │
└──────────────────────────────────────┘
```

### Tab 1: Nguyên liệu

```
│  Số người ăn:  [ − ]  2  [ + ]      │
│  (mặc định = recipe.servings)        │
│                                      │
│  ▾ Nguyên liệu chính (8)            │
│  ┌────────────────────────────────┐  │
│  │ ☐  Bánh phở tươi ...... 400g  │  │
│  │ ☐  Thịt bò nạm ........ 200g  │  │
│  │ ☐  Thịt bò tái ........ 100g  │  │
│  │ ☐  Xương ống bò ....... 500g  │  │
│  │ ☐  Hành tây ........... 1 củ  │  │
│  │ ☐  Gừng ............... 50g   │  │
│  │ ☐  Hoa hồi ........... 3 cái  │  │
│  │ ☐  Quế ............... 1 thanh │  │
│  └────────────────────────────────┘  │
│                                      │
│  ▾ Gia vị (5)                        │
│  ┌────────────────────────────────┐  │
│  │ ☐  Nước mắm .......... 3 tbsp │  │
│  │ ☐  Đường phèn ........ 1 tbsp │  │
│  │ ☐  Muối .............. vừa ăn │  │
│  │ ☐  Hạt tiêu .......... 1 tsp  │  │
│  │ ☐  Nước .............. 3 lít  │  │
│  └────────────────────────────────┘  │
│                                      │
│  ▸ Trang trí (4)  ← collapsed       │
│    Hành lá, giá đỗ, rau thơm,      │
│    chanh                             │
```

### Tab 2: Cách nấu

```
│  Bước 1 / 8                          │
│  ┌────────────────────────────────┐  │
│  │   [Ảnh bước 1: sơ chế]       │  │
│  └────────────────────────────────┘  │
│                                      │
│  Sơ chế xương bò                     │
│                                      │
│  "Rửa sạch xương ống bò dưới       │
│   nước chảy. Cho xương vào nồi      │
│   nước sôi, chần 5 phút để loại    │
│   bỏ bọt và tạp chất. Vớt xương   │
│   ra, rửa lại dưới nước lạnh."     │
│                                      │
│                                      │
│  Bước 2 / 8                          │
│  ┌────────────────────────────────┐  │
│  │   [Ảnh bước 2: hầm xương]    │  │
│  └────────────────────────────────┘  │
│                                      │
│  Hầm nước dùng                       │
│                                      │
│  "Cho xương vào nồi lớn, đổ 3 lít  │
│   nước lạnh. Thêm gừng nướng và    │
│   hành tây nướng. Đun sôi, hạ lửa  │
│   nhỏ liu riu, hầm 3 giờ. Vớt      │
│   bọt thường xuyên."                │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  ⏱  Bấm timer: 3 giờ         │  │
│  └────────────────────────────────┘  │
│                                      │
│  (tiếp tục scroll các bước...)       │
```

**Timer behavior:**
- Tap → Start countdown toast/floating widget
- Mobile: Background timer + notification khi xong
- Web: Tab title: "⏱ 2:45:30 — MealMind"
- Sound + vibration khi hết giờ

### Tab 3: Dinh dưỡng

```
│  Giá trị dinh dưỡng (1 phần)        │
│                                      │
│       🔥 450 kcal                    │
│                                      │
│  ┌─── Macro Breakdown ───────────┐   │
│  │         [Pie chart]           │   │
│  │    Protein 31% · Carb 38%    │   │
│  │         Fat 31%               │   │
│  └───────────────────────────────┘   │
│                                      │
│  💪 Protein    35.2g                 │
│  ████████████████░░░░░░░  70% target│
│                                      │
│  🍚 Carbs      42.8g                │
│  ██████████████░░░░░░░░░  53% target│
│                                      │
│  🧈 Fat        15.3g                │
│  ██████████░░░░░░░░░░░░░  33% target│
│                                      │
│  🥬 Fiber       4.6g                │
│  ██████░░░░░░░░░░░░░░░░░  18% target│
│                                      │
│  🧂 Sodium     680mg                │
│                                      │
│  ⚠ Một số giá trị là ước tính       │
│                                      │
│  ── Chi tiết theo nguyên liệu ──    │
│  (expandable list)                   │
│  Thịt bò nạm: 280 kcal, 40g P...   │
│  Bánh phở: 120 kcal, 2g P...       │
```

### Bookmark Behavior
- Tap ♡ → toggle → optimistic update
- ♡ (outline) = chưa bookmark
- ♥ (filled, red) = đã bookmark
- API: POST / DELETE `/recipes/:id/bookmark`

### Share (📤)
- Web: Copy link hoặc Web Share API
- Mobile: Native share sheet (link + text)

---

## S16: Bookmarks

**Route:** `/bookmarks` | `BookmarksScreen`
**Entry:** Profile → Bookmarks, hoặc deep link

```
┌──────────────────────────────────────┐
│ [← Back]              Món yêu thích │
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 🔍 Tìm trong bookmark...      │  │
│  └────────────────────────────────┘  │
│                                      │
│  Filter: [Tất cả] [Sáng] [Trưa]    │
│          [Tối] [Phụ]                │
│                                      │
│  12 món đã lưu                       │
│                                      │
│  ┌──────────┐  ┌──────────┐         │
│  │[Ảnh phở] │  │[Ảnh bún] │         │
│  │ Phở bò   │  │ Bún chả  │         │
│  │⏱45p 🔥450│  │⏱30p 🔥380│         │
│  │      [♥] │  │      [♥] │         │
│  └──────────┘  └──────────┘         │
│  ┌──────────┐  ┌──────────┐         │
│  │[Ảnh cơm] │  │[Ảnh gà]  │         │
│  │ Cơm tấm  │  │ Gà kho   │         │
│  │⏱25p 🔥520│  │⏱40p 🔥350│         │
│  │      [♥] │  │      [♥] │         │
│  └──────────┘  └──────────┘         │
│                                      │
│  (pagination / load more)            │
│                                      │
├──────────────────────────────────────┤
│ [BottomTabBar]                       │
└──────────────────────────────────────┘

      ═══ EMPTY STATE ═══

│  ┌────────────────────────────────┐  │
│  │                                │  │
│  │      ♡ (icon lớn, mờ)        │  │
│  │                                │  │
│  │  "Chưa có món yêu thích"      │  │
│  │  "Nhấn ♡ trên bất kỳ món nào │  │
│  │   để lưu lại tại đây"         │  │
│  │                                │  │
│  │  [Khám phá món ăn] → S14     │  │
│  └────────────────────────────────┘  │
```

### Data
```
GET /recipes/bookmarks?mealType={}&q={}&page={}
TanStack Query: ['recipes', 'bookmarks', { mealType, q, page }]
```

### Unbookmark
- Tap ♥ → confirm dialog: "Bỏ lưu món này?" [Hủy] [Bỏ lưu]
- Optimistic: remove from list immediately, rollback if API fails

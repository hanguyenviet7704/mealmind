# Flow 6: Profile & Settings Screens

## S21: Profile

**Route:** `/profile` | `ProfileScreen`
**Tab:** Cá nhân (active)

```
┌──────────────────────────────────────┐
│ [NavBar]                   Cá nhân   │
├──────────────────────────────────────┤
│                                      │
│         [Avatar XL: 80px]            │
│          Chị Lan                     │
│          lan@email.com               │
│          [Free] badge                │
│                                      │
│  ── Thành viên gia đình ──           │
│  [👩Lan ✓] [👦Bảo] [👧Mai] [+ Thêm]│
│  [👨‍👩‍👧‍👦 Cả gia đình]                  │
│                    [Quản lý →] → S25 │
│                                      │
│  ─────────────────────────────────── │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 🍜  Khẩu vị                   │  │
│  │     Bắc, Nam · Cay ●●●○○     │  │
│  │     Bình thường · 30-60 phút  │  │
│  │                       [→]     │  │
│  └────────────────────────────────┘  │
│                    → S22             │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 🛡  Chế độ ăn & Dị ứng       │  │
│  │     Dị ứng: Đậu phộng        │  │
│  │     Blacklist: Mắm tôm        │  │
│  │                       [→]     │  │
│  └────────────────────────────────┘  │
│                    → S23             │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 📊  Mục tiêu dinh dưỡng      │  │
│  │     2,000 kcal · 120g P       │  │
│  │     Preset: Duy trì           │  │
│  │                       [→]     │  │
│  └────────────────────────────────┘  │
│                    → S24             │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ ♥   Món yêu thích (12)       │  │
│  │                       [→]     │  │
│  └────────────────────────────────┘  │
│                    → S16             │
│                                      │
│  ─────────────────────────────────── │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ ⭐  Nâng cấp Pro              │  │
│  │     Không giới hạn gợi ý,     │  │
│  │     nutrition tracking, ...    │  │
│  │                       [→]     │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 🚪  Đăng xuất                 │  │
│  └────────────────────────────────┘  │
│                                      │
├──────────────────────────────────────┤
│ [Home] [Món ăn] [Thực đơn] [●Cá nhân]│
└──────────────────────────────────────┘
```

### Đăng xuất
```
┌────────────────────────────────┐
│ Đăng xuất?               [✕] │
├────────────────────────────────┤
│                                │
│ ○ Thiết bị này                │
│ ○ Tất cả thiết bị            │
│                                │
│ [Hủy]        [Đăng xuất]      │
└────────────────────────────────┘
```

---

## S22: Profile Edit (Taste Profile)

**Route:** `/profile/edit` | `EditProfileScreen`
**Entry:** Tap "Khẩu vị" từ S21

```
┌──────────────────────────────────────┐
│ [← Back]  [Lưu]   Chỉnh sửa khẩu vị│
├──────────────────────────────────────┤
│                                      │
│  ── Vùng miền ẩm thực ──            │
│  (multi-select chips)                │
│  [☑ Miền Bắc] [☐ Miền Trung]       │
│  [☑ Miền Nam] [☐ Quốc tế]          │
│                                      │
│  ── Khẩu vị ──                       │
│  🌶️ Cay                              │
│  1 ○──────────●──────────○ 5         │
│                                      │
│  🍬 Ngọt                             │
│  1 ○────●────────────────○ 5         │
│                                      │
│  🧂 Mặn                              │
│  1 ○──────────●──────────○ 5         │
│                                      │
│  ── Chế độ ăn ──                     │
│  [Select dropdown]                   │
│  Đang chọn: Bình thường    [▾]      │
│                                      │
│  ── Thời gian nấu tối đa ──         │
│  [< 15p] [15-30p] [●30-60p] [> 60p] │
│                                      │
│  ── Số người ăn ──                   │
│  [ - ]  4  [ + ]                     │
│                                      │
│  ┌────────────────────────────────┐  │
│  │         [Lưu thay đổi]       │  │
│  └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘
```

### Behavior
- Giống onboarding nhưng trên 1 page (không step-by-step)
- Pre-fill từ current profile data
- "Lưu" → `PATCH /taste-profiles/:profileId`
- Toast: "Đã cập nhật khẩu vị. Gợi ý tiếp theo sẽ phù hợp hơn!"
- Invalidate: `['suggestions']`, `['meal-plans']`

---

## S23: Dietary Settings

**Route:** `/profile/dietary` | `DietaryScreen`
**Entry:** Tap "Chế độ ăn & Dị ứng" từ S21

```
┌──────────────────────────────────────┐
│ [← Back]  [Lưu]      Chế độ ăn      │
├──────────────────────────────────────┤
│                                      │
│  Profile: [👩 Lan ▾]                │
│  (dropdown chọn profile cần edit)    │
│                                      │
│  ── Dị ứng thực phẩm ──             │
│  (multi-select chips)                │
│  [☐ 🦐Hải sản] [☐ 🐟Cá]           │
│  [☑ 🥜Đậu phộng] [☐ 🌾Gluten]     │
│  [☐ 🥛Sữa] [☐ 🥚Trứng]            │
│  [☐ 🫘Đậu nành] [☐ 🌰Hạt cây]     │
│                                      │
│  ── Nguyên liệu không muốn ──       │
│  ┌────────────────────────────────┐  │
│  │ + Thêm nguyên liệu...         │  │
│  └────────────────────────────────┘  │
│  (Autocomplete input)                │
│                                      │
│  Đã thêm:                           │
│  [Mắm tôm ✕] [Rau mùi ✕]          │
│  [Nội tạng ✕]                        │
│                                      │
│  ── Bệnh lý (Phase 2) ──            │
│  ☐ Tiểu đường                       │
│  ☐ Huyết áp cao                     │
│  ☐ Gout                             │
│  ☐ Bệnh thận                        │
│  (hiển thị nhưng chưa áp dụng      │
│   filter, tooltip "Sắp ra mắt")    │
│                                      │
│  ── Ăn chay theo tôn giáo ──        │
│  ○ Không                            │
│  ○ Phật giáo (rằm + mùng 1)        │
│  ○ Halal                            │
│  ○ Kosher                           │
│  (Phase 2: auto-schedule)           │
│                                      │
│  ┌────────────────────────────────┐  │
│  │         [Lưu thay đổi]       │  │
│  └────────────────────────────────┘  │
│                                      │
│  ⚠ Thay đổi sẽ áp dụng ngay cho   │
│    tất cả gợi ý và thực đơn.       │
│                                      │
└──────────────────────────────────────┘
```

### API
```
GET  /users/:id/dietary?profileId={}
PUT  /users/:id/dietary { allergens, customBlacklist, religiousDiet }
Invalidate: ['suggestions'], ['recipes'], ['meal-plans']
```

---

## S24: Nutrition Goals

**Route:** `/profile/nutrition` | `NutritionGoalsScreen`
**Entry:** Tap "Mục tiêu dinh dưỡng" từ S21

```
┌──────────────────────────────────────┐
│ [← Back]  [Lưu]  Mục tiêu dinh dưỡng│
├──────────────────────────────────────┤
│                                      │
│  Profile: [👩 Lan ▾]                │
│                                      │
│  ── Chọn preset ──                   │
│  ┌────────────────────────────────┐  │
│  │ ○  Duy trì cân nặng           │  │
│  │    2,000 kcal · 50g P ·       │  │
│  │    275g C · 65g F             │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ ●  Tăng cơ                    │  │
│  │    2,500 kcal · 180g P ·       │  │
│  │    300g C · 70g F             │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ ○  Giảm cân                   │  │
│  │    1,500 kcal · 100g P ·       │  │
│  │    150g C · 50g F             │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ ○  Tiểu đường                 │  │
│  │    1,800 kcal · 80g P ·        │  │
│  │    130g C · 60g F             │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ ○  Tùy chỉnh                  │  │
│  └────────────────────────────────┘  │
│                                      │
│  ── Giá trị hiện tại ──             │
│  (editable khi chọn "Tùy chỉnh",   │
│   read-only khi chọn preset)        │
│                                      │
│  🔥 Calories/ngày                    │
│  ┌────────────────────────────────┐  │
│  │ 2,500                kcal     │  │
│  └────────────────────────────────┘  │
│                                      │
│  💪 Protein/ngày                     │
│  ┌────────────────────────────────┐  │
│  │ 180                  gram     │  │
│  └────────────────────────────────┘  │
│                                      │
│  🍚 Carbs/ngày                      │
│  ┌────────────────────────────────┐  │
│  │ 300                  gram     │  │
│  └────────────────────────────────┘  │
│                                      │
│  🧈 Fat/ngày                        │
│  ┌────────────────────────────────┐  │
│  │ 70                   gram     │  │
│  └────────────────────────────────┘  │
│                                      │
│  🥬 Fiber/ngày                      │
│  ┌────────────────────────────────┐  │
│  │ 25                   gram     │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │         [Lưu mục tiêu]       │  │
│  └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘
```

### Behavior
- Chọn preset → auto-fill values → inputs read-only
- Chọn "Tùy chỉnh" → inputs editable
- API: `PUT /nutrition/goals { preset, dailyCalories, ... }`
- Invalidate: `['nutrition', 'daily']`, `['nutrition', 'weekly']`

---

## S25: Family Profiles

**Route:** `/profile/family` | `FamilyScreen`
**Entry:** Tap "Quản lý →" từ S21

```
┌──────────────────────────────────────┐
│ [← Back]          Thành viên gia đình│
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐  │
│  │ [Avatar] Lan (Bạn)     [chính]│  │
│  │ Người lớn · Bình thường       │  │
│  │ Cay ●●●○○ · Dị ứng: Đậu phộng│  │
│  │                    [✏️ Sửa]   │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ [Avatar] Bảo                  │  │
│  │ Trẻ 6-12 tuổi · Bình thường  │  │
│  │ Cay ●○○○○ · Dị ứng: Hải sản  │  │
│  │            [✏️ Sửa]  [🗑 Xóa]│  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ [Avatar] Mai                  │  │
│  │ Trẻ < 6 tuổi · Bình thường   │  │
│  │ Cay ●○○○○ · Không dị ứng     │  │
│  │            [✏️ Sửa]  [🗑 Xóa]│  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  [+ Thêm thành viên]         │  │
│  └────────────────────────────────┘  │
│  Đã dùng 3/6 (Free) hoặc 3/10 (Pro)│
│                                      │
└──────────────────────────────────────┘
```

### Thêm / Sửa thành viên (Modal)
```
┌────────────────────────────────┐
│ Thêm thành viên          [✕] │
├────────────────────────────────┤
│                                │
│ Tên:                           │
│ ┌──────────────────────────┐   │
│ │ Con Bảo                   │   │
│ └──────────────────────────┘   │
│                                │
│ Avatar: [🧑] [👦] [👧] [👶] [👴]│
│                                │
│ Nhóm tuổi:                    │
│ [< 6] [6-12] [Teen] [●NL] [CT]│
│                                │
│ Khẩu vị nhanh:                │
│ Cay: 1 ○──●──────────○ 5      │
│ Ngọt: 1 ○──────●────○ 5       │
│ Mặn: 1 ○──────●────○ 5        │
│                                │
│ Chế độ ăn: [Bình thường ▾]    │
│                                │
│ Dị ứng:                       │
│ [☑ Hải sản] [☐ Đậu phộng]    │
│ [☐ Gluten] ...                │
│                                │
│ [Hủy]          [Lưu]          │
└────────────────────────────────┘
```

### Xóa thành viên
```
┌────────────────────────────────┐
│ Xóa thành viên?          [✕] │
├────────────────────────────────┤
│                                │
│ ⚠ Xóa "Bảo" sẽ xóa toàn bộ  │
│   khẩu vị và chế độ ăn đã    │
│   thiết lập. Không thể hoàn   │
│   tác.                        │
│                                │
│ [Hủy]          [Xóa]          │
└────────────────────────────────┘
```

### API
```
GET    /family-profiles
POST   /family-profiles { name, ageRange, tasteProfile }
PATCH  /family-profiles/:id { ... }
DELETE /family-profiles/:id
PATCH  /family-profiles/active { profileId }  // null = family mode
```

### Profile chính
- Không có nút "Xóa" (profile chính không xóa được)
- Tap "Sửa" → navigate to S22 (Profile Edit)

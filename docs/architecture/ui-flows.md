# UI/UX Flows

Mô tả navigation và screen flows cho web + mobile. Đây là wireframe bằng text — designer sẽ visual hóa sau.

## Navigation Structure

### Mobile (Bottom Tabs)
```
[Home] [Recipes] [Meal Plan] [Profile]
```

### Web (Top Nav + Sidebar)
```
Logo | Home | Recipes | Meal Plan | [Avatar ▼]
                                    Profile
                                    Settings
                                    Logout
```

---

## Flow 1: First-Time User (Onboarding)

```
App Open
  │
  ├─ Chưa login → [Login Screen]
  │                  ├─ "Đăng nhập" → Email/password form
  │                  ├─ "Đăng nhập với Google" → Google OAuth
  │                  ├─ "Đăng nhập với Apple" → Apple Sign In
  │                  └─ "Tạo tài khoản" → [Register Screen]
  │                                          ├─ Name, email, password
  │                                          └─ Submit → auto login → [Onboarding]
  │
  └─ Đã login, chưa onboarding → [Onboarding Flow]
       │
       ├─ Screen 1/5: "Bạn thích ẩm thực vùng nào?"
       │   [Bắc] [Trung] [Nam] [Quốc tế]  ← multi-select chips
       │   Progress: ████░░░░░░ 20%
       │
       ├─ Screen 2/5: "Khẩu vị của bạn?"
       │   Cay:  ○─────●─────○  (slider 1-5)
       │   Ngọt: ○───●───────○
       │   Mặn:  ○─────●─────○
       │
       ├─ Screen 3/5: "Bạn dị ứng gì không?"
       │   [🦐 Hải sản] [🥜 Đậu phộng] [🌾 Gluten]
       │   [🥛 Sữa]     [🥚 Trứng]     [+ Thêm...]
       │
       ├─ Screen 4/5: "Chế độ ăn đặc biệt?"
       │   ○ Bình thường
       │   ○ Chay (trứng + sữa)
       │   ○ Thuần chay (vegan)
       │   ○ Keto
       │   ○ Low-carb
       │   ○ Paleo
       │
       └─ Screen 5/5: "Thời gian nấu & gia đình?"
           Thời gian: [< 15p] [15-30p] [30-60p] [> 60p]
           Số người:  [- 2 +]
           │
           └─ [Hoàn thành] → [Home Screen] với gợi ý đầu tiên
```

**Skip:** Mọi screen có nút "Bỏ qua" → tạo default profile → Home

---

## Flow 2: Daily Suggestion (Home Screen)

```
[Home Screen]
  │
  ├─ Header: "Chào buổi sáng, Lan! 🌤️ 28°C"
  │
  ├─ Tab bar: [Sáng ✓] [Trưa] [Tối] [Phụ]
  │   (auto-select theo thời gian hiện tại)
  │
  ├─ Suggestion Cards (swipeable stack):
  │   ┌─────────────────────────┐
  │   │ [Ảnh phở bò]           │
  │   │ Phở bò Hà Nội          │
  │   │ ⏱ 45 phút  🔥 450 kcal │
  │   │ "Trời se lạnh, phở nóng│
  │   │  cho buổi sáng nhé!"   │
  │   │                         │
  │   │   [✗ Skip]  [♥ Save]   │
  │   └─────────────────────────┘
  │   ← Swipe left = skip, right = chọn
  │
  ├─ [🎲 Surprise me!] → Random món mới
  │
  ├─ [🍱 Gợi ý combo] → Combo screen
  │
  └─ Hết card → "Xem thêm gợi ý" hoặc "Bạn đã xem hết!"
```

**Tap vào card → Recipe Detail**

---

## Flow 3: Recipe Detail

```
[Recipe Detail Screen]
  │
  ├─ Hero image (full-width)
  ├─ Tên món: "Phở bò Hà Nội"
  ├─ Info bar: ⏱ 45 phút | 🔥 450 kcal | ⭐ Trung bình | 🍜 Miền Bắc
  │
  ├─ [♥ Bookmark] [📤 Share]
  │
  ├─ Tab: [Nguyên liệu] [Cách nấu] [Dinh dưỡng]
  │
  ├─ Tab Nguyên liệu:
  │   Số người: [- 2 +]  ← scale ingredients
  │   ──────────────────
  │   Nguyên liệu chính:
  │   ☐ Bánh phở     200g
  │   ☐ Thịt bò      150g
  │   ☐ Xương bò     500g
  │   Gia vị:
  │   ☐ Hoa hồi      2 cái
  │   ☐ Quế          1 thanh
  │   ☐ Nước mắm     2 thìa canh
  │
  ├─ Tab Cách nấu:
  │   Bước 1/8: Sơ chế xương
  │   [Ảnh minh họa]
  │   "Rửa sạch xương, chần qua nước sôi..."
  │
  │   Bước 2/8: Hầm nước dùng
  │   [Ảnh minh họa]
  │   "Cho xương vào nồi, đổ 3 lít nước, hầm 3 giờ"
  │   [⏱ Bấm timer 180 phút]  ← tap = start countdown
  │
  │   [← Trước] [Tiếp →]
  │
  └─ Tab Dinh dưỡng:
      Per serving (1 người):
      ├─ Calories: 450 kcal
      ├─ Protein:  35g  ████████░░ 70%
      ├─ Carbs:    40g  ██████░░░░ 53%
      ├─ Fat:      15g  ████░░░░░░ 33%
      └─ Fiber:     3g
```

---

## Flow 4: Meal Planning

```
[Meal Plan Screen]
  │
  ├─ Header: "Thực đơn tuần 24/3 - 30/3"
  │   [← Tuần trước] [Tuần sau →] [+ Tạo mới]
  │
  ├─ Calendar Grid:
  │   ┌──────┬──────┬──────┬──────┬──────┬──────┬──────┐
  │   │ T2   │ T3   │ T4   │ T5   │ T6   │ T7   │ CN   │
  │   ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤
  │   │Sáng  │Sáng  │Sáng  │Sáng  │Sáng  │Sáng  │Sáng  │
  │   │[Phở] │[Bánh │[Xôi] │[Cháo]│[Bánh │[Bún  │[Phở] │
  │   │ 🔒   │ mì]  │      │      │ cuốn]│ chả] │      │
  │   ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤
  │   │Trưa  │Trưa  │Trưa  │Trưa  │Trưa  │Trưa  │Trưa  │
  │   │[Cơm  │[Bún  │[Cơm  │...   │...   │...   │...   │
  │   │ rang] │ bò]  │ tấm] │      │      │      │      │
  │   ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤
  │   │Tối   │Tối   │Tối   │...   │...   │...   │...   │
  │   │[Canh │[Lẩu] │[Gà   │      │      │      │      │
  │   │ chua]│      │ kho] │      │      │      │      │
  │   └──────┴──────┴──────┴──────┴──────┴──────┴──────┘
  │
  ├─ Tap vào slot:
  │   ├─ Xem recipe detail
  │   ├─ [🔄 Đổi món] → 3-5 gợi ý thay thế
  │   ├─ [🔒 Lock / Unlock]
  │   └─ [🗑️ Xóa slot]
  │
  ├─ Drag & drop: kéo món từ slot này sang slot khác
  │
  ├─ Bottom bar:
  │   [🔄 Regenerate] [📤 Chia sẻ] [📊 Dinh dưỡng tuần]
  │
  └─ Nutrition Summary (expandable):
      T2: 1,850 kcal (target 2,000) ████████░░
      T3: 2,100 kcal                ██████████
      ...
```

---

## Flow 5: Profile & Settings

```
[Profile Screen]
  │
  ├─ User info: Avatar, Name, Email, Tier badge
  │
  ├─ Family profiles:
  │   [👩 Mẹ Lan ✓] [👦 Con Bảo] [👧 Con Mai] [+ Thêm]
  │   [👨‍👩‍👧‍👦 Cả gia đình]
  │
  ├─ Taste Profile:
  │   Vùng miền: Bắc, Nam
  │   Khẩu vị: Cay ●●●○○ | Ngọt ●●○○○ | Mặn ●●●○○
  │   Chế độ ăn: Bình thường
  │   Thời gian nấu: 30-60 phút
  │   [✏️ Chỉnh sửa]
  │
  ├─ Dietary Restrictions:
  │   Dị ứng: Đậu phộng
  │   Blacklist: Mắm tôm, rau mùi
  │   [✏️ Chỉnh sửa]
  │
  ├─ Nutrition Goals:
  │   Target: 2,000 kcal/ngày
  │   Protein: 120g | Carbs: 250g | Fat: 65g
  │   [✏️ Chỉnh sửa]
  │
  └─ Settings:
      Ngôn ngữ | Thông báo | Nâng cấp Pro | Đăng xuất
```

---

## Screen Inventory (MVP)

| # | Screen | Route (web) | Priority |
|---|--------|-------------|----------|
| 1 | Login | /login | P0 |
| 2 | Register | /register | P0 |
| 3 | Forgot Password | /forgot-password | P1 |
| 4 | Reset Password | /reset-password | P1 |
| 5 | Onboarding (5 screens) | /onboarding | P0 |
| 6 | Home (Suggestions) | / | P0 |
| 7 | Recipe Detail | /recipes/:id | P0 |
| 8 | Recipe List/Search | /recipes | P0 |
| 9 | Meal Plan | /meal-plan | P0 |
| 10 | Profile | /profile | P0 |
| 11 | Profile Edit | /profile/edit | P1 |
| 12 | Dietary Settings | /profile/dietary | P1 |
| 13 | Nutrition Goals | /profile/nutrition | P1 |
| 14 | Family Profiles | /profile/family | P1 |
| 15 | Bookmarks | /bookmarks | P1 |

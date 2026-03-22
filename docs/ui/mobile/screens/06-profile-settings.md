# Mobile Screens: Profile Extra + Settings + Modals (S31-S45)

File `03-main.md` đã có M-S26 (Profile), M-S27-S30. File này bổ sung S31 + Settings + Premium + History + Modals + System.

---

## M-S31: EditFamilyMemberScreen (Bottom Sheet 85%)

```
├── drag handle ───────────┤
│ Sửa thành viên     [✕]  │
├──────────────────────────┤
│                          │
│ Tên:                     │
│ ┌──────────────────────┐ │
│ │ Con Bảo              │ │
│ └──────────────────────┘ │
│                          │
│ Avatar:                  │
│ ← [🧑][👦][👧][👶][👴] →│
│ (horizontal scroll)      │
│                          │
│ Nhóm tuổi:              │
│ [<6][6-12][Teen][●NL][CT]│
│                          │
│ ℹ️ Trẻ < 12 tuổi: auto  │
│   filter gia vị mạnh    │
│                          │
│ Cay: ○──●────────────○   │
│ Ngọt: ○────●──────────○  │
│ Mặn: ○──●────────────○   │
│                          │
│ Chế độ: [Bình thường ▾] │
│                          │
│ Dị ứng:                  │
│ [☑Hải sản][☐Đậu phộng]  │
│ [☐Gluten][☐Sữa]...      │
│                          │
│ ┌──────────────────────┐ │
│ │      [Lưu]           │ │
│ └──────────────────────┘ │
│                          │
│ [🗑 Xóa thành viên này] │
│ (red text, bottom)       │
│                          │
└──────────────────────────┘
```

### Interactions
| # | Element | Event | API | On Success |
|---|---------|-------|-----|------------|
| 1 | Input "Tên" | onChangeText | — | Local state |
| 2 | Avatar emoji | onPress | — | Select avatar |
| 3 | Age range chip | onPress | — | Select + show info if child |
| 4 | Sliders | onChange | — | Local state |
| 5 | Diet select | onPress | — | ActionSheet |
| 6 | Allergen chip | onPress | — | Toggle |
| 7 | "Lưu" | onPress | PATCH /family-profiles/:id { ... } | Close sheet + update card + Toast "Đã cập nhật" |
| 8 | "Xóa" | onPress | — | Alert.alert confirm → DELETE /family-profiles/:id → close + remove card |

---

## M-S32: SettingsScreen

```
┌──────────────────────────┐
│░░░░░░ Status Bar ░░░░░░░│
├──────────────────────────┤
│ [←]  Cài đặt             │
├──────────────────────────┤
│                          │
│ ── Tài khoản ──         │
│ ┌──────────────────────┐ │
│ │ 🔒 Đổi mật khẩu   → │ │ → S33
│ │──────────────────────│ │
│ │ 📧 lan@email.com     │ │
│ │──────────────────────│ │
│ │ 🔗 Google        ✓  │ │
│ │──────────────────────│ │
│ │ 🔗 Apple         ✕  │ │ ← tap → link account
│ └──────────────────────┘ │
│                          │
│ ── Thông báo ──         │
│ ┌──────────────────────┐ │
│ │ 🔔 Push          [●] │ │ → toggle + permission
│ │──────────────────────│ │
│ │ 🍳 Gợi ý bữa sáng[●]│ │
│ │    07:00 [Đổi giờ →] │ │ → S34
│ │──────────────────────│ │
│ │ 📅 Nhắc meal plan [●]│ │
│ └──────────────────────┘ │
│                          │
│ ── Ứng dụng ──          │
│ ┌──────────────────────┐ │
│ │ 🌐 Ngôn ngữ      → │ │ → S35
│ │──────────────────────│ │
│ │ 📱 Phiên bản  1.0.0 │ │
│ │──────────────────────│ │
│ │ 📜 Điều khoản     → │ │ → external link
│ │──────────────────────│ │
│ │ 🔏 Chính sách BM  → │ │ → external link
│ └──────────────────────┘ │
│                          │
│ ── Nguy hiểm ──         │
│ ┌──────────────────────┐ │
│ │ 🗑 Xóa tài khoản  → │ │ → S36
│ └──────────────────────┘ │
│                          │
│ v1.0.0 · MealMind 2026  │
│                          │
└──────────────────────────┘
```

---

## M-S33: ChangePasswordScreen

```
┌──────────────────────────┐
│ [←]  Đổi mật khẩu       │
├──────────────────────────┤
│                          │
│ ┌──────────────────────┐ │
│ │ 🔒 Mật khẩu hiện tại │ │
│ └──────────────────────┘ │
│ ┌──────────────────────┐ │
│ │ 🔒 Mật khẩu mới [👁] │ │
│ └──────────────────────┘ │
│ ████████░░ Mạnh          │
│ ┌──────────────────────┐ │
│ │ 🔒 Xác nhận     [👁] │ │
│ └──────────────────────┘ │
│                          │
│ ┌──────────────────────┐ │
│ │    [Đổi mật khẩu]    │ │
│ └──────────────────────┘ │
│                          │
└──────────────────────────┘
```

| # | Element | Event | API | On Success |
|---|---------|-------|-----|------------|
| 1 | "Đổi mật khẩu" | onPress | POST /auth/change-password { current, new } | Toast "Đã đổi!" + back |

---

## M-S36: DeleteAccountScreen

```
┌──────────────────────────┐
│ [←]  Xóa tài khoản      │
├──────────────────────────┤
│                          │
│ ⚠️ CẢNH BÁO              │
│                          │
│ Xóa tài khoản sẽ:       │
│ • Xóa toàn bộ dữ liệu  │
│ • Xóa khẩu vị, meal plan│
│ • Xóa lịch sử nấu ăn   │
│ • Không thể hoàn tác    │
│                          │
│ Nhập "XÓA TÀI KHOẢN"   │
│ để xác nhận:             │
│ ┌──────────────────────┐ │
│ │                      │ │
│ └──────────────────────┘ │
│                          │
│ ┌──────────────────────┐ │
│ │  [Xóa vĩnh viễn]    │ │
│ │  (danger, disabled   │ │
│ │   until text match)  │ │
│ └──────────────────────┘ │
│                          │
└──────────────────────────┘
```

| # | Element | Event | API | On Success |
|---|---------|-------|-----|------------|
| 1 | Input confirm | onChangeText | — | Enable button when text === "XÓA TÀI KHOẢN" |
| 2 | "Xóa vĩnh viễn" | onPress | DELETE /auth/account | Clear tokens → navigate Login |

---

## M-S37: UpgradeProScreen

```
┌──────────────────────────┐
│ [←]  MealMind Pro ⭐     │
├──────────────────────────┤
│                          │
│ ┌──────────────────────┐ │
│ │ [Hero illustration]  │ │
│ │ "Nâng tầm trải      │ │
│ │  nghiệm nấu ăn"     │ │
│ └──────────────────────┘ │
│                          │
│ ✓ Không giới hạn gợi ý  │
│ ✓ Nutrition tracking     │
│ ✓ Unlimited dietary filter│
│ ✓ 10 profile gia đình   │
│ ✓ Không quảng cáo       │
│ ✓ Xuất PDF thực đơn     │
│                          │
│ ┌──────────────────────┐ │
│ │ ○ Tháng  79,000đ/th  │ │
│ │──────────────────────│ │
│ │ ● Năm   590,000đ/năm │ │
│ │   Tiết kiệm 37%      │ │
│ └──────────────────────┘ │
│                          │
│ ┌──────────────────────┐ │
│ │  [⭐ Đăng ký Pro]    │ │
│ │  (primary, 48pt)     │ │
│ └──────────────────────┘ │
│                          │
│ [Khôi phục giao dịch]   │
│                          │
│ Tự động gia hạn.        │
│ Hủy bất kỳ lúc nào.    │
│                          │
└──────────────────────────┘
```

| # | Element | Event | API | On Success |
|---|---------|-------|-----|------------|
| 1 | Plan radio (month/year) | onPress | — | Select plan |
| 2 | "Đăng ký Pro" | onPress | IAP: requestPurchase(productId) | Verify receipt → update tier → Toast "Chào mừng Pro!" |
| 3 | "Khôi phục" | onPress | IAP: restorePurchases() | Check + restore if valid |

---

## M-S38: CookingHistoryScreen

```
┌──────────────────────────┐
│ [←]  Lịch sử nấu ăn     │
├──────────────────────────┤
│                          │
│ Tháng 3/2026: 45 món    │
│                          │
│ ── Hôm nay (21/3) ──    │
│ ┌──────────────────────┐ │
│ │ [Ảnh] Phở bò · Sáng  │ │
│ │ ⭐⭐⭐⭐☆              │ │
│ │──────────────────────│ │
│ │ [Ảnh] Cơm rang · Trưa│ │
│ │ ⭐⭐⭐☆☆              │ │
│ └──────────────────────┘ │
│                          │
│ ── Hôm qua (20/3) ──    │
│ ┌──────────────────────┐ │
│ │ [Ảnh] Bún chả · Trưa │ │
│ │ ⭐⭐⭐⭐⭐              │ │
│ └──────────────────────┘ │
│                          │
│ (scroll to load more)    │
│                          │
└──────────────────────────┘
```

| # | Element | Event | API | On Success |
|---|---------|-------|-----|------------|
| 1 | — (on mount) | auto | GET /interactions/history?action=cook&days=30 | Render grouped list |
| 2 | History item | onPress | — | Navigate → S15 |
| 3 | Swipe left | onSwipe | DELETE /meal-logs/:id | Remove from list |
| 4 | Stars | onPress | — | Open S42 Rate modal |
| 5 | Pull down | onRefresh | Refetch | Reload |

---

## M-S39: NotificationScreen

```
┌──────────────────────────┐
│ [←]  Thông báo           │
├──────────────────────────┤
│ [Tất cả] [Chưa đọc (3)] │
├──────────────────────────┤
│                          │
│ ── Hôm nay ──           │
│ ┌──────────────────────┐ │
│ │ ● 🍳 Gợi ý bữa trưa │ │
│ │   "Thử Bún chả?"     │ │
│ │   11:00               │ │
│ │──────────────────────│ │
│ │ ○ 📅 Thực đơn mới    │ │
│ │   "Tạo thực đơn tuần │ │
│ │    24/03 ngay!"       │ │
│ │   09:00               │ │
│ └──────────────────────┘ │
│                          │
│ ── Hôm qua ──           │
│ ┌──────────────────────┐ │
│ │ ○ ⏱ Timer hết giờ    │ │
│ │   "Hầm xương — Phở"  │ │
│ │   19:45               │ │
│ └──────────────────────┘ │
│                          │
└──────────────────────────┘
```

| # | Element | Event | API | On Success |
|---|---------|-------|-----|------------|
| 1 | Tab "Chưa đọc" | onPress | Filter local | Show unread only |
| 2 | Notification tap | onPress | PATCH /notifications/:id { read: true } | Navigate to target screen (deep link) |
| 3 | Swipe left | onSwipe | DELETE /notifications/:id | Remove |
| 4 | Pull down | onRefresh | GET /notifications | Reload + update badge |

---

## M-S42: RateRecipeSheet (Bottom Sheet 50%)

```
├── drag handle ───────────┤
│ Đánh giá món ăn     [✕] │
├──────────────────────────┤
│                          │
│     ☆  ☆  ☆  ☆  ☆      │
│   (48pt each, haptic)    │
│                          │
│ Nhận xét nhanh:          │
│ ← [Ngon][Dễ nấu][Nhanh] │
│   [Đẹp mắt][Sẽ nấu lại]│
│   (horizontal scroll)    → │
│                          │
│ ┌──────────────────────┐ │
│ │ Ghi chú (tùy chọn)  │ │
│ │                      │ │
│ └──────────────────────┘ │
│                          │
│ ┌──────────────────────┐ │
│ │     [Gửi đánh giá]   │ │
│ └──────────────────────┘ │
│                          │
└──────────────────────────┘
```

| # | Element | Event | API | On Success |
|---|---------|-------|-----|------------|
| 1 | Star tap | onPress | — | Fill stars up to tapped + haptic |
| 2 | Quick tag | onPress | — | Toggle tag |
| 3 | "Gửi đánh giá" | onPress | POST /recipes/:id/ratings { stars, tags, note } | Close sheet + Toast "Cảm ơn!" |

---

## System Screens

### M-S00: SplashScreen
- Logo animation 1.5s → check token → route to Auth/Onboarding/Home
- Lottie animation: MealMind logo fade in

### M-S43: Offline
- Banner dạng sticky top (not full screen)
- `NetInfo` listener
- Text: "Mất kết nối mạng · Đang dùng dữ liệu cache"

### M-S44: Error Boundary
- Full screen: icon ⚠ + "Đã xảy ra lỗi" + "Thử lại" button
- Sentry auto-report

### M-S45: Maintenance
- Full screen: icon 🔧 + "Hệ thống đang bảo trì" + estimated time
- Check endpoint mỗi 30s → auto-redirect khi xong

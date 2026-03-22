# Flow 7: Settings — SDD

Các màn cài đặt app.

---

## S32 — Settings Screen

### Mục đích
Hub cài đặt chung cho app.

### Layout
```
┌──────────────────────────────────┐
│ ← Cài đặt                      │
│──────────────────────────────────│
│                                  │
│  ── Tài khoản ──────────────    │
│  ┌──────────────────────────┐   │
│  │ 🔒 Đổi mật khẩu      →  │   │
│  │──────────────────────────│   │
│  │ 📧 Email: ha@email.com   │   │
│  │    (không đổi được)       │   │
│  │──────────────────────────│   │
│  │ 🔗 Liên kết Google    ✓  │   │
│  │──────────────────────────│   │
│  │ 🔗 Liên kết Apple     ✕  │   │ ← ✕ = chưa liên kết
│  └──────────────────────────┘   │
│                                  │
│  ── Thông báo ──────────────    │
│  ┌──────────────────────────┐   │
│  │ 🔔 Cài đặt thông báo →  │   │
│  └──────────────────────────┘   │
│                                  │
│  ── Hiển thị ──────────────     │
│  ┌──────────────────────────┐   │
│  │ 🌐 Ngôn ngữ        VI → │   │
│  │──────────────────────────│   │
│  │ 📏 Đơn vị          Gram  │   │
│  │──────────────────────────│   │
│  │ 🌙 Dark mode  (Phase 2)  │   │ ← disabled, show "Sắp ra mắt"
│  └──────────────────────────┘   │
│                                  │
│  ── Dữ liệu ──────────────     │
│  ┌──────────────────────────┐   │
│  │ 📦 Xuất dữ liệu      →  │   │
│  │──────────────────────────│   │
│  │ 🗑 Xóa cache         →  │   │
│  └──────────────────────────┘   │
│                                  │
│  ── Khác ──────────────────     │
│  ┌──────────────────────────┐   │
│  │ 📋 Điều khoản sử dụng →  │   │
│  │──────────────────────────│   │
│  │ 🔐 Chính sách riêng tư → │   │
│  │──────────────────────────│   │
│  │ ℹ  Về MealMind        →  │   │
│  │    Version 1.0.0          │   │
│  └──────────────────────────┘   │
│                                  │
│  ─────────────────────────      │
│  [ 🚪 Đăng xuất ]              │
│  Button: danger variant          │
│                                  │
│  ─────────────────────────      │
│  [ ⚠ Xóa tài khoản ]          │
│  text-danger, text-caption       │
│                                  │
└──────────────────────────────────┘
```

### Navigation
| Item | → Screen |
|------|----------|
| Đổi mật khẩu | S33 Change Password |
| Cài đặt thông báo | S34 Notification Settings |
| Ngôn ngữ | S35 Language |
| Xóa tài khoản | S36 Delete Account |
| Đăng xuất | Confirm modal → Login (S01) |

---

## S33 — Change Password Screen

### Layout
```
┌──────────────────────────────────┐
│ ← Đổi mật khẩu                 │
│──────────────────────────────────│
│                                  │
│  Mật khẩu hiện tại:             │
│  [ ●●●●●●●●          👁 ]      │
│                                  │
│  Mật khẩu mới:                  │
│  [ ●●●●●●●●●●●●      👁 ]      │
│                                  │
│  ┌─ Yêu cầu mật khẩu ─────┐   │
│  │ ✓ Ít nhất 8 ký tự        │   │
│  │ ✓ Có chữ hoa             │   │
│  │ ✕ Có số                   │   │
│  │ ✕ Có ký tự đặc biệt      │   │
│  └──────────────────────────┘   │
│                                  │
│  Xác nhận mật khẩu mới:        │
│  [ ●●●●●●●●●●●●      👁 ]      │
│                                  │
│  [ Đổi mật khẩu ]              │
│  Button: primary, full width     │
│                                  │
└──────────────────────────────────┘
```

### Validation Rules
- Current password: required
- New password: min 8, uppercase, number, special char
- Confirm: must match new password
- Cannot reuse current password
- Real-time validation indicators (✓/✕)

### API
```
PUT /api/v1/auth/change-password
Body: { currentPassword, newPassword }
```

### Success → toast "Đã đổi mật khẩu" → navigate back

---

## S34 — Notification Settings Screen

### Layout
```
┌──────────────────────────────────┐
│ ← Thông báo                    │
│──────────────────────────────────│
│                                  │
│  ── Gợi ý bữa ăn ─────────    │
│  ┌──────────────────────────┐   │
│  │ 🍳 Gợi ý bữa sáng  [●] │   │ ← toggle
│  │    7:00 sáng              │   │
│  │──────────────────────────│   │
│  │ 🥗 Gợi ý bữa trưa  [●] │   │
│  │    11:00 trưa             │   │
│  │──────────────────────────│   │
│  │ 🍲 Gợi ý bữa tối   [○] │   │ ← off
│  │    17:00 chiều            │   │
│  └──────────────────────────┘   │
│                                  │
│  ── Thực đơn tuần ──────────   │
│  ┌──────────────────────────┐   │
│  │ 📅 Nhắc tạo thực đơn [●]│   │
│  │    Chủ nhật, 20:00        │   │
│  │──────────────────────────│   │
│  │ 🛒 Nhắc đi chợ      [●] │   │
│  │    Thứ 2, 08:00           │   │
│  └──────────────────────────┘   │
│                                  │
│  ── Khác ──────────────────     │
│  ┌──────────────────────────┐   │
│  │ ⏱ Nhắc timer nấu    [●] │   │
│  │──────────────────────────│   │
│  │ 📊 Báo cáo tuần     [○] │   │
│  │──────────────────────────│   │
│  │ 🎉 Tính năng mới    [●] │   │
│  │──────────────────────────│   │
│  │ 📢 Khuyến mãi       [○] │   │
│  └──────────────────────────┘   │
│                                  │
│  [ Tắt tất cả thông báo ]      │
│  text-danger, text-body-sm       │
│                                  │
└──────────────────────────────────┘
```

### Behavior
- Toggle → immediate save (no submit button)
- Time pickers → tap to change notification time
- "Tắt tất cả" → confirm → toggle all off

---

## S35 — Language Selection Screen

### Layout
```
┌──────────────────────────────────┐
│ ← Ngôn ngữ                     │
│──────────────────────────────────│
│                                  │
│  ┌──────────────────────────┐   │
│  │ 🇻🇳 Tiếng Việt        ●  │   │ ← selected
│  │──────────────────────────│   │
│  │ 🇬🇧 English            ○  │   │
│  └──────────────────────────┘   │
│                                  │
│  ℹ Thay đổi ngôn ngữ sẽ       │
│    tải lại ứng dụng.            │
│                                  │
└──────────────────────────────────┘
```

### Note
MVP: chỉ Tiếng Việt. English là Phase 2 (disabled + "Sắp ra mắt" badge).

---

## S36 — Delete Account Screen

### Mục đích
GDPR compliance + user trust. Dangerous action flow.

### Layout
```
┌──────────────────────────────────┐
│ ← Xóa tài khoản                │
│──────────────────────────────────│
│                                  │
│  ⚠ Xóa tài khoản vĩnh viễn    │
│  text-h2, red-700                │
│                                  │
│  Khi xóa tài khoản, bạn sẽ     │
│  mất vĩnh viễn:                 │
│                                  │
│  ✕ Tất cả thực đơn đã tạo      │
│  ✕ Lịch sử nấu ăn              │
│  ✕ Sở thích và khẩu vị         │
│  ✕ Bookmark món ăn              │
│  ✕ Thông tin gia đình           │
│                                  │
│  Dữ liệu sẽ bị xóa trong      │
│  30 ngày. Đăng nhập lại trong   │
│  30 ngày để khôi phục.          │
│                                  │
│  ─────────────────────────      │
│                                  │
│  Nhập "XÓA TÀI KHOẢN" để      │
│  xác nhận:                       │
│  [ ________________________ ]    │
│                                  │
│  Mật khẩu hiện tại:             │
│  [ ●●●●●●●●          👁 ]      │
│                                  │
│  [ Xóa tài khoản vĩnh viễn ]   │
│  Button: danger, full width      │
│                                  │
└──────────────────────────────────┘
```

### Behavior
1. Must type exact "XÓA TÀI KHOẢN" to enable button
2. Must provide current password
3. Confirm modal: "Bạn chắc chắn? Hành động này KHÔNG thể hoàn tác sau 30 ngày."
4. API: DELETE /auth/account
5. Success → clear all local data → Splash screen
6. 30-day grace period: soft delete

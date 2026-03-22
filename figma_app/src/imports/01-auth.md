# Mobile Screens: Auth Flow

Stack: `AuthStack` — hiển thị khi chưa login.

---

## M-S01: LoginScreen

```
┌──────────────────────────┐
│░░░░░░ Status Bar ░░░░░░░│
├──────────────────────────┤
│                          │
│                          │
│     [Logo 80×80pt]       │
│      MealMind            │
│                          │
│  "Chào mừng trở lại!"   │
│                          │
│  ┌──────────────────────┐│
│  │ 📧 Email             ││
│  └──────────────────────┘│
│                          │
│  ┌──────────────────────┐│
│  │ 🔒 Mật khẩu    [👁] ││
│  └──────────────────────┘│
│                          │
│  ☐ Ghi nhớ đăng nhập    │
│                          │
│  ┌──────────────────────┐│
│  │    Đăng nhập         ││
│  │    (primary, 48pt)   ││
│  └──────────────────────┘│
│                          │
│    "Quên mật khẩu?"     │
│                          │
│  ─────── hoặc ───────   │
│                          │
│  ┌──────────────────────┐│
│  │ [G] Google    (48pt) ││
│  └──────────────────────┘│
│  ┌──────────────────────┐│
│  │ [🍎] Apple    (48pt) ││
│  └──────────────────────┘│
│                          │
│  "Chưa có tài khoản?"   │
│  "Đăng ký"  (orange link)│
│                          │
├──────────────────────────┤
│    (no bottom tabs)      │
└──────────────────────────┘
```

### Mobile-Specific
- `KeyboardAvoidingView` — inputs đẩy lên khi keyboard mở
- `ScrollView` — scroll được nếu màn hình nhỏ (iPhone SE)
- Input height: 48pt (touch target)
- `returnKeyType`: email="next", password="done"
- "done" → trigger login
- Biometric login: Face ID / Touch ID button (Phase 2)

---

## M-S02: RegisterScreen

```
┌──────────────────────────┐
│░░░░░░ Status Bar ░░░░░░░│
├──────────────────────────┤
│ [←]  Tạo tài khoản      │
├──────────────────────────┤
│                          │
│  ┌──────────────────────┐│
│  │ 👤 Họ tên            ││
│  └──────────────────────┘│
│  ┌──────────────────────┐│
│  │ 📧 Email             ││
│  └──────────────────────┘│
│  ┌──────────────────────┐│
│  │ 🔒 Mật khẩu    [👁] ││
│  └──────────────────────┘│
│  ████░░░░ Trung bình     │
│  ✓ 8 ký tự  ✗ Chữ hoa  │
│  ✓ Chữ thường  ✓ Số    │
│  ┌──────────────────────┐│
│  │ 🔒 Xác nhận    [👁] ││
│  └──────────────────────┘│
│                          │
│  ┌──────────────────────┐│
│  │      Đăng ký         ││
│  └──────────────────────┘│
│                          │
│  ─────── hoặc ───────   │
│  [G] Google  [🍎] Apple  │
│  (2 buttons inline)      │
│                          │
│  "Đã có tài khoản?"     │
│  "Đăng nhập"            │
│                          │
└──────────────────────────┘
```

### Mobile-Specific
- `returnKeyType` chain: name→"next", email→"next", password→"next", confirm→"done"
- Password hints hiển thị inline dưới input (✓ xanh, ✗ đỏ)
- Google + Apple buttons: 2 inline thay vì full-width (tiết kiệm space)
- `ScrollView` bọc toàn bộ form

---

## M-S03: ForgotPasswordScreen

```
┌──────────────────────────┐
│░░░░░░ Status Bar ░░░░░░░│
├──────────────────────────┤
│ [←]  Quên mật khẩu      │
├──────────────────────────┤
│                          │
│      [🔒 icon 64pt]     │
│                          │
│  "Nhập email để nhận     │
│   link đặt lại"         │
│                          │
│  ┌──────────────────────┐│
│  │ 📧 Email             ││
│  └──────────────────────┘│
│                          │
│  ┌──────────────────────┐│
│  │   Gửi link đặt lại  ││
│  └──────────────────────┘│
│                          │
│                          │
│                          │
│                          │
│                          │
│                          │
│                          │
│                          │
│                          │
│                          │
└──────────────────────────┘

       ═══ SAU KHI GỬI ═══

│      [📧 icon 64pt]     │
│                          │
│  "Kiểm tra hộp thư!"    │
│                          │
│  "Link đặt lại đã gửi   │
│   đến email của bạn.     │
│   Hiệu lực 1 giờ."      │
│                          │
│  ┌──────────────────────┐│
│  │    Gửi lại (58s)    ││
│  │    (disabled, gray)  ││
│  └──────────────────────┘│
│                          │
│  "Quay lại đăng nhập"   │
```

---

## M-S04: ResetPasswordScreen

Mở từ deep link: `mealmind://reset-password?token={token}`

```
┌──────────────────────────┐
│░░░░░░ Status Bar ░░░░░░░│
├──────────────────────────┤
│        Đặt lại mật khẩu │
├──────────────────────────┤
│                          │
│      [🔒 icon 64pt]     │
│                          │
│  ┌──────────────────────┐│
│  │ 🔒 Mật khẩu mới [👁]││
│  └──────────────────────┘│
│  ████████░░ Mạnh         │
│  ┌──────────────────────┐│
│  │ 🔒 Xác nhận    [👁] ││
│  └──────────────────────┘│
│                          │
│  ┌──────────────────────┐│
│  │  Đặt lại mật khẩu   ││
│  └──────────────────────┘│
│                          │
└──────────────────────────┘

   ═══ THÀNH CÔNG ═══

│      [✅ icon 64pt]     │
│  "Đặt lại thành công!"  │
│                          │
│  ┌──────────────────────┐│
│  │     Đăng nhập        ││
│  └──────────────────────┘│

   ═══ TOKEN INVALID ═══

│      [⚠ icon 64pt]      │
│  "Link đã hết hạn"      │
│                          │
│  ┌──────────────────────┐│
│  │   Gửi lại link mới  ││
│  └──────────────────────┘│
```

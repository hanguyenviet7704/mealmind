# Flow 1: Auth Screens

## S01: Login

**Route:** `/login` | `LoginScreen`
**Redirect nếu đã login:** → `/` (Home)

```
┌──────────────────────────────────────┐
│                                      │
│          [MealMind Logo]             │
│       "Chào mừng trở lại!"          │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 📧 Email                       │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ 🔒 Mật khẩu            [👁]   │  │
│  └────────────────────────────────┘  │
│                                      │
│  □ Ghi nhớ đăng nhập                 │
│                                      │
│  ┌────────────────────────────────┐  │
│  │        [Đăng nhập]            │  │
│  └────────────────────────────────┘  │
│                                      │
│        "Quên mật khẩu?" → S03       │
│                                      │
│  ──────────── hoặc ──────────────   │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ [G] Đăng nhập với Google      │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ [🍎] Đăng nhập với Apple       │  │
│  └────────────────────────────────┘  │
│                                      │
│  "Chưa có tài khoản? Đăng ký" → S02│
│                                      │
└──────────────────────────────────────┘
```

### Components
| Component | Props |
|-----------|-------|
| `Input` | type=email, label="Email", placeholder="name@example.com" |
| `Input` | type=password, label="Mật khẩu", toggleVisibility=true |
| `Checkbox` | label="Ghi nhớ đăng nhập" |
| `Button` | variant=primary, size=lg, label="Đăng nhập", fullWidth |
| `Button` | variant=secondary, icon=Google, label="Đăng nhập với Google" |
| `Button` | variant=secondary, icon=Apple, label="Đăng nhập với Apple" |

### Data & API
```
Form: { email: string, password: string, rememberMe: boolean }
Validation: loginSchema (packages/validation)
API: POST /api/v1/auth/login
```

### States & Transitions
| State | UI |
|-------|----|
| Default | All inputs empty |
| Filling | Validation realtime (email format, password length) |
| Submitting | Button shows spinner, inputs disabled |
| Error: wrong credentials | Toast: "Email hoặc mật khẩu không đúng", password field cleared |
| Error: account locked | Toast: "Tài khoản tạm khóa, thử lại sau 15 phút" |
| Success + isNewUser=true | → Navigate to `/onboarding` (S05) |
| Success + isNewUser=false + onboarding done | → Navigate to `/` (S10) |
| Success + isNewUser=false + onboarding NOT done | → Navigate to `/onboarding` (S05) |

---

## S02: Register

**Route:** `/register` | `RegisterScreen`

```
┌──────────────────────────────────────┐
│                                      │
│          [MealMind Logo]             │
│        "Tạo tài khoản mới"          │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 👤 Họ tên                      │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ 📧 Email                       │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ 🔒 Mật khẩu            [👁]   │  │
│  └────────────────────────────────┘  │
│  Độ mạnh: ████░░░░ Trung bình       │
│  ┌────────────────────────────────┐  │
│  │ 🔒 Xác nhận mật khẩu   [👁]   │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │        [Đăng ký]              │  │
│  └────────────────────────────────┘  │
│                                      │
│  ──────────── hoặc ──────────────   │
│                                      │
│  [G] Đăng ký với Google             │
│  [🍎] Đăng ký với Apple             │
│                                      │
│  "Đã có tài khoản? Đăng nhập" → S01│
│                                      │
└──────────────────────────────────────┘
```

### Components
| Component | Props |
|-----------|-------|
| `Input` | type=text, label="Họ tên", maxLength=100 |
| `Input` | type=email, label="Email" |
| `Input` | type=password, label="Mật khẩu", toggleVisibility |
| `ProgressBar` | variant=dynamic (red→yellow→green), label=password strength |
| `Input` | type=password, label="Xác nhận mật khẩu" |
| `Button` | variant=primary, size=lg, fullWidth |

### Validation (realtime — hiển thị ngay khi user gõ)
| Field | Rule | Error message |
|-------|------|---------------|
| name | 2-100 chars | "Họ tên từ 2-100 ký tự" |
| email | valid email format | "Email không hợp lệ" |
| password | ≥8 chars | "Tối thiểu 8 ký tự" |
| password | 1 uppercase | "Cần ít nhất 1 chữ hoa" |
| password | 1 lowercase | "Cần ít nhất 1 chữ thường" |
| password | 1 digit | "Cần ít nhất 1 chữ số" |
| confirmPassword | match password | "Mật khẩu không khớp" |

### Password Strength Indicator
| Level | Condition | Color | Label |
|-------|-----------|-------|-------|
| Weak | chỉ đạt minimum | Red | "Yếu" |
| Medium | min + (special char OR length ≥12) | Yellow | "Trung bình" |
| Strong | min + special char + length ≥12 | Green | "Mạnh" |

### States & Transitions
| State | UI |
|-------|----|
| Submitting | Button spinner |
| Error: email exists | Error on email field: "Email đã được sử dụng" |
| Success | Auto-login → navigate to `/onboarding` (S05) |

---

## S03: Forgot Password

**Route:** `/forgot-password` | `ForgotPasswordScreen`

```
┌──────────────────────────────────────┐
│ [← Đăng nhập]                       │
│                                      │
│          [🔒 Icon lớn]              │
│       "Quên mật khẩu?"              │
│                                      │
│  "Nhập email để nhận link            │
│   đặt lại mật khẩu"                 │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 📧 Email                       │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │     [Gửi link đặt lại]       │  │
│  └────────────────────────────────┘  │
│                                      │
│  "Nhớ mật khẩu? Đăng nhập" → S01   │
│                                      │
└──────────────────────────────────────┘

        ═══ SAU KHI GỬI ═══

┌──────────────────────────────────────┐
│ [← Đăng nhập]                       │
│                                      │
│          [📧 Icon lớn]              │
│      "Kiểm tra hộp thư!"            │
│                                      │
│  "Chúng tôi đã gửi link đặt lại    │
│   mật khẩu đến email của bạn.       │
│   Link có hiệu lực trong 1 giờ."    │
│                                      │
│  ┌────────────────────────────────┐  │
│  │     [Gửi lại email]           │  │
│  └────────────────────────────────┘  │
│  Gửi lại sau: 60 giây (countdown)   │
│                                      │
│  [← Quay lại đăng nhập]             │
│                                      │
└──────────────────────────────────────┘
```

### States
| State | UI |
|-------|----|
| Default | Email input + send button |
| Submitting | Button spinner |
| Sent | Switch to confirmation view, resend button with 60s cooldown |
| Resend cooldown | "Gửi lại sau: {seconds} giây" — button disabled |

### API
```
POST /api/v1/auth/forgot-password { email }
→ Always returns 200 (không leak email tồn tại hay không)
```

---

## S04: Reset Password

**Route:** `/reset-password?token={token}` | `ResetPasswordScreen`
**Entry:** Từ link trong email

```
┌──────────────────────────────────────┐
│                                      │
│          [🔒 Icon lớn]              │
│     "Đặt mật khẩu mới"             │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 🔒 Mật khẩu mới        [👁]   │  │
│  └────────────────────────────────┘  │
│  Độ mạnh: ████████░░ Mạnh           │
│  ┌────────────────────────────────┐  │
│  │ 🔒 Xác nhận mật khẩu   [👁]   │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │    [Đặt lại mật khẩu]        │  │
│  └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘

       ═══ TOKEN INVALID ═══

┌──────────────────────────────────────┐
│                                      │
│          [⚠ Icon lớn]               │
│   "Link đã hết hạn hoặc             │
│    không hợp lệ"                     │
│                                      │
│  "Link đặt lại mật khẩu chỉ có      │
│   hiệu lực trong 1 giờ và dùng      │
│   được 1 lần."                       │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  [Gửi lại link mới] → S03    │  │
│  └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘

        ═══ THÀNH CÔNG ═══

┌──────────────────────────────────────┐
│                                      │
│          [✅ Icon lớn]              │
│   "Đặt lại mật khẩu thành công!"    │
│                                      │
│  "Bạn đã bị đăng xuất khỏi tất cả  │
│   thiết bị. Đăng nhập lại với        │
│   mật khẩu mới."                     │
│                                      │
│  ┌────────────────────────────────┐  │
│  │   [Đăng nhập] → S01          │  │
│  └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘
```

### On mount
1. Extract `token` from URL query
2. Validate token format (client-side: not empty, length check)
3. If invalid → show "Token invalid" view immediately

### API
```
POST /api/v1/auth/reset-password { token, newPassword }
→ 200: success → show success view
→ 400: invalid/expired token → show token invalid view
```

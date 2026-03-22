# Interaction Map: Auth Flow (S01-S04)

Mỗi element tương tác → event → API → state change → navigation.

---

## S01: Login

| # | Element | Event | Handler | API Call | On Success | On Error | Loading UI |
|---|---------|-------|---------|----------|------------|----------|------------|
| 1 | Input "Email" | onChange | `setEmail(value)` | — | Validate format realtime | Red border + "Email không hợp lệ" | — |
| 2 | Input "Mật khẩu" | onChange | `setPassword(value)` | — | — | — | — |
| 3 | Icon [👁] (password) | onClick | `togglePasswordVisibility()` | — | Toggle input type text/password | — | — |
| 4 | Checkbox "Ghi nhớ" | onChange | `setRememberMe(bool)` | — | — | — | — |
| 5 | Button "Đăng nhập" | onClick | `handleLogin()` | `POST /auth/login { email, password, rememberMe }` | Store tokens (Zustand) → check `isNewUser` + `onboardingCompleted` → navigate (xem bảng dưới) | Toast error message → clear password field | Button spinner + inputs disabled |
| 6 | Link "Quên mật khẩu?" | onClick | `navigate('/forgot-password')` | — | → S03 | — | — |
| 7 | Button "Google" | onClick | `handleGoogleAuth()` | Google OAuth popup → nhận `idToken` → `POST /auth/google { idToken }` | Store tokens → navigate (same logic #5) | Toast "Xác thực Google thất bại" | Button spinner |
| 8 | Button "Apple" | onClick | `handleAppleAuth()` | Apple Sign In → nhận `identityToken` + `authorizationCode` → `POST /auth/apple { identityToken, authorizationCode, fullName?, email? }` | Store tokens → navigate (same logic #5) | Toast "Xác thực Apple thất bại" | Button spinner |
| 9 | Link "Đăng ký" | onClick | `navigate('/register')` | — | → S02 | — | — |

### Login Success Navigation Logic

```
if (response.isNewUser || !response.user.onboardingCompleted) {
  → navigate('/onboarding')  // S05
} else {
  → navigate('/')  // S10 Home
}
```

### Error Responses

| HTTP | Error Code | UI Action |
|------|-----------|-----------|
| 401 | `AUTH_INVALID_CREDENTIALS` | Toast: "Email hoặc mật khẩu không đúng" + clear password |
| 429 | `AUTH_ACCOUNT_LOCKED` | Toast: "Tài khoản tạm khóa, thử lại sau 15 phút" + disable form 15 min |
| 500 | `SERVER_INTERNAL` | Toast: "Lỗi hệ thống, vui lòng thử lại sau" |

---

## S02: Register

| # | Element | Event | Handler | API Call | On Success | On Error | Loading UI |
|---|---------|-------|---------|----------|------------|----------|------------|
| 1 | Input "Họ tên" | onChange | `setName(value)` | — | Validate 2-100 chars | Red border + "Họ tên từ 2-100 ký tự" | — |
| 2 | Input "Email" | onChange | `setEmail(value)` | — | Validate email format | Red border + "Email không hợp lệ" | — |
| 3 | Input "Mật khẩu" | onChange | `setPassword(value)` | — | Update strength indicator | Inline hints (xem bảng dưới) | — |
| 4 | Password strength bar | — (reactive) | `computeStrength(password)` | — | Update bar color + label | — | — |
| 5 | Input "Xác nhận" | onChange | `setConfirmPassword(value)` | — | — | Red border + "Mật khẩu không khớp" | — |
| 6 | Icon [👁] (mật khẩu) | onClick | `togglePasswordVisibility()` | — | Toggle type | — | — |
| 7 | Icon [👁] (xác nhận) | onClick | `toggleConfirmVisibility()` | — | Toggle type | — | — |
| 8 | Button "Đăng ký" | onClick | `handleRegister()` | `POST /auth/register { name, email, password }` | Store tokens → navigate `/onboarding` (S05) | Xem error table | Button spinner + inputs disabled |
| 9 | Button "Google" | onClick | `handleGoogleAuth()` | (same as S01 #7) | Same as S01 #7 | Same | Button spinner |
| 10 | Button "Apple" | onClick | `handleAppleAuth()` | (same as S01 #8) | Same as S01 #8 | Same | Button spinner |
| 11 | Link "Đăng nhập" | onClick | `navigate('/login')` | — | → S01 | — | — |

### Password Validation Hints (realtime dưới input)

| Rule | Check | Hint text (hiển thị khi chưa đạt) |
|------|-------|------------------------------------|
| Min length | `password.length >= 8` | "✗ Tối thiểu 8 ký tự" → "✓ Tối thiểu 8 ký tự" |
| Uppercase | `/[A-Z]/.test(password)` | "✗ Ít nhất 1 chữ hoa" → "✓ ..." |
| Lowercase | `/[a-z]/.test(password)` | "✗ Ít nhất 1 chữ thường" → "✓ ..." |
| Digit | `/[0-9]/.test(password)` | "✗ Ít nhất 1 chữ số" → "✓ ..." |

### Register Error Responses

| HTTP | Error Code | UI Action |
|------|-----------|-----------|
| 409 | `AUTH_EMAIL_EXISTS` | Error on email field: "Email đã được sử dụng" |
| 400 | `VALIDATION_ERROR` | Map field errors to inputs |
| 429 | `RATE_API_LIMIT` | Toast: "Quá nhiều yêu cầu, thử lại sau" |

---

## S03: Forgot Password

| # | Element | Event | Handler | API Call | On Success | On Error | Loading UI |
|---|---------|-------|---------|----------|------------|----------|------------|
| 1 | Link "← Đăng nhập" | onClick | `navigate('/login')` | — | → S01 | — | — |
| 2 | Input "Email" | onChange | `setEmail(value)` | — | Validate format | Red border | — |
| 3 | Button "Gửi link" | onClick | `handleForgotPassword()` | `POST /auth/forgot-password { email }` | Switch to "Đã gửi" view + start 60s cooldown | (API luôn trả 200) | Button spinner |
| 4 | Button "Gửi lại email" | onClick | `handleResend()` | `POST /auth/forgot-password { email }` | Reset 60s cooldown | — | Button spinner |
| 5 | Countdown "60 giây" | — (reactive) | `useCountdown(60)` | — | Khi countdown = 0 → enable nút "Gửi lại" | — | — |
| 6 | Link "← Đăng nhập" (sent view) | onClick | `navigate('/login')` | — | → S01 | — | — |

### State Machine

```
[form] ──submit──→ [sent] ──countdown=0──→ [can_resend]
                     │                          │
                     │          resend           │
                     └───────────────────────────┘
```

---

## S04: Reset Password

| # | Element | Event | Handler | API Call | On Success | On Error | Loading UI |
|---|---------|-------|---------|----------|------------|----------|------------|
| 1 | — (on mount) | useEffect | `validateToken(token)` | — (client-side format check) | Show form | Show "Token invalid" view | — |
| 2 | Input "Mật khẩu mới" | onChange | `setNewPassword(value)` | — | Update strength bar | Inline hints (same as S02) | — |
| 3 | Input "Xác nhận" | onChange | `setConfirmPassword(value)` | — | — | "Mật khẩu không khớp" | — |
| 4 | Icon [👁] × 2 | onClick | `toggleVisibility()` | — | Toggle type | — | — |
| 5 | Button "Đặt lại" | onClick | `handleResetPassword()` | `POST /auth/reset-password { token, newPassword }` | Switch to "Thành công" view | Switch to "Token invalid" view | Button spinner |
| 6 | Button "Gửi lại link mới" (invalid view) | onClick | `navigate('/forgot-password')` | — | → S03 | — | — |
| 7 | Button "Đăng nhập" (success view) | onClick | `navigate('/login')` | — | → S01 | — | — |

### State Machine

```
[loading] ──token valid──→ [form] ──submit OK──→ [success]
     │                        │
     │ token invalid           │ submit fail (400)
     └─→ [invalid]  ←─────────┘
```

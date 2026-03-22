# Auth: Authentication & Authorization

## Tổng quan

Hệ thống xác thực và phân quyền cho MealMind. Hỗ trợ đăng ký/đăng nhập bằng email, Google OAuth, Apple Sign In. Dùng JWT (access + refresh token) cho stateless authentication.

## User Stories

### US-AUTH-01: Đăng ký bằng email
**Là** người dùng mới,
**Tôi muốn** đăng ký tài khoản bằng email và mật khẩu,
**Để** bắt đầu sử dụng ứng dụng.

**Acceptance Criteria:**
- Form: name, email, password, confirm password
- Password tối thiểu 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 số
- Email phải unique trong hệ thống
- Sau đăng ký → tự động login → chuyển đến Onboarding
- Gửi email xác thực (verify email) — Phase 2

### US-AUTH-02: Đăng nhập bằng email
**Là** người dùng đã có tài khoản,
**Tôi muốn** đăng nhập bằng email + password,
**Để** truy cập tài khoản.

**Acceptance Criteria:**
- Nhập email + password
- Nếu sai → "Email hoặc mật khẩu không đúng" (không tiết lộ email tồn tại)
- Rate limit: 5 lần sai/15 phút → lock tạm
- Sau login → nhận access token + refresh token
- Remember me → refresh token 30 ngày (mặc định 7 ngày)

### US-AUTH-03: Đăng nhập bằng Google
**Là** người dùng,
**Tôi muốn** đăng nhập nhanh bằng tài khoản Google,
**Để** không phải nhớ thêm mật khẩu.

**Acceptance Criteria:**
- Nút "Đăng nhập với Google" trên màn login
- OAuth2 flow: redirect → Google consent → callback → JWT
- Nếu email chưa có trong hệ thống → tự tạo tài khoản + chuyển đến Onboarding
- Nếu email đã có → login vào tài khoản cũ
- Lấy name + avatar từ Google profile

### US-AUTH-04: Đăng nhập bằng Apple
**Là** người dùng iOS,
**Tôi muốn** đăng nhập bằng Apple ID,
**Để** đăng nhập nhanh trên iPhone/iPad.

**Acceptance Criteria:**
- Nút "Sign in with Apple" trên màn login (iOS + web)
- Hỗ trợ "Hide My Email" relay
- Lần đầu: nhận name + email (Apple chỉ gửi 1 lần)
- Các lần sau: nhận user identifier only → match account

### US-AUTH-05: Refresh token
**Là** hệ thống,
**Tôi muốn** tự động gia hạn access token khi hết hạn,
**Để** user không phải login lại liên tục.

**Acceptance Criteria:**
- Access token hết hạn sau 15 phút
- Refresh token hết hạn sau 7 ngày (hoặc 30 ngày nếu "Remember me")
- Khi access token hết → client tự gọi refresh endpoint
- Refresh token rotation: mỗi lần refresh, cấp cặp token mới, revoke cũ
- Nếu refresh token đã bị revoke → force logout

### US-AUTH-06: Đăng xuất
**Là** người dùng,
**Tôi muốn** đăng xuất khỏi thiết bị hiện tại hoặc tất cả thiết bị,
**Để** bảo mật tài khoản.

**Acceptance Criteria:**
- Logout current device: revoke refresh token hiện tại
- Logout all devices: revoke tất cả refresh tokens
- Sau logout → clear local storage, redirect về login

### US-AUTH-07: Quên mật khẩu
**Là** người dùng quên mật khẩu,
**Tôi muốn** reset mật khẩu qua email,
**Để** lấy lại quyền truy cập.

**Acceptance Criteria:**
- Nhập email → gửi link reset (expire 1 giờ)
- Link chỉ dùng được 1 lần
- Mật khẩu mới phải khác mật khẩu cũ
- Sau reset → revoke tất cả refresh tokens (force logout mọi nơi)

## Business Rules

1. **BR-AUTH-01:** Password hashing: bcrypt, salt rounds = 12
2. **BR-AUTH-02:** JWT signing: RS256 (asymmetric key pair). Access token payload: { userId, email, tier, activeProfileId }
3. **BR-AUTH-03:** Refresh token: random 256-bit, lưu SHA-256 hash trong DB. Không lưu raw token.
4. **BR-AUTH-04:** Rate limiting:
   - Login: 5 attempts/15 min per email
   - Register: 3 attempts/hour per IP
   - Password reset: 3 requests/hour per email
   - Refresh: 30 requests/min per user
5. **BR-AUTH-05:** OAuth accounts không có password. Nếu user muốn thêm password → flow "Set password" (không phải "Reset password")
6. **BR-AUTH-06:** Nếu user đăng ký bằng email, sau đó login bằng Google cùng email → link accounts (merge, không tạo mới)
7. **BR-AUTH-07:** Access token KHÔNG lưu trong DB. Refresh token lưu hash trong DB (table refresh_tokens)
8. **BR-AUTH-08:** Mọi endpoint trừ /auth/* yêu cầu valid access token trong Authorization header

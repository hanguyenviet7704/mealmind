# Auth — Acceptance Criteria

## Đăng ký
- [ ] Đăng ký thành công với name + email + password hợp lệ
- [ ] Reject password yếu (< 8 ký tự, thiếu uppercase/lowercase/digit)
- [ ] Reject email trùng → error 409
- [ ] Sau đăng ký → nhận access + refresh token
- [ ] isNewUser = true → client redirect đến onboarding

## Đăng nhập Email
- [ ] Login thành công với email + password đúng
- [ ] Login sai → error 401, message "Email hoặc mật khẩu không đúng"
- [ ] 5 lần sai liên tục → lock 15 phút → error 429
- [ ] rememberMe = true → refresh token 30 ngày
- [ ] rememberMe = false → refresh token 7 ngày

## Google OAuth
- [ ] Login bằng Google ID token thành công
- [ ] Email chưa có → tạo user mới, isNewUser = true
- [ ] Email đã có (registered bằng email) → link account, login bình thường
- [ ] Lấy name + avatar từ Google profile

## Apple Sign In
- [ ] Login bằng Apple identity token thành công
- [ ] Hỗ trợ "Hide My Email" relay address
- [ ] Lần đầu: lưu name + email. Các lần sau: match by Apple user identifier

## Token Management
- [ ] Access token hết hạn sau 15 phút
- [ ] POST /auth/refresh cấp cặp token mới
- [ ] Refresh token cũ bị revoke sau khi dùng (rotation)
- [ ] Dùng refresh token đã revoke → revoke TẤT CẢ tokens của user (security breach)

## Đăng xuất
- [ ] Logout current device: revoke 1 refresh token
- [ ] Logout all devices: revoke tất cả refresh tokens
- [ ] Sau logout, access token cũ vẫn valid đến khi expire (stateless JWT)

## Quên mật khẩu
- [ ] Request reset → gửi email (luôn trả 200, không leak email tồn tại)
- [ ] Reset link expire sau 1 giờ
- [ ] Reset link chỉ dùng 1 lần
- [ ] Sau reset → revoke tất cả refresh tokens

## Security
- [ ] Password lưu bcrypt hash (salt rounds 12)
- [ ] Refresh token lưu SHA-256 hash (không raw)
- [ ] JWT signed với RS256
- [ ] Rate limiting hoạt động đúng cho login, register, reset
- [ ] CORS chỉ cho phép origins trong whitelist

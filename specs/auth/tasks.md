# Auth — Tasks

## Backend
- [ ] AUTH-001 NestJS auth module setup (JWT strategy, guards)
- [ ] AUTH-002 POST /auth/register — email/password registration
- [ ] AUTH-003 POST /auth/login — email/password login + rememberMe
- [ ] AUTH-004 POST /auth/google — Google OAuth verification + login/register
- [ ] AUTH-005 POST /auth/apple — Apple Sign In verification + login/register
- [ ] AUTH-006 POST /auth/refresh — Refresh token rotation
- [ ] AUTH-007 POST /auth/logout — Revoke tokens (current / all devices)
- [ ] AUTH-008 POST /auth/forgot-password — Send reset email
- [ ] AUTH-009 POST /auth/reset-password — Reset with token
- [ ] AUTH-010 GET /auth/me — Get current user info
- [ ] AUTH-011 Rate limiting middleware (login: 5/15min, register: 3/hr, reset: 3/hr)
- [ ] AUTH-020 POST /auth/change-password — Change password (requires current password) → xem S33/M-S33
- [ ] AUTH-021 DELETE /auth/account — Xóa tài khoản vĩnh viễn, clear tokens + data → xem S36/M-S36

## Backend — Notifications
- [ ] AUTH-022 GET /notifications — Danh sách thông báo (tab Tất cả / Chưa đọc) → xem M-S39
- [ ] AUTH-023 PATCH /notifications/:id — Đánh dấu đã đọc → xem M-S39
- [ ] AUTH-024 DELETE /notifications/:id — Xóa thông báo → xem M-S39
- [ ] AUTH-025 Notification badge count (unread) — Trả về tổng unread trong GET /notifications meta

## Frontend (Web)
- [ ] AUTH-012 Login page S01 — email + Google + Apple, rememberMe, error states
  - Wireframe: `docs/ui/web/screens/01-auth.md#S01`
  - Interactions: `docs/ui/web/interactions/01-auth.md`
- [ ] AUTH-013 Register page S02 — form + password strength indicator
  - Wireframe: `docs/ui/web/screens/01-auth.md#S02`
- [ ] AUTH-014 Forgot/Reset password pages S03, S04 — email input, countdown resend, success/invalid token states
  - Wireframe: `docs/ui/web/screens/01-auth.md#S03`, `#S04`
- [ ] AUTH-026 Change Password page (Settings flow) — xem `docs/ui/web/screens/07-settings.md`
- [ ] AUTH-027 Delete Account page (Settings flow) — type-to-confirm pattern
  - Wireframe: `docs/ui/web/screens/07-settings.md`
- [ ] AUTH-028 Token management (shared web) — auto-refresh interceptor, logout on 401, localStorage → httpOnly cookie

## Frontend (Mobile)
- [ ] AUTH-015 LoginScreen M-S01 — KeyboardAvoidingView, 48pt inputs, returnKeyType chain
  - Wireframe: `docs/ui/mobile/screens/01-auth.md#M-S01`
- [ ] AUTH-029 RegisterScreen M-S02 — inline password hints (✓/✗), ScrollView form
  - Wireframe: `docs/ui/mobile/screens/01-auth.md#M-S02`
- [ ] AUTH-030 ForgotPasswordScreen M-S03 — gửi link, countdown resend
  - Wireframe: `docs/ui/mobile/screens/01-auth.md#M-S03`
- [ ] AUTH-031 ResetPasswordScreen M-S04 — deep link `mealmind://reset-password?token=`, success/invalid states
  - Wireframe: `docs/ui/mobile/screens/01-auth.md#M-S04`
- [ ] AUTH-032 ChangePasswordScreen M-S33 — trong Settings, xem `docs/ui/mobile/screens/06-profile-settings.md#M-S33`
- [ ] AUTH-033 DeleteAccountScreen M-S36 — type "XÓA TÀI KHOẢN" to confirm
  - Wireframe: `docs/ui/mobile/screens/06-profile-settings.md#M-S36`
- [ ] AUTH-034 Token management (mobile) — react-native-keychain, auto-refresh, force logout
- [ ] AUTH-035 NotificationScreen M-S39 — tab Tất cả/Chưa đọc, swipe delete, pull-to-refresh
  - Wireframe: `docs/ui/mobile/screens/06-profile-settings.md#M-S39`

## Integration Tests
- [ ] AUTH-016 Integration test: register → login → refresh → logout flow
- [ ] AUTH-017 Integration test: Google OAuth flow (mock)
- [ ] AUTH-018 Integration test: rate limiting
- [ ] AUTH-036 Integration test: change-password invalidates old sessions
- [ ] AUTH-037 Integration test: delete-account clears all user data

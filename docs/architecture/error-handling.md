# Error Handling Specification

## Standard Error Response

Mọi API endpoint trả error theo format thống nhất:

```json
{
  "data": null,
  "meta": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message in Vietnamese",
    "details": {
      "field": "email",
      "reason": "Email đã được sử dụng"
    }
  }
}
```

## Error Codes

### Auth Errors (AUTH_*)

| Code | HTTP | Message (VI) | Trigger |
|------|------|-------------|---------|
| `AUTH_INVALID_CREDENTIALS` | 401 | Email hoặc mật khẩu không đúng | Login fail |
| `AUTH_TOKEN_EXPIRED` | 401 | Phiên đăng nhập đã hết hạn | Access token expired |
| `AUTH_TOKEN_INVALID` | 401 | Token không hợp lệ | Malformed/tampered JWT |
| `AUTH_REFRESH_EXPIRED` | 401 | Vui lòng đăng nhập lại | Refresh token expired |
| `AUTH_REFRESH_REVOKED` | 401 | Phiên đã bị thu hồi | Used revoked refresh token |
| `AUTH_ACCOUNT_LOCKED` | 429 | Tài khoản tạm khóa, thử lại sau 15 phút | Too many login attempts |
| `AUTH_EMAIL_EXISTS` | 409 | Email đã được sử dụng | Register with existing email |
| `AUTH_OAUTH_FAILED` | 400 | Xác thực Google/Apple thất bại | Invalid OAuth token |
| `AUTH_RESET_TOKEN_INVALID` | 400 | Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn | Bad/expired reset token |

### Validation Errors (VALIDATION_*)

| Code | HTTP | Message (VI) | Trigger |
|------|------|-------------|---------|
| `VALIDATION_ERROR` | 400 | Dữ liệu không hợp lệ | Zod validation fail |
| `VALIDATION_REQUIRED` | 400 | Thiếu trường bắt buộc: {field} | Missing required field |
| `VALIDATION_FORMAT` | 400 | {field} không đúng định dạng | Invalid format |
| `VALIDATION_RANGE` | 400 | {field} phải trong khoảng {min}-{max} | Out of range |

### Resource Errors (RESOURCE_*)

| Code | HTTP | Message (VI) | Trigger |
|------|------|-------------|---------|
| `RESOURCE_NOT_FOUND` | 404 | {resource} không tìm thấy | Recipe, user, plan not found |
| `RESOURCE_FORBIDDEN` | 403 | Bạn không có quyền truy cập | Access to other user's data |
| `RESOURCE_CONFLICT` | 409 | {resource} đã tồn tại | Duplicate create |

### Business Logic Errors (BIZ_*)

| Code | HTTP | Message (VI) | Trigger |
|------|------|-------------|---------|
| `BIZ_MAX_PROFILES` | 400 | Đã đạt giới hạn {max} profile | Exceed family profile limit |
| `BIZ_CANNOT_DELETE_PRIMARY` | 400 | Không thể xóa profile chính | Delete primary profile |
| `BIZ_PLAN_LIMIT` | 400 | Đã đạt giới hạn {max} meal plan nháp | Exceed draft plan limit |
| `BIZ_LOCK_LIMIT` | 400 | Không thể lock quá 70% slots | Lock too many meal plan slots |
| `BIZ_INSUFFICIENT_RECIPES` | 400 | Không đủ món phù hợp filter để tạo gợi ý | Filters too restrictive |

### Rate Limit Errors (RATE_*)

| Code | HTTP | Message (VI) | Trigger |
|------|------|-------------|---------|
| `RATE_SUGGESTION_LIMIT` | 429 | Bạn đã hết lượt gợi ý hôm nay. Nâng cấp Pro để không giới hạn | Free tier daily limit |
| `RATE_API_LIMIT` | 429 | Quá nhiều request, vui lòng thử lại sau | General rate limit |

### Server Errors (SERVER_*)

| Code | HTTP | Message (VI) | Trigger |
|------|------|-------------|---------|
| `SERVER_INTERNAL` | 500 | Lỗi hệ thống, vui lòng thử lại sau | Unhandled exception |
| `SERVER_RECOMMENDATION_UNAVAILABLE` | 503 | Hệ thống gợi ý đang bảo trì | Recommendation service down |
| `SERVER_SERVICE_TIMEOUT` | 504 | Hệ thống phản hồi chậm, vui lòng thử lại | Upstream timeout |

## Error Handling Rules

### Backend (NestJS)

1. **Exception Filters:** Global exception filter catch tất cả exceptions, map sang error response format
2. **Validation Pipe:** Zod validation trên mọi DTO, throw `VALIDATION_ERROR` nếu fail
3. **Auth Guard:** Verify JWT, throw `AUTH_TOKEN_*` nếu fail
4. **Logging:** Mọi 4xx → log warn, mọi 5xx → log error + alert
5. **No stack traces in response:** Production KHÔNG trả stack trace. Chỉ trả error code + message

### Frontend (Web + Mobile)

1. **401 → Auto refresh:** Interceptor bắt 401, gọi /auth/refresh, retry request gốc
2. **401 sau refresh fail → Logout:** Clear tokens, redirect /login
3. **429 → Show message:** Hiển thị thông báo rate limit, disable button
4. **4xx → Show error message:** Hiển thị `error.message` cho user
5. **5xx → Generic message:** "Lỗi hệ thống, vui lòng thử lại sau"
6. **Network error → Retry toast:** "Mất kết nối, đang thử lại..."

### Service-to-Service

1. **Recommendation timeout → Fallback:** Popularity-based suggestions
2. **Weather API fail → Skip:** Gợi ý không có weather context
3. **Meilisearch down → MySQL:** Fallback to LIKE search
4. **Redis down → DB direct:** Skip cache, query DB

## HTTP Status Code Summary

| Status | Khi nào dùng |
|--------|-------------|
| 200 | Success (GET, PATCH, PUT) |
| 201 | Created (POST register, POST create) |
| 202 | Accepted (async operations, interaction batch) |
| 204 | No Content (DELETE, logout) |
| 400 | Validation error, business logic error |
| 401 | Authentication required / failed |
| 403 | Forbidden (wrong user, insufficient permissions) |
| 404 | Resource not found |
| 409 | Conflict (duplicate) |
| 422 | Unprocessable (valid format but invalid semantics) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
| 503 | Service unavailable (upstream down) |
| 504 | Gateway timeout (upstream slow) |

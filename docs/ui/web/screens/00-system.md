# Flow 0: System Screens — SDD

Các màn hệ thống xuất hiện tự động, không thuộc navigation chính.

---

## S00 — Splash / Loading Screen

### Mục đích
Hiển thị khi mở app, check auth + routing.

### Layout
```
┌─────────────────────────────┐
│                             │
│                             │
│                             │
│       🍽️ MealMind Logo      │
│       (animated)            │
│                             │
│       [ Loading bar ]       │
│                             │
│                             │
│   "Gợi ý món ăn thông minh" │
│                             │
└─────────────────────────────┘
```

### Behavior
1. Hiển thị logo animation (fade-in + scale-up, 800ms)
2. Slogan fade-in 200ms sau logo
3. Loading bar chạy trong khi check:
   - Local token exists? → validate → route
   - No token → LoginScreen (S01)
   - Token valid + onboarding done → HomeScreen (S10)
   - Token valid + onboarding NOT done → OnboardingScreen (S05)
4. Max duration: 2s, nếu network slow → show retry button

### Design Tokens
- Background: gradient `orange-500` → `orange-600`
- Logo: white, 120px
- Text: white, `text-body`, opacity 80%
- Loading bar: white/30 background, white fill

---

## S43 — Offline Screen

### Mục đích
Khi mất kết nối mạng hoàn toàn.

### Layout
```
┌─────────────────────────────┐
│ ┌─ Offline Banner ────────┐ │
│ │ ⚠ Mất kết nối mạng      │ │
│ └─────────────────────────┘ │
│                             │
│      ☁️ (cloud-off icon)    │
│      192px, neutral-300     │
│                             │
│   "Không có kết nối mạng"   │
│   "Kiểm tra Wi-Fi hoặc     │
│    dữ liệu di động"        │
│                             │
│   [ 🔄 Thử lại ]           │
│                             │
│   ─────────────────────     │
│   "Nội dung đã lưu:"       │
│   • Bookmarks (offline)     │
│   • Lịch sử nấu ăn         │
│                             │
└─────────────────────────────┘
```

### Behavior
- Sticky banner ở top: "⚠ Mất kết nối mạng" (yellow-100 bg, yellow-800 text)
- Auto-detect: `navigator.onLine` + ping interval
- "Thử lại" → re-check connection → nếu OK, auto-dismiss
- Show cached content (bookmarks, recent recipes) nếu có
- Disable: tạo meal plan, refresh suggestions, các API calls

### States
| State | Behavior |
|-------|----------|
| `partial` | Banner only — content vẫn dùng cache |
| `full` | Full-screen offline message |

---

## S44 — Error Boundary Screen

### Mục đích
Catch unhandled errors, hiển thị user-friendly message.

### Layout
```
┌─────────────────────────────┐
│                             │
│     😵 (AlertTriangle)      │
│     96px, orange-500        │
│                             │
│   "Đã xảy ra lỗi"          │
│   text-h2, neutral-800      │
│                             │
│   "Ứng dụng gặp sự cố.    │
│    Vui lòng thử lại hoặc   │
│    liên hệ hỗ trợ."        │
│   text-body, neutral-500    │
│                             │
│   [ 🔄 Thử lại       ]     │
│   [ 🏠 Về trang chủ  ]     │
│                             │
│   ─────────────────────     │
│   Error ID: ERR-xxx-xxx     │
│   text-caption, neutral-400 │
│                             │
└─────────────────────────────┘
```

### Behavior
- "Thử lại" → reload hiện tại route
- "Về trang chủ" → navigate to `/`
- Error ID → copy to clipboard on tap
- Log error → backend (nếu online)

---

## S45 — Maintenance Screen

### Mục đích
Server đang bảo trì.

### Layout
```
┌─────────────────────────────┐
│                             │
│     🔧 (Wrench icon)       │
│     96px, orange-500        │
│                             │
│   "Đang bảo trì hệ thống"  │
│   text-h2, neutral-800      │
│                             │
│   "Chúng tôi đang nâng cấp │
│    để phục vụ bạn tốt hơn. │
│    Dự kiến hoàn thành lúc   │
│    14:00 hôm nay."          │
│   text-body, neutral-500    │
│                             │
│   [ 🔄 Kiểm tra lại  ]     │
│                             │
│   "Theo dõi cập nhật:"     │
│   [Facebook] [Zalo OA]     │
│                             │
└─────────────────────────────┘
```

### Behavior
- Poll server health endpoint mỗi 30s
- Auto-redirect khi server lên lại
- Show estimated time nếu có từ API response

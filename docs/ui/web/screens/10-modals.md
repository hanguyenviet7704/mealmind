# Flow 10: Modals & Overlays — SDD

Global modals/sheets dùng chung nhiều nơi.

---

## S39 — Notification Center

### Mục đích
Danh sách thông báo (gợi ý, nhắc nhở, system).

### Layout (Web: sidebar drawer, Mobile: full screen)
```
┌──────────────────────────────────┐
│ Thông báo              ✕ Close  │
│──────────────────────────────────│
│ [Tất cả] [Chưa đọc (3)]        │
│──────────────────────────────────│
│                                  │
│  ── Hôm nay ─────────────────   │
│  ┌──────────────────────────┐   │
│  │ ● 🍳 Gợi ý bữa trưa     │   │  ← ● = unread
│  │   "Thử Bún chả hôm nay?" │   │
│  │   11:00                   │   │
│  │──────────────────────────│   │
│  │ ○ 📅 Thực đơn tuần mới   │   │  ← ○ = read
│  │   "Tạo thực đơn tuần     │   │
│  │    24/03 ngay!"           │   │
│  │   09:00                   │   │
│  └──────────────────────────┘   │
│                                  │
│  ── Hôm qua ─────────────────   │
│  ┌──────────────────────────┐   │
│  │ ○ ⏱ Timer hoàn thành     │   │
│  │   "Phở bò đã sẵn sàng!" │   │
│  │   18:45                   │   │
│  │──────────────────────────│   │
│  │ ○ 🎉 Tính năng mới      │   │
│  │   "Cooking Mode đã có!"  │   │
│  │   10:00                   │   │
│  └──────────────────────────┘   │
│                                  │
│  [ Đánh dấu đã đọc tất cả ]   │
│                                  │
│  ── Empty State ─────────────   │
│  "Chưa có thông báo mới 🎉"    │
│                                  │
└──────────────────────────────────┘
```

### Notification Types
| Type | Icon | Color | Action |
|------|------|-------|--------|
| meal_suggestion | 🍳 | orange | → S10 Home |
| meal_plan_reminder | 📅 | blue | → S25 Create Plan |
| timer_done | ⏱ | green | — |
| weekly_report | 📊 | purple | → S23 Weekly Nutrition |
| feature_update | 🎉 | orange | → link |
| promo | 🎁 | gold | → S37 Upgrade |

### Behavior
- Badge count on NavBar/BottomTab avatar
- Tap notification → navigate to relevant screen
- Swipe left → delete (mobile)
- "Đánh dấu đã đọc" → mark all as read
- Max 100 notifications, auto-purge after 30 days

---

## S40 — Share Modal

### Mục đích
Chia sẻ meal plan hoặc recipe.

### Layout
```
┌──────────────────────────────────┐
│ Chia sẻ                    ✕    │
│──────────────────────────────────│
│                                  │
│  ┌─ Quick Share ────────────┐   │
│  │  [Zalo] [Message] [FB]   │   │
│  │  [Email] [Copy Link]     │   │
│  └──────────────────────────┘   │
│                                  │
│  ─ Hoặc chia sẻ trong app ──   │
│                                  │
│  Email hoặc username:            │
│  [ user@example.com        ]    │
│                                  │
│  Quyền:                         │
│  (●) Xem   (○) Chỉnh sửa      │
│                                  │
│  [ 📤 Chia sẻ ]                │
│                                  │
│  ── Đã chia sẻ với ─────────   │
│  ┌──────────────────────────┐   │
│  │ 👤 Mai (viewer)     [✕]  │   │
│  │ 👤 Tuấn (editor)   [✕]  │   │
│  └──────────────────────────┘   │
│                                  │
└──────────────────────────────────┘
```

### Behavior
- Share link → generate unique sharing link
- In-app share → search user by email → set permission
- Revoke share: tap ✕ → confirm
- Copy link → toast "Đã copy link"

---

## S42 — Rate Recipe Modal

### Mục đích
Đánh giá sau khi nấu xong → improve suggestions.

### Layout (Bottom Sheet on Mobile)
```
┌──────────────────────────────────┐
│                                  │
│  Bạn thấy món này thế nào?      │
│  text-h3, center                 │
│                                  │
│  "Phở Bò Hà Nội"               │
│  text-body, neutral-500          │
│                                  │
│  ⭐ ⭐ ⭐ ⭐ ☆                   │
│  (tap to rate, 1-5)              │
│                                  │
│  ┌─ Quick Tags ─────────────┐   │
│  │ [Ngon 👍] [Dễ nấu 🍳]   │   │
│  │ [Lạ miệng ✨] [Nhanh ⚡] │   │
│  │ [Hơi nhạt 😐] [Khó 💪]  │   │
│  └──────────────────────────┘   │
│                                  │
│  Ghi chú (tùy chọn):            │
│  [ Lần sau cho thêm ớt...  ]    │
│                                  │
│  [ ✓ Gửi đánh giá ]            │
│  [ Bỏ qua ]                     │
│                                  │
└──────────────────────────────────┘
```

### Trigger
- After completing cooking mode (S16) last step
- After marking "Đã nấu" from meal plan
- Manual from Recipe Detail (S15) → "Đánh giá"

### Behavior
- Stars: animated (bounce) on tap
- Quick tags: toggle, multiple select
- Note: optional, max 200 chars
- Submit → POST /interactions + meal_log with rating
- "Bỏ qua" → just log interaction without rating
- Toast: "Cảm ơn đánh giá! 🎉"

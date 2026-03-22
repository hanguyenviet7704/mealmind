# Flow 8: Upgrade Pro — SDD

---

## S37 — Upgrade Pro Screen

### Mục đích
Upsell Pro subscription. Triggered khi hit free limit hoặc bấm từ Profile.

### Layout
```
┌──────────────────────────────────┐
│ ← Nâng cấp Pro            ✕    │
│──────────────────────────────────│
│                                  │
│  ┌──────────────────────────┐   │
│  │  ✨ MealMind Pro          │   │
│  │  background: gradient     │   │
│  │  orange-500 → orange-600  │   │
│  │                          │   │
│  │  "Trải nghiệm không      │   │
│  │   giới hạn"               │   │
│  │                          │   │
│  │  79,000₫ / tháng         │   │
│  │  hoặc 790,000₫ / năm     │   │
│  │  (tiết kiệm 17%)         │   │
│  └──────────────────────────┘   │
│                                  │
│  ── So sánh ────────────────    │
│  ┌──────────────────────────┐   │
│  │ Feature      Free   Pro  │   │
│  │──────────────────────────│   │
│  │ Gợi ý/ngày  50    ∞     │   │
│  │ Thực đơn    3     ∞     │   │
│  │ Profile GĐ  6     10    │   │
│  │ Surprise    5/day  ∞     │   │
│  │ Nấu nhanh  ✓      ✓     │   │
│  │ Export data  ✕     ✓     │   │
│  │ Tìm kiếm    cơ bản  AI  │   │
│  │ Báo cáo DD  tuần   chi tiết│ │
│  │ Meal Plan   tuần   tháng │   │
│  │ Chia sẻ GĐ  ✕     ✓     │   │
│  │ Dark mode   ✕      ✓     │   │
│  │ Ads         có     không  │   │
│  └──────────────────────────┘   │
│                                  │
│  ── Đánh giá từ người dùng ──  │
│  ┌──────────────────────────┐   │
│  │ ⭐⭐⭐⭐⭐                    │   │
│  │ "Tiết kiệm 2 tiếng mỗi  │   │
│  │  tuần lên thực đơn!"     │   │
│  │  — Chị Hương, Hà Nội     │   │
│  │──────────────────────────│   │
│  │ ⭐⭐⭐⭐⭐                    │   │
│  │ "Gia đình tôi ăn đa dạng │   │
│  │  hơn hẳn từ khi dùng Pro" │  │
│  │  — Anh Tuấn, HCM          │  │
│  └──────────────────────────┘   │
│                                  │
│  ┌──────────────────────────┐   │
│  │  [ 🎉 Dùng thử 7 ngày ] │   │ ← CTA primary
│  │  Button: primary, lg,     │   │
│  │  full width, glow effect  │   │
│  │                          │   │
│  │  "Hủy bất cứ lúc nào.   │   │
│  │   Không bị tính phí nếu  │   │
│  │   hủy trong 7 ngày."     │   │
│  └──────────────────────────┘   │
│                                  │
│  [ Tiếp tục dùng Free ]        │
│  text-body-sm, neutral-400      │
│                                  │
└──────────────────────────────────┘
```

### Trigger Points
| Trigger | Message shown |
|---------|--------------|
| Suggestion limit (50/day) | "Đạt giới hạn gợi ý hôm nay" |
| Meal plan limit (3 drafts) | "Đạt giới hạn thực đơn" |
| Family profile limit (6) | "Thêm thành viên với Pro" |
| Surprise limit (5/day) | "Mở khóa Surprise không giới hạn" |

### S41 — Upgrade Pro Modal (compact version)
Khi trigger từ limit, hiện modal nhỏ thay vì full page:
```
┌──────────────────────────────────┐
│              ✕                   │
│  ⚡ Nâng cấp để tiếp tục       │
│                                  │
│  Bạn đã dùng hết 50 gợi ý      │
│  miễn phí hôm nay.              │
│                                  │
│  Với MealMind Pro:               │
│  ✓ Gợi ý không giới hạn        │
│  ✓ 10 profile gia đình          │
│  ✓ Thực đơn không giới hạn      │
│                                  │
│  [ 🎉 Dùng thử 7 ngày miễn phí]│
│  [ Để sau ]                      │
│                                  │
└──────────────────────────────────┘
```

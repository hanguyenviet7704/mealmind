# Flow 6 Addendum: S31 Edit Family Member — SDD

Bổ sung cho `06-profile.md` đã có S26–S30.

---

## S31 — Edit Family Member Screen

### Mục đích
Chỉnh sửa chi tiết 1 thành viên gia đình (taste profile riêng).

### Layout
```
┌──────────────────────────────────┐
│ ← Sửa thành viên       💾 Lưu  │
│──────────────────────────────────│
│                                  │
│  ┌──────────────────────────┐   │
│  │ 👤 Avatar (80px)         │   │
│  │  [Đổi ảnh]               │   │
│  └──────────────────────────┘   │
│                                  │
│  ── Thông tin cơ bản ──────     │
│                                  │
│  Tên: [ Bé Minh            ]    │
│                                  │
│  Nhóm tuổi:                     │
│  (●) Dưới 6   (○) 6-12          │
│  (○) Thiếu niên  (○) Người lớn  │
│  (○) Cao tuổi                    │
│                                  │
│  ── Khẩu vị ──────────────     │
│                                  │
│  Cay:   [─────●─────] 1/5      │ ← child: auto set 1
│  Ngọt:  [─────────●─] 4/5      │
│  Mặn:   [──────●────] 3/5      │
│                                  │
│  ── Vùng miền ưa thích ────    │
│  [Bắc ✓] [Trung] [Nam ✓]       │
│  [Quốc tế]                      │
│                                  │
│  ── Dị ứng & hạn chế ──────    │
│  [Hải sản] [Đậu phộng ✓]       │
│  [Gluten] [Sữa ✓] [Trứng]     │
│  [Đậu nành] [Hạt cây]          │
│                                  │
│  Nguyên liệu cấm (tự nhập):    │
│  [ + Thêm nguyên liệu ]        │
│  🏷 Đồ sống  ✕                  │
│  🏷 Cà phê   ✕                  │
│                                  │
│  ── Chế độ ăn ──────────────    │
│  (●) Bình thường  (○) Chay      │
│  (○) Keto  (○) Low-carb        │
│                                  │
│  ─────────────────────────      │
│  [ 🗑 Xóa thành viên ]         │
│  text-danger                     │
│                                  │
└──────────────────────────────────┘
```

### Behavior
1. Child age (dưới 6, 6-12) → auto:
   - Spice = 1 (disabled slider)
   - Auto-add: đồ sống, cà phê, bia, rượu to blacklist
   - Show info: "Tự động lọc món không phù hợp trẻ em"
2. Validation:
   - Tên: required, 2-50 chars
   - Spice/Sweet/Salt: 1-5
3. "Xóa thành viên" → confirm modal → cannot delete primary
4. Save → invalidate merged preferences cache
5. Toast: "Đã cập nhật thông tin Bé Minh"

### Child Auto-filter Notice
```
┌─────────────────────────────────┐
│ ℹ Bé Minh dưới 6 tuổi          │
│ MealMind tự động:               │
│ • Giảm cay xuống mức 1          │
│ • Loại bỏ đồ sống, caffeine     │
│ • Loại bỏ rượu bia              │
└─────────────────────────────────┘
```

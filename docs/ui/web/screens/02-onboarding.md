# Flow 2: Onboarding Screens

**Shared layout cho tất cả 5 steps:**
```
┌──────────────────────────────────────┐
│  ProgressBar: ████████░░░░  {n}/5    │
│                                      │
│           {Title}                    │
│           {Subtitle}                 │
│                                      │
│      ┌─────────────────────┐         │
│      │                     │         │
│      │   {Step Content}    │         │
│      │                     │         │
│      └─────────────────────┘         │
│                                      │
│  [Bỏ qua]         [← Trước] [Tiếp →]│
└──────────────────────────────────────┘
```

**Shared behavior:**
- Mỗi step auto-save: `PATCH /onboarding/quiz/{step}` — không mất data nếu thoát
- "Bỏ qua" → `POST /onboarding/skip` → default profile → Home (S10)
- "← Trước" ẩn ở step 1
- "Tiếp →" disabled nếu step chưa valid (trừ step 3 — dị ứng có thể bỏ trống)
- Step cuối: nút "Hoàn thành" thay "Tiếp →"

---

## S05: Onboarding 1/5 — Vùng miền ẩm thực

```
│  ████░░░░░░░░░░░░░░░░  Bước 1/5     │
│                                      │
│    "Bạn thích ẩm thực vùng nào?"    │
│    "Chọn một hoặc nhiều vùng miền"   │
│                                      │
│  ┌──────────────┐  ┌──────────────┐  │
│  │ [Ảnh phở bò] │  │ [Ảnh bún bò │  │
│  │              │  │  Huế]       │  │
│  │  Miền Bắc    │  │  Miền Trung  │  │
│  │  Phở, bún    │  │  Bún bò,    │  │
│  │  chả, nem    │  │  mì Quảng   │  │
│  │   [ ☑ ]      │  │   [ ☐ ]     │  │
│  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  │
│  │ [Ảnh cơm    │  │ [Ảnh sushi, │  │
│  │  tấm]       │  │  pasta]     │  │
│  │  Miền Nam    │  │  Quốc tế    │  │
│  │  Cơm tấm,   │  │  Nhật, Hàn, │  │
│  │  hủ tiếu    │  │  Ý, Thái    │  │
│  │   [ ☐ ]      │  │   [ ☐ ]     │  │
│  └──────────────┘  └──────────────┘  │
│                                      │
│  [Bỏ qua]                 [Tiếp → ] │
```

### Components
| Component | Config |
|-----------|--------|
| `ProgressBar` | value=20, variant=primary |
| 4× `Card` | hoverable, selectable, image 120px height |
| Each card contains | image + title + description + Chip (selected state) |

### Data
```typescript
{ regions: ('north' | 'central' | 'south' | 'international')[] }
// Multi-select, tối thiểu 1
// Nếu không chọn → "Tiếp →" disabled
```

---

## S06: Onboarding 2/5 — Khẩu vị

```
│  ████████░░░░░░░░░░░░  Bước 2/5     │
│                                      │
│       "Khẩu vị của bạn?"            │
│  "Kéo thanh trượt theo sở thích"     │
│                                      │
│  🌶️ Độ cay                           │
│  Không cay                   Rất cay │
│  1 ○──────────●──────────○ 5         │
│           Giá trị: 3                 │
│                                      │
│  🍬 Độ ngọt                          │
│  Không ngọt                 Rất ngọt │
│  1 ○──────────●──────────○ 5         │
│           Giá trị: 3                 │
│                                      │
│  🧂 Độ mặn                           │
│  Nhạt                       Rất mặn │
│  1 ○──────────●──────────○ 5         │
│           Giá trị: 3                 │
│                                      │
│  [← Trước]  [Bỏ qua]     [Tiếp → ] │
```

### Components
| Component | Config |
|-----------|--------|
| 3× `Slider` | min=1, max=5, step=1, default=3, showValue=true |
| Emoji labels | Thay đổi theo giá trị: 1=😶 2=🙂 3=😊 4=😋 5=🤤 |

### Data
```typescript
{ spiceLevel: 1-5, sweetLevel: 1-5, saltLevel: 1-5 }
// Always valid (có default), "Tiếp →" luôn enabled
```

---

## S07: Onboarding 3/5 — Dị ứng thực phẩm

```
│  ████████████░░░░░░░░  Bước 3/5     │
│                                      │
│  "Bạn có dị ứng thực phẩm nào?"     │
│  "Bỏ qua nếu không có"              │
│                                      │
│  ┌──────┐ ┌──────┐ ┌──────┐         │
│  │🦐    │ │🐟    │ │🥜    │         │
│  │Hải   │ │ Cá   │ │Đậu   │         │
│  │sản   │ │      │ │phộng │         │
│  │ [☐]  │ │ [☐]  │ │ [☑]  │         │
│  └──────┘ └──────┘ └──────┘         │
│  ┌──────┐ ┌──────┐ ┌──────┐         │
│  │🌾    │ │🥛    │ │🥚    │         │
│  │Gluten│ │ Sữa  │ │Trứng │         │
│  │ [☐]  │ │ [☐]  │ │ [☐]  │         │
│  └──────┘ └──────┘ └──────┘         │
│  ┌──────┐ ┌──────┐                   │
│  │🫘    │ │🌰    │                   │
│  │Đậu   │ │Hạt   │                   │
│  │nành  │ │cây   │                   │
│  │ [☐]  │ │ [☐]  │                   │
│  └──────┘ └──────┘                   │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ + Thêm nguyên liệu khác...    │  │
│  └────────────────────────────────┘  │
│  (Autocomplete từ ingredient list)   │
│                                      │
│  [← Trước]  [Bỏ qua]     [Tiếp → ] │
```

### Components
| Component | Config |
|-----------|--------|
| 8× `Chip` | variant=outline, toggleable, icon=emoji |
| `Input` | autocomplete, placeholder="Nhập nguyên liệu..." |
| Autocomplete dropdown | Options từ `GET /api/v1/ingredients?q={query}` |

### Data
```typescript
{
  allergens: ('shellfish'|'fish'|'peanuts'|'gluten'|'dairy'|'eggs'|'soy'|'tree_nuts')[],
  customAllergens: string[]
}
// Có thể trống — "Tiếp →" luôn enabled
```

---

## S08: Onboarding 4/5 — Chế độ ăn

```
│  ████████████████░░░░  Bước 4/5     │
│                                      │
│     "Chế độ ăn đặc biệt?"           │
│     "Chọn một chế độ phù hợp"       │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ ○  Bình thường                 │  │
│  │    Không giới hạn nguyên liệu  │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ ○  Chay (trứng + sữa)        │  │
│  │    Không thịt, không cá.       │  │
│  │    OK trứng và sữa            │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ ○  Thuần chay (Vegan)         │  │
│  │    Không sản phẩm động vật    │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ ○  Keto                       │  │
│  │    < 20g carb/ngày, nhiều     │  │
│  │    chất béo lành mạnh         │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ ○  Low-carb                   │  │
│  │    < 100g carb/ngày           │  │
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │ ○  Paleo                      │  │
│  │    Không ngũ cốc, sữa, đậu,  │  │
│  │    đường tinh luyện           │  │
│  └────────────────────────────────┘  │
│                                      │
│  [← Trước]  [Bỏ qua]     [Tiếp → ] │
```

### Components
| Component | Config |
|-----------|--------|
| 6× Radio card | Single-select, each with title + description |
| Default selected | "Bình thường" |

### Data
```typescript
{ dietType: 'normal'|'lacto_ovo_vegetarian'|'vegan'|'keto'|'low_carb'|'paleo' }
// Default: 'normal' — always valid
```

---

## S09: Onboarding 5/5 — Thời gian nấu & Gia đình

```
│  ████████████████████  Bước 5/5     │
│                                      │
│   "Thói quen nấu ăn của bạn?"       │
│                                      │
│  ── Thời gian nấu tối đa ──         │
│                                      │
│  ┌────────┐┌────────┐┌────────┐┌──────┐
│  │< 15    ││15-30   ││30-60   ││> 60  │
│  │phút    ││phút    ││phút    ││phút  │
│  │  [☐]   ││  [☐]   ││  [☑]   ││ [☐]  │
│  └────────┘└────────┘└────────┘└──────┘
│                                      │
│  ── Gia đình bạn có mấy người? ──   │
│                                      │
│           [ - ]  4  [ + ]            │
│                                      │
│       "Chúng tôi sẽ gợi ý          │
│        khẩu phần phù hợp"           │
│                                      │
│  ── Trình độ nấu ăn ──              │
│                                      │
│  ┌──────────┐┌──────────┐┌──────────┐│
│  │ 🔰       ││ 👨‍🍳       ││ ⭐       ││
│  │ Mới bắt  ││ Cơ bản   ││ Thành    ││
│  │ đầu      ││          ││ thạo     ││
│  │  [☐]     ││  [☑]     ││  [☐]     ││
│  └──────────┘└──────────┘└──────────┘│
│                                      │
│  [← Trước]  [Bỏ qua]  [Hoàn thành] │
```

### Components
| Component | Config |
|-----------|--------|
| 4× `Chip` (cook time) | Single-select, default="30-60 phút" |
| Number stepper | min=1, max=20, default=2, label="người" |
| 3× `Chip` (skill) | Single-select, default="Cơ bản" |
| `Button` | variant=primary, label="Hoàn thành" (thay "Tiếp →") |

### Data
```typescript
{
  maxCookTime: 'under_15'|'fifteen_to_30'|'thirty_to_60'|'over_60',
  familySize: number (1-20),
  cookingSkill: 'beginner'|'intermediate'|'advanced' // mapped to difficulty filter preference
}
```

### On Complete
```
1. POST /onboarding/quiz  (toàn bộ answers)
2. → Creates taste_profile + dietary_restriction
3. → Sets user.onboarding_completed = true
4. → Navigate to Home (S10) with first-time animation
```

### First-Time Home Transition
```
┌──────────────────────────────────────┐
│                                      │
│          [✅ Animation]              │
│                                      │
│    "Tuyệt vời! MealMind đã hiểu    │
│     khẩu vị của bạn rồi."           │
│                                      │
│    "Cùng xem gợi ý đầu tiên nhé!"  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │     [Xem gợi ý] → S10        │  │
│  └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘
```
Hiển thị 2 giây → auto-navigate hoặc tap button.

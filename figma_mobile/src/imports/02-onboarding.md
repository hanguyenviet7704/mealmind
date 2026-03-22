# Mobile Screens: Onboarding Flow

Stack: `OnboardingStack` — hiển thị khi `onboardingCompleted === false`.
**1 screen component**, internal state quản lý step 1-5.

---

## Layout chung mobile

```
┌──────────────────────────┐
│░░░░░░ Status Bar ░░░░░░░│
├──────────────────────────┤
│  ████████░░░░░░  2/5     │
├──────────────────────────┤
│                          │
│     {Title}              │
│     {Subtitle}           │
│                          │
│  ┌──────────────────────┐│
│  │                      ││
│  │   Step Content       ││
│  │   (ScrollView)       ││
│  │                      ││
│  │                      ││
│  │                      ││
│  │                      ││
│  └──────────────────────┘│
│                          │
├──────────────────────────┤
│ [Bỏ qua]     [← ] [→ ] │
│ (fixed bottom, above     │
│  safe area)              │
└──────────────────────────┘
```

- Bottom buttons **cố định** — không scroll theo content
- Content area: `ScrollView` (cho screens dài như dị ứng)
- Swipe left/right giữa steps (gesture navigation)
- Page indicator dots: ●○○○○

---

## M-S05: Step 1 — Vùng miền

```
│     "Bạn thích ẩm thực  │
│      vùng nào?"          │
│                          │
│  ┌─────────┐┌─────────┐ │
│  │ [Ảnh]   ││ [Ảnh]   │ │
│  │         ││         │ │
│  │ Miền Bắc││Miền Trung│ │
│  │ Phở, bún││Bún bò   │ │
│  │ chả, nem││mì Quảng │ │
│  └─────────┘└─────────┘ │
│  ┌─────────┐┌─────────┐ │
│  │ [Ảnh]   ││ [Ảnh]   │ │
│  │         ││         │ │
│  │ Miền Nam││ Quốc tế │ │
│  │ Cơm tấm ││ Nhật,Hàn│ │
│  │ hủ tiếu ││ Ý, Thái │ │
│  └─────────┘└─────────┘ │
```

- 2×2 grid, mỗi card ~160×140pt
- Tap → orange border + checkmark overlay
- Multi-select

---

## M-S06: Step 2 — Khẩu vị

```
│     "Khẩu vị của bạn?"  │
│                          │
│  🌶️ Cay                  │
│  ○─────────●─────────○   │
│  1    2    3    4    5   │
│              😊          │
│                          │
│  🍬 Ngọt                 │
│  ○───●───────────────○   │
│  1    2    3    4    5   │
│        🙂                │
│                          │
│  🧂 Mặn                  │
│  ○─────────●─────────○   │
│  1    2    3    4    5   │
│              😊          │
```

- Slider: full-width, thumb size 28pt
- Haptic feedback khi giá trị thay đổi
- Emoji animate khi slide

---

## M-S07: Step 3 — Dị ứng

```
│  "Dị ứng thực phẩm?"    │
│  "Bỏ qua nếu không có"  │
│                          │
│  ┌────┐┌────┐┌────┐     │
│  │ 🦐 ││ 🐟 ││ 🥜 │     │
│  │Hải  ││ Cá ││Đậu │     │
│  │sản  ││    ││phộng│     │
│  └────┘└────┘└────┘     │
│  ┌────┐┌────┐┌────┐     │
│  │ 🌾 ││ 🥛 ││ 🥚 │     │
│  │Glut ││Sữa ││Trứng│    │
│  │en   ││    ││     │     │
│  └────┘└────┘└────┘     │
│  ┌────┐┌────┐           │
│  │ 🫘 ││ 🌰 │           │
│  │Đậu ││Hạt │           │
│  │nành ││cây │           │
│  └────┘└────┘           │
│                          │
│  ┌──────────────────────┐│
│  │+ Thêm nguyên liệu...││
│  └──────────────────────┘│
│  (keyboard + autocomplete│
│   dropdown overlay)      │
│                          │
│  Đã thêm:               │
│  [Mắm tôm ✕] [Nội tạng ✕]│
```

- 3×3 grid chips, mỗi chip ~100×80pt
- Tap toggle: outline → filled orange
- Input autocomplete: keyboard pushes content up

---

## M-S08: Step 4 — Chế độ ăn

```
│  "Chế độ ăn đặc biệt?"  │
│                          │
│  ┌──────────────────────┐│
│  │ ● Bình thường        ││
│  │   Không giới hạn     ││
│  └──────────────────────┘│
│  ┌──────────────────────┐│
│  │ ○ Chay (trứng+sữa)  ││
│  │   Không thịt, không  ││
│  │   cá. OK trứng+sữa  ││
│  └──────────────────────┘│
│  ┌──────────────────────┐│
│  │ ○ Thuần chay (Vegan) ││
│  │   Không sản phẩm     ││
│  │   động vật           ││
│  └──────────────────────┘│
│  ┌──────────────────────┐│
│  │ ○ Keto               ││
│  │   < 20g carb/ngày    ││
│  └──────────────────────┘│
│  ┌──────────────────────┐│
│  │ ○ Low-carb           ││
│  │   < 100g carb/ngày   ││
│  └──────────────────────┘│
│  ┌──────────────────────┐│
│  │ ○ Paleo              ││
│  │   Không ngũ cốc, sữa││
│  └──────────────────────┘│
```

- Radio cards, single-select
- Selected: orange border + filled radio
- ScrollView (list dài)

---

## M-S09: Step 5 — Thời gian + Gia đình

```
│  "Thói quen nấu ăn?"    │
│                          │
│  Thời gian nấu tối đa:  │
│  ┌────┐┌────┐┌────┐┌────┐│
│  │<15p││15- ││30- ││>60p││
│  │    ││30p ││60p ││    ││
│  └────┘└────┘└────┘└────┘│
│                          │
│  Gia đình mấy người?    │
│       [−]  4  [+]        │
│    (stepper, 48pt buttons)│
│                          │
│  Trình độ nấu:          │
│  ┌──────┐┌──────┐┌──────┐│
│  │ 🔰   ││ 👨‍🍳   ││ ⭐   ││
│  │Mới bắt││Cơ bản││Thành ││
│  │đầu   ││      ││thạo  ││
│  └──────┘└──────┘└──────┘│
│                          │
│                          │
├──────────────────────────┤
│[Bỏ qua]    [Hoàn thành] │
└──────────────────────────┘
```

### Completion Animation (full-screen)
```
┌──────────────────────────┐
│                          │
│                          │
│      ✅ (animated,       │
│          scale up)       │
│                          │
│  "Tuyệt vời!"           │
│  "MealMind đã hiểu       │
│   khẩu vị của bạn"      │
│                          │
│  ┌──────────────────────┐│
│  │    Xem gợi ý →      ││
│  └──────────────────────┘│
│                          │
│  (auto-dismiss 3s)       │
│                          │
└──────────────────────────┘
```
- Lottie animation: confetti hoặc cooking animation
- Auto-navigate sau 3s hoặc tap button

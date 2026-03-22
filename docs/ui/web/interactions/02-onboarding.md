# Interaction Map: Onboarding Flow (S05-S09)

---

## Shared: Onboarding Container

| # | Element | Event | Handler | API Call | On Success | On Error | Loading UI |
|---|---------|-------|---------|----------|------------|----------|------------|
| 1 | ProgressBar | — (reactive) | — | — | Display `step/5 * 100%` | — | — |
| 2 | Button "Bỏ qua" | onClick | `handleSkip()` | `POST /onboarding/skip` | Create default profile → navigate `/` (S10) | Toast error | Button spinner |
| 3 | Button "← Trước" | onClick | `goToPrevStep()` | — | Navigate to step N-1 | — | — |
| 4 | Button "Tiếp →" | onClick | `handleNextStep()` | `PATCH /onboarding/quiz/{step}` (auto-save step data) | Navigate to step N+1 | Toast "Lỗi lưu dữ liệu" | Button spinner 200ms |
| 5 | Button "Hoàn thành" (step 5 only) | onClick | `handleComplete()` | `POST /onboarding/quiz` (submit all) | Set `onboardingCompleted=true` → show completion animation → navigate `/` (S10) | Toast error | Full-screen loading |

### Auto-Save Logic (mỗi step)
```
User thay đổi giá trị trong step
  → debounce 1s
  → PATCH /onboarding/quiz/{step} { stepData }
  → Không block UI, silent save
  → Nếu fail: retry 1 lần, rồi ignore (data lưu khi nhấn "Tiếp →")
```

---

## S05: Onboarding 1/5 — Vùng miền

| # | Element | Event | Handler | API Call | On Success | On Error |
|---|---------|-------|---------|----------|------------|----------|
| 1 | Card "Miền Bắc" | onClick | `toggleRegion('north')` | Auto-save (debounce) | Toggle selected state (border orange) | — |
| 2 | Card "Miền Trung" | onClick | `toggleRegion('central')` | Auto-save | Toggle selected | — |
| 3 | Card "Miền Nam" | onClick | `toggleRegion('south')` | Auto-save | Toggle selected | — |
| 4 | Card "Quốc tế" | onClick | `toggleRegion('international')` | Auto-save | Toggle selected | — |
| 5 | Button "Tiếp →" | onClick | — | — | Disabled nếu `regions.length === 0` | — |

### Validation
```
regions.length >= 1  →  "Tiếp →" enabled
regions.length === 0 →  "Tiếp →" disabled + tooltip "Chọn ít nhất 1 vùng miền"
```

---

## S06: Onboarding 2/5 — Khẩu vị

| # | Element | Event | Handler | API Call | On Success | On Error |
|---|---------|-------|---------|----------|------------|----------|
| 1 | Slider "Cay" | onChange | `setSpiceLevel(value)` | Auto-save | Update emoji: 1=😶 2=🙂 3=😊 4=😋 5=🤤 | — |
| 2 | Slider "Ngọt" | onChange | `setSweetLevel(value)` | Auto-save | Update emoji | — |
| 3 | Slider "Mặn" | onChange | `setSaltLevel(value)` | Auto-save | Update emoji | — |

### Notes
- Sliders always valid (default=3), "Tiếp →" always enabled
- Haptic feedback on mobile when slider value changes

---

## S07: Onboarding 3/5 — Dị ứng

| # | Element | Event | Handler | API Call | On Success | On Error |
|---|---------|-------|---------|----------|------------|----------|
| 1 | Chip "Hải sản" | onClick | `toggleAllergen('shellfish')` | Auto-save | Toggle chip (filled/outline) | — |
| 2 | Chip "Cá" | onClick | `toggleAllergen('fish')` | Auto-save | Toggle chip | — |
| 3 | Chip "Đậu phộng" | onClick | `toggleAllergen('peanuts')` | Auto-save | Toggle chip | — |
| 4 | Chip "Gluten" | onClick | `toggleAllergen('gluten')` | Auto-save | Toggle chip | — |
| 5 | Chip "Sữa" | onClick | `toggleAllergen('dairy')` | Auto-save | Toggle chip | — |
| 6 | Chip "Trứng" | onClick | `toggleAllergen('eggs')` | Auto-save | Toggle chip | — |
| 7 | Chip "Đậu nành" | onClick | `toggleAllergen('soy')` | Auto-save | Toggle chip | — |
| 8 | Chip "Hạt cây" | onClick | `toggleAllergen('tree_nuts')` | Auto-save | Toggle chip | — |
| 9 | Input "+ Thêm..." | onChange | `setCustomQuery(value)` | `GET /ingredients?q={value}&limit=5` (debounce 300ms) | Show autocomplete dropdown | — |
| 10 | Autocomplete item | onClick | `addCustomAllergen(ingredient)` | Auto-save | Add chip to custom list | — |
| 11 | Custom chip [✕] | onClick | `removeCustomAllergen(name)` | Auto-save | Remove chip | — |

### Notes
- Tất cả optional, "Tiếp →" always enabled
- Custom allergen tối đa 10 items

---

## S08: Onboarding 4/5 — Chế độ ăn

| # | Element | Event | Handler | API Call | On Success | On Error |
|---|---------|-------|---------|----------|------------|----------|
| 1 | Radio "Bình thường" | onClick | `setDietType('normal')` | Auto-save | Highlight selected card | — |
| 2 | Radio "Chay" | onClick | `setDietType('lacto_ovo_vegetarian')` | Auto-save | Highlight | — |
| 3 | Radio "Thuần chay" | onClick | `setDietType('vegan')` | Auto-save | Highlight | — |
| 4 | Radio "Keto" | onClick | `setDietType('keto')` | Auto-save | Highlight | — |
| 5 | Radio "Low-carb" | onClick | `setDietType('low_carb')` | Auto-save | Highlight | — |
| 6 | Radio "Paleo" | onClick | `setDietType('paleo')` | Auto-save | Highlight | — |

### Notes
- Single-select, default "Bình thường"
- Always valid, "Tiếp →" always enabled

---

## S09: Onboarding 5/5 — Thời gian + Gia đình

| # | Element | Event | Handler | API Call | On Success | On Error |
|---|---------|-------|---------|----------|------------|----------|
| 1 | Chip "< 15 phút" | onClick | `setMaxCookTime('under_15')` | Auto-save | Select chip | — |
| 2 | Chip "15-30 phút" | onClick | `setMaxCookTime('fifteen_to_30')` | Auto-save | Select chip | — |
| 3 | Chip "30-60 phút" | onClick | `setMaxCookTime('thirty_to_60')` | Auto-save | Select chip | — |
| 4 | Chip "> 60 phút" | onClick | `setMaxCookTime('over_60')` | Auto-save | Select chip | — |
| 5 | Button "−" (family size) | onClick | `setFamilySize(Math.max(1, current - 1))` | Auto-save | Update number display | Disabled if value = 1 | — |
| 6 | Button "+" (family size) | onClick | `setFamilySize(Math.min(20, current + 1))` | Auto-save | Update number display | Disabled if value = 20 | — |
| 7 | Chip "Mới bắt đầu" | onClick | `setSkillLevel('beginner')` | Auto-save | Select chip | — |
| 8 | Chip "Cơ bản" | onClick | `setSkillLevel('intermediate')` | Auto-save | Select chip | — |
| 9 | Chip "Thành thạo" | onClick | `setSkillLevel('advanced')` | Auto-save | Select chip | — |
| 10 | Button "Hoàn thành" | onClick | `handleComplete()` | `POST /onboarding/quiz { ...allStepsData }` | Completion animation (2s) → navigate `/` (S10) | Toast "Lỗi, thử lại" | Full-screen loading overlay |

### Completion Animation
```
Duration: 2 giây
Content: ✅ icon + "Tuyệt vời! MealMind đã hiểu khẩu vị của bạn rồi."
Auto-dismiss: 2s → navigate Home
Tap anywhere: navigate Home immediately
```

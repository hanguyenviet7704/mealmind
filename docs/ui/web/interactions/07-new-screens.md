# Web Interactions — New Screens

Bổ sung interaction specs cho các màn mới. Xem existing interactions/ files cho Auth, Onboarding, Suggestion, Recipe, MealPlan, Profile.

---

## Cooking Mode (S16) Interactions

### Timer Interactions
| Action | Trigger | Animation | Duration |
|--------|---------|-----------|----------|
| Start timer | Tap "Bắt đầu" | Button morph → Pause | 200ms |
| Timer tick | Every 1s | Number flip (digits change) | 150ms |
| Timer alarm | Timer reaches 0 | Pulse glow (orange → red) + shake | ∞ until dismissed |
| Dismiss alarm | Tap anywhere | Fade out alarm overlay | 200ms |
| Next step | Tap "Tiếp" / swipe left | Slide left, new slide right | 300ms |
| Previous step | Tap "Trước" / swipe right | Slide right, new slide left | 300ms |
| Complete cooking | Last step "Hoàn thành" | 🎉 Confetti + toast | 2000ms |
| Exit cooking mode | Tap ✕ | Confirm modal → fade out | 300ms |

### Keyboard Shortcuts (Web)
| Key | Action |
|-----|--------|
| Space | Start/Pause timer |
| → / Enter | Next step |
| ← | Previous step |
| Escape | Exit cooking mode |

---

## Shopping List (S24) Interactions

| Action | Trigger | Animation | Duration |
|--------|---------|-----------|----------|
| Check item | Tap checkbox | ✓ check mark draw + strikethrough text | 300ms |
| Uncheck item | Tap checked item | Reverse check animation | 200ms |
| Collapse section | Tap section header | Rotate chevron + accordion close | 300ms |
| Share list | Tap "Chia sẻ" | Copy to clipboard + toast | 150ms |

---

## Create Plan Wizard (S25) Interactions

| Action | Trigger | Animation | Duration |
|--------|---------|-----------|----------|
| Select week | Tap Monday cell | Highlight week row (blue-100) | 200ms |
| Next step | Tap "Tiếp theo" | Step indicator progress + slide | 300ms |
| Generating | Step 3 auto | Loading messages cycle + spinner | 3000-5000ms |
| Complete | Plan created | Celebration animation → navigate | 500ms |

---

## Settings (S32) Interactions

| Action | Trigger | Animation | Duration |
|--------|---------|-----------|----------|
| Toggle setting | Tap toggle | Slide circle + bg color change | 200ms |
| Logout | Tap "Đăng xuất" | Confirm modal → fade to login | 500ms |
| Link Google | Tap "Liên kết" | OAuth popup → success badge | — |

---

## Upgrade Pro (S37) Interactions

| Action | Trigger | Animation | Duration |
|--------|---------|-----------|----------|
| Page load | Enter screen | Hero gradient shimmer | 2000ms loop |
| CTA hover | Mouse over "Dùng thử" | Glow pulse effect | 300ms |
| Select plan | Tap monthly/yearly | Tab switch + price animate | 200ms |
| Purchase | Tap CTA | Loading spinner → success confetti | 2000ms |

---

## Rate Recipe (S42) Interactions

| Action | Trigger | Animation | Duration |
|--------|---------|-----------|----------|
| Tap star | Tap any star (1-5) | Stars fill with bounce + haptic | 300ms |
| Toggle tag | Tap quick tag | Chip toggle with scale bounce | 150ms |
| Submit | Tap "Gửi" | Fade out modal + toast 🎉 | 300ms |

---

## Notification Center (S39) Interactions

| Action | Trigger | Animation | Duration |
|--------|---------|-----------|----------|
| Open drawer | Tap 🔔 | Slide in from right (web) | 300ms |
| Tap notification | Tap item | Navigate + mark as read | — |
| Mark all read | Tap "Đánh dấu đã đọc" | All dots fade to neutral | 500ms |
| Delete (mobile) | Swipe left | Slide out + red bg reveal | 200ms |

---

## Cooking History (S38) Interactions

| Action | Trigger | Animation | Duration |
|--------|---------|-----------|----------|
| Toggle filter tab | Tap tab | Underline slide + content fade | 200ms |
| Tap history item | Tap row | Navigate to recipe detail | — |
| View stats | Tap 📊 icon | Slide transition to stats view | 300ms |
| Pull refresh (mobile) | Pull down | Spinner + data refresh | — |

---

## Surprise (S12) Interactions

| Action | Trigger | Animation | Duration |
|--------|---------|-----------|----------|
| Enter screen | Navigate | Slot machine spin start | — |
| Spin | Auto / tap 🎲 | Cards flying + slow reveal | 1100ms |
| Reveal | Spin ends | Card zoom + bounce | 300ms |
| Accept | Tap "Nấu ngay" | Card flies to corner + navigate | 400ms |
| Re-spin | Tap "Khác 🎲" | Current card flies out + new spin | 1400ms |
| Bookmark | Tap ♥ | Heart fill + bounce | 300ms |

---

## Delete Account (S36) Interactions

| Action | Trigger | Animation | Duration |
|--------|---------|-----------|----------|
| Type confirmation | Type "XÓA TÀI KHOẢN" | Button gradually becomes enabled (opacity) | per-character |
| Invalid confirmation | Mismatch text | Red shake on input | 300ms |
| Confirm delete | Tap final button | Double confirm modal → loading → redirect | 2000ms |

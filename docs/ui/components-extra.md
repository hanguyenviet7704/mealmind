# New Components — packages/ui (Addendum)

Bổ sung components cho các màn mới (S12–S45). Xem `components.md` gốc cho Atoms/Molecules/Organisms cơ bản.

---

## Atoms (new)

### Toggle

```
<Toggle value onChange label? disabled? />
```

- Width: 44px, Height: 24px
- On: orange-500 bg, white circle
- Off: neutral-300 bg, white circle
- Transition: 200ms ease-in-out
- Dùng cho: notification settings, feature toggles

### StarRating

```
<StarRating value={0-5} onChange? size="sm|md|lg" readonly? />
```

| Size | Star Width | Usage |
|------|-----------|-------|
| `sm` | 16px | History list item |
| `md` | 24px | Recipe card |
| `lg` | 40px | Rate modal |

- Stars: filled = yellow-400, empty = neutral-300
- Half star supported (readonly mode)
- Tap interaction: tap star → set value
- Animation: bounce scale on tap

### CheckboxItem

```
<CheckboxItem label quantity? unit? checked onChange />
```

Dùng cho Shopping List items.
- Height: 48px (touch-friendly)
- Checked: strikethrough text + green check
- Unchecked: circle outline
- Swipe right (mobile) → check animation

### TimerDisplay

```
<TimerDisplay seconds={180} running? onStart onPause onReset size="sm|lg" />
```

| Size | Font | Width | Usage |
|------|------|-------|-------|
| `sm` | 24px mono | 120px | Recipe detail sidebar |
| `lg` | 48px mono | 240px | Cooking mode |

- Running: orange-500 glow pulse
- Done: green + alarm icon + vibrate
- Controls: Play / Pause / Reset

### StepIndicator

```
<StepIndicator currentStep={2} totalSteps={3} labels? />
```

- Horizontal dots/bar showing wizard progress
- Active: orange-500 filled circle
- Completed: green check
- Future: neutral-300 outline circle
- Connecting lines between dots

### PriceDisplay

```
<PriceDisplay amount={350000} currency="VND" size="sm|md|lg" />
```

Format: `350,000₫` — Vietnamese number formatting.

---

## Molecules (new)

### SettingsItem

```
<SettingsItem
  icon={Lock}
  label="Đổi mật khẩu"
  description?
  rightElement?: <Toggle /> | <Badge /> | <ChevronRight />
  onPress?
  disabled?
/>
```

- Height: 56px
- Icon: 20px, neutral-500
- Label: text-body, neutral-800
- Description: text-caption, neutral-400
- Divider bottom
- Dùng cho: Settings screen, Profile screen

### NotificationItem

```
<NotificationItem
  type="meal_suggestion|timer|plan_reminder|feature|promo"
  title
  message
  timestamp
  isRead?
  onPress
  onDismiss
/>
```

- Unread: left border orange-500, bg orange-50
- Read: normal bg
- Icon: colored based on type
- Timestamp: relative ("2 giờ trước", "Hôm qua")
- Swipe left → delete (mobile)

### HistoryItem

```
<HistoryItem
  recipe={{ name, imageUrl }}
  mealType="breakfast|lunch|dinner"
  date
  rating?
  calories?
  onPress
/>
```

- Compact row: image(48px) + recipe name + meal icon + rating stars
- Grouped by date

### ShoppingCategory

```
<ShoppingCategory
  category="protein|vegetable|grain|seasoning|other"
  items={[]}
  onToggleItem
  collapsed?
  onToggleCollapse
/>
```

- Collapsible section header: icon + name + count
- Children: CheckboxItem list

### PasswordStrengthMeter

```
<PasswordStrengthMeter
  password
  requirements={[
    { label: "Ít nhất 8 ký tự", met: true },
    { label: "Có chữ hoa", met: true },
    { label: "Có số", met: false },
    { label: "Có ký tự đặc biệt", met: false },
  ]}
/>
```

- Progress bar: red → yellow → green (based on strength)
- Checklist: ✓ green / ✕ neutral-400 per requirement

### ComparisonRow

```
<ComparisonRow
  feature="Gợi ý/ngày"
  freeValue="50"
  proValue="∞"
/>
```

Dùng cho Upgrade Pro comparison table.

### CookingStreak

```
<CookingStreak currentStreak={7} record={14} />
```

- 🔥 icons row
- "7 ngày liên tiếp"
- "Kỷ lục: 14 ngày"
- Animation: fire pulse if streak > 0

---

## Organisms (new)

### CookingModeView

```
<CookingModeView
  steps={[]}
  currentStep
  onNext
  onPrevious
  onComplete
  onTimerStart
  onTimerPause
/>
```

Full-page cooking experience:
- Step image (optional)
- Step description (large font)
- Timer (if step has duration)
- Ingredients for current step
- Step navigation (swipe + buttons)
- Keep-screen-on

### ShoppingListView

```
<ShoppingListView
  categories={[]}
  onToggleItem
  onShare
  totalEstimate?
/>
```

Grouped shopping list with:
- Category sections (collapsible)
- Check/uncheck items
- Estimated total price footer
- Share button

### CreatePlanWizard

```
<CreatePlanWizard
  currentStep={1}
  onStepChange
  onComplete
  profiles={[]}
>
  <CreatePlanWizard.WeekSelect />
  <CreatePlanWizard.Preferences />
  <CreatePlanWizard.Loading />
</CreatePlanWizard>
```

3-step wizard for creating meal plans.

### NotificationList

```
<NotificationList
  notifications={[]}
  onItemPress
  onMarkAllRead
  onDismiss
  filter="all|unread"
/>
```

Grouped by date, with filter tabs.

### UpgradePromptBanner

```
<UpgradePromptBanner
  feature="suggestions"
  currentUsage={45}
  limit={50}
  onUpgrade
  onDismiss
/>
```

Inline banner showing usage approaching limit:
```
⚡ 45/50 gợi ý hôm nay | Nâng cấp Pro →
```

- Background: gradient orange-50 → orange-100
- Shows at 80% of limit
- Dismiss → hide for today

---

## Layout Templates (new)

### WizardLayout

```
<WizardLayout
  currentStep
  totalSteps
  title
  onBack
  onNext
  nextDisabled?
  nextLabel?
>
  {step content}
</WizardLayout>
```

- Top: StepIndicator
- Middle: scrollable content
- Bottom: sticky [← Back] [Next →] buttons

### FullScreenModalLayout

```
<FullScreenModalLayout
  title
  onClose
  rightAction?
>
  {content}
</FullScreenModalLayout>
```

For cooking mode, full-screen overlays.
- No TabBar/NavBar
- Close button top-left
- Content fills screen

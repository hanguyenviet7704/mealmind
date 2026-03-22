# Component Library — packages/ui

Danh sách shared UI components trong `packages/ui`. Agent code frontend PHẢI dùng components này — KHÔNG tự tạo lại.

## Nguyên tắc

1. Mọi component dùng Tailwind classes — KHÔNG inline CSS
2. Mọi component có TypeScript props interface
3. Mọi interactive component có `disabled`, `loading` states
4. Mọi component hỗ trợ `className` prop để extend
5. Responsive: mobile-first, props cho responsive variants nếu cần

## Atoms (elements nhỏ nhất)

### Button

```
<Button variant="primary|secondary|ghost|danger" size="sm|md|lg" loading? disabled?>
```

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| `primary` | orange-500 | white | none | CTA: "Tạo thực đơn", "Hoàn thành" |
| `secondary` | white | orange-600 | orange-300 | Secondary: "Hủy", "Xem thêm" |
| `ghost` | transparent | neutral-600 | none | Tertiary: icon buttons, text links |
| `danger` | red-600 | white | none | Destructive: "Xóa", "Đăng xuất" |

| Size | Height | Padding | Font |
|------|--------|---------|------|
| `sm` | 32px | 12px 16px | 14px |
| `md` | 40px | 12px 20px | 16px |
| `lg` | 48px | 14px 24px | 18px |

### IconButton

```
<IconButton icon={Heart} variant="ghost|filled" size="sm|md|lg" active? />
```

Round button cho icon-only actions (bookmark, close, lock).

### Input

```
<Input type="text|email|password|number" label? placeholder? error? helperText? />
```

- Height: 44px (đủ lớn cho touch target)
- Border: neutral-300, focus: orange-500 ring
- Error: red border + red helper text

### Textarea

```
<Textarea label? rows? maxLength? error? />
```

### Select

```
<Select options={[]} label? placeholder? error? />
```

### Slider

```
<Slider min max step value onChange label? showValue? />
```

Dùng cho: spice/sweet/salt level (1-5) trong onboarding.

### Chip

```
<Chip label selected? onToggle? variant="outline|filled" size="sm|md" />
```

Dùng cho: allergen multi-select, cuisine multi-select, tags.

### Badge

```
<Badge text variant="primary|success|warning|error|info|neutral" size="sm|md" />
```

Dùng cho: "Miền Bắc", "Dễ", "Pro", "Mới", status indicators.

### Avatar

```
<Avatar src? name size="sm|md|lg|xl" />
```

| Size | Diameter |
|------|----------|
| `sm` | 32px |
| `md` | 40px |
| `lg` | 56px |
| `xl` | 80px |

Fallback: initials trên colored background.

### ProgressBar

```
<ProgressBar value={0-100} variant="primary|success|warning|error" label? showPercent? />
```

### Divider

```
<Divider orientation="horizontal|vertical" />
```

### Skeleton

```
<Skeleton variant="text|circular|rectangular" width? height? />
```

Shimmer animation cho loading states.

## Molecules (composed elements)

### Card

```
<Card padding? shadow? rounded? onClick? hoverable?>
  {children}
</Card>
```

Base card container. Không tự có layout — children quyết định.

### RecipeCard

```
<RecipeCard
  recipe={{ id, name, imageUrl, cookTime, calories, cuisine, difficulty }}
  onPress?
  onBookmark?
  isBookmarked?
  showBadges?
  size="sm|md|lg"
/>
```

| Size | Layout | Image | Usage |
|------|--------|-------|-------|
| `sm` | Horizontal, 80px image | Thumbnail | List item |
| `md` | Vertical, 200px image | Medium | Grid card, suggestion |
| `lg` | Vertical, 280px image | Large | Featured, detail hero |

Content:
- Ảnh (top) + gradient overlay bottom
- Tên món (max 2 lines, truncate)
- Meta: ⏱ {cookTime} phút · 🔥 {calories} kcal
- Badges: cuisine, difficulty
- Bookmark icon (top-right corner)

### SuggestionCard

```
<SuggestionCard
  suggestion={{ recipe, score, reason, reasonType, tags }}
  onAccept
  onSkip
  onBookmark
/>
```

Extends RecipeCard with:
- Reason text ở bottom: "Phù hợp khẩu vị miền Bắc"
- Swipe gesture (mobile) / Accept + Skip buttons (web)
- Tags row: ["Nhanh gọn", "Miền Bắc", "< 30 phút"]

### MealSlotCard

```
<MealSlotCard
  slot={{ day, mealType, recipe, isLocked }}
  onTap
  onSwap
  onLock
  isDragging?
  isDropTarget?
/>
```

Compact card for meal plan grid:
- 120×100px (mobile), 150×120px (desktop)
- Ảnh nhỏ + tên món (1 line truncate)
- Calo nhỏ ở corner
- Lock icon nếu isLocked
- Drag handle (desktop)

### NutritionBar

```
<NutritionBar
  label="Protein"
  actual={95}
  target={120}
  unit="g"
  status="good|warning|alert"
/>
```

Horizontal bar showing actual vs target:
- Background: neutral-200
- Fill: color theo status (green/yellow/red)
- Text: "{actual}g / {target}g ({percent}%)"

### MacroSummary

```
<MacroSummary
  calories={{ actual, target }}
  protein={{ actual, target }}
  carbs={{ actual, target }}
  fat={{ actual, target }}
  layout="horizontal|vertical"
/>
```

Group of 4 NutritionBars. Horizontal = dashboard, Vertical = recipe detail sidebar.

### FormField

```
<FormField label? required? error? helperText?>
  <Input /> or <Select /> or <Slider />
</FormField>
```

Wrapper for consistent label + error display.

### EmptyState

```
<EmptyState
  icon={CalendarDays}
  title="Chưa có thực đơn"
  description="Tạo thực đơn tuần để bắt đầu"
  action={{ label: "Tạo thực đơn", onClick }}
/>
```

### Toast

```
toast.success("Đã lưu!") | toast.error("Lỗi") | toast.info("Đã cập nhật")
```

- Auto-dismiss 3s
- Position: top-center (web), top (mobile)
- Swipe dismiss (mobile)

## Organisms (page sections)

### NavBar (Web)

```
<NavBar>
  Logo | Home | Recipes | Meal Plan | [Avatar ▼ Dropdown]
</NavBar>
```

- Sticky top, height 64px
- Background: white, shadow-sm
- Active link: orange-500 underline

### BottomTabBar (Mobile)

```
<BottomTabBar
  tabs={[
    { icon: Home, label: "Home", route: "/" },
    { icon: BookOpen, label: "Món ăn", route: "/recipes" },
    { icon: CalendarDays, label: "Thực đơn", route: "/meal-plan" },
    { icon: User, label: "Cá nhân", route: "/profile" },
  ]}
  activeRoute
/>
```

- Height: 56px + safe area
- Active: orange-500 icon + label
- Inactive: neutral-400 icon + label

### OnboardingStep

```
<OnboardingStep
  step={1}
  totalSteps={5}
  title="Bạn thích ẩm thực vùng nào?"
  onNext
  onBack
  onSkip
>
  {/* step content */}
</OnboardingStep>
```

- Progress bar ở top
- Title centered
- Content area (flexible)
- Bottom: [Bỏ qua] [← Trước] [Tiếp theo →]

### MealPlanGrid

```
<MealPlanGrid
  plan={{ slots, weekStart }}
  onSlotTap
  onSlotSwap
  onSlotLock
  onDragEnd
/>
```

7 columns × 3 rows calendar grid.
- Header: T2, T3, ..., CN
- Row labels: Sáng, Trưa, Tối
- Each cell = MealSlotCard
- Desktop: drag & drop enabled
- Mobile: tap → action sheet

### RecipeGrid

```
<RecipeGrid
  recipes={[]}
  loading?
  onLoadMore?
  columns={{ sm: 1, md: 2, lg: 3 }}
/>
```

Responsive grid of RecipeCards. Infinite scroll hoặc "Load more" button.

### SearchBar

```
<SearchBar
  value
  onChange
  onSubmit
  placeholder="Tìm món ăn..."
  filters={[
    { key: "cuisine", label: "Vùng miền", options: [...] },
    { key: "mealType", label: "Loại bữa", options: [...] },
    { key: "difficulty", label: "Độ khó", options: [...] },
  ]}
  activeFilters
  onFilterChange
/>
```

- Search input + filter chips dropdown
- Debounce: 300ms
- Show active filter count badge

### ProfileSwitcher

```
<ProfileSwitcher
  profiles={[]}
  activeProfileId
  isFamilyMode
  onSelect
  onFamilyMode
/>
```

Horizontal scrollable avatars + "Cả gia đình" option.

## Layout Templates

### PageLayout

```
<PageLayout title? showBack? rightAction?>
  {children}
</PageLayout>
```

- Web: NavBar + content area (max-width 1280px, centered)
- Mobile: Header bar + scrollable content + BottomTabBar

### DetailLayout

```
<DetailLayout>
  <DetailLayout.Hero>{/* image */}</DetailLayout.Hero>
  <DetailLayout.Content>{/* body */}</DetailLayout.Content>
  <DetailLayout.Sidebar>{/* nutrition, related */}</DetailLayout.Sidebar>
</DetailLayout>
```

- Mobile: Hero full width → Content stacked
- Desktop: Hero + Content (8 cols) + Sidebar (4 cols)

### FormLayout

```
<FormLayout title? onSubmit onCancel>
  <FormField />
  <FormField />
</FormLayout>
```

- Max-width 640px, centered
- Submit + Cancel buttons at bottom

# Design System — MealMind

Tài liệu này là source of truth cho mọi quyết định visual. Agent PHẢI tuân theo khi code UI.

## Brand Identity

- **Tone:** Thân thiện, ấm áp, đáng tin cậy — như một người bạn nấu ăn
- **Feel:** Clean, modern, nhưng không lạnh lẽo — có hơi ấm của bếp nhà
- **Target:** Mẹ bận rộn (35 tuổi) đến bác cao tuổi (60 tuổi) — UI phải DỄ dùng

## Colors

### Primary Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary-50` | `#FFF7ED` | Background subtle |
| `--color-primary-100` | `#FFEDD5` | Background light |
| `--color-primary-200` | `#FED7AA` | Border light |
| `--color-primary-300` | `#FDBA74` | Icon secondary |
| `--color-primary-400` | `#FB923C` | Hover state |
| `--color-primary-500` | `#F97316` | **Primary brand color** — buttons, links, active states |
| `--color-primary-600` | `#EA580C` | Button hover |
| `--color-primary-700` | `#C2410C` | Text on light bg |
| `--color-primary-800` | `#9A3412` | Heading emphasis |
| `--color-primary-900` | `#7C2D12` | Dark accent |

Tailwind: dùng `orange-500` là primary. Config trong `packages/config/tailwind`.

### Semantic Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--color-success` | `#16A34A` (green-600) | `#4ADE80` | Trong target, bookmark active |
| `--color-warning` | `#CA8A04` (yellow-600) | `#FACC15` | Gần vượt target |
| `--color-error` | `#DC2626` (red-600) | `#F87171` | Vượt target, validation error |
| `--color-info` | `#2563EB` (blue-600) | `#60A5FA` | Tips, info badge |

### Neutral Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-neutral-50` | `#FAFAF9` | Page background |
| `--color-neutral-100` | `#F5F5F4` | Card background |
| `--color-neutral-200` | `#E7E5E4` | Border, divider |
| `--color-neutral-300` | `#D6D3D1` | Disabled border |
| `--color-neutral-400` | `#A8A29E` | Placeholder text |
| `--color-neutral-500` | `#78716C` | Secondary text |
| `--color-neutral-600` | `#57534E` | Body text |
| `--color-neutral-700` | `#44403C` | Heading text |
| `--color-neutral-800` | `#292524` | Primary text |
| `--color-neutral-900` | `#1C1917` | High contrast text |

Tailwind: dùng `stone` scale.

### Dark Mode (Phase 2)

Không implement dark mode trong MVP. Reserve token names cho sau.

## Typography

### Font Stack

```css
--font-sans: 'Inter', 'Noto Sans Vietnamese', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace; /* chỉ cho code/timer */
```

**Inter** — Main font. Hỗ trợ Vietnamese tốt, legible ở mọi size.
**Noto Sans Vietnamese** — Fallback cho Vietnamese diacritics.

### Type Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `text-display` | 36px / 2.25rem | 700 (bold) | 1.2 | Hero title (hiếm dùng) |
| `text-h1` | 30px / 1.875rem | 700 | 1.3 | Page title |
| `text-h2` | 24px / 1.5rem | 600 (semibold) | 1.35 | Section title |
| `text-h3` | 20px / 1.25rem | 600 | 1.4 | Card title, modal title |
| `text-h4` | 18px / 1.125rem | 600 | 1.4 | Subsection |
| `text-body-lg` | 18px / 1.125rem | 400 (regular) | 1.6 | Large body (recipe description) |
| `text-body` | 16px / 1rem | 400 | 1.6 | **Default body text** |
| `text-body-sm` | 14px / 0.875rem | 400 | 1.5 | Secondary info, meta |
| `text-caption` | 12px / 0.75rem | 500 (medium) | 1.4 | Labels, badges, timestamps |
| `text-overline` | 11px / 0.6875rem | 600 | 1.2 | Uppercase labels, category |

### Accessibility

- Body text tối thiểu 16px (không bao giờ nhỏ hơn 14px)
- Heading contrast ratio ≥ 7:1 (AAA) trên neutral-50 background
- Body text contrast ratio ≥ 4.5:1 (AA)
- Persona "Bác Hương" (60 tuổi) → UI phải readable ở 16px minimum

## Spacing

Dùng 4px base unit. Tailwind default spacing.

| Token | Value | Usage |
|-------|-------|-------|
| `space-0` | 0px | |
| `space-1` | 4px | Inline spacing, icon gap |
| `space-2` | 8px | Compact padding, chip gap |
| `space-3` | 12px | Input padding, list item gap |
| `space-4` | 16px | **Standard padding**, card padding |
| `space-5` | 20px | Section gap |
| `space-6` | 24px | Card gap, section padding |
| `space-8` | 32px | Page section gap |
| `space-10` | 40px | Large section gap |
| `space-12` | 48px | Page top/bottom padding |
| `space-16` | 64px | Hero section padding |

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 4px | Chips, small elements |
| `rounded` | 8px | **Buttons, inputs, cards** |
| `rounded-lg` | 12px | Modal, large cards |
| `rounded-xl` | 16px | Bottom sheet (mobile) |
| `rounded-full` | 9999px | Avatar, icon button |

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Card subtle |
| `shadow` | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | **Card default** |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Dropdown, popover |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modal |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.1)` | Toast, floating action |

## Breakpoints

| Token | Width | Target |
|-------|-------|--------|
| `sm` | 640px | Large phone landscape |
| `md` | 768px | Tablet portrait |
| `lg` | 1024px | Tablet landscape / small laptop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |

### Layout Strategy

- **Mobile-first** — Viết CSS cho mobile trước, `md:` và `lg:` cho tablet/desktop
- Web app max-width: `1280px`, centered
- Content max-width: `768px` (cho reading pages like recipe detail)
- Grid: 4 columns (mobile) → 8 (tablet) → 12 (desktop)

## Icons

- **Library:** Lucide React (`lucide-react`) — consistent, tree-shakeable
- **Size:** 20px default, 16px small, 24px large
- **Stroke:** 2px
- **Color:** inherit from parent text color

### Icon Mapping

| Concept | Icon | Lucide name |
|---------|------|-------------|
| Home | 🏠 | `Home` |
| Search | 🔍 | `Search` |
| Recipe/Cookbook | 📖 | `BookOpen` |
| Meal Plan | 📅 | `CalendarDays` |
| Profile | 👤 | `User` |
| Bookmark | ♥ | `Heart` (outline) / `HeartFilled` (filled) |
| Timer | ⏱ | `Timer` |
| Nutrition | 📊 | `BarChart3` |
| Filter | 🔽 | `SlidersHorizontal` |
| Lock | 🔒 | `Lock` / `Unlock` |
| Swap | 🔄 | `ArrowLeftRight` |
| Add | ➕ | `Plus` |
| Close | ✕ | `X` |
| Back | ← | `ChevronLeft` |
| Settings | ⚙ | `Settings` |
| Surprise | 🎲 | `Dice5` |
| Share | 📤 | `Share2` |
| Star/Rating | ⭐ | `Star` |
| Warning | ⚠ | `AlertTriangle` |
| Success | ✓ | `CheckCircle` |
| Clock | 🕐 | `Clock` |
| Fire/Calories | 🔥 | `Flame` |
| Spicy | 🌶 | `Flame` (red) |

## Animation & Motion

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | 150ms | `ease-out` | Button hover, toggle |
| Short | 200ms | `ease-in-out` | Fade in/out, expand |
| Medium | 300ms | `ease-in-out` | Slide, modal open |
| Long | 500ms | `ease-in-out` | Page transition |

### Swipe (Mobile)

- Suggestion cards: swipe velocity > 0.5 → trigger action
- Swipe right: green overlay + check icon → accept
- Swipe left: red overlay + X icon → skip
- Bounce back nếu velocity < 0.5

### Loading States

- Skeleton loading cho cards, lists (shimmer animation)
- Spinner cho actions (generate meal plan, refresh suggestions)
- Progress bar cho onboarding quiz

### Transitions

```css
/* Default transition for interactive elements */
transition: all 200ms ease-in-out;

/* Page transitions (Next.js) */
/* Fade in 300ms on route change */
```

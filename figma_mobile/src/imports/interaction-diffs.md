# Mobile Interaction Differences

File này chỉ ghi **phần khác biệt mobile so với web**. Logic chung (API calls, validation, data flow) xem `docs/ui/web/interactions/`.

---

## Nguyên tắc: Web → Mobile mapping

| Web | Mobile |
|-----|--------|
| Click button | Tap (onPress) |
| Hover state | Không có — dùng pressed state (opacity 0.7) |
| Modal / Dialog | Bottom Sheet (`@gorhom/bottom-sheet`) |
| Confirm dialog | `Alert.alert()` (native OS dialog) |
| Dropdown select | ActionSheet (iOS) / Bottom Sheet (Android) |
| Tooltip | Không có — dùng inline text hoặc info icon + bottom sheet |
| URL query params (filter) | Local state (Zustand hoặc useState) |
| Infinite scroll (IntersectionObserver) | `FlatList` `onEndReached` |
| Drag & drop | Long press + haptic → reorder (react-native-reanimated) |
| Keyboard shortcut | Không có |
| Right-click context menu | Long press → ActionSheet |
| Copy link | Share sheet (`Share.share()`) |
| Toast | `react-native-toast-message` (top position) |
| Page transition | Stack navigator slide animation |

---

## Screen-by-Screen Differences

### S01 Login — Mobile
| # | Diff | Web | Mobile |
|---|------|-----|--------|
| 1 | Keyboard | — | `KeyboardAvoidingView` behavior="padding" (iOS), "height" (Android) |
| 2 | Input chain | Tab between inputs | `returnKeyType="next"` → focus next. Last input `returnKeyType="done"` → submit |
| 3 | Google OAuth | Redirect flow | `@react-native-google-signin/google-signin` → ID token |
| 4 | Apple Sign In | Web JS SDK | `@invertase/react-native-apple-authentication` |
| 5 | Token storage | Memory (access) + httpOnly cookie (refresh) | `react-native-keychain` (both encrypted) |
| 6 | Error display | Toast (top-center) | `Alert.alert()` for critical, Toast for minor |
| 7 | Biometric | — | Phase 2: Face ID / Touch ID after first login |

### S05-S09 Onboarding — Mobile
| # | Diff | Web | Mobile |
|---|------|-----|--------|
| 1 | Step navigation | URL ?step=N | Internal state + swipe gesture between steps |
| 2 | Slider | Mouse drag | Touch drag + haptic on value change |
| 3 | Autocomplete (S07) | Dropdown below input | Keyboard pushes up, dropdown overlays above keyboard |
| 4 | Completion animation | CSS animation | Lottie animation (`lottie-react-native`) |

### S10 Home — Mobile
| # | Diff | Web | Mobile |
|---|------|-----|--------|
| 1 | Suggestion cards | Carousel / vertical list + click buttons | **Swipe card stack** (PanResponder / Reanimated) |
| 2 | Accept/Skip | Click "Chọn" / "Bỏ qua" buttons | Swipe right / left + buttons as fallback |
| 3 | Swipe feedback | — | Rotation ±15° + color overlay + haptic vibration |
| 4 | Pull-to-refresh | — | `RefreshControl` on ScrollView |
| 5 | Meal type tabs | Click | Tap + horizontal scroll if many |
| 6 | Interaction batch | `useInterval` + `beforeunload` | `useInterval` + `AppState` listener (background → flush) |

### S14 Recipe List — Mobile
| # | Diff | Web | Mobile |
|---|------|-----|--------|
| 1 | Grid | CSS Grid 2-3 columns | `FlatList` `numColumns={2}` |
| 2 | Search | URL sync (?q=) | Local state, no URL |
| 3 | Filters | Dropdown popovers | Tap chip → ActionSheet / Bottom Sheet |
| 4 | Sort | Dropdown | ActionSheet |
| 5 | Infinite scroll | IntersectionObserver | `onEndReached` + `onEndReachedThreshold={0.5}` |
| 6 | Pull-to-refresh | — | `RefreshControl` |

### S15 Recipe Detail — Mobile
| # | Diff | Web | Mobile |
|---|------|-----|--------|
| 1 | Hero image | Static | Parallax scroll (image shrinks on scroll) |
| 2 | Back/Bookmark/Share | Header bar buttons | **Floating** on hero image (white + shadow) |
| 3 | Status bar | — | Transparent on hero, revert on scroll |
| 4 | Timer | In-page widget | Background timer + push notification on complete |
| 5 | Share | `navigator.share()` / copy | `Share.share({ message, url })` native |
| 6 | Ingredient checkbox | Click | Tap entire row |
| 7 | Tabs | Click tabs | Swipeable tabs (react-native-tab-view) |
| 8 | Zoom image | Lightbox modal | Pinch-to-zoom (react-native-image-zoom-viewer) |

### S18 Meal Plan Detail — Mobile
| # | Diff | Web | Mobile |
|---|------|-----|--------|
| 1 | Grid layout | 7×3 calendar grid (all visible) | **Day tabs** (horizontal scroll) + vertical meal list per day |
| 2 | Slot actions | Click → popover | Tap → ActionSheet. Long press → same ActionSheet |
| 3 | Drag & drop | Mouse drag between cells | **Không có drag** — dùng "Đổi món" flow thay thế |
| 4 | Regenerate confirm | Modal | `Alert.alert("Tạo lại?", message, [Hủy, Tạo lại])` |
| 5 | Share modal | Modal with form | Bottom Sheet (85%) with form |
| 6 | Status change | Dropdown | ActionSheet: [Draft, Active, Archive, Hủy] |

### S19 Slot Swap — Mobile
| # | Diff | Web | Mobile |
|---|------|-----|--------|
| 1 | Container | Modal (center) | Bottom Sheet (85%) |
| 2 | Alternative cards | Vertical list in modal | Vertical list in bottom sheet, scrollable |
| 3 | "Chọn" button | Click | Tap + haptic feedback + auto-close sheet |

### S20 Weekly Nutrition — Mobile
| # | Diff | Web | Mobile |
|---|------|-----|--------|
| 1 | Bar chart | Full 7-day chart | Horizontal scroll chart (react-native-chart-kit) |
| 2 | Day detail | Expandable sections | Expandable accordion |

### S21 Profile — Mobile
| # | Diff | Web | Mobile |
|---|------|-----|--------|
| 1 | Logout confirm | Custom modal | `Alert.alert("Đăng xuất?", ..., [Hủy, {text: "Đăng xuất", style: "destructive"}])` |
| 2 | Pull-to-refresh | — | `RefreshControl` |
| 3 | Navigation | URL routing | Stack push to sub-screens |

### S25 Family Profiles — Mobile
| # | Diff | Web | Mobile |
|---|------|-----|--------|
| 1 | Delete | Custom confirm dialog | Swipe-to-delete on card OR `Alert.alert()` |
| 2 | Add/Edit modal | Center modal | Bottom Sheet (85%) |
| 3 | Avatar selector | Grid of emoji | Horizontal scroll row of emoji |

---

## Native Modules Needed

| Module | Purpose | Screens |
|--------|---------|---------|
| `react-native-keychain` | Encrypted token storage | Auth (all) |
| `@react-native-google-signin/google-signin` | Google OAuth | S01, S02 |
| `@invertase/react-native-apple-authentication` | Apple Sign In | S01, S02 |
| `@gorhom/bottom-sheet` | Bottom sheets | S11, S14, S18, S19, S25 |
| `react-native-reanimated` | Animations, gestures | S10 (swipe), S15 (parallax) |
| `react-native-gesture-handler` | Gesture recognition | S10, S15, S18 |
| `lottie-react-native` | Lottie animations | S09 (completion) |
| `react-native-fast-image` | Image caching | All screens with images |
| `react-native-toast-message` | Toast notifications | All screens |
| `react-native-chart-kit` | Nutrition charts | S20 |
| `@react-native-community/push-notification-ios` | iOS push | Timer, suggestions |
| `react-native-push-notification` | Android push | Timer, suggestions |
| `react-native-share` | Native share sheet | S15, S18 |
| `react-native-image-zoom-viewer` | Pinch zoom | S15 (hero image) |

---

## App Lifecycle Events

| Event | Handler | Action |
|-------|---------|--------|
| App goes to background | `AppState` listener | Flush interaction queue, pause timers display |
| App comes to foreground | `AppState` listener | Check token expiry, refresh if needed, refetch active screen data |
| Deep link received | `Linking` listener | Parse `mealmind://` scheme → navigate to screen |
| Push notification tapped | Notification handler | Navigate to relevant screen based on payload |
| Network lost | `NetInfo` listener | Show offline banner, switch to cached data |
| Network restored | `NetInfo` listener | Hide banner, refetch current screen |

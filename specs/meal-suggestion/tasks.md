# F2: Smart Meal Suggestion — Tasks

## AI/ML Service (Python)

- [ ] MS-001: Setup recommendation service — FastAPI, kết nối PostgreSQL và Redis, health endpoint
- [ ] MS-002: Content-based filtering model — similarity giữa taste profile vector và recipe feature vector
- [ ] MS-003: Popularity-based fallback (cold start) — ranking theo popularity score, trọng số theo vùng miền
- [ ] MS-004: Context engine — weather API, logic ngày/mùa/thời gian, recent history filter
- [ ] MS-009: Diversity controller — không trùng cuisine, cân bằng difficulty, spread cook time
- [ ] MS-010: Surprise me algorithm — loại trừ 30 ngày gần đây, ưu tiên cuisine ít tương tác
- [ ] MS-011: Combo generation algorithm — role assignment (main/soup/vegetable), nutrition balance check
- [ ] MS-012: Explainability module — generate lý do gợi ý bằng tiếng Việt từ score breakdown

## Backend (NestJS)

- [ ] MS-005: GET /suggestions — nhận params (mealType, profileId, limit), gọi recommendation service, trả kết quả
  - Screens: S10 Home (web), M-S10 Home (mobile)
- [ ] MS-013: GET /suggestions/surprise — Surprise me! Spin animation reveal. Screen S12/M-S12.
- [ ] MS-014: GET /suggestions/combo — Combo 3 món (main + soup + vegetable). Screen S11/M-S11.
- [ ] MS-015: POST /suggestions/combo/swap — Swap 1 món trong combo, recalculate nutrition
- [ ] MS-016: POST /suggestions/refresh — Refresh thêm batch mới, loại excludeRecipeIds
- [ ] MS-017: GET /suggestions/context — Context hiện tại (giờ, thời tiết, mùa) — debug/display
- [ ] MS-008: POST /interactions — Ghi interaction (cook, view, skip, bookmark) batch async
- [ ] MS-018: Rate limiting — 50 req/ngày (Free), unlimited (Pro), 429 khi vượt
- [ ] MS-019: Weather API integration — OpenWeatherMap, cache 30 phút trong Redis

## Frontend (Web)

- [ ] MS-006: HomeScreen S10 — suggestion cards với meal type tabs, scroll load more, swipe/click to detail
  - Wireframe: `docs/ui/web/screens/03-suggestion.md#S10`
  - Interactions: `docs/ui/web/interactions/03-suggestion.md`
- [ ] MS-020: SuggestionCard component (web) — ảnh, tên, cookTime, calories, reason chip, bookmark, tags
- [ ] MS-021: SurpriseMeScreen S12 (web) — animated reveal, "Nấu món này" + "Thử lại"
  - Wireframe: `docs/ui/web/screens/03-suggestion-extra.md#S12`
- [ ] MS-022: ComboView S11 (web) — set 3 món, tổng nutrition, swap button per slot
  - Wireframe: `docs/ui/web/screens/03-suggestion.md#S11`
- [ ] MS-023: Load more mechanism (web) — "Xem thêm gợi ý" button + infinite scroll
- [ ] MS-024: Interaction tracking client (web) — buffer events, flush mỗi 30s hoặc 10 events

## Frontend (Mobile)

- [ ] MS-007: HomeScreen M-S10 — swipe cards (giống Tinder), meal type tab bar, animation
  - Wireframe: `docs/ui/mobile/screens/03-main.md#M-S10`
- [ ] MS-025: Meal type selector (mobile) — segment control hoặc tab bar tự động chọn theo giờ
- [ ] MS-026: SurpriseMeScreen M-S12 — slot machine Lottie animation, 3D card flip (react-native-reanimated), haptic notificationSuccess, shake-to-retry
  - Wireframe: `docs/ui/mobile/screens/03-suggestion-full.md#M-S12`
- [ ] MS-027: QuickCookScreen M-S13 — FlatList single-col full-width cards, maxCookTime=15, auto meal type từ giờ, pull-to-refresh, infinite scroll
  - Wireframe: `docs/ui/mobile/screens/03-suggestion-full.md#M-S13`
- [ ] MS-028: ComboView M-S11 (mobile) — vertical list 3 món, nutrition tổng, swap gesture → SlotSwapSheet
  - Wireframe: `docs/ui/mobile/screens/03-main.md#M-S11`
- [ ] MS-029: Interaction tracking client (mobile) — batch event tracking React Native

## Testing

- [ ] MS-030: Unit tests — content-based model, context engine, diversity controller, combo generation, surprise algorithm
- [ ] MS-031: Integration tests — suggestion pipeline: request > context > ranking > filter > response
- [ ] MS-032: Load tests — suggestion API < 500ms p95 với 100 concurrent users

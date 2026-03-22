# Hướng Dẫn Ra Lệnh Cho AI Coding Agents

Tài liệu dành cho owner — cách sử dụng bộ tài liệu MealMind để ra lệnh cho bất kỳ AI nào (Claude, Cursor, Codex, Copilot, Antigravity...) code đúng.

---

## Nguyên tắc vàng

1. **Luôn bắt đầu bằng:** `Đọc AGENTS.md` — đây là "hiến pháp", mọi agent phải tuân theo
2. **Mỗi lệnh gắn 1 feature cụ thể** — không lệnh chung chung "code cho tôi cái app"
3. **Chỉ rõ file spec** — đừng mô tả lại nghiệp vụ, trỏ đến spec đã viết sẵn
4. **Yêu cầu verify** — kết thúc lệnh bằng "chạy test + lint"
5. **1 agent = 1 task** — không giao 1 agent làm 5 feature cùng lúc

---

## Bản đồ tài liệu — khi nào trỏ đến file nào

```
Lệnh về gì?              → Trỏ agent đến file nào
─────────────────────────────────────────────────
Quy tắc chung            → AGENTS.md
Cấu trúc code            → PROJECT_MAP.md
Task list                 → TASKS.md
Nghiệp vụ feature        → specs/<feature>/spec.md
API endpoints             → specs/<feature>/api.yaml
Tiêu chí hoàn thành      → specs/<feature>/acceptance.md
Task breakdown            → specs/<feature>/tasks.md
Database schema           → services/api/prisma/schema.prisma
                            docs/architecture/database-schema.md
Enum / master data        → docs/data/master-data.md
Error codes               → docs/architecture/error-handling.md
Cách services nói chuyện  → docs/architecture/service-integration.md
Luồng phức tạp            → docs/architecture/sequence-diagrams.md
Frontend state            → docs/architecture/frontend-state.md
Design tokens (shared)    → docs/ui/design-tokens.md
Components (shared)       → docs/ui/components.md
Screen map (tổng)         → docs/ui/screen-map.md
Web wireframes            → docs/ui/web/screens/<flow>.md
Web interactions          → docs/ui/web/interactions/<flow>.md
Mobile platform guide     → docs/ui/mobile/platform-guide.md
Mobile wireframes         → docs/ui/mobile/screens/<flow>.md
Mobile interaction diffs  → docs/ui/mobile/interaction-diffs.md
AI recommendation         → docs/architecture/recommendation-spec.md
Feature phụ thuộc nhau    → docs/architecture/dependency-map.md
```

---

## Template prompt theo loại công việc

### 1. Setup / Infra

```
Đọc AGENTS.md và PROJECT_MAP.md.

[Mô tả task setup cụ thể]

Reference:
- Database schema: services/api/prisma/schema.prisma
- Design system (Tailwind config): docs/ui/design-tokens.md
- System architecture: docs/architecture/system-overview.md

Khi xong: chạy pnpm install && pnpm build && pnpm lint.
Mark task [TASK-ID] done trong TASKS.md.
```

### 2. Backend API (NestJS)

```
Đọc AGENTS.md.

Implement backend cho feature [TÊN FEATURE].

Đọc kỹ theo thứ tự:
1. specs/<feature>/spec.md — nghiệp vụ + business rules
2. specs/<feature>/api.yaml — API contract (endpoints, request/response schemas)
3. specs/<feature>/acceptance.md — tiêu chí done
4. specs/<feature>/tasks.md — task breakdown

Reference thêm:
- Database: services/api/prisma/schema.prisma
- Enums: docs/data/master-data.md
- Error codes: docs/architecture/error-handling.md
- Response format: docs/architecture/api-standards.md

Viết code trong: services/api/src/modules/<feature>/
Viết test trong: services/api/tests/

Khi xong: chạy pnpm test --filter=api && pnpm lint.
```

### 3. Frontend từ Figma

```
Đọc AGENTS.md.

Đây là Figma cho flow [TÊN FLOW]: [FIGMA URL]

Code đầy đủ tất cả screens trong link Figma.

Đọc kỹ:
1. docs/ui/web/interactions/<flow>.md — event từng button, API call, error handling
2. specs/<feature>/api.yaml — API endpoints để gọi
3. docs/architecture/frontend-state.md — TanStack Query keys, Zustand stores

Rules:
- Dùng components từ packages/ui (xem docs/ui/components.md)
- Dùng design tokens từ docs/ui/design-tokens.md
- Validation dùng packages/validation (Zod schemas)
- API calls qua packages/api-client
- State: server data = TanStack Query, UI state = Zustand

Khi xong: chạy pnpm dev:web và verify từng screen hoạt động đúng.
```

### 4. Frontend KHÔNG có Figma (code từ wireframe)

```
Đọc AGENTS.md.

Implement UI cho flow [TÊN FLOW].

Đọc kỹ:
1. docs/ui/web/screens/<flow>.md — wireframe + layout từng screen
2. docs/ui/web/interactions/<flow>.md — event từng button
3. docs/ui/design-tokens.md — colors, typography, spacing
4. docs/ui/components.md — components có sẵn
5. specs/<feature>/api.yaml — API để gọi

Code trong: apps/web/src/features/<feature>/
Dùng components từ packages/ui.

Khi xong: chạy pnpm dev:web && pnpm lint.
```

### 5. Recommendation Service (Python)

```
Đọc AGENTS.md.

Implement recommendation service.

Đọc kỹ:
1. docs/architecture/recommendation-spec.md — pipeline, scoring, project structure
2. docs/architecture/service-integration.md — internal API contract (POST /recommend, /feedback)
3. docs/data/master-data.md — enums (cuisine, mealType, allergens)
4. specs/meal-suggestion/spec.md — business rules cho suggestion

Code trong: services/recommendation/src/
Test trong: services/recommendation/tests/

Khi xong: chạy pytest && service phải respond GET /health.
```

### 6. Fix bug

```
Đọc AGENTS.md.

Bug: [Mô tả bug ngắn gọn]

Steps to reproduce:
1. ...
2. ...

Expected: ...
Actual: ...

Đọc spec liên quan: specs/<feature>/spec.md
Đọc acceptance: specs/<feature>/acceptance.md

Fix bug, viết test cho case này, chạy pnpm test && pnpm lint.
Commit message: fix(<feature>): mô tả fix
```

### 7. Viết test

```
Đọc AGENTS.md.

Viết test cho feature [TÊN FEATURE].

Đọc kỹ:
1. specs/<feature>/acceptance.md — test scenarios
2. specs/<feature>/api.yaml — API contract cần test
3. docs/architecture/error-handling.md — error cases

Viết:
- Unit test: cạnh source file (*.spec.ts)
- Integration test: services/api/tests/ hoặc testing/integration/
- Cover: happy path + validation errors + auth errors + edge cases

Chạy: pnpm test && report coverage.
```

### 8. Mobile App (React Native) từ Figma

```
Đọc AGENTS.md.

Đây là Figma cho flow [TÊN FLOW] mobile: [FIGMA URL]

Code React Native screens cho flow này.

Đọc kỹ:
1. docs/ui/mobile/platform-guide.md — navigation, safe areas, gestures, haptics
2. docs/ui/mobile/screens/{flow}.md — wireframe mobile từng screen
3. docs/ui/mobile/interaction-diffs.md — khác biệt mobile vs web (bottom sheet, ActionSheet, swipe)
4. docs/ui/web/interactions/{flow}.md — API calls + logic chung
5. specs/<feature>/api.yaml — API endpoints

Rules:
- Navigation: React Navigation (native-stack + bottom-tabs)
- Bottom sheets: @gorhom/bottom-sheet (thay modal web)
- Confirm dialogs: Alert.alert() native
- Images: FastImage (caching)
- Tokens: react-native-keychain (encrypted)
- Gestures: react-native-reanimated + gesture-handler
- Pull-to-refresh trên list screens
- Haptic feedback theo docs/ui/mobile/platform-guide.md

Code trong: apps/mobile/src/features/<feature>/
Dùng shared types từ packages/types.
```

### 9. Mobile App (React Native) KHÔNG có Figma (code từ wireframe)

```
Đọc AGENTS.md.

Implement Mobile UI cho flow [TÊN FLOW].

Đọc kỹ:
1. docs/ui/mobile/screens/<flow>.md — wireframe mobile từng screen
2. docs/ui/mobile/platform-guide.md — navigation, safe areas, gestures, haptics
3. docs/ui/mobile/interaction-diffs.md — khác biệt mobile vs web
4. docs/ui/web/interactions/<flow>.md — API calls + business logic chung
5. docs/ui/design-tokens.md — colors, typography (áp dụng React Native)
6. specs/<feature>/api.yaml — API endpoints

Rules:
- Navigation: React Navigation (native-stack + bottom-tabs)
- Bottom sheets: @gorhom/bottom-sheet (thay modal)
- Confirm dialogs: Alert.alert()
- Swipe actions: react-native-reanimated gesture-handler
- Pull-to-refresh trên mọi list screen
- Haptic feedback: Haptics.impactAsync()

Code trong: apps/mobile/src/features/<feature>/
Dùng shared types từ packages/types.

Khi xong: chạy pnpm dev:mobile và verify trên simulator.
```

### 10. Review code của agent khác

```
Đọc AGENTS.md.

Review code trong worklog/review/[TASK-ID].md.

Kiểm tra:
1. Code match spec: specs/<feature>/spec.md
2. API match contract: specs/<feature>/api.yaml
3. Acceptance criteria met: specs/<feature>/acceptance.md
4. Test coverage đủ
5. Lint pass: pnpm lint
6. Không phá API contract cũ

Nếu OK: move worklog sang worklog/done/
Nếu không OK: ghi comment trong worklog file, giữ ở worklog/review/
```

---

## Chạy nhiều agent song song

Xem `docs/architecture/dependency-map.md` để biết task nào chạy song song được.

### Song song được (không phụ thuộc nhau):
```
Agent 1: Backend Auth          ← cùng lúc →  Agent 2: Seed data
Agent 1: Backend Onboarding    ← cùng lúc →  Agent 2: Frontend Auth (từ Figma)
Agent 1: Backend Recipe        ← cùng lúc →  Agent 2: Backend Dietary
Agent 1: Python Recommendation ← cùng lúc →  Agent 2: NestJS API
```

### KHÔNG song song (phải tuần tự):
```
Setup monorepo → rồi mới → Auth → rồi mới → Onboarding
Backend Recipe → rồi mới → Frontend Recipe (cần API chạy)
Onboarding + Dietary → rồi mới → Meal Suggestion (cần profile + filter)
```

---

## Workflow Figma → Code cụ thể

### Web
```
Bước 1: Design 1 flow trong Figma (dùng docs/ui/web/screens/<flow>.md làm reference)
           │
Bước 2: Gửi link Figma + prompt template #3 cho AI
           │
Bước 3: AI code frontend (components + pages + API calls)
           │
Bước 4: Review trên browser (pnpm dev:web)
           │
         ├─ OK → Chuyển flow tiếp theo
         └─ Sửa → "Sửa screen S15: button bookmark không gọi API,
                    xem docs/ui/web/interactions/04-recipe.md #13"
```

### Mobile
```
Bước 1: Design flow trong Figma (dùng docs/ui/mobile/screens/<flow>.md làm reference)
           │
Bước 2: Gửi link Figma + prompt template #8 cho AI
           │
Bước 3: AI code React Native screens (gestures, bottom sheets, haptics)
           │
Bước 4: Review trên simulator (pnpm dev:mobile)
           │
         ├─ OK → Chuyển flow tiếp theo
         └─ Sửa → "Sửa M-S15: swipe bookmark không haptic,
                    xem docs/ui/mobile/interaction-diffs.md"
```

### Không có Figma (dùng wireframe trực tiếp)
```
Web: dùng template #4 (docs/ui/web/screens/ + interactions/)
Mobile: dùng template #9 (docs/ui/mobile/screens/ + interaction-diffs.md)
```

---

## Khi agent hỏi lại hoặc không hiểu

Đừng giải thích lại — trỏ đến file:

| Agent hỏi | Bạn trả lời |
|-----------|-------------|
| "API format thế nào?" | "Đọc docs/architecture/api-standards.md" |
| "Database schema?" | "Đọc services/api/prisma/schema.prisma" |
| "Button này làm gì?" | "Đọc docs/ui/web/interactions/{flow}.md #{số}" |
| "Error trả về gì?" | "Đọc docs/architecture/error-handling.md" |
| "Enum values?" | "Đọc docs/data/master-data.md" |
| "Feature này cần gì trước?" | "Đọc docs/architecture/dependency-map.md" |
| "Business rule?" | "Đọc specs/{feature}/spec.md, phần Business Rules" |
| "Xong chưa?" | "Check specs/{feature}/acceptance.md" |

---

## Thứ tự bắt đầu dự án (checklist)

Xem TASKS.md để track ID cụ thể.

```
── PHASE 0: FOUNDATION ──
□ 1.  Agent: Setup monorepo + infra (template #1) [SETUP-001~004]
□ 2.  Agent: Seed master data — recipes, ingredients, nutrition (template #2) [DATA-001~004]

── PHASE 1: AUTH + ONBOARDING ──
□ 3.  Agent: Backend Auth (template #2, feature=auth) [AUTH-001~006]
□ 4.  Bạn: Design Auth screens trong Figma (S01-S04)
□ 5.  Agent: Frontend Web Auth từ Figma (template #3) [AUTH-007~008]
□ 6.  Agent: Mobile Auth từ Figma (template #8) [AUTH-009]
□ 7.  Agent: Backend Onboarding (template #2) [ONBOARD-001~004]
□ 8.  Bạn: Design Onboarding screens (S05-S09)
□ 9.  Agent: Frontend Web + Mobile Onboarding từ Figma (template #3 + #8)

── PHASE 2: RECIPE + DIETARY ──
□ 10. Agent: Backend Recipe + Dietary (song song) (template #2) [RECIPE-001~008, DIET-001~004]
□ 11. Bạn: Design Recipe screens (S14-S19 web, M-S14~M-S19 mobile)
□ 12. Agent: Frontend Web Recipe từ Figma (template #3)
□ 13. Agent: Mobile Recipe từ Figma (template #8)

── PHASE 3: RECOMMENDATION + HOME ──
□ 14. Agent: Python Recommendation Service (template #5) [ML-001~006]
□ 15. Agent: Backend Meal Suggestion + integrate recommendation [SUGGEST-001~006]
□ 16. Bạn: Design Home/Suggestion screens (S10-S13 web, M-S10~M-S13 mobile)
□ 17. Agent: Frontend Web Home từ Figma (template #3)
□ 18. Agent: Mobile Home từ Figma (template #8)

── PHASE 4: MEAL PLAN + NUTRITION ──
□ 19. Agent: Backend Meal Planning (template #2) [PLAN-001~008]
□ 20. Bạn: Design Meal Plan screens (S20-S25 web, M-S20~M-S25 mobile)
□ 21. Agent: Frontend Web + Mobile Meal Plan từ Figma (template #3 + #8)
□ 22. Agent: Backend Nutrition Tracking [NUTR-001~005]
□ 23. Bạn: Design Profile + Nutrition screens (S26-S36 web, M-S26~M-S38 mobile)
□ 24. Agent: Frontend Web + Mobile Profile từ Figma (template #3 + #8)

── PHASE 5: POLISH + LAUNCH ──
□ 25. Agent: Integration tests (template #7) [TEST-001~008]
□ 26. Agent: E2E tests
□ 27. QA final → soft launch
```

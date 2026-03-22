# Mobile Unit & Integration Tests

## Task
Viết test cho phần mobile app (apps/mobile)

## Status: ✅ Done

## Kết quả
- **9 test suites, 145 tests — ALL PASS**
- Thời gian chạy: ~3.7s

## Files đã tạo

### Testing Infrastructure
- `apps/mobile/jest.config.js` — Jest configuration (node env, babel-jest, path aliases)
- `apps/mobile/jest.setup.js` — Global mocks (fetch, AsyncStorage, navigation, expo modules)

### Unit Tests (cạnh source file)
| File | Tests | Covers |
|------|-------|--------|
| `src/lib/api/client.spec.ts` | 29 | tokenStorage, ApiError, apiRequest, token refresh, convenience wrappers |
| `src/lib/api/auth.spec.ts` | 21 | login, register, forgot/reset/change password, logout, deleteAccount, getMe |
| `src/lib/api/suggestions.spec.ts` | 18 | getSuggestions, getSurprise, getCombo, swapComboItem, refresh, interactions, history |
| `src/lib/api/recipes.spec.ts` | 18 | list, search, getDetail, bookmark/unbookmark, getBookmarks, rate |
| `src/lib/api/mealPlans.spec.ts` | 20 | create, list, getDetail, updateStatus, delete, updateSlot, slotSuggestions, shopping |
| `src/lib/api/onboarding.spec.ts` | 12 | saveStep, submitQuiz, getProgress, family profiles CRUD |
| `src/lib/api/dietary.spec.ts` | 9 | getRestrictions, updateRestrictions, getNutritionGoals, updateNutritionGoals |
| `src/lib/api/notifications.spec.ts` | 5 | list, markRead, delete |
| `src/store/authStore.spec.ts` | 13 | initialize, setUser, updateUser, logout |

### Integration Tests (testing/ directory)
| File | Tests | Covers |
|------|-------|--------|
| `testing/integration/auth-flow.spec.ts` | ~12 | Login→Store→Navigation, Register→Onboarding, App startup, Logout |
| `testing/integration/error-handling.spec.ts` | ~20 | Tất cả error codes từ error-handling.md: AUTH_*, VALIDATION_*, RESOURCE_*, BIZ_*, RATE_*, SERVER_* |

## Coverage
- **API layer (src/lib/api/)**: 100% statements, 100% branches, 100% functions, 100% lines
- **Store (src/store/)**: 100% statements & functions
- **Overall source**: ~10% (UI screens chưa test — cần @testing-library/react-native rendering)

## Error Cases Covered
- AUTH_INVALID_CREDENTIALS, AUTH_EMAIL_EXISTS, AUTH_ACCOUNT_LOCKED, AUTH_RESET_TOKEN_INVALID
- VALIDATION_ERROR, VALIDATION_REQUIRED, VALIDATION_FORMAT, VALIDATION_RANGE
- RESOURCE_NOT_FOUND, RESOURCE_FORBIDDEN, RESOURCE_CONFLICT
- BIZ_MAX_PROFILES, BIZ_CANNOT_DELETE_PRIMARY, BIZ_PLAN_LIMIT, BIZ_LOCK_LIMIT, BIZ_INSUFFICIENT_RECIPES
- RATE_SUGGESTION_LIMIT, RATE_API_LIMIT
- SERVER_INTERNAL, SERVER_RECOMMENDATION_UNAVAILABLE, SERVER_SERVICE_TIMEOUT

## Specs Đã Đọc
- specs/auth/acceptance.md
- specs/onboarding/acceptance.md
- specs/meal-suggestion/acceptance.md
- specs/meal-planning/acceptance.md
- specs/recipe-detail/acceptance.md
- specs/dietary-filter/acceptance.md
- docs/architecture/error-handling.md

## Lưu ý cho agent tiếp theo
1. UI screen tests cần thêm — dùng @testing-library/react-native (đã install)
2. Jest config dùng `testEnvironment: 'node'` thay vì `jest-expo` preset do lỗi Flow syntax với Node.js 24
3. `jest-fetch-mock` đang dùng cho mock fetch — tương thích với jest-expo
4. Integration tests trong `testing/integration/` được include qua testMatch pattern

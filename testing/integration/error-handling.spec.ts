/**
 * Integration tests: Error Handling Consistency
 * Verifies that all API modules handle errors consistently
 * Based on: docs/architecture/error-handling.md
 * Covers: standard error format, all error code categories, default messages
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiError } from '../../src/lib/api/client';

const fetchMock = global.fetch as jest.Mock;

let authApi: typeof import('../../src/lib/api/auth').authApi;
let suggestionsApi: typeof import('../../src/lib/api/suggestions').suggestionsApi;
let recipesApi: typeof import('../../src/lib/api/recipes').recipesApi;
let mealPlansApi: typeof import('../../src/lib/api/mealPlans').mealPlansApi;
let dietaryApi: typeof import('../../src/lib/api/dietary').dietaryApi;

beforeEach(() => {
  fetchMock.resetMocks();
  jest.clearAllMocks();
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue('tok');

  jest.resetModules();
  authApi = require('../../src/lib/api/auth').authApi;
  suggestionsApi = require('../../src/lib/api/suggestions').suggestionsApi;
  recipesApi = require('../../src/lib/api/recipes').recipesApi;
  mealPlansApi = require('../../src/lib/api/mealPlans').mealPlansApi;
  dietaryApi = require('../../src/lib/api/dietary').dietaryApi;
});

// Helper: mock error response
function mockError(status: number, code: string, message: string, details?: unknown) {
  fetchMock.mockResponseOnce(
    JSON.stringify({ data: null, meta: null, error: { code, message, details } }),
    { status },
  );
}

// ─── Standard Error Format ───────────────────────────────────────────────────

describe('Standard error response format', () => {
  it('all errors are ApiError instances', async () => {
    mockError(400, 'VALIDATION_ERROR', 'Dữ liệu không hợp lệ');

    try {
      await suggestionsApi.getSuggestions();
      fail('Should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).status).toBe(400);
      expect((err as ApiError).code).toBe('VALIDATION_ERROR');
      expect((err as ApiError).message).toBe('Dữ liệu không hợp lệ');
    }
  });

  it('error details are preserved', async () => {
    mockError(400, 'VALIDATION_ERROR', 'Field invalid', { field: 'email', reason: 'format' });

    try {
      await recipesApi.list();
      fail('Should have thrown');
    } catch (err) {
      const apiErr = err as ApiError;
      expect(apiErr.details).toEqual({ field: 'email', reason: 'format' });
    }
  });
});

// ─── Auth Error Codes ────────────────────────────────────────────────────────

describe('Auth error codes (AUTH_*)', () => {
  const authErrors = [
    { code: 'AUTH_INVALID_CREDENTIALS', status: 401, message: 'Email hoặc mật khẩu không đúng' },
    { code: 'AUTH_TOKEN_EXPIRED', status: 401, message: 'Phiên đăng nhập đã hết hạn' },
    { code: 'AUTH_TOKEN_INVALID', status: 401, message: 'Token không hợp lệ' },
    { code: 'AUTH_ACCOUNT_LOCKED', status: 429, message: 'Tài khoản tạm khóa, thử lại sau 15 phút' },
    { code: 'AUTH_EMAIL_EXISTS', status: 409, message: 'Email đã được sử dụng' },
    { code: 'AUTH_OAUTH_FAILED', status: 400, message: 'Xác thực Google/Apple thất bại' },
    { code: 'AUTH_RESET_TOKEN_INVALID', status: 400, message: 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn' },
  ];

  authErrors
    .filter((e) => e.status !== 401) // 401s trigger refresh flow, skip for isolated test
    .forEach(({ code, status, message }) => {
      it(`handles ${code} (${status})`, async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
        mockError(status, code, message);

        try {
          await authApi.login('x', 'y');
          fail('Should have thrown');
        } catch (err) {
          expect((err as ApiError).code).toBe(code);
          expect((err as ApiError).status).toBe(status);
          expect((err as ApiError).message).toContain(message.substring(0, 10));
        }
      });
    });
});

// ─── Validation Error Codes ──────────────────────────────────────────────────

describe('Validation error codes (VALIDATION_*)', () => {
  const validationErrors = [
    { code: 'VALIDATION_ERROR', message: 'Dữ liệu không hợp lệ' },
    { code: 'VALIDATION_REQUIRED', message: 'Thiếu trường bắt buộc: email' },
    { code: 'VALIDATION_FORMAT', message: 'email không đúng định dạng' },
    { code: 'VALIDATION_RANGE', message: 'spiceLevel phải trong khoảng 1-5' },
  ];

  validationErrors.forEach(({ code, message }) => {
    it(`handles ${code}`, async () => {
      mockError(400, code, message, { field: 'email' });

      try {
        await recipesApi.list();
        fail('Should have thrown');
      } catch (err) {
        expect((err as ApiError).code).toBe(code);
        expect((err as ApiError).status).toBe(400);
      }
    });
  });
});

// ─── Resource Error Codes ────────────────────────────────────────────────────

describe('Resource error codes (RESOURCE_*)', () => {
  it('RESOURCE_NOT_FOUND (404) from recipe', async () => {
    mockError(404, 'RESOURCE_NOT_FOUND', 'Recipe không tìm thấy');

    await expect(recipesApi.getDetail('999')).rejects.toMatchObject({
      status: 404,
      code: 'RESOURCE_NOT_FOUND',
    });
  });

  it('RESOURCE_FORBIDDEN (403) from dietary', async () => {
    mockError(403, 'RESOURCE_FORBIDDEN', 'Bạn không có quyền truy cập');

    await expect(dietaryApi.getRestrictions('other')).rejects.toMatchObject({
      status: 403,
      code: 'RESOURCE_FORBIDDEN',
    });
  });

  it('RESOURCE_CONFLICT (409) from bookmark', async () => {
    mockError(409, 'RESOURCE_CONFLICT', 'Recipe đã tồn tại');

    await expect(recipesApi.bookmark('r1')).rejects.toMatchObject({
      status: 409,
      code: 'RESOURCE_CONFLICT',
    });
  });
});

// ─── Business Logic Error Codes ──────────────────────────────────────────────

describe('Business logic error codes (BIZ_*)', () => {
  it('BIZ_MAX_PROFILES', async () => {
    const onboardingApi = require('../../src/lib/api/onboarding').onboardingApi;
    mockError(400, 'BIZ_MAX_PROFILES', 'Đã đạt giới hạn 6 profile');

    await expect(
      onboardingApi.createFamilyProfile({
        name: 'Extra',
        emoji: '👤',
        ageGroup: 'adult',
        isActive: true,
      }),
    ).rejects.toMatchObject({ code: 'BIZ_MAX_PROFILES' });
  });

  it('BIZ_PLAN_LIMIT', async () => {
    mockError(400, 'BIZ_PLAN_LIMIT', 'Đã đạt giới hạn 3 meal plan nháp');

    await expect(mealPlansApi.create({ weekStart: '2026-03-16' })).rejects.toMatchObject({
      code: 'BIZ_PLAN_LIMIT',
    });
  });

  it('BIZ_LOCK_LIMIT', async () => {
    mockError(400, 'BIZ_LOCK_LIMIT', 'Không thể lock quá 70% slots');

    await expect(
      mealPlansApi.updateSlot('p1', 'sl1', { isLocked: true }),
    ).rejects.toMatchObject({ code: 'BIZ_LOCK_LIMIT' });
  });

  it('BIZ_INSUFFICIENT_RECIPES', async () => {
    mockError(400, 'BIZ_INSUFFICIENT_RECIPES', 'Không đủ món phù hợp filter để tạo gợi ý');

    await expect(suggestionsApi.getSuggestions()).rejects.toMatchObject({
      code: 'BIZ_INSUFFICIENT_RECIPES',
    });
  });
});

// ─── Rate Limit Error Codes ─────────────────────────────────────────────────

describe('Rate limit error codes (RATE_*)', () => {
  it('RATE_SUGGESTION_LIMIT (429)', async () => {
    mockError(429, 'RATE_SUGGESTION_LIMIT', 'Bạn đã hết lượt gợi ý hôm nay');

    await expect(suggestionsApi.getSuggestions()).rejects.toMatchObject({
      status: 429,
      code: 'RATE_SUGGESTION_LIMIT',
    });
  });

  it('RATE_API_LIMIT (429)', async () => {
    mockError(429, 'RATE_API_LIMIT', 'Quá nhiều request, vui lòng thử lại sau');

    await expect(recipesApi.list()).rejects.toMatchObject({
      status: 429,
      code: 'RATE_API_LIMIT',
    });
  });
});

// ─── Server Error Codes ─────────────────────────────────────────────────────

describe('Server error codes (SERVER_*)', () => {
  it('SERVER_INTERNAL (500)', async () => {
    mockError(500, 'SERVER_INTERNAL', 'Lỗi hệ thống, vui lòng thử lại sau');

    await expect(recipesApi.list()).rejects.toMatchObject({
      status: 500,
      code: 'SERVER_INTERNAL',
    });
  });

  it('SERVER_RECOMMENDATION_UNAVAILABLE (503)', async () => {
    mockError(503, 'SERVER_RECOMMENDATION_UNAVAILABLE', 'Hệ thống gợi ý đang bảo trì');

    await expect(suggestionsApi.getSuggestions()).rejects.toMatchObject({
      status: 503,
      code: 'SERVER_RECOMMENDATION_UNAVAILABLE',
    });
  });

  it('SERVER_SERVICE_TIMEOUT (504)', async () => {
    mockError(504, 'SERVER_SERVICE_TIMEOUT', 'Hệ thống phản hồi chậm, vui lòng thử lại');

    await expect(suggestionsApi.getCombo('lunch')).rejects.toMatchObject({
      status: 504,
      code: 'SERVER_SERVICE_TIMEOUT',
    });
  });
});

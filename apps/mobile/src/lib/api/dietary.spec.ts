/**
 * Unit tests for Dietary API (dietary.ts)
 * Based on: specs/dietary-filter/acceptance.md
 * Covers: getRestrictions, updateRestrictions, getNutritionGoals, updateNutritionGoals
 * Error cases: 404, 400 validation, 403 forbidden
 */
import { dietaryApi } from './dietary';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchMock = global.fetch as jest.Mock;

beforeEach(() => {
  fetchMock.resetMocks();
  jest.clearAllMocks();
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue('tok');
});

const mockRestrictions = {
  userId: 'u1',
  profileId: null,
  dietType: 'vegetarian',
  allergens: ['hải sản', 'đậu phộng'],
  medicalConditions: [],
  customBlacklist: ['mì chính'],
};

const mockNutritionGoals = {
  dailyCalories: 2000,
  proteinGrams: 80,
  carbsGrams: 250,
  fatGrams: 65,
  fiberGrams: 25,
};

// ─── getRestrictions ─────────────────────────────────────────────────────────

describe('dietaryApi.getRestrictions', () => {
  it('returns dietary restrictions for user', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: mockRestrictions }));

    const result = await dietaryApi.getRestrictions('u1');
    expect(result.data.dietType).toBe('vegetarian');
    expect(result.data.allergens).toContain('hải sản');

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('/users/u1/dietary');
  });

  it('supports profileId query param', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: { ...mockRestrictions, profileId: 'fp1' } }));

    await dietaryApi.getRestrictions('u1', 'fp1');

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('profileId=fp1');
  });

  it('throws 404 for non-existent user', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: { code: 'RESOURCE_NOT_FOUND', message: 'User không tìm thấy' },
      }),
      { status: 404 },
    );

    await expect(dietaryApi.getRestrictions('nonexistent')).rejects.toMatchObject({
      status: 404,
      code: 'RESOURCE_NOT_FOUND',
    });
  });
});

// ─── updateRestrictions ──────────────────────────────────────────────────────

describe('dietaryApi.updateRestrictions', () => {
  it('updates dietary restrictions', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: { ...mockRestrictions, dietType: 'keto' } }));

    const result = await dietaryApi.updateRestrictions('u1', { dietType: 'keto' });
    expect(result.data.dietType).toBe('keto');

    expect(fetchMock.mock.calls[0][1]?.method).toBe('PUT');
    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('/users/u1/dietary');
  });

  it('throws 400 for invalid dietType', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Dữ liệu không hợp lệ',
          details: { field: 'dietType', reason: 'dietType không hợp lệ' },
        },
      }),
      { status: 400 },
    );

    await expect(
      dietaryApi.updateRestrictions('u1', { dietType: 'invalid' as any }),
    ).rejects.toMatchObject({
      status: 400,
      code: 'VALIDATION_ERROR',
    });
  });

  it('throws 400 for invalid allergen', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Dữ liệu không hợp lệ',
          details: { field: 'allergens', reason: 'allergen không nằm trong danh sách cho phép' },
        },
      }),
      { status: 400 },
    );

    await expect(
      dietaryApi.updateRestrictions('u1', { allergens: ['invalid_allergen'] }),
    ).rejects.toMatchObject({ status: 400 });
  });

  it('throws 400 when blacklist exceeds 50 items', async () => {
    const longBlacklist = Array.from({ length: 51 }, (_, i) => `item_${i}`);
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Dữ liệu không hợp lệ',
          details: { field: 'customBlacklist', reason: 'Vượt quá 50 items' },
        },
      }),
      { status: 400 },
    );

    await expect(
      dietaryApi.updateRestrictions('u1', { customBlacklist: longBlacklist }),
    ).rejects.toMatchObject({ status: 400 });
  });

  it('throws 403 when updating other user dietary', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: { code: 'RESOURCE_FORBIDDEN', message: 'Bạn không có quyền truy cập' },
      }),
      { status: 403 },
    );

    await expect(
      dietaryApi.updateRestrictions('other_user', { dietType: 'vegan' }),
    ).rejects.toMatchObject({
      status: 403,
      code: 'RESOURCE_FORBIDDEN',
    });
  });
});

// ─── getNutritionGoals ───────────────────────────────────────────────────────

describe('dietaryApi.getNutritionGoals', () => {
  it('returns nutrition goals', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: mockNutritionGoals }));

    const result = await dietaryApi.getNutritionGoals('u1');
    expect(result.data.dailyCalories).toBe(2000);
    expect(result.data.proteinGrams).toBe(80);
  });
});

// ─── updateNutritionGoals ────────────────────────────────────────────────────

describe('dietaryApi.updateNutritionGoals', () => {
  it('updates nutrition goals', async () => {
    const updated = { ...mockNutritionGoals, dailyCalories: 1800 };
    fetchMock.mockResponseOnce(JSON.stringify({ data: updated }));

    const result = await dietaryApi.updateNutritionGoals('u1', updated);
    expect(result.data.dailyCalories).toBe(1800);
    expect(fetchMock.mock.calls[0][1]?.method).toBe('PUT');
  });
});

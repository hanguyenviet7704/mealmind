/**
 * Unit tests for Onboarding API (onboarding.ts)
 * Based on: specs/onboarding/acceptance.md
 * Covers: saveStep, submitQuiz, getProgress, family profiles CRUD
 * Error cases: validation, max profiles, delete primary
 */
import { onboardingApi } from './onboarding';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchMock = global.fetch as jest.Mock;

beforeEach(() => {
  fetchMock.resetMocks();
  jest.clearAllMocks();
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue('tok');
});

const mockTasteProfile = {
  id: 'tp1',
  userId: 'u1',
  cuisinePreferences: ['Bắc', 'Trung'],
  spiceLevel: 3,
  sweetLevel: 2,
  saltyLevel: 4,
  dietType: 'normal',
  allergens: ['hải sản'],
  cookTimePreference: '30-60',
  familySize: 3,
  cookingLevel: 'intermediate',
};

const mockFamilyProfile = {
  id: 'fp1',
  name: 'Bé Minh',
  emoji: '👶',
  ageGroup: 'child',
  dietType: 'normal',
  allergens: ['sữa'],
  isActive: true,
};

// ─── saveStep ────────────────────────────────────────────────────────────────

describe('onboardingApi.saveStep', () => {
  it('auto-saves quiz step data', async () => {
    fetchMock.mockResponseOnce('', { status: 204 });

    await onboardingApi.saveStep(1, { cuisinePreferences: ['Bắc', 'Nam'] });

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('/onboarding/quiz/1');
    expect(fetchMock.mock.calls[0][1]?.method).toBe('PATCH');

    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body.data.cuisinePreferences).toEqual(['Bắc', 'Nam']);
  });

  it('saves each step independently', async () => {
    fetchMock.mockResponseOnce('', { status: 204 });
    fetchMock.mockResponseOnce('', { status: 204 });

    await onboardingApi.saveStep(2, { spiceLevel: 4, sweetLevel: 2, saltyLevel: 3 });
    await onboardingApi.saveStep(3, { allergens: ['hải sản', 'đậu phộng'] });

    const url1 = fetchMock.mock.calls[0][0] as string;
    const url2 = fetchMock.mock.calls[1][0] as string;
    expect(url1).toContain('/quiz/2');
    expect(url2).toContain('/quiz/3');
  });
});

// ─── submitQuiz ──────────────────────────────────────────────────────────────

describe('onboardingApi.submitQuiz', () => {
  it('submits complete quiz and returns taste profile', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: mockTasteProfile }));

    const result = await onboardingApi.submitQuiz({
      cuisinePreferences: ['Bắc', 'Trung'],
      spiceLevel: 3,
      sweetLevel: 2,
      saltyLevel: 4,
      allergens: ['hải sản'],
      dietType: 'normal',
      cookTimePreference: '30-60',
      familySize: 3,
      cookingLevel: 'intermediate',
    });

    expect(result.data.cuisinePreferences).toEqual(['Bắc', 'Trung']);
    expect(fetchMock.mock.calls[0][1]?.method).toBe('POST');
  });

  it('throws VALIDATION_ERROR for invalid data', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: { code: 'VALIDATION_ERROR', message: 'Dữ liệu không hợp lệ', details: { field: 'spiceLevel' } },
      }),
      { status: 400 },
    );

    await expect(
      onboardingApi.submitQuiz({
        cuisinePreferences: [],
        spiceLevel: 99,
        sweetLevel: 0,
        saltyLevel: 0,
        allergens: [],
        dietType: '',
        cookTimePreference: '',
        familySize: 0,
        cookingLevel: '',
      }),
    ).rejects.toMatchObject({ status: 400, code: 'VALIDATION_ERROR' });
  });
});

// ─── getProgress ─────────────────────────────────────────────────────────────

describe('onboardingApi.getProgress', () => {
  it('returns quiz progress', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ data: { completedSteps: [1, 2, 3], lastStep: 3 } }),
    );

    const result = await onboardingApi.getProgress();
    expect(result.data?.completedSteps).toEqual([1, 2, 3]);
    expect(result.data?.lastStep).toBe(3);
  });

  it('returns null for fresh user', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: null }));

    const result = await onboardingApi.getProgress();
    expect(result.data).toBeNull();
  });
});

// ─── Family Profiles ─────────────────────────────────────────────────────────

describe('onboardingApi.getFamilyProfiles', () => {
  it('returns family profiles list', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: [mockFamilyProfile] }));

    const result = await onboardingApi.getFamilyProfiles();
    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe('Bé Minh');
  });
});

describe('onboardingApi.createFamilyProfile', () => {
  it('creates new family profile', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: mockFamilyProfile }));

    const result = await onboardingApi.createFamilyProfile({
      name: 'Bé Minh',
      emoji: '👶',
      ageGroup: 'child',
      allergens: ['sữa'],
      isActive: true,
    });

    expect(result.data.id).toBe('fp1');
    expect(fetchMock.mock.calls[0][1]?.method).toBe('POST');
  });

  it('throws BIZ_MAX_PROFILES when exceeding limit', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: { code: 'BIZ_MAX_PROFILES', message: 'Đã đạt giới hạn 6 profile' },
      }),
      { status: 400 },
    );

    await expect(
      onboardingApi.createFamilyProfile({
        name: 'Extra',
        emoji: '👤',
        ageGroup: 'adult',
        isActive: true,
      }),
    ).rejects.toMatchObject({
      status: 400,
      code: 'BIZ_MAX_PROFILES',
    });
  });
});

describe('onboardingApi.updateFamilyProfile', () => {
  it('updates family profile', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: { ...mockFamilyProfile, name: 'Bé Minh 2' } }));

    const result = await onboardingApi.updateFamilyProfile('fp1', { name: 'Bé Minh 2' });
    expect(result.data.name).toBe('Bé Minh 2');
    expect(fetchMock.mock.calls[0][1]?.method).toBe('PATCH');
    expect(fetchMock.mock.calls[0][0]).toContain('/profiles/family/fp1');
  });
});

describe('onboardingApi.deleteFamilyProfile', () => {
  it('deletes family profile', async () => {
    fetchMock.mockResponseOnce('', { status: 204 });

    await onboardingApi.deleteFamilyProfile('fp1');

    expect(fetchMock.mock.calls[0][1]?.method).toBe('DELETE');
    expect(fetchMock.mock.calls[0][0]).toContain('/profiles/family/fp1');
  });

  it('throws 403 when deleting primary profile (BIZ_CANNOT_DELETE_PRIMARY)', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: { code: 'BIZ_CANNOT_DELETE_PRIMARY', message: 'Không thể xóa profile chính' },
      }),
      { status: 400 },
    );

    await expect(onboardingApi.deleteFamilyProfile('primary')).rejects.toMatchObject({
      status: 400,
      code: 'BIZ_CANNOT_DELETE_PRIMARY',
    });
  });
});

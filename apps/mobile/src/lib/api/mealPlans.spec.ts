/**
 * Unit tests for Meal Plans API (mealPlans.ts)
 * Based on: specs/meal-planning/acceptance.md
 * Covers: create, list, getDetail, updateStatus, delete, updateSlot, getSlotSuggestions,
 *         generateShopping, getShopping, toggleShoppingItem + error cases
 */
import { mealPlansApi } from './mealPlans';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchMock = global.fetch as jest.Mock;

beforeEach(() => {
  fetchMock.resetMocks();
  jest.clearAllMocks();
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue('tok');
});

const mockSlot = {
  id: 'sl1',
  dayOfWeek: 0,
  mealType: 'breakfast',
  recipe: { id: 'r1', name: 'Phở', imageUrl: '', cookTime: 30, difficulty: 'easy', calories: 400, cuisine: 'Bắc', mealTypes: ['breakfast'] },
  servings: 2,
  isLocked: false,
};

const mockPlan = {
  id: 'p1',
  name: 'Tuần 12',
  status: 'draft',
  weekStart: '2026-03-16',
  weekEnd: '2026-03-22',
  totalCalories: 14000,
  slots: [mockSlot],
  createdAt: '2026-03-16T00:00:00Z',
};

// ─── create ──────────────────────────────────────────────────────────────────

describe('mealPlansApi.create', () => {
  it('creates new meal plan', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: mockPlan }));

    const result = await mealPlansApi.create({ weekStart: '2026-03-16' });
    expect(result.data.id).toBe('p1');
    expect(result.data.slots).toHaveLength(1);

    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body.weekStart).toBe('2026-03-16');
    expect(fetchMock.mock.calls[0][1]?.method).toBe('POST');
  });

  it('creates with preferences', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: mockPlan }));

    await mealPlansApi.create({
      weekStart: '2026-03-16',
      name: 'Custom Plan',
      preferences: { excludeRecipeIds: ['r1'], preferredCuisines: ['Bắc'] },
    });

    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body.name).toBe('Custom Plan');
    expect(body.preferences.excludeRecipeIds).toEqual(['r1']);
  });

  it('throws BIZ_PLAN_LIMIT when exceeding draft limit', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: { code: 'BIZ_PLAN_LIMIT', message: 'Đã đạt giới hạn 3 meal plan nháp' },
      }),
      { status: 400 },
    );

    await expect(mealPlansApi.create({ weekStart: '2026-03-16' })).rejects.toMatchObject({
      status: 400,
      code: 'BIZ_PLAN_LIMIT',
    });
  });
});

// ─── list ────────────────────────────────────────────────────────────────────

describe('mealPlansApi.list', () => {
  it('returns plan list', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: [{ id: 'p1', name: 'Tuần 12', status: 'active', weekStart: '2026-03-16', weekEnd: '2026-03-22', totalCalories: 14000, createdAt: '2026-03-16T00:00:00Z' }],
        meta: { total: 1 },
      }),
    );

    const result = await mealPlansApi.list();
    expect(result.data).toHaveLength(1);
  });

  it('filters by status', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: [], meta: { total: 0 } }));

    await mealPlansApi.list({ status: 'active' });

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('status=active');
  });

  it('paginates results', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: [], meta: { total: 0 } }));

    await mealPlansApi.list({ page: 2, pageSize: 5 });

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('page=2');
    expect(url).toContain('pageSize=5');
  });
});

// ─── getDetail ───────────────────────────────────────────────────────────────

describe('mealPlansApi.getDetail', () => {
  it('returns full plan with slots', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: mockPlan }));

    const result = await mealPlansApi.getDetail('p1');
    expect(result.data.slots).toHaveLength(1);
  });

  it('throws 404 for non-existent plan', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ error: { code: 'RESOURCE_NOT_FOUND', message: 'Meal plan không tìm thấy' } }),
      { status: 404 },
    );

    await expect(mealPlansApi.getDetail('nonexistent')).rejects.toMatchObject({
      status: 404,
      code: 'RESOURCE_NOT_FOUND',
    });
  });
});

// ─── updateStatus ────────────────────────────────────────────────────────────

describe('mealPlansApi.updateStatus', () => {
  it('changes plan status to active', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: { ...mockPlan, status: 'active' } }));

    const result = await mealPlansApi.updateStatus('p1', 'active');
    expect(result.data.status).toBe('active');

    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body.status).toBe('active');
    expect(fetchMock.mock.calls[0][1]?.method).toBe('PATCH');
  });

  it('archives a plan', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: { ...mockPlan, status: 'archived' } }));

    const result = await mealPlansApi.updateStatus('p1', 'archived');
    expect(result.data.status).toBe('archived');
  });
});

// ─── delete ──────────────────────────────────────────────────────────────────

describe('mealPlansApi.delete', () => {
  it('deletes a plan', async () => {
    fetchMock.mockResponseOnce('', { status: 204 });

    await mealPlansApi.delete('p1');

    expect(fetchMock.mock.calls[0][1]?.method).toBe('DELETE');
    expect(fetchMock.mock.calls[0][0]).toContain('/meal-plans/p1');
  });
});

// ─── updateSlot ──────────────────────────────────────────────────────────────

describe('mealPlansApi.updateSlot', () => {
  it('swaps recipe in slot', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: { ...mockSlot, recipe: { id: 'r2', name: 'Bún bò' } } }));

    const result = await mealPlansApi.updateSlot('p1', 'sl1', { recipeId: 'r2' });
    expect(result.data.recipe).toBeDefined();

    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body.recipeId).toBe('r2');
  });

  it('locks a slot', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: { ...mockSlot, isLocked: true } }));

    const result = await mealPlansApi.updateSlot('p1', 'sl1', { isLocked: true });
    expect(result.data.isLocked).toBe(true);
  });

  it('throws BIZ_LOCK_LIMIT when locking too many slots', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: { code: 'BIZ_LOCK_LIMIT', message: 'Không thể lock quá 70% slots' },
      }),
      { status: 400 },
    );

    await expect(mealPlansApi.updateSlot('p1', 'sl1', { isLocked: true })).rejects.toMatchObject({
      status: 400,
      code: 'BIZ_LOCK_LIMIT',
    });
  });

  it('clears recipe from slot', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: { ...mockSlot, recipe: null } }));

    await mealPlansApi.updateSlot('p1', 'sl1', { recipeId: null });

    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body.recipeId).toBeNull();
  });
});

// ─── getSlotSuggestions ──────────────────────────────────────────────────────

describe('mealPlansApi.getSlotSuggestions', () => {
  it('returns suggestions for slot', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: [{ id: 'r2', name: 'Bún bò', imageUrl: '', cookTime: 45, difficulty: 'medium', calories: 500, cuisine: 'Trung', mealTypes: ['lunch'] }],
      }),
    );

    const result = await mealPlansApi.getSlotSuggestions('p1', 'sl1');
    expect(result.data).toHaveLength(1);

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('/meal-plans/p1/slots/sl1/suggestions');
  });
});

// ─── Shopping list ───────────────────────────────────────────────────────────

describe('mealPlansApi shopping', () => {
  const mockShopping = {
    id: 'sh1',
    mealPlanId: 'p1',
    items: [
      { id: 'si1', name: 'Thịt bò', amount: 500, unit: 'gram', checked: false, category: 'Thịt' },
      { id: 'si2', name: 'Phở', amount: 400, unit: 'gram', checked: false, category: 'Khô' },
    ],
    generatedAt: '2026-03-16T00:00:00Z',
  };

  it('generates shopping list', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: mockShopping }));

    const result = await mealPlansApi.generateShopping('p1');
    expect(result.data.items).toHaveLength(2);
    expect(fetchMock.mock.calls[0][1]?.method).toBe('POST');
  });

  it('gets existing shopping list', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: mockShopping }));

    const result = await mealPlansApi.getShopping('p1');
    expect(result.data.mealPlanId).toBe('p1');
    expect(fetchMock.mock.calls[0][1]?.method).toBe('GET');
  });

  it('toggles shopping item checked', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: { ...mockShopping.items[0], checked: true } }));

    const result = await mealPlansApi.toggleShoppingItem('si1', true);
    expect(result.data.checked).toBe(true);

    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body.checked).toBe(true);
    expect(fetchMock.mock.calls[0][1]?.method).toBe('PATCH');
  });
});

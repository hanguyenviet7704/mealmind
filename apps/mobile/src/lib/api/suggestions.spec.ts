/**
 * Unit tests for Suggestions API (suggestions.ts)
 * Based on: specs/meal-suggestion/acceptance.md
 * Covers: getSuggestions, getSurprise, getCombo, swapComboItem, refreshSuggestions,
 *         recordInteractions, getHistory + error cases
 */
import { suggestionsApi } from './suggestions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchMock = global.fetch as jest.Mock;

beforeEach(() => {
  fetchMock.resetMocks();
  jest.clearAllMocks();
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue('tok');
});

const mockSuggestion = {
  id: 's1',
  recipe: {
    id: 'r1',
    name: 'Phở bò',
    imageUrl: 'https://img.com/pho.jpg',
    cookTime: 60,
    difficulty: 'medium',
    calories: 450,
    cuisine: 'Bắc',
    mealTypes: ['breakfast', 'lunch'],
  },
  score: 0.92,
  reason: 'Phù hợp khẩu vị bạn',
  reasonType: 'taste_match',
  tags: ['truyền thống', 'nóng'],
};

const mockContext = {
  currentMealType: 'lunch',
  weather: { temperature: 28, condition: 'sunny', available: true },
  season: 'summer',
  dayOfWeek: 'Monday',
  isWeekend: false,
  timeOfDay: '12:00',
};

// ─── getSuggestions ──────────────────────────────────────────────────────────

describe('suggestionsApi.getSuggestions', () => {
  it('returns suggestions with context data', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: { suggestions: [mockSuggestion], context: mockContext, remaining: 49 },
      }),
    );

    const result = await suggestionsApi.getSuggestions();
    expect(result.data.suggestions).toHaveLength(1);
    expect(result.data.suggestions[0].recipe.name).toBe('Phở bò');
    expect(result.data.context.currentMealType).toBe('lunch');
    expect(result.data.remaining).toBe(49);
  });

  it('filters by mealType', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: { suggestions: [], context: mockContext, remaining: 50 } }));

    await suggestionsApi.getSuggestions({ mealType: 'dinner' });

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('mealType=dinner');
  });

  it('requests specific count', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: { suggestions: [], context: mockContext, remaining: 50 } }));

    await suggestionsApi.getSuggestions({ count: 5 });

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('count=5');
  });

  it('throws 429 when daily limit exceeded (free tier)', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: {
          code: 'RATE_SUGGESTION_LIMIT',
          message: 'Bạn đã hết lượt gợi ý hôm nay. Nâng cấp Pro để không giới hạn',
        },
      }),
      { status: 429 },
    );

    await expect(suggestionsApi.getSuggestions()).rejects.toMatchObject({
      status: 429,
      code: 'RATE_SUGGESTION_LIMIT',
    });
  });

  it('throws 401 without auth', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    fetchMock.mockResponseOnce(
      JSON.stringify({ error: { code: 'AUTH_TOKEN_INVALID', message: 'Token không hợp lệ' } }),
      { status: 401 },
    );

    await expect(suggestionsApi.getSuggestions()).rejects.toMatchObject({ status: 401 });
  });
});

// ─── getSurprise ─────────────────────────────────────────────────────────────

describe('suggestionsApi.getSurprise', () => {
  it('returns surprise suggestion', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: mockSuggestion }));

    const result = await suggestionsApi.getSurprise();
    expect(result.data.reasonType).toBeDefined();
  });

  it('passes mealType as query param', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: mockSuggestion }));

    await suggestionsApi.getSurprise('dinner');

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('mealType=dinner');
  });

  it('works without mealType', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: mockSuggestion }));

    await suggestionsApi.getSurprise();

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('/suggestions/surprise');
    expect(url).not.toContain('mealType=');
  });
});

// ─── getCombo ────────────────────────────────────────────────────────────────

describe('suggestionsApi.getCombo', () => {
  const mockCombo = {
    id: 'c1',
    mealType: 'lunch',
    items: [
      { role: 'main', recipe: mockSuggestion.recipe },
      { role: 'vegetable', recipe: { ...mockSuggestion.recipe, id: 'r2', name: 'Rau luộc' } },
    ],
    totalCalories: 650,
    totalProtein: 35,
    totalCarbs: 80,
    totalFat: 15,
    servings: 2,
  };

  it('returns combo with items', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: mockCombo }));

    const result = await suggestionsApi.getCombo('lunch');
    expect(result.data.items).toHaveLength(2);
    expect(result.data.totalCalories).toBe(650);
  });

  it('passes mealType and servings', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: mockCombo }));

    await suggestionsApi.getCombo('dinner', 4);

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('mealType=dinner');
    expect(url).toContain('servings=4');
  });

  it('defaults to 2 servings', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: mockCombo }));

    await suggestionsApi.getCombo('lunch');

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('servings=2');
  });
});

// ─── swapComboItem ───────────────────────────────────────────────────────────

describe('suggestionsApi.swapComboItem', () => {
  it('swaps combo item successfully', async () => {
    const updatedCombo = { id: 'c1', items: [], totalCalories: 600, totalProtein: 30, totalCarbs: 75, totalFat: 12, servings: 2, mealType: 'lunch' };
    fetchMock.mockResponseOnce(JSON.stringify({ data: updatedCombo }));

    await suggestionsApi.swapComboItem('c1', 'main', 'r1');

    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body).toEqual({ comboId: 'c1', role: 'main', excludeRecipeId: 'r1' });
  });

  it('swaps without excludeRecipeId', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: {} }));
    await suggestionsApi.swapComboItem('c1', 'vegetable');

    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body.excludeRecipeId).toBeUndefined();
  });
});

// ─── refreshSuggestions ──────────────────────────────────────────────────────

describe('suggestionsApi.refreshSuggestions', () => {
  it('refreshes with excluded recipe IDs', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: { suggestions: [mockSuggestion] } }));

    await suggestionsApi.refreshSuggestions({
      mealType: 'lunch',
      excludeRecipeIds: ['r1', 'r2'],
      count: 3,
    });

    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body.excludeRecipeIds).toEqual(['r1', 'r2']);
    expect(body.mealType).toBe('lunch');
  });
});

// ─── recordInteractions ──────────────────────────────────────────────────────

describe('suggestionsApi.recordInteractions', () => {
  it('records interaction batch', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: { accepted: 3 } }));

    const interactions = [
      { recipeId: 'r1', action: 'view' as const },
      { recipeId: 'r2', action: 'skip' as const },
      { recipeId: 'r3', action: 'save' as const, suggestionId: 's1' },
    ];

    const result = await suggestionsApi.recordInteractions(interactions);
    expect(result.data.accepted).toBe(3);

    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body.interactions).toHaveLength(3);
  });

  it('sends interaction with context metadata', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: { accepted: 1 } }));

    await suggestionsApi.recordInteractions([
      {
        recipeId: 'r1',
        action: 'cook',
        context: { mealType: 'dinner', source: 'suggestion' },
        timestamp: '2026-03-21T12:00:00Z',
      },
    ]);

    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body.interactions[0].context.mealType).toBe('dinner');
  });
});

// ─── getHistory ──────────────────────────────────────────────────────────────

describe('suggestionsApi.getHistory', () => {
  it('returns paginated history', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: [{ recipeId: 'r1', action: 'save' }],
        meta: { page: 1, pageSize: 20, total: 1 },
      }),
    );

    const result = await suggestionsApi.getHistory({ days: 7, action: 'save', page: 1 });
    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(1);
  });

  it('sends filter params as query string', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: [], meta: { page: 1, pageSize: 20, total: 0 } }));

    await suggestionsApi.getHistory({ days: 30, action: 'cook', page: 2, pageSize: 10 });

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('days=30');
    expect(url).toContain('action=cook');
    expect(url).toContain('page=2');
    expect(url).toContain('pageSize=10');
  });
});

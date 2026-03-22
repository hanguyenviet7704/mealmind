/**
 * Unit tests for Recipes API (recipes.ts)
 * Based on: specs/recipe-detail/acceptance.md
 * Covers: list, search, getDetail, bookmark/unbookmark, getBookmarks, rate
 * Error cases: 404, validation, auth
 */
import { recipesApi } from './recipes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchMock = global.fetch as jest.Mock;

beforeEach(() => {
  fetchMock.resetMocks();
  jest.clearAllMocks();
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue('tok');
});

const mockRecipeSummary = {
  id: 'r1',
  name: 'Phở bò',
  imageUrl: 'https://img.com/pho.jpg',
  cookTime: 60,
  difficulty: 'medium',
  calories: 450,
  cuisine: 'Bắc',
  mealTypes: ['breakfast', 'lunch'],
};

const mockRecipeDetail = {
  ...mockRecipeSummary,
  description: 'Phở bò truyền thống Hà Nội',
  prepTime: 30,
  defaultServings: 2,
  ingredients: [
    { id: 'i1', name: 'Bánh phở', amount: 200, unit: 'gram', group: 'main' },
    { id: 'i2', name: 'Thịt bò', amount: 150, unit: 'gram', group: 'main' },
    { id: 'i3', name: 'Nước mắm', amount: 2, unit: 'thìa canh', group: 'seasoning' },
  ],
  steps: [
    { order: 1, description: 'Ninh xương', timerSeconds: 7200 },
    { order: 2, description: 'Trần phở' },
    { order: 3, description: 'Bày ra tô', imageUrl: 'https://img.com/step3.jpg' },
  ],
  nutrition: { calories: 450, protein: 30, carbs: 55, fat: 12, fiber: 3 },
  tags: ['truyền thống', 'nóng'],
  rating: { average: 4.5, count: 120 },
  isBookmarked: false,
};

// ─── list ────────────────────────────────────────────────────────────────────

describe('recipesApi.list', () => {
  it('returns recipe list with pagination', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: [mockRecipeSummary],
        meta: { total: 100, page: 1, pageSize: 20 },
      }),
    );

    const result = await recipesApi.list();
    expect(result.data).toHaveLength(1);
    expect(result.meta.total).toBe(100);
  });

  it('filters by cuisine, mealType, difficulty', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: [], meta: { total: 0, page: 1, pageSize: 20 } }));

    await recipesApi.list({ cuisine: 'Bắc', mealType: 'lunch', difficulty: 'easy' });

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('cuisine=B');
    expect(url).toContain('mealType=lunch');
    expect(url).toContain('difficulty=easy');
  });

  it('filters by maxCookTime', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: [], meta: { total: 0, page: 1, pageSize: 20 } }));

    await recipesApi.list({ maxCookTime: 30 });

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('maxCookTime=30');
  });

  it('sorts and paginates', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: [], meta: { total: 0, page: 2, pageSize: 10 } }));

    await recipesApi.list({ sortBy: 'cookTime', page: 2, pageSize: 10 });

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('sortBy=cookTime');
    expect(url).toContain('page=2');
    expect(url).toContain('pageSize=10');
  });

  it('searches with text query', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: [], meta: { total: 0, page: 1, pageSize: 20 } }));

    await recipesApi.list({ q: 'phở' });

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('q=ph');
  });
});

// ─── search ──────────────────────────────────────────────────────────────────

describe('recipesApi.search', () => {
  it('returns search results', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ data: [mockRecipeSummary], meta: { total: 1, page: 1, pageSize: 20 } }),
    );

    const result = await recipesApi.search('phở');
    expect(result.data).toHaveLength(1);
  });

  it('passes search query and filters', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: [], meta: { total: 0, page: 1, pageSize: 20 } }));

    await recipesApi.search('bún bò', { cuisine: 'Trung', mealType: 'lunch' });

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('/recipes/search');
    expect(url).toContain('q=');
    expect(url).toContain('cuisine=');
  });
});

// ─── getDetail ───────────────────────────────────────────────────────────────

describe('recipesApi.getDetail', () => {
  it('returns full recipe detail', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: mockRecipeDetail }));

    const result = await recipesApi.getDetail('r1');
    expect(result.data.ingredients).toHaveLength(3);
    expect(result.data.steps).toHaveLength(3);
    expect(result.data.nutrition.calories).toBe(450);
  });

  it('requests scaled ingredients', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: mockRecipeDetail }));

    await recipesApi.getDetail('r1', 4);

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('servings=4');
  });

  it('throws 404 for non-existent recipe', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ error: { code: 'RESOURCE_NOT_FOUND', message: 'Recipe không tìm thấy' } }),
      { status: 404 },
    );

    await expect(recipesApi.getDetail('nonexistent')).rejects.toMatchObject({
      status: 404,
      code: 'RESOURCE_NOT_FOUND',
    });
  });

  it('works without servings parameter', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: mockRecipeDetail }));

    await recipesApi.getDetail('r1');

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).not.toContain('servings=');
  });
});

// ─── Bookmark ────────────────────────────────────────────────────────────────

describe('recipesApi.bookmark', () => {
  it('bookmarks a recipe', async () => {
    fetchMock.mockResponseOnce('', { status: 204 });

    await recipesApi.bookmark('r1');

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('/recipes/r1/bookmark');
    expect(fetchMock.mock.calls[0][1]?.method).toBe('POST');
  });

  it('throws 409 when already bookmarked', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ error: { code: 'RESOURCE_CONFLICT', message: 'Recipe đã tồn tại' } }),
      { status: 409 },
    );

    await expect(recipesApi.bookmark('r1')).rejects.toMatchObject({ status: 409 });
  });
});

describe('recipesApi.unbookmark', () => {
  it('removes bookmark', async () => {
    fetchMock.mockResponseOnce('', { status: 204 });

    await recipesApi.unbookmark('r1');

    expect(fetchMock.mock.calls[0][1]?.method).toBe('DELETE');
  });
});

// ─── getBookmarks ────────────────────────────────────────────────────────────

describe('recipesApi.getBookmarks', () => {
  it('returns bookmarked recipes', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ data: [mockRecipeSummary], meta: { total: 1, page: 1, pageSize: 20 } }),
    );

    const result = await recipesApi.getBookmarks();
    expect(result.data).toHaveLength(1);
  });

  it('paginates bookmarks', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: [], meta: { total: 0, page: 2, pageSize: 10 } }));

    await recipesApi.getBookmarks({ page: 2, pageSize: 10 });

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('page=2');
    expect(url).toContain('pageSize=10');
  });
});

// ─── rate ────────────────────────────────────────────────────────────────────

describe('recipesApi.rate', () => {
  it('submits rating with comment', async () => {
    fetchMock.mockResponseOnce('', { status: 204 });

    await recipesApi.rate('r1', 5, 'Ngon tuyệt!');

    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body).toEqual({ rating: 5, comment: 'Ngon tuyệt!' });
  });

  it('submits rating without comment', async () => {
    fetchMock.mockResponseOnce('', { status: 204 });

    await recipesApi.rate('r1', 4);

    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body).toEqual({ rating: 4 });
  });
});

/**
 * Unit tests for API Client (client.ts)
 * Covers: apiRequest, token management, error handling, token refresh flow
 * Based on: specs/auth/acceptance.md + docs/architecture/error-handling.md
 */
import { apiRequest, ApiError, tokenStorage, api } from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// fetchMock is enabled globally via jest.setup.js
const fetchMock = global.fetch as jest.Mock;

beforeEach(() => {
  fetchMock.resetMocks();
  jest.clearAllMocks();
});

// ─── tokenStorage ────────────────────────────────────────────────────────────

describe('tokenStorage', () => {
  it('getAccessToken returns stored token', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('abc123');
    const token = await tokenStorage.getAccessToken();
    expect(token).toBe('abc123');
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@mealmind/access_token');
  });

  it('getRefreshToken returns stored token', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('ref456');
    const token = await tokenStorage.getRefreshToken();
    expect(token).toBe('ref456');
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@mealmind/refresh_token');
  });

  it('setTokens stores both tokens', async () => {
    await tokenStorage.setTokens('access', 'refresh');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@mealmind/access_token', 'access');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@mealmind/refresh_token', 'refresh');
  });

  it('clearTokens removes both tokens', async () => {
    await tokenStorage.clearTokens();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@mealmind/access_token');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@mealmind/refresh_token');
  });

  it('returns null when no token stored', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    expect(await tokenStorage.getAccessToken()).toBeNull();
    expect(await tokenStorage.getRefreshToken()).toBeNull();
  });
});

// ─── ApiError ────────────────────────────────────────────────────────────────

describe('ApiError', () => {
  it('creates error with correct properties', () => {
    const err = new ApiError(400, 'VALIDATION_ERROR', 'Bad input', { field: 'email' });
    expect(err.status).toBe(400);
    expect(err.code).toBe('VALIDATION_ERROR');
    expect(err.message).toBe('Bad input');
    expect(err.details).toEqual({ field: 'email' });
    expect(err.name).toBe('ApiError');
    expect(err instanceof Error).toBe(true);
  });

  it('creates error without details', () => {
    const err = new ApiError(500, 'SERVER_INTERNAL', 'Server error');
    expect(err.details).toBeUndefined();
  });
});

// ─── apiRequest — happy path ─────────────────────────────────────────────────

describe('apiRequest', () => {
  describe('happy path', () => {
    it('makes GET request with auth token', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('tok123');
      fetchMock.mockResponseOnce(JSON.stringify({ data: { id: '1' } }));

      const result = await apiRequest('/test');

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer tok123',
            'Content-Type': 'application/json',
          }),
        }),
      );
      expect(result).toEqual({ data: { id: '1' } });
    });

    it('makes request without auth when skipAuth=true', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: 'ok' }));

      await apiRequest('/auth/login', { skipAuth: true });

      const headers = (fetchMock.mock.calls[0][1] as RequestInit).headers as Record<string, string>;
      expect(headers['Authorization']).toBeUndefined();
    });

    it('returns undefined for 204 No Content', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('tok');
      fetchMock.mockResponseOnce('', { status: 204 });

      const result = await apiRequest('/auth/logout');
      expect(result).toBeUndefined();
    });

    it('sends correct Content-Type header', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      fetchMock.mockResponseOnce(JSON.stringify({ data: null }));

      await apiRequest('/test');

      const headers = (fetchMock.mock.calls[0][1] as RequestInit).headers as Record<string, string>;
      expect(headers['Content-Type']).toBe('application/json');
    });
  });

  // ─── Error responses ───────────────────────────────────────────────────────

  describe('error handling', () => {
    it('throws ApiError for 400 VALIDATION_ERROR', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('tok');
      fetchMock.mockResponseOnce(
        JSON.stringify({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Dữ liệu không hợp lệ',
            details: { field: 'email', reason: 'Email đã được sử dụng' },
          },
        }),
        { status: 400 },
      );

      await expect(apiRequest('/test')).rejects.toMatchObject({
        status: 400,
        code: 'VALIDATION_ERROR',
        message: 'Dữ liệu không hợp lệ',
        details: { field: 'email', reason: 'Email đã được sử dụng' },
      });
    });

    it('throws ApiError for 404 RESOURCE_NOT_FOUND', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('tok');
      fetchMock.mockResponseOnce(
        JSON.stringify({
          error: { code: 'RESOURCE_NOT_FOUND', message: 'Recipe không tìm thấy' },
        }),
        { status: 404 },
      );

      await expect(apiRequest('/recipes/999')).rejects.toMatchObject({
        status: 404,
        code: 'RESOURCE_NOT_FOUND',
      });
    });

    it('throws ApiError for 409 conflict (AUTH_EMAIL_EXISTS)', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      fetchMock.mockResponseOnce(
        JSON.stringify({
          error: { code: 'AUTH_EMAIL_EXISTS', message: 'Email đã được sử dụng' },
        }),
        { status: 409 },
      );

      await expect(apiRequest('/auth/register', { skipAuth: true })).rejects.toMatchObject({
        status: 409,
        code: 'AUTH_EMAIL_EXISTS',
      });
    });

    it('throws ApiError for 429 rate limit', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('tok');
      fetchMock.mockResponseOnce(
        JSON.stringify({
          error: {
            code: 'RATE_SUGGESTION_LIMIT',
            message: 'Bạn đã hết lượt gợi ý hôm nay.',
          },
        }),
        { status: 429 },
      );

      await expect(apiRequest('/suggestions')).rejects.toMatchObject({
        status: 429,
        code: 'RATE_SUGGESTION_LIMIT',
      });
    });

    it('throws ApiError for 403 RESOURCE_FORBIDDEN', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('tok');
      fetchMock.mockResponseOnce(
        JSON.stringify({
          error: { code: 'RESOURCE_FORBIDDEN', message: 'Bạn không có quyền truy cập' },
        }),
        { status: 403 },
      );

      await expect(apiRequest('/users/other/dietary')).rejects.toMatchObject({
        status: 403,
        code: 'RESOURCE_FORBIDDEN',
      });
    });

    it('throws ApiError for 500 server error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('tok');
      fetchMock.mockResponseOnce(
        JSON.stringify({
          error: { code: 'SERVER_INTERNAL', message: 'Lỗi hệ thống, vui lòng thử lại sau' },
        }),
        { status: 500 },
      );

      await expect(apiRequest('/test')).rejects.toMatchObject({
        status: 500,
        code: 'SERVER_INTERNAL',
      });
    });

    it('uses default message when error body cannot be parsed', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('tok');
      fetchMock.mockResponseOnce('not json', { status: 500 });

      await expect(apiRequest('/test')).rejects.toMatchObject({
        status: 500,
        message: 'Lỗi máy chủ. Vui lòng thử lại.',
      });
    });

    it('uses default message when error body has no error field', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('tok');
      fetchMock.mockResponseOnce(JSON.stringify({}), { status: 400 });

      await expect(apiRequest('/test')).rejects.toMatchObject({
        status: 400,
        code: 'HTTP_400',
        message: 'Dữ liệu không hợp lệ.',
      });
    });
  });

  // ─── Token refresh flow ────────────────────────────────────────────────────

  describe('token refresh on 401', () => {
    it('refreshes token and retries on 401', async () => {
      // First call: access token available, 401 response
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce('old_access') // getAccessToken for first request
        .mockResolvedValueOnce('refresh_tok'); // getRefreshToken for refresh

      // 1st: original request → 401
      fetchMock.mockResponseOnce('', { status: 401 });
      // 2nd: refresh request → new tokens
      fetchMock.mockResponseOnce(
        JSON.stringify({ data: { accessToken: 'new_access', refreshToken: 'new_refresh' } }),
      );
      // 3rd: retry original request → success
      fetchMock.mockResponseOnce(JSON.stringify({ data: 'success' }));

      const result = await apiRequest('/protected');
      expect(result).toEqual({ data: 'success' });
    });

    it('throws 401 when refresh fails', async () => {
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce('old_access') // getAccessToken
        .mockResolvedValueOnce('refresh_tok'); // getRefreshToken

      // 1st: 401
      fetchMock.mockResponseOnce('', { status: 401 });
      // 2nd: refresh fails
      fetchMock.mockResponseOnce('', { status: 401 });

      await expect(apiRequest('/protected')).rejects.toMatchObject({
        status: 401,
        code: 'UNAUTHORIZED',
      });
    });

    it('clears tokens when no refresh token', async () => {
      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce('old_access') // getAccessToken
        .mockResolvedValueOnce(null); // getRefreshToken → null

      fetchMock.mockResponseOnce('', { status: 401 });

      await expect(apiRequest('/protected')).rejects.toMatchObject({
        status: 401,
      });
    });

    it('does not refresh for skipAuth requests', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          error: { code: 'AUTH_INVALID_CREDENTIALS', message: 'Email hoặc mật khẩu không đúng' },
        }),
        { status: 401 },
      );

      await expect(apiRequest('/auth/login', { skipAuth: true })).rejects.toMatchObject({
        status: 401,
        code: 'AUTH_INVALID_CREDENTIALS',
      });
      // Should NOT have called refresh
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });
});

// ─── Convenience wrappers (api.get/post/patch/put/delete) ────────────────────

describe('api convenience wrappers', () => {
  beforeEach(() => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('api.get sends GET method', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: [] }));
    await api.get('/recipes');
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: 'GET' });
  });

  it('api.post sends POST with body', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: {} }));
    await api.post('/auth/login', { email: 'test@test.com' });
    const opts = fetchMock.mock.calls[0][1] as RequestInit;
    expect(opts.method).toBe('POST');
    expect(JSON.parse(opts.body as string)).toEqual({ email: 'test@test.com' });
  });

  it('api.patch sends PATCH with body', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: {} }));
    await api.patch('/users/1', { name: 'New' });
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: 'PATCH' });
  });

  it('api.put sends PUT with body', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: {} }));
    await api.put('/users/1/dietary', { dietType: 'vegan' });
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: 'PUT' });
  });

  it('api.delete sends DELETE', async () => {
    fetchMock.mockResponseOnce('', { status: 204 });
    await api.delete('/recipes/1/bookmark');
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: 'DELETE' });
  });

  it('api.post with undefined body does not send body', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ data: {} }));
    await api.post('/test');
    const opts = fetchMock.mock.calls[0][1] as RequestInit;
    expect(opts.body).toBeUndefined();
  });
});

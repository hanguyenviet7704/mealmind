import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

const STORAGE_KEYS = {
  ACCESS_TOKEN: '@mealmind/access_token',
  REFRESH_TOKEN: '@mealmind/refresh_token',
};

// ─── Token Storage ──────────────────────────────────────────────────────────

export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },
  async getRefreshToken(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
      AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
    ]);
  },
  async clearTokens(): Promise<void> {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
    ]);
  },
};

// ─── API Error ───────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─── Core Request ────────────────────────────────────────────────────────────

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      await tokenStorage.clearTokens();
      return null;
    }
    const json = await res.json();
    const { accessToken, refreshToken: newRefresh } = json.data;
    await tokenStorage.setTokens(accessToken, newRefresh);
    return accessToken;
  } catch {
    await tokenStorage.clearTokens();
    return null;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { skipAuth?: boolean } = {},
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (!skipAuth) {
    const token = await tokenStorage.getAccessToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  // Token expired — try refresh once
  if (response.status === 401 && !skipAuth) {
    if (!isRefreshing) {
      isRefreshing = true;
      const newToken = await refreshAccessToken();
      isRefreshing = false;
      refreshQueue.forEach((cb) => cb(newToken));
      refreshQueue = [];

      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
        const retried = await fetch(`${BASE_URL}${path}`, { ...fetchOptions, headers });
        if (!retried.ok) {
          await handleErrorResponse(retried);
        }
        return retried.json() as Promise<T>;
      }
    } else {
      // Wait for the ongoing refresh
      const newToken = await new Promise<string | null>((resolve) => {
        refreshQueue.push(resolve);
      });
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
        const retried = await fetch(`${BASE_URL}${path}`, { ...fetchOptions, headers });
        if (!retried.ok) await handleErrorResponse(retried);
        return retried.json() as Promise<T>;
      }
    }
    throw new ApiError(401, 'UNAUTHORIZED', 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
  }

  if (!response.ok) {
    await handleErrorResponse(response);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

async function handleErrorResponse(response: Response): Promise<never> {
  let body: { error?: { code?: string; message?: string; details?: unknown } } = {};
  try {
    body = await response.json();
  } catch {
    // ignore
  }
  const code = body.error?.code ?? `HTTP_${response.status}`;
  const message = body.error?.message ?? getDefaultMessage(response.status);
  throw new ApiError(response.status, code, message, body.error?.details);
}

function getDefaultMessage(status: number): string {
  switch (status) {
    case 400: return 'Dữ liệu không hợp lệ.';
    case 401: return 'Vui lòng đăng nhập lại.';
    case 403: return 'Bạn không có quyền thực hiện thao tác này.';
    case 404: return 'Không tìm thấy dữ liệu.';
    case 409: return 'Dữ liệu đã tồn tại.';
    case 429: return 'Quá nhiều yêu cầu. Vui lòng thử lại sau.';
    case 500: return 'Lỗi máy chủ. Vui lòng thử lại.';
    default:  return 'Đã xảy ra lỗi. Vui lòng thử lại.';
  }
}

// ─── Convenience wrappers ────────────────────────────────────────────────────

export const api = {
  get: <T>(path: string, opts?: RequestInit & { skipAuth?: boolean }) =>
    apiRequest<T>(path, { method: 'GET', ...opts }),

  post: <T>(path: string, body?: unknown, opts?: RequestInit & { skipAuth?: boolean }) =>
    apiRequest<T>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...opts,
    }),

  patch: <T>(path: string, body?: unknown, opts?: RequestInit & { skipAuth?: boolean }) =>
    apiRequest<T>(path, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...opts,
    }),

  put: <T>(path: string, body?: unknown, opts?: RequestInit & { skipAuth?: boolean }) =>
    apiRequest<T>(path, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...opts,
    }),

  delete: <T>(path: string, body?: unknown, opts?: RequestInit & { skipAuth?: boolean }) =>
    apiRequest<T>(path, {
      method: 'DELETE',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...opts,
    }),
};

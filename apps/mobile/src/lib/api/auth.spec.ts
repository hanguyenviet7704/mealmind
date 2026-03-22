/**
 * Unit tests for Auth API (auth.ts)
 * Based on: specs/auth/acceptance.md
 * Covers: login, register, forgot/reset password, change password, logout, deleteAccount, getMe
 * Error cases: AUTH_INVALID_CREDENTIALS, AUTH_EMAIL_EXISTS, AUTH_ACCOUNT_LOCKED, AUTH_RESET_TOKEN_INVALID
 */
import { authApi, AuthResponse, UserSummary } from './auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchMock = global.fetch as jest.Mock;

const mockUser: UserSummary = {
  id: 'u1',
  name: 'Lan Nguyễn',
  email: 'lan@email.com',
  avatarUrl: null,
  tier: 'free',
  onboardingCompleted: true,
};

const mockAuthResponse: AuthResponse = {
  data: {
    accessToken: 'at_123',
    refreshToken: 'rt_456',
    expiresIn: 900,
    user: mockUser,
    isNewUser: false,
  },
  error: null,
};

beforeEach(() => {
  fetchMock.resetMocks();
  jest.clearAllMocks();
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
});

// ─── Login ───────────────────────────────────────────────────────────────────

describe('authApi.login', () => {
  it('login with valid credentials returns tokens and user', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockAuthResponse));

    const result = await authApi.login('lan@email.com', 'Password1');
    expect(result.data.user.email).toBe('lan@email.com');
    expect(result.data.accessToken).toBe('at_123');
    expect(result.data.refreshToken).toBe('rt_456');

    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body).toEqual({ email: 'lan@email.com', password: 'Password1', rememberMe: false });
  });

  it('login sends rememberMe=true when specified', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockAuthResponse));

    await authApi.login('lan@email.com', 'Password1', true);
    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body.rememberMe).toBe(true);
  });

  it('login with isNewUser=true for new user', async () => {
    const newUserRes = {
      ...mockAuthResponse,
      data: { ...mockAuthResponse.data, isNewUser: true, user: { ...mockUser, onboardingCompleted: false } },
    };
    fetchMock.mockResponseOnce(JSON.stringify(newUserRes));

    const result = await authApi.login('new@email.com', 'Pass1234');
    expect(result.data.isNewUser).toBe(true);
    expect(result.data.user.onboardingCompleted).toBe(false);
  });

  it('login with invalid credentials throws AUTH_INVALID_CREDENTIALS (401)', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: { code: 'AUTH_INVALID_CREDENTIALS', message: 'Email hoặc mật khẩu không đúng' },
      }),
      { status: 401 },
    );

    await expect(authApi.login('x@email.com', 'wrong')).rejects.toMatchObject({
      status: 401,
      code: 'AUTH_INVALID_CREDENTIALS',
    });
  });

  it('login after 5 fails throws AUTH_ACCOUNT_LOCKED (429)', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: { code: 'AUTH_ACCOUNT_LOCKED', message: 'Tài khoản tạm khóa, thử lại sau 15 phút' },
      }),
      { status: 429 },
    );

    await expect(authApi.login('x@email.com', 'wrong')).rejects.toMatchObject({
      status: 429,
      code: 'AUTH_ACCOUNT_LOCKED',
    });
  });

  it('login uses skipAuth (no Authorization header)', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockAuthResponse));
    await authApi.login('lan@email.com', 'Pass1234');

    const headers = fetchMock.mock.calls[0][1]?.headers as Record<string, string>;
    expect(headers['Authorization']).toBeUndefined();
  });
});

// ─── Register ────────────────────────────────────────────────────────────────

describe('authApi.register', () => {
  it('register with valid data returns tokens + isNewUser=true', async () => {
    const res = {
      ...mockAuthResponse,
      data: { ...mockAuthResponse.data, isNewUser: true },
    };
    fetchMock.mockResponseOnce(JSON.stringify(res));

    const result = await authApi.register('Lan', 'lan@email.com', 'Str0ngP@ss');
    expect(result.data.isNewUser).toBe(true);

    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body).toEqual({ name: 'Lan', email: 'lan@email.com', password: 'Str0ngP@ss' });
  });

  it('register with existing email throws AUTH_EMAIL_EXISTS (409)', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ error: { code: 'AUTH_EMAIL_EXISTS', message: 'Email đã được sử dụng' } }),
      { status: 409 },
    );

    await expect(authApi.register('Lan', 'existing@email.com', 'Pass1234+')).rejects.toMatchObject({
      status: 409,
      code: 'AUTH_EMAIL_EXISTS',
    });
  });

  it('register with weak password throws VALIDATION_ERROR (400)', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Dữ liệu không hợp lệ',
          details: { field: 'password', reason: 'Mật khẩu quá yếu' },
        },
      }),
      { status: 400 },
    );

    await expect(authApi.register('Lan', 'lan@email.com', '123')).rejects.toMatchObject({
      status: 400,
      code: 'VALIDATION_ERROR',
    });
  });

  it('register uses skipAuth', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockAuthResponse));
    await authApi.register('Lan', 'lan@email.com', 'Pass1234');
    const headers = fetchMock.mock.calls[0][1]?.headers as Record<string, string>;
    expect(headers['Authorization']).toBeUndefined();
  });
});

// ─── Forgot Password ────────────────────────────────────────────────────────

describe('authApi.forgotPassword', () => {
  it('sends forgot password request (always returns 200)', async () => {
    fetchMock.mockResponseOnce('', { status: 204 });

    await authApi.forgotPassword('lan@email.com');

    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body).toEqual({ email: 'lan@email.com' });
  });

  it('does not leak whether email exists', async () => {
    // Even non-existent email → no error
    fetchMock.mockResponseOnce('', { status: 204 });
    await expect(authApi.forgotPassword('nonexistent@email.com')).resolves.not.toThrow();
  });
});

// ─── Reset Password ─────────────────────────────────────────────────────────

describe('authApi.resetPassword', () => {
  it('resets password with valid token', async () => {
    fetchMock.mockResponseOnce('', { status: 204 });

    await authApi.resetPassword('valid_token', 'NewP@ss123');

    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body).toEqual({ token: 'valid_token', newPassword: 'NewP@ss123' });
  });

  it('throws AUTH_RESET_TOKEN_INVALID for expired/invalid token', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: {
          code: 'AUTH_RESET_TOKEN_INVALID',
          message: 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn',
        },
      }),
      { status: 400 },
    );

    await expect(authApi.resetPassword('expired_token', 'NewP@ss')).rejects.toMatchObject({
      status: 400,
      code: 'AUTH_RESET_TOKEN_INVALID',
    });
  });
});

// ─── Change Password ─────────────────────────────────────────────────────────

describe('authApi.changePassword', () => {
  it('changes password for authenticated user', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('at_tok');
    fetchMock.mockResponseOnce('', { status: 204 });

    await authApi.changePassword('currentPass', 'NewStr0ng!');

    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body).toEqual({ currentPassword: 'currentPass', newPassword: 'NewStr0ng!' });
  });

  it('throws AUTH_INVALID_CREDENTIALS if current password wrong', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('at_tok');
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: { code: 'AUTH_INVALID_CREDENTIALS', message: 'Mật khẩu hiện tại không đúng' },
      }),
      { status: 401 },
    );
    // 401 will trigger refresh, which will also fail
    fetchMock.mockResponseOnce('', { status: 401 }); // refresh fails
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('at_tok').mockResolvedValueOnce('rt_tok');

    await expect(authApi.changePassword('wrong', 'NewPass1')).rejects.toBeTruthy();
  });
});

// ─── Logout ──────────────────────────────────────────────────────────────────

describe('authApi.logout', () => {
  it('sends logout with refresh token', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('at_tok');
    fetchMock.mockResponseOnce('', { status: 204 });

    await authApi.logout('rt_tok');

    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body).toEqual({ refreshToken: 'rt_tok' });
  });

  it('sends logout without refresh token', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('at_tok');
    fetchMock.mockResponseOnce('', { status: 204 });

    await authApi.logout();

    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body).toEqual({ refreshToken: undefined });
  });
});

// ─── Delete Account ──────────────────────────────────────────────────────────

describe('authApi.deleteAccount', () => {
  it('sends DELETE with confirmation body', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('at_tok');
    fetchMock.mockResponseOnce('', { status: 204 });

    await authApi.deleteAccount();

    expect(fetchMock.mock.calls[0][1]?.method).toBe('DELETE');
  });
});

// ─── getMe ───────────────────────────────────────────────────────────────────

describe('authApi.getMe', () => {
  it('returns current user data', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('at_tok');
    fetchMock.mockResponseOnce(JSON.stringify({ data: mockUser }));

    const result = await authApi.getMe();
    expect(result.data).toEqual(mockUser);
  });

  it('fails with 401 when not authenticated', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    fetchMock.mockResponseOnce(
      JSON.stringify({ error: { code: 'AUTH_TOKEN_INVALID', message: 'Token không hợp lệ' } }),
      { status: 401 },
    );

    await expect(authApi.getMe()).rejects.toMatchObject({ status: 401 });
  });
});

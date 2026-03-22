/**
 * Integration tests: Auth Flow (Login → Store → Navigation decision)
 * Tests the full flow: API call → store update → auth state transitions
 * Based on: specs/auth/acceptance.md + docs/architecture/error-handling.md
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchMock = global.fetch as jest.Mock;

let authApi: typeof import('../../src/lib/api/auth').authApi;
let useAuthStore: typeof import('../../src/store/authStore').useAuthStore;
let tokenStorage: typeof import('../../src/lib/api/client').tokenStorage;

beforeEach(() => {
  fetchMock.resetMocks();
  jest.clearAllMocks();
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);

  jest.resetModules();
  authApi = require('../../src/lib/api/auth').authApi;
  useAuthStore = require('../../src/store/authStore').useAuthStore;
  tokenStorage = require('../../src/lib/api/client').tokenStorage;
});

const mockUser = {
  id: 'u1',
  name: 'Lan Nguyễn',
  email: 'lan@email.com',
  avatarUrl: null,
  tier: 'free' as const,
  onboardingCompleted: true,
};

// ─── Complete Login Flow ─────────────────────────────────────────────────────

describe('Login → Store → State', () => {
  it('successful login stores tokens and authenticates user', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          accessToken: 'at_new',
          refreshToken: 'rt_new',
          expiresIn: 900,
          user: mockUser,
          isNewUser: false,
        },
        error: null,
      }),
    );

    // Step 1: API call
    const loginResult = await authApi.login('lan@email.com', 'Password1');
    expect(loginResult.data.user.email).toBe('lan@email.com');

    // Step 2: Store update
    const { user, accessToken, refreshToken } = loginResult.data;
    await useAuthStore.getState().setUser(user, accessToken, refreshToken);

    // Step 3: Verify state
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.email).toBe('lan@email.com');
    expect(state.user?.onboardingCompleted).toBe(true);

    // Step 4: Tokens stored
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@mealmind/access_token', 'at_new');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@mealmind/refresh_token', 'rt_new');
  });

  it('new user login redirects to onboarding', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          accessToken: 'at',
          refreshToken: 'rt',
          expiresIn: 900,
          user: { ...mockUser, onboardingCompleted: false },
          isNewUser: true,
        },
        error: null,
      }),
    );

    const result = await authApi.login('new@email.com', 'Pass1234');
    await useAuthStore.getState().setUser(result.data.user, result.data.accessToken, result.data.refreshToken);

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.onboardingCompleted).toBe(false);
    // Navigation logic: !user.onboardingCompleted → Onboarding screen
  });

  it('failed login does not modify store', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        error: { code: 'AUTH_INVALID_CREDENTIALS', message: 'Email hoặc mật khẩu không đúng' },
      }),
      { status: 401 },
    );

    await expect(authApi.login('x@email.com', 'wrong')).rejects.toBeTruthy();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });
});

// ─── Complete Logout Flow ────────────────────────────────────────────────────

describe('Logout → Store clear → State reset', () => {
  it('logout clears everything', async () => {
    // Setup: logged-in state
    await useAuthStore.getState().setUser(mockUser, 'at', 'rt');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    // Logout
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('rt');
    fetchMock.mockResponseOnce('', { status: 204 });

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@mealmind/access_token');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@mealmind/refresh_token');
  });
});

// ─── App Startup (initialize) ────────────────────────────────────────────────

describe('App startup → initialize → auth gate', () => {
  it('auto-login with valid stored token', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('stored_token');
    fetchMock.mockResponseOnce(JSON.stringify({ data: mockUser }));

    await useAuthStore.getState().initialize();

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it('redirects to login when stored token is invalid', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid_token');
    fetchMock.mockRejectOnce(new Error('401'));

    await useAuthStore.getState().initialize();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it('redirects to login when no stored token', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    await useAuthStore.getState().initialize();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});

// ─── Register → Onboarding Flow ─────────────────────────────────────────────

describe('Register → Onboarding transition', () => {
  it('register → setUser → onboarding state', async () => {
    const newUser = { ...mockUser, onboardingCompleted: false };
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          accessToken: 'at_reg',
          refreshToken: 'rt_reg',
          expiresIn: 900,
          user: newUser,
          isNewUser: true,
        },
        error: null,
      }),
    );

    const result = await authApi.register('Lan', 'lan@email.com', 'Str0ngP@ss');
    await useAuthStore.getState().setUser(result.data.user, result.data.accessToken, result.data.refreshToken);

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.onboardingCompleted).toBe(false);
    expect(result.data.isNewUser).toBe(true);
  });
});

// ─── Onboarding Completion ───────────────────────────────────────────────────

describe('Onboarding completion → Main app', () => {
  it('after onboarding, update user → main app state', async () => {
    const user = { ...mockUser, onboardingCompleted: false };
    await useAuthStore.getState().setUser(user, 'at', 'rt');

    expect(useAuthStore.getState().user?.onboardingCompleted).toBe(false);

    useAuthStore.getState().updateUser({ onboardingCompleted: true });

    expect(useAuthStore.getState().user?.onboardingCompleted).toBe(true);
    // Navigation logic: user.onboardingCompleted → Main screen
  });
});

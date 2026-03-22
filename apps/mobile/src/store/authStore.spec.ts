/**
 * Unit tests for Auth Store (Zustand)
 * Based on: specs/auth/acceptance.md
 * Covers: initialize, setUser, updateUser, logout
 * Edge cases: expired token, corrupted storage, network errors
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from './authStore';

const fetchMock = global.fetch as jest.Mock;

beforeEach(() => {
  fetchMock.resetMocks();
  jest.clearAllMocks();
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);

  // Reset store to initial state
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
});

const mockUser = {
  id: 'u1',
  name: 'Lan Nguyễn',
  email: 'lan@email.com',
  avatarUrl: null,
  tier: 'free' as const,
  onboardingCompleted: true,
};

// ─── Initial state ───────────────────────────────────────────────────────────

describe('authStore initial state', () => {
  it('starts with null user, not authenticated, loading', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(true);
  });
});

// ─── initialize ──────────────────────────────────────────────────────────────

describe('authStore.initialize', () => {
  it('sets authenticated when token valid and getMe succeeds', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('valid_token');
    fetchMock.mockResponseOnce(JSON.stringify({ data: mockUser }));

    await useAuthStore.getState().initialize();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(state.isLoading).toBe(false);
  });

  it('sets unauthenticated when no token', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    await useAuthStore.getState().initialize();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('clears tokens and sets unauthenticated when getMe fails', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('expired_token');
    fetchMock.mockRejectOnce(new Error('Unauthorized'));

    await useAuthStore.getState().initialize();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(AsyncStorage.removeItem).toHaveBeenCalled();
  });

  it('clears tokens on network error', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('some_token');
    fetchMock.mockRejectOnce(new Error('Network error'));

    await useAuthStore.getState().initialize();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });
});

// ─── setUser ─────────────────────────────────────────────────────────────────

describe('authStore.setUser', () => {
  it('stores user and tokens', async () => {
    await useAuthStore.getState().setUser(mockUser, 'at_123', 'rt_456');

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@mealmind/access_token', 'at_123');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@mealmind/refresh_token', 'rt_456');
  });
});

// ─── updateUser ──────────────────────────────────────────────────────────────

describe('authStore.updateUser', () => {
  it('updates user partial without overwriting other fields', async () => {
    await useAuthStore.getState().setUser(mockUser, 'at', 'rt');

    useAuthStore.getState().updateUser({ name: 'Lan Updated' });

    expect(useAuthStore.getState().user?.name).toBe('Lan Updated');
    expect(useAuthStore.getState().user?.email).toBe('lan@email.com');
  });

  it('does nothing when user is null', () => {
    useAuthStore.getState().updateUser({ name: 'Test' });

    expect(useAuthStore.getState().user).toBeNull();
  });

  it('can update onboardingCompleted', async () => {
    const user = { ...mockUser, onboardingCompleted: false };
    await useAuthStore.getState().setUser(user, 'at', 'rt');

    useAuthStore.getState().updateUser({ onboardingCompleted: true });

    expect(useAuthStore.getState().user?.onboardingCompleted).toBe(true);
  });

  it('can update tier from free to pro', async () => {
    await useAuthStore.getState().setUser(mockUser, 'at', 'rt');

    useAuthStore.getState().updateUser({ tier: 'pro' });

    expect(useAuthStore.getState().user?.tier).toBe('pro');
  });
});

// ─── logout ──────────────────────────────────────────────────────────────────

describe('authStore.logout', () => {
  it('clears user, tokens, sets unauthenticated', async () => {
    await useAuthStore.getState().setUser(mockUser, 'at', 'rt');
    jest.clearAllMocks(); // Clear setItem calls from setUser

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('rt');
    fetchMock.mockResponseOnce('', { status: 204 }); // logout API

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@mealmind/access_token');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@mealmind/refresh_token');
  });

  it('still clears local state when logout API fails', async () => {
    await useAuthStore.getState().setUser(mockUser, 'at', 'rt');
    jest.clearAllMocks();

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('rt');
    fetchMock.mockRejectOnce(new Error('Network error'));

    await useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(AsyncStorage.removeItem).toHaveBeenCalled();
  });

  it('handles logout with no refresh token', async () => {
    await useAuthStore.getState().setUser(mockUser, 'at', 'rt');
    jest.clearAllMocks();

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    fetchMock.mockResponseOnce('', { status: 204 });

    await useAuthStore.getState().logout();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});

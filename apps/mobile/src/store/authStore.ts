import { create } from 'zustand';
import { tokenStorage } from '../lib/api/client';
import { authApi, type UserSummary } from '../lib/api/auth';

interface AuthState {
  user: UserSummary | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  initialize: () => Promise<void>;
  setUser: (user: UserSummary, accessToken: string, refreshToken: string) => Promise<void>;
  updateUser: (partial: Partial<UserSummary>) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    set({ isLoading: true });
    try {
      const token = await tokenStorage.getAccessToken();
      if (!token) {
        set({ isAuthenticated: false, isLoading: false });
        return;
      }
      // Validate token by fetching current user
      const res = await authApi.getMe();
      set({ user: res.data, isAuthenticated: true, isLoading: false });
    } catch {
      await tokenStorage.clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: async (user, accessToken, refreshToken) => {
    await tokenStorage.setTokens(accessToken, refreshToken);
    set({ user, isAuthenticated: true });
  },

  updateUser: (partial) => {
    const current = get().user;
    if (current) set({ user: { ...current, ...partial } });
  },

  logout: async () => {
    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      await authApi.logout(refreshToken ?? undefined);
    } catch {
      // Ignore logout errors — always clear local state
    }
    await tokenStorage.clearTokens();
    set({ user: null, isAuthenticated: false });
  },
}));

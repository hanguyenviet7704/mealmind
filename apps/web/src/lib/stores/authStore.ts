import { create } from 'zustand';
import { setStoredTokens, clearStoredTokens, getStoredToken } from '@/lib/api/client';

interface UserSummary {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  tier: 'free' | 'pro';
  onboardingCompleted: boolean;
}

interface AuthState {
  user: UserSummary | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (user: UserSummary, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setUser: (user: UserSummary) => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, accessToken, refreshToken) => {
    setStoredTokens(accessToken, refreshToken);
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    clearStoredTokens();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  setUser: (user) => {
    set({ user });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  checkAuth: () => {
    const token = getStoredToken();
    if (!token) {
      set({ isAuthenticated: false, isLoading: false });
      return false;
    }
    set({ isAuthenticated: true, isLoading: false });
    return true;
  },
}));

export type { UserSummary };

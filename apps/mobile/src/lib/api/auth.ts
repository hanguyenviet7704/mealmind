import { api } from './client';

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  tier: 'free' | 'pro';
  onboardingCompleted: boolean;
}

export interface AuthResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: UserSummary;
    isNewUser: boolean;
  };
  error: null;
}

export const authApi = {
  login: (email: string, password: string, rememberMe = false) =>
    api.post<AuthResponse>('/auth/login', { email, password, rememberMe }, { skipAuth: true }),

  register: (name: string, email: string, password: string) =>
    api.post<AuthResponse>('/auth/register', { name, email, password }, { skipAuth: true }),

  forgotPassword: (email: string) =>
    api.post<void>('/auth/forgot-password', { email }, { skipAuth: true }),

  resetPassword: (token: string, newPassword: string) =>
    api.post<void>('/auth/reset-password', { token, newPassword }, { skipAuth: true }),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post<void>('/auth/change-password', { currentPassword, newPassword }),

  logout: (refreshToken?: string) =>
    api.post<void>('/auth/logout', { refreshToken }),

  deleteAccount: () =>
    api.delete<void>('/auth/account', { confirmation: 'XÓA TÀI KHOẢN' }),

  getMe: () =>
    api.get<{ data: UserSummary }>('/auth/me'),
};

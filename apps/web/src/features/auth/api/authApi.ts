import { apiClient, setStoredTokens } from '@/lib/api/client';
import type { UserSummary } from '@/lib/stores/authStore';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserSummary;
  isNewUser: boolean;
}

export interface LoginParams {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordParams {
  email: string;
}

export interface ResetPasswordParams {
  token: string;
  newPassword: string;
}

export async function loginApi(params: LoginParams): Promise<AuthResponse> {
  return apiClient<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function registerApi(params: RegisterParams): Promise<AuthResponse> {
  return apiClient<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function forgotPasswordApi(params: ForgotPasswordParams): Promise<void> {
  return apiClient<void>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function resetPasswordApi(params: ResetPasswordParams): Promise<void> {
  return apiClient<void>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

export async function logoutApi(refreshToken?: string): Promise<void> {
  return apiClient<void>('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}

export async function getMeApi(): Promise<UserSummary> {
  return apiClient<UserSummary>('/auth/me');
}

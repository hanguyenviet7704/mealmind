import { api } from './client';

export interface Notification {
  id: string;
  type: 'meal_suggestion' | 'meal_plan' | 'timer_done' | 'system';
  title: string;
  body: string;
  read: boolean;
  deepLink: string | null;
  createdAt: string;
}

export const notificationsApi = {
  list: (params?: { unreadOnly?: boolean; page?: number; pageSize?: number }) => {
    const qs = new URLSearchParams();
    if (params?.unreadOnly) qs.set('unreadOnly', 'true');
    if (params?.page) qs.set('page', String(params.page));
    if (params?.pageSize) qs.set('pageSize', String(params.pageSize));
    return api.get<{
      data: Notification[];
      meta: { total: number; unreadCount: number; page: number; pageSize: number };
    }>(`/notifications?${qs}`);
  },

  markRead: (id: string) =>
    api.patch<void>(`/notifications/${id}`, { read: true }),

  delete: (id: string) =>
    api.delete<void>(`/notifications/${id}`),
};

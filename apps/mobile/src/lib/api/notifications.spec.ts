/**
 * Unit tests for Notifications API (notifications.ts)
 * Covers: list, markRead, delete
 */
import { notificationsApi } from './notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchMock = global.fetch as jest.Mock;

beforeEach(() => {
  fetchMock.resetMocks();
  jest.clearAllMocks();
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue('tok');
});

const mockNotification = {
  id: 'n1',
  type: 'meal_suggestion',
  title: 'Gợi ý bữa tối',
  body: 'Phở bò phù hợp cho buổi tối mát mẻ',
  read: false,
  deepLink: '/recipes/r1',
  createdAt: '2026-03-21T17:00:00Z',
};

// ─── list ────────────────────────────────────────────────────────────────────

describe('notificationsApi.list', () => {
  it('returns notification list with metadata', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: [mockNotification],
        meta: { total: 1, unreadCount: 1, page: 1, pageSize: 20 },
      }),
    );

    const result = await notificationsApi.list();
    expect(result.data).toHaveLength(1);
    expect(result.meta.unreadCount).toBe(1);
  });

  it('filters unread only', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ data: [], meta: { total: 0, unreadCount: 0, page: 1, pageSize: 20 } }),
    );

    await notificationsApi.list({ unreadOnly: true });

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('unreadOnly=true');
  });

  it('paginates results', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ data: [], meta: { total: 0, unreadCount: 0, page: 2, pageSize: 10 } }),
    );

    await notificationsApi.list({ page: 2, pageSize: 10 });

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('page=2');
    expect(url).toContain('pageSize=10');
  });
});

// ─── markRead ────────────────────────────────────────────────────────────────

describe('notificationsApi.markRead', () => {
  it('marks notification as read', async () => {
    fetchMock.mockResponseOnce('', { status: 204 });

    await notificationsApi.markRead('n1');

    expect(fetchMock.mock.calls[0][1]?.method).toBe('PATCH');
    const body = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(body.read).toBe(true);
    expect(fetchMock.mock.calls[0][0]).toContain('/notifications/n1');
  });
});

// ─── delete ──────────────────────────────────────────────────────────────────

describe('notificationsApi.delete', () => {
  it('deletes notification', async () => {
    fetchMock.mockResponseOnce('', { status: 204 });

    await notificationsApi.delete('n1');

    expect(fetchMock.mock.calls[0][1]?.method).toBe('DELETE');
    expect(fetchMock.mock.calls[0][0]).toContain('/notifications/n1');
  });
});

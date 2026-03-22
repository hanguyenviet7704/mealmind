import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { notificationsApi, Notification } from '../lib/api/notifications';
import { ApiError } from '../lib/api/client';

type NotificationNavProp = NativeStackNavigationProp<ProfileStackParamList, 'Notification'>;

type TabType = 'all' | 'unread';

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'Vừa xong';
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays === 1) return 'hôm qua';
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}

const NOTIF_ICON_MAP: Record<Notification['type'], { emoji: string; bg: string }> = {
  meal_suggestion: { emoji: '🍳', bg: colors.orange100 },
  meal_plan: { emoji: '📅', bg: colors.blue100 },
  timer_done: { emoji: '⏱', bg: colors.neutral100 },
  system: { emoji: '🔔', bg: colors.neutral100 },
};

export function NotificationScreen() {
  const navigation = useNavigation<NotificationNavProp>();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async (tab: TabType) => {
    setError(null);
    try {
      const res = await notificationsApi.list({
        page: 1,
        pageSize: 20,
        unreadOnly: tab === 'unread',
      });
      setNotifications(res.data);
      setUnreadCount(res.meta.unreadCount);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Không thể tải thông báo. Vui lòng thử lại.');
      }
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchNotifications(activeTab).finally(() => setLoading(false));
  }, [activeTab, fetchNotifications]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotifications(activeTab);
    setRefreshing(false);
  }, [activeTab, fetchNotifications]);

  const handleMarkRead = async (id: string) => {
    try {
      await notificationsApi.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Silently ignore mark-read errors
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationsApi.delete(id);
      const deleted = notifications.find((n) => n.id === id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (deleted && !deleted.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      if (err instanceof ApiError) {
        Alert.alert('Lỗi', err.message);
      } else {
        Alert.alert('Lỗi', 'Không thể xóa thông báo.');
      }
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    await Promise.all(unread.map((n) => notificationsApi.markRead(n.id).catch(() => null)));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleTap = (notif: Notification) => {
    if (!notif.read) {
      handleMarkRead(notif.id);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color={colors.neutral700} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Thông báo{unreadCount > 0 ? ` (${unreadCount})` : ''}
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.8} onPress={handleMarkAllRead}>
          <Feather name="check" size={20} color={colors.orange500} />
        </TouchableOpacity>
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
            Tất cả
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.tab, activeTab === 'unread' && styles.tabActive]}
          onPress={() => setActiveTab('unread')}
        >
          <Text style={[styles.tabText, activeTab === 'unread' && styles.tabTextActive]}>
            Chưa đọc{unreadCount > 0 ? ` (${unreadCount})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              fetchNotifications(activeTab).finally(() => setLoading(false));
            }}
          >
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={notifications.length === 0 ? styles.emptyFlex : styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {activeTab === 'unread' ? 'Không có thông báo chưa đọc.' : 'Chưa có thông báo nào.'}
              </Text>
            </View>
          }
          renderItem={({ item: notif, index }) => {
            const iconInfo = NOTIF_ICON_MAP[notif.type] ?? NOTIF_ICON_MAP.system;
            const isLast = index === notifications.length - 1;
            return (
              <View style={styles.notifGroup}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleTap(notif)}
                  style={[
                    styles.notifRow,
                    !notif.read ? styles.notifUnread : styles.notifRead,
                  ]}
                >
                  <View style={[styles.notifIconCircle, { backgroundColor: iconInfo.bg }]}>
                    <Text style={styles.notifEmoji}>{iconInfo.emoji}</Text>
                  </View>
                  <View style={styles.notifContent}>
                    <View style={styles.notifTitleRow}>
                      <Text style={styles.notifTitle} numberOfLines={1}>
                        {notif.title}
                      </Text>
                      <View style={styles.notifMeta}>
                        <Text style={styles.notifTime}>{timeAgo(notif.createdAt)}</Text>
                        {!notif.read && <View style={styles.unreadDot} />}
                      </View>
                    </View>
                    <Text style={styles.notifBody} numberOfLines={2}>
                      {notif.body}
                    </Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.deleteButton}
                    onPress={() => handleDelete(notif.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Feather name="trash-2" size={16} color={colors.neutral400} />
                  </TouchableOpacity>
                </TouchableOpacity>
                {!isLast && <View style={styles.divider} />}
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 4,
    marginLeft: -4,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.neutral900,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  tab: {
    paddingBottom: 10,
    paddingTop: 8,
    marginRight: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.orange500,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral400,
  },
  tabTextActive: {
    color: colors.neutral900,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  errorText: {
    fontSize: 14,
    color: colors.red500,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  emptyFlex: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.neutral400,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  notifGroup: {
    backgroundColor: colors.white,
    marginTop: 8,
  },
  deleteButton: {
    paddingLeft: 8,
    paddingTop: 2,
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral100,
    marginLeft: 16,
  },
  notifRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  notifUnread: {
    backgroundColor: 'rgba(255, 247, 237, 0.5)',
  },
  notifRead: {
    opacity: 0.7,
  },
  notifIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  notifEmoji: {
    fontSize: 20,
  },
  notifContent: {
    flex: 1,
  },
  notifTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.neutral900,
    flex: 1,
  },
  notifMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  notifTime: {
    fontSize: 12,
    color: colors.neutral400,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.orange500,
  },
  notifBody: {
    fontSize: 14,
    color: colors.neutral600,
    lineHeight: 20,
  },
});

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { suggestionsApi } from '../lib/api/suggestions';
import { ApiError } from '../lib/api/client';
import { recipesApi } from '../lib/api/recipes';

type CookingHistoryNavProp = NativeStackNavigationProp<ProfileStackParamList, 'CookingHistory'>;

type HistoryEntry = {
  recipeId: string;
  recipeName: string;
  imageUrl?: string;
  action: string;
  mealType?: string;
  timestamp: string;
};

interface DateGroup {
  label: string;
  items: HistoryEntry[];
}

function getDateLabel(timestamp: string): string {
  const d = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(d, today)) return 'Hôm nay';
  if (isSameDay(d, yesterday)) return 'Hôm qua';
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function groupByDate(items: HistoryEntry[]): DateGroup[] {
  const map = new Map<string, HistoryEntry[]>();
  for (const item of items) {
    const label = getDateLabel(item.timestamp);
    if (!map.has(label)) map.set(label, []);
    map.get(label)!.push(item);
  }
  return Array.from(map.entries()).map(([label, groupItems]) => ({ label, items: groupItems }));
}

function formatTime(timestamp: string): string {
  const d = new Date(timestamp);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

interface StarRatingProps {
  rate: number;
  onRate: (star: number) => void;
}

function StarRating({ rate, onRate }: StarRatingProps) {
  return (
    <View style={styles.starRow}>
      {Array(5)
        .fill(0)
        .map((_, k) => (
          <TouchableOpacity key={k} activeOpacity={0.7} onPress={() => onRate(k + 1)}>
            <Text style={k < rate ? styles.starFilled : styles.starEmpty}>
              {k < rate ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        ))}
    </View>
  );
}

export function CookingHistoryScreen() {
  const navigation = useNavigation<CookingHistoryNavProp>();
  const [groups, setGroups] = useState<DateGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [total, setTotal] = useState(0);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const fetchHistory = useCallback(async () => {
    try {
      const res = await suggestionsApi.getHistory({ action: 'cook', pageSize: 30 });
      const items = (res.data as HistoryEntry[]) ?? [];
      setGroups(groupByDate(items));
      setTotal(res.meta?.total ?? items.length);
    } catch (err) {
      if (err instanceof ApiError) {
        Alert.alert('Lỗi', err.message);
      } else {
        Alert.alert('Lỗi', 'Không thể kết nối máy chủ. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHistory();
  }, [fetchHistory]);

  const handleRate = useCallback(async (recipeId: string, star: number) => {
    setRatings((prev) => ({ ...prev, [recipeId]: star }));
    try {
      await recipesApi.rate(recipeId, star);
    } catch (err) {
      // Roll back optimistic update on failure
      setRatings((prev) => {
        const next = { ...prev };
        delete next[recipeId];
        return next;
      });
      if (err instanceof ApiError) {
        Alert.alert('Lỗi', err.message);
      } else {
        Alert.alert('Lỗi', 'Không thể lưu đánh giá. Vui lòng thử lại.');
      }
    }
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const isEmpty = groups.length === 0;

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
          <View>
            <Text style={styles.headerTitle}>Lịch sử nấu ăn</Text>
            <Text style={styles.headerSubtitle}>{total} lượt nấu (30 ngày qua)</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {isEmpty ? (
          <View style={styles.emptyContainer}>
            <Feather name="book-open" size={48} color={colors.neutral300} />
            <Text style={styles.emptyTitle}>Chưa có lịch sử nấu ăn</Text>
            <Text style={styles.emptySubtitle}>
              Các món bạn đã nấu sẽ xuất hiện ở đây.
            </Text>
          </View>
        ) : (
          groups.map((group) => (
            <View key={group.label}>
              <Text style={styles.dateHeader}>{group.label}</Text>
              <View style={styles.card}>
                {group.items.map((item, j) => (
                  <View key={`${item.recipeId}-${item.timestamp}-${j}`}>
                    {j > 0 && <View style={styles.divider} />}
                    <TouchableOpacity activeOpacity={0.8} style={styles.itemRow}>
                      {item.imageUrl ? (
                        <Image
                          source={{ uri: item.imageUrl }}
                          style={styles.itemImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={[styles.itemImage, styles.itemImagePlaceholder]}>
                          <Feather name="image" size={24} color={colors.neutral300} />
                        </View>
                      )}
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemName} numberOfLines={1}>
                          {item.recipeName}
                        </Text>
                        <Text style={styles.itemType}>
                          {item.mealType ?? 'Đã nấu'}
                        </Text>
                        <Text style={styles.itemTimestamp}>
                          {formatTime(item.timestamp)}
                        </Text>
                        <StarRating
                          rate={ratings[item.recipeId] ?? 0}
                          onRate={(star) => handleRate(item.recipeId, star)}
                        />
                      </View>
                      <TouchableOpacity activeOpacity={0.8} style={styles.deleteButton}>
                        <Feather name="trash-2" size={18} color={colors.neutral300} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          ))
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral50,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    lineHeight: 22,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.neutral500,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
    gap: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 64,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.neutral700,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.neutral500,
    textAlign: 'center',
  },
  dateHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral500,
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral100,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral100,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 16,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.neutral100,
  },
  itemImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.neutral900,
    lineHeight: 20,
  },
  itemType: {
    fontSize: 12,
    color: colors.neutral500,
  },
  itemTimestamp: {
    fontSize: 11,
    color: colors.neutral400,
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  starFilled: {
    fontSize: 14,
    color: colors.orange500,
  },
  starEmpty: {
    fontSize: 14,
    color: colors.orange500,
  },
  deleteButton: {
    padding: 8,
  },
  bottomSpacer: {
    height: 40,
  },
});

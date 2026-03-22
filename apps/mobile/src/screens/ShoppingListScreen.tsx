import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PlanStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { mealPlansApi, ShoppingItem } from '../lib/api/mealPlans';
import { ApiError } from '../lib/api/client';

type NavigationProp = NativeStackNavigationProp<PlanStackParamList>;
type RouteProps = RouteProp<PlanStackParamList, 'ShoppingList'>;

const CAT_ICONS: Record<string, string> = {
  'Thịt cá': '🥩',
  'Rau củ': '🥬',
  'Gia vị': '🧂',
  'Tinh bột': '🌾',
  'Sữa & trứng': '🥚',
  'Đồ uống': '🧃',
};

function getCatIcon(cat: string): string {
  return CAT_ICONS[cat] ?? '🛒';
}

export function ShoppingListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { planId } = route.params;

  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchShopping = useCallback(async () => {
    try {
      const res = await mealPlansApi.getShopping(planId);
      setItems(res.data.items);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        Alert.alert(
          'Chưa có danh sách mua sắm',
          'Bạn có muốn tạo danh sách mua sắm cho thực đơn này không?',
          [
            { text: 'Hủy', style: 'cancel' },
            {
              text: 'Tạo ngay',
              onPress: async () => {
                try {
                  const generated = await mealPlansApi.generateShopping(planId);
                  setItems(generated.data.items);
                } catch (genErr) {
                  if (genErr instanceof ApiError) {
                    Alert.alert('Lỗi', genErr.message);
                  } else {
                    Alert.alert('Lỗi kết nối', 'Không thể tạo danh sách mua sắm.');
                  }
                }
              },
            },
          ],
        );
      } else if (err instanceof ApiError) {
        Alert.alert('Lỗi', err.message);
      } else {
        Alert.alert('Lỗi kết nối', 'Không thể tải danh sách mua sắm. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [planId]);

  useEffect(() => {
    fetchShopping();
  }, [fetchShopping]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchShopping();
  }, [fetchShopping]);

  const toggleCheck = useCallback(async (item: ShoppingItem) => {
    if (togglingId === item.id) return;
    const newChecked = !item.checked;
    // Optimistic update
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, checked: newChecked } : i)),
    );
    setTogglingId(item.id);
    try {
      await mealPlansApi.toggleShoppingItem(item.id, newChecked);
    } catch (err) {
      // Revert on failure
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, checked: item.checked } : i)),
      );
      if (err instanceof ApiError) {
        Alert.alert('Lỗi', err.message);
      } else {
        Alert.alert('Lỗi kết nối', 'Không thể cập nhật. Vui lòng thử lại.');
      }
    } finally {
      setTogglingId(null);
    }
  }, [togglingId]);

  // Sort: unchecked first, checked last
  const sortedItems = [...items].sort((a, b) => {
    if (a.checked === b.checked) return 0;
    return a.checked ? 1 : -1;
  });

  const categories = Array.from(new Set(sortedItems.map((i) => i.category)));
  const totalChecked = items.filter((i) => i.checked).length;
  const progress = items.length > 0 ? (totalChecked / items.length) * 100 : 0;

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
            <Text style={styles.headerTitle}>Danh sách mua sắm</Text>
            {items.length > 0 && (
              <Text style={styles.headerSubtitle}>{items.length} nguyên liệu</Text>
            )}
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.8} style={styles.shareButton}>
          <Feather name="share-2" size={20} color={colors.neutral700} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#f97316"
              colors={['#f97316']}
            />
          }
        >
          {items.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="shopping-cart" size={48} color={colors.neutral300} />
              <Text style={styles.emptyStateTitle}>Chưa có danh sách mua sắm</Text>
            </View>
          ) : (
            <>
              {/* Progress */}
              <View style={styles.progressSection}>
                <View style={styles.progressTopRow}>
                  <Text style={styles.progressLabel}>
                    Đã mua: {totalChecked}/{items.length} món
                  </Text>
                  <Text style={styles.progressPct}>{Math.round(progress)}%</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
                </View>
              </View>

              {/* List */}
              <View style={styles.listContent}>
                {categories.map((cat) => {
                  const catItems = sortedItems.filter((i) => i.category === cat);
                  return (
                    <View key={cat} style={styles.categoryBlock}>
                      <Text style={styles.categoryTitle}>
                        {getCatIcon(cat)}{'  '}{cat}{' '}
                        <Text style={styles.categoryCount}>({catItems.length})</Text>
                      </Text>

                      <View style={styles.categoryItems}>
                        {catItems.map((item) => (
                          <TouchableOpacity
                            key={item.id}
                            activeOpacity={0.8}
                            onPress={() => toggleCheck(item)}
                            style={[
                              styles.itemRow,
                              item.checked ? styles.itemRowChecked : styles.itemRowUnchecked,
                            ]}
                          >
                            <View style={styles.itemLeft}>
                              {togglingId === item.id ? (
                                <ActivityIndicator
                                  size="small"
                                  color={colors.neutral400}
                                  style={{ width: 22 }}
                                />
                              ) : (
                                <Feather
                                  name={item.checked ? 'check-circle' : 'circle'}
                                  size={22}
                                  color={item.checked ? colors.green500 : colors.neutral300}
                                />
                              )}
                              <Text
                                style={[
                                  styles.itemName,
                                  item.checked && styles.itemNameChecked,
                                ]}
                              >
                                {item.name}
                              </Text>
                            </View>
                            <Text
                              style={[
                                styles.itemQty,
                                item.checked && styles.itemQtyChecked,
                              ]}
                            >
                              {item.amount} {item.unit}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  );
                })}
              </View>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
    borderRadius: 20,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.neutral900,
    lineHeight: 22,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.neutral500,
  },
  shareButton: {
    padding: 8,
    borderRadius: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 15,
    color: colors.neutral500,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  progressSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
    backgroundColor: colors.neutral50,
  },
  progressTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral700,
  },
  progressPct: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.orange500,
  },
  progressTrack: {
    height: 10,
    width: '100%',
    backgroundColor: colors.neutral200,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.orange500,
    borderRadius: 5,
  },
  listContent: {
    padding: 20,
    paddingBottom: 96,
    gap: 32,
  },
  categoryBlock: {
    gap: 8,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.neutral900,
  },
  categoryCount: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.neutral400,
  },
  categoryItems: {
    gap: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
  },
  itemRowUnchecked: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral100,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  itemRowChecked: {
    backgroundColor: colors.neutral50,
    opacity: 0.6,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral800,
  },
  itemNameChecked: {
    color: colors.neutral500,
    textDecorationLine: 'line-through',
  },
  itemQty: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral900,
  },
  itemQtyChecked: {
    color: colors.neutral400,
  },
});

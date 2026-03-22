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
import { mealPlansApi, MealPlan, MealSlot, PlanStatus } from '../lib/api/mealPlans';
import { ApiError } from '../lib/api/client';

type NavigationProp = NativeStackNavigationProp<PlanStackParamList>;
type RouteProps = RouteProp<PlanStackParamList, 'MealPlanDetail'>;

const DAY_LABELS: Record<number, string> = {
  0: 'Thứ 2',
  1: 'Thứ 3',
  2: 'Thứ 4',
  3: 'Thứ 5',
  4: 'Thứ 6',
  5: 'Thứ 7',
  6: 'CN',
};

const MEAL_TYPE_LABEL: Record<string, string> = {
  breakfast: 'SÁNG',
  lunch: 'TRƯA',
  dinner: 'TỐI',
};

const STATUS_BADGE_BG: Record<PlanStatus, string> = {
  active: colors.green50,
  draft: '#fff7ed',
  archived: colors.neutral100,
};

const STATUS_BADGE_TEXT: Record<PlanStatus, string> = {
  active: colors.green700,
  draft: colors.amber,
  archived: colors.neutral500,
};

const STATUS_DISPLAY: Record<PlanStatus, string> = {
  active: 'Đang dùng',
  draft: 'Nháp',
  archived: 'Lưu trữ',
};

function formatWeekRange(weekStart: string, weekEnd: string): string {
  const start = new Date(weekStart);
  const end = new Date(weekEnd);
  const fmt = (d: Date) => `${d.getDate()}/${d.getMonth() + 1}`;
  return `${fmt(start)} – ${fmt(end)}`;
}

export function MealPlanDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { planId } = route.params;

  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeDay, setActiveDay] = useState(0);
  const [updatingSlot, setUpdatingSlot] = useState<string | null>(null);

  const fetchPlan = useCallback(async () => {
    try {
      const res = await mealPlansApi.getDetail(planId);
      setPlan(res.data);
    } catch (err) {
      if (err instanceof ApiError) {
        Alert.alert('Lỗi', err.message);
      } else {
        Alert.alert('Lỗi kết nối', 'Không thể tải thực đơn. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [planId]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPlan();
  }, [fetchPlan]);

  const handleToggleLock = useCallback(
    async (slot: MealSlot) => {
      if (!plan) return;
      setUpdatingSlot(slot.id);
      try {
        const res = await mealPlansApi.updateSlot(plan.id, slot.id, {
          isLocked: !slot.isLocked,
        });
        setPlan((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            slots: prev.slots.map((s) => (s.id === slot.id ? res.data : s)),
          };
        });
      } catch (err) {
        if (err instanceof ApiError) {
          Alert.alert('Lỗi', err.message);
        } else {
          Alert.alert('Lỗi kết nối', 'Không thể cập nhật slot. Vui lòng thử lại.');
        }
      } finally {
        setUpdatingSlot(null);
      }
    },
    [plan],
  );

  const handleGetSuggestions = useCallback(
    async (slot: MealSlot) => {
      if (!plan) return;
      try {
        const res = await mealPlansApi.getSlotSuggestions(plan.id, slot.id);
        const suggestions = res.data;
        if (suggestions.length === 0) {
          Alert.alert('Gợi ý', 'Không có gợi ý nào cho bữa này.');
          return;
        }
        const buttons = suggestions.slice(0, 4).map((recipe) => ({
          text: `${recipe.name} (${recipe.calories} kcal)`,
          onPress: async () => {
            setUpdatingSlot(slot.id);
            try {
              const updated = await mealPlansApi.updateSlot(plan.id, slot.id, {
                recipeId: recipe.id,
              });
              setPlan((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  slots: prev.slots.map((s) => (s.id === slot.id ? updated.data : s)),
                };
              });
            } catch (err) {
              if (err instanceof ApiError) {
                Alert.alert('Lỗi', err.message);
              } else {
                Alert.alert('Lỗi kết nối', 'Không thể cập nhật món. Vui lòng thử lại.');
              }
            } finally {
              setUpdatingSlot(null);
            }
          },
        }));
        buttons.push({ text: 'Hủy', onPress: () => {} });
        Alert.alert('Đổi món', 'Chọn món thay thế:', buttons as any);
      } catch (err) {
        if (err instanceof ApiError) {
          Alert.alert('Lỗi', err.message);
        } else {
          Alert.alert('Lỗi kết nối', 'Không thể lấy gợi ý. Vui lòng thử lại.');
        }
      }
    },
    [plan],
  );

  const handleStatusChange = useCallback(() => {
    if (!plan) return;
    Alert.alert(
      'Trạng thái',
      `Đang là: ${STATUS_DISPLAY[plan.status]}`,
      [
        {
          text: 'Draft',
          onPress: async () => {
            try {
              const res = await mealPlansApi.updateStatus(plan.id, 'draft');
              setPlan(res.data);
            } catch (err) {
              if (err instanceof ApiError) {
                Alert.alert('Lỗi', err.message);
              } else {
                Alert.alert('Lỗi kết nối', 'Không thể cập nhật trạng thái.');
              }
            }
          },
        },
        {
          text: 'Kích hoạt',
          onPress: async () => {
            try {
              const res = await mealPlansApi.updateStatus(plan.id, 'active');
              setPlan(res.data);
            } catch (err) {
              if (err instanceof ApiError) {
                Alert.alert('Lỗi', err.message);
              } else {
                Alert.alert('Lỗi kết nối', 'Không thể cập nhật trạng thái.');
              }
            }
          },
        },
        {
          text: 'Lưu trữ',
          onPress: async () => {
            try {
              const res = await mealPlansApi.updateStatus(plan.id, 'archived');
              setPlan(res.data);
            } catch (err) {
              if (err instanceof ApiError) {
                Alert.alert('Lỗi', err.message);
              } else {
                Alert.alert('Lỗi kết nối', 'Không thể cập nhật trạng thái.');
              }
            }
          },
        },
        { text: 'Hủy', style: 'cancel' as const, onPress: () => {} },
      ],
    );
  }, [plan]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (!plan) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Không tìm thấy thực đơn.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const slotsForDay = plan.slots
    .filter((s) => s.dayOfWeek === activeDay)
    .sort((a, b) => {
      const order = { breakfast: 0, lunch: 1, dinner: 2 };
      return (order[a.mealType] ?? 0) - (order[b.mealType] ?? 0);
    });

  const dayCalories = slotsForDay.reduce(
    (sum, s) => sum + (s.recipe?.calories ?? 0),
    0,
  );

  const allDays = Array.from({ length: 7 }, (_, i) => i);

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
            <Feather name="arrow-left" size={22} color={colors.neutral700} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {formatWeekRange(plan.weekStart, plan.weekEnd)}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleStatusChange}
          style={[
            styles.statusBadge,
            { backgroundColor: STATUS_BADGE_BG[plan.status] },
          ]}
        >
          <Text style={[styles.statusBadgeText, { color: STATUS_BADGE_TEXT[plan.status] }]}>
            {STATUS_DISPLAY[plan.status]}{' '}
          </Text>
          <Feather name="chevron-down" size={14} color={STATUS_BADGE_TEXT[plan.status]} />
        </TouchableOpacity>
      </View>

      {/* Days Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {allDays.map((dayIndex) => {
            const isActive = activeDay === dayIndex;
            return (
              <TouchableOpacity
                key={dayIndex}
                activeOpacity={0.8}
                onPress={() => setActiveDay(dayIndex)}
                style={[styles.dayTab, isActive && styles.dayTabActive]}
              >
                <Text style={[styles.dayTabLabel, isActive && styles.dayTabLabelActive]}>
                  {DAY_LABELS[dayIndex]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
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
        <Text style={styles.dayHeading}>{DAY_LABELS[activeDay]}</Text>

        {slotsForDay.length === 0 ? (
          <Text style={styles.noSlotsText}>Chưa có bữa ăn nào cho ngày này.</Text>
        ) : (
          slotsForDay.map((slot) => (
            <View key={slot.id} style={styles.mealSlot}>
              <Text style={styles.mealTimeLabel}>
                {MEAL_TYPE_LABEL[slot.mealType] ?? slot.mealType.toUpperCase()}
              </Text>
              <View style={styles.mealCard}>
                <View style={styles.mealInfo}>
                  <View style={styles.mealTitleRow}>
                    {slot.isLocked && (
                      <Feather name="lock" size={13} color={colors.orange500} style={styles.lockIcon} />
                    )}
                    <Text style={styles.mealTitle}>
                      {slot.recipe ? slot.recipe.name : 'Trống'}
                    </Text>
                  </View>
                  {slot.recipe && (
                    <Text style={styles.mealCalText}>
                      {slot.recipe.calories} kcal
                    </Text>
                  )}
                </View>
                <View style={styles.mealActions}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleToggleLock(slot)}
                    disabled={updatingSlot === slot.id}
                    style={styles.actionButton}
                  >
                    {updatingSlot === slot.id ? (
                      <ActivityIndicator size="small" color={colors.neutral400} />
                    ) : (
                      <Feather
                        name={slot.isLocked ? 'lock' : 'unlock'}
                        size={16}
                        color={slot.isLocked ? colors.orange500 : colors.neutral400}
                      />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleGetSuggestions(slot)}
                    disabled={updatingSlot === slot.id}
                    style={styles.actionButton}
                  >
                    <Feather name="refresh-cw" size={16} color={colors.neutral400} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}

        {/* Daily Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTitle}>Tổng ngày</Text>
            <Text style={styles.summaryCalories}>{dayCalories.toLocaleString()} kcal</Text>
          </View>
        </View>
      </ScrollView>

      {/* Floating Actions */}
      <View style={styles.floatingBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('ShoppingList', { planId: plan.id })}
          style={styles.floatingShoppingBtn}
        >
          <Feather name="shopping-cart" size={16} color={colors.neutral700} />
          <Text style={styles.floatingShoppingText}>Mua sắm</Text>
        </TouchableOpacity>
        <View style={styles.floatingDivider} />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('WeekNutrition', { planId: plan.id })}
          style={[styles.floatingIconBtn, styles.floatingIconBtnOrange]}
        >
          <Feather name="bar-chart-2" size={18} color={colors.orange600} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: 16,
  },
  errorText: {
    fontSize: 15,
    color: colors.neutral500,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: colors.orange500,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
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
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.neutral900,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tabsWrapper: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  tabsContent: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
  },
  dayTab: {
    minWidth: 56,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  dayTabActive: {
    backgroundColor: colors.orange500,
    shadowColor: colors.orange500,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  dayTabLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral700,
  },
  dayTabLabelActive: {
    color: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 128,
    gap: 24,
  },
  dayHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.neutral800,
  },
  noSlotsText: {
    fontSize: 14,
    color: colors.neutral400,
    textAlign: 'center',
    paddingVertical: 32,
  },
  mealSlot: {
    gap: 8,
  },
  mealTimeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.neutral500,
    letterSpacing: 0.8,
  },
  mealCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.neutral100,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  mealInfo: {
    flex: 1,
    gap: 4,
  },
  mealTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lockIcon: {
    marginRight: 2,
  },
  mealTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.neutral900,
    flex: 1,
  },
  mealCalText: {
    fontSize: 12,
    color: colors.neutral500,
    fontWeight: '500',
  },
  mealActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    backgroundColor: colors.blue50,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.blue100,
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.blue900,
  },
  summaryCalories: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.orange500,
  },
  floatingBar: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    padding: 8,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.neutral100,
  },
  floatingShoppingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.neutral100,
    borderRadius: 24,
  },
  floatingShoppingText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neutral700,
  },
  floatingDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.neutral200,
  },
  floatingIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingIconBtnOrange: {
    backgroundColor: colors.orange100,
  },
});

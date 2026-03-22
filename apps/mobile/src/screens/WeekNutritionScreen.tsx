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
import { mealPlansApi, MealPlan, MealSlot } from '../lib/api/mealPlans';
import { ApiError } from '../lib/api/client';

type NavigationProp = NativeStackNavigationProp<PlanStackParamList>;
type RouteProps = RouteProp<PlanStackParamList, 'WeekNutrition'>;

const DAY_LABELS: Record<number, string> = {
  0: 'T2',
  1: 'T3',
  2: 'T4',
  3: 'T5',
  4: 'T6',
  5: 'T7',
  6: 'CN',
};

const MEAL_TYPE_LABEL: Record<string, string> = {
  breakfast: 'Sáng',
  lunch: 'Trưa',
  dinner: 'Tối',
};

interface DayNutrition {
  dayIndex: number;
  label: string;
  totalCalories: number;
  slots: MealSlot[];
}

function buildDayNutrition(plan: MealPlan): DayNutrition[] {
  return Array.from({ length: 7 }, (_, i) => {
    const slots = plan.slots
      .filter((s) => s.dayOfWeek === i)
      .sort((a, b) => {
        const order = { breakfast: 0, lunch: 1, dinner: 2 };
        return (order[a.mealType] ?? 0) - (order[b.mealType] ?? 0);
      });
    const totalCalories = slots.reduce((sum, s) => sum + (s.recipe?.calories ?? 0), 0);
    return { dayIndex: i, label: DAY_LABELS[i], totalCalories, slots };
  });
}

function formatWeekRange(weekStart: string, weekEnd: string): string {
  const start = new Date(weekStart);
  const end = new Date(weekEnd);
  const fmt = (d: Date) => `${d.getDate()}/${d.getMonth() + 1}`;
  return `${fmt(start)} – ${fmt(end)}`;
}

export function WeekNutritionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { planId } = route.params;

  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const fetchPlan = useCallback(async () => {
    try {
      const res = await mealPlansApi.getDetail(planId);
      setPlan(res.data);
    } catch (err) {
      if (err instanceof ApiError) {
        Alert.alert('Lỗi', err.message);
      } else {
        Alert.alert('Lỗi kết nối', 'Không thể tải dữ liệu dinh dưỡng. Vui lòng thử lại.');
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

  const toggleDay = (dayIndex: number) => {
    setExpandedDay((prev) => (prev === dayIndex ? null : dayIndex));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!plan) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Không thể tải dữ liệu.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const days = buildDayNutrition(plan);
  const daysWithData = days.filter((d) => d.totalCalories > 0);

  const avgCalories =
    daysWithData.length > 0
      ? Math.round(daysWithData.reduce((s, d) => s + d.totalCalories, 0) / daysWithData.length)
      : 0;

  const TARGET_CALORIES = 2000;
  const maxCalories = Math.max(...days.map((d) => d.totalCalories), TARGET_CALORIES);
  const daysOnTarget = daysWithData.filter((d) => d.totalCalories <= TARGET_CALORIES * 1.1).length;

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
            <Text style={styles.headerTitle}>Dinh dưỡng tuần</Text>
            <Text style={styles.headerSubtitle}>
              {formatWeekRange(plan.weekStart, plan.weekEnd)}
            </Text>
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
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TRUNG BÌNH</Text>
            <Text style={[styles.statValue, { color: colors.orange600 }]}>
              {avgCalories.toLocaleString()}
            </Text>
            <Text style={styles.statUnit}>kcal/ngày</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>MỤC TIÊU</Text>
            <Text style={[styles.statValue, { color: colors.neutral800 }]}>
              {TARGET_CALORIES.toLocaleString()}
            </Text>
            <Text style={styles.statUnit}>kcal/ngày</Text>
          </View>
          <View style={[styles.statCard, styles.statCardGreen]}>
            <Text style={[styles.statLabel, { color: colors.green700 }]}>ĐẠT</Text>
            <Text style={[styles.statValue, { color: colors.green700 }]}>
              {daysOnTarget}/{daysWithData.length}
            </Text>
            <Text style={[styles.statUnit, { color: colors.green500 }]}>ngày</Text>
          </View>
        </View>

        {/* Bar Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeaderRow}>
            <Text style={styles.chartTitle}>Biểu đồ năng lượng</Text>
            <View style={styles.chartLegend}>
              <View style={styles.chartLegendDot} />
              <Text style={styles.chartLegendText}>Mục tiêu {TARGET_CALORIES}</Text>
            </View>
          </View>

          <View style={styles.chartArea}>
            {/* Goal line proportional within bar area */}
            <View
              style={[
                styles.goalLine,
                { bottom: `${(TARGET_CALORIES / maxCalories) * 100}%` as any },
              ]}
            />
            <View style={styles.barsRow}>
              {days.map((day) => {
                const heightPct =
                  maxCalories > 0 ? (day.totalCalories / maxCalories) * 100 : 0;
                const isOver = day.totalCalories > TARGET_CALORIES * 1.1;
                const isEmpty = day.totalCalories === 0;
                const barColor = isEmpty
                  ? colors.neutral200
                  : isOver
                  ? colors.red500
                  : colors.green500;
                return (
                  <View key={day.dayIndex} style={styles.barCol}>
                    <View style={styles.barWrapper}>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: isEmpty ? 4 : (`${Math.max(heightPct, 4)}%` as any),
                            backgroundColor: barColor,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.barLabel}>{day.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Day Details Accordion */}
        <View style={styles.dayDetailsSection}>
          <Text style={styles.dayDetailsSectionTitle}>CHI TIẾT THEO NGÀY</Text>
          <View style={styles.dayDetailsCard}>
            {days.map((day, i) => {
              const isExpanded = expandedDay === day.dayIndex;
              const isOver = day.totalCalories > TARGET_CALORIES * 1.1;
              const indicator = day.totalCalories === 0 ? '—' : isOver ? '🔴' : '🟢';
              return (
                <View key={day.dayIndex}>
                  {i > 0 && <View style={styles.dayDivider} />}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => toggleDay(day.dayIndex)}
                    style={styles.dayRow}
                  >
                    <Text style={[styles.dayRowLabel, isExpanded && styles.dayRowLabelActive]}>
                      {isExpanded ? '▾' : '▸'} {day.label}
                    </Text>
                    <View style={styles.dayRowRight}>
                      <Text style={styles.dayCalories}>
                        {day.totalCalories > 0
                          ? `${day.totalCalories.toLocaleString()} kcal`
                          : 'Chưa có'}
                      </Text>
                      <Text style={styles.dayIndicator}>{indicator}</Text>
                    </View>
                  </TouchableOpacity>
                  {isExpanded && day.slots.length > 0 && (
                    <View style={styles.dayMeals}>
                      {day.slots.map((slot) => (
                        <View key={slot.id} style={styles.mealDetailRow}>
                          <Text style={styles.mealDetailName}>
                            {MEAL_TYPE_LABEL[slot.mealType] ?? slot.mealType}:{' '}
                            {slot.recipe ? slot.recipe.name : 'Trống'}
                          </Text>
                          <Text style={styles.mealDetailCal}>
                            {slot.recipe ? `${slot.recipe.calories} kcal` : '—'}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {isExpanded && day.slots.length === 0 && (
                    <View style={styles.dayMeals}>
                      <Text style={styles.noMealsText}>Chưa có bữa ăn nào.</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
    gap: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral100,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  statCardGreen: {
    backgroundColor: colors.green50,
    borderColor: colors.green500,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.neutral500,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  statUnit: {
    fontSize: 10,
    color: colors.neutral400,
  },
  chartCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.neutral100,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral800,
  },
  chartLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chartLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.orange200,
  },
  chartLegendText: {
    fontSize: 10,
    color: colors.neutral400,
  },
  chartArea: {
    height: 160,
    position: 'relative',
  },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.orange200,
    zIndex: 0,
  },
  barsRow: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    top: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
    zIndex: 1,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    gap: 6,
  },
  barWrapper: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    maxWidth: 24,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.neutral400,
  },
  dayDetailsSection: {
    gap: 12,
  },
  dayDetailsSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.neutral900,
    letterSpacing: 0.8,
    marginLeft: 4,
  },
  dayDetailsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral100,
    overflow: 'hidden',
  },
  dayDivider: {
    height: 1,
    backgroundColor: colors.neutral100,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  dayRowLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral600,
  },
  dayRowLabelActive: {
    color: colors.orange600,
  },
  dayRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dayCalories: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral800,
  },
  dayIndicator: {
    fontSize: 14,
  },
  dayMeals: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: colors.orange200,
    gap: 8,
  },
  mealDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealDetailName: {
    fontSize: 13,
    color: colors.neutral600,
    flex: 1,
    marginRight: 8,
  },
  mealDetailCal: {
    fontSize: 13,
    color: colors.neutral600,
  },
  noMealsText: {
    fontSize: 13,
    color: colors.neutral400,
    fontStyle: 'italic',
  },
});

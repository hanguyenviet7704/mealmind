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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PlanStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { mealPlansApi, MealPlanSummary, PlanStatus } from '../lib/api/mealPlans';
import { ApiError } from '../lib/api/client';

type NavigationProp = NativeStackNavigationProp<PlanStackParamList>;

function formatWeekRange(weekStart: string, weekEnd: string): string {
  const start = new Date(weekStart);
  const end = new Date(weekEnd);
  const fmt = (d: Date) => `${d.getDate()}/${d.getMonth() + 1}`;
  return `${fmt(start)} - ${fmt(end)}`;
}

const STATUS_DOT_COLOR: Record<PlanStatus, string> = {
  active: colors.green500,
  draft: colors.amber,
  archived: colors.neutral400,
};

const STATUS_LABEL: Record<PlanStatus, string> = {
  active: 'ĐANG DÙNG',
  draft: 'NHÁP',
  archived: 'LƯU TRỮ',
};

export function MealPlanScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [plans, setPlans] = useState<MealPlanSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPlans = useCallback(async () => {
    try {
      const res = await mealPlansApi.list();
      setPlans(res.data);
    } catch (err) {
      if (err instanceof ApiError) {
        Alert.alert('Lỗi', err.message);
      } else {
        Alert.alert('Lỗi kết nối', 'Không thể tải danh sách thực đơn. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPlans();
  }, [fetchPlans]);

  const groupedPlans = plans.reduce<Record<PlanStatus, MealPlanSummary[]>>(
    (acc, plan) => {
      acc[plan.status].push(plan);
      return acc;
    },
    { active: [], draft: [], archived: [] },
  );

  const orderedStatuses: PlanStatus[] = ['active', 'draft', 'archived'];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thực đơn</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      ) : (
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
          {plans.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="calendar" size={48} color={colors.neutral300} />
              <Text style={styles.emptyStateTitle}>Chưa có thực đơn nào</Text>
              <Text style={styles.emptyStateSubtitle}>
                Tạo thực đơn đầu tiên để bắt đầu
              </Text>
            </View>
          ) : (
            orderedStatuses.map((status) => {
              const group = groupedPlans[status];
              if (group.length === 0) return null;
              return (
                <View key={status} style={styles.section}>
                  <View style={styles.sectionLabelRow}>
                    <View style={[styles.dot, { backgroundColor: STATUS_DOT_COLOR[status] }]} />
                    <Text style={styles.sectionLabel}>{STATUS_LABEL[status]}</Text>
                  </View>
                  {group.map((plan) => (
                    <TouchableOpacity
                      key={plan.id}
                      activeOpacity={0.8}
                      onPress={() => navigation.navigate('MealPlanDetail', { planId: plan.id })}
                      style={styles.card}
                    >
                      {status === 'active' && <View style={styles.cardDecorCircle} />}
                      <View style={styles.cardTopRow}>
                        <View style={styles.cardTitleGroup}>
                          <View style={styles.cardTitleRow}>
                            <Feather
                              name="calendar"
                              size={18}
                              color={status === 'active' ? colors.orange500 : colors.neutral400}
                            />
                            <Text style={styles.cardTitle}>
                              {'  '}
                              {plan.name || `Tuần ${formatWeekRange(plan.weekStart, plan.weekEnd)}`}
                            </Text>
                          </View>
                          <Text style={styles.cardSubtitle}>
                            {formatWeekRange(plan.weekStart, plan.weekEnd)}
                            {plan.totalCalories > 0
                              ? ` · ${plan.totalCalories.toLocaleString()} kcal`
                              : ''}
                          </Text>
                        </View>
                        <View style={styles.chevronCircle}>
                          <Feather name="chevron-right" size={18} color={colors.neutral400} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              );
            })
          )}

          {/* Create New Plan */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CreatePlan')}
            style={styles.createButton}
          >
            <View style={styles.createIconCircle}>
              <Feather name="plus" size={20} color={colors.neutral700} />
            </View>
            <Text style={styles.createButtonText}>Tạo thực đơn mới</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.neutral900,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 96,
    gap: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.neutral500,
  },
  emptyStateSubtitle: {
    fontSize: 13,
    color: colors.neutral400,
    textAlign: 'center',
  },
  section: {
    gap: 12,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral500,
    letterSpacing: 0.8,
  },
  card: {
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
    overflow: 'hidden',
  },
  cardDecorCircle: {
    position: 'absolute',
    top: -16,
    right: -16,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.green50,
    opacity: 0.5,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitleGroup: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.neutral900,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.neutral500,
    marginTop: 4,
  },
  chevronCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neutral50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.neutral300,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  createIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral500,
  },
});

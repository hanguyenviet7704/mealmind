import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PlanStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { mealPlansApi } from '../lib/api/mealPlans';
import { ApiError } from '../lib/api/client';

type NavigationProp = NativeStackNavigationProp<PlanStackParamList>;

/** Returns the Monday of the week containing `date`. */
function getWeekMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDisplay(date: Date): string {
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return `${days[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function CreatePlanScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(false);
  const [quickCook, setQuickCook] = useState(true);
  const [includeSnack, setIncludeSnack] = useState(false);
  const [planName, setPlanName] = useState('');
  const [weekMonday, setWeekMonday] = useState<Date>(() => getWeekMonday(new Date()));

  const shiftWeek = (delta: number) => {
    setWeekMonday((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + delta * 7);
      return d;
    });
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const name = planName.trim() || `Tuần ${weekMonday.getDate()}/${weekMonday.getMonth() + 1}`;
      const res = await mealPlansApi.create({
        name,
        weekStart: toISODate(weekMonday),
      });
      navigation.navigate('MealPlanDetail', { planId: res.data.id });
    } catch (err) {
      if (err instanceof ApiError) {
        Alert.alert('Lỗi', err.message);
      } else {
        Alert.alert('Lỗi kết nối', 'Không thể tạo thực đơn. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingIconCircle}>
          <Text style={styles.loadingEmoji}>🍳</Text>
        </View>
        <Text style={styles.loadingTitle}>Đang tạo thực đơn...</Text>
        <Text style={styles.loadingSubtitle}>
          AI đang chọn món phù hợp với khẩu vị và dinh dưỡng của bạn
        </Text>
        <View style={styles.loadingProgressTrack}>
          <ActivityIndicator color={colors.orange500} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={colors.neutral700} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo thực đơn mới</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Plan Name */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>TÊN THỰC ĐƠN</Text>
          <TextInput
            value={planName}
            onChangeText={setPlanName}
            placeholder={`Tuần ${weekMonday.getDate()}/${weekMonday.getMonth() + 1}`}
            placeholderTextColor={colors.neutral400}
            style={styles.textInput}
          />
        </View>

        {/* Week Picker */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>TUẦN BẮT ĐẦU</Text>
          <View style={styles.weekPickerRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => shiftWeek(-1)}
              style={styles.weekArrowBtn}
            >
              <Feather name="chevron-left" size={20} color={colors.neutral500} />
            </TouchableOpacity>
            <Text style={styles.weekPickerText}>{formatDisplay(weekMonday)}</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => shiftWeek(1)}
              style={styles.weekArrowBtn}
            >
              <Feather name="chevron-right" size={20} color={colors.neutral500} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Options */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>TÙY CHỌN</Text>
          <View style={styles.optionsCard}>
            <View style={styles.optionRow}>
              <View style={styles.optionTextGroup}>
                <Text style={styles.optionTitle}>Ưu tiên món nấu nhanh</Text>
                <Text style={styles.optionSubtitle}>Dưới 30 phút chuẩn bị</Text>
              </View>
              <Switch
                value={quickCook}
                onValueChange={setQuickCook}
                trackColor={{ false: colors.neutral200, true: colors.orange500 }}
                thumbColor={colors.white}
              />
            </View>
            <View style={styles.optionDivider} />
            <View style={styles.optionRow}>
              <View style={styles.optionTextGroup}>
                <Text style={styles.optionTitle}>Bao gồm bữa phụ</Text>
                <Text style={styles.optionSubtitle}>Thêm trái cây, snack nhẹ</Text>
              </View>
              <Switch
                value={includeSnack}
                onValueChange={setIncludeSnack}
                trackColor={{ false: colors.neutral200, true: colors.orange500 }}
                thumbColor={colors.white}
              />
            </View>
          </View>
        </View>

        {/* Nutrition Goal */}
        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionLabel}>MỤC TIÊU DINH DƯỠNG</Text>
            <TouchableOpacity activeOpacity={0.8}>
              <Text style={styles.changeLinkText}>Thay đổi</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.nutritionCard}>
            <View style={styles.nutritionTopRow}>
              <View style={styles.nutritionIconCircle}>
                <Feather name="activity" size={20} color={colors.blue500} />
              </View>
              <View>
                <Text style={styles.nutritionGoalTitle}>Giảm cân nhẹ</Text>
                <Text style={styles.nutritionGoalSub}>Theo hồ sơ của bạn</Text>
              </View>
            </View>
            <View style={styles.nutritionDivider} />
            <View style={styles.nutritionStatsRow}>
              <View style={styles.nutritionStat}>
                <Text style={styles.nutritionStatLabel}>NĂNG LƯỢNG</Text>
                <Text style={styles.nutritionStatValue}>2,000 kcal</Text>
              </View>
              <View style={styles.nutritionStatDivider} />
              <View style={styles.nutritionStat}>
                <Text style={styles.nutritionStatLabel}>PROTEIN</Text>
                <Text style={styles.nutritionStatValue}>120g</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleCreate}
          disabled={loading}
          style={[styles.createButton, loading && styles.createButtonDisabled]}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.createButtonText}>Tạo thực đơn</Text>
          )}
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
    backgroundColor: colors.white,
    padding: 24,
  },
  loadingIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.orange100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  loadingEmoji: {
    fontSize: 40,
  },
  loadingTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.neutral900,
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 14,
    color: colors.neutral500,
    textAlign: 'center',
    maxWidth: 250,
    marginBottom: 32,
    lineHeight: 20,
  },
  loadingProgressTrack: {
    width: 200,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 128,
    gap: 32,
  },
  section: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.neutral500,
    letterSpacing: 0.8,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  changeLinkText: {
    fontSize: 12,
    color: colors.orange500,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral200,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.neutral900,
  },
  weekPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.neutral200,
  },
  weekArrowBtn: {
    padding: 12,
    borderRadius: 12,
  },
  weekPickerText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.neutral900,
  },
  optionsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral200,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  optionTextGroup: {
    flex: 1,
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.neutral900,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    color: colors.neutral500,
  },
  optionDivider: {
    height: 1,
    backgroundColor: colors.neutral100,
  },
  nutritionCard: {
    backgroundColor: colors.blue50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.blue100,
    padding: 16,
  },
  nutritionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  nutritionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.blue100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nutritionGoalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.blue900,
    marginBottom: 2,
  },
  nutritionGoalSub: {
    fontSize: 13,
    color: colors.blue700,
    fontWeight: '500',
  },
  nutritionDivider: {
    height: 1,
    backgroundColor: 'rgba(59,130,246,0.2)',
    marginBottom: 12,
  },
  nutritionStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nutritionStat: {
    flex: 1,
  },
  nutritionStatLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(59,130,246,0.8)',
    marginBottom: 2,
  },
  nutritionStatValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.blue900,
  },
  nutritionStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(59,130,246,0.2)',
    marginHorizontal: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral100,
  },
  createButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: colors.orange500,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.orange500,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
  },
});

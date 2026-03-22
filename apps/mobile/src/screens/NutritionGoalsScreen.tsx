import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { useAuthStore } from '../store/authStore';
import { dietaryApi, NutritionGoals } from '../lib/api/dietary';
import { ApiError } from '../lib/api/client';

type NavProp = NativeStackNavigationProp<ProfileStackParamList>;

type GoalOption = {
  id: string;
  icon: string;
  title: string;
  desc: string;
};

const GOAL_OPTIONS: GoalOption[] = [
  { id: 'lose', icon: '📉', title: 'Giảm cân', desc: '-500 kcal so với TDEE' },
  { id: 'maintain', icon: '⚖️', title: 'Duy trì', desc: 'Ăn bằng mức tiêu hao' },
  { id: 'gain', icon: '📈', title: 'Tăng cân/Cơ', desc: '+500 kcal, tăng đạm' },
];

const KCAL_MIN = 1200;
const KCAL_MAX = 3000;
const PROTEIN_MIN = 40;
const PROTEIN_MAX = 300;
const CARBS_MIN = 50;
const CARBS_MAX = 400;
const FAT_MIN = 20;
const FAT_MAX = 150;

export function NutritionGoalsScreen() {
  const navigation = useNavigation<NavProp>();
  const store = useAuthStore();
  const userId = store.user?.id ?? '';

  const [goal, setGoal] = useState('maintain');
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [proteinGrams, setProteinGrams] = useState(120);
  const [carbsGrams, setCarbsGrams] = useState(250);
  const [fatGrams, setFatGrams] = useState(58);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    const fetchGoals = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await dietaryApi.getNutritionGoals(userId);
        const data = res.data;
        setDailyCalories(data.dailyCalories);
        setProteinGrams(data.proteinGrams);
        setCarbsGrams(data.carbsGrams);
        setFatGrams(data.fatGrams);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Không thể tải mục tiêu. Vui lòng thử lại.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, [userId]);

  const handleSave = async () => {
    if (saving || !userId) return;
    setSaving(true);
    try {
      const goalsPayload: NutritionGoals = {
        dailyCalories,
        proteinGrams,
        carbsGrams,
        fatGrams,
      };
      await dietaryApi.updateNutritionGoals(userId, goalsPayload);
      Alert.alert('Đã lưu', 'Mục tiêu dinh dưỡng đã được cập nhật.');
      navigation.goBack();
    } catch (err) {
      if (err instanceof ApiError) {
        Alert.alert('Lỗi', err.message);
      } else {
        Alert.alert('Lỗi', 'Không thể lưu mục tiêu. Vui lòng thử lại.');
      }
    } finally {
      setSaving(false);
    }
  };

  const kcalRatio = Math.max(0, Math.min(1, (dailyCalories - KCAL_MIN) / (KCAL_MAX - KCAL_MIN)));

  const macroItems = [
    { label: 'Đạm', value: `${proteinGrams}g`, percent: `${Math.round((proteinGrams * 4 / (dailyCalories || 1)) * 100)}%`, color: colors.blue500 },
    { label: 'Tinh bột', value: `${carbsGrams}g`, percent: `${Math.round((carbsGrams * 4 / (dailyCalories || 1)) * 100)}%`, color: colors.primary },
    { label: 'Chất béo', value: `${fatGrams}g`, percent: `${Math.round((fatGrams * 9 / (dailyCalories || 1)) * 100)}%`, color: colors.green500 },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={colors.neutral700} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mục tiêu dinh dưỡng</Text>
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
              setError(null);
              setLoading(true);
              dietaryApi.getNutritionGoals(userId)
                .then((res) => {
                  setDailyCalories(res.data.dailyCalories);
                  setProteinGrams(res.data.proteinGrams);
                  setCarbsGrams(res.data.carbsGrams);
                  setFatGrams(res.data.fatGrams);
                })
                .catch(() => setError('Không thể tải mục tiêu. Vui lòng thử lại.'))
                .finally(() => setLoading(false));
            }}
          >
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.flex1}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Goal Presets */}
            <View style={styles.goalList}>
              {GOAL_OPTIONS.map((g) => {
                const isSelected = goal === g.id;
                return (
                  <TouchableOpacity
                    key={g.id}
                    activeOpacity={0.8}
                    onPress={() => setGoal(g.id)}
                    style={[
                      styles.goalCard,
                      isSelected ? styles.goalCardSelected : styles.goalCardDefault,
                    ]}
                  >
                    <Text style={styles.goalIcon}>{g.icon}</Text>
                    <View style={styles.goalTextGroup}>
                      <Text
                        style={[
                          styles.goalTitle,
                          isSelected ? styles.goalTitleSelected : styles.goalTitleDefault,
                        ]}
                      >
                        {g.title}
                      </Text>
                      <Text style={styles.goalDesc}>{g.desc}</Text>
                    </View>
                    <View
                      style={[
                        styles.radioOuter,
                        isSelected ? styles.radioOuterSelected : styles.radioOuterDefault,
                      ]}
                    >
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Daily Targets */}
            <View style={styles.targetsSection}>
              <View style={styles.targetsTitleRow}>
                <Text style={styles.targetsSectionTitle}>Mục tiêu hàng ngày</Text>
                <TouchableOpacity activeOpacity={0.8}>
                  <Text style={styles.manualEditText}>Chỉnh sửa thủ công</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.targetsCard}>
                {/* Kcal row */}
                <View style={styles.kcalRow}>
                  <Text style={styles.kcalLabel}>Năng lượng (Kcal)</Text>
                  <Text style={styles.kcalValue}>{dailyCalories.toLocaleString()}</Text>
                </View>

                {/* Progress bar */}
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${Math.round(kcalRatio * 100)}%` }]} />
                </View>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressLabel}>{KCAL_MIN}</Text>
                  <Text style={styles.progressLabel}>{KCAL_MAX}</Text>
                </View>

                {/* Macros */}
                <View style={styles.macroRow}>
                  {macroItems.map((macro, index) => {
                    const isMiddle = index === 1;
                    return (
                      <View
                        key={macro.label}
                        style={[
                          styles.macroItem,
                          isMiddle && styles.macroItemMiddle,
                        ]}
                      >
                        <Text style={[styles.macroLabel, { color: macro.color }]}>
                          {macro.label}
                        </Text>
                        <Text style={styles.macroValue}>{macro.value}</Text>
                        <Text style={styles.macroPercent}>{macro.percent}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Ranges info */}
              <View style={styles.rangesCard}>
                <Text style={styles.rangesTitle}>Khoảng hợp lệ</Text>
                <Text style={styles.rangesText}>Calories: {KCAL_MIN}–{KCAL_MAX} kcal</Text>
                <Text style={styles.rangesText}>Đạm: {PROTEIN_MIN}–{PROTEIN_MAX}g</Text>
                <Text style={styles.rangesText}>Tinh bột: {CARBS_MIN}–{CARBS_MAX}g</Text>
                <Text style={styles.rangesText}>Chất béo: {FAT_MIN}–{FAT_MAX}g</Text>
              </View>

              {/* Info Banner */}
              <View style={styles.infoBanner}>
                <Feather name="info" size={20} color={colors.blue500} style={styles.infoIcon} />
                <Text style={styles.infoText}>
                  Mục tiêu được tính toán dựa trên chiều cao, cân nặng và giới tính trong hồ sơ của bạn.
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Save Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.saveButtonText}>Lưu mục tiêu</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral50,
  },
  flex1: {
    flex: 1,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
    gap: 12,
  },
  backButton: {
    padding: 4,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.neutral900,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
    gap: 24,
  },
  goalList: {
    gap: 12,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 16,
  },
  goalCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.orange50,
  },
  goalCardDefault: {
    borderColor: colors.neutral200,
    backgroundColor: colors.white,
  },
  goalIcon: {
    fontSize: 24,
  },
  goalTextGroup: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  goalTitleSelected: {
    color: colors.orange900,
  },
  goalTitleDefault: {
    color: colors.neutral800,
  },
  goalDesc: {
    fontSize: 12,
    color: colors.neutral500,
    marginTop: 2,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.primary,
  },
  radioOuterDefault: {
    borderColor: colors.neutral300,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  targetsSection: {
    gap: 12,
  },
  targetsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  targetsSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral900,
  },
  manualEditText: {
    fontSize: 12,
    color: colors.primary,
  },
  targetsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral200,
    padding: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  kcalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  kcalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral600,
  },
  kcalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.orange600,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.neutral100,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 10,
    color: colors.neutral400,
  },
  macroRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.neutral100,
    paddingTop: 16,
    marginTop: 4,
  },
  macroItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  macroItemMiddle: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.neutral100,
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  macroValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.neutral800,
  },
  macroPercent: {
    fontSize: 10,
    color: colors.neutral400,
  },
  rangesCard: {
    backgroundColor: colors.neutral50,
    borderRadius: 12,
    padding: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.neutral200,
  },
  rangesTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral600,
    marginBottom: 4,
  },
  rangesText: {
    fontSize: 12,
    color: colors.neutral500,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: colors.blue50,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginTop: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#1e3a8a',
    lineHeight: 18,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral100,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
});

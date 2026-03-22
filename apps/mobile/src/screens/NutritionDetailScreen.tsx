import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RecipesStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { recipesApi } from '../lib/api/recipes';
import { ApiError } from '../lib/api/client';
import type { RecipeDetail } from '../lib/api/recipes';

type NutritionDetailNavProp = NativeStackNavigationProp<RecipesStackParamList, 'NutritionDetail'>;
type NutritionDetailRouteProp = RouteProp<RecipesStackParamList, 'NutritionDetail'>;

export function NutritionDetailScreen() {
  const navigation = useNavigation<NutritionDetailNavProp>();
  const route = useRoute<NutritionDetailRouteProp>();
  const { id } = route.params;

  const [detail, setDetail] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [servings, setServings] = useState(2);

  const fetchDetail = async (servingsCount?: number) => {
    try {
      const res = await recipesApi.getDetail(String(id), servingsCount);
      setDetail(res.data);
    } catch (err) {
      if (err instanceof ApiError) {
        Alert.alert('Lỗi', err.message);
      } else {
        Alert.alert('Lỗi', 'Không thể kết nối máy chủ. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleServingsChange = (newServings: number) => {
    setServings(newServings);
    fetchDetail(newServings);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const nutrition = detail?.nutrition;
  const recipeName = detail?.name ?? 'Dinh dưỡng';

  const totalMacroG = nutrition
    ? nutrition.protein + nutrition.carbs + nutrition.fat
    : 0;

  const macros = nutrition
    ? [
        {
          label: '💪 Protein',
          val: `${nutrition.protein}g`,
          pct: totalMacroG > 0 ? `${Math.round((nutrition.protein / totalMacroG) * 100)}%` : '0%',
          pctNum: totalMacroG > 0 ? nutrition.protein / totalMacroG : 0,
          color: colors.blue500,
        },
        {
          label: '🍚 Carbs',
          val: `${nutrition.carbs}g`,
          pct: totalMacroG > 0 ? `${Math.round((nutrition.carbs / totalMacroG) * 100)}%` : '0%',
          pctNum: totalMacroG > 0 ? nutrition.carbs / totalMacroG : 0,
          color: colors.orange500,
        },
        {
          label: '🧈 Fat',
          val: `${nutrition.fat}g`,
          pct: totalMacroG > 0 ? `${Math.round((nutrition.fat / totalMacroG) * 100)}%` : '0%',
          pctNum: totalMacroG > 0 ? nutrition.fat / totalMacroG : 0,
          color: colors.green500,
        },
        {
          label: '🥬 Fiber',
          val: `${nutrition.fiber ?? 0}g`,
          pct: totalMacroG > 0 ? `${Math.round(((nutrition.fiber ?? 0) / totalMacroG) * 100)}%` : '0%',
          pctNum: totalMacroG > 0 ? (nutrition.fiber ?? 0) / totalMacroG : 0,
          color: '#34d399',
        },
      ]
    : [];

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
        <View>
          <Text style={styles.headerTitle}>Dinh dưỡng</Text>
          <Text style={styles.headerSubtitle}>{recipeName}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Serving size picker */}
        <View style={styles.servingCard}>
          <Text style={styles.servingLabel}>Số người ăn:</Text>
          <View style={styles.servingControls}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.servingButton}
              onPress={() => handleServingsChange(Math.max(1, servings - 1))}
            >
              <Feather name="minus" size={16} color={colors.neutral600} />
            </TouchableOpacity>
            <Text style={styles.servingCount}>{servings}</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.servingButton}
              onPress={() => handleServingsChange(servings + 1)}
            >
              <Feather name="plus" size={16} color={colors.neutral600} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Calorie + Pie chart card */}
        <View style={styles.calorieCard}>
          <View style={styles.calorieHeader}>
            <Feather name="zap" size={28} color={colors.orange500} />
            <Text style={styles.calorieNumber}>{nutrition?.calories ?? 0}</Text>
          </View>
          <Text style={styles.calorieLabel}>KCAL / KHẨU PHẦN</Text>

          {/* Donut chart approximation using nested Views */}
          <View style={styles.donutWrapper}>
            <View style={styles.donutOuter}>
              <View style={styles.donutMiddle}>
                <View style={styles.donutCenter}>
                  <Feather name="pie-chart" size={32} color={colors.neutral300} />
                </View>
              </View>
            </View>
            <View style={[styles.donutArc, styles.donutArcOrange]} />
            <View style={[styles.donutArc, styles.donutArcGreen]} />
          </View>

          <View style={styles.macroLegend}>
            <Text style={styles.legendBlue}>
              P: {totalMacroG > 0 ? Math.round(((nutrition?.protein ?? 0) / totalMacroG) * 100) : 0}%
            </Text>
            <Text style={styles.legendOrange}>
              C: {totalMacroG > 0 ? Math.round(((nutrition?.carbs ?? 0) / totalMacroG) * 100) : 0}%
            </Text>
            <Text style={styles.legendGreen}>
              F: {totalMacroG > 0 ? Math.round(((nutrition?.fat ?? 0) / totalMacroG) * 100) : 0}%
            </Text>
          </View>
        </View>

        {/* Macro bars card */}
        <View style={styles.macroCard}>
          {macros.map((m, i) => (
            <View key={i} style={i < macros.length - 1 ? styles.macroRow : styles.macroRowLast}>
              <View style={styles.macroRowHeader}>
                <Text style={styles.macroLabel}>{m.label}</Text>
                <View style={styles.macroValues}>
                  <Text style={styles.macroVal}>{m.val}</Text>
                  <Text style={styles.macroPct}>{m.pct}</Text>
                </View>
              </View>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${m.pctNum * 100}%` as any, backgroundColor: m.color },
                  ]}
                />
              </View>
            </View>
          ))}

          {/* Sodium divider row */}
          <View style={styles.sodiumRow}>
            <Text style={styles.sodiumLabel}>🧂 Sodium (Muối)</Text>
            <Text style={styles.sodiumValue}>{nutrition?.sodium ?? 0}mg</Text>
          </View>
        </View>

        {/* Info note */}
        <View style={styles.infoBox}>
          <Feather name="info" size={20} color="#1d4ed8" style={styles.infoIcon} />
          <Text style={styles.infoText}>
            Một số giá trị dinh dưỡng mang tính chất ước tính dựa trên nguyên liệu cơ bản.
          </Text>
        </View>

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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
    gap: 12,
  },
  backButton: {
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.neutral900,
    lineHeight: 24,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.neutral500,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 24,
  },

  // Serving card
  servingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  servingLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.neutral800,
  },
  servingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  servingButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  servingCount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.neutral900,
    width: 16,
    textAlign: 'center',
  },

  // Calorie card
  calorieCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral100,
    padding: 24,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  calorieHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  calorieNumber: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.orange500,
  },
  calorieLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.neutral500,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 24,
  },
  // Donut chart (simplified visual approximation)
  donutWrapper: {
    width: 128,
    height: 128,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  donutOuter: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 12,
    borderColor: colors.blue500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutMiddle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 12,
    borderColor: colors.green500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCenter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutArc: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 12,
  },
  donutArcOrange: {
    borderColor: 'transparent',
    borderTopColor: colors.orange500,
    borderRightColor: colors.orange500,
    transform: [{ rotate: '45deg' }],
  },
  donutArcGreen: {
    borderColor: 'transparent',
    borderBottomColor: colors.green500,
    borderLeftColor: colors.green500,
    transform: [{ rotate: '-12deg' }],
  },
  macroLegend: {
    flexDirection: 'row',
    gap: 16,
  },
  legendBlue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.blue500,
  },
  legendOrange: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.orange600,
  },
  legendGreen: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.green500,
  },

  // Macro bar card
  macroCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral100,
    padding: 20,
    gap: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  macroRow: {
    gap: 6,
  },
  macroRowLast: {
    gap: 6,
  },
  macroRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral700,
  },
  macroValues: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  macroVal: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral900,
  },
  macroPct: {
    fontSize: 12,
    color: colors.neutral400,
    width: 32,
    textAlign: 'right',
  },
  barTrack: {
    height: 10,
    backgroundColor: colors.neutral100,
    borderRadius: 999,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
  },
  sodiumRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.neutral100,
  },
  sodiumLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral600,
  },
  sodiumValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral600,
  },

  // Info box
  infoBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 12,
  },
  infoIcon: {
    flexShrink: 0,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1e3a8a',
    lineHeight: 20,
  },

  bottomSpacer: {
    height: 40,
  },
});

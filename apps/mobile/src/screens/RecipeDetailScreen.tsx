import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Image,
  StyleSheet, Dimensions, ActivityIndicator, Alert, Share,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RecipesStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { recipesApi } from '../lib/api/recipes';
import { suggestionsApi } from '../lib/api/suggestions';
import { ApiError } from '../lib/api/client';
import type { RecipeDetail, Ingredient, CookingStep, Nutrition } from '../lib/api/recipes';

type Nav = NativeStackNavigationProp<RecipesStackParamList, 'RecipeDetail'>;
type Route = RouteProp<RecipesStackParamList, 'RecipeDetail'>;

type Tab = 'NL' | 'CACH_NAU' | 'DD';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DIFFICULTY_MAP: Record<string, string> = {
  easy: 'Dễ',
  medium: 'Trung bình',
  hard: 'Khó',
};

export function RecipeDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { id } = route.params;

  const [activeTab, setActiveTab] = useState<Tab>('NL');
  const [servings, setServings] = useState(2);
  const [detail, setDetail] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const fetchDetail = async (servingsCount?: number) => {
    try {
      const res = await recipesApi.getDetail(String(id), servingsCount);
      setDetail(res.data);
      setIsBookmarked(res.data.isBookmarked ?? false);
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

    // Record view interaction
    suggestionsApi.recordInteractions([
      {
        recipeId: String(id),
        action: 'view',
        context: { source: 'detail' },
        timestamp: new Date().toISOString(),
      },
    ]).catch(() => {
      // Silently ignore interaction recording errors
    });
  }, [id]);

  const handleServingsChange = (newServings: number) => {
    setServings(newServings);
    fetchDetail(newServings);
  };

  const handleBookmarkToggle = async () => {
    const wasBookmarked = isBookmarked;
    setIsBookmarked(!wasBookmarked);
    try {
      if (wasBookmarked) {
        await recipesApi.unbookmark(String(id));
      } else {
        await recipesApi.bookmark(String(id));
      }
    } catch (err) {
      setIsBookmarked(wasBookmarked);
      if (err instanceof ApiError) {
        Alert.alert('Lỗi', err.message);
      } else {
        Alert.alert('Lỗi', 'Không thể kết nối máy chủ. Vui lòng thử lại.');
      }
    }
  };

  const handleShare = async () => {
    if (!detail) return;
    try {
      await Share.share({ message: detail.name });
    } catch {
      // Ignore share errors
    }
  };

  const handleStartCooking = async () => {
    try {
      await suggestionsApi.recordInteractions([
        {
          recipeId: String(id),
          action: 'cook',
          context: { source: 'detail' },
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch {
      // Silently ignore
    }
    navigation.navigate('CookingMode', { id });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!detail) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Không thể tải dữ liệu món ăn.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backFallback}>
          <Text style={styles.backFallbackText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Floating Header */}
      <View style={styles.floatingHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.floatingButton}
        >
          <Feather name="arrow-left" size={20} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.floatingActions}>
          <TouchableOpacity style={styles.floatingButton} onPress={handleBookmarkToggle}>
            <Feather
              name="heart"
              size={20}
              color={isBookmarked ? colors.primary : colors.white}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.floatingButton} onPress={handleShare}>
            <Feather name="share-2" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[2]}>
        {/* Hero Image */}
        <Image
          source={{ uri: detail.imageUrl }}
          style={styles.heroImage}
        />
        <View style={styles.heroOverlay} />

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{detail.name}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Feather name="clock" size={16} color={colors.neutral400} />
              <Text style={styles.metaText}>{detail.cookTime}p chuẩn bị + nấu</Text>
            </View>
            <View style={styles.metaItem}>
              <Text>🔥</Text>
              <Text style={styles.metaText}>{detail.calories}kcal</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="star" size={16} color="#facc15" />
              <Text style={styles.metaText}>{DIFFICULTY_MAP[detail.difficulty] ?? detail.difficulty}</Text>
            </View>
          </View>

          <View style={styles.tagRow}>
            <View style={styles.tagOrange}>
              <Text style={styles.tagOrangeText}>{detail.cuisine}</Text>
            </View>
            {detail.mealTypes.map((mt) => (
              <View key={mt} style={styles.tagBlue}>
                <Text style={styles.tagBlueText}>{mt}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.description}>{detail.description}</Text>
        </View>

        {/* Tabs (sticky) */}
        <View style={styles.tabBar}>
          {(['NL', 'CACH_NAU', 'DD'] as Tab[]).map((tab) => {
            const labels: Record<Tab, string> = { NL: 'Nguyên liệu', CACH_NAU: 'Cách nấu', DD: 'Dinh dưỡng' };
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {labels[tab]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tab content */}
        <View style={styles.tabContent}>
          {activeTab === 'NL' && (
            <IngredientsTab
              ingredients={detail.ingredients}
              servings={servings}
              onServingsChange={handleServingsChange}
              onStartCooking={handleStartCooking}
            />
          )}
          {activeTab === 'CACH_NAU' && <StepsTab steps={detail.steps} />}
          {activeTab === 'DD' && (
            <NutritionTab
              nutrition={detail.nutrition}
              onViewDetail={() => navigation.navigate('NutritionDetail', { id })}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function IngredientsTab({
  ingredients,
  servings,
  onServingsChange,
  onStartCooking,
}: {
  ingredients: Ingredient[];
  servings: number;
  onServingsChange: (n: number) => void;
  onStartCooking: () => void;
}) {
  const grouped: Record<string, Ingredient[]> = {};
  for (const ing of ingredients) {
    if (!grouped[ing.group]) grouped[ing.group] = [];
    grouped[ing.group].push(ing);
  }

  const groupLabels: Record<string, string> = {
    main: '▾ Nguyên liệu chính',
    seasoning: '▾ Gia vị',
    garnish: '▾ Trang trí / Ăn kèm',
  };

  return (
    <View style={styles.tabSection}>
      <View style={styles.servingsBox}>
        <Text style={styles.servingsLabel}>Số người ăn:</Text>
        <View style={styles.servingsControls}>
          <TouchableOpacity
            onPress={() => onServingsChange(Math.max(1, servings - 1))}
            style={styles.servingsButton}
          >
            <Feather name="minus" size={16} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.servingsValue}>{servings}</Text>
          <TouchableOpacity
            onPress={() => onServingsChange(servings + 1)}
            style={styles.servingsButton}
          >
            <Feather name="plus" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {Object.entries(grouped).map(([group, items]) => (
        <View key={group}>
          <Text style={styles.sectionHeading}>{groupLabels[group] ?? `▾ ${group}`}</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.ingredientRow}>
              <View style={styles.ingredientCheckbox} />
              <Text style={styles.ingredientName}>{item.name}</Text>
              <View style={styles.flex} />
              <Text style={styles.ingredientAmount}>
                {item.amount} {item.unit}
              </Text>
            </View>
          ))}
        </View>
      ))}

      <TouchableOpacity onPress={onStartCooking} style={styles.cookButton} activeOpacity={0.8}>
        <Text style={{ fontSize: 18 }}>🔥</Text>
        <Text style={styles.cookButtonText}>Bắt đầu nấu</Text>
      </TouchableOpacity>
    </View>
  );
}

function StepsTab({ steps }: { steps: CookingStep[] }) {
  const sorted = [...steps].sort((a, b) => a.order - b.order);
  return (
    <View style={styles.tabSection}>
      {sorted.map((step, i) => (
        <View key={step.order} style={styles.stepRow}>
          <View style={styles.stepLeft}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{step.order}</Text>
            </View>
            {i < sorted.length - 1 && <View style={styles.stepLine} />}
          </View>
          <View style={styles.stepBody}>
            <Text style={styles.stepDesc}>{step.description}</Text>
            {step.timerSeconds != null && step.timerSeconds > 0 && (
              <TouchableOpacity style={styles.timerButton}>
                <Feather name="clock" size={16} color={colors.blue700} />
                <Text style={styles.timerText}>
                  Bấm giờ:{' '}
                  {step.timerSeconds >= 60
                    ? `${Math.floor(step.timerSeconds / 60)} phút`
                    : `${step.timerSeconds} giây`}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

function NutritionTab({
  nutrition,
  onViewDetail,
}: {
  nutrition: Nutrition;
  onViewDetail: () => void;
}) {
  const totalMacroG = nutrition.protein + nutrition.carbs + nutrition.fat;
  const macros = [
    {
      label: 'Protein (Đạm)',
      val: `${nutrition.protein}g`,
      pct: totalMacroG > 0 ? nutrition.protein / totalMacroG : 0,
      color: colors.blue500,
    },
    {
      label: 'Carbs (Tinh bột)',
      val: `${nutrition.carbs}g`,
      pct: totalMacroG > 0 ? nutrition.carbs / totalMacroG : 0,
      color: colors.primary,
    },
    {
      label: 'Fat (Chất béo)',
      val: `${nutrition.fat}g`,
      pct: totalMacroG > 0 ? nutrition.fat / totalMacroG : 0,
      color: colors.green500,
    },
  ];
  const BAR_WIDTH = SCREEN_WIDTH - 80;

  return (
    <View style={styles.tabSection}>
      <TouchableOpacity onPress={onViewDetail} style={styles.calorieBox} activeOpacity={0.8}>
        <View>
          <Text style={styles.calorieLabel}>Tổng năng lượng</Text>
          <Text style={styles.calorieValue}>
            🔥 {nutrition.calories}
            <Text style={styles.calorieUnit}> kcal</Text>
          </Text>
        </View>
        <Feather name="chevron-right" size={20} color={colors.neutral400} />
      </TouchableOpacity>
      {macros.map((m, i) => (
        <View key={i} style={styles.macroRow}>
          <View style={styles.macroHeader}>
            <Text style={styles.macroLabel}>{m.label}</Text>
            <Text style={styles.macroValue}>{m.val}</Text>
          </View>
          <View style={styles.macroBarBg}>
            <View style={[styles.macroBar, { width: BAR_WIDTH * m.pct, backgroundColor: m.color }]} />
          </View>
        </View>
      ))}
      <Text style={styles.nutritionNote}>
        ⚠ Giá trị dinh dưỡng mang tính chất tham khảo cho 1 khẩu phần ăn.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  flex: { flex: 1 },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  errorText: {
    fontSize: 15,
    color: colors.neutral600,
    marginBottom: 16,
  },
  backFallback: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  backFallbackText: {
    color: colors.white,
    fontWeight: '600',
  },

  floatingHeader: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    zIndex: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  floatingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingActions: { flexDirection: 'row', gap: 8 },

  heroImage: { width: '100%', height: 300 },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  content: {
    padding: 20,
    paddingTop: 24,
    marginTop: -24,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  title: { fontSize: 24, fontWeight: '700', color: colors.neutral900, marginBottom: 12 },

  metaRow: { flexDirection: 'row', gap: 16, marginBottom: 12, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 13, fontWeight: '500', color: colors.neutral600 },

  tagRow: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  tagOrange: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: colors.orange50, borderRadius: 8 },
  tagOrangeText: { fontSize: 12, fontWeight: '600', color: colors.orange700 },
  tagBlue: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: colors.blue50, borderRadius: 8 },
  tagBlueText: { fontSize: 12, fontWeight: '600', color: colors.blue700 },

  description: { fontSize: 14, color: colors.neutral600, lineHeight: 22 },

  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
    backgroundColor: colors.white,
  },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: colors.neutral500 },
  tabTextActive: { color: colors.primary },

  tabContent: { paddingBottom: 32 },
  tabSection: { padding: 20 },

  servingsBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.orange50,
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  servingsLabel: { fontSize: 15, fontWeight: '600', color: colors.neutral800 },
  servingsControls: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  servingsButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.orange200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  servingsValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.neutral900,
    minWidth: 20,
    textAlign: 'center',
  },

  sectionHeading: { fontSize: 15, fontWeight: '700', color: colors.neutral900, marginBottom: 12, marginTop: 16 },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  ingredientCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.neutral300,
  },
  ingredientName: { fontSize: 15, color: colors.neutral700, fontWeight: '500' },
  ingredientAmount: { fontSize: 15, fontWeight: '600', color: colors.neutral900 },

  cookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 24,
  },
  cookButtonText: { color: colors.white, fontSize: 16, fontWeight: '700' },

  stepRow: { flexDirection: 'row', gap: 16, marginBottom: 8 },
  stepLeft: { alignItems: 'center', width: 32 },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.orange100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: { fontSize: 14, fontWeight: '700', color: colors.orange700 },
  stepLine: { flex: 1, width: 1, backgroundColor: colors.neutral200, marginTop: 4 },
  stepBody: { flex: 1, paddingBottom: 24 },
  stepTitle: { fontSize: 15, fontWeight: '700', color: colors.neutral900, marginBottom: 4 },
  stepDesc: { fontSize: 14, color: colors.neutral600, lineHeight: 22 },
  timerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.blue50,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  timerText: { fontSize: 14, fontWeight: '500', color: colors.blue700 },

  calorieBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.neutral50,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  calorieLabel: { fontSize: 13, color: colors.neutral500, fontWeight: '500', marginBottom: 4 },
  calorieValue: { fontSize: 28, fontWeight: '700', color: colors.neutral900 },
  calorieUnit: { fontSize: 16, color: colors.neutral500, fontWeight: '400' },

  macroRow: { marginBottom: 16 },
  macroHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  macroLabel: { fontSize: 13, fontWeight: '500', color: colors.neutral700 },
  macroValue: { fontSize: 13, fontWeight: '600', color: colors.neutral900 },
  macroBarBg: { height: 8, backgroundColor: colors.neutral100, borderRadius: 4, overflow: 'hidden' },
  macroBar: { height: 8, borderRadius: 4 },

  nutritionNote: { fontSize: 12, color: colors.neutral400, fontStyle: 'italic', marginTop: 16, lineHeight: 18 },
});

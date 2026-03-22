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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { suggestionsApi, SuggestionCard } from '../lib/api/suggestions';
import { ApiError } from '../lib/api/client';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const MEAL_TIMES = ['Sáng', 'Trưa', 'Tối'] as const;
type MealTime = (typeof MEAL_TIMES)[number];

const MAX_COOK_TIME = 30;

export function QuickCookScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [activeMealTime, setActiveMealTime] = useState<MealTime>('Sáng');
  const [cards, setCards] = useState<SuggestionCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchQuickRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await suggestionsApi.getSuggestions({ count: 10 });
      const filtered = res.data.suggestions.filter(
        (c) => c.recipe.cookTime <= MAX_COOK_TIME
      );
      setCards(filtered);
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert('Không thể tải gợi ý', error.message);
      } else {
        Alert.alert('Không thể tải gợi ý', 'Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuickRecipes();
  }, [fetchQuickRecipes]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await suggestionsApi.getSuggestions({ count: 10 });
      const filtered = res.data.suggestions.filter(
        (c) => c.recipe.cookTime <= MAX_COOK_TIME
      );
      setCards(filtered);
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert('Không thể tải gợi ý', error.message);
      } else {
        Alert.alert('Không thể tải gợi ý', 'Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Feather name="arrow-left" size={24} color={colors.neutral700} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Nấu nhanh ⚡</Text>
          <Text style={styles.headerSubtitle}>Các món nấu dưới {MAX_COOK_TIME} phút</Text>
        </View>
      </View>

      {/* Meal time tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {MEAL_TIMES.map((time) => (
          <TouchableOpacity
            key={time}
            activeOpacity={0.8}
            onPress={() => setActiveMealTime(time)}
            style={[styles.tab, activeMealTime === time ? styles.tabActive : styles.tabInactive]}
          >
            <Text
              style={[
                styles.tabText,
                activeMealTime === time ? styles.tabTextActive : styles.tabTextInactive,
              ]}
            >
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Recipe list */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải món...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          <Text style={styles.sectionLabel}>Gợi ý cho bạn</Text>

          {cards.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🍳</Text>
              <Text style={styles.emptyText}>Không có món nhanh nào.</Text>
              <TouchableOpacity onPress={fetchQuickRecipes} style={styles.retryBtn}>
                <Text style={styles.retryBtnText}>Tải lại</Text>
              </TouchableOpacity>
            </View>
          ) : (
            cards.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                style={styles.recipeCard}
                onPress={() =>
                  navigation.navigate('RecipeDetail' as never, { id: item.recipe.id } as never)
                }
              >
                {/* Top row: image + info */}
                <View style={styles.recipeRow}>
                  <Image source={{ uri: item.recipe.imageUrl }} style={styles.recipeImg} />
                  <View style={styles.recipeInfo}>
                    <View style={styles.recipeInfoTop}>
                      <Text style={styles.recipeTitle}>{item.recipe.name}</Text>
                      <TouchableOpacity activeOpacity={0.8} style={styles.heartBtn}>
                        <Feather name="heart" size={18} color={colors.neutral400} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.recipeMeta}>
                      <View style={styles.metaItem}>
                        <Feather name="clock" size={13} color={colors.neutral500} />
                        <Text style={styles.metaText}>{item.recipe.cookTime}p</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Feather name="zap" size={13} color={colors.neutral500} />
                        <Text style={styles.metaText}>{item.recipe.calories}kcal</Text>
                      </View>
                    </View>
                    <View style={styles.difficultyBadge}>
                      <Text style={styles.difficultyText}>
                        {item.recipe.difficulty === 'easy'
                          ? 'DỄ'
                          : item.recipe.difficulty === 'medium'
                          ? 'TB'
                          : 'KHÓ'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Reason tip */}
                <View style={styles.tipBox}>
                  <Text style={styles.tipIcon}>💡</Text>
                  <Text style={styles.tipText}>"{item.reason}"</Text>
                </View>
              </TouchableOpacity>
            ))
          )}

          {/* bottom padding */}
          <View style={styles.bottomPad} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  backBtn: {
    padding: 4,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.neutral900,
    lineHeight: 22,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.neutral500,
  },
  tabsContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
    flexGrow: 0,
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  tabInactive: {
    backgroundColor: colors.neutral100,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
  },
  tabTextActive: {
    color: colors.white,
  },
  tabTextInactive: {
    color: colors.neutral600,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: colors.neutral500,
    marginTop: 8,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral500,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 15,
    color: colors.neutral500,
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.orange50,
    borderRadius: 20,
  },
  retryBtnText: {
    color: colors.primary,
    fontWeight: '600',
  },
  recipeCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.neutral100,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  recipeImg: {
    width: 96,
    height: 96,
    borderRadius: 12,
  },
  recipeInfo: {
    flex: 1,
    paddingVertical: 4,
  },
  recipeInfoTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  recipeTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.neutral900,
    lineHeight: 20,
    marginRight: 4,
  },
  heartBtn: {
    padding: 4,
  },
  recipeMeta: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.neutral500,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: colors.green50,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.green700,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  tipIcon: {
    fontSize: 14,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'italic',
    color: '#1e3a8a',
  },
  bottomPad: {
    height: 80,
  },
});

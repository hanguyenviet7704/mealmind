import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Image,
  StyleSheet, PanResponder, Animated, Dimensions,
  ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { suggestionsApi, SuggestionCard, ContextData, MealType } from '../lib/api/suggestions';
import { ApiError } from '../lib/api/client';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MEAL_TABS = ['⚡ Nấu nhanh', 'Sáng', 'Trưa', 'Tối', 'Phụ'];
const TAB_MEAL_TYPES: (MealType | null)[] = [null, 'breakfast', 'lunch', 'dinner', 'snack'];

function mapDifficulty(difficulty: 'easy' | 'medium' | 'hard'): string {
  switch (difficulty) {
    case 'easy': return 'Dễ';
    case 'medium': return 'Trung bình';
    case 'hard': return 'Khó';
  }
}

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [activeTab, setActiveTab] = useState(2); // Trưa
  const [suggestions, setSuggestions] = useState<SuggestionCard[]>([]);
  const [context, setContext] = useState<ContextData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shownIds, setShownIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;

  const currentMealType = TAB_MEAL_TYPES[activeTab] ?? 'lunch';

  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await suggestionsApi.getSuggestions({ mealType: currentMealType, count: 5 });
      setSuggestions(res.data.suggestions);
      setContext(res.data.context);
      setShownIds(res.data.suggestions.map((s) => s.recipe.id));
      setCurrentIndex(0);
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert('Không thể tải gợi ý', error.message);
      } else {
        Alert.alert('Không thể tải gợi ý', 'Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  }, [currentMealType]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await suggestionsApi.getSuggestions({ mealType: currentMealType, count: 5 });
      setSuggestions(res.data.suggestions);
      setContext(res.data.context);
      setShownIds(res.data.suggestions.map((s) => s.recipe.id));
      setCurrentIndex(0);
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert('Không thể tải gợi ý', error.message);
      } else {
        Alert.alert('Không thể tải gợi ý', 'Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } finally {
      setRefreshing(false);
    }
  }, [currentMealType]);

  const handleSwipe = useCallback(async (direction: 'left' | 'right', card: SuggestionCard) => {
    const action = direction === 'right' ? 'save' : 'skip';
    try {
      await suggestionsApi.recordInteractions([
        {
          recipeId: card.recipe.id,
          action,
          suggestionId: card.id,
          context: { mealType: currentMealType, source: 'home' },
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch {
      // Interaction recording is fire-and-forget; don't block the user
    }

    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);

    // When cards run out, fetch more
    if (nextIndex >= suggestions.length) {
      try {
        const res = await suggestionsApi.refreshSuggestions({
          mealType: currentMealType,
          excludeRecipeIds: shownIds,
          count: 5,
        });
        const newSuggestions = res.data.suggestions;
        setSuggestions(newSuggestions);
        setShownIds((prev) => [...prev, ...newSuggestions.map((s) => s.recipe.id)]);
        setCurrentIndex(0);
      } catch (error) {
        if (error instanceof ApiError) {
          Alert.alert('Không thể tải gợi ý', error.message);
        }
      }
    }
  }, [currentIndex, suggestions, shownIds, currentMealType]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > 5,
      onPanResponderMove: (_, gs) => {
        translateX.setValue(gs.dx);
      },
      onPanResponderRelease: (_, gs) => {
        if (Math.abs(gs.dx) > 80) {
          const direction = gs.dx < 0 ? 'left' : 'right';
          const targetX = gs.dx < 0 ? -SCREEN_WIDTH : SCREEN_WIDTH;
          Animated.timing(translateX, {
            toValue: targetX,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            translateX.setValue(0);
          });
          // We need the card at the time of release
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  // Override panResponder release to capture card at swipe time
  const currentCard = suggestions[currentIndex] ?? null;

  const panResponderWithCard = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > 5,
      onPanResponderMove: (_, gs) => {
        translateX.setValue(gs.dx);
      },
      onPanResponderRelease: (_, gs) => {
        if (Math.abs(gs.dx) > 80) {
          const direction: 'left' | 'right' = gs.dx < 0 ? 'left' : 'right';
          const targetX = gs.dx < 0 ? -SCREEN_WIDTH : SCREEN_WIDTH;
          Animated.timing(translateX, {
            toValue: targetX,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            translateX.setValue(0);
          });
          if (currentCard) {
            handleSwipe(direction, currentCard);
          }
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  // Weather info from context
  const weatherText = context?.weather?.available
    ? `${context.weather.condition} ${context.weather.temperature}°C`
    : '🌤️ TP.HCM';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Chào buổi trưa!</Text>
          <Text style={styles.weather}>
            {context?.weather?.available
              ? `${context.weather.condition} ${context.weather.temperature}°C`
              : '🌤️ 28°C TP.HCM'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Search')}
          style={styles.searchButton}
        >
          <Feather name="search" size={20} color={colors.neutral600} />
        </TouchableOpacity>
      </View>

      {/* Family + Tabs */}
      <View style={styles.subHeader}>
        <View style={styles.familyRow}>
          <View style={styles.avatar}>
            <Text>👩</Text>
          </View>
          <View style={[styles.avatar, { marginLeft: -12, zIndex: 2 }]}>
            <Text>👦</Text>
          </View>
          <View style={[styles.avatar, { marginLeft: -12, zIndex: 1 }]}>
            <Text>👧</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContent}
        >
          {MEAL_TABS.map((tab, idx) => (
            <TouchableOpacity
              key={tab}
              onPress={() => {
                if (idx === 0) navigation.navigate('QuickCook');
                else setActiveTab(idx);
              }}
              style={[
                styles.tab,
                idx === 0 && styles.tabQuick,
                idx !== 0 && idx === activeTab && styles.tabActive,
                idx !== 0 && idx !== activeTab && styles.tabInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  idx === 0 && styles.tabTextQuick,
                  idx !== 0 && idx === activeTab && styles.tabTextActive,
                  idx !== 0 && idx !== activeTab && styles.tabTextInactive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Card Stack */}
      <ScrollView
        style={styles.cardScrollArea}
        contentContainerStyle={styles.cardScrollContent}
        scrollEnabled={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.cardArea}>
          {loading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Đang tải gợi ý...</Text>
            </View>
          ) : currentCard ? (
            <>
              {/* Background stacked cards */}
              {currentIndex + 2 < suggestions.length && (
                <View style={[styles.card, styles.cardBg2]} />
              )}
              {currentIndex + 1 < suggestions.length && (
                <View style={[styles.card, styles.cardBg1]} />
              )}

              {/* Main card */}
              <Animated.View
                style={[styles.card, { transform: [{ translateX }] }]}
                {...panResponderWithCard.panHandlers}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() =>
                    navigation.navigate('RecipeDetail' as never, { id: currentCard.recipe.id } as never)
                  }
                  style={styles.flex}
                >
                  <View style={styles.cardImageContainer}>
                    <Image source={{ uri: currentCard.recipe.imageUrl }} style={styles.cardImage} />
                    <View style={styles.cardImageOverlay} />
                    <TouchableOpacity style={styles.heartButton}>
                      <Feather name="heart" size={20} color={colors.white} />
                    </TouchableOpacity>
                    <View style={styles.cardImageInfo}>
                      <Text style={styles.cardTitle}>{currentCard.recipe.name}</Text>
                      <View style={styles.cardBadges}>
                        <View style={styles.infoBadge}>
                          <Feather name="clock" size={14} color={colors.white} />
                          <Text style={styles.badgeText}>{currentCard.recipe.cookTime}p</Text>
                        </View>
                        <View style={styles.infoBadge}>
                          <Text style={styles.badgeText}>🔥 {currentCard.recipe.calories}kcal</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.cardBody}>
                    <View style={styles.tagRow}>
                      <View style={styles.tagOrange}>
                        <Text style={styles.tagOrangeText}>{currentCard.recipe.cuisine}</Text>
                      </View>
                      <View style={styles.tagGreen}>
                        <Text style={styles.tagGreenText}>
                          {mapDifficulty(currentCard.recipe.difficulty)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.reasonBox}>
                      <Text style={styles.reasonEmoji}>💡</Text>
                      <Text style={styles.reasonText}>"{currentCard.reason}"</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🍽️</Text>
              <Text style={styles.emptyText}>Hết gợi ý hôm nay!</Text>
              <TouchableOpacity
                onPress={fetchSuggestions}
                style={styles.resetButton}
              >
                <Text style={styles.resetButtonText}>Tải thêm gợi ý</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Surprise')}
          style={styles.actionButtonSecondary}
          activeOpacity={0.8}
        >
          <Text style={styles.actionEmoji}>🎲</Text>
          <Text style={styles.actionTextSecondary}>Surprise</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Combo')}
          style={styles.actionButtonPrimary}
          activeOpacity={0.8}
        >
          <Text style={styles.actionEmoji}>🍱</Text>
          <Text style={styles.actionTextPrimary}>Combo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const CARD_WIDTH = SCREEN_WIDTH - 40;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral50 },
  flex: { flex: 1 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  greeting: { fontSize: 20, fontWeight: '700', color: colors.neutral900 },
  weather: { fontSize: 13, color: colors.neutral500, marginTop: 2 },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  subHeader: { paddingHorizontal: 20, paddingBottom: 8 },
  familyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 8 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.orange100,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  tabsScroll: { marginTop: 4 },
  tabsContent: { gap: 8, paddingRight: 4 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  tabQuick: { backgroundColor: '#fef3c7' },
  tabActive: { backgroundColor: colors.primary, shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 },
  tabInactive: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.neutral200 },
  tabText: { fontSize: 13, fontWeight: '500', whiteSpace: 'nowrap' } as any,
  tabTextQuick: { color: '#92400e', fontWeight: '700' },
  tabTextActive: { color: colors.white },
  tabTextInactive: { color: colors.neutral600 },

  cardScrollArea: { flex: 1 },
  cardScrollContent: { flex: 1 },

  cardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginVertical: 8,
    minHeight: 400,
  },

  loadingState: { alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: colors.neutral500, marginTop: 8 },

  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    aspectRatio: 4 / 5,
    backgroundColor: colors.white,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  cardBg1: {
    transform: [{ scale: 0.95 }, { translateY: 16 }],
    zIndex: -1,
    borderColor: colors.neutral200,
    shadowOpacity: 0.05,
  },
  cardBg2: {
    transform: [{ scale: 0.9 }, { translateY: 32 }],
    zIndex: -2,
    borderColor: colors.neutral200,
    shadowOpacity: 0.03,
    opacity: 0.5,
  },

  cardImageContainer: { height: '62%' as any, position: 'relative' },
  cardImage: { width: '100%', height: '100%' } as any,
  cardImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  } as any,
  heartButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImageInfo: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  cardTitle: { fontSize: 22, fontWeight: '700', color: colors.white, marginBottom: 8 },
  cardBadges: { flexDirection: 'row', gap: 8 },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: { color: colors.white, fontSize: 12 },

  cardBody: { flex: 1, padding: 20, justifyContent: 'space-between' },
  tagRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  tagOrange: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.orange50,
    borderRadius: 8,
  },
  tagOrangeText: { fontSize: 11, fontWeight: '700', color: colors.orange700, textTransform: 'uppercase', letterSpacing: 0.5 },
  tagGreen: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.green50,
    borderRadius: 8,
  },
  tagGreenText: { fontSize: 11, fontWeight: '700', color: colors.green700, textTransform: 'uppercase', letterSpacing: 0.5 },
  reasonBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.blue50,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  reasonEmoji: { fontSize: 18 },
  reasonText: { flex: 1, fontSize: 13, color: colors.blue900, fontStyle: 'italic', lineHeight: 20 },

  emptyState: { alignItems: 'center', justifyContent: 'center' },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 16, color: colors.neutral500, marginBottom: 16 },
  resetButton: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: colors.orange50, borderRadius: 20 },
  resetButtonText: { color: colors.primary, fontWeight: '500' },

  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
    gap: 12,
    backgroundColor: colors.neutral50,
  },
  actionButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral200,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: colors.orange50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.orange200,
  },
  actionEmoji: { fontSize: 20 },
  actionTextSecondary: { fontSize: 15, fontWeight: '500', color: colors.neutral700 },
  actionTextPrimary: { fontSize: 15, fontWeight: '500', color: colors.orange700 },
});

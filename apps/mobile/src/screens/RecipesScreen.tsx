import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RecipesStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { recipesApi } from '../lib/api/recipes';
import { ApiError } from '../lib/api/client';
import type { RecipeSummary } from '../lib/api/suggestions';

type RecipesNavProp = NativeStackNavigationProp<RecipesStackParamList, 'Recipes'>;

const SCREEN_WIDTH = Dimensions.get('window').width;

const DIFFICULTY_MAP: Record<string, string> = {
  easy: 'Dễ',
  medium: 'Trung bình',
  hard: 'Khó',
};

interface RecipeCardProps {
  recipe: RecipeSummary;
  isBookmarked: boolean;
  onPress: () => void;
  onBookmarkToggle: () => void;
}

function RecipeCard({ recipe, isBookmarked, onPress, onBookmarkToggle }: RecipeCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.recipeCard}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: recipe.imageUrl }}
          style={styles.recipeImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.heartButton}
          onPress={onBookmarkToggle}
          activeOpacity={0.8}
        >
          <Feather
            name={isBookmarked ? 'heart' : 'heart'}
            size={14}
            color={isBookmarked ? colors.primary : colors.neutral600}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.recipeTitle} numberOfLines={2}>
        {recipe.name}
      </Text>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Feather name="clock" size={12} color={colors.neutral500} />
          <Text style={styles.metaText}> {recipe.cookTime}p</Text>
        </View>
        <View style={styles.metaItem}>
          <Feather name="zap" size={12} color={colors.neutral500} />
          <Text style={styles.metaText}> {recipe.calories}kcal</Text>
        </View>
      </View>

      <View style={styles.tagRow}>
        <View style={styles.regionTag}>
          <Text style={styles.regionTagText}>{recipe.cuisine}</Text>
        </View>
        {recipe.difficulty && (
          <View style={styles.regionTag}>
            <Text style={styles.regionTagText}>{DIFFICULTY_MAP[recipe.difficulty] ?? recipe.difficulty}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export function RecipesScreen() {
  const navigation = useNavigation<RecipesNavProp>();
  const [searchText, setSearchText] = useState('');
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [cuisine, setCuisine] = useState<string | undefined>(undefined);
  const [mealType, setMealType] = useState<string | undefined>(undefined);
  const [difficulty, setDifficulty] = useState<string | undefined>(undefined);

  const PAGE_SIZE = 20;

  const fetchRecipes = useCallback(async (
    pageNum: number,
    append: boolean,
    filters?: { cuisine?: string; mealType?: string; difficulty?: string },
  ) => {
    try {
      if (pageNum === 1 && !append) setLoading(true);
      else if (append) setLoadingMore(true);

      const res = await recipesApi.list({
        page: pageNum,
        pageSize: PAGE_SIZE,
        cuisine: filters?.cuisine ?? cuisine,
        mealType: filters?.mealType ?? mealType,
        difficulty: filters?.difficulty ?? difficulty,
      });

      const items = res.data;
      const meta = res.meta;

      setTotal(meta.total);
      setHasMore(pageNum * PAGE_SIZE < meta.total);

      if (append) {
        setRecipes((prev) => [...prev, ...items]);
      } else {
        setRecipes(items);
      }
      setPage(pageNum);
    } catch (err) {
      if (err instanceof ApiError) {
        Alert.alert('Lỗi', err.message);
      } else {
        Alert.alert('Lỗi', 'Không thể kết nối máy chủ. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [cuisine, mealType, difficulty]);

  useEffect(() => {
    fetchRecipes(1, false);
  }, [cuisine, mealType, difficulty]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRecipes(1, false);
  }, [fetchRecipes]);

  const handleEndReached = useCallback(() => {
    if (loadingMore || !hasMore) return;
    fetchRecipes(page + 1, true);
  }, [loadingMore, hasMore, page, fetchRecipes]);

  const handleBookmarkToggle = useCallback(async (id: string) => {
    const wasBookmarked = bookmarkedIds.has(id);
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (wasBookmarked) next.delete(id);
      else next.add(id);
      return next;
    });
    try {
      if (wasBookmarked) {
        await recipesApi.unbookmark(id);
      } else {
        await recipesApi.bookmark(id);
      }
    } catch (err) {
      // Revert optimistic update
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (wasBookmarked) next.add(id);
        else next.delete(id);
        return next;
      });
      if (err instanceof ApiError) {
        Alert.alert('Lỗi', err.message);
      } else {
        Alert.alert('Lỗi', 'Không thể kết nối máy chủ. Vui lòng thử lại.');
      }
    }
  }, [bookmarkedIds]);

  const renderItem = ({ item, index }: { item: RecipeSummary; index: number }) => {
    const isLeft = index % 2 === 0;
    return (
      <View style={[styles.gridItem, isLeft ? styles.gridItemLeft : styles.gridItemRight]}>
        <RecipeCard
          recipe={item}
          isBookmarked={bookmarkedIds.has(item.id)}
          onPress={() => navigation.navigate('RecipeDetail', { id: item.id })}
          onBookmarkToggle={() => handleBookmarkToggle(item.id)}
        />
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color={colors.neutral400} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm món ăn..."
            placeholderTextColor={colors.neutral400}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterScrollContent}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.filterChip, cuisine ? styles.filterChipActive : null]}
            onPress={() => setCuisine(cuisine ? undefined : 'Việt Nam')}
          >
            <Text style={[styles.filterChipText, cuisine ? styles.filterChipTextActive : null]}>
              Vùng miền{cuisine ? `: ${cuisine}` : ' '}
            </Text>
            <Text style={styles.filterChipArrow}>▼</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.filterChip, mealType ? styles.filterChipActive : null]}
            onPress={() => setMealType(mealType ? undefined : 'lunch')}
          >
            <Text style={[styles.filterChipText, mealType ? styles.filterChipTextActive : null]}>
              Bữa ăn{mealType ? `: ${mealType}` : ' '}
            </Text>
            <Text style={styles.filterChipArrow}>▼</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.filterChip, difficulty ? styles.filterChipActive : null]}
            onPress={() => setDifficulty(difficulty ? undefined : 'easy')}
          >
            <Text style={[styles.filterChipText, difficulty ? styles.filterChipTextActive : null]}>
              Độ khó{difficulty ? `: ${DIFFICULTY_MAP[difficulty]}` : ' '}
            </Text>
            <Text style={styles.filterChipArrow}>▼</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Body */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={styles.countText}>{total} món ăn</Text>
              <TouchableOpacity activeOpacity={0.8} style={styles.sortButton}>
                <Text style={styles.sortButtonText}>Sắp xếp </Text>
                <Feather name="sliders" size={14} color={colors.neutral700} />
              </TouchableOpacity>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Không có món ăn nào.</Text>
            </View>
          }
        />
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 0,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral100,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.neutral900,
  },
  filterScroll: {
    marginBottom: 8,
  },
  filterScrollContent: {
    gap: 8,
    paddingBottom: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 999,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral700,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  filterChipArrow: {
    fontSize: 10,
    color: colors.neutral400,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  countText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral500,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral700,
  },
  gridItem: {
    flex: 1,
    marginBottom: 16,
  },
  gridItemLeft: {
    marginRight: 8,
  },
  gridItemRight: {
    marginLeft: 8,
  },
  recipeCard: {
    flex: 1,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.neutral100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral900,
    lineHeight: 20,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: colors.neutral500,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 'auto',
    flexWrap: 'wrap',
  },
  regionTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: colors.neutral100,
    borderRadius: 4,
  },
  regionTagText: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.neutral600,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.neutral500,
  },
});

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { recipesApi } from '../lib/api/recipes';
import { ApiError } from '../lib/api/client';
import type { RecipeSummary } from '../lib/api/suggestions';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const POPULAR_SEARCHES = ['Phở', 'Bún', 'Cơm', 'Lẩu', 'Canh'];

const DIFFICULTY_MAP: Record<string, string> = {
  easy: 'Dễ',
  medium: 'Trung bình',
  hard: 'Khó',
};

export function SearchScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await recipesApi.search(q.trim());
      setResults(res.data);
    } catch (err) {
      if (err instanceof ApiError) {
        Alert.alert('Lỗi', err.message);
      } else {
        Alert.alert('Lỗi', 'Không thể kết nối máy chủ. Vui lòng thử lại.');
      }
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, performSearch]);

  const handleSelectQuery = (q: string) => {
    setQuery(q);
    if (!recentSearches.includes(q)) {
      setRecentSearches((prev) => [q, ...prev].slice(0, 10));
    }
  };

  const handleSubmitSearch = () => {
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches((prev) => [query.trim(), ...prev].slice(0, 10));
    }
  };

  const handleRemoveRecent = (q: string) => {
    setRecentSearches((prev) => prev.filter((r) => r !== q));
  };

  const showEmpty = query.length > 0 && !loading && results.length === 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with Search */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Feather name="arrow-left" size={24} color={colors.neutral700} />
        </TouchableOpacity>

        <View style={styles.searchWrapper}>
          <View style={styles.searchIconWrapper}>
            <Feather name="search" size={18} color={colors.neutral400} />
          </View>
          <TextInput
            style={styles.searchInput}
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="Tìm món, nguyên liệu..."
            placeholderTextColor={colors.neutral400}
            returnKeyType="search"
            onSubmitEditing={handleSubmitSearch}
          />
          {loading && (
            <ActivityIndicator size="small" color={colors.primary} style={styles.searchLoader} />
          )}
          {query.length > 0 && !loading && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setQuery('')}
              style={styles.clearBtn}
            >
              <Feather name="x" size={16} color={colors.neutral400} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
      >
        {query.length === 0 ? (
          <>
            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tìm kiếm gần đây</Text>
                <View style={styles.chipRow}>
                  {recentSearches.map((q) => (
                    <TouchableOpacity
                      key={q}
                      activeOpacity={0.8}
                      onPress={() => handleSelectQuery(q)}
                      style={styles.recentChip}
                    >
                      <Text style={styles.recentChipText}>{q}</Text>
                      <TouchableOpacity
                        onPress={() => handleRemoveRecent(q)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Feather name="x" size={14} color={colors.neutral400} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Popular */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Phổ biến</Text>
              <View style={styles.chipRow}>
                {POPULAR_SEARCHES.map((q) => (
                  <TouchableOpacity
                    key={q}
                    activeOpacity={0.8}
                    onPress={() => handleSelectQuery(q)}
                    style={styles.popularChip}
                  >
                    <Text style={styles.popularChipText}>{q}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : (
          <View>
            {/* Empty state */}
            {showEmpty && (
              <View style={styles.emptyContainer}>
                <Feather name="search" size={40} color={colors.neutral300} />
                <Text style={styles.emptyTitle}>Không tìm thấy kết quả</Text>
                <Text style={styles.emptySubtitle}>
                  Không có món ăn nào cho "{query}"
                </Text>
              </View>
            )}

            {/* Results */}
            {results.length > 0 && (
              <>
                <View style={styles.resultsHeader}>
                  <Text style={styles.resultsCount}>
                    {results.length} kết quả cho "{query}"
                  </Text>
                  <TouchableOpacity activeOpacity={0.8}>
                    <Text style={styles.filterBtn}>Filter</Text>
                  </TouchableOpacity>
                </View>

                {results.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.8}
                    style={styles.resultCard}
                    onPress={() =>
                      navigation.navigate('RecipeDetail' as never, { id: item.id } as never)
                    }
                  >
                    <Image source={{ uri: item.imageUrl }} style={styles.resultImg} />
                    <View style={styles.resultInfo}>
                      <Text style={styles.resultTitle}>{item.name}</Text>
                      <Text style={styles.resultMeta}>
                        ⏱ {item.cookTime}p · 🔥 {item.calories}kcal
                      </Text>
                      <View style={styles.badgeRow}>
                        <View style={styles.regionBadge}>
                          <Text style={styles.regionBadgeText}>{item.cuisine}</Text>
                        </View>
                        {item.difficulty && (
                          <View style={styles.difficultyBadge}>
                            <Text style={styles.difficultyBadgeText}>
                              {DIFFICULTY_MAP[item.difficulty] ?? item.difficulty}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
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
  backBtn: {
    padding: 4,
    borderRadius: 20,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral100,
    borderRadius: 12,
    paddingLeft: 12,
    paddingRight: 8,
  },
  searchIconWrapper: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.neutral900,
  },
  searchLoader: {
    marginRight: 4,
  },
  clearBtn: {
    padding: 4,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral900,
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.neutral100,
    borderRadius: 20,
  },
  recentChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.neutral700,
  },
  popularChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 20,
  },
  popularChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.neutral600,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.neutral700,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.neutral500,
    textAlign: 'center',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.neutral500,
  },
  filterBtn: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  resultCard: {
    flexDirection: 'row',
    gap: 16,
    padding: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral100,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  resultImg: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  resultInfo: {
    flex: 1,
    paddingVertical: 4,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.neutral900,
    lineHeight: 20,
    marginBottom: 4,
  },
  resultMeta: {
    fontSize: 12,
    color: colors.neutral500,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  regionBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: colors.neutral100,
    borderRadius: 4,
  },
  regionBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.neutral600,
    textTransform: 'uppercase',
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: colors.orange50,
    borderRadius: 4,
  },
  difficultyBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.orange700,
    textTransform: 'uppercase',
  },
});

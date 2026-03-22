import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { suggestionsApi, ComboSuggestion, ComboItem } from '../lib/api/suggestions';
import { ApiError } from '../lib/api/client';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type MealTypeOption = 'breakfast' | 'lunch' | 'dinner';
const MEAL_TYPE_LABELS: Record<MealTypeOption, string> = {
  breakfast: 'Sáng',
  lunch: 'Trưa',
  dinner: 'Tối',
};

const ROLE_LABELS: Record<string, string> = {
  main: 'Món chính',
  soup: 'Canh',
  vegetable: 'Rau',
  dessert: 'Tráng miệng',
  side: 'Món phụ',
};

export function ComboScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [combo, setCombo] = useState<ComboSuggestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [swappingRole, setSwappingRole] = useState<string | null>(null);
  const [mealType, setMealType] = useState<MealTypeOption>('lunch');
  const [servings, setServings] = useState(2);

  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapForItem, setSwapForItem] = useState<ComboItem | null>(null);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (showSwapModal) {
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 20,
        stiffness: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [showSwapModal]);

  const fetchCombo = useCallback(async () => {
    setLoading(true);
    try {
      const res = await suggestionsApi.getCombo(mealType, servings);
      setCombo(res.data);
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert('Không thể tải combo', error.message);
      } else {
        Alert.alert('Không thể tải combo', 'Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  }, [mealType, servings]);

  useEffect(() => {
    fetchCombo();
  }, [fetchCombo]);

  const openSwap = (item: ComboItem) => {
    setSwapForItem(item);
    setShowSwapModal(true);
  };

  const handleSwap = useCallback(async () => {
    if (!combo || !swapForItem) return;
    setShowSwapModal(false);
    setSwappingRole(swapForItem.role);
    try {
      const res = await suggestionsApi.swapComboItem(combo.id, swapForItem.role, swapForItem.recipe.id);
      setCombo(res.data);
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert('Không thể đổi món', error.message);
      } else {
        Alert.alert('Không thể đổi món', 'Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } finally {
      setSwappingRole(null);
    }
  }, [combo, swapForItem]);

  const headerTitle = `Combo bữa ${MEAL_TYPE_LABELS[mealType].toLowerCase()}`;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Feather name="arrow-left" size={24} color={colors.neutral700} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
        </View>
      </View>

      {/* Meal type selector */}
      <View style={styles.selectorRow}>
        {(Object.keys(MEAL_TYPE_LABELS) as MealTypeOption[]).map((type) => (
          <TouchableOpacity
            key={type}
            activeOpacity={0.8}
            onPress={() => setMealType(type)}
            style={[styles.selectorTab, mealType === type && styles.selectorTabActive]}
          >
            <Text style={[styles.selectorTabText, mealType === type && styles.selectorTabTextActive]}>
              {MEAL_TYPE_LABELS[type]}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Servings selector */}
        <View style={styles.servingsControl}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setServings((s) => Math.max(1, s - 1))}
            style={styles.servingsBtn}
          >
            <Feather name="minus" size={14} color={colors.neutral600} />
          </TouchableOpacity>
          <Text style={styles.servingsText}>{servings} người</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setServings((s) => Math.min(10, s + 1))}
            style={styles.servingsBtn}
          >
            <Feather name="plus" size={14} color={colors.neutral600} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable body */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Đang tải combo...</Text>
        </View>
      ) : combo ? (
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Nutrition summary */}
          <View style={styles.nutritionCard}>
            <View>
              <Text style={styles.nutritionLabel}>Tổng năng lượng</Text>
              <Text style={styles.nutritionValue}>🔥 {combo.totalCalories.toLocaleString()} kcal</Text>
            </View>
            <View style={styles.macroGroup}>
              <Text style={styles.macroText}>P: {combo.totalProtein}g</Text>
              <Text style={styles.macroText}>C: {combo.totalCarbs}g</Text>
              <Text style={styles.macroText}>F: {combo.totalFat}g</Text>
            </View>
          </View>

          {/* Combo items */}
          <View style={styles.comboList}>
            {combo.items.map((item, index) => {
              const isSwapping = swappingRole === item.role;
              return (
                <View key={`${item.role}-${index}`}>
                  {/* Divider with label */}
                  <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerLabel}>
                      {ROLE_LABELS[item.role] ?? item.role}
                    </Text>
                    <View style={styles.dividerLine} />
                  </View>

                  {/* Combo card */}
                  <View style={styles.comboCard}>
                    <Image source={{ uri: item.recipe.imageUrl }} style={styles.comboImg} />
                    <View style={styles.comboInfo}>
                      <Text style={styles.comboName}>{item.recipe.name}</Text>
                      <Text style={styles.comboMeta}>
                        ⏱ {item.recipe.cookTime}p  ·  🔥 {item.recipe.calories}kcal
                      </Text>
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => openSwap(item)}
                      style={styles.swapBtn}
                      disabled={isSwapping}
                    >
                      {isSwapping ? (
                        <ActivityIndicator size="small" color={colors.neutral500} />
                      ) : (
                        <Feather name="refresh-cw" size={18} color={colors.neutral500} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.bottomPad} />
        </ScrollView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.emptyText}>Không có dữ liệu combo.</Text>
          <TouchableOpacity onPress={fetchCombo} style={styles.retryBtn}>
            <Text style={styles.retryBtnText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Fixed footer */}
      <View style={styles.footer}>
        <TouchableOpacity activeOpacity={0.8} onPress={fetchCombo} style={styles.footerIconBtn}>
          <Feather name="refresh-cw" size={24} color={colors.neutral600} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={styles.footerMainBtn}>
          <Text style={styles.footerMainBtnText}>✓ Chọn combo này</Text>
        </TouchableOpacity>
      </View>

      {/* Swap bottom sheet modal */}
      <Modal
        visible={showSwapModal}
        transparent
        animationType="none"
        onRequestClose={() => setShowSwapModal(false)}
      >
        <View style={styles.modalOverlayWrapper}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowSwapModal(false)} />
          <Animated.View
            style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }] }]}
          >
            {/* Handle */}
            <View style={styles.sheetHandle} />

            {/* Sheet header */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>
                Đổi {swapForItem ? (ROLE_LABELS[swapForItem.role] ?? swapForItem.role) : ''}
              </Text>
              <TouchableOpacity activeOpacity={0.8} onPress={() => setShowSwapModal(false)}>
                <Text style={styles.sheetCloseText}>Đóng</Text>
              </TouchableOpacity>
            </View>

            {/* Confirm swap */}
            <View style={styles.sheetBody}>
              {swapForItem ? (
                <View style={styles.swapConfirmContainer}>
                  <Text style={styles.swapConfirmText}>
                    Đổi "{swapForItem.recipe.name}" bằng món khác?
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.swapConfirmBtn}
                    onPress={handleSwap}
                  >
                    <Text style={styles.swapConfirmBtnText}>Đổi ngay</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </Animated.View>
        </View>
      </Modal>
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
  backBtn: {
    padding: 4,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.neutral900,
  },
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
    gap: 8,
  },
  selectorTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.neutral100,
  },
  selectorTabActive: {
    backgroundColor: colors.primary,
  },
  selectorTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral600,
  },
  selectorTabTextActive: {
    color: colors.white,
  },
  servingsControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 'auto',
  },
  servingsBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  servingsText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral700,
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
  emptyText: {
    fontSize: 15,
    color: colors.neutral500,
  },
  retryBtn: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.orange50,
    borderRadius: 20,
  },
  retryBtnText: {
    color: colors.primary,
    fontWeight: '600',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 16,
  },
  nutritionCard: {
    backgroundColor: colors.orange50,
    borderWidth: 1,
    borderColor: colors.orange100,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  nutritionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9a3412',
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.orange600,
  },
  macroGroup: {
    alignItems: 'flex-end',
    gap: 2,
  },
  macroText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(154,52,18,0.7)',
  },
  comboList: {
    gap: 4,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    marginTop: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.neutral200,
  },
  dividerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.neutral400,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 8,
  },
  comboCard: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
  },
  comboImg: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  comboInfo: {
    flex: 1,
  },
  comboName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.neutral900,
    lineHeight: 20,
    marginBottom: 4,
  },
  comboMeta: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.neutral500,
  },
  swapBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  footerIconBtn: {
    width: 56,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerMainBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  footerMainBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
  },
  bottomPad: {
    height: 24,
  },
  // Modal / bottom sheet
  modalOverlayWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  bottomSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.8,
    paddingBottom: 32,
  },
  sheetHandle: {
    width: 48,
    height: 6,
    backgroundColor: colors.neutral300,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.neutral900,
  },
  sheetCloseText: {
    fontSize: 15,
    color: colors.neutral500,
  },
  sheetBody: {
    padding: 20,
  },
  swapConfirmContainer: {
    alignItems: 'center',
    gap: 16,
  },
  swapConfirmText: {
    fontSize: 15,
    color: colors.neutral700,
    textAlign: 'center',
    lineHeight: 22,
  },
  swapConfirmBtn: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 16,
  },
  swapConfirmBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
});

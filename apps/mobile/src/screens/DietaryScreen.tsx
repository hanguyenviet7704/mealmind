import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
import { dietaryApi } from '../lib/api/dietary';
import { ApiError } from '../lib/api/client';

type NavProp = NativeStackNavigationProp<ProfileStackParamList>;

type DietOption = {
  id: string;
  label: string;
  desc: string;
};

type AllergenOption = {
  id: string;
  icon: string;
  label: string;
};

const DIET_OPTIONS: DietOption[] = [
  { id: 'normal', label: 'Bình thường', desc: 'Không giới hạn' },
  { id: 'vegetarian', label: 'Chay (trứng+sữa)', desc: 'Không thịt cá' },
  { id: 'vegan', label: 'Thuần chay (Vegan)', desc: 'Không sp động vật' },
  { id: 'keto', label: 'Keto', desc: '< 20g carb/ngày' },
];

const ALLERGEN_OPTIONS: AllergenOption[] = [
  { id: 'hs', icon: '🦐', label: 'Hải sản' },
  { id: 'dp', icon: '🥜', label: 'Đậu phộng' },
  { id: 's', icon: '🥛', label: 'Sữa' },
  { id: 'g', icon: '🌾', label: 'Gluten' },
];

export function DietaryScreen() {
  const navigation = useNavigation<NavProp>();
  const store = useAuthStore();
  const userId = store.user?.id ?? '';

  const [selectedDiet, setSelectedDiet] = useState('normal');
  const [allergens, setAllergens] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await dietaryApi.getRestrictions(userId);
        const data = res.data;
        setSelectedDiet(data.dietType ?? 'normal');
        setAllergens(data.allergens ?? []);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Không thể tải dữ liệu. Vui lòng thử lại.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const toggleAllergen = (id: string) => {
    setAllergens((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (saving || !userId) return;
    setSaving(true);
    try {
      await dietaryApi.updateRestrictions(userId, {
        dietType: selectedDiet as 'normal' | 'vegetarian' | 'vegan' | 'keto' | 'lowCarb' | 'halal',
        allergens,
      });
      Alert.alert('Đã lưu', 'Chế độ ăn và dị ứng đã được cập nhật.');
      navigation.goBack();
    } catch (err) {
      if (err instanceof ApiError) {
        Alert.alert('Lỗi', err.message);
      } else {
        Alert.alert('Lỗi', 'Không thể lưu. Vui lòng thử lại.');
      }
    } finally {
      setSaving(false);
    }
  };

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
        <Text style={styles.headerTitle}>Chế độ & Dị ứng</Text>
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
              dietaryApi.getRestrictions(userId)
                .then((res) => {
                  setSelectedDiet(res.data.dietType ?? 'normal');
                  setAllergens(res.data.allergens ?? []);
                })
                .catch(() => setError('Không thể tải dữ liệu. Vui lòng thử lại.'))
                .finally(() => setLoading(false));
            }}
          >
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.flex1}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.flex1}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Diet Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Chế độ ăn đặc biệt</Text>
              <View style={styles.dietList}>
                {DIET_OPTIONS.map((diet) => {
                  const isSelected = selectedDiet === diet.id;
                  return (
                    <TouchableOpacity
                      key={diet.id}
                      activeOpacity={0.8}
                      onPress={() => setSelectedDiet(diet.id)}
                      style={[
                        styles.dietCard,
                        isSelected ? styles.dietCardSelected : styles.dietCardDefault,
                      ]}
                    >
                      {/* Radio button */}
                      <View
                        style={[
                          styles.radioOuter,
                          isSelected ? styles.radioOuterSelected : styles.radioOuterDefault,
                        ]}
                      >
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                      <View style={styles.dietTextGroup}>
                        <Text
                          style={[
                            styles.dietLabel,
                            isSelected ? styles.dietLabelSelected : styles.dietLabelDefault,
                          ]}
                        >
                          {diet.label}
                        </Text>
                        <Text style={styles.dietDesc}>{diet.desc}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Allergens Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dị ứng cần tránh</Text>
              <View style={styles.allergenRow}>
                {ALLERGEN_OPTIONS.map((allergen) => {
                  const isSelected = allergens.includes(allergen.id);
                  return (
                    <TouchableOpacity
                      key={allergen.id}
                      activeOpacity={0.8}
                      onPress={() => toggleAllergen(allergen.id)}
                      style={[
                        styles.allergenChip,
                        isSelected ? styles.allergenChipSelected : styles.allergenChipDefault,
                      ]}
                    >
                      <Text style={styles.allergenIcon}>{allergen.icon}</Text>
                      <Text
                        style={[
                          styles.allergenLabel,
                          isSelected ? styles.allergenLabelSelected : styles.allergenLabelDefault,
                        ]}
                      >
                        {allergen.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Search Input */}
              <View style={styles.searchWrapper}>
                <Feather
                  name="search"
                  size={16}
                  color={colors.neutral400}
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="+ Tìm nguyên liệu cần tránh..."
                  placeholderTextColor={colors.neutral400}
                  value={searchText}
                  onChangeText={setSearchText}
                />
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
                <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
    paddingBottom: 24,
    gap: 32,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.neutral900,
  },
  dietList: {
    gap: 12,
  },
  dietCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  dietCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.orange50,
  },
  dietCardDefault: {
    borderColor: colors.neutral200,
    backgroundColor: colors.white,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 12,
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
  dietTextGroup: {
    flex: 1,
  },
  dietLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  dietLabelSelected: {
    color: colors.orange900,
  },
  dietLabelDefault: {
    color: colors.neutral800,
  },
  dietDesc: {
    fontSize: 12,
    color: colors.neutral500,
    marginTop: 2,
  },
  allergenRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allergenChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    gap: 6,
  },
  allergenChipSelected: {
    borderColor: colors.red500,
    backgroundColor: colors.red50,
  },
  allergenChipDefault: {
    borderColor: colors.neutral200,
    backgroundColor: colors.white,
  },
  allergenIcon: {
    fontSize: 16,
  },
  allergenLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  allergenLabelSelected: {
    color: '#b91c1c',
  },
  allergenLabelDefault: {
    color: colors.neutral600,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  searchIcon: {
    marginRight: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.neutral900,
    padding: 0,
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

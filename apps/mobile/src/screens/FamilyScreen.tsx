import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { onboardingApi, FamilyProfile } from '../lib/api/onboarding';
import { ApiError } from '../lib/api/client';
import { useAuthStore } from '../store/authStore';

type NavProp = NativeStackNavigationProp<ProfileStackParamList>;

const AVATAR_OPTIONS = ['🧑', '👦', '👧', '👶', '👴', '👵'];

const AGE_GROUP_OPTIONS: { label: string; value: FamilyProfile['ageGroup'] }[] = [
  { label: 'Trẻ nhỏ (<12)', value: 'child' },
  { label: 'Teen', value: 'teen' },
  { label: 'Người lớn', value: 'adult' },
  { label: 'Người cao tuổi', value: 'senior' },
];

const AGE_GROUP_LABEL: Record<FamilyProfile['ageGroup'], string> = {
  child: 'Trẻ nhỏ (<12)',
  teen: 'Teen',
  adult: 'Người lớn',
  senior: 'Người cao tuổi',
};

const ALLERGY_OPTIONS = ['Hải sản', 'Đậu phộng', 'Sữa'];

type SheetMode = 'add' | 'edit';

export function FamilyScreen() {
  const navigation = useNavigation<NavProp>();
  const user = useAuthStore((s: ReturnType<typeof useAuthStore.getState>) => s.user);

  const [members, setMembers] = useState<FamilyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<SheetMode>('add');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🧑');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<FamilyProfile['ageGroup']>('adult');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [sheetSaving, setSheetSaving] = useState(false);

  const fetchMembers = useCallback(async () => {
    setError(null);
    try {
      const res = await onboardingApi.getFamilyProfiles();
      setMembers(res.data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Không thể tải danh sách thành viên.');
      }
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchMembers().finally(() => setLoading(false));
  }, [fetchMembers]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMembers();
    setRefreshing(false);
  }, [fetchMembers]);

  const openAddSheet = () => {
    setSheetMode('add');
    setEditingId(null);
    setEditName('');
    setSelectedAvatar('🧑');
    setSelectedAgeGroup('adult');
    setSelectedAllergies([]);
    setSheetOpen(true);
  };

  const openEditSheet = (member: FamilyProfile) => {
    setSheetMode('edit');
    setEditingId(member.id);
    setEditName(member.name);
    setSelectedAvatar(member.emoji);
    setSelectedAgeGroup(member.ageGroup);
    setSelectedAllergies(member.allergens ?? []);
    setSheetOpen(true);
  };

  const toggleAllergy = (a: string) => {
    setSelectedAllergies((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  const handleSave = async () => {
    if (sheetSaving) return;
    if (!editName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên thành viên.');
      return;
    }
    setSheetSaving(true);
    try {
      if (sheetMode === 'add') {
        const res = await onboardingApi.createFamilyProfile({
          name: editName.trim(),
          emoji: selectedAvatar,
          ageGroup: selectedAgeGroup,
          allergens: selectedAllergies,
          isActive: true,
        });
        setMembers((prev) => [...prev, res.data]);
      } else if (editingId) {
        const res = await onboardingApi.updateFamilyProfile(editingId, {
          name: editName.trim(),
          emoji: selectedAvatar,
          ageGroup: selectedAgeGroup,
          allergens: selectedAllergies,
        });
        setMembers((prev) => prev.map((m) => (m.id === editingId ? res.data : m)));
      }
      setSheetOpen(false);
    } catch (err) {
      if (err instanceof ApiError) {
        Alert.alert('Lỗi', err.message);
      } else {
        Alert.alert('Lỗi', 'Không thể lưu thành viên. Vui lòng thử lại.');
      }
    } finally {
      setSheetSaving(false);
    }
  };

  const handleDelete = () => {
    if (!editingId) return;
    Alert.alert('Xóa thành viên?', 'Bạn có chắc muốn xóa thành viên này không?', [
      { text: 'Hủy' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await onboardingApi.deleteFamilyProfile(editingId);
            setMembers((prev) => prev.filter((m) => m.id !== editingId));
            setSheetOpen(false);
          } catch (err) {
            if (err instanceof ApiError) {
              Alert.alert('Lỗi', err.message);
            } else {
              Alert.alert('Lỗi', 'Không thể xóa thành viên. Vui lòng thử lại.');
            }
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={24} color={colors.neutral700} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gia đình</Text>
        </View>
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
              setLoading(true);
              fetchMembers().finally(() => setLoading(false));
            }}
          >
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.flex1}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <Text style={styles.infoText}>
              MealMind sẽ tính toán gợi ý khẩu phần và tránh món ăn có dị ứng dựa trên tất cả thành viên khi bạn chọn nấu ăn chung.
            </Text>
          </View>

          {/* Main Account User Card */}
          {user && (
            <View style={[styles.memberCard, styles.mainMemberCard]}>
              <View style={[styles.memberAvatarWrapper, styles.mainAvatarWrapper]}>
                <Text style={styles.memberAvatarText}>🧑</Text>
              </View>
              <View style={styles.memberInfo}>
                <View style={styles.memberNameRow}>
                  <Text style={styles.memberName}>{user.name}</Text>
                  <View style={styles.mainBadge}>
                    <Text style={styles.mainBadgeText}>CHÍNH</Text>
                  </View>
                </View>
                <Text style={styles.memberMeta}>{user.email}</Text>
              </View>
            </View>
          )}

          {/* Family Member Cards */}
          {members.map((member) => (
            <TouchableOpacity
              key={member.id}
              activeOpacity={0.8}
              onPress={() => openEditSheet(member)}
              style={styles.memberCard}
            >
              <View style={styles.memberAvatarWrapper}>
                <Text style={styles.memberAvatarText}>{member.emoji}</Text>
              </View>
              <View style={styles.memberInfo}>
                <View style={styles.memberNameRow}>
                  <Text style={styles.memberName}>{member.name}</Text>
                </View>
                <Text style={styles.memberMeta}>
                  {AGE_GROUP_LABEL[member.ageGroup]}
                  {member.allergens && member.allergens.length > 0
                    ? ` · Dị ứng: ${member.allergens.join(', ')}`
                    : ' · Không dị ứng'}
                </Text>
              </View>
              <Feather name="settings" size={20} color={colors.neutral300} />
            </TouchableOpacity>
          ))}

          {/* Add Member Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={openAddSheet}
            style={styles.addMemberButton}
          >
            <Feather name="user-plus" size={24} color={colors.primary} />
            <Text style={styles.addMemberText}>Thêm thành viên</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Edit/Add Member Bottom Sheet (Modal) */}
      <Modal
        visible={sheetOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setSheetOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSheetOpen(false)} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.sheetContainer}
        >
          <View style={styles.sheet}>
            {/* Drag Handle */}
            <View style={styles.sheetHandle} />

            {/* Sheet Header */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>
                {sheetMode === 'add' ? 'Thêm thành viên' : 'Sửa thành viên'}
              </Text>
              <TouchableOpacity activeOpacity={0.8} onPress={() => setSheetOpen(false)}>
                <Text style={styles.sheetCloseText}>Đóng</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.sheetScroll}
              contentContainerStyle={styles.sheetScrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {/* Name */}
              <View style={styles.sheetField}>
                <Text style={styles.sheetFieldLabel}>Tên / Biệt danh</Text>
                <TextInput
                  style={styles.sheetTextInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholderTextColor={colors.neutral400}
                  placeholder="Nhập tên..."
                />
              </View>

              {/* Avatar */}
              <View style={styles.sheetField}>
                <Text style={styles.sheetFieldLabel}>Avatar</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.avatarRow}
                >
                  {AVATAR_OPTIONS.map((em) => {
                    const isSelected = em === selectedAvatar;
                    return (
                      <TouchableOpacity
                        key={em}
                        activeOpacity={0.8}
                        onPress={() => setSelectedAvatar(em)}
                        style={[
                          styles.avatarOption,
                          isSelected ? styles.avatarOptionSelected : styles.avatarOptionDefault,
                        ]}
                      >
                        <Text style={styles.avatarEmoji}>{em}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Age Group */}
              <View style={styles.sheetField}>
                <Text style={styles.sheetFieldLabel}>Nhóm tuổi</Text>
                <View style={styles.chipWrap}>
                  {AGE_GROUP_OPTIONS.map((opt) => {
                    const isSelected = opt.value === selectedAgeGroup;
                    return (
                      <TouchableOpacity
                        key={opt.label}
                        activeOpacity={0.8}
                        onPress={() => setSelectedAgeGroup(opt.value)}
                        style={[
                          styles.ageChip,
                          isSelected ? styles.ageChipSelected : styles.ageChipDefault,
                        ]}
                      >
                        <Text
                          style={[
                            styles.ageChipText,
                            isSelected ? styles.ageChipTextSelected : styles.ageChipTextDefault,
                          ]}
                        >
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Allergies */}
              <View style={styles.sheetField}>
                <Text style={styles.sheetFieldLabel}>Dị ứng</Text>
                <View style={styles.chipWrap}>
                  {ALLERGY_OPTIONS.map((a) => {
                    const isSelected = selectedAllergies.includes(a);
                    return (
                      <TouchableOpacity
                        key={a}
                        activeOpacity={0.8}
                        onPress={() => toggleAllergy(a)}
                        style={[
                          styles.allergyChip,
                          isSelected ? styles.allergyChipSelected : styles.allergyChipDefault,
                        ]}
                      >
                        {isSelected && (
                          <Feather name="check" size={14} color="#b91c1c" />
                        )}
                        <Text
                          style={[
                            styles.allergyChipText,
                            isSelected ? styles.allergyChipTextSelected : styles.allergyChipTextDefault,
                          ]}
                        >
                          {a}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  <TouchableOpacity activeOpacity={0.8} style={styles.allergyAddChip}>
                    <Text style={styles.allergyAddChipText}>+ Thêm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            {/* Sheet Actions */}
            <View style={styles.sheetActions}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.sheetSaveButton, sheetSaving && styles.sheetSaveButtonDisabled]}
                onPress={handleSave}
                disabled={sheetSaving}
              >
                {sheetSaving ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.sheetSaveButtonText}>Lưu thông tin</Text>
                )}
              </TouchableOpacity>
              {sheetMode === 'edit' && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.sheetDeleteButton}
                  onPress={handleDelete}
                >
                  <Text style={styles.sheetDeleteButtonText}>Xóa thành viên này</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  infoBanner: {
    backgroundColor: colors.orange50,
    borderWidth: 1,
    borderColor: colors.orange100,
    borderRadius: 12,
    padding: 16,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.orange900,
    lineHeight: 20,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral200,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    gap: 16,
  },
  mainMemberCard: {
    borderColor: colors.orange200,
    backgroundColor: colors.orange50,
  },
  memberAvatarWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.neutral100,
    borderWidth: 1,
    borderColor: colors.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainAvatarWrapper: {
    backgroundColor: colors.orange100,
    borderColor: colors.orange200,
  },
  memberAvatarText: {
    fontSize: 28,
  },
  memberInfo: {
    flex: 1,
    gap: 4,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  memberName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.neutral900,
  },
  mainBadge: {
    backgroundColor: colors.orange500,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  mainBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
  },
  memberMeta: {
    fontSize: 12,
    color: colors.neutral500,
  },
  addMemberButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.orange200,
    borderRadius: 16,
    backgroundColor: colors.orange50,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  addMemberText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },

  // Modal / Bottom Sheet
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheetContainer: {
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.neutral900,
  },
  sheetCloseText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.neutral500,
  },
  sheetScroll: {
    flexGrow: 0,
  },
  sheetScrollContent: {
    padding: 20,
    gap: 24,
  },
  sheetField: {
    gap: 8,
  },
  sheetFieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral700,
  },
  sheetTextInput: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: colors.neutral50,
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 12,
    fontSize: 15,
    color: colors.neutral900,
  },
  avatarRow: {
    gap: 8,
    paddingVertical: 4,
  },
  avatarOption: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.orange50,
  },
  avatarOptionDefault: {
    borderColor: colors.neutral200,
    backgroundColor: colors.white,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ageChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  ageChipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.orange50,
  },
  ageChipDefault: {
    borderColor: colors.neutral200,
    backgroundColor: colors.white,
  },
  ageChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  ageChipTextSelected: {
    color: colors.orange700,
  },
  ageChipTextDefault: {
    color: colors.neutral700,
  },
  allergyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  allergyChipSelected: {
    borderColor: colors.red500,
    backgroundColor: colors.red50,
  },
  allergyChipDefault: {
    borderColor: colors.neutral200,
    backgroundColor: colors.white,
  },
  allergyChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  allergyChipTextSelected: {
    color: '#b91c1c',
  },
  allergyChipTextDefault: {
    color: colors.neutral700,
  },
  allergyAddChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.neutral300,
    backgroundColor: colors.white,
  },
  allergyAddChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.neutral500,
  },
  sheetActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.neutral100,
    backgroundColor: colors.white,
    gap: 4,
  },
  sheetSaveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  sheetSaveButtonDisabled: {
    opacity: 0.6,
  },
  sheetSaveButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  sheetDeleteButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  sheetDeleteButtonText: {
    color: colors.red500,
    fontWeight: '700',
    fontSize: 15,
  },
});

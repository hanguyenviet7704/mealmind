import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
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
import { api, ApiError } from '../lib/api/client';
import { UserSummary } from '../lib/api/auth';

type NavProp = NativeStackNavigationProp<ProfileStackParamList>;

type Gender = 'Nu' | 'Nam' | 'Khac';

export function EditProfileScreen() {
  const navigation = useNavigation<NavProp>();
  const store = useAuthStore();
  const user = store.user;

  const [name, setName] = useState(user?.name ?? '');
  const [height, setHeight] = useState('160');
  const [weight, setWeight] = useState('55');
  const [gender, setGender] = useState<Gender>('Nu');
  const [saving, setSaving] = useState(false);

  const genderOptions: { id: Gender; label: string }[] = [
    { id: 'Nu', label: 'Nữ' },
    { id: 'Nam', label: 'Nam' },
    { id: 'Khac', label: 'Khác' },
  ];

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await api.patch<{ data: UserSummary }>('/users/me', {
        name: name.trim(),
        avatarUrl: user?.avatarUrl ?? null,
      });
      store.updateUser(res.data);
      Alert.alert('Đã lưu', 'Thông tin cá nhân đã được cập nhật.');
      navigation.goBack();
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert('Lỗi', error.message);
      } else {
        Alert.alert('Lỗi', 'Không thể lưu thông tin. Vui lòng thử lại.');
      }
    } finally {
      setSaving(false);
    }
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
          <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
        </View>
        <TouchableOpacity activeOpacity={0.8} onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={styles.saveButtonText}>Lưu</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.flex1}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              <Image
                source={
                  user?.avatarUrl
                    ? { uri: user.avatarUrl }
                    : { uri: 'https://images.unsplash.com/photo-1643816831186-b2427a8f9f2d?w=200&h=200&fit=crop' }
                }
                style={styles.avatar}
              />
              <TouchableOpacity activeOpacity={0.8} style={styles.editAvatarButton}>
                <Feather name="edit-2" size={14} color={colors.neutral600} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Họ và tên</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholderTextColor={colors.neutral400}
            />
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput
              style={[styles.textInput, styles.textInputDisabled]}
              value={user?.email ?? ''}
              editable={false}
              placeholderTextColor={colors.neutral400}
            />
            <Text style={styles.fieldHint}>Email dùng để đăng nhập, không thể thay đổi.</Text>
          </View>

          {/* Gender */}
          <View style={[styles.fieldGroup, styles.fieldGroupTopSpacing]}>
            <Text style={styles.fieldLabel}>Giới tính</Text>
            <View style={styles.genderRow}>
              {genderOptions.map((option) => {
                const isSelected = gender === option.id;
                return (
                  <TouchableOpacity
                    key={option.id}
                    activeOpacity={0.8}
                    onPress={() => setGender(option.id)}
                    style={[
                      styles.genderButton,
                      isSelected ? styles.genderButtonSelected : styles.genderButtonDefault,
                    ]}
                  >
                    <Text
                      style={[
                        styles.genderButtonText,
                        isSelected ? styles.genderButtonTextSelected : styles.genderButtonTextDefault,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Height */}
          <View style={[styles.fieldGroup, styles.fieldGroupTopSpacing]}>
            <Text style={styles.fieldLabel}>Chiều cao (cm)</Text>
            <TextInput
              style={styles.textInput}
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
              placeholderTextColor={colors.neutral400}
            />
          </View>

          {/* Weight */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Cân nặng (kg)</Text>
            <TextInput
              style={styles.textInput}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              placeholderTextColor={colors.neutral400}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex1: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
    backgroundColor: colors.white,
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
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
    gap: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.neutral100,
    position: 'relative',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldGroupTopSpacing: {
    marginTop: 4,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral700,
  },
  textInput: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: colors.neutral50,
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 12,
    fontSize: 15,
    color: colors.neutral900,
  },
  textInputDisabled: {
    backgroundColor: colors.neutral100,
    color: colors.neutral500,
  },
  fieldHint: {
    fontSize: 11,
    color: colors.neutral400,
    marginTop: 2,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  genderButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.orange50,
  },
  genderButtonDefault: {
    borderColor: colors.neutral200,
    backgroundColor: colors.white,
  },
  genderButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  genderButtonTextSelected: {
    color: colors.orange700,
  },
  genderButtonTextDefault: {
    color: colors.neutral600,
  },
});

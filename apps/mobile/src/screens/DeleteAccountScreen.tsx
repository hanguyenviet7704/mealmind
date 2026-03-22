import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { authApi } from '../lib/api/auth';
import { useAuthStore } from '../store/authStore';
import { ApiError } from '../lib/api/client';

type DeleteAccountNavProp = NativeStackNavigationProp<ProfileStackParamList, 'DeleteAccount'>;

export function DeleteAccountScreen() {
  const navigation = useNavigation<DeleteAccountNavProp>();
  const store = useAuthStore();
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isMatched = confirmText === 'XÓA TÀI KHOẢN';

  const doDelete = async () => {
    setIsLoading(true);
    try {
      await authApi.deleteAccount();
      await store.logout();
      navigation.reset({ index: 0, routes: [{ name: 'Login' as never }] });
    } catch (error) {
      if (error instanceof ApiError) {
        Alert.alert('Lỗi', error.message);
      } else {
        Alert.alert('Lỗi', 'Không thể kết nối. Kiểm tra internet.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (!isMatched) return;
    Alert.alert(
      'Xác nhận xóa tài khoản',
      'Toàn bộ dữ liệu sẽ bị xóa vĩnh viễn. Không thể khôi phục.',
      [
        { text: 'Hủy' },
        { text: 'Xóa vĩnh viễn', style: 'destructive', onPress: doDelete },
      ],
    );
  };

  return (
    <View style={styles.container}>
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
          <Text style={styles.headerTitle}>Xóa tài khoản</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Warning icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Feather name="alert-triangle" size={36} color={colors.red500} />
          </View>
        </View>

        <Text style={styles.warningTitle}>Cảnh báo nghiêm trọng</Text>

        {/* Warning box */}
        <View style={styles.warningBox}>
          <Text style={styles.warningIntro}>
            Việc xóa tài khoản sẽ có những tác động sau:
          </Text>
          <View style={styles.warningList}>
            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Xóa toàn bộ dữ liệu cá nhân vĩnh viễn.</Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Xóa các hồ sơ gia đình, mục tiêu dinh dưỡng.</Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>Xóa lịch sử thực đơn và món ăn yêu thích.</Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={[styles.bulletText, styles.bulletBold]}>
                Hành động này KHÔNG THỂ hoàn tác.
              </Text>
            </View>
          </View>
        </View>

        {/* Confirm input */}
        <View style={styles.confirmSection}>
          <Text style={styles.confirmLabel}>
            Nhập{' '}
            <Text style={styles.confirmKeyword}>XÓA TÀI KHOẢN</Text>
            {' '}để xác nhận:
          </Text>
          <TextInput
            style={styles.input}
            placeholder="XÓA TÀI KHOẢN"
            placeholderTextColor={colors.neutral400}
            value={confirmText}
            onChangeText={setConfirmText}
            autoCapitalize="characters"
            editable={!isLoading}
          />
        </View>

        {/* Delete button */}
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={!isMatched || isLoading}
          style={[
            styles.deleteButton,
            (!isMatched || isLoading) && styles.deleteButtonDisabled,
          ]}
          onPress={handleDelete}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={[styles.deleteButtonText, !isMatched && styles.deleteButtonTextDisabled]}>
              Xóa vĩnh viễn tài khoản
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
    marginLeft: -4,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.neutral900,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.red50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.neutral900,
    textAlign: 'center',
    marginBottom: 24,
  },
  warningBox: {
    backgroundColor: colors.red50,
    borderWidth: 1,
    borderColor: '#fee2e2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  warningIntro: {
    fontSize: 14,
    color: '#991b1b',
    lineHeight: 20,
    marginBottom: 8,
  },
  warningList: {
    gap: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 6,
  },
  bullet: {
    fontSize: 14,
    color: '#b91c1c',
    lineHeight: 20,
  },
  bulletText: {
    fontSize: 14,
    color: '#b91c1c',
    lineHeight: 20,
    flex: 1,
  },
  bulletBold: {
    fontWeight: '700',
  },
  confirmSection: {
    gap: 12,
    marginBottom: 32,
  },
  confirmLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral700,
  },
  confirmKeyword: {
    color: colors.red500,
    backgroundColor: colors.red50,
    fontFamily: 'monospace',
  },
  input: {
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: colors.neutral50,
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 12,
    fontSize: 15,
    color: colors.neutral900,
    textTransform: 'uppercase',
    fontFamily: 'monospace',
  },
  deleteButton: {
    backgroundColor: colors.red500,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  deleteButtonDisabled: {
    backgroundColor: colors.neutral200,
  },
  deleteButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  deleteButtonTextDisabled: {
    color: colors.neutral400,
  },
});

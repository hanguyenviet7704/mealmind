import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { authApi } from '../lib/api/auth';
import { ApiError } from '../lib/api/client';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ResetPasswordRouteProp = RouteProp<RootStackParamList, 'ResetPassword'>;

export function ResetPasswordScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ResetPasswordRouteProp>();
  const token = route.params?.token;

  const [showPwd, setShowPwd] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [done, setDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    if (!token) {
      Alert.alert('Lỗi', 'Liên kết đặt lại mật khẩu không hợp lệ. Vui lòng sử dụng liên kết từ email.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp.');
      return;
    }
    setIsLoading(true);
    try {
      await authApi.resetPassword(token, newPassword);
      setDone(true);
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Login')}
            style={styles.backBtn}
          >
            <Feather name="arrow-left" size={24} color={colors.neutral700} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đặt lại mật khẩu</Text>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {!token ? (
            /* No token state */
            <View style={styles.successContainer}>
              <View style={[styles.successIconCircle, { backgroundColor: colors.orange50 }]}>
                <Feather name="link" size={48} color={colors.orange500} />
              </View>
              <Text style={styles.successTitle}>Liên kết không hợp lệ</Text>
              <Text style={styles.successSubtitle}>
                Vui lòng sử dụng liên kết đặt lại mật khẩu từ email của bạn.
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.primaryBtn}
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.primaryBtnText}>Gửi lại email</Text>
              </TouchableOpacity>
            </View>
          ) : !done ? (
            /* Form state */
            <>
              <View style={styles.iconCircle}>
                <Feather name="lock" size={32} color={colors.blue500} />
              </View>

              {/* New Password */}
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, styles.inputWithRightIcon]}
                  placeholder="Mật khẩu mới"
                  placeholderTextColor={colors.neutral400}
                  secureTextEntry={!showPwd}
                  autoCapitalize="none"
                  returnKeyType="next"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowPwd(!showPwd)}
                  style={styles.eyeBtn}
                >
                  <Feather
                    name={showPwd ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.neutral400}
                  />
                </TouchableOpacity>
              </View>

              {/* Strength bar */}
              <View style={styles.strengthBars}>
                <View style={[styles.strengthSegment, { backgroundColor: colors.orange500 }]} />
                <View style={[styles.strengthSegment, { backgroundColor: colors.orange500 }]} />
                <View style={[styles.strengthSegment, { backgroundColor: colors.orange500 }]} />
              </View>
              <Text style={styles.strengthLabel}>Mạnh</Text>

              {/* Confirm Password */}
              <View style={[styles.inputWrapper, styles.inputWrapperTop]}>
                <TextInput
                  style={styles.input}
                  placeholder="Xác nhận mật khẩu"
                  placeholderTextColor={colors.neutral400}
                  secureTextEntry={!showPwd}
                  autoCapitalize="none"
                  returnKeyType="done"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  editable={!isLoading}
                />
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.primaryBtn, isLoading && styles.primaryBtnDisabled]}
                onPress={handleReset}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.primaryBtnText}>Đặt lại mật khẩu</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            /* Success state */
            <View style={styles.successContainer}>
              <View style={styles.successIconCircle}>
                <Feather name="check-circle" size={48} color={colors.green500} />
              </View>
              <Text style={styles.successTitle}>Thành công!</Text>
              <Text style={styles.successSubtitle}>Mật khẩu của bạn đã được thay đổi.</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.primaryBtn}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.primaryBtnText}>Đăng nhập ngay</Text>
              </TouchableOpacity>
            </View>
          )}
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
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    marginBottom: 8,
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.neutral900,
    marginLeft: 8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.blue50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    alignSelf: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  inputWrapperTop: {
    marginTop: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.neutral900,
  },
  inputWithRightIcon: {
    paddingRight: 4,
  },
  eyeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  strengthBars: {
    flexDirection: 'row',
    width: '100%',
    height: 6,
    gap: 4,
    marginTop: 12,
    backgroundColor: colors.neutral100,
    borderRadius: 99,
    overflow: 'hidden',
  },
  strengthSegment: {
    flex: 1,
    borderRadius: 99,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.green500,
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 4,
    width: '100%',
    textAlign: 'right',
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: colors.orange500,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  primaryBtnDisabled: {
    opacity: 0.7,
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingTop: 32,
  },
  successIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.green50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.neutral900,
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 15,
    color: colors.neutral500,
    textAlign: 'center',
    marginBottom: 32,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { authApi } from '../lib/api/auth';
import { useAuthStore } from '../store/authStore';
import { ApiError } from '../lib/api/client';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();
  const store = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('pass');
  const [isLoading, setIsLoading] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const strengthCount = [hasMinLength, hasUpper, hasLower, hasNumber].filter(Boolean).length;

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const res = await authApi.register(name, email, password);
      const { user, accessToken, refreshToken } = res.data;
      await store.setUser(user, accessToken, refreshToken);
      navigation.navigate('Onboarding');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'EMAIL_EXISTS') {
          Alert.alert('Lỗi đăng ký', 'Email đã được sử dụng.');
        } else {
          Alert.alert('Lỗi đăng ký', error.message);
        }
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
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
            >
              <Feather name="arrow-left" size={24} color={colors.neutral700} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Tạo tài khoản</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Họ tên</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <Feather name="user" size={20} color={colors.neutral400} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Nguyễn Văn A"
                  placeholderTextColor={colors.neutral400}
                  autoCapitalize="words"
                  returnKeyType="next"
                  value={name}
                  onChangeText={setName}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <Feather name="mail" size={20} color={colors.neutral400} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="email@example.com"
                  placeholderTextColor={colors.neutral400}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  value={email}
                  onChangeText={setEmail}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Mật khẩu</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <Feather name="lock" size={20} color={colors.neutral400} />
                </View>
                <TextInput
                  style={[styles.input, styles.inputWithRightIcon]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.neutral400}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  returnKeyType="done"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.neutral400}
                  />
                </TouchableOpacity>
              </View>

              {/* Password strength */}
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBars}>
                  {[0, 1, 2, 3].map((i) => (
                    <View
                      key={i}
                      style={[
                        styles.strengthBar,
                        { backgroundColor: i < strengthCount ? colors.orange500 : colors.neutral200 },
                      ]}
                    />
                  ))}
                </View>
                <View style={styles.strengthHints}>
                  <Text style={[styles.strengthHint, hasMinLength ? styles.hintGood : styles.hintBad]}>
                    <Feather name={hasMinLength ? 'check' : 'x'} size={11} /> 8 ký tự
                  </Text>
                  <Text style={[styles.strengthHint, hasUpper ? styles.hintGood : styles.hintBad]}>
                    <Feather name={hasUpper ? 'check' : 'x'} size={11} /> Chữ hoa
                  </Text>
                  <Text style={[styles.strengthHint, hasLower ? styles.hintGood : styles.hintBad]}>
                    <Feather name={hasLower ? 'check' : 'x'} size={11} /> Chữ thường
                  </Text>
                  <Text style={[styles.strengthHint, hasNumber ? styles.hintGood : styles.hintBad]}>
                    <Feather name={hasNumber ? 'check' : 'x'} size={11} /> Số
                  </Text>
                </View>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.primaryBtn, isLoading && styles.primaryBtnDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.primaryBtnText}>Đăng ký</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>hoặc</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity activeOpacity={0.8} style={styles.socialBtn}>
              <Feather name="globe" size={20} color={colors.neutral700} />
              <Text style={styles.socialBtnText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={styles.socialBtn}>
              <Feather name="smartphone" size={20} color={colors.neutral700} />
              <Text style={styles.socialBtnText}>Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Đã có tài khoản?</Text>
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}> Đăng nhập</Text>
            </TouchableOpacity>
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
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 8,
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
  form: {
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral700,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  inputIcon: {
    paddingLeft: 12,
    paddingRight: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 16,
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
  strengthContainer: {
    marginTop: 6,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 4,
    height: 6,
    marginBottom: 8,
  },
  strengthBar: {
    flex: 1,
    borderRadius: 99,
  },
  strengthHints: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  strengthHint: {
    fontSize: 12,
  },
  hintGood: {
    color: colors.green500,
  },
  hintBad: {
    color: colors.red500,
  },
  primaryBtn: {
    backgroundColor: colors.orange500,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnDisabled: {
    opacity: 0.7,
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.neutral200,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: colors.neutral400,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 16,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral200,
  },
  socialBtnText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.neutral700,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 32,
  },
  loginText: {
    color: colors.neutral600,
    fontSize: 15,
  },
  loginLink: {
    color: colors.orange500,
    fontWeight: '500',
    fontSize: 15,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
import { ApiError } from '../lib/api/client';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function ForgotPasswordScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      // Always show success state regardless — API returns 200 even if email not found
      setSent(true);
    } catch (error) {
      if (error instanceof ApiError) {
        // Still show success to avoid email enumeration, but surface real network errors
        setSent(true);
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
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Feather name="arrow-left" size={24} color={colors.neutral700} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quên mật khẩu</Text>
        </View>

        {/* Body */}
        <View style={styles.body}>
          {/* Icon circle */}
          <View style={styles.iconCircle}>
            <Feather
              name={sent ? 'mail' : 'lock'}
              size={40}
              color={colors.orange500}
            />
          </View>

          {!sent ? (
            <>
              <Text style={styles.title}>Tìm lại mật khẩu</Text>
              <Text style={styles.subtitle}>
                Nhập email bạn đã đăng ký để nhận liên kết đặt lại mật khẩu.
              </Text>

              <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                  <Feather name="mail" size={20} color={colors.neutral400} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="lan@email.com"
                  placeholderTextColor={colors.neutral400}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  value={email}
                  onChangeText={setEmail}
                  editable={!isLoading}
                />
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.primaryBtn, isLoading && styles.primaryBtnDisabled]}
                onPress={handleSend}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.primaryBtnText}>Gửi liên kết</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.title}>Kiểm tra hộp thư!</Text>
              <Text style={[styles.subtitle, styles.subtitleWide]}>
                Liên kết đặt lại mật khẩu đã được gửi đến email của bạn. Có hiệu lực trong 1 giờ.
              </Text>

              <TouchableOpacity
                activeOpacity={1}
                style={styles.disabledBtn}
                disabled
              >
                <Text style={styles.disabledBtnText}>Gửi lại (58s)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.backToLoginText}>Quay lại đăng nhập</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
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
  body: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.orange50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.neutral900,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.neutral500,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  subtitleWide: {
    paddingHorizontal: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 12,
    backgroundColor: colors.white,
    marginBottom: 24,
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
  primaryBtn: {
    width: '100%',
    backgroundColor: colors.orange500,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryBtnDisabled: {
    opacity: 0.7,
  },
  primaryBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  disabledBtn: {
    width: '100%',
    backgroundColor: colors.neutral100,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledBtnText: {
    color: colors.neutral400,
    fontSize: 16,
    fontWeight: '700',
  },
  backToLoginText: {
    color: colors.orange500,
    fontWeight: '500',
    fontSize: 15,
  },
});

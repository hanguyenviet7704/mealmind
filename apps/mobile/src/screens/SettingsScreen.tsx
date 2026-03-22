import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { useAuthStore } from '../store/authStore';

type SettingsNavProp = NativeStackNavigationProp<ProfileStackParamList, 'Settings'>;

const STORAGE_KEYS = {
  PUSH_ENABLED: '@mealmind/settings/push_enabled',
  BREAKFAST_ENABLED: '@mealmind/settings/breakfast_enabled',
  REMINDER_ENABLED: '@mealmind/settings/reminder_enabled',
};

export function SettingsScreen() {
  const navigation = useNavigation<SettingsNavProp>();
  const { user, logout } = useAuthStore();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [breakfastEnabled, setBreakfastEnabled] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(true);

  // Load persisted toggles on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [push, breakfast, reminder] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.PUSH_ENABLED),
          AsyncStorage.getItem(STORAGE_KEYS.BREAKFAST_ENABLED),
          AsyncStorage.getItem(STORAGE_KEYS.REMINDER_ENABLED),
        ]);
        if (push !== null) setPushEnabled(push === 'true');
        if (breakfast !== null) setBreakfastEnabled(breakfast === 'true');
        if (reminder !== null) setReminderEnabled(reminder === 'true');
      } catch {
        // Ignore storage read errors; keep defaults
      }
    };
    loadSettings();
  }, []);

  const saveSetting = async (key: string, value: boolean) => {
    try {
      await AsyncStorage.setItem(key, String(value));
    } catch {
      // Ignore storage write errors
    }
  };

  const handlePushToggle = (val: boolean) => {
    setPushEnabled(val);
    saveSetting(STORAGE_KEYS.PUSH_ENABLED, val);
  };

  const handleBreakfastToggle = (val: boolean) => {
    setBreakfastEnabled(val);
    saveSetting(STORAGE_KEYS.BREAKFAST_ENABLED, val);
  };

  const handleReminderToggle = (val: boolean) => {
    setReminderEnabled(val);
    saveSetting(STORAGE_KEYS.REMINDER_ENABLED, val);
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất?', '', [
      { text: 'Hủy' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={colors.neutral700} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tài khoản section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tài khoản</Text>
          <View style={styles.card}>
            {/* Đổi mật khẩu */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.row}
              onPress={() => navigation.navigate('ChangePassword')}
            >
              <View style={styles.rowLeft}>
                <Feather name="lock" size={20} color={colors.neutral500} />
                <Text style={styles.rowLabel}>Đổi mật khẩu</Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.neutral300} />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Email */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.atIcon}>@</Text>
                <Text style={styles.rowLabel}>{user?.email ?? ''}</Text>
              </View>
              <Text style={styles.valueText}>Đã xác minh</Text>
            </View>

            <View style={styles.divider} />

            {/* Google */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.iconText}>G</Text>
                <Text style={styles.rowLabel}>Google</Text>
              </View>
              <Text style={styles.valueHighlight}>Đã liên kết</Text>
            </View>

            <View style={styles.divider} />

            {/* Apple */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.iconEmoji}></Text>
                <Text style={styles.rowLabel}>Apple</Text>
              </View>
              <Text style={styles.valueText}>Chưa liên kết</Text>
            </View>
          </View>
        </View>

        {/* Thông báo section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông báo</Text>
          <View style={styles.card}>
            {/* Push Notifications */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Feather name="bell" size={20} color={colors.neutral500} />
                <Text style={styles.rowLabel}>Push Notifications</Text>
              </View>
              <Switch
                value={pushEnabled}
                onValueChange={handlePushToggle}
                trackColor={{ false: colors.neutral300, true: colors.orange500 }}
                thumbColor={colors.white}
              />
            </View>

            <View style={styles.divider} />

            {/* Breakfast suggestion */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.iconEmoji}>🍳</Text>
                <Text style={styles.rowLabel}>Gợi ý bữa sáng (07:00)</Text>
              </View>
              <Switch
                value={breakfastEnabled}
                onValueChange={handleBreakfastToggle}
                trackColor={{ false: colors.neutral300, true: colors.orange500 }}
                thumbColor={colors.white}
              />
            </View>

            <View style={styles.divider} />

            {/* Menu reminder */}
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.iconEmoji}>📅</Text>
                <Text style={styles.rowLabel}>Nhắc tạo thực đơn</Text>
              </View>
              <Switch
                value={reminderEnabled}
                onValueChange={handleReminderToggle}
                trackColor={{ false: colors.neutral300, true: colors.orange500 }}
                thumbColor={colors.white}
              />
            </View>
          </View>
        </View>

        {/* Ứng dụng section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ứng dụng</Text>
          <View style={styles.card}>
            {/* Language */}
            <TouchableOpacity activeOpacity={0.8} style={styles.row}>
              <View style={styles.rowLeft}>
                <Feather name="globe" size={20} color={colors.neutral500} />
                <Text style={styles.rowLabel}>Ngôn ngữ</Text>
              </View>
              <View style={styles.rowRight}>
                <Text style={styles.valueText}>Tiếng Việt</Text>
                <Feather name="chevron-right" size={18} color={colors.neutral300} />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Terms */}
            <TouchableOpacity activeOpacity={0.8} style={styles.row}>
              <View style={styles.rowLeft}>
                <Feather name="file-text" size={20} color={colors.neutral500} />
                <Text style={styles.rowLabel}>Điều khoản dịch vụ</Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.neutral300} />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Privacy */}
            <TouchableOpacity activeOpacity={0.8} style={styles.row}>
              <View style={styles.rowLeft}>
                <Feather name="shield" size={20} color={colors.neutral500} />
                <Text style={styles.rowLabel}>Chính sách bảo mật</Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.neutral300} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleDanger}>Nguy hiểm</Text>
          <View style={styles.cardDanger}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.row}
              onPress={() => navigation.navigate('DeleteAccount')}
            >
              <View style={styles.rowLeft}>
                <Feather name="trash-2" size={20} color={colors.red500} />
                <Text style={styles.rowLabelDanger}>Xóa tài khoản</Text>
              </View>
              <Feather name="chevron-right" size={18} color="#fca5a5" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <Feather name="log-out" size={20} color={colors.red500} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        {/* Version info */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>MealMind v1.0.0</Text>
          <Text style={styles.copyrightText}>© 2026 MealMind. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral50,
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
    padding: 16,
    paddingBottom: 48,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral500,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionTitleDanger: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.red500,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral200,
    overflow: 'hidden',
  },
  cardDanger: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fee2e2',
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral100,
    marginLeft: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.neutral900,
  },
  rowLabelDanger: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.red500,
  },
  valueText: {
    fontSize: 14,
    color: colors.neutral400,
  },
  valueHighlight: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16a34a',
  },
  atIcon: {
    width: 20,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral500,
  },
  iconText: {
    width: 20,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral500,
  },
  iconEmoji: {
    width: 20,
    textAlign: 'center',
    fontSize: 18,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fee2e2',
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.red500,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  versionText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral900,
  },
  copyrightText: {
    fontSize: 12,
    color: colors.neutral400,
    marginTop: 4,
  },
});

import React, { useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Image, StyleSheet,
  Alert, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../lib/api/auth';

type Nav = NativeStackNavigationProp<ProfileStackParamList, 'Profile'>;

export function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const store = useAuthStore();
  const user = store.user;

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await authApi.getMe();
      store.updateUser(res.data);
    } catch {
      // Silently ignore refresh errors
    } finally {
      setRefreshing(false);
    }
  }, [store]);

  const handleLogout = () => {
    Alert.alert('Đăng xuất?', '', [
      { text: 'Hủy' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: () => store.logout(),
      },
    ]);
  };

  const tierLabel = user?.tier === 'pro' ? 'PRO' : 'FREE';

  const menuItems = [
    {
      icon: <Text style={{ fontSize: 20 }}>🍜</Text>,
      title: 'Khẩu vị & Dị ứng',
      desc: 'Bắc, Nam · Không dị ứng',
      onPress: () => navigation.navigate('Dietary'),
    },
    {
      icon: <Feather name="activity" size={20} color={colors.blue500} />,
      title: 'Mục tiêu dinh dưỡng',
      desc: '2,000kcal · 120g Đạm',
      onPress: () => navigation.navigate('NutritionGoals'),
    },
    {
      icon: <Feather name="heart" size={20} color={colors.red500} />,
      title: 'Món yêu thích',
      desc: '12 món',
      onPress: () => navigation.navigate('CookingHistory'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cá nhân</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate('CookingHistory')}
            style={styles.headerButton}
          >
            <Feather name="activity" size={20} color={colors.neutral600} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notification')}
            style={styles.headerButton}
          >
            <Feather name="bell" size={20} color={colors.neutral600} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
              <Image
                source={
                  user?.avatarUrl
                    ? { uri: user.avatarUrl }
                    : { uri: 'https://images.unsplash.com/photo-1643816831186-b2427a8f9f2d?w=200&q=80' }
                }
                style={styles.avatar}
              />
            </TouchableOpacity>
            <View style={styles.profileInfo}>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditProfile')}
                style={styles.nameRow}
              >
                <Text style={styles.profileName}>{user?.name ?? '...'}</Text>
                <View style={styles.freeBadge}>
                  <Text style={styles.freeBadgeText}>{tierLabel}</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.profileEmail}>{user?.email ?? ''}</Text>
            </View>
          </View>

          {/* Family */}
          <View style={styles.familyRow}>
            <View style={styles.familyAvatars}>
              {[
                { emoji: '👩', bg: colors.orange100, zIndex: 3 },
                { emoji: '👦', bg: colors.blue100, zIndex: 2 },
                { emoji: '👧', bg: colors.pink100, zIndex: 1 },
              ].map((m, i) => (
                <View
                  key={i}
                  style={[
                    styles.familyAvatar,
                    { backgroundColor: m.bg, zIndex: m.zIndex, marginLeft: i === 0 ? 0 : -12 },
                  ]}
                >
                  <Text>{m.emoji}</Text>
                </View>
              ))}
              <View style={[styles.familyAvatar, styles.familyAvatarAdd, { marginLeft: -12, zIndex: 0 }]}>
                <Text style={styles.familyAvatarAddText}>+</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Family')}
              style={styles.manageButton}
            >
              <Text style={styles.manageButtonText}>Quản lý</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              onPress={item.onPress}
              style={styles.menuItem}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuIconContainer}>{item.icon}</View>
                <View>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemDesc}>{item.desc}</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color={colors.neutral300} />
            </TouchableOpacity>
          ))}

          {/* Pro Banner */}
          <TouchableOpacity
            onPress={() => navigation.navigate('UpgradePro')}
            style={styles.proBanner}
            activeOpacity={0.85}
          >
            <View style={styles.proBannerContent}>
              <View>
                <View style={styles.proTitleRow}>
                  <Feather name="star" size={18} color={colors.white} />
                  <Text style={styles.proTitle}>Nâng cấp Pro</Text>
                </View>
                <Text style={styles.proSubtitle}>Mở khóa tính năng dinh dưỡng, thực đơn</Text>
              </View>
              <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.8)" />
            </View>
          </TouchableOpacity>

          {/* Settings / Logout */}
          <View style={styles.secondaryActions}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Settings')}
              style={styles.secondaryButton}
              activeOpacity={0.7}
            >
              <Feather name="settings" size={20} color={colors.neutral400} />
              <Text style={styles.secondaryButtonText}>Cài đặt ứng dụng</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.secondaryButton}
              activeOpacity={0.7}
            >
              <Feather name="log-out" size={20} color={colors.red500} />
              <Text style={[styles.secondaryButtonText, { color: colors.red500 }]}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.version}>MealMind v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.neutral50 },
  scroll: { flex: 1 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: colors.neutral900 },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerButton: {
    padding: 8,
    backgroundColor: colors.neutral50,
    borderRadius: 20,
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.red500,
    borderWidth: 1.5,
    borderColor: colors.white,
  },

  profileCard: { backgroundColor: colors.white, padding: 20, marginBottom: 8 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.orange100,
  },
  profileInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  profileName: { fontSize: 20, fontWeight: '700', color: colors.neutral900 },
  freeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: colors.neutral100,
    borderRadius: 4,
  },
  freeBadgeText: { fontSize: 10, fontWeight: '700', color: colors.neutral500, letterSpacing: 0.5 },
  profileEmail: { fontSize: 13, color: colors.neutral500 },

  familyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  familyAvatars: { flexDirection: 'row', alignItems: 'center' },
  familyAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  familyAvatarAdd: {
    backgroundColor: colors.neutral100,
    borderStyle: 'dashed',
    borderColor: colors.neutral300,
  },
  familyAvatarAddText: { fontSize: 14, color: colors.neutral400 },
  manageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.orange50,
    borderRadius: 8,
  },
  manageButtonText: { fontSize: 13, fontWeight: '500', color: colors.primary },

  menuSection: { paddingHorizontal: 16, paddingTop: 16, gap: 12 },
  menuItem: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemTitle: { fontSize: 15, fontWeight: '700', color: colors.neutral900 },
  menuItemDesc: { fontSize: 12, color: colors.neutral500, marginTop: 2 },

  proBanner: {
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
  proBannerContent: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  proTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  proTitle: { fontSize: 17, fontWeight: '700', color: colors.white },
  proSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },

  secondaryActions: { marginTop: 20, gap: 4 },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  secondaryButtonText: { fontSize: 15, fontWeight: '500', color: colors.neutral700 },

  version: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.neutral400,
    marginTop: 16,
    marginBottom: 24,
  },
});

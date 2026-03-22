import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type UpgradeProNavProp = NativeStackNavigationProp<ProfileStackParamList, 'UpgradePro'>;

type PlanType = 'month' | 'year';

const features: string[] = [
  'Không giới hạn gợi ý món ăn mỗi ngày',
  'Theo dõi dinh dưỡng chi tiết (Macro & Micro)',
  'Bộ lọc chế độ ăn nâng cao (Keto, Vegan...)',
  'Tạo đến 10 profile gia đình (Thay vì 3)',
  'Hoàn toàn không có quảng cáo',
  'Xuất PDF danh sách mua sắm & thực đơn',
];

export function UpgradeProScreen() {
  const navigation = useNavigation<UpgradeProNavProp>();
  const [plan, setPlan] = useState<PlanType>('year');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroSection}>
          <View style={styles.starCircle}>
            <Feather name="star" size={48} color={colors.white} />
          </View>
          <Text style={styles.heroTitle}>MealMind Pro</Text>
          <Text style={styles.heroSubtitle}>
            Nâng tầm trải nghiệm nấu ăn với các tính năng cao cấp nhất.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          {features.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.checkCircle}>
                <Feather name="check" size={12} color="#4ade80" />
              </View>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        {/* Plan selector */}
        <View style={styles.plansSection}>
          {/* Month plan */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.planCard, plan === 'month' && styles.planCardActive]}
            onPress={() => setPlan('month')}
          >
            <View style={styles.planLeft}>
              <View style={[styles.radioOuter, plan === 'month' && styles.radioOuterActive]}>
                {plan === 'month' && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.planName}>1 Tháng</Text>
            </View>
            <Text style={styles.planPrice}>79,000đ</Text>
          </TouchableOpacity>

          {/* Year plan */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.planCard, plan === 'year' && styles.planCardActive]}
            onPress={() => setPlan('year')}
          >
            {/* Badge */}
            <View style={styles.savingsBadge}>
              <Text style={styles.savingsBadgeText}>Tiết kiệm 37%</Text>
            </View>
            <View style={styles.planLeft}>
              <View style={[styles.radioOuter, plan === 'year' && styles.radioOuterActive]}>
                {plan === 'year' && <View style={styles.radioInner} />}
              </View>
              <View>
                <Text style={styles.planName}>1 Năm</Text>
                <Text style={styles.planSubtitle}>49,000đ/tháng</Text>
              </View>
            </View>
            <Text style={styles.planPrice}>590,000đ</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <TouchableOpacity activeOpacity={0.8} style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>⭐ Đăng ký Pro</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={styles.restoreButton}>
          <Text style={styles.restoreButtonText}>Khôi phục giao dịch</Text>
        </TouchableOpacity>
        <Text style={styles.legalText}>
          Tự động gia hạn. Hủy bất kỳ lúc nào trong cài đặt App Store/Google Play.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 4,
    marginLeft: -4,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 160,
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
    alignItems: 'center',
  },
  starCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.orange500,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: 'rgba(245, 158, 11, 0.4)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#a3a3a3',
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 280,
  },
  featuresSection: {
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 40,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  featureText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#e5e5e5',
    flex: 1,
    lineHeight: 22,
  },
  plansSection: {
    paddingHorizontal: 24,
    gap: 12,
  },
  planCard: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#404040',
    backgroundColor: 'rgba(38, 38, 38, 0.5)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planCardActive: {
    borderColor: colors.orange500,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
  },
  savingsBadge: {
    position: 'absolute',
    top: -12,
    right: 16,
    backgroundColor: colors.orange500,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  savingsBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
  },
  planLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#525252',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: colors.orange500,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.orange500,
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  planSubtitle: {
    fontSize: 14,
    color: '#a3a3a3',
    marginTop: 2,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    backgroundColor: '#171717',
    gap: 12,
  },
  ctaButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: colors.orange500,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: 'rgba(249, 115, 22, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6,
  },
  ctaButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  restoreButton: {
    alignItems: 'center',
  },
  restoreButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#a3a3a3',
  },
  legalText: {
    fontSize: 10,
    color: '#525252',
    textAlign: 'center',
    lineHeight: 14,
  },
});

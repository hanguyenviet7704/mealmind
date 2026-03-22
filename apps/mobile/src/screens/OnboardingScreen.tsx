import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { useAuthStore } from '../store/authStore';
import { onboardingApi } from '../lib/api/onboarding';
import { ApiError } from '../lib/api/client';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ─── Step state refs (lifted to main component via callbacks) ─────────────────

// Step 1: Cuisine Region
function Step1({
  onDataChange,
}: {
  onDataChange: (data: { cuisinePreferences: string[] }) => void;
}) {
  const regions = [
    { id: 'mb', title: 'Miền Bắc', desc: 'Phở, bún chả, nem', icon: '🍜' },
    { id: 'mt', title: 'Miền Trung', desc: 'Bún bò, mì Quảng', icon: '🥘' },
    { id: 'mn', title: 'Miền Nam', desc: 'Cơm tấm, hủ tiếu', icon: '🍛' },
    { id: 'qt', title: 'Quốc tế', desc: 'Nhật, Hàn, Âu', icon: '🍣' },
  ];
  const [selected, setSelected] = useState<string[]>(['mb', 'mn']);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      onDataChange({ cuisinePreferences: next });
      return next;
    });
  };

  useEffect(() => {
    onDataChange({ cuisinePreferences: selected });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={stepStyles.container}>
      <Text style={stepStyles.title}>Bạn thích ẩm thực vùng nào?</Text>
      <Text style={stepStyles.subtitle}>
        Chọn các món bạn thường ăn để gợi ý chuẩn hơn.
      </Text>

      <View style={s1Styles.grid}>
        {regions.map((r) => {
          const isSel = selected.includes(r.id);
          return (
            <TouchableOpacity
              key={r.id}
              activeOpacity={0.8}
              onPress={() => toggle(r.id)}
              style={[
                s1Styles.card,
                isSel ? s1Styles.cardSelected : s1Styles.cardDefault,
              ]}
            >
              {isSel && (
                <View style={s1Styles.checkBadge}>
                  <Feather name="check" size={12} color={colors.white} />
                </View>
              )}
              <Text style={s1Styles.cardIcon}>{r.icon}</Text>
              <Text
                style={[
                  s1Styles.cardTitle,
                  isSel ? s1Styles.cardTitleSelected : s1Styles.cardTitleDefault,
                ]}
              >
                {r.title}
              </Text>
              <Text
                style={[
                  s1Styles.cardDesc,
                  isSel ? s1Styles.cardDescSelected : s1Styles.cardDescDefault,
                ]}
              >
                {r.desc}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Step 2: Taste Preferences ────────────────────────────────────────────────

const TASTE_LEVELS = ['1', '2', '3', '4', '5'];

function TasteRow({
  icon,
  label,
  value,
  emoji,
  onChange,
}: {
  icon: string;
  label: string;
  value: number;
  emoji: string;
  onChange: (val: number) => void;
}) {
  return (
    <View style={s2Styles.row}>
      <View style={s2Styles.rowHeader}>
        <Text style={s2Styles.rowLabel}>
          {icon} {label}
        </Text>
        <Text style={s2Styles.rowEmoji}>{emoji}</Text>
      </View>

      <View style={s2Styles.levelRow}>
        {TASTE_LEVELS.map((lvl, i) => {
          const active = i + 1 === value;
          return (
            <TouchableOpacity
              key={lvl}
              activeOpacity={0.8}
              onPress={() => onChange(i + 1)}
              style={[s2Styles.levelBtn, active && s2Styles.levelBtnActive]}
            >
              <Text
                style={[
                  s2Styles.levelBtnText,
                  active && s2Styles.levelBtnTextActive,
                ]}
              >
                {lvl}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function Step2({
  onDataChange,
}: {
  onDataChange: (data: { spiceLevel: number; sweetLevel: number; saltyLevel: number }) => void;
}) {
  const [spice, setSpice] = useState(3);
  const [sweet, setSweet] = useState(2);
  const [salty, setSalty] = useState(4);

  const notify = (s: number, sw: number, sa: number) => {
    onDataChange({ spiceLevel: s, sweetLevel: sw, saltyLevel: sa });
  };

  useEffect(() => {
    onDataChange({ spiceLevel: spice, sweetLevel: sweet, saltyLevel: salty });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={stepStyles.container}>
      <Text style={stepStyles.title}>Khẩu vị của bạn?</Text>
      <Text style={stepStyles.subtitle}>
        Điều chỉnh mức độ gia vị theo sở thích.
      </Text>

      <View style={s2Styles.list}>
        <TasteRow
          icon="🌶️"
          label="Cay"
          value={spice}
          emoji="😊"
          onChange={(v) => { setSpice(v); notify(v, sweet, salty); }}
        />
        <TasteRow
          icon="🍬"
          label="Ngọt"
          value={sweet}
          emoji="🙂"
          onChange={(v) => { setSweet(v); notify(spice, v, salty); }}
        />
        <TasteRow
          icon="🧂"
          label="Mặn"
          value={salty}
          emoji="😅"
          onChange={(v) => { setSalty(v); notify(spice, sweet, v); }}
        />
      </View>
    </View>
  );
}

// ─── Step 3: Allergens ────────────────────────────────────────────────────────

function Step3({
  onDataChange,
}: {
  onDataChange: (data: { allergens: string[] }) => void;
}) {
  const allergens = [
    { icon: '🦐', label: 'Hải sản' },
    { icon: '🐟', label: 'Cá' },
    { icon: '🥜', label: 'Đậu phộng' },
    { icon: '🌾', label: 'Gluten' },
    { icon: '🥛', label: 'Sữa' },
    { icon: '🥚', label: 'Trứng' },
    { icon: '🫘', label: 'Đậu nành' },
    { icon: '🌰', label: 'Hạt cây' },
  ];
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (label: string) => {
    setSelected((prev) => {
      const next = prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label];
      onDataChange({ allergens: next });
      return next;
    });
  };

  useEffect(() => {
    onDataChange({ allergens: selected });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={stepStyles.container}>
      <Text style={stepStyles.title}>Dị ứng thực phẩm?</Text>
      <Text style={stepStyles.subtitle}>
        Bỏ qua nếu bạn không bị dị ứng gì.
      </Text>

      <View style={s3Styles.grid}>
        {allergens.map((a) => {
          const isSel = selected.includes(a.label);
          return (
            <TouchableOpacity
              key={a.label}
              activeOpacity={0.8}
              onPress={() => toggle(a.label)}
              style={[
                s3Styles.allergenBtn,
                isSel && s3Styles.allergenBtnSelected,
              ]}
            >
              <Text style={s3Styles.allergenIcon}>{a.icon}</Text>
              <Text
                style={[
                  s3Styles.allergenLabel,
                  isSel && s3Styles.allergenLabelSelected,
                ]}
              >
                {a.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={s3Styles.customInput}>
        <Text style={s3Styles.customLabel}>Thêm nguyên liệu khác:</Text>
        <TextInput
          style={s3Styles.textInput}
          placeholder="+ Thêm nguyên liệu..."
          placeholderTextColor={colors.neutral400}
          returnKeyType="done"
        />
      </View>
    </View>
  );
}

// ─── Step 4: Dietary Preference ───────────────────────────────────────────────

function Step4({
  onDataChange,
}: {
  onDataChange: (data: { dietType: string }) => void;
}) {
  const diets = [
    { id: 'normal', label: 'Bình thường', desc: 'Không giới hạn thực phẩm' },
    { id: 'vegetarian', label: 'Chay (trứng+sữa)', desc: 'Không thịt cá. Có ăn trứng, sữa' },
    { id: 'vegan', label: 'Thuần chay (Vegan)', desc: 'Không dùng sản phẩm động vật' },
    { id: 'keto', label: 'Keto', desc: '< 20g carb/ngày' },
  ];
  const [selected, setSelected] = useState('normal');

  useEffect(() => {
    onDataChange({ dietType: selected });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={stepStyles.container}>
      <Text style={stepStyles.title}>Chế độ ăn đặc biệt?</Text>
      <Text style={[stepStyles.subtitle, { marginBottom: 24 }]} />

      <View style={s4Styles.list}>
        {diets.map((d) => {
          const isSel = selected === d.id;
          return (
            <TouchableOpacity
              key={d.id}
              activeOpacity={0.8}
              onPress={() => {
                setSelected(d.id);
                onDataChange({ dietType: d.id });
              }}
              style={[s4Styles.dietCard, isSel && s4Styles.dietCardSelected]}
            >
              <View
                style={[
                  s4Styles.radioOuter,
                  isSel ? s4Styles.radioOuterSelected : s4Styles.radioOuterDefault,
                ]}
              >
                {isSel && <View style={s4Styles.radioInner} />}
              </View>
              <View style={s4Styles.dietText}>
                <Text
                  style={[
                    s4Styles.dietLabel,
                    isSel && s4Styles.dietLabelSelected,
                  ]}
                >
                  {d.label}
                </Text>
                <Text
                  style={[
                    s4Styles.dietDesc,
                    isSel && s4Styles.dietDescSelected,
                  ]}
                >
                  {d.desc}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Step 5: Cooking Habits ───────────────────────────────────────────────────

function Step5({
  onDataChange,
}: {
  onDataChange: (data: {
    cookTimePreference: string;
    familySize: number;
    cookingLevel: string;
  }) => void;
}) {
  const cookTimes = ['<15p', '15-30p', '30-60p', '>60p'];
  const cookLevels = [
    { label: 'Mới bắt đầu', icon: '🔰', value: 'beginner' },
    { label: 'Cơ bản', icon: '👨‍🍳', value: 'intermediate' },
    { label: 'Thành thạo', icon: '⭐', value: 'advanced' },
  ];

  const [selectedTime, setSelectedTime] = useState(1);
  const [members, setMembers] = useState(4);
  const [selectedLevel, setSelectedLevel] = useState(1);

  const notify = (timeIdx: number, fam: number, levelIdx: number) => {
    onDataChange({
      cookTimePreference: cookTimes[timeIdx],
      familySize: fam,
      cookingLevel: cookLevels[levelIdx].value,
    });
  };

  useEffect(() => {
    notify(selectedTime, members, selectedLevel);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={stepStyles.container}>
      <Text style={stepStyles.title}>Thói quen nấu ăn?</Text>
      <Text style={[stepStyles.subtitle, { marginBottom: 24 }]} />

      <View style={s5Styles.section}>
        <Text style={s5Styles.sectionLabel}>Thời gian nấu tối đa mỗi bữa:</Text>
        <View style={s5Styles.btnRow}>
          {cookTimes.map((t, i) => (
            <TouchableOpacity
              key={t}
              activeOpacity={0.8}
              onPress={() => { setSelectedTime(i); notify(i, members, selectedLevel); }}
              style={[
                s5Styles.timeBtn,
                selectedTime === i && s5Styles.timeBtnActive,
              ]}
            >
              <Text
                style={[
                  s5Styles.timeBtnText,
                  selectedTime === i && s5Styles.timeBtnTextActive,
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={s5Styles.section}>
        <Text style={s5Styles.sectionLabel}>Gia đình bạn có mấy người?</Text>
        <View style={s5Styles.counterRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              const v = Math.max(1, members - 1);
              setMembers(v);
              notify(selectedTime, v, selectedLevel);
            }}
            style={s5Styles.counterBtn}
          >
            <Text style={s5Styles.counterBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={s5Styles.counterValue}>{members}</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              const v = members + 1;
              setMembers(v);
              notify(selectedTime, v, selectedLevel);
            }}
            style={[s5Styles.counterBtn, s5Styles.counterBtnPlus]}
          >
            <Text style={[s5Styles.counterBtnText, s5Styles.counterBtnPlusText]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={s5Styles.section}>
        <Text style={s5Styles.sectionLabel}>Trình độ nấu nướng:</Text>
        <View style={s5Styles.levelRow}>
          {cookLevels.map((lvl, i) => {
            const active = selectedLevel === i;
            return (
              <TouchableOpacity
                key={lvl.label}
                activeOpacity={0.8}
                onPress={() => { setSelectedLevel(i); notify(selectedTime, members, i); }}
                style={[s5Styles.levelCard, active && s5Styles.levelCardActive]}
              >
                <Text style={s5Styles.levelIcon}>{lvl.icon}</Text>
                <Text
                  style={[
                    s5Styles.levelLabel,
                    active && s5Styles.levelLabelActive,
                  ]}
                >
                  {lvl.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

// ─── Main OnboardingScreen ────────────────────────────────────────────────────

type AllAnswers = {
  cuisinePreferences: string[];
  spiceLevel: number;
  sweetLevel: number;
  saltyLevel: number;
  allergens: string[];
  dietType: string;
  cookTimePreference: string;
  familySize: number;
  cookingLevel: string;
};

export function OnboardingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const store = useAuthStore();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Accumulate answers across steps
  const answersRef = useRef<AllAnswers>({
    cuisinePreferences: ['mb', 'mn'],
    spiceLevel: 3,
    sweetLevel: 2,
    saltyLevel: 4,
    allergens: [],
    dietType: 'normal',
    cookTimePreference: '15-30p',
    familySize: 4,
    cookingLevel: 'intermediate',
  });

  // Load progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const res = await onboardingApi.getProgress();
        if (res.data && res.data.lastStep > 0 && res.data.lastStep < 5) {
          setStep(res.data.lastStep + 1);
        }
      } catch {
        // If progress load fails, start from step 1
      }
    };
    loadProgress();
  }, []);

  const mergeAnswers = (partial: Partial<AllAnswers>) => {
    answersRef.current = { ...answersRef.current, ...partial };
  };

  const handleNext = async () => {
    if (saving) return;
    setSaving(true);

    try {
      // Auto-save current step
      await onboardingApi.saveStep(step, answersRef.current as Record<string, unknown>);

      if (step < 5) {
        setStep(step + 1);
      } else {
        // Final step — submit full quiz
        const res = await onboardingApi.submitQuiz(answersRef.current);
        if (res.data) {
          store.updateUser({ onboardingCompleted: true });
          navigation.replace('Main');
        }
      }
    } catch (err) {
      if (err instanceof ApiError) {
        Alert.alert('Lỗi', err.message);
      } else {
        // On save error, still allow advancing (graceful degradation)
        if (step < 5) {
          setStep(step + 1);
        } else {
          store.updateUser({ onboardingCompleted: true });
          navigation.replace('Main');
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    store.updateUser({ onboardingCompleted: true });
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View
              key={i}
              style={[
                styles.progressSegment,
                { backgroundColor: i <= step ? colors.orange500 : colors.neutral200 },
              ]}
            />
          ))}
        </View>
        <Text style={styles.progressLabel}>{step}/5</Text>
      </View>

      {/* Step Content */}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {step === 1 && (
          <Step1 onDataChange={(d) => mergeAnswers(d)} />
        )}
        {step === 2 && (
          <Step2 onDataChange={(d) => mergeAnswers(d)} />
        )}
        {step === 3 && (
          <Step3 onDataChange={(d) => mergeAnswers(d)} />
        )}
        {step === 4 && (
          <Step4 onDataChange={(d) => mergeAnswers(d)} />
        )}
        {step === 5 && (
          <Step5 onDataChange={(d) => mergeAnswers(d)} />
        )}
      </ScrollView>

      {/* Bottom navigation */}
      <View style={styles.footer}>
        <TouchableOpacity activeOpacity={0.8} onPress={handleSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>Bỏ qua</Text>
        </TouchableOpacity>

        <View style={styles.navBtns}>
          {step > 1 && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setStep(step - 1)}
              style={styles.prevBtn}
            >
              <Feather name="chevron-left" size={24} color={colors.neutral600} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleNext}
            disabled={saving}
            style={[styles.nextBtn, saving && styles.nextBtnDisabled]}
          >
            {saving ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <>
                <Text style={styles.nextBtnText}>
                  {step === 5 ? 'Hoàn thành' : 'Tiếp tục'}
                </Text>
                <Feather name="chevron-right" size={20} color={colors.white} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Shared step styles ───────────────────────────────────────────────────────

const stepStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.neutral900,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.neutral500,
    marginBottom: 24,
    lineHeight: 22,
  },
});

// ─── Step 1 styles ────────────────────────────────────────────────────────────

const s1Styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    width: '47%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    position: 'relative',
  },
  cardDefault: {
    borderColor: colors.neutral100,
    backgroundColor: colors.white,
  },
  cardSelected: {
    borderColor: colors.orange500,
    backgroundColor: colors.orange50,
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.orange500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 4,
    textAlign: 'center',
  },
  cardTitleDefault: {
    color: colors.neutral800,
  },
  cardTitleSelected: {
    color: colors.orange700,
  },
  cardDesc: {
    fontSize: 12,
    textAlign: 'center',
  },
  cardDescDefault: {
    color: colors.neutral500,
  },
  cardDescSelected: {
    color: colors.orange500,
  },
});

// ─── Step 2 styles ────────────────────────────────────────────────────────────

const s2Styles = StyleSheet.create({
  list: {
    gap: 28,
  },
  row: {
    gap: 12,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    fontWeight: '700',
    fontSize: 16,
    color: colors.neutral800,
  },
  rowEmoji: {
    fontSize: 24,
  },
  levelRow: {
    flexDirection: 'row',
    gap: 8,
  },
  levelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.neutral200,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  levelBtnActive: {
    borderColor: colors.orange500,
    backgroundColor: colors.orange50,
  },
  levelBtnText: {
    fontWeight: '600',
    fontSize: 14,
    color: colors.neutral600,
  },
  levelBtnTextActive: {
    color: colors.orange700,
  },
});

// ─── Step 3 styles ────────────────────────────────────────────────────────────

const s3Styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  allergenBtn: {
    width: '30%',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral200,
    backgroundColor: colors.white,
    alignItems: 'center',
    gap: 4,
  },
  allergenBtnSelected: {
    borderColor: colors.orange500,
    backgroundColor: colors.orange50,
  },
  allergenIcon: {
    fontSize: 24,
  },
  allergenLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.neutral700,
  },
  allergenLabelSelected: {
    color: colors.orange700,
  },
  customInput: {
    marginTop: 8,
  },
  customLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral700,
    marginBottom: 8,
  },
  textInput: {
    width: '100%',
    backgroundColor: colors.neutral100,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.neutral900,
  },
});

// ─── Step 4 styles ────────────────────────────────────────────────────────────

const s4Styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  dietCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral100,
    backgroundColor: colors.white,
  },
  dietCardSelected: {
    borderColor: colors.orange500,
    backgroundColor: colors.orange50,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioOuterDefault: {
    borderColor: colors.neutral300,
  },
  radioOuterSelected: {
    borderColor: colors.orange500,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.orange500,
  },
  dietText: {
    flex: 1,
  },
  dietLabel: {
    fontWeight: '700',
    fontSize: 15,
    color: colors.neutral800,
  },
  dietLabelSelected: {
    color: colors.orange900,
  },
  dietDesc: {
    fontSize: 13,
    color: colors.neutral500,
    marginTop: 2,
  },
  dietDescSelected: {
    color: colors.orange700,
  },
});

// ─── Step 5 styles ────────────────────────────────────────────────────────────

const s5Styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral700,
    marginBottom: 12,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  timeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral200,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  timeBtnActive: {
    borderColor: colors.orange500,
    backgroundColor: colors.orange50,
  },
  timeBtnText: {
    fontWeight: '600',
    fontSize: 13,
    color: colors.neutral600,
  },
  timeBtnTextActive: {
    color: colors.orange700,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  counterBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnPlus: {
    borderColor: colors.orange500,
    backgroundColor: colors.orange50,
  },
  counterBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.neutral500,
  },
  counterBtnPlusText: {
    color: colors.orange500,
  },
  counterValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.neutral900,
    width: 40,
    textAlign: 'center',
  },
  levelRow: {
    flexDirection: 'row',
    gap: 12,
  },
  levelCard: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral100,
    backgroundColor: colors.white,
  },
  levelCardActive: {
    borderColor: colors.orange500,
    backgroundColor: colors.orange50,
  },
  levelIcon: {
    fontSize: 24,
  },
  levelLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral600,
    textAlign: 'center',
  },
  levelLabelActive: {
    color: colors.orange700,
  },
});

// ─── Main screen styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  progressTrack: {
    flexDirection: 'row',
    height: 6,
    gap: 4,
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressSegment: {
    flex: 1,
    borderRadius: 99,
  },
  progressLabel: {
    textAlign: 'right',
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral400,
    marginTop: 8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.neutral100,
    backgroundColor: colors.white,
  },
  skipBtn: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.neutral500,
  },
  navBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  prevBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: colors.orange500,
    gap: 8,
  },
  nextBtnDisabled: {
    opacity: 0.6,
  },
  nextBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});

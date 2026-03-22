import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RecipesStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { recipesApi } from '../lib/api/recipes';
import { suggestionsApi } from '../lib/api/suggestions';
import { ApiError } from '../lib/api/client';
import type { CookingStep } from '../lib/api/recipes';

type CookingModeNavProp = NativeStackNavigationProp<RecipesStackParamList, 'CookingMode'>;
type CookingModeRouteProp = RouteProp<RecipesStackParamList, 'CookingMode'>;

const SCREEN_WIDTH = Dimensions.get('window').width;

export function CookingModeScreen() {
  const navigation = useNavigation<CookingModeNavProp>();
  const route = useRoute<CookingModeRouteProp>();
  const { id } = route.params;

  const [steps, setSteps] = useState<CookingStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [cookRecorded, setCookRecorded] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await recipesApi.getDetail(String(id));
        const sorted = [...res.data.steps].sort((a, b) => a.order - b.order);
        setSteps(sorted);
        setTimeLeft(sorted[0]?.timerSeconds ?? 0);
      } catch (err) {
        if (err instanceof ApiError) {
          Alert.alert('Lỗi', err.message);
        } else {
          Alert.alert('Lỗi', 'Không thể kết nối máy chủ. Vui lòng thử lại.');
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Reset timer whenever step changes
  useEffect(() => {
    if (steps.length === 0) return;
    const currentStep = steps[stepIndex];
    setTimeLeft(currentStep?.timerSeconds ?? 0);
    setTimerActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [stepIndex, steps]);

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerActive, timeLeft]);

  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleNext = async () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else if (!cookRecorded) {
      // Last step finished — record cook interaction
      setCookRecorded(true);
      try {
        await suggestionsApi.recordInteractions([
          {
            recipeId: String(id),
            action: 'cook',
            context: { source: 'cooking_mode' },
            timestamp: new Date().toISOString(),
          },
        ]);
      } catch {
        // Silently ignore interaction recording errors
      }
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  const handleResetTimer = () => {
    const currentStep = steps[stepIndex];
    setTimeLeft(currentStep?.timerSeconds ?? 0);
    setTimerActive(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.orange500} />
      </View>
    );
  }

  if (steps.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyText}>Không có bước nấu nào.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.exitFallback}>
          <Text style={styles.exitFallbackText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentStep = steps[stepIndex];
  const totalSteps = steps.length;
  const stepNumber = stepIndex + 1;
  const hasTimer = (currentStep.timerSeconds ?? 0) > 0;
  const initialTimer = currentStep.timerSeconds ?? 0;

  const progressWidth = `${((stepNumber / totalSteps) * 100).toFixed(1)}%`;
  const timerProgressWidth = initialTimer > 0
    ? `${((1 - timeLeft / initialTimer) * 100).toFixed(1)}%`
    : '0%';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          style={styles.exitButton}
        >
          <Feather name="x" size={24} color={colors.neutral400} />
          <Text style={styles.exitText}>Thoát</Text>
        </TouchableOpacity>

        <Text style={styles.stepIndicator}>
          BƯỚC {stepNumber}/{totalSteps}
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: progressWidth as any }]} />
      </View>

      {/* Step content */}
      <View style={styles.stepContent}>
        {/* Step image */}
        {currentStep.imageUrl ? (
          <View style={styles.stepImageWrapper}>
            <Image
              source={{ uri: currentStep.imageUrl }}
              style={styles.stepImage}
              resizeMode="cover"
            />
            <View style={styles.stepImageOverlay} />
          </View>
        ) : (
          <View style={[styles.stepImageWrapper, styles.stepImagePlaceholder]}>
            <Feather name="book-open" size={40} color="rgba(255,255,255,0.3)" />
          </View>
        )}

        {/* Step instruction */}
        <Text style={styles.stepInstruction}>{currentStep.description}</Text>

        {/* Timer card — only shown if step has a timer */}
        {hasTimer && (
          <View style={styles.timerCard}>
            {timerActive && (
              <View style={[styles.timerProgress, { width: timerProgressWidth as any }]} />
            )}

            <Text style={[styles.timerDisplay, timeLeft === 0 && styles.timerDisplayDone]}>
              {formatTime(timeLeft)}
            </Text>

            {timeLeft === 0 ? (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleResetTimer}
                style={styles.buttonDone}
              >
                <Text style={styles.buttonDoneText}>✅ Đã xong (Lặp lại)</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setTimerActive(!timerActive)}
                style={[styles.buttonTimer, timerActive && styles.buttonTimerPaused]}
              >
                <Feather
                  name={timerActive ? 'pause' : 'play'}
                  size={24}
                  color={colors.white}
                />
                <Text style={styles.buttonTimerText}>
                  {timerActive ? 'Tạm dừng' : 'Bắt đầu timer'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Footer navigation */}
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePrev}
          disabled={stepIndex === 0}
          style={[styles.navButton, styles.navButtonPrev, stepIndex === 0 && styles.navButtonDisabled]}
        >
          <Feather name="chevron-left" size={24} color={colors.white} />
          <Text style={styles.navButtonText}>Trước</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleNext}
          style={[
            styles.navButton,
            styles.navButtonNext,
            stepIndex === totalSteps - 1 && cookRecorded && styles.navButtonDisabled,
          ]}
        >
          <Text style={[styles.navButtonText, styles.navButtonNextText]}>
            {stepIndex === totalSteps - 1 ? 'Hoàn thành' : 'Tiếp'}
          </Text>
          <Feather name="chevron-right" size={24} color={colors.black} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#171717',
  },
  emptyText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 16,
  },
  exitFallback: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.orange500,
    borderRadius: 12,
  },
  exitFallbackText: {
    color: colors.white,
    fontWeight: '600',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exitText: {
    fontSize: 16,
    color: colors.neutral400,
  },
  stepIndicator: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.orange500,
  },
  headerSpacer: {
    width: 64,
  },

  // Progress bar
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.orange500,
  },

  // Step content area
  stepContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },

  // Step image
  stepImageWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.neutral800,
    marginBottom: 32,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  stepImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepImage: {
    width: '100%',
    height: '100%',
  },
  stepImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  // Instruction text
  stepInstruction: {
    fontSize: 22,
    fontWeight: '500',
    lineHeight: 34,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 32,
  },

  // Timer card
  timerCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  timerProgress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 4,
    backgroundColor: colors.orange500,
  },
  timerDisplay: {
    fontFamily: 'monospace',
    fontSize: 64,
    fontWeight: '300',
    letterSpacing: -2,
    color: colors.white,
    marginBottom: 24,
  },
  timerDisplayDone: {
    color: '#f87171',
  },
  buttonDone: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDoneText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.black,
  },
  buttonTimer: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: colors.orange500,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonTimerPaused: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  buttonTimerText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 16,
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  navButtonPrev: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  navButtonNext: {
    backgroundColor: colors.white,
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  navButtonNextText: {
    color: colors.black,
  },
});

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { suggestionsApi, SuggestionCard } from '../lib/api/suggestions';
import { ApiError } from '../lib/api/client';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export function SurpriseScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<SuggestionCard | null>(null);

  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const bounceLoop = useRef<Animated.CompositeAnimation | null>(null);
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  const startBounce = useCallback(() => {
    bounceLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -12, duration: 400, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ])
    );
    bounceLoop.current.start();
  }, [bounceAnim]);

  const startPulse = useCallback(() => {
    pulseLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    pulseLoop.current.start();
  }, [pulseAnim]);

  const stopAnimations = useCallback(() => {
    bounceLoop.current?.stop();
    pulseLoop.current?.stop();
  }, []);

  const revealCard = useCallback(() => {
    scaleAnim.setValue(0.5);
    opacityAnim.setValue(0);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        damping: 15,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  const fetchSurprise = useCallback(async () => {
    setCard(null);
    setLoading(true);
    startBounce();
    startPulse();
    try {
      const res = await suggestionsApi.getSurprise();
      stopAnimations();
      setCard(res.data);
      setLoading(false);
      revealCard();
      // Record view interaction
      await suggestionsApi.recordInteractions([
        {
          recipeId: res.data.recipe.id,
          action: 'view',
          suggestionId: res.data.id,
          context: { source: 'surprise' },
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      stopAnimations();
      setLoading(false);
      if (error instanceof ApiError) {
        Alert.alert('Không thể tải gợi ý', error.message);
      } else {
        Alert.alert('Không thể tải gợi ý', 'Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    }
  }, [startBounce, startPulse, stopAnimations, revealCard]);

  useEffect(() => {
    fetchSurprise();
    return () => {
      stopAnimations();
    };
  }, []);

  const handleRetry = useCallback(() => {
    fetchSurprise();
  }, [fetchSurprise]);

  const handleSave = useCallback(async () => {
    if (!card) return;
    try {
      await suggestionsApi.recordInteractions([
        {
          recipeId: card.recipe.id,
          action: 'save',
          suggestionId: card.id,
          context: { source: 'surprise' },
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch {
      // Fire and forget
    }
    navigation.navigate('RecipeDetail' as never, { id: card.recipe.id } as never);
  }, [card, navigation]);

  const handleSkip = useCallback(async () => {
    if (!card) return;
    try {
      await suggestionsApi.recordInteractions([
        {
          recipeId: card.recipe.id,
          action: 'skip',
          suggestionId: card.id,
          context: { source: 'surprise' },
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch {
      // Fire and forget
    }
    handleRetry();
  }, [card, handleRetry]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Feather name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Surprise Me! 🎲</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Center content */}
      <View style={styles.body}>
        {loading ? (
          <View style={styles.spinningContainer}>
            <Animated.Text
              style={[styles.spinEmoji, { transform: [{ translateY: bounceAnim }] }]}
            >
              🎰
            </Animated.Text>
            <Animated.Text
              style={[styles.spinText, { transform: [{ scale: pulseAnim }] }]}
            >
              Đang tìm món ngon...
            </Animated.Text>
          </View>
        ) : card ? (
          <Animated.View
            style={[
              styles.cardWrapper,
              { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            <View style={styles.card}>
              {/* Image area */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: card.recipe.imageUrl }}
                  style={styles.cardImage}
                />
                <View style={styles.imageOverlay}>
                  <Text style={styles.recipeName}>{card.recipe.name}</Text>
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Feather name="clock" size={14} color="rgba(255,255,255,0.9)" />
                      <Text style={styles.metaText}>{card.recipe.cookTime}p</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Feather name="zap" size={14} color="rgba(255,255,255,0.9)" />
                      <Text style={styles.metaText}>{card.recipe.calories}kcal</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Card body */}
              <View style={styles.cardBody}>
                <View style={styles.badgeRow}>
                  {card.recipe.cuisine ? (
                    <View style={styles.badgeNorth}>
                      <Text style={styles.badgeNorthText}>
                        {card.recipe.cuisine.toUpperCase()}
                      </Text>
                    </View>
                  ) : null}
                  {card.tags?.slice(0, 2).map((tag) => (
                    <View key={tag} style={styles.badgeMed}>
                      <Text style={styles.badgeMedText}>{tag.toUpperCase()}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.tipBox}>
                  <Text style={styles.tipIcon}>💡</Text>
                  <Text style={styles.tipText}>{card.reason}</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        ) : (
          <View style={styles.spinningContainer}>
            <ActivityIndicator size="large" color={colors.orange500} />
          </View>
        )}
      </View>

      {/* Bottom buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={loading}
          onPress={handleSave}
          style={[styles.primaryBtn, loading && styles.disabledBtn]}
        >
          <Text style={styles.primaryBtnText}>🍳 Nấu món này!</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={loading}
          onPress={handleSkip}
          style={[styles.secondaryBtn, loading && styles.disabledBtn]}
        >
          <Text style={styles.secondaryBtnText}>🎲 Thử lại</Text>
        </TouchableOpacity>

        <Text style={styles.hintText}>Shake phone để thử lại! 📱</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral900,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
  },
  headerSpacer: {
    width: 32,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  spinningContainer: {
    alignItems: 'center',
  },
  spinEmoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  spinText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.orange500,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 360,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  imageContainer: {
    height: 240,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  recipeName: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
  },
  cardBody: {
    padding: 20,
    backgroundColor: colors.white,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  badgeNorth: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.orange100,
    borderRadius: 8,
  },
  badgeNorthText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.orange900,
  },
  badgeMed: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.green50,
    borderRadius: 8,
  },
  badgeMedText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.green700,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.orange50,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.orange100,
  },
  tipIcon: {
    fontSize: 18,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: colors.orange900,
    lineHeight: 19,
  },
  footer: {
    padding: 24,
    paddingTop: 0,
    gap: 12,
  },
  primaryBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
  },
  secondaryBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  hintText: {
    textAlign: 'center',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
});

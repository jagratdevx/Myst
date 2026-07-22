import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { AnimatedScreenWrapper } from '../ui/AnimatedScreenWrapper';
import { GlassCard } from '../ui/GlassCard';
import { useTheme } from '../../hooks/useTheme';
import { useFlashcardStore } from '../../store/useFlashcardStore';
import { Flashcard } from '../../types/flashcard';
import { ChevronLeft, FlipHorizontal, ArrowRight, RefreshCw } from 'lucide-react-native';
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withTiming, interpolate, Easing } from 'react-native-reanimated';

type RouteParams = { deckId: string };

export const FlashcardStudyScreen = () => {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const navigation = useNavigation();
  const { deckId } = route.params;
  const { colors } = useTheme();
  const { cards, fetchData } = useFlashcardStore();
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const rotate = useSharedValue(0);

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const deckCards = cards.filter(c => c.deckId === deckId);
    setStudyCards(deckCards.sort(() => Math.random() - 0.5));
  }, [cards, deckId]);

  const current = studyCards[currentIndex];

  const frontStyle = useAnimatedStyle(() => {
    const r = interpolate(rotate.value, [0, 180], [0, 180]);
    return { transform: [{ perspective: 1000 }, { rotateY: `${r}deg` }], backfaceVisibility: 'hidden' as const };
  });

  const backStyle = useAnimatedStyle(() => {
    const r = interpolate(rotate.value, [0, 180], [180, 360]);
    return { transform: [{ perspective: 1000 }, { rotateY: `${r}deg` }], backfaceVisibility: 'hidden' as const, position: 'absolute' as const, top: 0, left: 0, right: 0 };
  });

  const handleFlip = () => {
    rotate.value = withTiming(flipped ? 0 : 180, { duration: 500, easing: Easing.inOut(Easing.ease) });
    setFlipped(!flipped);
  };

  const handleNext = () => {
    if (currentIndex < studyCards.length - 1) {
      rotate.value = withTiming(0, { duration: 0 });
      setFlipped(false);
      setCurrentIndex(i => i + 1);
    }
  };

  const handleRestart = () => {
    setStudyCards(c => [...c].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    rotate.value = withTiming(0, { duration: 0 });
    setFlipped(false);
  };

  if (studyCards.length === 0) {
    return (
      <AnimatedScreenWrapper>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Study</Text>
        </View>
        <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 60 }} />
      </AnimatedScreenWrapper>
    );
  }

  return (
    <AnimatedScreenWrapper>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Study</Text>
        <Text style={[styles.progress, { color: colors.textSecondary }]}>
          {currentIndex + 1} / {studyCards.length}
        </Text>
      </View>

      <View style={styles.cardContainer}>
        <Animated.View style={[styles.cardWrapper, frontStyle]}>
          <GlassCard style={styles.card}>
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Question</Text>
            <Text style={[styles.cardText, { color: colors.textPrimary }]}>{current.front}</Text>
          </GlassCard>
        </Animated.View>

        <Animated.View style={[styles.cardWrapper, backStyle]}>
          <GlassCard style={styles.card}>
            <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Answer</Text>
            <Text style={[styles.cardText, { color: colors.accent }]}>{current.back}</Text>
            {current.hints && (
              <Text style={[styles.hintText, { color: colors.warning }]}>💡 {current.hints}</Text>
            )}
          </GlassCard>
        </Animated.View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: `${colors.accentSecondary}20` }]} onPress={handleFlip} activeOpacity={0.7}>
          <FlipHorizontal size={22} color={colors.accentSecondary} />
          <Text style={[styles.actionLabel, { color: colors.accentSecondary }]}>Flip</Text>
        </TouchableOpacity>

        {currentIndex < studyCards.length - 1 ? (
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: `${colors.accent}20` }]} onPress={handleNext} activeOpacity={0.7}>
            <Text style={[styles.actionLabel, { color: colors.accent }]}>Next</Text>
            <ArrowRight size={22} color={colors.accent} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: `${colors.success}20` }]} onPress={handleRestart} activeOpacity={0.7}>
            <RefreshCw size={22} color={colors.success} />
            <Text style={[styles.actionLabel, { color: colors.success }]}>Restart</Text>
          </TouchableOpacity>
        )}
      </View>
    </AnimatedScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16 },
  backBtn: { padding: 8, marginRight: 8 },
  headerTitle: { fontSize: 20, fontWeight: '800', flex: 1 },
  progress: { fontSize: 14, fontWeight: '600' },
  cardContainer: { flex: 1, marginHorizontal: 16, justifyContent: 'center', alignItems: 'center' },
  cardWrapper: { width: '100%' },
  card: { padding: 32, minHeight: 280, justifyContent: 'center', alignItems: 'center' },
  cardLabel: { fontSize: 12, fontWeight: '600', marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase' },
  cardText: { fontSize: 22, fontWeight: '700', textAlign: 'center', lineHeight: 32 },
  hintText: { fontSize: 14, fontWeight: '500', marginTop: 16, textAlign: 'center' },
  actions: { flexDirection: 'row', justifyContent: 'center', gap: 24, paddingBottom: 40, paddingHorizontal: 16 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, borderRadius: 16, gap: 8, flex: 1, justifyContent: 'center' },
  actionLabel: { fontSize: 16, fontWeight: '700' },
});

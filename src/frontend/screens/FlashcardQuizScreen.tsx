import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { AnimatedScreenWrapper } from '../ui/AnimatedScreenWrapper';
import { GlassCard } from '../ui/GlassCard';
import { useTheme } from '../../hooks/useTheme';
import { useFlashcardStore } from '../../store/useFlashcardStore';
import { Flashcard } from '../../types/flashcard';
import { ChevronLeft, Check, X, RotateCcw } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

type RouteParams = { deckId: string };

export const FlashcardQuizScreen = () => {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const navigation = useNavigation();
  const { deckId } = route.params;
  const { colors } = useTheme();
  const { cards, updateCardReview } = useFlashcardStore();
  const [quizCards, setQuizCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const deckCards = cards.filter(c => c.deckId === deckId && c.nextReview <= Date.now());
    if (deckCards.length === 0) {
      setQuizCards(cards.filter(c => c.deckId === deckId).sort(() => Math.random() - 0.5).slice(0, 10));
    } else {
      setQuizCards(deckCards.sort(() => Math.random() - 0.5));
    }
  }, [cards, deckId]);

  const current = quizCards[currentIndex];

  const handleAnswer = useCallback(async (quality: number) => {
    if (!current) return;
    await updateCardReview(current.id, quality);
    if (quality >= 3) setCorrect(c => c + 1);
    else setIncorrect(c => c + 1);
    setFlipped(false);
    if (currentIndex + 1 >= quizCards.length) {
      setFinished(true);
    } else {
      setCurrentIndex(i => i + 1);
    }
  }, [current, currentIndex, quizCards.length, updateCardReview]);

  const restart = () => {
    setCurrentIndex(0);
    setFlipped(false);
    setCorrect(0);
    setIncorrect(0);
    setFinished(false);
    setQuizCards(cards.filter(c => c.deckId === deckId).sort(() => Math.random() - 0.5).slice(0, 10));
  };

  if (quizCards.length === 0) {
    return (
      <AnimatedScreenWrapper>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ChevronLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Quiz</Text>
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
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Quiz</Text>
        {!finished && (
          <Text style={[styles.progress, { color: colors.textSecondary }]}>
            {currentIndex + 1} / {quizCards.length}
          </Text>
        )}
      </View>

      {finished ? (
        <View style={styles.finishedContainer}>
          <Text style={[styles.finishedTitle, { color: colors.textPrimary }]}>Quiz Complete!</Text>
          <GlassCard style={styles.resultCard}>
            <View style={[styles.resultRow, { backgroundColor: `${colors.success}15` }]}>
              <Check size={20} color={colors.success} />
              <Text style={[styles.resultText, { color: colors.success }]}>{correct} correct</Text>
            </View>
            <View style={[styles.resultRow, { backgroundColor: `${colors.error}15` }]}>
              <X size={20} color={colors.error} />
              <Text style={[styles.resultText, { color: colors.error }]}>{incorrect} incorrect</Text>
            </View>
            <Text style={[styles.resultPct, { color: colors.textPrimary }]}>
              {Math.round((correct / (correct + incorrect)) * 100)}% accuracy
            </Text>
          </GlassCard>
          <TouchableOpacity style={[styles.restartBtn, { backgroundColor: colors.accent }]} onPress={restart}>
            <RotateCcw size={20} color="#fff" />
            <Text style={styles.restartText}>Study Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.quizContainer}>
          <Animated.View key={currentIndex} entering={FadeIn} style={{ flex: 1 }}>
            <TouchableOpacity style={styles.cardArea} onPress={() => setFlipped(!flipped)} activeOpacity={0.9}>
              <GlassCard style={styles.flashcard}>
                <Text style={[styles.tapHint, { color: colors.textSecondary }]}>Tap to {flipped ? 'see question' : 'reveal answer'}</Text>
                <Text style={[styles.cardText, { color: colors.textPrimary }]}>
                  {flipped ? current.back : current.front}
                </Text>
                {flipped && current.hints && (
                  <Text style={[styles.hintText, { color: colors.warning }]}>💡 {current.hints}</Text>
                )}
              </GlassCard>
            </TouchableOpacity>
          </Animated.View>

          {flipped && (
            <Animated.View entering={FadeIn} style={styles.actionRow}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: `${colors.error}20` }]} onPress={() => handleAnswer(1)}>
                <X size={28} color={colors.error} />
                <Text style={[styles.actionLabel, { color: colors.error }]}>Hard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: `${colors.warning}20` }]} onPress={() => handleAnswer(3)}>
                <Text style={{ fontSize: 24 }}>🤔</Text>
                <Text style={[styles.actionLabel, { color: colors.warning }]}>Okay</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: `${colors.success}20` }]} onPress={() => handleAnswer(5)}>
                <Check size={28} color={colors.success} />
                <Text style={[styles.actionLabel, { color: colors.success }]}>Easy</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      )}
    </AnimatedScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16 },
  backBtn: { padding: 8, marginRight: 8 },
  headerTitle: { fontSize: 20, fontWeight: '800', flex: 1 },
  progress: { fontSize: 14, fontWeight: '600' },
  quizContainer: { flex: 1, paddingHorizontal: 16, justifyContent: 'center' },
  cardArea: { flex: 1, justifyContent: 'center' },
  flashcard: { padding: 32, minHeight: 280, justifyContent: 'center', alignItems: 'center' },
  tapHint: { fontSize: 12, fontWeight: '500', marginBottom: 16 },
  cardText: { fontSize: 20, fontWeight: '700', textAlign: 'center', lineHeight: 28 },
  hintText: { fontSize: 14, fontWeight: '500', marginTop: 16, textAlign: 'center' },
  actionRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 40 },
  actionBtn: { alignItems: 'center', justifyContent: 'center', width: 80, height: 80, borderRadius: 40, gap: 4 },
  actionLabel: { fontSize: 12, fontWeight: '700' },
  finishedContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  finishedTitle: { fontSize: 28, fontWeight: '800', marginBottom: 24 },
  resultCard: { padding: 24, width: '100%', marginBottom: 24 },
  resultRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 8, gap: 8 },
  resultText: { fontSize: 16, fontWeight: '700' },
  resultPct: { fontSize: 24, fontWeight: '800', textAlign: 'center', marginTop: 8 },
  restartBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14, gap: 8 },
  restartText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
